import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    color?: string;
}

function SettingsItem({ icon, label, subtitle, color = '#3b82f6' }: SettingsItemProps) {
    return (
        <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
            <View style={[styles.settingsIconContainer, { backgroundColor: color + '18' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsLabel}>{label}</Text>
                {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
        </TouchableOpacity>
    );
}

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.accentLine} />
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Customize your experience</Text>
                </View>

                {/* App Info Card */}
                <View style={styles.appInfoCard}>
                    <View style={styles.appLogoContainer}>
                        <Ionicons name="hardware-chip-outline" size={28} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.appName}>MemoraAI</Text>
                        <Text style={styles.appVersion}>Version 1.0.0</Text>
                    </View>
                </View>

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.sectionCard}>
                        <SettingsItem
                            icon="notifications-outline"
                            label="Notifications"
                            subtitle="Manage alerts and reminders"
                            color="#f59e0b"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="moon-outline"
                            label="Appearance"
                            subtitle="Dark mode"
                            color="#8b5cf6"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="language-outline"
                            label="Language"
                            subtitle="English"
                            color="#10b981"
                        />
                    </View>
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Security</Text>
                    <View style={styles.sectionCard}>
                        <SettingsItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            color="#3b82f6"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="lock-closed-outline"
                            label="Data & Storage"
                            subtitle="Manage cached data"
                            color="#ef4444"
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.sectionCard}>
                        <SettingsItem
                            icon="information-circle-outline"
                            label="About MemoraAI"
                            color="#3b82f6"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="star-outline"
                            label="Rate this App"
                            color="#f59e0b"
                        />
                    </View>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    accentLine: {
        width: 40,
        height: 4,
        backgroundColor: '#10b981',
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
    appInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        marginHorizontal: 24,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2d3a4f',
        gap: 14,
    },
    appLogoContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#f1f5f9',
    },
    appVersion: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    sectionCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2d3a4f',
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    settingsIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingsTextContainer: {
        flex: 1,
    },
    settingsLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f1f5f9',
    },
    settingsSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#2d3a4f',
        marginLeft: 62,
    },
    bottomSpacer: {
        height: 20,
    },
});
