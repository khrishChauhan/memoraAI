import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    accentColor: string;
}

export default function StatCard({ title, value, icon, accentColor }: StatCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 60,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* Top accent bar */}
                <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

                <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
                    <Ionicons name={icon} size={22} color={accentColor} />
                </View>

                <Text style={styles.value}>{value}</Text>
                <Text style={styles.title}>{title}</Text>

                {/* Subtle glow in bottom right */}
                <View style={[styles.glowEffect, { backgroundColor: accentColor }]} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '48%',
        marginBottom: 14,
    },
    card: {
        backgroundColor: '#0f172a',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#1e293b',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 140,
        justifyContent: 'space-between',
    },
    accentBar: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 2,
        borderRadius: 1,
        opacity: 0.6,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    value: {
        fontSize: 26,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    glowEffect: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        opacity: 0.06,
    },
});
