import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../utils/supabase';
import { colors } from '../../../theme/colors';
import { useHealthProfileStore } from '../../../store/healthProfileStore';
import {
  GOAL_LABELS,
  GOAL_ICONS,
  ACTIVITY_LABELS,
  GENDER_LABELS,
} from '../../../types/healthProfile';
import { calculateAllMetrics } from '../../../utils/tdeeCalculator';

// ─── Settings menu items ──────────────────────────────────────────────────────
const settings = [
  { emoji: '⭐', label: 'Notification', bg: 'rgba(181,200,232,0.35)' },
  { emoji: '🎯', label: 'Goals',        bg: 'rgba(212,165,165,0.3)' },
  { emoji: '💡', label: 'Help Data',    bg: 'rgba(242,217,160,0.45)' },
  { emoji: '🔒', label: 'Privacy',      bg: 'rgba(181,200,232,0.3)' },
  { emoji: '🚪', label: 'Sign Out',     bg: 'rgba(212,165,165,0.2)', red: true },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, weightHistory, isLoading, fetchProfile, fetchWeightHistory } =
    useHealthProfileStore();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');

  const loadUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User'
        );
        setUserEmail(user.email || '');
        const year = new Date(user.created_at).getFullYear();
        setMemberSince(`Member since ${year}`);
        await fetchProfile(user.id);
        await fetchWeightHistory(user.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [fetchProfile, fetchWeightHistory]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      useHealthProfileStore.getState().clearProfile();
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  // ─── Derived values ──────────────────────────────────────────────────────────
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const latestWeight =
    weightHistory.length > 0 ? weightHistory[0].weight : profile?.weight_kg;

  // Calculate TDEE on the fly (or use backend values)
  const metrics =
    profile
      ? {
          tdee: profile.tdee ?? calculateAllMetrics(
            profile.weight_kg, profile.height_cm, profile.age,
            profile.gender, profile.activity_level, profile.goal
          ).tdee,
          calorieGoal: profile.calorie_goal ?? calculateAllMetrics(
            profile.weight_kg, profile.height_cm, profile.age,
            profile.gender, profile.activity_level, profile.goal
          ).calorieGoal,
        }
      : null;

  // Weight change calculation
  const weightChange =
    weightHistory.length >= 2
      ? weightHistory[0].weight - weightHistory[weightHistory.length - 1].weight
      : null;

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.sageD} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

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
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.since}>{memberSince}</Text>
          {profile && (
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>
                {GOAL_ICONS[profile.goal]} {GOAL_LABELS[profile.goal]}
              </Text>
            </View>
          )}
        </View>

        {/* Health Stats */}
        {profile ? (
          <>
            {/* Primary metrics row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{profile.weight_kg}</Text>
                <Text style={styles.statUnit}>kg</Text>
                <Text style={styles.statLbl}>Weight</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{profile.height_cm}</Text>
                <Text style={styles.statUnit}>cm</Text>
                <Text style={styles.statLbl}>Height</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{profile.age}</Text>
                <Text style={styles.statUnit}>yrs</Text>
                <Text style={styles.statLbl}>Age</Text>
              </View>
            </View>

            {/* TDEE & Calorie Goal */}
            {metrics && (
              <View style={styles.metricsCard}>
                <Text style={styles.metricsLabel}>DAILY ENERGY METRICS</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricIcon}>🔥</Text>
                    <Text style={styles.metricValue}>{Math.round(metrics.tdee)}</Text>
                    <Text style={styles.metricUnit}>TDEE (kcal)</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricIcon}>🎯</Text>
                    <Text style={styles.metricValue}>{Math.round(metrics.calorieGoal)}</Text>
                    <Text style={styles.metricUnit}>Goal (kcal)</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Health info cards */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={[styles.infoCard, { backgroundColor: 'rgba(168,197,160,0.15)' }]}>
                  <Text style={styles.infoEmoji}>🏃</Text>
                  <Text style={styles.infoTitle}>Activity Level</Text>
                  <Text style={styles.infoValue}>{ACTIVITY_LABELS[profile.activity_level]}</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: 'rgba(212,165,165,0.15)' }]}>
                  <Text style={styles.infoEmoji}>👤</Text>
                  <Text style={styles.infoTitle}>Gender</Text>
                  <Text style={styles.infoValue}>{GENDER_LABELS[profile.gender]}</Text>
                </View>
              </View>

              {/* Latest weight & progress */}
              {latestWeight && (
                <View style={styles.weightCard}>
                  <View style={styles.weightCardHeader}>
                    <Text style={styles.weightCardLabel}>LATEST WEIGHT</Text>
                    {weightChange !== null && (
                      <View style={[
                        styles.weightChangeBadge,
                        { backgroundColor: weightChange <= 0 ? 'rgba(168,197,160,0.25)' : 'rgba(212,165,165,0.25)' }
                      ]}>
                        <Text style={[
                          styles.weightChangeText,
                          { color: weightChange <= 0 ? colors.sageD : '#B05060' }
                        ]}>
                          {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.weightValue}>{latestWeight} kg</Text>
                  {weightHistory.length > 0 && (
                    <Text style={styles.weightDate}>
                      Last recorded: {new Date(weightHistory[0].recorded_at).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </>
        ) : (
          /* Empty state */
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Health Profile</Text>
            <Text style={styles.emptySubtitle}>
              Complete your health profile to unlock personalized insights and tracking.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(onboarding)/goal-selection')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Complete Profile →</Text>
            </TouchableOpacity>
          </View>
        )}

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
                } else if (item.label === 'Notification') {
                  router.push('/(tabs)/wellness/settings');
                } else if (item.label === 'Help Data') {
                  router.push('/(tabs)/wellness/settings-about');
                } else if (item.label === 'Goals') {
                  router.push('/(tabs)/wellness/health-goals');
                } else if (item.label === 'Sign Out') {
                  handleSignOut();
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

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1, paddingTop: 12 },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.muted },

  // Header
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24, marginBottom: 16,
  },
  pageTitle: { fontSize: 22, fontWeight: '600', color: colors.dark },
  editLink: { fontSize: 14, color: colors.sageD, fontWeight: '500' },

  // Hero
  hero: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.rose,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: colors.white },
  name: { fontSize: 20, fontWeight: '600', color: colors.dark },
  since: { fontSize: 12, color: colors.muted, marginTop: 2 },
  goalBadge: {
    marginTop: 10, backgroundColor: 'rgba(168,197,160,0.3)',
    borderWidth: 1, borderColor: colors.sage,
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 14,
  },
  goalBadgeText: { fontSize: 12, fontWeight: '600', color: colors.sageD },

  // Stats row
  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 24, marginBottom: 16,
  },
  statCard: {
    flex: 1, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.surface,
    borderRadius: 14, padding: 14, alignItems: 'center',
  },
  statNum: { fontSize: 22, fontWeight: '700', color: colors.dark },
  statUnit: { fontSize: 11, color: colors.muted, marginTop: 1 },
  statLbl: { fontSize: 10, color: colors.hint, marginTop: 4, fontWeight: '500', letterSpacing: 0.5 },

  // Metrics card
  metricsCard: {
    marginHorizontal: 24, marginBottom: 16,
    backgroundColor: colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: colors.surface, padding: 16,
  },
  metricsLabel: {
    fontSize: 10, fontWeight: '700', color: colors.muted,
    letterSpacing: 1.2, marginBottom: 12,
  },
  metricsRow: { flexDirection: 'row', alignItems: 'center' },
  metricItem: { flex: 1, alignItems: 'center', gap: 4 },
  metricIcon: { fontSize: 20 },
  metricValue: { fontSize: 24, fontWeight: '700', color: colors.dark },
  metricUnit: { fontSize: 11, color: colors.muted, fontWeight: '500' },
  metricDivider: { width: 1, height: 40, backgroundColor: colors.surface },

  // Info section
  infoSection: { paddingHorizontal: 24, marginBottom: 16 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  infoCard: {
    flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4,
  },
  infoEmoji: { fontSize: 22 },
  infoTitle: { fontSize: 10, color: colors.muted, fontWeight: '600', letterSpacing: 0.5 },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.dark },

  // Weight card
  weightCard: {
    backgroundColor: colors.white, borderRadius: 14,
    borderWidth: 1, borderColor: colors.surface, padding: 16,
  },
  weightCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  weightCardLabel: {
    fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 1.2,
  },
  weightChangeBadge: { borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 },
  weightChangeText: { fontSize: 11, fontWeight: '600' },
  weightValue: { fontSize: 28, fontWeight: '700', color: colors.dark },
  weightDate: { fontSize: 11, color: colors.hint, marginTop: 4 },

  // Empty state
  emptyState: {
    marginHorizontal: 24, marginBottom: 20,
    backgroundColor: colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: colors.surface,
    padding: 28, alignItems: 'center',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 6 },
  emptySubtitle: {
    fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19, marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: colors.sageD, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },

  // Settings list
  settingsList: { backgroundColor: colors.white, paddingHorizontal: 24 },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.surface,
  },
  settingsIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  settingsName: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.dark },
  settingsArrow: { fontSize: 18, color: colors.hint },
});