/**
 * app/(tabs)/wellness/recommend.tsx
 * Rule-based Health Recommendations
 * GET /recommend
 */

import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../utils/supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:      '#F5F4F0',
  white:   '#FFFFFF',
  surface: '#EDEAE4',
  dark:    '#2C2C2A',
  muted:   '#888780',
  hint:    '#B4B2A9',
  sage:    '#8FAE88',
  sageL:   '#D4E8C2',
  sageD:   '#3B6D11',
  amber:   '#F2B84B',
  amberL:  '#FEF3D7',
  rose:    '#E07A7A',
  roseL:   '#FAE8E8',
  blue:    '#6B9EC4',
  blueL:   '#D6EAF5',
  purple:  '#9B7EC8',
  purpleL: '#EDE5F7',
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string }> = {
  breathing:  { emoji: '🫁', color: C.blue,   bg: C.blueL,   label: 'Breathing'  },
  meditation: { emoji: '🧘', color: C.purple, bg: C.purpleL, label: 'Meditation' },
  journal:    { emoji: '📔', color: C.amber,  bg: C.amberL,  label: 'Journal'    },
  lifestyle:  { emoji: '🌿', color: C.sageD,  bg: C.sageL,   label: 'Lifestyle'  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecommendationItem {
  category:     string;
  title:        string;
  description:  string;
  action_route: string | null;
  priority:     number;
  reason:       string;
}

interface RecommendationResponse {
  recommendations: RecommendationItem[];
  summary:         string;
  stress_avg:      number;
  mood_score:      number;
  journal_streak:  number;
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchRecommendations(): Promise<RecommendationResponse> {
  const { data } = await supabase.auth.getSession();
  const token    = data.session?.access_token ?? '';

  const res = await fetch(`${API_BASE}/recommend`, {
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to load recommendations');
  }
  return res.json();
}

// ─── Mood score → label ───────────────────────────────────────────────────────
// Thang 0-4 sau khi sửa
function moodLabel(score: number): string {
  if (score >= 3)   return 'Good 😊';
  if (score >= 2)   return 'Okay 😐';
  if (score >= 1)   return 'Low 😔';
  return 'Poor 😢';
}
function stressLabel(avg: number): string {
  if (avg === 0)  return 'No data';
  if (avg <= 3)   return 'Low 😌';
  if (avg <= 6)   return 'Moderate 😐';
  return 'High 😰';
}

// ─── Summary banner ───────────────────────────────────────────────────────────
function SummaryBanner({
  summary, stress_avg, mood_score, journal_streak,
}: {
  summary: string; stress_avg: number; mood_score: number; journal_streak: number;
}) {
  const stressColor =
    stress_avg === 0 ? C.hint :
    stress_avg <= 3  ? C.sageD :
    stress_avg <= 6  ? C.amber : C.rose;

  return (
    <View style={sb.card}>
      {/* Summary text */}
      <Text style={sb.summary}>{summary}</Text>

      {/* 3 stat pills */}
      <View style={sb.pillRow}>
        <View style={[sb.pill, { backgroundColor: stressColor + '20' }]}>
          <Text style={[sb.pillNum, { color: stressColor }]}>
            {stress_avg === 0 ? '—' : stress_avg.toFixed(1)}
          </Text>
          <Text style={sb.pillLabel}>Stress avg</Text>
        </View>

        <View style={[sb.pill, { backgroundColor: C.amber + '20' }]}>
          <Text style={[sb.pillNum, { color: C.amber }]}>{moodLabel(mood_score)}</Text>
          <Text style={sb.pillLabel}>Mood</Text>
        </View>

        <View style={[sb.pill, { backgroundColor: C.sageL }]}>
          <Text style={[sb.pillNum, { color: C.sageD }]}>
            {journal_streak > 0 ? `🔥 ${journal_streak}d` : '—'}
          </Text>
          <Text style={sb.pillLabel}>Journal streak</Text>
        </View>
      </View>
    </View>
  );
}
const sb = StyleSheet.create({
  card: {
    backgroundColor: C.white, borderRadius: 18,
    padding: 18, marginBottom: 16,
  },
  summary: {
    fontSize: 14, color: C.dark, lineHeight: 21,
    fontWeight: '500', marginBottom: 14,
  },
  pillRow:  { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1, borderRadius: 12,
    paddingVertical: 10, alignItems: 'center',
  },
  pillNum:   { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  pillLabel: { fontSize: 10, color: C.muted },
});

// ─── Recommendation card ──────────────────────────────────────────────────────
function RecCard({
  item,
  onPress,
  index,
}: {
  item: RecommendationItem;
  onPress: () => void;
  index: number;
}) {
  const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.lifestyle;

  return (
    <TouchableOpacity
      style={[rc.card, index === 0 && rc.cardFirst]}
      onPress={onPress}
      activeOpacity={item.action_route ? 0.8 : 1}
    >
      {/* Top row: icon + category badge */}
      <View style={rc.topRow}>
        <View style={[rc.iconBox, { backgroundColor: cfg.bg }]}>
          <Text style={rc.icon}>{cfg.emoji}</Text>
        </View>
        <View style={[rc.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[rc.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        {item.action_route && (
          <View style={rc.actionHint}>
            <Text style={rc.actionHintText}>Tap →</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={rc.title}>{item.title}</Text>

      {/* Description */}
      <Text style={rc.desc}>{item.description}</Text>

      {/* Reason */}
      <View style={rc.reasonRow}>
        <Text style={rc.reasonIcon}>💡</Text>
        <Text style={rc.reason}>{item.reason}</Text>
      </View>
    </TouchableOpacity>
  );
}
const rc = StyleSheet.create({
  card: {
    backgroundColor: C.white, borderRadius: 18,
    padding: 16, marginBottom: 10,
  },
  cardFirst: {
    borderWidth: 1.5, borderColor: C.sage,
  },
  topRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  icon:        { fontSize: 20 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText:   { fontSize: 11, fontWeight: '600' },
  actionHint:  { marginLeft: 'auto' },
  actionHintText: { fontSize: 11, color: C.hint },
  title: {
    fontSize: 15, fontWeight: '700',
    color: C.dark, marginBottom: 6,
  },
  desc: {
    fontSize: 13, color: C.muted,
    lineHeight: 20, marginBottom: 10,
  },
  reasonRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  reasonIcon: { fontSize: 11, marginTop: 1 },
  reason:     { fontSize: 11, color: C.hint, flex: 1, lineHeight: 16 },
});

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <View style={es.wrap}>
      <Text style={es.emoji}>🌱</Text>
      <Text style={es.title}>No recommendations yet</Text>
      <Text style={es.body}>
        Log your stress and mood for a few days to unlock personalized recommendations.
      </Text>
      <TouchableOpacity style={es.btn} onPress={onRefresh} activeOpacity={0.85}>
        <Text style={es.btnText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
const es = StyleSheet.create({
  wrap:  { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '700', color: C.dark, marginBottom: 8 },
  body:  { fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: {
    backgroundColor: C.sage, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 32,
  },
  btnText: { fontSize: 14, fontWeight: '600', color: C.white },
});

// ─── Category filter tabs ─────────────────────────────────────────────────────
const FILTERS = ['All', 'Breathing', 'Meditation', 'Journal', 'Lifestyle'] as const;
type Filter = typeof FILTERS[number];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RecommendScreen() {
  const router = useRouter();
  const [data,       setData]       = useState<RecommendationResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState<Filter>('All');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);
    try {
      const result = await fetchRecommendations();
      setData(result);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  // Filter recommendations
  const filtered = data?.recommendations.filter(r =>
    filter === 'All' || r.category === filter.toLowerCase()
  ) ?? [];

  const handleCardPress = (item: RecommendationItem) => {
    if (item.action_route) {
      router.push(item.action_route as any);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.push('/(tabs)/wellness/homescreen')}
          activeOpacity={0.7}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Recommendations</Text>
        <TouchableOpacity
          style={s.refreshBtn}
          onPress={() => load(true)}
          activeOpacity={0.7}
        >
          <Text style={s.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={C.sage} />
          <Text style={s.loadingText}>Analyzing your data...</Text>
        </View>
      ) : !data ? (
        <EmptyState onRefresh={() => load()} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={C.sage}
            />
          }
        >
          {/* Summary banner */}
          <SummaryBanner
            summary={data.summary}
            stress_avg={data.stress_avg}
            mood_score={data.mood_score}
            journal_streak={data.journal_streak}
          />

          {/* Section title */}
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>For You</Text>
            <Text style={s.sectionCount}>{filtered.length} tips</Text>
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterRow}
          >
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[s.filterChip, filter === f && s.filterChipActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                {f !== 'All' && (
                  <Text style={s.filterEmoji}>
                    {CATEGORY_CONFIG[f.toLowerCase()]?.emoji}
                  </Text>
                )}
                <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Cards */}
          {filtered.length === 0 ? (
            <Text style={s.empty}>No {filter.toLowerCase()} recommendations right now.</Text>
          ) : (
            filtered.map((item, i) => (
              <RecCard
                key={i}
                item={item}
                index={i}
                onPress={() => handleCardPress(item)}
              />
            ))
          )}

          {/* Footer note */}
          <View style={s.footer}>
            <Text style={s.footerText}>
              🔄 Based on your last 7 days of data. Pull to refresh.
            </Text>
          </View>
        </ScrollView>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 4, paddingBottom: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:    { fontSize: 18, color: C.dark },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: C.dark },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  refreshIcon:  { fontSize: 18, color: C.sageD },

  loadingWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:  { fontSize: 14, color: C.muted },

  scroll:  { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 4 },

  sectionRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.dark },
  sectionCount: { fontSize: 12, color: C.muted },

  filterRow:    { paddingBottom: 12, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.surface,
  },
  filterChipActive: { backgroundColor: C.sage, borderColor: C.sage },
  filterEmoji:      { fontSize: 13 },
  filterText:       { fontSize: 12, fontWeight: '500', color: C.muted },
  filterTextActive: { color: C.white, fontWeight: '700' },

  empty:  { textAlign: 'center', color: C.muted, marginTop: 40, fontSize: 14 },

  footer: {
    alignItems: 'center', paddingTop: 16, paddingBottom: 8,
  },
  footerText: { fontSize: 11, color: C.hint, textAlign: 'center' },
});