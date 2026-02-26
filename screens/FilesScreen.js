import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';


const FileCard = ({ item, index, onDelete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const swipeableRef = useRef(null);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDelete = () => {
        if (swipeableRef.current) {
            swipeableRef.current.close();
        }
        onDelete(item.uri);
    };

    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -50, 0],
            outputRange: [1, 0.8, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                onPress={handleDelete}
                activeOpacity={0.8}
                style={styles.deleteAction}
            >
                <Animated.View style={[styles.deleteActionContent, { opacity, transform: [{ scale }] }]}>
                    <View style={styles.deleteIconCircle}>
                        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={styles.deleteActionText}>Delete</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                friction={2}
                rightThreshold={40}
                overshootRight={false}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={item.type === 'IMG' ? 'image' : 'document-text'}
                                size={24}
                                color="#6366F1"
                            />
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.type}</Text>
                        </View>
                    </View>
                    <Text style={styles.fileName}>{item.name}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.fileSize}>{item.size}</Text>
                        <Text style={styles.fileDate}>{item.date}</Text>
                    </View>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

const FilesScreen = ({ navigation, scannedFiles: files, setScannedFiles: setFiles }) => {
    const hasFiles = files && files.length > 0;

    const deleteFile = async (fileUri) => {
        const updatedFiles = files.filter(file => file.uri !== fileUri);
        setFiles(updatedFiles);
        await AsyncStorage.setItem("MEMORA_FILES", JSON.stringify(updatedFiles));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Files</Text>
                <Text style={styles.headerSubtitle}>
                    {hasFiles ? `${files.length} items detected` : "No files scanned yet"}
                </Text>
            </View>

            {hasFiles ? (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <FileCard
                            item={item}
                            index={index}
                            onDelete={deleteFile}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cloud-upload-outline" size={64} color="#262626" />
                    <Text style={styles.emptyText}>No files scanned yet.</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        style={styles.emptyButton}
                    >
                        <Text style={styles.emptyButtonText}>Go to Scanner</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    activeOpacity={hasFiles ? 0.9 : 0.5}
                    onPress={() => hasFiles && navigation.navigate('AI')}
                    style={[styles.primaryButton, !hasFiles && { opacity: 0.5 }]}
                    disabled={!hasFiles}
                >
                    <LinearGradient
                        colors={['#6366F1', '#A855F7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Analyze with AI</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    header: {
        paddingTop: 80,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#A0A0A0',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 18,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#262626',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        backgroundColor: '#262626',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#262626',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: '700',
    },
    fileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fileSize: {
        color: '#6366F1',
        fontSize: 14,
        fontWeight: '500',
    },
    fileDate: {
        color: '#606060',
        fontSize: 14,
    },
    deleteAction: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: 18,
        marginBottom: 12,
        marginLeft: 12,
    },
    deleteActionContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    deleteActionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    bottomContainer: {
        width: '100%',
        padding: 24,
        paddingBottom: 24,
        backgroundColor: '#0D0D0D',
    },
    primaryButton: {
        width: '100%',
        height: 60,
        borderRadius: 18,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#606060',
        fontSize: 18,
        marginTop: 16,
        textAlign: 'center',
    },
    emptyButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#262626',
    },
    emptyButtonText: {
        color: '#6366F1',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FilesScreen;
