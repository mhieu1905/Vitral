import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';
const router = useRouter();
const settings = [
  { emoji: '⭐', label: 'Notification', bg: 'rgba(181,200,232,0.35)' },
  { emoji: '🎯', label: 'Goals',        bg: 'rgba(212,165,165,0.3)' },
  { emoji: '💡', label: 'Help Data',    bg: 'rgba(242,217,160,0.45)' },
  { emoji: '🔒', label: 'Privacy',      bg: 'rgba(181,200,232,0.3)' },
  { emoji: '🚪', label: 'Sign Out',     bg: 'rgba(212,165,165,0.2)', red: true },
];

export default function ProfileScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title row */}
        <View style={styles.titleRow}>
  <Text style={styles.pageTitle}>Profile</Text>
  <TouchableOpacity onPress={() => router.push('/(tabs)/wellness/edit-profile')}>
    <Text style={styles.editLink}>Edit</Text>
  </TouchableOpacity>
</View>

        {/* Avatar hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MA</Text>
          </View>
          <Text style={styles.name}>Minh Anh</Text>
          <Text style={styles.since}>Member since 2025</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 14 days streak</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['42', 'Workouts'], ['14', 'Days'], ['-4 Kg', 'Progress']].map(([num, lbl], i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statNum, i === 2 && { color: colors.sageD }]}>{num}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Settings list */}
        <View style={styles.settingsList}>
          {settings.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.settingsItem, i === settings.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => {
  if (item.label === 'Privacy') {
    router.push('/(tabs)/wellness/privacy');
  } else if (item.label === 'Help Data') {
    router.push('/(tabs)/wellness/settings');
  }
}}
            >
              <View style={[styles.settingsIcon, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
              </View>
              <Text style={[styles.settingsName, item.red && { color: colors.rose }]}>
                {item.label}
              </Text>
              {!item.red && <Text style={styles.settingsArrow}>›</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
      <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.cream },
  scroll:       { flex: 1, paddingTop: 12 },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24, marginBottom: 16,
  },
  pageTitle:  { fontSize: 22, fontWeight: '600', color: colors.dark },
  editLink:   { fontSize: 14, color: colors.sageD, fontWeight: '500' },
  hero:       { alignItems: 'center', marginBottom: 20, paddingHorizontal: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.rose,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: colors.white },
  name:       { fontSize: 20, fontWeight: '600', color: colors.dark },
  since:      { fontSize: 12, color: colors.muted, marginTop: 2 },
  streakBadge: {
    marginTop: 10, backgroundColor: 'rgba(242,217,160,0.6)',
    borderWidth: 1, borderColor: colors.amber,
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 14,
  },
  streakText: { fontSize: 12, fontWeight: '600', color: '#7A4F00' },
  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 24, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.surface,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  statNum:  { fontSize: 20, fontWeight: '600', color: colors.dark },
  statLbl:  { fontSize: 10, color: colors.muted, marginTop: 2 },
  settingsList: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.surface,
  },
  settingsIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  settingsName: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.dark },
  settingsArrow:{ fontSize: 18, color: colors.hint },
});