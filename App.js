import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { getStoredFiles } from './utils/storage';

export default function App() {
    const [scannedFiles, setScannedFiles] = useState([]);

    useEffect(() => {
        const initStorage = async () => {
            const files = await getStoredFiles();
            setScannedFiles(files);
        };
        initStorage();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <AppNavigator scannedFiles={scannedFiles} setScannedFiles={setScannedFiles} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
