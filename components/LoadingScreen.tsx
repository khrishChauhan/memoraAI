import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LogoText from './LogoText';

export default function LoadingScreen() {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const dotAnim1 = useRef(new Animated.Value(0)).current;
    const dotAnim2 = useRef(new Animated.Value(0)).current;
    const dotAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Spinner rotation
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Dot animations
        const createDotAnimation = (anim: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        createDotAnimation(dotAnim1, 0).start();
        createDotAnimation(dotAnim2, 200).start();
        createDotAnimation(dotAnim3, 400).start();
    }, [spinAnim, fadeAnim, dotAnim1, dotAnim2, dotAnim3]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Background subtle grid effect */}
            <View style={styles.gridOverlay}>
                {[...Array(6)].map((_, i) => (
                    <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 14}%` }]} />
                ))}
                {[...Array(4)].map((_, i) => (
                    <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 20}%` }]} />
                ))}
            </View>

            <View style={styles.content}>
                <LogoText size="large" />

                {/* Spinner */}
                <View style={styles.spinnerContainer}>
                    <Animated.View style={[styles.spinnerOuter, { transform: [{ rotate: spin }] }]}>
                        <View style={styles.spinnerDot} />
                    </Animated.View>
                    <View style={styles.spinnerInner} />
                </View>

                <Text style={styles.loadingText}>Initializing AI Engine...</Text>

                <View style={styles.dotsContainer}>
                    {[dotAnim1, dotAnim2, dotAnim3].map((anim, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.loadingDot,
                                {
                                    opacity: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 1],
                                    }),
                                    transform: [
                                        {
                                            scale: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1.2],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Version text */}
            <Text style={styles.versionText}>v1.0.0</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    gridLineH: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#0f172a',
    },
    gridLineV: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        alignItems: 'center',
    },
    spinnerContainer: {
        width: 72,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        marginBottom: 32,
    },
    spinnerOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: 'transparent',
        borderTopColor: '#3b82f6',
        borderRightColor: 'rgba(59, 130, 246, 0.3)',
        position: 'absolute',
    },
    spinnerDot: {
        position: 'absolute',
        top: -3,
        right: 32,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
    },
    spinnerInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    loadingText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    loadingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3b82f6',
    },
    versionText: {
        position: 'absolute',
        bottom: 40,
        fontSize: 12,
        color: '#334155',
        fontWeight: '500',
    },
});
