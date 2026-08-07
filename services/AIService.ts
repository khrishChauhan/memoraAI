import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';

export type AIRecommendationCategory = 'Career' | 'Organization' | 'Storage' | 'Productivity' | 'Academic' | 'Media';

export interface AIRecommendation {
  id: number;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reason: string;
  category: AIRecommendationCategory;
  action: 'Review' | 'Delete' | 'Archive' | 'Ignore';
  affectedFiles: string[];
  estimatedStorageSavedMB?: number | null;
}

export interface AIAnalysisResult {
  summary: string;
  healthScore: number;
  recommendations: AIRecommendation[];
}

type NormalizedFile = {
  uri: string;
  name: string;
  extension: string | null;
  size: number;
  lastModified: number;
  category: string;
  duplicate: boolean;
  purpose: string;
  importance: 'High' | 'Medium' | 'Low';
  tags: string[];
  confidence: number;
};

type CachedAIAnalysis = {
  fingerprint: string;
  result: AIAnalysisResult;
};

const CACHE_KEY = 'MEMORA_AI_LATEST_ANALYSIS_V2';
const ONE_MB = 1024 * 1024;
const ONE_DAY = 1000 * 60 * 60 * 24;
const TWO_YEARS_DAYS = 365 * 2;
const LARGE_FILE_BYTES = 100 * ONE_MB;
const LARGE_UNUSED_DAYS = 90;

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

      const deterministicAnalysis = this.buildDeterministicAnalysis(normalizedFiles);
      await this.cacheAnalysis(fingerprint, deterministicAnalysis);
      return deterministicAnalysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return null;
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
        purpose: file.purpose ?? 'Unknown',
        importance: file.importance ?? 'Low',
        tags: Array.isArray(file.tags) ? file.tags : [],
        confidence: typeof file.confidence === 'number' ? file.confidence : Number(file.confidence ?? 0),
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
      purpose: file.purpose,
      importance: file.importance,
      tags: file.tags,
      confidence: file.confidence,
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
      summary: recommendations.length === 0
        ? 'Your storage is well organized.'
        : this.buildSummary(duplicateGroups.length, oldFiles.length, largeUnusedFiles.length, organized),
      healthScore,
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
      return 'Your storage is well organized.';
    }

    return `${parts.join(', ')} need attention.`;
  }

  static buildRecommendations(
    files: NormalizedFile[],
    duplicateGroups: NormalizedFile[][],
    oldFiles: NormalizedFile[],
    largeUnusedFiles: NormalizedFile[],
  ) {
    const recommendations: AIRecommendation[] = [];

    const addRecommendation = (recommendation: AIRecommendation) => {
      const duplicateKey = `${recommendation.category}|${recommendation.title}`;
      if (recommendations.some((existing) => `${existing.category}|${existing.title}` === duplicateKey)) {
        return;
      }
      recommendations.push(recommendation);
    };

    duplicateGroups
      .slice(0, 2)
      .sort((left, right) => this.duplicateGroupSortScore(right) - this.duplicateGroupSortScore(left))
      .forEach((group) => {
        addRecommendation(this.buildDuplicateRecommendation(group));
      });

    const resumeFile = files.find((file) => file.purpose === 'Resume' || file.purpose === 'CV');
    if (resumeFile) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'high',
        title: 'Update Resume',
        description: 'Resume needs a refresh.',
        reason: `${resumeFile.name} was last modified ${this.formatAge(resumeFile.lastModified)}.`,
        category: 'Career',
        action: 'Review',
        affectedFiles: [resumeFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const certificateFile = files.find((file) => file.purpose === 'Certificate');
    if (certificateFile) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'high',
        title: 'Upload Certificate to LinkedIn',
        description: 'Certificate can strengthen your profile.',
        reason: `${certificateFile.name} was classified as a certificate.`,
        category: 'Career',
        action: 'Review',
        affectedFiles: [certificateFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const projectFile = files.find((file) => ['Project', 'Portfolio', 'Hackathon', 'Source Code', 'Mobile App', 'Website'].includes(file.purpose));
    if (projectFile) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'high',
        title: projectFile.purpose === 'Portfolio' ? 'Refresh Portfolio' : 'Add Project to Portfolio',
        description: 'Project looks ready to showcase.',
        reason: `${projectFile.name} matches project-related metadata.`,
        category: 'Career',
        action: 'Review',
        affectedFiles: [projectFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const academicFile = files.find((file) => ['Semester Notes', 'Assignment', 'Research Paper', 'Presentation'].includes(file.purpose));
    if (academicFile) {
      const academicTitle = academicFile.purpose === 'Research Paper'
        ? 'Review Research Paper'
        : academicFile.purpose === 'Assignment'
          ? 'Review Assignment Draft'
          : 'Archive Semester Notes';

      addRecommendation({
        id: recommendations.length + 1,
        priority: 'medium',
        title: academicTitle,
        description: 'Academic material should be organized.',
        reason: `${academicFile.name} is marked as ${academicFile.purpose.toLowerCase()}.`,
        category: 'Academic',
        action: 'Archive',
        affectedFiles: [academicFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const mediaScreenshotFiles = files.filter((file) => file.purpose === 'Screenshots');
    if (mediaScreenshotFiles.length > 0) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'low',
        title: 'Delete Duplicate Screenshots',
        description: 'Screenshots often stack up quickly.',
        reason: `${mediaScreenshotFiles.length} screenshot file${mediaScreenshotFiles.length === 1 ? '' : 's'} were classified as low importance.`,
        category: 'Media',
        action: 'Delete',
        affectedFiles: mediaScreenshotFiles.slice(0, 6).map((file) => file.uri),
        estimatedStorageSavedMB: this.bytesToMB(mediaScreenshotFiles.reduce((total, file) => total + file.size * 0.25, 0)),
      });
    }

    const downloadsFile = files.find((file) => file.purpose === 'Downloads');
    if (downloadsFile) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'low',
        title: 'Organize Downloads',
        description: 'Downloads folder needs sorting.',
        reason: `${downloadsFile.name} was detected in downloads metadata.`,
        category: 'Organization',
        action: 'Archive',
        affectedFiles: [downloadsFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    const largeVideoFiles = files
      .filter((file) => file.purpose === 'Videos' || file.category === 'Videos')
      .filter((file) => file.size >= LARGE_FILE_BYTES)
      .sort((left, right) => right.size - left.size)
      .slice(0, 2);

    if (largeVideoFiles.length > 0) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'high',
        title: 'Compress Large Videos',
        description: 'Large videos detected.',
        reason: `${largeVideoFiles.length} video${largeVideoFiles.length === 1 ? '' : 's'} exceed 100 MB.`,
        category: 'Storage',
        action: 'Review',
        affectedFiles: largeVideoFiles.map((file) => file.uri),
        estimatedStorageSavedMB: this.bytesToMB(largeVideoFiles.reduce((total, file) => total + file.size * 0.3, 0)),
      });
    }

    const largeArchiveFiles = files
      .filter((file) => file.purpose === 'Archive' || file.category === 'Archives')
      .filter((file) => file.size >= LARGE_FILE_BYTES || this.getAgeDays(file) >= 365)
      .sort((left, right) => right.size - left.size)
      .slice(0, 2);

    if (largeArchiveFiles.length > 0) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'medium',
        title: 'Archive Old ZIP Files',
        description: 'Archive files detected.',
        reason: `${largeArchiveFiles.length} archive${largeArchiveFiles.length === 1 ? '' : 's'} are old or oversized.`,
        category: 'Organization',
        action: 'Archive',
        affectedFiles: largeArchiveFiles.map((file) => file.uri),
        estimatedStorageSavedMB: null,
      });
    }

    const unclearFile = files.find((file) => file.purpose === 'Unknown' && file.confidence <= 55);
    if (unclearFile) {
      addRecommendation({
        id: recommendations.length + 1,
        priority: 'low',
        title: 'Rename Unclear Files',
        description: 'File name could be clearer.',
        reason: `${unclearFile.name} has low classification confidence.`,
        category: 'Productivity',
        action: 'Review',
        affectedFiles: [unclearFile.uri],
        estimatedStorageSavedMB: null,
      });
    }

    return recommendations.slice(0, 6);
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

  static buildDuplicateRecommendation(group: NormalizedFile[]): AIRecommendation {
    const names = group.map((file) => file.name.toLowerCase()).join(' ');
    const category = names.includes('screenshot') || names.includes('screen shot') || names.includes('image') || names.includes('photo')
      ? 'Media'
      : names.includes('resume') || names.includes('cv')
        ? 'Career'
        : 'Storage';

    const title = names.includes('screenshot') || names.includes('screen shot')
      ? 'Delete Duplicate Screenshots'
      : names.includes('image') || names.includes('photo')
        ? 'Merge Duplicate Images'
        : names.includes('download')
          ? 'Organize Duplicate Downloads'
          : 'Delete Duplicate Files';

    const savedBytes = group.slice(1).reduce((total, file) => total + file.size, 0);
    return {
      id: 0,
      priority: 'high',
      title,
      description: 'Duplicate files detected.',
      reason: `${group.length} files share the same name and size.`,
      category,
      action: 'Delete',
      affectedFiles: group.map((file) => file.uri),
      estimatedStorageSavedMB: this.bytesToMB(savedBytes),
    };
  }

  static duplicateGroupSortScore(group: NormalizedFile[]) {
    const names = group.map((file) => file.name.toLowerCase()).join(' ');
    if (names.includes('screenshot') || names.includes('screen shot')) return 3;
    if (names.includes('image') || names.includes('photo')) return 2;
    if (names.includes('download')) return 1;
    return 0;
  }

  static isVideoFile(name: string, extension: string | null) {
    const lowerName = name.toLowerCase();
    const ext = extension?.toLowerCase();
    return /(video|movie|clip|screenrecord|screen-record)/i.test(lowerName) || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext ?? '');
  }

  static isArchiveFile(name: string, extension: string | null) {
    const lowerName = name.toLowerCase();
    const ext = extension?.toLowerCase();
    return /(zip|archive|backup|compressed)/i.test(lowerName) || ['zip', 'tar', 'gz', 'rar', '7z'].includes(ext ?? '');
  }

  static findBestMatch(files: NormalizedFile[], pattern: RegExp) {
    return files
      .filter((file) => pattern.test(file.name.toLowerCase()) || pattern.test(file.category.toLowerCase()) || pattern.test(file.purpose.toLowerCase()))
      .sort((left, right) => right.confidence - left.confidence || right.size - left.size || left.name.localeCompare(right.name))[0] ?? null;
  }

  static dedupeRecommendations(recommendations: AIRecommendation[]) {
    const seen = new Set<string>();
    const ordered: AIRecommendation[] = [];

    recommendations
      .map((recommendation, index) => ({ ...recommendation, id: index + 1 }))
      .sort((left, right) => this.priorityRank(left.priority) - this.priorityRank(right.priority) || left.category.localeCompare(right.category) || left.title.localeCompare(right.title))
      .forEach((recommendation) => {
        const key = `${recommendation.category}|${recommendation.title}`;
        if (seen.has(key)) return;
        seen.add(key);
        ordered.push(recommendation);
      });

    return ordered;
  }

  static priorityRank(priority: AIRecommendation['priority']) {
    switch (priority) {
      case 'high': return 0;
      case 'medium': return 1;
      case 'low': return 2;
      default: return 3;
    }
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

