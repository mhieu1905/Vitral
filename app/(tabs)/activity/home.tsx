import { getActivityHistory, getTodaySummary } from '@/services/activityService';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3530',
  textMuted: '#8C7B72',
  accent: '#A8C5A0',
  sage: '#526148',
  border: '#F2ECE4',
  card: '#FFFFFF',
};

export default function ActivityHome() {
  const router = useRouter();

  const [summary, setSummary] = useState({
    total_calories: 0,
    total_duration: 0,
    activity_count: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, historyData] = await Promise.all([
        getTodaySummary(),
        getActivityHistory(),
      ]);
      setSummary(summaryData);
      setRecentSessions(historyData.data.slice(0, 3));
    } catch (e) {
      console.log('Lỗi load data:', e);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (route: string) => router.push(route);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>TODAY</Text>
          <Text style={styles.headline}>YOUR ACTIVITIES.</Text>
        </View>

        {/* Ảnh 1 — Banner motivational */}
        <TouchableOpacity
          onPress={() => navigateTo('/activity_hub/log_type')}
          activeOpacity={0.9}
        >
          <View style={styles.bannerCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerLabel}>START NOW</Text>
              <Text style={styles.bannerTitle}>Log New Activity</Text>
              <View style={styles.bannerBtn}>
                <Feather name="plus" size={16} color="#FDF8F3" />
                <Text style={styles.bannerBtnText}>Add</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Metrics từ DB */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionLabel}>STATISTICS TODAY</Text>
          <View style={styles.metricsList}>
            <MetricItem
              label="Calories Burned"
              value={loading ? '...' : String(summary.total_calories)}
              unit="KCAL"
              icon="fire"
              color="#D4A5A5"
            />
            <MetricItem
              label="Duration"
              value={loading ? '...' : String(summary.total_duration)}
              unit="MINUTES"
              icon="clock-outline"
              color="#B5C8E8"
            />
            <MetricItem
              label="Number of training sessions"
              value={loading ? '...' : String(summary.activity_count)}
              unit="SESSIONS"
              icon="checkbox-marked-circle-outline"
              color="#A8C5A0"
            />
          </View>
        </View>

        {/* Recent Sessions từ DB */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
            <TouchableOpacity onPress={() => navigateTo('/activity_hub')}>
              <Text style={styles.seeAll}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : recentSessions.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="run" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No activities logged today</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigateTo('/activity_hub/log_type')}
              >
                <Text style={styles.emptyBtnText}>Log new activity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentSessions.map((session: any) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionLeft}>
                  <View style={styles.sessionIcon}>
                    <MaterialCommunityIcons name="run" size={24} color={COLORS.sage} />
                  </View>
                  <View>
                    <Text style={styles.sessionTitle}>{session.activity_type}</Text>
                    <Text style={styles.sessionSubtitle}>
                      {session.duration} minutes • {session.intensity}
                    </Text>
                  </View>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionCalories}>{session.calories_burned}</Text>
                  <Text style={styles.sessionUnit}>kcal</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Ảnh 2 — Banner wellness */}
        <View style={styles.wellnessCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' }}
            style={styles.wellnessImage}
            resizeMode="cover"
          />
          <View style={styles.wellnessOverlay}>
            <Text style={styles.wellnessLabel}>TIP OF THE DAY</Text>
            <Text style={styles.wellnessTitle}>
              Exercising for 30 minutes daily can significantly improve cardiovascular health.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <NavItem icon="grid-outline" label="HUB" onPress={() => navigateTo('/activity_hub')} />
        <NavItem icon="add-circle-outline" label="LOG" onPress={() => navigateTo('/activity_hub/log_type')} />
        <NavItem icon="book-outline" label="LIBRARY" onPress={() => navigateTo('/activity_hub/library')} />
        <NavItem icon="stats-chart-outline" label="INSIGHTS" onPress={() => navigateTo('/activity_hub/healthy')} />
      </View>
    </SafeAreaView>
  );
}

