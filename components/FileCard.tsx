import { Colors, Layout, Typography } from '@/constants/theme';
import { ScannedFile } from '@/database/repositories/FilesRepository';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface FileCardProps {
  file: ScannedFile;
}

export const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [expanded, setExpanded] = useState(false);
  const heightVal = useSharedValue(0);

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
    setExpanded(!expanded);
    heightVal.value = expanded ? withTiming(0) : withSpring(1);
  };

  const animatedBodyStyle = useAnimatedStyle(() => {
    return {
      opacity: heightVal.value,
      maxHeight: heightVal.value * 250, 
      marginTop: heightVal.value * 12,
    };
  });

  const renderRightActions = () => (
    <View style={styles.deleteAction}>
      <Feather name="trash-2" size={24} color="#FFF" />
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.archiveAction}>
      <Feather name="archive" size={24} color="#FFF" />
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
      <Pressable onPress={toggleExpand} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name={getIcon()} size={24} color={Colors.accent} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.meta}>{formatSize(file.size)} • {formatDate(file.createdAt)}</Text>
          </View>
        </View>
        
        <Animated.View style={[styles.body, animatedBodyStyle]}>
          <Text style={styles.bodyText}>Path:</Text>
          <Text style={styles.bodyDesc} numberOfLines={2}>{file.uri}</Text>
          
          <Text style={styles.bodyText}>Type:</Text>
          <Text style={styles.bodyDesc}>{file.mimeType || 'Unknown'} {file.extension ? `(.${file.extension})` : ''}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.btn}>
              <Text style={styles.btnText}>Open</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSecondary]}>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  meta: {
    ...Typography.caption,
  },
  aiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteAction: {
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  archiveAction: {
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
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
    ...Typography.caption,
    marginTop: 4,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceHighlight,
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
});
