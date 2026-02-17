import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuggestionCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    timestamp: string;
    accentColor?: string;
    onView?: () => void;
    onIgnore?: () => void;
}

export default function SuggestionCard({
    icon,
    title,
    description,
    timestamp,
    accentColor = '#3b82f6',
    onView,
    onIgnore,
}: SuggestionCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
                    <Ionicons name={icon} size={20} color={accentColor} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.timestampContainer}>
                    <Ionicons name="time-outline" size={12} color="#475569" />
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.ignoreButton} onPress={onIgnore} activeOpacity={0.7}>
                        <Text style={styles.ignoreText}>Ignore</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewButton} onPress={onView} activeOpacity={0.7}>
                        <Ionicons name="eye-outline" size={14} color="#ffffff" />
                        <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0f172a',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    description: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        paddingTop: 12,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timestamp: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ignoreButton: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: '#1e293b',
    },
    ignoreText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: '#3b82f6',
        gap: 4,
    },
    viewText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
});
