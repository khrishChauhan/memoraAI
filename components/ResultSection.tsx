import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ResultSectionProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: string[];
    emptyText: string;
}

export default function ResultSection({ title, icon, items, emptyText }: ResultSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name={icon} size={18} color="#3b82f6" />
                <Text style={styles.title}>{title}</Text>
                {items.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{items.length}</Text>
                    </View>
                )}
            </View>

            {items.length === 0 ? (
                <Text style={styles.emptyText}>{emptyText}</Text>
            ) : (
                <View style={styles.list}>
                    {items.map((item, index) => (
                        <View key={index} style={styles.item}>
                            <View style={styles.dot} />
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0f172a',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f1f5f9',
        flex: 1,
    },
    badge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3b82f6',
    },
    emptyText: {
        fontSize: 13,
        color: '#475569',
        fontStyle: 'italic',
    },
    list: {
        gap: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#334155',
    },
    itemText: {
        fontSize: 13,
        color: '#94a3b8',
        flex: 1,
    },
});
