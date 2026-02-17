import LogoText from '@/components/LogoText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingsItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    color?: string;
    trailing?: 'arrow' | 'switch';
}

function SettingsItem({
    icon,
    label,
    subtitle,
    color = '#3b82f6',
    trailing = 'arrow',
}: SettingsItemProps) {
    return (
        <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
            <View style={[styles.settingsIconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsLabel}>{label}</Text>
                {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
            </View>
            {trailing === 'arrow' ? (
                <Ionicons name="chevron-forward" size={18} color="#334155" />
            ) : (
                <Switch
                    value={true}
                    trackColor={{ false: '#1e293b', true: '#3b82f6' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#1e293b"
                />
            )}
        </TouchableOpacity>
    );
}

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.accentLine} />
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Customize your experience</Text>
                </View>

                {/* App Info Card */}
                <View style={styles.appInfoCard}>
                    <View style={styles.appInfoLeft}>
                        <View style={styles.appLogoContainer}>
                            <Ionicons name="hardware-chip" size={24} color="#3b82f6" />
                        </View>
                        <View>
                            <LogoText size="small" />
                            <Text style={styles.appVersion}>Version 1.0.0 • Build 1</Text>
                        </View>
                    </View>
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>FREE</Text>
                    </View>
                </View>

                {/* AI Engine Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Engine</Text>
                    <View style={styles.sectionCard}>
                        <SettingsItem
                            icon="flash-outline"
                            label="AI Processing"
                            subtitle="On-device mode"
                            color="#f59e0b"
                            trailing="switch"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="speedometer-outline"
                            label="Scan Intensity"
                            subtitle="Balanced"
                            color="#6366f1"
                        />
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="cloud-offline-outline"
                            label="Offline Mode"
                            subtitle="All data stays on device"
                            color="#22c55e"
                            trailing="switch"
                        />
                    </View>
                </View>

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.sectionCard}>
                        <SettingsItem
                            icon="notifications-outline"
                            label="Notifications"
                            subtitle="Alerts and reminders"
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
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="finger-print-outline"
                            label="Biometric Lock"
                            subtitle="Disabled"
                            color="#6366f1"
                            trailing="switch"
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
                        <View style={styles.divider} />
                        <SettingsItem
                            icon="help-circle-outline"
                            label="Help & Support"
                            color="#10b981"
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>MemoraAI © 2026</Text>
                    <Text style={styles.footerSubtext}>All processing happens on your device</Text>
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
    accentLine: {
        width: 36,
        height: 3,
        backgroundColor: '#10b981',
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
    appInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0f172a',
        marginHorizontal: 24,
        borderRadius: 20,
        padding: 18,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    appInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    appLogoContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appVersion: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        fontWeight: '500',
    },
    proBadge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    proBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    sectionCard: {
        backgroundColor: '#0f172a',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#1e293b',
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
        backgroundColor: '#1e293b',
        marginLeft: 62,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '600',
    },
    footerSubtext: {
        fontSize: 11,
        color: '#1e293b',
        marginTop: 4,
    },
    bottomSpacer: {
        height: 20,
    },
});
