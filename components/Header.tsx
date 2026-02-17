import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LogoText from './LogoText';

export default function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.titleSection}>
                    <LogoText size="large" />
                    <Text style={styles.subtitle}>On-Device AI Memory Intelligence</Text>
                </View>
                <View style={styles.profileIcon}>
                    <Ionicons name="person" size={18} color="#94a3b8" />
                    <View style={styles.onlineDot} />
                </View>
            </View>
            <View style={styles.accentLineContainer}>
                <View style={styles.accentLine} />
                <View style={styles.accentGlow} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 8,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleSection: {
        flex: 1,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        letterSpacing: 0.4,
        marginTop: 6,
    },
    profileIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#1e293b',
        borderWidth: 1.5,
        borderColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#020617',
    },
    accentLineContainer: {
        marginTop: 20,
        position: 'relative',
    },
    accentLine: {
        height: 3,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
        width: 50,
    },
    accentGlow: {
        position: 'absolute',
        top: -4,
        left: 0,
        height: 11,
        width: 50,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        opacity: 0.25,
    },
});