const MetricItem = ({ label, value, unit, icon, color }) => (
  <View style={styles.metricRow}>
    <View style={styles.metricLeft}>
      <View style={[styles.metricIcon, { backgroundColor: color + '30' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
    <View style={styles.metricValueContainer}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}> {unit}</Text>
    </View>
  </View>
);

const NavItem = ({ icon, label, active = false, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      <Ionicons name={icon} size={22} color={active ? COLORS.textDark : COLORS.textMuted} />
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40 },
  header: { marginBottom: 32 },
  greeting: {
    fontSize: 12, letterSpacing: 1, color: COLORS.textMuted,
    fontWeight: '700', marginBottom: 8,
  },
  headline: {
    fontSize: 34, fontWeight: '700', color: COLORS.textDark, lineHeight: 40,
  },

  // Banner 1
  bannerCard: {
    height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 32,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  bannerLabel: {
    color: '#FDF8F3', fontSize: 10, fontWeight: '800',
    letterSpacing: 1.5, marginBottom: 4,
  },
  bannerTitle: {
    color: '#FDF8F3', fontSize: 24, fontWeight: '700', marginBottom: 12,
  },
  bannerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.sage, paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start',
  },
  bannerBtnText: { color: '#FDF8F3', fontSize: 14, fontWeight: '700' },

  // Metrics
  metricsSection: { marginBottom: 32 },
  metricsList: {
    backgroundColor: COLORS.card, borderRadius: 20,
    paddingHorizontal: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  metricRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  metricLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metricIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  metricLabel: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
  metricValueContainer: { flexDirection: 'row', alignItems: 'baseline' },
  metricValue: { fontSize: 24, fontWeight: '700', color: COLORS.textDark },
  metricUnit: { fontSize: 12, fontWeight: '700', color: '#CBC5BB' },

  // Section
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10, letterSpacing: 1.5, color: COLORS.textMuted,
    fontWeight: '700', marginBottom: 16,
  },
  seeAll: { fontSize: 12, fontWeight: '700', color: COLORS.sage },

  // Session Cards
  sessionCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sessionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: COLORS.accent + '30',
    justifyContent: 'center', alignItems: 'center',
  },
  sessionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  sessionSubtitle: { fontSize: 13, color: COLORS.textMuted },
  sessionRight: { alignItems: 'flex-end' },
  sessionCalories: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  sessionUnit: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  // Empty state
  emptyCard: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  emptyText: { fontSize: 15, color: COLORS.textMuted, marginTop: 12, textAlign: 'center' },
  emptyBtn: {
    marginTop: 16, backgroundColor: COLORS.sage,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  emptyBtnText: { color: '#FDF8F3', fontWeight: '700', fontSize: 15 },

  // Banner 2
  wellnessCard: {
    height: 160, borderRadius: 24, overflow: 'hidden', marginBottom: 16,
  },
  wellnessImage: { width: '100%', height: '100%' },
  wellnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(82, 97, 72, 0.75)',
    justifyContent: 'center', padding: 24,
  },
  wellnessLabel: {
    color: '#A8C5A0', fontSize: 10, fontWeight: '800',
    letterSpacing: 1.5, marginBottom: 8,
  },
  wellnessTitle: {
    color: '#FDF8F3', fontSize: 16, fontWeight: '600', lineHeight: 24,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute', bottom: 0, flexDirection: 'row',
    justifyContent: 'space-around', alignItems: 'center', width: '100%',
    backgroundColor: '#FDF8F3FA', paddingBottom: 16, paddingTop: 16,
    borderTopWidth: 1, borderColor: COLORS.border,
  },
  navItem: { alignItems: 'center', gap: 4, flex: 1 },
  navIconContainer: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12 },
  navIconActive: { backgroundColor: '#A8C5A020' },
  navText: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted },
  navTextActive: { color: COLORS.textDark },
});