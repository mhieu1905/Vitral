/**
 * app/(tabs)/wellness/stress.tsx
 * Stress Tracking — log, history, trend analysis
 *
 * Calls Python backend:
 *   POST /stress/log
 *   GET  /stress/history
 *   GET  /stress/stats
 */

import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../utils/supabase';

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
const { width: SW } = Dimensions.get('window');

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
};

// Màu theo mức stress 1-10
function levelColor(lvl: number): string {
  if (lvl <= 3) return C.sage;
  if (lvl <= 6) return C.amber;
  return C.rose;
}
function levelLabel(lvl: number): string {
  if (lvl <= 2) return 'Very Calm';
  if (lvl <= 4) return 'Relaxed';
  if (lvl <= 6) return 'Moderate';
  if (lvl <= 8) return 'Stressed';
  return 'Very High';
}
function levelEmoji(lvl: number): string {
  if (lvl <= 2) return '😌';
  if (lvl <= 4) return '🙂';
  if (lvl <= 6) return '😐';
  if (lvl <= 8) return '😰';
  return '😫';
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface StressLog {
  id: string;
  stress_level: number;
  note: string;
  triggers: string[];
  logged_at: string;
}

interface TrendPoint {
  date: string;
  avg_level: number;
  count: number;
}

interface StressStats {
  avg_7days: number;
  avg_30days: number;
  highest: number;
  lowest: number;
  total_logs: number;
  trend: TrendPoint[];
}

// ─── API helper ───────────────────────────────────────────────────────────────
async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function apiPost(path: string, body: object) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Request failed');
  }
  return res.json();
}

async function apiGet(path: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Request failed');
  }
  return res.json();
}

// ─── Trigger chips ────────────────────────────────────────────────────────────
const TRIGGER_OPTIONS = [
  'Work', 'Sleep', 'Health', 'Relationship',
  'Finance', 'Family', 'Social', 'Other',
];

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function TrendChart({ trend }: { trend: TrendPoint[] }) {
  if (!trend.length) return null;

  const max = Math.max(...trend.map(t => t.avg_level), 1);
  const chartH = 80;

  return (
    <View style={tc.wrap}>
      {trend.map((t, i) => {
        const barH = Math.max((t.avg_level / max) * chartH, 6);
        const color = levelColor(Math.round(t.avg_level));
        const dayLabel = new Date(t.date + 'T00:00:00')
          .toLocaleDateString('en', { weekday: 'short' });
        return (
          <View key={i} style={tc.col}>
            <Text style={tc.val}>{t.avg_level.toFixed(1)}</Text>
            <View style={[tc.track, { height: chartH }]}>
              <View style={[tc.bar, { height: barH, backgroundColor: color }]} />
            </View>
            <Text style={tc.day}>{dayLabel}</Text>
          </View>
        );
      })}
    </View>
  );
}
const tc = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: 4 },
  col:  { flex: 1, alignItems: 'center', gap: 4 },
  track:{ width: '100%', justifyContent: 'flex-end', borderRadius: 6, backgroundColor: C.surface },
  bar:  { width: '100%', borderRadius: 6 },
  val:  { fontSize: 9, color: C.muted, fontWeight: '600' },
  day:  { fontSize: 9, color: C.hint },
});

