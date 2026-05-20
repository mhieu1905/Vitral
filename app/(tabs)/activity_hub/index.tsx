import BottomNav from '@/components/bottom-nav';
import { getActivityHistory, getTodaySummary } from '@/services/activityService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  surface: '#FFFFFF',
  textDark: '#3D3530',
  textMuted: '#8C7B72',
  sage: '#4b6546',
  sageLight: '#A8C5A0',
  accent: '#D4A5A5',
  border: '#F5EFE6',
};

// Tính Vitality Score từ data thật
function calcVitalityScore(calories: number, duration: number, count: number): number {
  const calScore = Math.min((calories / 400) * 40, 40)   // max 40đ
  const durScore = Math.min((duration / 45) * 35, 35)    // max 35đ
  const cntScore = Math.min(count * 8, 25)               // max 25đ
  return Math.round(calScore + durScore + cntScore)
}

export default function FullActivityHub() {
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
      console.log('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const vitalityScore = calcVitalityScore(
    summary.total_calories,
    summary.total_duration,
    summary.activity_count
  );

  // Tính trend so với mục tiêu
  const calorieGoal = 400;
  const durationGoal = 45;
  const calPercent = Math.min((summary.total_calories / calorieGoal) * 100, 100);
  const durPercent = Math.min((summary.total_duration / durationGoal) * 100, 100);

  const getScoreColor = (score: number) => {
    if (score >= 70) return COLORS.sage;
    if (score >= 40) return '#D4A020';
    return COLORS.accent;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return '🔥 Outstanding!';
    if (score >= 40) return '💪 Good!';
    if (score > 0) return '🌱 Keep it up!';
    return '😴 No activity today';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>ACTIVITY HUB</Text>
          <Text style={styles.headline}>Your Activity Today</Text>
        </View>

        {/* Vitality Score — tính từ data thật */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCard}>
            {/* Vòng tròn score */}
            <View style={styles.scoreCircleWrap}>
              <View style={[styles.scoreCircleOuter, {
                borderTopColor: getScoreColor(vitalityScore),
                borderRightColor: vitalityScore > 50 ? getScoreColor(vitalityScore) : '#EBE7DE',
              }]}>
                <View style={styles.scoreCircleInner}>
                  {loading ? (
                    <Text style={styles.scoreLoading}>...</Text>
                  ) : (
                    <>
                      <Text style={styles.scoreLabel}>VITALITY</Text>
                      <Text style={[styles.scoreValue, { color: getScoreColor(vitalityScore) }]}>
                        {vitalityScore}
                      </Text>
                      <Text style={styles.scoreMax}>/100</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Score info */}
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTrend}>{loading ? '' : getScoreLabel(vitalityScore)}</Text>
              <Text style={styles.scoreDesc}>
                {loading ? 'Loading...' : vitalityScore === 0
                  ? 'Start your first session!'
                  : `${summary.activity_count} sessions • ${summary.total_duration} minutes • ${Math.round(summary.total_calories)} kcal`}
              </Text>
            </View>
          </View>
        </View>

        {/* Metric Grid — data thật */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="fire" size={18} color={COLORS.accent} />
              <Text style={styles.metricLabel}>KCAL TODAY</Text>
            </View>
            <Text style={styles.metricValue}>
              {loading ? '--' : Math.round(summary.total_calories)}
            </Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${calPercent}%`,
                backgroundColor: COLORS.accent
              }]} />
            </View>
            <Text style={styles.metricGoal}>Goal: {calorieGoal} kcal</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.sage} />
              <Text style={styles.metricLabel}>MINUTES EXERCISED</Text>
            </View>
            <Text style={styles.metricValue}>
              {loading ? '--' : summary.total_duration}
            </Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${durPercent}%`,
                backgroundColor: COLORS.sage
              }]} />
            </View>
            <Text style={styles.metricGoal}>Goal: {durationGoal} minutes</Text>
          </View>
        </View>

        {/* Quick Log Button */}
        <TouchableOpacity
          style={styles.quickLogBtn}
          onPress={() => router.push('/activity_hub/log_type')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus-circle" size={22} color="#FDF8F3" />
          <Text style={styles.quickLogText}>Log New Activity</Text>
          <Feather name="arrow-right" size={18} color="#FDF8F3" />
        </TouchableOpacity>

        {/* Suggested */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggestions for You</Text>
            <TouchableOpacity onPress={() => router.push('/activity_hub/library')}>
              <Text style={styles.seeAll}>SEE MORE</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.suggestedCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80' }}
              style={styles.suggestedImage}
            />
            <View style={styles.suggestedOverlay}>
              <View style={styles.durationTag}>
                <Text style={styles.durationText}>30 Minutes</Text>
              </View>
              <Text style={styles.suggestedTitle}>Morning jogging session</Text>
            </View>
            <TouchableOpacity
              style={styles.cardFab}
              onPress={() => router.push({ pathname: '/activity_hub/log_detail', params: { type: 'Running' } })}
            >
              <Feather name="plus" size={20} color="#FDF8F3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions — data thật */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity onPress={() => router.push('/activity_hub/healthy')}>
              <Text style={styles.seeAll}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={{ color: COLORS.textMuted, textAlign: 'center', padding: 20 }}>
              Loading...
            </Text>
          ) : recentSessions.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="run" size={36} color="#EBE7DE" />
              <Text style={styles.emptyText}>No sessions yet</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/activity_hub/log_type')}
              >
                <Text style={styles.emptyBtnText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentSessions.map((session: any, index: number) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={[styles.sessionIconBox, {
                  backgroundColor: index % 2 === 0
                    ? COLORS.sageLight + '30'
                    : COLORS.accent + '30'
                }]}>
                  <MaterialCommunityIcons
                    name="run"
                    size={24}
                    color={index % 2 === 0 ? COLORS.sage : '#8C6464'}
                  />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.activity_type}</Text>
                  <Text style={styles.sessionSubtitle}>
                    {session.duration} minutes • {session.intensity === 'low' ? 'Low' : session.intensity === 'medium' ? 'Medium' : 'High'}
                  </Text>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionCal}>{Math.round(session.calories_burned)}</Text>
                  <Text style={styles.sessionCalUnit}>kcal</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fabMain}
        activeOpacity={0.8}
        onPress={() => router.push('/activity_hub/log_type')}
      >
        <Feather name="plus" size={32} color="#FDF8F3" />
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },

  header: { marginBottom: 24 },
  greeting: {
    fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontWeight: '700', marginBottom: 4,
  },
  headline: { fontSize: 28, fontWeight: '700', color: COLORS.textDark },

  // Score Section
  scoreSection: { marginBottom: 28 },
  scoreCard: {
    backgroundColor: COLORS.surface, borderRadius: 28, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 20,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#3D3530', shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  scoreCircleWrap: { width: 110, height: 110 },
  scoreCircleOuter: {
    width: 110, height: 110, borderRadius: 55, borderWidth: 10,
    borderColor: '#EBE7DE', justifyContent: 'center', alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  scoreCircleInner: {
    alignItems: 'center', transform: [{ rotate: '-45deg' }],
  },
  scoreLoading: { fontSize: 20, color: COLORS.textMuted },
  scoreLabel: { fontSize: 8, letterSpacing: 1, color: COLORS.textMuted, fontWeight: '700' },
  scoreValue: { fontSize: 36, fontWeight: '800', lineHeight: 40 },
  scoreMax: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  scoreInfo: { flex: 1 },
  scoreTrend: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 6 },
  scoreDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 18 },

  // Metrics
  metricsRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  metricCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: COLORS.border,
  },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  metricLabel: { fontSize: 9, letterSpacing: 1, color: COLORS.textMuted, fontWeight: '700' },
  metricValue: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
  progressBg: { height: 4, backgroundColor: '#F0EBE5', borderRadius: 2, marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 2 },
  metricGoal: { fontSize: 10, color: COLORS.textMuted },

  // Quick Log
  quickLogBtn: {
    backgroundColor: COLORS.sage, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16,
    marginBottom: 32, shadowColor: COLORS.sage, shadowOpacity: 0.25,
    shadowRadius: 8, elevation: 4,
  },
  quickLogText: { color: '#FDF8F3', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },

  // Sections
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline', marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  seeAll: {
    fontSize: 10, fontWeight: '700', color: COLORS.textMuted,
    letterSpacing: 1, textDecorationLine: 'underline',
  },

  // Suggested
  suggestedCard: { height: 200, backgroundColor: COLORS.surface, borderRadius: 24, overflow: 'hidden' },
  suggestedImage: { width: '100%', height: '100%' },
  suggestedOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end', padding: 16,
  },
  durationTag: {
    backgroundColor: 'rgba(61,53,48,0.6)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 6,
  },
  durationText: { color: '#FDF8F3', fontSize: 11, fontWeight: '700' },
  suggestedTitle: { color: '#FDF8F3', fontSize: 18, fontWeight: '700' },
  cardFab: {
    position: 'absolute', right: 14, bottom: 14, width: 42, height: 42,
    borderRadius: 21, backgroundColor: COLORS.sageLight,
    justifyContent: 'center', alignItems: 'center',
  },

  // Sessions
  sessionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 18, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border, gap: 14,
  },
  sessionIconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  sessionSubtitle: { fontSize: 13, color: COLORS.textMuted },
  sessionRight: { alignItems: 'flex-end' },
  sessionCal: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  sessionCalUnit: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  // Empty
  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  emptyText: { fontSize: 15, color: COLORS.textMuted, marginTop: 10, marginBottom: 16 },
  emptyBtn: {
    backgroundColor: COLORS.sage, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
  },
  emptyBtnText: { color: '#FDF8F3', fontWeight: '700', fontSize: 14 },

  // FAB
  fabMain: {
    position: 'absolute', right: 24, bottom: 100, width: 60, height: 60,
    borderRadius: 30, backgroundColor: COLORS.sage, justifyContent: 'center',
    alignItems: 'center', shadowColor: COLORS.sage, shadowOpacity: 0.3,
    shadowRadius: 10, elevation: 6, zIndex: 100,
  },
});