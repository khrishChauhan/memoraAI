import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface ScanCardProps {
    onScan: () => void;
    isScanning?: boolean;
}

export const ScanCard: React.FC<ScanCardProps> = ({ onScan, isScanning = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 8,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.outerGlow,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onScan}
                disabled={isScanning}
                style={styles.card}
            >
                {/* Icon Ring */}
                <View style={styles.iconRing}>
                    <View style={styles.iconInner}>
                        {isScanning ? (
                            <ActivityIndicator size="small" color={Colors.accent} />
                        ) : (
                            <Feather name="search" size={28} color={Colors.accent} />
                        )}
                    </View>
                </View>

                <Text style={styles.title}>
                    {isScanning ? 'Scanning...' : 'Scan Device'}
                </Text>
                <Text style={styles.description}>
                    Detect duplicate files, unused files, and generate smart insights
                </Text>

                {/* Button */}
                <View style={[styles.button, isScanning && styles.buttonDisabled]}>
                    {isScanning ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.buttonText}>Start Scan</Text>
                            <View style={styles.buttonArrow}>
                                <Feather name="arrow-right" size={16} color="#fff" />
                            </View>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outerGlow: {
        marginHorizontal: 24,
        marginTop: 8,
        marginBottom: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
    },
    iconRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.accentGlow,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    iconInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
        minWidth: 160,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        marginRight: 10,
        letterSpacing: 0.3,
    },
    buttonArrow: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
