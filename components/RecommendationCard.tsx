import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface RecommendationCardProps {
  recommendation: {
    id: number;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: 'Review' | 'Delete' | 'Archive' | 'Ignore';
    affectedFiles: string[];
  };
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const heightVal = useSharedValue(0);

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
    setExpanded(!expanded);
    heightVal.value = expanded ? withTiming(0) : withSpring(1);
  };

  const animatedBodyStyle = useAnimatedStyle(() => {
    return {
      opacity: heightVal.value,
      maxHeight: heightVal.value * 300, 
      marginTop: heightVal.value * 12,
    };
  });

  return (
    <Pressable onPress={toggleExpand} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getPriorityColor() + '20' }]}>
          <Feather name={getActionIcon()} size={24} color={getPriorityColor()} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{recommendation.title}</Text>
          <Text style={styles.meta}>Priority: <Text style={{ color: getPriorityColor() }}>{recommendation.priority.toUpperCase()}</Text></Text>
        </View>
      </View>
      
      <Animated.View style={[styles.body, animatedBodyStyle]}>
        <Text style={styles.bodyText}>Reasoning:</Text>
        <Text style={styles.bodyDesc}>{recommendation.description}</Text>
        
        <Text style={styles.bodyText}>Affected Files ({recommendation.affectedFiles.length}):</Text>
        <View style={styles.fileList}>
          {recommendation.affectedFiles.slice(0, 3).map((uri, idx) => (
            <Text key={idx} style={styles.fileUri} numberOfLines={1}>• {uri.split('/').pop()}</Text>
          ))}
          {recommendation.affectedFiles.length > 3 && (
            <Text style={styles.fileUri}>...and {recommendation.affectedFiles.length - 3} more</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.btn, { backgroundColor: getPriorityColor() }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  meta: {
    ...Typography.caption,
  },
  body: {
    overflow: 'hidden',
  },
  bodyText: {
    ...Typography.small,
    color: Colors.accent,
    marginTop: 8,
  },
  bodyDesc: {
    ...Typography.body,
    marginTop: 4,
    marginBottom: 12,
  },
  fileList: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  fileUri: {
    ...Typography.caption,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
});
