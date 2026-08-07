import { FileCard } from '@/components/FileCard';
import { GlassSearchBar } from '@/components/GlassSearchBar';
import { Colors, Layout, Typography } from '@/constants/theme';
import { useFilesDatabase } from '@/hooks/useFilesDatabase';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Images', 'Videos', 'Documents', 'Applications', 'Audio', 'Archives', 'Downloads', 'Others'];
const SORTS = ['Newest', 'Oldest', 'Largest', 'Smallest', 'Alphabetical'];

export default function FilesScreen() {
  const { 
    files, 
    loading,
    activeCategory, setActiveCategory, 
    searchQuery, setSearchQuery,
    sortBy, setSortBy
  } = useFilesDatabase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.headerTitle}>Your Files</Text>
        <Text style={styles.headerSubtitle}>Search, sort, and review the library you’ve scanned.</Text>
      </Animated.View>
      
      <GlassSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <Pressable 
              key={cat} 
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortWrapper}>
        <Text style={styles.sortLabel}>Sort</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
          {SORTS.map((sort) => (
            <Pressable
              key={sort}
              style={[styles.sortChip, sortBy === sort && styles.sortChipActive]}
              onPress={() => setSortBy(sort)}
            >
              <Text style={[styles.sortText, sortBy === sort && styles.sortTextActive]}>{sort}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={Colors.accent} />
            <Text style={styles.centerStateText}>Loading your library…</Text>
          </View>
        ) : files.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>No files found</Text>
            <Text style={styles.centerStateText}>Scan some files from the Home tab to start building your memory.</Text>
          </View>
        ) : (
          files.map((file) => <FileCard key={file.id} file={file} />)
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    ...Typography.h1,
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    paddingHorizontal: Layout.padding,
    marginBottom: Layout.spacing,
  },
  categoriesWrapper: {
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: Layout.padding,
    gap: 10,
  },
  categoryChip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  categoryTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  sortWrapper: {
    marginBottom: Layout.spacing,
  },
  sortLabel: {
    ...Typography.small,
    color: Colors.textMuted,
    paddingHorizontal: Layout.padding,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sortScroll: {
    paddingHorizontal: Layout.padding,
    gap: 10,
  },
  sortChip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.accent,
  },
  sortText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  sortTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  centerState: {
    paddingHorizontal: Layout.padding,
    paddingVertical: 40,
    alignItems: 'center',
  },
  centerStateText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    marginBottom: 4,
  },
});
