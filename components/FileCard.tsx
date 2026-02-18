import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

type FileTag = 'Duplicate' | 'Unused' | 'Important';

interface FileCardProps {
    name: string;
    size: string;
    tag: FileTag;
    icon: keyof typeof Feather.glyphMap;
    index?: number;
}

const TAG_CONFIG: Record<FileTag, { color: string; bg: string }> = {
    Duplicate: { color: Colors.duplicate, bg: 'rgba(244, 63, 94, 0.12)' },
    Unused: { color: Colors.unused, bg: 'rgba(249, 115, 22, 0.12)' },
    Important: { color: Colors.important, bg: 'rgba(34, 211, 238, 0.12)' },
};

export const FileCard: React.FC<FileCardProps> = ({
    name,
    size,
    tag,
    icon,
    index = 0,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                delay: 150 + index * 70,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 350,
                delay: 150 + index * 70,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const tagConfig = TAG_CONFIG[tag];

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.iconContainer}>
                <Feather name={icon} size={20} color={Colors.textSecondary} />
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.size}>{size}</Text>
            </View>

            <View style={[styles.badge, { backgroundColor: tagConfig.bg }]}>
                <View
                    style={[styles.badgeDot, { backgroundColor: tagConfig.color }]}
                />
                <Text style={[styles.badgeText, { color: tagConfig.color }]}>
                    {tag}
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
        backgroundColor: 'rgba(255,255,255,0.04)',
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
        marginBottom: 2,
    },
    size: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    badgeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        marginRight: 5,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
