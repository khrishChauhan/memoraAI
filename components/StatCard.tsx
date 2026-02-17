import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    accentColor: string;
}

export default function StatCard({ title, value, icon, accentColor }: StatCardProps) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: accentColor + '18' }]}>
                <Ionicons name={icon} size={22} color={accentColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            <View style={[styles.accentDot, { backgroundColor: accentColor }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2d3a4f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94a3b8',
        letterSpacing: 0.3,
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f1f5f9',
    },
    accentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.6,
    },
});
