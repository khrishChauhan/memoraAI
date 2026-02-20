import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { isAIInitialized, isAIModelReady, runFullTest } from '../ai/runanywhere';
import { Header } from '../components/Header';
import { InsightCard } from '../components/InsightCard';
import { ScanCard } from '../components/ScanCard';
import { StatCard } from '../components/StatCard';
import { Colors } from '../constants/Colors';
import { ScannedFile, useFiles } from '../context/FileContext';

const INSIGHTS = [
    {
        icon: 'copy' as const,
        title: 'Duplicate resumes found',
        description:
            'Multiple resume versions detected. Keep latest version to free up space.',
    },
    {
        icon: 'image' as const,
        title: 'Old screenshots detected',
        description:
            '34 screenshots from 6+ months ago. Review and clean up to save 280 MB.',
    },
    {
        icon: 'video' as const,
        title: 'Large video files',
        description:
            "3 videos totaling 2.1 GB haven\u0027t been accessed in 90 days.",
    },
    {
        icon: 'download' as const,
        title: 'Unused downloads',
        description:
            "12 files in Downloads haven\u0027t been opened since being downloaded.",
    },
];

const HomeScreen = () => {
    const { addFiles, fileCount } = useFiles();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);

    // AI Test state
    const [aiLoading, setAiLoading] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [aiResponse, setAiResponse] = useState('');

    // Animation refs
    const aiCardFade = useRef(new Animated.Value(0)).current;
    const aiResponseFade = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(aiCardFade, {
            toValue: 1,
            duration: 500,
            delay: 600,
            useNativeDriver: true,
        }).start();
    }, [aiCardFade]);

    const handleScan = async () => {
        if (isScanning) return;
        setIsScanning(true);

        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                setIsScanning(false);
                return;
            }

            const scannedFiles: ScannedFile[] = result.assets.map((asset) => ({
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: asset.name,
                uri: asset.uri,
                size: asset.size ?? 0,
                type: asset.mimeType ?? 'unknown',
                dateAdded: Date.now(),
            }));

            addFiles(scannedFiles);
            router.push('/(tabs)/files');
        } catch (_error) {
            Alert.alert('Error', 'Failed to pick files. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleTestAI = async () => {
        if (aiLoading) return;
        setAiLoading(true);
        setAiResponse('');
        setAiStatus('Starting...');

        // Reset and animate response card in
        aiResponseFade.setValue(0);

        try {
            const response = await runFullTest((status) => {
                setAiStatus(status);
            });

            setAiResponse(response);
            setAiStatus('Complete');

            // Fade in response
            Animated.timing(aiResponseFade, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setAiResponse('');
            setAiStatus(`Error: ${msg}`);
            Alert.alert('AI Error', msg);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Header
                    title="MemoraAI"
                    subtitle="Your On-Device AI Memory Optimizer"
                />

                <ScanCard onScan={handleScan} isScanning={isScanning} />

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard title="Scanned" value={fileCount} delay={300} />
                    <StatCard title="Suggestions" value={0} delay={400} />
                    <StatCard title="Unused" value={0} delay={500} />
                </View>

                {/* AI Test Section */}
                <Animated.View style={[styles.aiSection, { opacity: aiCardFade }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>On-Device AI</Text>
                        <View style={styles.aiBadge}>
                            <View style={[
                                styles.aiDot,
                                { backgroundColor: isAIModelReady() ? '#22c55e' : Colors.textMuted }
                            ]} />
                            <Text style={styles.aiBadgeText}>
                                {isAIModelReady() ? 'Ready' : isAIInitialized() ? 'SDK Ready' : 'Offline'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.aiButton, aiLoading && styles.aiButtonDisabled]}
                        onPress={handleTestAI}
                        activeOpacity={0.75}
                        disabled={aiLoading}
                    >
                        <View style={styles.aiButtonIcon}>
                            {aiLoading ? (
                                <ActivityIndicator size="small" color={Colors.accent} />
                            ) : (
                                <Feather name="cpu" size={20} color={Colors.accent} />
                            )}
                        </View>
                        <View style={styles.aiButtonContent}>
                            <Text style={styles.aiButtonTitle}>
                                {aiLoading ? 'Processing...' : 'Test AI'}
                            </Text>
                            <Text style={styles.aiButtonDesc}>
                                {aiLoading
                                    ? aiStatus
                                    : 'Initialize RunAnywhere and run local inference'}
                            </Text>
                        </View>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={Colors.textMuted}
                        />
                    </TouchableOpacity>

                    {/* AI Status */}
                    {aiLoading && (
                        <View style={styles.aiStatusBar}>
                            <ActivityIndicator
                                size="small"
                                color={Colors.accent}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.aiStatusText}>{aiStatus}</Text>
                        </View>
                    )}

                    {/* AI Response */}
                    {aiResponse !== '' && (
                        <Animated.View
                            style={[styles.aiResponseCard, { opacity: aiResponseFade }]}
                        >
                            <View style={styles.aiResponseHeader}>
                                <Feather name="message-circle" size={14} color="#22c55e" />
                                <Text style={styles.aiResponseLabel}>AI Response</Text>
                            </View>
                            <Text style={styles.aiResponseText}>{aiResponse}</Text>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Insights Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Insights</Text>
                    <Text style={styles.sectionCount}>{INSIGHTS.length} items</Text>
                </View>

                <View style={styles.insightsList}>
                    {INSIGHTS.map((item, i) => (
                        <InsightCard
                            key={i}
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            index={i}
                            onPress={() => { }}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        letterSpacing: -0.3,
    },
    sectionCount: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    insightsList: {
        paddingHorizontal: 24,
    },

    // AI Section
    aiSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    aiDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    aiBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    aiButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    aiButtonDisabled: {
        opacity: 0.7,
    },
    aiButtonIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.accentGlow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    aiButtonContent: {
        flex: 1,
        marginRight: 8,
    },
    aiButtonTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 3,
    },
    aiButtonDesc: {
        fontSize: 12,
        color: Colors.textMuted,
        lineHeight: 16,
    },
    aiStatusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.12)',
    },
    aiStatusText: {
        fontSize: 13,
        color: Colors.accent,
        fontWeight: '500',
    },
    aiResponseCard: {
        marginTop: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.06)',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.15)',
    },
    aiResponseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    aiResponseLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#22c55e',
        marginLeft: 6,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    aiResponseText: {
        fontSize: 14,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
});

export default HomeScreen;
