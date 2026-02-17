import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import ActivityItem from '@/components/ActivityItem';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ScanPanel from '@/components/ScanPanel';
import StatCard from '@/components/StatCard';
import SuggestionList from '@/components/SuggestionList';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <ScanPanel />

        {/* Stats Dashboard — 2x2 grid */}
        <View style={styles.sectionHeader}>
          <Ionicons name="grid-outline" size={16} color="#6366f1" />
          <Text style={styles.sectionTitle}>System Overview</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title="Duplicate Files"
            value="0"
            icon="copy-outline"
            accentColor="#f59e0b"
          />
          <StatCard
            title="Forgotten Files"
            value="0"
            icon="time-outline"
            accentColor="#8b5cf6"
          />
          <StatCard
            title="Important Files"
            value="0"
            icon="star-outline"
            accentColor="#3b82f6"
          />
          <StatCard
            title="Storage Saved"
            value="0 MB"
            icon="server-outline"
            accentColor="#10b981"
          />
        </View>

        {/* AI Insights / Suggestions */}
        <SuggestionList />

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pulse-outline" size={16} color="#22c55e" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityList}>
            <ActivityItem
              icon="checkmark-circle-outline"
              title="App initialized successfully"
              time="Just now"
              accentColor="#22c55e"
            />
            <ActivityItem
              icon="hardware-chip-outline"
              title="AI engine loaded"
              time="Just now"
              accentColor="#3b82f6"
            />
            <ActivityItem
              icon="shield-checkmark-outline"
              title="Privacy mode active"
              time="Just now"
              accentColor="#6366f1"
              isLast
            />
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
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
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
    marginTop: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  activitySection: {
    paddingTop: 8,
  },
  activityList: {
    paddingHorizontal: 24,
  },
  bottomSpacer: {
    height: 20,
  },
});
