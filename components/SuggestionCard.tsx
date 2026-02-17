import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuggestionCardProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function SuggestionCard({
    title,
    description,
    actionLabel,
    onAction,
}: SuggestionCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {actionLabel && (
                <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.7}>
                    <Text style={styles.actionText}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
    },
    actionButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
});
