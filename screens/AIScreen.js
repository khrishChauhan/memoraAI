import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFiles } from '../context/FilesContext';
import { analyzeFilesWithAI } from '../services/aiService';

const AIScreen = () => {
    const { scannedFiles } = useFiles();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [error, setError] = useState(null);
    const lastAnalyzedFilesRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const runAnalysis = async () => {
        if (!scannedFiles || scannedFiles.length === 0) {
            setLoading(false);
            setAiResult(null);
            return;
        }

        // Avoid redundant analysis if files haven't changed
        if (lastAnalyzedFilesRef.current === JSON.stringify(scannedFiles)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await analyzeFilesWithAI(scannedFiles);
            setAiResult(result);
            lastAnalyzedFilesRef.current = JSON.stringify(scannedFiles);
            setLoading(false);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            console.error(err);
            setError("Failed to analyze files. Please check your connection and try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            runAnalysis();
        }
    }, [isFocused, scannedFiles]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Analyzing your digital memory...</Text>
            </View>
        );
    }

    if (!scannedFiles || scannedFiles.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="documents-outline" size={64} color="#262626" />
                <Text style={styles.loadingText}>No files to analyze. Scan some files first!</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#FF4D4D" />
                <Text style={styles.loadingText}>{error}</Text>
                <TouchableOpacity onPress={runAnalysis} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry Analysis</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const hasDuplicates = aiResult?.duplicates && aiResult.duplicates.length > 0;
    const hasSuggestions = aiResult?.suggestions && aiResult.suggestions.length > 0;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.mainTitle}>AI Insights</Text>

                {/* Duplicate Files */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionEmoji}>🔴</Text>
                        <Text style={styles.sectionTitle}>Duplicate Files</Text>
                    </View>

                    {hasDuplicates ? (
                        aiResult.duplicates.map((file, idx) => (
                            <DuplicateCard key={idx} {...file} />
                        ))
                    ) : (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No duplicate files detected.</Text>
                        </View>
                    )}
                </View>

                {/* Smart Suggestions */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionEmoji}>🧠</Text>
                        <Text style={styles.sectionTitle}>Smart Suggestions</Text>
                    </View>

                    {hasSuggestions ? (
                        aiResult.suggestions.map((suggestion, index) => (
                            <SuggestionCard
                                key={index}
                                index={index}
                                title={suggestion.title}
                                reason={suggestion.reason}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No optimization suggestions at this time.</Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    content: {
        padding: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        color: '#A0A0A0',
        marginTop: 20,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    mainTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionEmoji: {
        fontSize: 20,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    duplicateCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF4D4D',
        borderWidth: 1,
        borderColor: '#262626',
    },
    suggestionItem: {
        backgroundColor: '#1A1A1A',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#262626',
    },
    cardExpanded: {
        borderColor: '#333333',
        backgroundColor: '#1E1E1E',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fileIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#2A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    miniCardContent: {
        flex: 1,
    },
    miniCardName: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    miniCardSize: {
        color: '#A0A0A0',
        fontSize: 12,
    },
    tapIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tapText: {
        color: '#606060',
        fontSize: 11,
        fontWeight: '500',
    },
    expandedContent: {
        marginTop: 12,
    },
    dividerRed: {
        height: 1,
        backgroundColor: '#FF4D4D33',
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#6366F133',
        marginBottom: 12,
    },
    reasonLabel: {
        color: '#FF4D4D',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    reasonText: {
        color: '#E0E0E0',
        fontSize: 14,
        lineHeight: 20,
    },
    badgeContainer: {
        marginRight: 12,
    },
    numberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    suggestionContent: {
        flex: 1,
    },
    suggestionTitleText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    suggestionReasonText: {
        color: '#B0B0B0',
        fontSize: 14,
        lineHeight: 22,
    },
    emptyCard: {
        padding: 24,
        borderRadius: 18,
        backgroundColor: '#141414',
        borderWidth: 1,
        borderColor: '#262626',
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    emptyText: {
        color: '#606060',
        fontSize: 14,
        fontWeight: '500',
    },
    retryButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#262626',
    },
    retryText: {
        color: '#6366F1',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AIScreen;
