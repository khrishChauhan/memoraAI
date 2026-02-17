import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Memora<Text style={styles.accent}>AI</Text>
            </Text>
            <Text style={styles.subtitle}>Your Offline AI Memory Assistant</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: -0.5,
    },
    accent: {
        color: '#3b82f6',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});
