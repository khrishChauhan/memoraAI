import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface AIRecommendationCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ title, description, priority, type }) => {
  const [expanded, setExpanded] = useState(false);
  const heightVal = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    heightVal.value = expanded ? withTiming(0) : withSpring(1);
  };

  const getPriorityColor = () => {
    switch(priority) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.accent;
    }
  };

  const animatedBodyStyle = useAnimatedStyle(() => {
    return {
      opacity: heightVal.value,
      maxHeight: heightVal.value * 200, 
      marginTop: heightVal.value * 12,
    };
  });

  return (
    <Pressable onPress={toggleExpand} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="zap" size={20} color={Colors.accent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getPriorityColor() + '20' }]}>
          <Text style={[styles.badgeText, { color: getPriorityColor() }]}>{priority.toUpperCase()}</Text>
        </View>
      </View>
      
      <Animated.View style={[styles.body, animatedBodyStyle]}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionText}>Execute</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.actionBtnSecondary]}>
            <Text style={styles.actionTextSecondary}>Dismiss</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.padding,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    ...Typography.h3,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.small,
    fontWeight: '700',
  },
  body: {
    overflow: 'hidden',
  },
  description: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Layout.borderRadius,
  },
  actionBtnSecondary: {
    backgroundColor: Colors.surface,
  },
  actionText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
  actionTextSecondary: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
});
