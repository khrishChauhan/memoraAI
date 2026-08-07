import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';

type FileClassification = {
  category: string;
  purpose: string;
  importance: 'High' | 'Medium' | 'Low';
  tags: string[];
  confidence: number;
};

type ClassificationContext = {
  name: string;
  extension: string | null;
  mimeType: string | null;
  uri: string;
  normalizedName: string;
  normalizedFolderPath: string;
};

export class FileScannerService {
  static getCategoryForMimeOrExt(mimeType: string | null, extension: string | null): string {
    const normalizedExt = this.normalizeExtension(extension);
    const mime = mimeType?.toLowerCase();

    if (mime?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'].includes(normalizedExt ?? '')) return 'Images';
    if (mime?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(normalizedExt ?? '')) return 'Videos';
    if (mime?.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'aac'].includes(normalizedExt ?? '')) return 'Audio';

    if (mime?.includes('pdf') || mime?.includes('document') || ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'ppt', 'pptx'].includes(normalizedExt ?? '')) return 'Documents';
    if (mime?.includes('zip') || mime?.includes('tar') || ['zip', 'tar', 'gz', 'rar', '7z'].includes(normalizedExt ?? '')) return 'Archives';
    if (['apk', 'exe', 'dmg', 'app', 'ipa'].includes(normalizedExt ?? '')) return 'Applications';

