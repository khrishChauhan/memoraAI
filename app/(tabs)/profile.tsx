import { MockProfileStats } from '@/constants/MockData';
import { Colors, Layout, Typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const ListRow = ({ icon, title, value, isLast = false, isDanger = false }: any) => (
    <Pressable style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Feather name={icon} size={20} color={isDanger ? Colors.danger : Colors.textMuted} />
        <Text style={[styles.rowTitle, isDanger && { color: Colors.danger }]}>{title}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Feather name="chevron-right" size={20} color={Colors.border} />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.card}>
            <ListRow icon="info" title="Version" value={MockProfileStats.version} />
            <ListRow icon="hard-drive" title="Storage Used" value={`${MockProfileStats.storageUsed} GB`} />
            <ListRow icon="cpu" title="AI Status" value={MockProfileStats.aiStatus} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <ListRow icon="lock" title="Privacy & Security" />
            <ListRow icon="settings" title="General Settings" />
            <ListRow icon="help-circle" title="Help & Support" isLast />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={[styles.card, { borderColor: Colors.danger + '40' }]}>
            <ListRow icon="log-out" title="Log Out" isDanger isLast />
          </View>
        </View>
        
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
  scrollContent: {
    paddingTop: Layout.padding * 2,
    paddingHorizontal: Layout.padding,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  name: {
    ...Typography.h2,
    marginBottom: 4,
  },
  email: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Layout.spacing * 1.5,
  },
  sectionTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    ...Typography.body,
    fontWeight: '500',
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textMuted,
  },
});
