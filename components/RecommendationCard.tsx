import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface RecommendationCardProps {
  recommendation: {
    id: number;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: 'Review' | 'Delete' | 'Archive' | 'Ignore';
    affectedFiles: string[];
    estimatedStorageSavedMB?: number | null;
  };
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const expandedValue = useSharedValue(0);

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.accent;
    }
  };

  const getActionIcon = () => {
    switch (recommendation.action) {
      case 'Delete': return 'trash-2';
      case 'Archive': return 'archive';
      case 'Review': return 'eye';
      case 'Ignore': return 'x-circle';
      default: return 'check';
    }
  };

  const toggleExpand = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    expandedValue.value = withTiming(nextExpanded ? 1 : 0, { duration: 220 });
  };

  const animatedBodyStyle = useAnimatedStyle(() => {
    return {
      opacity: expandedValue.value,
      maxHeight: expandedValue.value * 320,
      marginTop: expandedValue.value * 12,
      transform: [{ translateY: (1 - expandedValue.value) * -4 }],
    };
  });

  const priorityLabel = recommendation.priority.toUpperCase();

  return (
    <Pressable onPress={toggleExpand} style={styles.card} accessibilityRole="button">
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getPriorityColor() + '18' }]}>
          <Feather name={getActionIcon()} size={20} color={getPriorityColor()} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{recommendation.title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.priorityPill, { backgroundColor: getPriorityColor() + '18' }]}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>{priorityLabel}</Text>
            </View>
            <Text style={styles.meta}>Tap to review</Text>
          </View>
        </View>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} style={styles.chevron} />
      </View>
      
      <Animated.View style={[styles.body, animatedBodyStyle]}>
        <Text style={styles.bodyDesc} numberOfLines={expanded ? undefined : 2}>{recommendation.description}</Text>

        <View style={styles.chipsRow}>
          {recommendation.affectedFiles.slice(0, 2).map((uri) => (
            <View key={uri} style={styles.fileChip}>
              <Feather name="file" size={12} color={Colors.textMuted} />
              <Text style={styles.fileChipText} numberOfLines={1}>{uri.split('/').pop()}</Text>
            </View>
          ))}
          {recommendation.affectedFiles.length > 2 && (
            <View style={styles.fileChip}>
              <Text style={styles.fileChipText}>+{recommendation.affectedFiles.length - 2} more</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {typeof recommendation.estimatedStorageSavedMB === 'number' && recommendation.estimatedStorageSavedMB > 0 && (
            <View style={styles.savingsPill}>
              <Text style={styles.savingsLabel}>Est. save</Text>
              <Text style={styles.savingsValue}>{recommendation.estimatedStorageSavedMB.toFixed(1)} MB</Text>
            </View>
          )}
          <Pressable style={[styles.btn, { backgroundColor: getPriorityColor() }]} onPress={toggleExpand}>
            <Text style={styles.btnText}>{recommendation.action}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    marginBottom: Layout.spacing,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    ...Typography.small,
    fontWeight: '700',
  },
  meta: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  chevron: {
    marginLeft: 8,
  },
  body: {
    overflow: 'hidden',
  },
  bodyDesc: {
    ...Typography.body,
    marginTop: 8,
    color: Colors.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    backgroundColor: Colors.background,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  fileChipText: {
    ...Typography.small,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savingsLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  savingsValue: {
    ...Typography.small,
    color: Colors.text,
    fontWeight: '700',
  },
  btn: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
});
