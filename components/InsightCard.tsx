import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface InsightCardProps {
  title: string;
  subtitle: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  index: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, subtitle, type, index }) => {
  const getIcon = () => {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'alert-circle';
      case 'success': return 'check-circle';
      case 'danger': return 'trash-2';
      default: return 'info';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'info': return Colors.accent;
      case 'warning': return Colors.warning;
      case 'success': return Colors.success;
      case 'danger': return Colors.danger;
      default: return Colors.accent;
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <Pressable style={styles.card} accessibilityRole="button">
        <View style={[styles.iconContainer, { backgroundColor: getColor() + '18' }]}> 
          <Feather name={getIcon()} size={18} color={getColor()} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
