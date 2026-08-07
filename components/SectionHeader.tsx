import { Colors, Layout, Typography } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: any;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionTitle, onAction, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={Typography.h2}>{title}</Text>
      {actionTitle && (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button" style={styles.actionPill}>
          <Text style={styles.action}>{actionTitle}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.padding,
    paddingHorizontal: Layout.padding,
  },
  actionPill: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  action: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '600',
  },
});
