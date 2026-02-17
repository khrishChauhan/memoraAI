import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconOutline: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
    { key: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { key: 'files', label: 'Files', icon: 'folder', iconOutline: 'folder-outline' },
    { key: 'settings', label: 'Settings', icon: 'settings', iconOutline: 'settings-outline' },
];

export default function BottomNav() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <View style={styles.container}>
            <View style={styles.nav}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tab}
                            activeOpacity={0.7}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <View style={[styles.tabInner, isActive && styles.activeTabInner]}>
                                <Ionicons
                                    name={isActive ? tab.icon : tab.iconOutline}
                                    size={22}
                                    color={isActive ? '#3b82f6' : '#64748b'}
                                />
                                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                                    {tab.label}
                                </Text>
                            </View>
                            {isActive && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 8,
    },
    nav: {
        flexDirection: 'row',
        backgroundColor: '#172033',
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#2d3a4f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 16,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    tabInner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    activeTabInner: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 4,
    },
    activeTabLabel: {
        color: '#3b82f6',
        fontWeight: '700',
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        width: 20,
        height: 3,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
    },
});
