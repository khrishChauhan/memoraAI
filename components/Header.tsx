import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.accentLine} />
            <Text style={styles.title}>MemoraAI</Text>
            <Text style={styles.subtitle}>Your Private AI Memory Optimizer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    accentLine: {
        width: 40,
        height: 4,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
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
});
