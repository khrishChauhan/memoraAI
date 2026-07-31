import { Colors, Layout, Typography } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonProps {
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: any;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, onPress, variant = 'primary', style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        animatedStyle,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Layout.borderRadius,
    gap: 8,
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.surfaceHighlight,
  },
  text: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFF',
  },
  textSecondary: {
    color: Colors.text,
  },
});
