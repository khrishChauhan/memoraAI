import { Colors, Layout, Typography } from '@/constants/theme';
import { ScannedFile } from '@/database/repositories/FilesRepository';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface FileCardProps {
  file: ScannedFile;
}

export const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [expanded, setExpanded] = useState(false);
  const expandedValue = useSharedValue(0);

  const getIcon = () => {
    switch (file.category) {
      case 'Documents': return 'file-text';
      case 'Images': return 'image';
      case 'Videos': return 'video';
      case 'Audio': return 'headphones';
      case 'Archives': return 'archive';
      default: return 'file';
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
      maxHeight: expandedValue.value * 260,
      marginTop: expandedValue.value * 12,
      transform: [{ translateY: (1 - expandedValue.value) * -4 }],
    };
  });

  const renderRightActions = () => (
    <View style={[styles.swipeAction, styles.deleteAction]}>
      <Feather name="trash-2" size={20} color="#FFF" />
      <Text style={styles.swipeActionText}>Delete</Text>
    </View>
  );

  const renderLeftActions = () => (
    <View style={[styles.swipeAction, styles.archiveAction]}>
      <Feather name="archive" size={20} color="#FFF" />
      <Text style={styles.swipeActionText}>Archive</Text>
    </View>
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString();
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <Pressable onPress={toggleExpand} style={styles.card} accessibilityRole="button">
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name={getIcon()} size={20} color={Colors.accent} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{formatSize(file.size)}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.meta}>{formatDate(file.createdAt)}</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{file.category}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Animated.View style={[styles.body, animatedBodyStyle]}>
          <Text style={styles.bodyLabel}>Location</Text>
          <Text style={styles.bodyDesc} numberOfLines={2}>{file.uri}</Text>

          <Text style={styles.bodyLabel}>Type</Text>
          <Text style={styles.bodyDesc}>{file.mimeType || 'Unknown'}{file.extension ? ` · ${file.extension}` : ''}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.btn} accessibilityRole="button">
              <Text style={styles.btnText}>Open</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSecondary]} accessibilityRole="button">
              <Text style={styles.btnTextSecondary}>Share</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 6,
  },
  meta: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  body: {
    overflow: 'hidden',
  },
  bodyLabel: {
    ...Typography.small,
    color: Colors.accent,
    marginTop: 14,
  },
  bodyDesc: {
    ...Typography.body,
    marginTop: 6,
    color: Colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  btn: {
    backgroundColor: Colors.accent,
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
  btnTextSecondary: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 96,
    gap: 6,
  },
  swipeActionText: {
    ...Typography.small,
    color: '#FFF',
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: Colors.danger,
  },
  archiveAction: {
    backgroundColor: Colors.success,
  },
});
