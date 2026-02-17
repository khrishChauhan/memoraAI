import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ScanPanel() {
    const [isScanning, setIsScanning] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isScanning) {
            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Rotate animation for icon
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Auto-stop after 5 seconds (demo)
            const timer = setTimeout(() => {
                setIsScanning(false);
                pulseAnim.setValue(1);
                rotateAnim.setValue(0);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isScanning, pulseAnim, rotateAnim]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.card,
                    isScanning && styles.cardScanning,
                    { transform: [{ scale: pulseAnim }] },
                ]}
            >
                {/* Decorative corner accents */}
                <View style={[styles.cornerAccent, styles.topLeft]} />
                <View style={[styles.cornerAccent, styles.topRight]} />
                <View style={[styles.cornerAccent, styles.bottomLeft]} />
                <View style={[styles.cornerAccent, styles.bottomRight]} />

                <View style={styles.cardContent}>
                    <View style={styles.iconRow}>
                        <Animated.View
                            style={[
                                styles.scanIconContainer,
                                isScanning && { transform: [{ rotate: spin }] },
                            ]}
                        >
                            <Ionicons
                                name={isScanning ? 'sync' : 'scan'}
                                size={28}
                                color="#3b82f6"
                            />
                        </Animated.View>
                        {isScanning && (
                            <View style={styles.scanningBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.scanningBadgeText}>SCANNING</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.title}>
                        {isScanning ? 'Scanning Device Storage...' : 'Scan Device Storage'}
                    </Text>
                    <Text style={styles.description}>
                        {isScanning
                            ? 'Analyzing files, screenshots, and documents using local AI engine...'
                            : 'Analyze files, screenshots, and documents using local AI'}
                    </Text>

                    {isScanning ? (
                        <View style={styles.progressContainer}>
                            <ActivityIndicator size="small" color="#3b82f6" />
                            <Text style={styles.progressText}>Processing files...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.scanButton}
                            activeOpacity={0.8}
                            onPress={() => setIsScanning(true)}
                        >
                            <Ionicons name="flash" size={18} color="#ffffff" />
                            <Text style={styles.scanButtonText}>Start Scan</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color="rgba(255,255,255,0.6)"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    card: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1e293b',
        overflow: 'hidden',
        position: 'relative',
    },
    cardScanning: {
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 16,
    },
    cornerAccent: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderColor: '#334155',
    },
    topLeft: {
        top: 8,
        left: 8,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 4,
    },
    topRight: {
        top: 8,
        right: 8,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderTopRightRadius: 4,
    },
    bottomLeft: {
        bottom: 8,
        left: 8,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderBottomLeftRadius: 4,
    },
    bottomRight: {
        bottom: 8,
        right: 8,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderBottomRightRadius: 4,
    },
    cardContent: {
        padding: 24,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    scanIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3b82f6',
    },
    scanningBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3b82f6',
        letterSpacing: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 24,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    scanButtonText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.3,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94a3b8',
    },
});
