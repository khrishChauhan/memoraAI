import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LogoTextProps {
  size?: 'small' | 'medium' | 'large';
}

export default function LogoText({ size = 'medium' }: LogoTextProps) {
  const fontSize = size === 'large' ? 42 : size === 'medium' ? 32 : 22;
  const accentSize = size === 'large' ? 42 : size === 'medium' ? 32 : 22;

  return (
    <View style={styles.container}>
      <Text style={[styles.logoBase, { fontSize }]}>Memora</Text>
      <Text style={[styles.logoAccent, { fontSize: accentSize }]}>AI</Text>
      <View style={styles.glowDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBase: {
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  logoAccent: {
    fontWeight: '800',
    color: '#3b82f6',
    letterSpacing: -1,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginLeft: 4,
    marginTop: -12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
});
