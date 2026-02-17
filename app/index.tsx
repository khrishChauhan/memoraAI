import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Header from '@/components/Header';
import ResultSection from '@/components/ResultSection';
import ScanButton from '@/components/ScanButton';
import SuggestionCard from '@/components/SuggestionCard';

export default function HomeScreen() {
    const [isScanning, setIsScanning] = useState(false);
    const [duplicates, setDuplicates] = useState<string[]>([]);
    const [forgotten, setForgotten] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<
        { title: string; description: string; action?: string }[]
    >([]);

    const handleScan = () => {
        setIsScanning(true);

        // Simulate scan with demo data after 2 seconds
        setTimeout(() => {
            setDuplicates([
                'IMG_2024_copy.jpg',
                'resume_final_final_v2.pdf',
                'Screenshot_20230914.png',
            ]);
            setForgotten([
                'project_proposal.docx (6 months ago)',
                'tax_receipt_2023.pdf (1 year ago)',
                'notes_meeting.txt (8 months ago)',
            ]);
            setSuggestions([
                {
                    title: 'Add project to resume',
                    description: 'Found "project_proposal.docx" — it may contain work worth adding to your resume.',
                    action: 'View File',
                },
                {
                    title: 'Clean up duplicates',
                    description: 'You have 3 duplicate files taking up 12 MB of space.',
                    action: 'Review',
                },
                {
                    title: 'Back up tax documents',
                    description: 'Important file "tax_receipt_2023.pdf" has not been backed up.',
                },
            ]);
            setIsScanning(false);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header />

                <ScanButton onPress={handleScan} isScanning={isScanning} />

                {/* Results */}
                <View style={styles.results}>
                    <ResultSection
                        title="Duplicate Files"
                        icon="copy-outline"
                        items={duplicates}
                        emptyText="No duplicates found yet."
                    />

                    <ResultSection
                        title="Forgotten Files"
                        icon="time-outline"
                        items={forgotten}
                        emptyText="No forgotten files detected."
                    />

                    {/* Suggestions */}
                    <View style={styles.suggestionsSection}>
                        <Text style={styles.suggestionsTitle}>AI Suggestions</Text>
                        {suggestions.length === 0 ? (
                            <Text style={styles.emptyText}>
                                No suggestions yet. Tap "Scan Files" to get started.
                            </Text>
                        ) : (
                            suggestions.map((s, i) => (
                                <SuggestionCard
                                    key={i}
                                    title={s.title}
                                    description={s.description}
                                    actionLabel={s.action}
                                />
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    results: {
        paddingHorizontal: 24,
    },
    suggestionsSection: {
        marginTop: 4,
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 13,
        color: '#475569',
        fontStyle: 'italic',
    },
});