    return 'Others';
  }

  static classifyFile(name: string, extension: string | null, mimeType: string | null, uri: string): FileClassification {
    const context = this.buildContext(name, extension, mimeType, uri);
    const purpose = this.detectPurpose(context);
    const category = this.getCategoryForMimeOrExt(mimeType, extension);
    const importance = this.detectImportance(purpose, category);
    const tags = this.generateTags(purpose, category, context);
    const confidence = this.calculateConfidence(context, purpose, category);

    return {
      category,
      purpose,
      importance,
      tags,
      confidence,
    };
  }

  static async scanFiles(): Promise<number> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.canceled || !result.assets) {
        return 0;
      }

      let savedCount = 0;

      for (const asset of result.assets) {
        const extMatch = asset.name.match(/(\.[^.]+)$/);
        const extension = extMatch ? extMatch[1] : null;
        const classification = this.classifyFile(asset.name, extension, asset.mimeType || null, asset.uri);

        const newFile: ScannedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: asset.name,
          uri: asset.uri,
          size: asset.size || 0,
          extension,
          mimeType: asset.mimeType || null,
          lastModified: asset.lastModified || Date.now(),
          category: classification.category,
          purpose: classification.purpose,
          importance: classification.importance,
          tags: classification.tags,
          confidence: classification.confidence,
          hash: null,
          isDuplicate: 0,
          createdAt: Date.now(),
        };

        const success = await FilesRepository.saveFile(newFile);
        if (success) savedCount++;
      }

      return savedCount;
    } catch (error) {
      console.error('File scanning error:', error);
      Alert.alert('Scan Failed', 'An error occurred while scanning files.');
      return 0;
    }
  }

  static buildContext(name: string, extension: string | null, mimeType: string | null, uri: string): ClassificationContext {
    return {
      name,
      extension: this.normalizeExtension(extension),
      mimeType: mimeType?.toLowerCase() ?? null,
      uri,
      normalizedName: name.toLowerCase(),
      normalizedFolderPath: this.getFolderPath(uri).toLowerCase(),
    };
  }

  static detectPurpose(context: ClassificationContext): string {
    const name = context.normalizedName;
    const path = context.normalizedFolderPath;

    const matches = (...keywords: string[]) => keywords.some((keyword) => name.includes(keyword) || path.includes(keyword));

    if (matches('resume', 'curriculum')) return 'Resume';
    if (matches('cv')) return 'CV';
    if (matches('certificate', 'cert', 'award', 'achievement', 'completion')) return 'Certificate';
    if (matches('hackathon')) return 'Hackathon';
    if (matches('portfolio')) return 'Portfolio';
    if (matches('project', 'react', 'next', 'node', 'android', 'ios', 'flutter', 'expo', 'python', 'java', 'cpp', 'c++', 'web', 'frontend', 'backend', 'mern')) return 'Project';
    if (matches('invoice', 'bill')) return 'Invoice';
    if (matches('receipt', 'payment', 'bank', 'tax')) return 'Receipt';
    if (matches('research', 'paper', 'journal', 'thesis')) return 'Research Paper';
    if (matches('assignment')) return 'Assignment';
    if (matches('semester', 'notes', 'lab', 'ppt', 'report', 'lecture', 'college', 'university', 'exam')) return 'Semester Notes';
    if (matches('presentation', 'slide', 'deck', 'ppt')) return 'Presentation';
    if (matches('screenshot', 'screen shot')) return 'Screenshots';
    if (matches('download', 'downloads')) return 'Downloads';
    if (matches('image', 'photo', 'camera', 'img', 'whatsapp')) return 'Images';
    if (matches('video', 'recording', 'movie', 'clip')) return 'Videos';
    if (matches('music', 'audio', 'song')) return 'Music';
    if (matches('zip', 'archive', 'backup', 'compressed')) return 'Archive';
    if (matches('dataset', 'data')) return 'Dataset';
    if (matches('figma', 'fig', 'sketch', 'psd', 'adobe xd', 'xd', 'design')) return 'Design File';
    if (matches('apk', 'ipa', 'mobile app', 'android app', 'ios app')) return 'Mobile App';
    if (matches('website', 'web')) return 'Website';
    if (matches('src', 'source', 'code')) return 'Source Code';

    if (context.extension && ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'html', 'css', 'rb', 'go', 'php', 'swift', 'kt', 'rs', 'dart', 'mjs', 'cjs'].includes(context.extension)) {
      return 'Source Code';
    }

    if (context.extension && ['apk', 'ipa', 'app'].includes(context.extension)) return 'Mobile App';
    if (context.extension && ['csv', 'tsv', 'json', 'parquet', 'xlsx', 'xls'].includes(context.extension)) return 'Dataset';
    if (context.extension && ['fig', 'figma', 'sketch', 'psd', 'ai', 'xd'].includes(context.extension)) return 'Design File';

    return 'Unknown';
  }

  static detectImportance(purpose: string, category: string): 'High' | 'Medium' | 'Low' {
    if (['Resume', 'CV', 'Certificate', 'Hackathon', 'Project', 'Portfolio', 'Source Code', 'Mobile App', 'Website', 'Design File'].includes(purpose)) return 'High';
    if (['Invoice', 'Receipt', 'Research Paper', 'Assignment', 'Semester Notes', 'Presentation', 'Dataset'].includes(purpose)) return 'Medium';
    if (purpose === 'Screenshots' || purpose === 'Downloads' || category === 'Images' || category === 'Videos' || category === 'Audio' || category === 'Archives') return 'Low';
    return 'Low';
  }

  static generateTags(purpose: string, category: string, context: ClassificationContext): string[] {
    const tags = new Set<string>();

    const tagMap: Record<string, string[]> = {
      Resume: ['career', 'resume', 'important'],
      CV: ['career', 'resume', 'important'],
      Certificate: ['achievement', 'career'],
      Hackathon: ['career', 'project'],
      Project: ['project', 'portfolio'],
      Portfolio: ['project', 'portfolio', 'career'],
      Invoice: ['finance', 'invoice'],
      Receipt: ['finance', 'receipt'],
      'Research Paper': ['research', 'education'],
      Assignment: ['education', 'assignment'],
      'Semester Notes': ['education', 'notes'],
      Presentation: ['education', 'presentation'],
      Screenshots: ['media', 'screenshots'],
      Downloads: ['organization', 'downloads'],
      Images: ['media', 'images'],
      Videos: ['media', 'videos'],
      Music: ['media', 'audio'],
      Archive: ['storage', 'archive'],
      'Source Code': ['code', 'project'],
      'Mobile App': ['code', 'app'],
      Website: ['web', 'project'],
      Dataset: ['data', 'dataset'],
      'Design File': ['design', 'creative'],
      Unknown: ['uncategorized'],
    };

    (tagMap[purpose] ?? ['uncategorized']).forEach((tag) => tags.add(tag));

    if (category === 'Documents') tags.add('document');
    if (category === 'Images') tags.add('images');
    if (category === 'Videos') tags.add('videos');
    if (category === 'Audio') tags.add('audio');
    if (category === 'Archives') tags.add('archive');
    if (context.normalizedFolderPath.includes('download')) tags.add('downloads');
    if (context.normalizedFolderPath.includes('document')) tags.add('documents');
    if (context.normalizedFolderPath.includes('project')) tags.add('project');

    return [...tags];
  }

  static calculateConfidence(context: ClassificationContext, purpose: string, category: string): number {
    let score = 40;
    const name = context.normalizedName;
    const path = context.normalizedFolderPath;
    const ext = context.extension ?? '';

    const keywordMap: Record<string, string[]> = {
      Resume: ['resume', 'cv', 'curriculum'],
      CV: ['cv', 'curriculum'],
      Certificate: ['certificate', 'cert', 'award', 'achievement', 'completion'],
      Hackathon: ['hackathon'],
      Portfolio: ['portfolio'],
      Project: ['project', 'portfolio', 'react', 'next', 'node', 'android', 'ios', 'flutter', 'expo', 'python', 'java', 'cpp', 'c++', 'web', 'frontend', 'backend', 'mern'],
      Invoice: ['invoice', 'bill'],
      Receipt: ['receipt', 'payment', 'bank', 'tax'],
      'Research Paper': ['research', 'paper', 'journal', 'thesis'],
      Assignment: ['assignment'],
      'Semester Notes': ['semester', 'notes', 'lab', 'ppt', 'report', 'lecture', 'college', 'university', 'exam'],
      Presentation: ['presentation', 'slide', 'deck', 'ppt'],
      Screenshots: ['screenshot', 'screen shot'],
      Downloads: ['download', 'downloads'],
      Images: ['image', 'photo', 'camera', 'img'],
      Videos: ['video', 'recording', 'movie', 'clip'],
      Music: ['music', 'audio', 'song'],
      Archive: ['zip', 'archive', 'backup', 'compressed'],
      'Source Code': ['src', 'source', 'code', 'react', 'next', 'node', 'python', 'java', 'cpp', 'c++', 'html', 'css'],
      'Mobile App': ['apk', 'ipa', 'app'],
      Website: ['website', 'web'],
      Dataset: ['dataset', 'data', 'csv', 'tsv', 'json', 'parquet', 'xlsx', 'xls'],
      'Design File': ['figma', 'fig', 'sketch', 'psd', 'xd', 'design'],
      Unknown: [],
    };

    const purposeKeywords = keywordMap[purpose] ?? [];
    if (purpose !== 'Unknown') score += 25;
    if (purposeKeywords.some((keyword) => name.includes(keyword))) score += 30;

    const extensionMap: Record<string, string[]> = {
      Resume: ['pdf', 'doc', 'docx'],
      CV: ['pdf', 'doc', 'docx'],
      Certificate: ['pdf', 'jpg', 'jpeg', 'png'],
      Hackathon: ['zip', 'pdf', 'md'],
      Portfolio: ['pdf', 'md', 'zip', 'html', 'js', 'ts', 'tsx', 'jsx'],
      Project: ['zip', 'pdf', 'md', 'js', 'ts', 'tsx', 'jsx', 'py', 'java'],
      Invoice: ['pdf', 'jpg', 'jpeg', 'png'],
      Receipt: ['pdf', 'jpg', 'jpeg', 'png'],
      'Research Paper': ['pdf', 'doc', 'docx'],
      Assignment: ['pdf', 'doc', 'docx'],
      'Semester Notes': ['pdf', 'ppt', 'pptx', 'doc', 'docx'],
      Presentation: ['ppt', 'pptx', 'pdf'],
      Screenshots: ['png', 'jpg', 'jpeg', 'heic', 'webp'],
      Downloads: ['zip', 'pdf', 'png', 'jpg', 'mp4', 'mp3'],
      Images: ['jpg', 'jpeg', 'png', 'heic', 'webp'],
      Videos: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      Music: ['mp3', 'wav', 'm4a', 'aac'],
      Archive: ['zip', 'tar', 'gz', 'rar', '7z'],
      'Source Code': ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'html', 'css'],
      'Mobile App': ['apk', 'ipa', 'app'],
      Website: ['html', 'css', 'js', 'jsx', 'tsx'],
      Dataset: ['csv', 'tsv', 'json', 'parquet', 'xlsx', 'xls'],
      'Design File': ['fig', 'figma', 'sketch', 'psd', 'ai', 'xd'],
      Unknown: [],
    };

    if ((extensionMap[purpose] ?? []).includes(ext)) score += 15;
    if (path.includes('download')) score += 8;
    if (path.includes('documents')) score += 6;
    if (path.includes('project')) score += 8;
    if (path.includes('desktop')) score += 4;
    if (purpose !== 'Unknown' && category === 'Documents') score += 5;
    if (purpose !== 'Unknown' && ['Images', 'Videos', 'Audio', 'Archives'].includes(category)) score += 5;

    if (/^(img_|dsc_|screenshot|screen shot|untitled|document\s?\d+|file\d+)/i.test(name)) score -= 10;
    if (purpose === 'Unknown' && !purposeKeywords.some((keyword) => name.includes(keyword)) && !path.includes('download') && !path.includes('project') && !path.includes('documents')) {
      score = 40;
    }

    return this.clamp(score, 40, 98);
  }

  static buildContext(name: string, extension: string | null, mimeType: string | null, uri: string): ClassificationContext {
    return {
      name,
      extension: this.normalizeExtension(extension),
      mimeType: mimeType?.toLowerCase() ?? null,
      uri,
      normalizedName: name.toLowerCase(),
      normalizedFolderPath: this.getFolderPath(uri).toLowerCase(),
    };
  }

  static getFolderPath(uri: string) {
    const cleanUri = decodeURIComponent(uri.replace(/^file:\/\//, ''));
    const segments = cleanUri.split('/').filter(Boolean);
    return segments.length > 1 ? segments.slice(0, -1).join('/') : cleanUri;
  }

  static normalizeExtension(extension: string | null) {
    return extension?.toLowerCase().replace(/^\./, '') ?? null;
  }

  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}