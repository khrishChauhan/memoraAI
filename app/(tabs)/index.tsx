import { ActionButton } from '@/components/ActionButton';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SectionHeader } from '@/components/SectionHeader';
import { StorageCard } from '@/components/StorageCard';
import { Colors, Layout, Typography } from '@/constants/theme';
import { useStorageStats } from '@/hooks/useStorageStats';
import { AIAnalysisResult, AIService } from '@/services/AIService';
import { FileScannerService } from '@/services/FileScannerService';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { stats, refreshStats } = useStorageStats();
  const router = useRouter();
  const [aiAnalysis, setAiAnalysis] = React.useState<AIAnalysisResult | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      AIService.getCachedAnalysis().then(setAiAnalysis);
    }, [])
  );

  const handleScanFiles = async () => {
    const count = await FileScannerService.scanFiles();
    if (count > 0) {
      refreshStats();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Greeting Section */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.greeting}>Good Evening</Text>
          <Text style={styles.title}>MemoraAI</Text>
          <Text style={styles.subtitle}>Your AI understands your digital life.</Text>
        </Animated.View>

        {/* Storage Ring Component */}
        <StorageCard used={stats.usedBytes / (1024 * 1024 * 1024)} total={stats.totalBytes / (1024 * 1024 * 1024)} />

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsGrid}>
          <ActionButton 
            title="Scan Files" 
            icon={<Feather name="search" size={20} color="#FFF" />} 
            onPress={handleScanFiles} 
            style={styles.actionBtn}
          />
          <ActionButton 
            title="Analyze" 
            variant="secondary"
            icon={<Feather name="bar-chart-2" size={20} color={Colors.text} />} 
            onPress={() => {}} 
            style={styles.actionBtn}
          />
          <ActionButton 
            title="Cleanup" 
            variant="secondary"
            icon={<Feather name="trash-2" size={20} color={Colors.text} />} 
            onPress={() => {}} 
            style={styles.actionBtn}
          />
          <ActionButton 
            title="AI Chat" 
            variant="secondary"
            icon={<Feather name="message-square" size={20} color={Colors.text} />} 
            onPress={() => {}} 
            style={styles.actionBtn}
          />
        </View>

        {/* Insights Section */}
        <SectionHeader title="AI Intelligence" actionTitle="See All" onAction={() => router.push('/ai')} />
        <View style={styles.insightsContainer}>
          {aiAnalysis ? (
            aiAnalysis.recommendations.slice(0, 3).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Layout.borderRadius }}>
              <Feather name="zap-off" size={24} color={Colors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={{ color: Colors.textMuted, textAlign: 'center' }}>No AI insights generated yet. Go to the AI tab to analyze your files.</Text>
            </View>
          )}
        </View>
        
        <View style={{ height: 40 }} />
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
  },
  header: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing * 1.5,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  title: {
    ...Typography.h1,
    fontSize: 40,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing * 1.5,
  },
  actionBtn: {
    width: '48%',
  },
  insightsContainer: {
    paddingHorizontal: Layout.padding,
  },
});
