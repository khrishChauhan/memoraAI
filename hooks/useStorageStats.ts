import { useCallback, useEffect, useState } from 'react';
import { FilesRepository } from '../database/repositories/FilesRepository';

export interface StorageStats {
  usedBytes: number;
  totalBytes: number; // For now hardcoded to 128GB like mock
  insights: { id: string; title: string; subtitle: string; type: string }[];
}

export function useStorageStats() {
  const [stats, setStats] = useState<StorageStats>({
    usedBytes: 0,
    totalBytes: 128 * 1024 * 1024 * 1024, // 128 GB
    insights: [],
  });

  const refreshStats = useCallback(async () => {
    const files = await FilesRepository.getAllFiles();

    let totalSize = 0;
    const categoryCounts: Record<string, number> = {};
    let largestFile = files[0] ?? null;

    files.forEach(f => {
      totalSize += f.size;
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
      if (!largestFile || f.size > largestFile.size) {
        largestFile = f;
      }
    });

    const dynamicInsights: StorageStats['insights'] = [];

    if (categoryCounts['Images'] > 0) {
      dynamicInsights.push({ id: 'i1', title: `${categoryCounts['Images']} Images Found`, subtitle: 'Scanned in your library', type: 'info' });
    }
    if (categoryCounts['Videos'] > 0) {
      dynamicInsights.push({ id: 'i2', title: `${categoryCounts['Videos']} Videos Scanned`, subtitle: 'Taking up space', type: 'warning' });
    }
    if (largestFile) {
      dynamicInsights.push({ id: 'i3', title: 'Largest File', subtitle: largestFile.name, type: 'danger' });
    }
    if (dynamicInsights.length === 0) {
      dynamicInsights.push({ id: 'i0', title: 'No files scanned', subtitle: 'Scan files to see insights', type: 'success' });
    }

    setStats({
      usedBytes: totalSize,
      totalBytes: 128 * 1024 * 1024 * 1024,
      insights: dynamicInsights,
    });
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
  };
}
