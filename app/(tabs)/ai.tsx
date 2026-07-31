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
    const result = await AIService.analyzeFiles();
    if (result) {
      setAnalysis(result);
    }
    setLoading(false);
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
          <Pressable style={styles.retryBtn} onPress={runAnalysis}>
            <Text style={styles.retryBtnText}>Retry Analysis</Text>
          </Pressable>
        </View>
      );
    }

    const highPriority = analysis.recommendations.filter(r => r.priority === 'high');
    const mediumPriority = analysis.recommendations.filter(r => r.priority === 'medium');
    const lowPriority = analysis.recommendations.filter(r => r.priority === 'low');

    return (
      <>
        {/* AI Health Section */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>MemoraAI Engine Online</Text>
          </View>
          
          <View style={styles.healthScoreContainer}>
            <Text style={styles.healthScoreValue}>{analysis.healthScore}</Text>
            <Text style={styles.healthScoreLabel}>/100 Health</Text>
          </View>
          <AnimatedProgress progress={analysis.healthScore / 100} height={8} color={analysis.healthScore > 80 ? Colors.success : analysis.healthScore > 50 ? Colors.warning : Colors.danger} />
          
          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </View>

        {/* AI Recommendations */}
        {highPriority.length > 0 && (
          <>
            <SectionHeader title="High Priority" />
            <View style={styles.listContainer}>
              {highPriority.map((rec, idx) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(idx * 100).springify()}>
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
              {mediumPriority.map((rec, idx) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(idx * 100).springify()}>
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
              {lowPriority.map((rec, idx) => (
                <Animated.View key={rec.id} entering={FadeInDown.delay(idx * 100).springify()}>
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
            <Text style={styles.headerTitle}>AI Engine</Text>
            {analysis && !loading && (
              <Pressable onPress={runAnalysis} style={styles.refreshIcon}>
                <Feather name="refresh-cw" size={20} color={Colors.accent} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {renderContent()}
        
        <View style={{ height: 80 }} />
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
  refreshIcon: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  healthCard: {
    marginHorizontal: Layout.padding,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.spacing * 1.5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    marginBottom: 12,
  },
  healthScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
  },
  healthScoreLabel: {
    ...Typography.body,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  summaryText: {
    ...Typography.body,
    marginTop: 20,
    lineHeight: 24,
  },
  listContainer: {
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: Layout.padding,
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
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
});
