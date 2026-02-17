import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScanButton() {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={styles.iconCircle}>
                        <Ionicons name="scan-outline" size={22} color="#ffffff" />
                    </View>
                    <Text style={styles.buttonText}>Scan Device</Text>
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
            </Animated.View>
            <View style={styles.glowEffect} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
        position: 'relative',
    },
    buttonWrapper: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 20,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    buttonText: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.3,
    },
    glowEffect: {
        position: 'absolute',
        bottom: 0,
        width: '60%',
        height: 30,
        backgroundColor: '#3b82f6',
        borderRadius: 100,
        opacity: 0.15,
        zIndex: -1,
    },
});
