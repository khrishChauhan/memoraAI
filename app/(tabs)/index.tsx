import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';

import Header from '@/components/Header';
import ScanButton from '@/components/ScanButton';
import StatCard from '@/components/StatCard';
import SuggestionList from '@/components/SuggestionList';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <ScanButton />

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatCard
            title="Duplicate Files"
            value="0 Found"
            icon="copy-outline"
            accentColor="#f59e0b"
          />
          <StatCard
            title="Forgotten Files"
            value="0 Found"
            icon="time-outline"
            accentColor="#8b5cf6"
          />
          <StatCard
            title="Suggestions"
            value="0 Available"
            icon="bulb-outline"
            accentColor="#10b981"
          />
        </View>

        <SuggestionList />

        {/* Bottom spacing for nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
