import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface FileCardProps {
    name: string;
    size: number;
    type: string;
    dateAdded: number;
    index?: number;
}

const getFileIcon = (type: string): keyof typeof Feather.glyphMap => {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'file-text';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'music';
    if (type.includes('zip') || type.includes('archive')) return 'archive';
    return 'file';
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
};

export const FileCard: React.FC<FileCardProps> = ({
    name,
    size,
    type,
    dateAdded,
    index = 0,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                delay: 100 + index * 60,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 350,
                delay: 100 + index * 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const icon = getFileIcon(type);

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.iconContainer}>
                <Feather name={icon} size={20} color={Colors.accent} />
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <View style={styles.meta}>
                    <Text style={styles.size}>{formatSize(size)}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.date}>{formatDate(dateAdded)}</Text>
                </View>
            </View>

            <View style={styles.typeBadge}>
                <Text style={styles.typeText}>
                    {type.split('/')[1]?.toUpperCase() || 'FILE'}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: Colors.accentGlow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    size: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.textMuted,
        marginHorizontal: 6,
    },
    date: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    typeBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 9,
        fontWeight: '700',
        color: Colors.accent,
        letterSpacing: 0.5,
    },
});
