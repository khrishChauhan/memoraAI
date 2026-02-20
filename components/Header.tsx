import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'MemoraAI',
    subtitle,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.dot} />
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.accent,
        marginLeft: 6,
        marginTop: -10,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
});
