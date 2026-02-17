import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilesScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.accentLine} />
                <Text style={styles.title}>Files</Text>
                <Text style={styles.subtitle}>Browse and manage your files</Text>
            </View>

            {/* Empty State */}
            <View style={styles.emptyContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="folder-open-outline" size={48} color="#475569" />
                </View>
                <Text style={styles.emptyTitle}>No files scanned yet</Text>
                <Text style={styles.emptySubtext}>
                    Run a scan from the Home tab to discover files on your device.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    accentLine: {
        width: 40,
        height: 4,
        backgroundColor: '#8b5cf6',
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '400',
        color: '#64748b',
        letterSpacing: 0.3,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 48,
        paddingBottom: 100,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2d3a4f',
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
        lineHeight: 20,
    },
});
