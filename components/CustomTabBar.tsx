import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface TabItemProps {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    isActive: boolean;
    onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, icon, isActive, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
    const iconScaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isActive ? 1 : 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
        }).start();

        if (isActive) {
            Animated.sequence([
                Animated.spring(iconScaleAnim, {
                    toValue: 1.15,
                    tension: 200,
                    friction: 5,
                    useNativeDriver: true,
                }),
                Animated.spring(iconScaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isActive, scaleAnim, iconScaleAnim]);

    const pillOpacity = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const pillScale = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });

    return (
        <TouchableOpacity
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Pill background */}
            <Animated.View
                style={[
                    styles.pill,
                    {
                        opacity: pillOpacity,
                        transform: [{ scale: pillScale }],
                    },
                ]}
            />

            <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
                <Feather
                    name={icon}
                    size={22}
                    color={isActive ? Colors.accent : Colors.textMuted}
                />
            </Animated.View>

            <Text
                style={[
                    styles.tabLabel,
                    { color: isActive ? Colors.accent : Colors.textMuted },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

interface CustomTabBarProps {
    state: any;
    navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation }) => {
    const tabs = [
        { label: 'Home', icon: 'home' as const },
        { label: 'Files', icon: 'folder' as const },
        { label: 'Chat', icon: 'message-square' as const },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {tabs.map((tab, index) => (
                    <TabItem
                        key={tab.label}
                        label={tab.label}
                        icon={tab.icon}
                        isActive={state.index === index}
                        onPress={() => {
                            const route = state.routes[index];
                            navigation.navigate(route.name);
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        paddingTop: 8,
        paddingHorizontal: 48,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 24,
        position: 'relative',
    },
    pill: {
        position: 'absolute',
        top: -2,
        left: 4,
        right: 4,
        bottom: -2,
        borderRadius: 20,
        backgroundColor: Colors.accentGlow,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
        letterSpacing: 0.5,
    },
});
