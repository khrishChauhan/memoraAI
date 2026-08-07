import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';

export class FileScannerService {
  
  static getCategoryForMimeOrExt(mimeType: string | null, extension: string | null): string {
    const normalizedExt = extension?.toLowerCase().replace(/^\./, '');
    const mime = mimeType?.toLowerCase();

    if (mime?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'].includes(normalizedExt ?? '')) return 'Images';
    if (mime?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(normalizedExt ?? '')) return 'Videos';
    if (mime?.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'aac'].includes(normalizedExt ?? '')) return 'Audio';
    
    if (mime?.includes('pdf') || mime?.includes('document') || ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(normalizedExt ?? '')) return 'Documents';
    if (mime?.includes('zip') || mime?.includes('tar') || ['zip', 'tar', 'gz', 'rar'].includes(normalizedExt ?? '')) return 'Archives';
    
    if (['apk', 'exe', 'dmg', 'app'].includes(normalizedExt ?? '')) return 'Applications';

    return 'Others';
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
        // Extract extension from name if possible
        const extMatch = asset.name.match(/(\.[^.]+)$/);
        const extension = extMatch ? extMatch[1] : null;

        const category = this.getCategoryForMimeOrExt(asset.mimeType || null, extension);

        const newFile: ScannedFile = {
          id: Math.random().toString(36).substring(2, 9), // Fallback ID generator
          name: asset.name,
          uri: asset.uri,
          size: asset.size || 0,
          extension,
          mimeType: asset.mimeType || null,
          lastModified: asset.lastModified || Date.now(),
          category,
          hash: null, // Placeholder for Phase 3
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
}
