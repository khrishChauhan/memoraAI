import { Colors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface AnimatedProgressProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ progress, color = Colors.accent, height = 8 }) => {
  const widthVal = useSharedValue(0);

  useEffect(() => {
    widthVal.value = withSpring(progress * 100, { damping: 20, stiffness: 90 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthVal.value}%`,
    };
  });

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, height }, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});
