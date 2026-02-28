import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

import { useFiles } from '../context/FilesContext';
import { getStoredFiles, mergeFiles } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
    const { setScannedFiles } = useFiles();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleScanFiles = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
                type: '*/*',
            });

            if (!result.canceled) {
                const newFiles = result.assets.map(file => ({
                    id: Math.random().toString(36).substr(2, 9),
                    uri: file.uri,
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                    type: file.mimeType ? file.mimeType.split('/')[1].toUpperCase() : 'FILE',
                    date: file.lastModified
                        ? new Date(file.lastModified).toLocaleDateString()
                        : new Date().toLocaleDateString(),
                }));

                const existingFiles = await getStoredFiles();
                const mergedContent = mergeFiles(existingFiles, newFiles);

                if (mergedContent.length === existingFiles.length) {
                    Alert.alert("Scan Info", "All selected files already scanned.");
                    navigation.navigate('Files');
                    return;
                }

                setScannedFiles(mergedContent);
                navigation.navigate('Files');
            }
        } catch (error) {
            console.error("Error picking documents: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>MemoraAI</Text>
                <Text style={styles.subtitle}>Understand Your Digital Memory</Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleScanFiles}
                    style={styles.buttonContainer}
                >
                    <LinearGradient
                        colors={['#6366F1', '#A855F7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Scan Files</Text>
                    </LinearGradient>
                    <View style={styles.glow} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#A0A0A0',
        marginBottom: 60,
        fontWeight: '400',
    },
    buttonContainer: {
        position: 'relative',
        width: width * 0.6,
        height: 60,
    },
    button: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    glow: {
        position: 'absolute',
        top: 5,
        bottom: -5,
        left: 10,
        right: 10,
        backgroundColor: '#6366F1',
        borderRadius: 30,
        opacity: 0.3,
        blurRadius: 20,
        zIndex: 0,
    },
});

export default HomeScreen;
