import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FileCategory {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    count: string;
    color: string;
}

const categories: FileCategory[] = [
    { icon: 'image-outline', label: 'Photos', count: '0 files', color: '#f59e0b' },
    { icon: 'videocam-outline', label: 'Videos', count: '0 files', color: '#ef4444' },
    { icon: 'document-text-outline', label: 'Documents', count: '0 files', color: '#3b82f6' },
    { icon: 'musical-notes-outline', label: 'Audio', count: '0 files', color: '#8b5cf6' },
    { icon: 'download-outline', label: 'Downloads', count: '0 files', color: '#10b981' },
    { icon: 'apps-outline', label: 'Apps', count: '0 files', color: '#ec4899' },
];

export default function FilesScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <View style={styles.accentLine} />
                            <Text style={styles.title}>Files</Text>
                            <Text style={styles.subtitle}>Browse and manage your files</Text>
                        </View>
                        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
                            <Ionicons name="search" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Storage Overview Card */}
                <View style={styles.storageCard}>
                    <View style={styles.storageHeader}>
                        <View style={styles.storageIconBg}>
                            <Ionicons name="pie-chart-outline" size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.storageTitle}>Storage Analysis</Text>
                            <Text style={styles.storageSubtext}>Run a scan to view storage breakdown</Text>
                        </View>
                    </View>
                    <View style={styles.storageBarBg}>
                        <View style={styles.storageBarFill} />
                    </View>
                    <View style={styles.storageStats}>
                        <Text style={styles.storageStat}>0 GB used</Text>
                        <Text style={styles.storageStat}>-- GB total</Text>
                    </View>
                </View>

                {/* Categories Grid */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="folder-outline" size={16} color="#6366f1" />
                    <Text style={styles.sectionTitle}>File Categories</Text>
                </View>
                <View style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.label} style={styles.categoryCard} activeOpacity={0.8}>
                            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                                <Ionicons name={cat.icon} size={24} color={cat.color} />
                            </View>
                            <Text style={styles.categoryLabel}>{cat.label}</Text>
                            <Text style={styles.categoryCount}>{cat.count}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Empty State */}
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconOuter}>
                        <View style={styles.emptyIconInner}>
                            <Ionicons name="folder-open-outline" size={36} color="#334155" />
                        </View>
                    </View>
                    <Text style={styles.emptyTitle}>No files scanned yet</Text>
                    <Text style={styles.emptySubtext}>
                        Run a scan from the Home tab to discover and categorize files on your device.
                    </Text>
                </View>

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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    accentLine: {
        width: 36,
        height: 3,
        backgroundColor: '#8b5cf6',
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
    searchButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    storageCard: {
        marginHorizontal: 24,
        backgroundColor: '#0f172a',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#1e293b',
        marginBottom: 24,
    },
    storageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    storageIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    storageTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#f1f5f9',
    },
    storageSubtext: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    storageBarBg: {
        height: 6,
        backgroundColor: '#1e293b',
        borderRadius: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    storageBarFill: {
        height: '100%',
        width: '5%',
        backgroundColor: '#3b82f6',
        borderRadius: 3,
    },
    storageStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    storageStat: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 14,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f1f5f9',
        letterSpacing: -0.2,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryCard: {
        width: '31%',
        backgroundColor: '#0f172a',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e293b',
        marginBottom: 12,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: 2,
    },
    categoryCount: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 48,
        paddingVertical: 24,
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
        marginBottom: 16,
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
    },
    bottomSpacer: {
        height: 20,
    },
});