// ─── History item ─────────────────────────────────────────────────────────────
function HistoryItem({ item }: { item: StressLog }) {
  const d = new Date(item.logged_at);
  const color = levelColor(item.stress_level);
  return (
    <View style={hi.card}>
      <View style={[hi.badge, { backgroundColor: color + '22' }]}>
        <Text style={[hi.badgeNum, { color }]}>{item.stress_level}</Text>
        <Text style={hi.badgeLabel}>{levelEmoji(item.stress_level)}</Text>
      </View>
      <View style={hi.body}>
        <View style={hi.topRow}>
          <Text style={[hi.levelText, { color }]}>{levelLabel(item.stress_level)}</Text>
          <Text style={hi.time}>
            {d.toLocaleDateString('en', { month: 'short', day: '2-digit' })}
            {' · '}
            {d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.note ? (
          <Text style={hi.note} numberOfLines={2}>{item.note}</Text>
        ) : null}
        {item.triggers?.length > 0 && (
          <View style={hi.tags}>
            {item.triggers.map((t, i) => (
              <View key={i} style={hi.tag}>
                <Text style={hi.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
const hi = StyleSheet.create({
  card:      { backgroundColor: C.white, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', gap: 12 },
  badge:     { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badgeNum:  { fontSize: 18, fontWeight: '700' },
  badgeLabel:{ fontSize: 16 },
  body:      { flex: 1 },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  levelText: { fontSize: 13, fontWeight: '600' },
  time:      { fontSize: 10, color: C.hint },
  note:      { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 6 },
  tags:      { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag:       { backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  tagText:   { fontSize: 10, color: C.muted },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
type Tab = 'log' | 'history' | 'stats';

export default function StressScreen() {
  const router = useRouter();

  // ── Tab ──
  const [tab, setTab] = useState<Tab>('log');

  // ── Log form ──
  const [level,    setLevel]    = useState(5);
  const [note,     setNote]     = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [saving,   setSaving]   = useState(false);

  // ── Data ──
  const [history,  setHistory]  = useState<StressLog[]>([]);
  const [stats,    setStats]    = useState<StressStats | null>(null);
  const [loading,  setLoading]  = useState(false);

  // ── Slider animation ──
  const sliderAnim = useRef(new Animated.Value(level)).current;

  const animateLevel = (val: number) => {
    setLevel(val);
    Animated.spring(sliderAnim, {
      toValue: val,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  // Fetch khi chuyển tab
  useEffect(() => {
    if (tab === 'history') fetchHistory();
    if (tab === 'stats')   fetchStats();
  }, [tab]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/stress/history?limit=30');
      setHistory(data);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/stress/stats');
      setStats(data);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await apiPost('/stress/log', {
        stress_level: level,
        note:         note.trim(),
        triggers,
      });
      // reset
      setNote('');
      setTriggers([]);
      animateLevel(5);
      Alert.alert('✓ Saved', 'Stress log recorded!');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTrigger = (t: string) =>
    setTriggers(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const color = levelColor(level);

  // ── Step buttons for level (1-10) ──
  const LevelPicker = () => (
    <View style={s.levelWrap}>
      {/* Big display */}
      <View style={[s.levelCircle, { borderColor: color, backgroundColor: color + '18' }]}>
        <Text style={s.levelEmoji}>{levelEmoji(level)}</Text>
        <Text style={[s.levelNum, { color }]}>{level}</Text>
        <Text style={[s.levelTag, { color }]}>{levelLabel(level)}</Text>
      </View>

      {/* 1-10 buttons */}
      <View style={s.levelGrid}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
          const active = n === level;
          const c = levelColor(n);
          return (
            <TouchableOpacity
              key={n}
              style={[s.levelBtn, active && { backgroundColor: c, borderColor: c }]}
              onPress={() => animateLevel(n)}
              activeOpacity={0.7}
            >
              <Text style={[s.levelBtnText, active && { color: C.white }]}>{n}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ── LOG tab ───────────────────────────────────────────────────────────────
  const LogTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.tabContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.sectionTitle}>How stressed are you?</Text>
      <LevelPicker />

      {/* Note */}
      <Text style={s.sectionTitle}>What's on your mind?</Text>
      <TextInput
        style={s.noteInput}
        placeholder="Write what's causing stress..."
        placeholderTextColor={C.hint}
        multiline
        value={note}
        onChangeText={setNote}
        textAlignVertical="top"
        selectionColor={C.sage}
      />

      {/* Triggers */}
      <Text style={s.sectionTitle}>Triggers</Text>
      <View style={s.triggerGrid}>
        {TRIGGER_OPTIONS.map(t => {
          const sel = triggers.includes(t);
          return (
            <TouchableOpacity
              key={t}
              style={[s.triggerChip, sel && { backgroundColor: C.sage, borderColor: C.sage }]}
              onPress={() => toggleTrigger(t)}
              activeOpacity={0.8}
            >
              <Text style={[s.triggerText, sel && { color: C.white }]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Save */}
      <TouchableOpacity
        style={[s.saveBtn, { backgroundColor: color }, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator color={C.white} />
          : <Text style={s.saveBtnText}>Save Stress Log</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );

  // ── HISTORY tab ───────────────────────────────────────────────────────────
  const HistoryTab = () => (
    loading
      ? <ActivityIndicator style={{ marginTop: 48 }} color={C.sage} />
      : history.length === 0
        ? <Text style={s.empty}>No stress logs yet.</Text>
        : <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.tabContent}
          >
            {history.map(item => <HistoryItem key={item.id} item={item} />)}
          </ScrollView>
  );

  // ── STATS tab ─────────────────────────────────────────────────────────────
  const StatsTab = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 48 }} color={C.sage} />;
    if (!stats || stats.total_logs === 0)
      return <Text style={s.empty}>Log some stress first.</Text>;

    const cards = [
      { label: '7-day avg',  value: stats.avg_7days.toFixed(1),  color: levelColor(Math.round(stats.avg_7days)),  bg: levelColor(Math.round(stats.avg_7days)) + '18' },
      { label: '30-day avg', value: stats.avg_30days.toFixed(1), color: levelColor(Math.round(stats.avg_30days)), bg: levelColor(Math.round(stats.avg_30days)) + '18' },
      { label: 'Highest',    value: stats.highest.toString(),    color: C.rose,  bg: C.roseL  },
      { label: 'Lowest',     value: stats.lowest.toString(),     color: C.sageD, bg: C.sageL  },
    ];

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.tabContent}
      >
        {/* Stat cards */}
        <View style={s.statGrid}>
          {cards.map((c, i) => (
            <View key={i} style={[s.statCard, { backgroundColor: c.bg }]}>
              <Text style={[s.statNum, { color: c.color }]}>{c.value}</Text>
              <Text style={s.statLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={s.totalBadge}>
          <Text style={s.totalText}>
            📊 {stats.total_logs} total logs in last 30 days
          </Text>
        </View>

        {/* Trend chart */}
        {stats.trend.length > 0 && (
          <View style={s.chartCard}>
            <Text style={s.chartTitle}>7-Day Trend</Text>
            <TrendChart trend={stats.trend} />
            <View style={s.legend}>
              {[
                { color: C.sage,  label: 'Calm (1-3)'   },
                { color: C.amber, label: 'Moderate (4-6)'},
                { color: C.rose,  label: 'High (7-10)'  },
              ].map((l, i) => (
                <View key={i} style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: l.color }]} />
                  <Text style={s.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Insight */}
        <View style={s.insightCard}>
          <Text style={s.insightIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.insightTitle}>Insight</Text>
            <Text style={s.insightBody}>
              {stats.avg_7days <= 3
                ? "You're managing stress well this week. Keep it up!"
                : stats.avg_7days <= 6
                ? "Moderate stress detected. Try a breathing exercise."
                : "High stress this week. Consider taking a break or journaling."}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.push('/(tabs)/wellness/homescreen')}
          activeOpacity={0.7}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Stress Tracker</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['log', 'history', 'stats'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[s.tabBtn, tab === t && s.tabBtnActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabBtnText, tab === t && s.tabBtnTextActive]}>
              {t === 'log' ? '📝 Log' : t === 'history' ? '📋 History' : '📊 Stats'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {tab === 'log'     && <LogTab />}
      {tab === 'history' && <HistoryTab />}
      {tab === 'stats'   && <StatsTab />}

      <BottomNav />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 4, paddingBottom: 8,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontSize: 18, color: C.dark },
  headerTitle: { fontSize: 18, fontWeight: '600', color: C.dark },

  // Tabs
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20, marginBottom: 4,
    backgroundColor: C.surface,
    borderRadius: 14, padding: 4, gap: 2,
  },
  tabBtn: {
    flex: 1, paddingVertical: 9,
    borderRadius: 10, alignItems: 'center',
  },
  tabBtnActive:     { backgroundColor: C.white },
  tabBtnText:       { fontSize: 12, color: C.muted, fontWeight: '500' },
  tabBtnTextActive: { color: C.dark, fontWeight: '700' },

  tabContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 12 },

  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: C.muted,
    letterSpacing: 0.4, marginBottom: 10, marginTop: 4,
    textTransform: 'uppercase',
  },

  // Level picker
  levelWrap: { alignItems: 'center', marginBottom: 20 },
  levelCircle: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  levelEmoji: { fontSize: 28, marginBottom: 2 },
  levelNum:   { fontSize: 32, fontWeight: '800', lineHeight: 36 },
  levelTag:   { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },

  levelGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, justifyContent: 'center', width: '100%',
  },
  levelBtn: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  levelBtnText: { fontSize: 15, fontWeight: '600', color: C.muted },

  // Note
  noteInput: {
    backgroundColor: C.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.surface,
    padding: 14, fontSize: 14, color: C.dark,
    minHeight: 90, lineHeight: 21, marginBottom: 20,
  },

  // Triggers
  triggerGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24,
  },
  triggerChip: {
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.surface,
  },
  triggerText: { fontSize: 13, fontWeight: '500', color: C.muted },

  // Save button
  saveBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 4,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: C.white },

  // History
  empty: {
    textAlign: 'center', color: C.muted,
    marginTop: 60, fontSize: 14,
  },

  // Stats
  statGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12,
  },
  statCard: {
    width: (SW - 52) / 2, borderRadius: 16,
    padding: 16, alignItems: 'center',
  },
  statNum:   { fontSize: 28, fontWeight: '800', color: C.dark },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 4, fontWeight: '500' },

  totalBadge: {
    backgroundColor: C.blueL, borderRadius: 12,
    padding: 12, alignItems: 'center', marginBottom: 16,
  },
  totalText: { fontSize: 13, color: C.blue, fontWeight: '600' },

  chartCard: {
    backgroundColor: C.white, borderRadius: 16,
    padding: 16, marginBottom: 14,
  },
  chartTitle: { fontSize: 13, fontWeight: '700', color: C.dark, marginBottom: 12 },
  legend:     { flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: C.muted },

  insightCard: {
    backgroundColor: C.amberL, borderRadius: 16,
    padding: 16, flexDirection: 'row', gap: 12,
  },
  insightIcon:  { fontSize: 24 },
  insightTitle: { fontSize: 13, fontWeight: '700', color: C.dark, marginBottom: 4 },
  insightBody:  { fontSize: 13, color: C.muted, lineHeight: 19 },
});