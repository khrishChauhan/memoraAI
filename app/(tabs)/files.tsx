import { FileCard } from '@/components/FileCard';
import { GlassSearchBar } from '@/components/GlassSearchBar';
import { Colors, Layout, Typography } from '@/constants/theme';
import { useFilesDatabase } from '@/hooks/useFilesDatabase';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Images', 'Videos', 'Documents', 'Applications', 'Audio', 'Archives', 'Downloads', 'Others'];
const SORTS = ['Newest', 'Oldest', 'Largest', 'Smallest', 'Alphabetical'];

export default function FilesScreen() {
  const { 
    files, 
    activeCategory, setActiveCategory, 
    searchQuery, setSearchQuery,
    sortBy, setSortBy
  } = useFilesDatabase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.headerTitle}>Your Files</Text>
      </Animated.View>
      
      {/* TODO: GlassSearchBar currently doesn't accept a value/onChange prop, assuming we can just add it */}
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

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
        {files.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: Colors.textMuted }}>No files found. Scan some from the Home tab!</Text>
          </View>
        )}
        <View style={{ height: 80 }} />
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
    paddingBottom: Layout.padding,
  },
  categoriesWrapper: {
    marginBottom: Layout.spacing,
  },
  categoriesScroll: {
    paddingHorizontal: Layout.padding,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  categoryText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  categoryTextActive: {
    color: Colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
});
