import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SuggestionList() {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Ionicons name="sparkles-outline" size={18} color="#3b82f6" />
                <Text style={styles.sectionTitle}>AI Suggestions</Text>
            </View>
            <View style={styles.emptyCard}>
                <View style={styles.emptyIconContainer}>
                    <Ionicons name="bulb-outline" size={36} color="#475569" />
                </View>
                <Text style={styles.emptyText}>No suggestions yet.</Text>
                <Text style={styles.emptySubtext}>Scan your device to begin.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f1f5f9',
        letterSpacing: 0.2,
    },
    emptyCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2d3a4f',
        borderStyle: 'dashed',
    },
    emptyIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1a2438',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748b',
    },
});
