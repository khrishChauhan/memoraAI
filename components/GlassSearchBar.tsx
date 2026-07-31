import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

export const GlassSearchBar: React.FC<TextInputProps> = (props) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={Colors.textMuted} style={styles.icon} />
      <TextInput 
        style={styles.input}
        placeholder="Search memories, files, or ask AI..."
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      <Feather name="mic" size={20} color={Colors.accent} style={styles.iconRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 24, 33, 0.7)',
    borderRadius: Layout.borderRadius,
    paddingHorizontal: 16,
    height: 56,
    marginHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
});
