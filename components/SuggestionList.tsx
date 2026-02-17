import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SuggestionList() {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <View style={styles.headerLeft}>
                    <Ionicons name="sparkles" size={18} color="#6366f1" />
                    <Text style={styles.sectionTitle}>AI Insights</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>0 new</Text>
                </View>
            </View>

            {/* Empty state */}
            <View style={styles.emptyCard}>
                <View style={styles.emptyIconOuter}>
                    <View style={styles.emptyIconInner}>
                        <Ionicons name="analytics-outline" size={32} color="#334155" />
                    </View>
                </View>
                <Text style={styles.emptyTitle}>No insights yet</Text>
                <Text style={styles.emptySubtext}>
                    Run a scan to analyze your device memory and receive AI-powered suggestions.
                </Text>
                <View style={styles.emptyHintRow}>
                    <Ionicons name="arrow-up-outline" size={14} color="#475569" />
                    <Text style={styles.emptyHint}>Tap "Start Scan" above to begin</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f1f5f9',
        letterSpacing: -0.2,
    },
    badge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
    },
    emptyCard: {
        backgroundColor: '#0f172a',
        borderRadius: 20,
        paddingVertical: 48,
        paddingHorizontal: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderStyle: 'dashed',
    },
    emptyIconOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyIconInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    emptyHintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    emptyHint: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
});
