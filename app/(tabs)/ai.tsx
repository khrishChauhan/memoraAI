import { AnimatedProgress } from '@/components/AnimatedProgress';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Colors, Layout, Typography } from '@/constants/theme';
import { AIAnalysisResult, AIService } from '@/services/AIService';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AIScreen() {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await AIService.analyzeFiles();
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>MemoraAI is analyzing your files...</Text>
        </View>
      );
    }

    if (!analysis) {
      return (
        <View style={styles.centerContent}>
          <Feather name="info" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No data to analyze. Please scan some files on the Home screen first.</Text>
          <Pressable style={styles.retryBtn} onPress={runAnalysis} accessibilityRole="button">
            <Text style={styles.retryBtnText}>Retry Analysis</Text>
          </Pressable>
        </View>
      );
    }

    const highPriority = analysis.recommendations.filter((rec) => rec.priority === 'high');
    const mediumPriority = analysis.recommendations.filter((rec) => rec.priority === 'medium');
    const lowPriority = analysis.recommendations.filter((rec) => rec.priority === 'low');

    return (
      <>
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>MemoraAI Engine Online</Text>
          </View>

          <View style={styles.healthScoreContainer}>
            <Text style={styles.healthScoreValue}>{analysis.healthScore}</Text>
            <Text style={styles.healthScoreLabel}>/100 health</Text>
          </View>

          <AnimatedProgress
            progress={analysis.healthScore / 100}
            height={8}
            color={analysis.healthScore > 80 ? Colors.success : analysis.healthScore > 50 ? Colors.warning : Colors.danger}
          />

          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </View>

        {highPriority.length > 0 && (
          <>
            <SectionHeader title="High Priority" />
            <View style={styles.listContainer}>
              {highPriority.map((rec, index) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <RecommendationCard recommendation={rec} />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {mediumPriority.length > 0 && (
          <>
            <SectionHeader title="Medium Priority" />
            <View style={styles.listContainer}>
              {mediumPriority.map((rec, index) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <RecommendationCard recommendation={rec} />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {lowPriority.length > 0 && (
          <>
            <SectionHeader title="Low Priority" />
            <View style={styles.listContainer}>
              {lowPriority.map((rec, index) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <RecommendationCard recommendation={rec} />
                </Animated.View>
              ))}
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>AI Intelligence</Text>
              <Text style={styles.headerSubtitle}>Prioritized recommendations, distilled to the essentials.</Text>
            </View>
            {analysis && !loading && (
              <Pressable onPress={runAnalysis} style={styles.refreshIcon} accessibilityRole="button">
                <Feather name="refresh-cw" size={20} color={Colors.accent} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {renderContent()}

        <View style={styles.bottomSpacer} />
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
    minHeight: '100%',
  },
  header: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h1,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: 6,
  },
  refreshIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  healthCard: {
    marginHorizontal: Layout.padding,
    marginBottom: Layout.spacing * 1.5,
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.accent,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  healthScoreValue: {
    ...Typography.largeTitle,
    fontSize: 42,
  },
  healthScoreLabel: {
    ...Typography.body,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  summaryText: {
    ...Typography.body,
    marginTop: 16,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.padding,
    paddingVertical: 72,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.accent,
    marginTop: 16,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryBtn: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.accent,
  },
  retryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
  bottomSpacer: {
    height: 120,
  },
});
