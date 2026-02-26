import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { analyzeFilesWithAI } from '../services/aiService';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SuggestionCard = ({ title, reason, index }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            style={[styles.suggestionItem, expanded && styles.cardExpanded]}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.badgeContainer}>
                    <LinearGradient
                        colors={['#6366F1', '#A855F7']}
                        style={styles.numberBadge}
                    >
                        <Text style={styles.numberText}>{index + 1}</Text>
                    </LinearGradient>
                </View>
                <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitleText}>{title}</Text>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6366F1"
                    opacity={0.6}
                />
            </View>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    <Text style={styles.suggestionReasonText}>{reason}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const DuplicateCard = ({ name, size, reason }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            style={[styles.duplicateCard, expanded && styles.cardExpanded]}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.fileIconContainer}>
                    <Ionicons name="copy-outline" size={24} color="#FF4D4D" />
                </View>
                <View style={styles.miniCardContent}>
                    <Text style={styles.miniCardName} numberOfLines={1}>{name}</Text>
                    <Text style={styles.miniCardSize}>{size}</Text>
                </View>
                <View style={styles.tapIndicator}>
                    <Text style={styles.tapText}>Tap to see reason</Text>
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={14}
                        color="#606060"
                        style={{ marginLeft: 4 }}
                    />
                </View>
            </View>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.dividerRed} />
                    <Text style={styles.reasonLabel}>Reason:</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const AIScreen = ({ scannedFiles }) => {
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [error, setError] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const runAnalysis = async () => {
        if (!scannedFiles || scannedFiles.length === 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await analyzeFilesWithAI(scannedFiles);
            setAiResult(result);
            setLoading(false);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            console.error(err);
            setError("Failed to analyze files. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        runAnalysis();
    }, [scannedFiles]);

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
