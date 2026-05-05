import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
const router = useRouter();

const SECTIONS = [
  {
    id: 'reminders',
    icon: '☀️',
    title: 'DAILY REMINDERS',
    items: [
      { id: 'morning', name: 'Morning Intention', desc: 'Set a focus for your day at 8:00 AM', default: true },
      { id: 'midday', name: 'Mid-Day Breathing', desc: 'A gentle nudge to pause and inhale', default: true },
      { id: 'evening', name: 'Evening Reflection', desc: 'Review your journal before rest', default: false },
    ],
  },
  {
    id: 'achievements',
    icon: '🏆',
    title: 'ACHIEVEMENT ALERTS',
    items: [
      { id: 'milestone', name: 'Milestone Celebrations', desc: 'Unlock badges for consistency', default: true },
      { id: 'personal', name: 'Personal Bests', desc: 'When you exceed your previous records', default: true },
    ],
  },
  {
    id: 'system',
    icon: '⚙️',
    title: 'SYSTEM NOTIFICATIONS',
    items: [
      { id: 'updates', name: 'App Updates', desc: 'Stay informed about new rituals', default: true },
      { id: 'security', name: 'Security & Privacy', desc: 'Important account safety alerts', default: false },
    ],
  },
];

type ToggleState = Record<string, boolean>;

function buildDefaults(): ToggleState {
  const state: ToggleState = {};
  SECTIONS.forEach((s) => s.items.forEach((i) => { state[i.id] = i.default; }));
  return state;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<ToggleState>(buildDefaults);

  const handleToggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/wellness/profile')} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.topBarTitle}>The Sanctuary</Text>
        </TouchableOpacity>
        <View style={styles.avatarSm}>
          <Text style={styles.avatarEmoji}>🧘</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          {/* Decorative circles */}
          <View style={[styles.circle, { width: 200, height: 200, top: -60, left: -40 }]} />
          <View style={[styles.circle, { width: 160, height: 160, top: 10, left: 80 }]} />
          <View style={[styles.circle, { width: 120, height: 120, top: -20, right: -10 }]} />
          <View style={[styles.circle, { width: 80, height: 80, bottom: 10, left: 60 }]} />
          <Text style={styles.heroLabel}>Settings</Text>
        </View>

        {/* Description */}
        <Text style={styles.heroDesc}>
          Customize your digital experience. Choose how and when you want to be reminded to breathe, reflect, and grow.
        </Text>

        {/* Sections */}
        {SECTIONS.map((section, sIdx) => (
          <View key={section.id}>
            <View style={styles.divider} />

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {/* Toggle Items */}
            {section.items.map((item, iIdx) => (
              <View
                key={item.id}
                style={[
                  styles.toggleRow,
                  iIdx < section.items.length - 1 && styles.toggleRowBorder,
                ]}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleName}>{item.name}</Text>
                  <Text style={styles.toggleDesc}>{item.desc}</Text>
                </View>
                <Switch
                  value={toggles[item.id]}
                  onValueChange={(v) => handleToggle(item.id, v)}
                  trackColor={{ false: '#D0CCC4', true: '#4A7C59' }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        ))}

        {/* Auto-save Toast */}
        <View style={styles.toast}>
          <View style={styles.toastDot} />
          <Text style={styles.toastText}>ALL CHANGES ARE SAVED AUTOMATICALLY</Text>
        </View>
      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
            <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EF' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontSize: 20, color: '#2C5F2E' },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#2C5F2E' },
  avatarSm: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#4A9B8E',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },

  scroll: { paddingBottom: 32 },

  heroBanner: {
    height: 140, backgroundColor: '#3A3A34',
    justifyContent: 'flex-end', padding: 16,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute', borderRadius: 999,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  heroLabel: {
    fontSize: 26, fontWeight: '800',
    color: '#E8E4DC', position: 'relative', zIndex: 2,
  },

  heroDesc: {
    fontSize: 13, color: '#6B7060', lineHeight: 20,
    paddingHorizontal: 18, paddingVertical: 14,
  },

  divider: { height: 8, backgroundColor: '#EAE7E0', marginVertical: 4 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 6,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: '#5B7040', letterSpacing: 1,
  },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  toggleRowBorder: {
    borderBottomWidth: 0.5, borderBottomColor: '#EAE7E0',
  },
  toggleInfo: { flex: 1, paddingRight: 16 },
  toggleName: { fontSize: 14, fontWeight: '600', color: '#1A2010', marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: '#9A9A8E', lineHeight: 17 },

  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FDE8E8', borderRadius: 28,
    marginHorizontal: 16, marginTop: 20,
    paddingHorizontal: 18, paddingVertical: 12,
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C0392B' },
  toastText: { fontSize: 11, fontWeight: '700', color: '#9A3030', letterSpacing: 0.8 },
});