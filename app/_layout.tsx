import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Custom dark theme that matches the MemoraAI palette
const MemoraTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#3b82f6',
    background: '#0f172a',
    card: '#0f172a',
    text: '#f1f5f9',
    border: '#1e293b',
    notification: '#3b82f6',
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={MemoraTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
