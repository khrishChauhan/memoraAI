import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Header } from '../components/Header';
import { InsightCard } from '../components/InsightCard';
import { ScanCard } from '../components/ScanCard';
import { StatCard } from '../components/StatCard';
import { Colors } from '../constants/Colors';

const INSIGHTS = [
    {
        icon: 'copy' as const,
        title: 'Duplicate resumes found',
        description: 'Multiple resume versions detected. Keep latest version to free up space.',
    },
    {
        icon: 'image' as const,
        title: 'Old screenshots detected',
        description: '34 screenshots from 6+ months ago. Review and clean up to save 280 MB.',
    },
    {
        icon: 'video' as const,
        title: 'Large video files',
        description: "3 videos totaling 2.1 GB haven't been accessed in 90 days.",
    },
    {
        icon: 'download' as const,
        title: 'Unused downloads',
        description: "12 files in Downloads haven't been opened since being downloaded.",
    },
];

const HomeScreen = () => {
    const handleScan = () => {
        console.log('Scanning...');
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

                <ScanCard onScan={handleScan} />

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard title="Duplicates" value={0} delay={300} />
                    <StatCard title="Suggestions" value={0} delay={400} />
                    <StatCard title="Unused" value={0} delay={500} />
                </View>

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
});

export default HomeScreen;
