import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FilesProvider } from './context/FilesContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <FilesProvider>
                    <AppNavigator />
                </FilesProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
