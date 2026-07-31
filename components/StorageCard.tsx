import { Colors, Layout, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedStorageRing } from './AnimatedStorageRing';

interface StorageCardProps {
  used: number;
  total: number;
}

export const StorageCard: React.FC<StorageCardProps> = ({ used, total }) => {
  const progress = used / total;

  return (
    <View style={styles.card}>
      <AnimatedStorageRing progress={progress} size={140} strokeWidth={14} />
      <View style={styles.info}>
        <Text style={styles.title}>Internal Storage</Text>
        <Text style={styles.subtitle}>{used.toFixed(1)} GB of {total} GB used</Text>
        <Text style={styles.freeText}>{(total - used).toFixed(1)} GB Free</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHighlight,
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    marginHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  info: {
    flex: 1,
    marginLeft: 24,
  },
  title: {
    ...Typography.h3,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    marginBottom: 8,
  },
  freeText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.success,
  },
});
