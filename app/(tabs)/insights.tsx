import SuggestionCard from '@/components/SuggestionCard';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function InsightsScreen() {
    // Demo data — empty for now, will be populated by scan
    const insights: Array<{
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        description: string;
        timestamp: string;
        accentColor: string;
    }> = [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.accentLine} />
                    <Text style={styles.title}>Insights</Text>
                    <Text style={styles.subtitle}>AI-powered recommendations</Text>
                </View>

                {/* Insight Filters */}
                <View style={styles.filters}>
                    <View style={[styles.filterChip, styles.filterChipActive]}>
                        <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
                    </View>
                    <View style={styles.filterChip}>
                        <Text style={styles.filterText}>Duplicates</Text>
                    </View>
                    <View style={styles.filterChip}>
                        <Text style={styles.filterText}>Cleanup</Text>
                    </View>
                    <View style={styles.filterChip}>
                        <Text style={styles.filterText}>Important</Text>
                    </View>
                </View>

                {/* Stats quick strip */}
                <View style={styles.quickStats}>
                    <View style={styles.quickStatItem}>
                        <Text style={styles.quickStatValue}>0</Text>
                        <Text style={styles.quickStatLabel}>Total</Text>
                    </View>
                    <View style={styles.quickStatDivider} />
                    <View style={styles.quickStatItem}>
                        <Text style={styles.quickStatValue}>0</Text>
                        <Text style={styles.quickStatLabel}>Read</Text>
                    </View>
                    <View style={styles.quickStatDivider} />
                    <View style={styles.quickStatItem}>
                        <Text style={styles.quickStatValue}>0</Text>
                        <Text style={styles.quickStatLabel}>Pending</Text>
                    </View>
                    <View style={styles.quickStatDivider} />
                    <View style={styles.quickStatItem}>
                        <Text style={[styles.quickStatValue, { color: '#22c55e' }]}>0</Text>
                        <Text style={styles.quickStatLabel}>Applied</Text>
                    </View>
                </View>

                {/* Insights list */}
                {insights.length > 0 ? (
                    <View style={styles.insightsList}>
                        {insights.map((insight, index) => (
                            <SuggestionCard
                                key={index}
                                icon={insight.icon}
                                title={insight.title}
                                description={insight.description}
                                timestamp={insight.timestamp}
                                accentColor={insight.accentColor}
                            />
                        ))}
                    </View>
                ) : (
                    /* Empty State */
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconOuter}>
                            <View style={styles.emptyIconMiddle}>
                                <View style={styles.emptyIconInner}>
                                    <Ionicons name="sparkles-outline" size={32} color="#334155" />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.emptyTitle}>No insights yet</Text>
                        <Text style={styles.emptySubtext}>
                            Run a scan to analyze your device memory and receive AI-powered suggestions
                            for optimizing storage.
                        </Text>
                        <View style={styles.emptyFeatures}>
                            {[
                                { icon: 'trash-outline' as const, text: 'Identify duplicate files' },
                                { icon: 'time-outline' as const, text: 'Find forgotten files' },
                                { icon: 'trending-up-outline' as const, text: 'Optimize storage usage' },
                            ].map((feat) => (
                                <View key={feat.text} style={styles.featureRow}>
                                    <Ionicons name={feat.icon} size={14} color="#3b82f6" />
                                    <Text style={styles.featureText}>{feat.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 16,
    },
    accentLine: {
        width: 36,
        height: 3,
        backgroundColor: '#6366f1',
        borderRadius: 2,
        marginBottom: 14,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        letterSpacing: 0.3,
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 8,
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    filterChipActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    filterTextActive: {
        color: '#ffffff',
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        backgroundColor: '#0f172a',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
        marginBottom: 24,
    },
    quickStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    quickStatValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#f1f5f9',
        marginBottom: 2,
    },
    quickStatLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    quickStatDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#1e293b',
    },
    insightsList: {
        paddingHorizontal: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 32,
    },
    emptyIconOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyIconMiddle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIconInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    emptyFeatures: {
        gap: 12,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    bottomSpacer: {
        height: 20,
    },
});
