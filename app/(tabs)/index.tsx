import { ActionButton } from '@/components/ActionButton';
import { InsightCard } from '@/components/InsightCard';
import { SectionHeader } from '@/components/SectionHeader';
import { StorageCard } from '@/components/StorageCard';
import { Colors, Layout, Typography } from '@/constants/theme';
import { FilesRepository, ScannedFile } from '@/database/repositories/FilesRepository';
import { useStorageStats } from '@/hooks/useStorageStats';
import { FileScannerService } from '../../services/FileScannerService';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { stats, refreshStats } = useStorageStats();
  const router = useRouter();
  const [isScanning, setIsScanning] = React.useState(false);
  const [recentFile, setRecentFile] = React.useState<ScannedFile | null>(null);

  useEffect(() => {
    FilesRepository.getAllFiles().then((files) => {
      setRecentFile(files[0] ?? null);
    });
  }, [stats.usedBytes]);

  const handleScanFiles = async () => {
    setIsScanning(true);
    await FileScannerService.scanFiles();
    await refreshStats();
    const files = await FilesRepository.getAllFiles();
    setRecentFile(files[0] ?? null);
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.title}>MemoraAI</Text>
          <Text style={styles.subtitle}>Your digital memory stays organized, searchable, and calm.</Text>
        </Animated.View>

        <StorageCard
          title="Storage Health"
          used={stats.usedBytes / (1024 * 1024 * 1024)}
          total={stats.totalBytes / (1024 * 1024 * 1024)}
        />

        <SectionHeader title="Today's Insights" actionTitle="View AI" onAction={() => router.push('/ai')} />
        <View style={styles.insightsContainer}>
          {stats.insights.map((insight, index) => (
            <InsightCard key={insight.id} index={index} title={insight.title} subtitle={insight.subtitle} type={insight.type as 'info' | 'warning' | 'success' | 'danger'} />
          ))}
        </View>

        <SectionHeader title="Recent Scan" />
        <View style={styles.recentCard}>
          {recentFile ? (
            <>
              <View style={styles.recentTopRow}>
                <View style={styles.recentIcon}>
                  <Feather name="clock" size={18} color={Colors.accent} />
                </View>
                <View style={styles.recentMeta}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{recentFile.name}</Text>
                  <Text style={styles.recentSubtitle}>{recentFile.category} · {Math.max(1, Math.round(recentFile.size / (1024 * 1024) * 10) / 10)} MB</Text>
                </View>
              </View>
              <View style={styles.recentFooter}>
                <Text style={styles.recentFooterText}>Latest scanned file</Text>
                <Pressable onPress={() => router.push('/files')} accessibilityRole="button" style={styles.recentLink}>
                  <Text style={styles.recentLinkText}>Open Files</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Text style={styles.recentEmpty}>No recent scan yet. Tap Scan Files to build your library.</Text>
          )}
        </View>

        <SectionHeader title="Quick Actions" />
        <View style={styles.primaryActionWrap}>
          <ActionButton
            title={isScanning ? 'Scanning Files' : 'Scan Files'}
            icon={isScanning ? <ActivityIndicator size="small" color="#FFF" /> : <Feather name="search" size={20} color="#FFF" />}
            onPress={handleScanFiles}
            style={styles.primaryAction}
          />
        </View>
        <View style={styles.actionsGrid}>
          <ActionButton
            title="Browse Files"
            variant="secondary"
            icon={<Feather name="folder" size={20} color={Colors.text} />}
            onPress={() => router.push('/files')}
            style={styles.actionBtn}
          />
          <ActionButton
            title="AI Insights"
            variant="secondary"
            icon={<Feather name="cpu" size={20} color={Colors.text} />}
            onPress={() => router.push('/ai')}
            style={styles.actionBtn}
          />
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Layout.padding,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  title: {
    ...Typography.h1,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  primaryActionWrap: {
    paddingHorizontal: Layout.padding,
    marginBottom: 12,
  },
  primaryAction: {
    width: '100%',
  },
  actionsGrid: {
    paddingHorizontal: Layout.padding,
    flexDirection: 'row',
    gap: 12,
    marginBottom: Layout.spacing,
  },
  actionBtn: {
    flex: 1,
  },
  insightsContainer: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  recentCard: {
    marginHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentMeta: {
    flex: 1,
  },
  recentTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentSubtitle: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  recentFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  recentFooterText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  recentLink: {
    minHeight: 36,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentLinkText: {
    ...Typography.small,
    color: Colors.text,
    fontWeight: '600',
  },
  recentEmpty: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  footerSpacer: {
    height: 8,
  },
});
