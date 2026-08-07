import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';

export interface AIAnalysisResult {
  summary: string;
  healthScore: number;
  recommendations: Array<{
    id: number;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: 'Review' | 'Delete' | 'Archive' | 'Ignore';
    affectedFiles: string[];
    estimatedStorageSavedMB?: number | null;
  }>;
}

type NormalizedFile = {
  uri: string;
  name: string;
  extension: string | null;
  size: number;
  lastModified: number;
  category: string;
  duplicate: boolean;
};

type CachedAIAnalysis = {
  fingerprint: string;
  result: AIAnalysisResult;
};

const CACHE_KEY = 'MEMORA_AI_LATEST_ANALYSIS_V2';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ONE_MB = 1024 * 1024;
const ONE_DAY = 1000 * 60 * 60 * 24;
const TWO_YEARS_DAYS = 365 * 2;
const LARGE_FILE_BYTES = 100 * ONE_MB;
const LARGE_UNUSED_DAYS = 90;

const FILE_ANALYSIS_MODEL = 'llama-3.1-8b-instant';

export class AIService {
  static async getCachedAnalysis(): Promise<AIAnalysisResult | null> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEY);
      if (!data) return null;

      const cached = JSON.parse(data) as CachedAIAnalysis;
      return cached.result ?? null;
    } catch {
      return null;
    }
  }

  static async analyzeFiles(): Promise<AIAnalysisResult | null> {
    try {
      const files = await FilesRepository.getAllFiles();
      if (files.length === 0) return null;

      const normalizedFiles = this.normalizeFiles(files);
      const fingerprint = this.buildFingerprint(normalizedFiles);
      const cachedAnalysis = await this.getCachedAnalysisPayload();
      if (cachedAnalysis?.fingerprint === fingerprint) {
        return cachedAnalysis.result;
      }

      const localAnalysis = this.buildDeterministicAnalysis(normalizedFiles);
      const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

      if (!apiKey) {
        await this.cacheAnalysis(fingerprint, localAnalysis);
        return localAnalysis;
      }

      const analysisContext = this.buildAnalysisContext(normalizedFiles, localAnalysis);
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: FILE_ANALYSIS_MODEL,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: JSON.stringify(analysisContext),
            },
          ],
          temperature: 0,
          top_p: 1,
          max_tokens: 700,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API Error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No response from Groq');
      }

      const mergedAnalysis = this.mergeAnalysis(localAnalysis, JSON.parse(content));
      await this.cacheAnalysis(fingerprint, mergedAnalysis);
      return mergedAnalysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);

      try {
        const files = await FilesRepository.getAllFiles();
        if (files.length === 0) return null;

        const normalizedFiles = this.normalizeFiles(files);
        const localAnalysis = this.buildDeterministicAnalysis(normalizedFiles);
        await this.cacheAnalysis(this.buildFingerprint(normalizedFiles), localAnalysis);
        return localAnalysis;
      } catch {
        return null;
      }
    }
  }

  static async getCachedAnalysisPayload(): Promise<CachedAIAnalysis | null> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEY);
      if (!data) return null;

      const cached = JSON.parse(data) as CachedAIAnalysis;
      if (!cached?.fingerprint || !cached?.result) return null;
      return cached;
    } catch {
      return null;
    }
  }

  static async cacheAnalysis(fingerprint: string, result: AIAnalysisResult) {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ fingerprint, result }));
  }

  static normalizeFiles(files: ScannedFile[]): NormalizedFile[] {
    return files
      .map((file) => ({
        uri: file.uri,
        name: file.name.trim(),
        extension: this.normalizeExtension(file.extension),
        size: file.size,
        lastModified: file.lastModified ?? file.createdAt,
        category: file.category,
        duplicate: Boolean(file.isDuplicate),
      }))
      .sort((left, right) => {
        const nameCompare = left.name.localeCompare(right.name);
        if (nameCompare !== 0) return nameCompare;

        const extCompare = (left.extension ?? '').localeCompare(right.extension ?? '');
        if (extCompare !== 0) return extCompare;

        return left.size - right.size;
      });
  }

  static buildFingerprint(files: NormalizedFile[]): string {
    return JSON.stringify(files.map((file) => ({
      name: file.name.toLowerCase(),
      extension: file.extension,
      size: file.size,
      lastModified: file.lastModified,
      category: file.category,
      duplicate: file.duplicate,
    })));
  }

  static buildDeterministicAnalysis(files: NormalizedFile[]): AIAnalysisResult {
    const duplicateGroups = this.findDuplicateGroups(files);
    const oldFiles = files.filter((file) => this.getAgeDays(file) > TWO_YEARS_DAYS);
    const largeUnusedFiles = files.filter((file) => file.size >= LARGE_FILE_BYTES && this.getAgeDays(file) >= LARGE_UNUSED_DAYS);
    const organized = this.isStorageOrganized(files, duplicateGroups.length, oldFiles.length, largeUnusedFiles.length);

    const healthScore = this.clamp(
      100
        - duplicateGroups.length * 5
        - oldFiles.length * 2
        - largeUnusedFiles.length * 3
        + (organized ? 2 : 0),
      0,
      100,
    );

    const recommendations = this.buildRecommendations(files, duplicateGroups, oldFiles, largeUnusedFiles).slice(0, 6);

    return {
      summary: this.buildSummary(duplicateGroups.length, oldFiles.length, largeUnusedFiles.length, organized),
      healthScore,
      recommendations,
    };
  }

  static buildAnalysisContext(files: NormalizedFile[], analysis: AIAnalysisResult) {
    return {
      storageHealthScore: analysis.healthScore,
      fileCount: files.length,
      fileMetadata: files.map((file) => ({
        name: file.name,
        extension: file.extension,
        size: file.size,
        lastModified: file.lastModified,
        category: file.category,
        duplicate: file.duplicate,
      })),
      recommendations: analysis.recommendations.map((recommendation) => ({
        id: recommendation.id,
        priority: recommendation.priority,
        title: recommendation.title,
        description: recommendation.description,
        action: recommendation.action,
        affectedFiles: recommendation.affectedFiles,
        estimatedStorageSavedMB: recommendation.estimatedStorageSavedMB ?? null,
      })),
    };
  }

  static getSystemPrompt() {
    return [
      'You are MemoraAI, a deterministic file analysis engine.',
      'Analyze only the JSON input provided by the user.',
      'Do not invent files, file counts, statistics, or scores.',
      'Do not change the provided storageHealthScore.',
      'Do not add or remove recommendations.',
      'Do not change recommendation titles, actions, affectedFiles, or estimatedStorageSavedMB.',
      'You may only rewrite summary and recommendation descriptions to be concise and factual.',
      'Keep recommendation descriptions under 15 words.',
      'Return valid JSON only with this exact shape: {"summary":"...","recommendations":[...]}.',
    ].join(' ');
  }

  static mergeAnalysis(baseAnalysis: AIAnalysisResult, rawResponse: unknown): AIAnalysisResult {
    const parsed = rawResponse as Partial<AIAnalysisResult>;
    const summary = typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : baseAnalysis.summary;

    const recommendations = baseAnalysis.recommendations.map((baseRecommendation) => {
      const matchedResponse = parsed.recommendations?.find((recommendation) => recommendation.id === baseRecommendation.id || recommendation.title === baseRecommendation.title);
      const description = typeof matchedResponse?.description === 'string' && matchedResponse.description.trim()
        ? matchedResponse.description.trim()
        : baseRecommendation.description;

      return {
        ...baseRecommendation,
        description,
      };
    });

    return {
      summary,
      healthScore: baseAnalysis.healthScore,
      recommendations,
    };
  }

  static buildSummary(duplicateGroupCount: number, oldFileCount: number, largeUnusedCount: number, organized: boolean): string {
    const parts: string[] = [];

    if (duplicateGroupCount > 0) {
      parts.push(`${duplicateGroupCount} duplicate group${duplicateGroupCount === 1 ? '' : 's'}`);
    }

    if (largeUnusedCount > 0) {
      parts.push(`${largeUnusedCount} large unused file${largeUnusedCount === 1 ? '' : 's'}`);
    }

    if (oldFileCount > 0) {
      parts.push(`${oldFileCount} file${oldFileCount === 1 ? '' : 's'} older than two years`);
    }

    if (parts.length === 0) {
      return organized ? 'Storage looks organized and well balanced.' : 'Storage is clean, with a few minor cleanup opportunities.';
    }

    return `${parts.join(', ')} need attention.`;
  }

  static buildRecommendations(
    files: NormalizedFile[],
    duplicateGroups: NormalizedFile[][],
    oldFiles: NormalizedFile[],
    largeUnusedFiles: NormalizedFile[],
  ) {
    const recommendations: AIAnalysisResult['recommendations'] = [];

    duplicateGroups.slice(0, 2).forEach((group) => {
      const representativeName = group[0].name.toLowerCase();
      const title = representativeName.includes('screenshot')
        ? 'Delete Duplicate Screenshots'
        : representativeName.includes('resume') || representativeName.includes('cv')
          ? 'Delete Duplicate Resumes'
          : 'Delete Duplicate Files';

      const savedBytes = group.slice(1).reduce((total, file) => total + file.size, 0);
      recommendations.push({
        id: recommendations.length + 1,
        priority: 'high',
        title,
        description: `${group.length} files share the same name and size.`,
        action: 'Delete',
        affectedFiles: group.map((file) => file.uri),
        estimatedStorageSavedMB: this.bytesToMB(savedBytes),
      });
    });

    largeUnusedFiles
      .sort((left, right) => right.size - left.size)
      .slice(0, 2)
      .forEach((file) => {
        const title = file.category === 'Videos' ? 'Compress Large Videos' : file.category === 'Archives' ? 'Compress ZIP Archive' : 'Review Large File';
        recommendations.push({
          id: recommendations.length + 1,
          priority: 'high',
          title,
          description: `${file.name} is large and older than three months.`,
          action: file.category === 'Archives' ? 'Archive' : 'Review',
          affectedFiles: [file.uri],
          estimatedStorageSavedMB: file.category === 'Videos' ? this.bytesToMB(file.size * 0.3) : null,
        });
      });

    const resumeFile = files.find((file) => /(resume|cv|curriculum)/i.test(file.name) && this.getAgeDays(file) > 180);
    if (resumeFile) {
      recommendations.push({
        id: recommendations.length + 1,
        priority: 'medium',
        title: 'Update Resume',
        description: `Last modified ${this.formatAge(resumeFile.lastModified)}.`,
        action: 'Review',
        affectedFiles: [resumeFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const certificateFile = files.find((file) => /(certificate|cert|transcript|diploma)/i.test(file.name));
    if (certificateFile) {
      recommendations.push({
        id: recommendations.length + 1,
        priority: 'medium',
        title: 'Move Certificates to Folder',
        description: `${certificateFile.name} is easier to find in a dedicated folder.`,
        action: 'Archive',
        affectedFiles: [certificateFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const notesFile = files.find((file) => /(semester|lecture|class notes|study notes|notes)/i.test(file.name) && this.getAgeDays(file) > 120);
    if (notesFile) {
      recommendations.push({
        id: recommendations.length + 1,
        priority: 'low',
        title: 'Archive Semester Notes',
        description: `${notesFile.name} has not changed in months.`,
        action: 'Archive',
        affectedFiles: [notesFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const fallbackLargeArchive = files.find((file) => file.category === 'Archives' && file.size >= 50 * ONE_MB);
    if (fallbackLargeArchive && recommendations.length < 6) {
      recommendations.push({
        id: recommendations.length + 1,
        priority: 'low',
        title: 'Compress ZIP Archive',
        description: `${fallbackLargeArchive.name} is a large compressed file.`,
        action: 'Archive',
        affectedFiles: [fallbackLargeArchive.uri],
        estimatedStorageSavedMB: null,
      });
    }

    return recommendations;
  }

  static findDuplicateGroups(files: NormalizedFile[]) {
    const groupedFiles = new Map<string, NormalizedFile[]>();

    files.forEach((file) => {
      const key = [file.name.toLowerCase(), file.extension ?? '', file.size].join('|');
      const existing = groupedFiles.get(key) ?? [];
      existing.push(file);
      groupedFiles.set(key, existing);
    });

    return [...groupedFiles.values()]
      .filter((group) => group.length > 1)
      .sort((left, right) => right.length - left.length || right[0].size - left[0].size);
  }

  static isStorageOrganized(files: NormalizedFile[], duplicateGroupCount: number, oldFileCount: number, largeUnusedCount: number) {
    if (files.length === 0) return false;

    const otherFiles = files.filter((file) => file.category === 'Others').length;
    const otherRatio = otherFiles / files.length;
    return duplicateGroupCount === 0 && oldFileCount <= Math.max(1, Math.ceil(files.length * 0.15)) && largeUnusedCount <= Math.max(1, Math.ceil(files.length * 0.15)) && otherRatio <= 0.2;
  }

  static getAgeDays(file: NormalizedFile) {
    return Math.floor((Date.now() - file.lastModified) / ONE_DAY);
  }

  static formatAge(timestamp: number) {
    const ageDays = Math.max(0, Math.floor((Date.now() - timestamp) / ONE_DAY));
    if (ageDays >= 365) return `${Math.round(ageDays / 365)} years ago`;
    if (ageDays >= 30) return `${Math.round(ageDays / 30)} months ago`;
    if (ageDays >= 7) return `${Math.round(ageDays / 7)} weeks ago`;
    return `${ageDays} days ago`;
  }

  static normalizeExtension(extension: string | null) {
    if (!extension) return null;
    return extension.toLowerCase().replace(/^\./, '');
  }

  static bytesToMB(bytes: number) {
    return Math.max(0, Math.round((bytes / ONE_MB) * 10) / 10);
  }

  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}

