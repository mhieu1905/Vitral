import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const SOUNDS = [
  { id: 'rain',  emoji: '🌧️', label: 'Rain' },
  { id: 'forest',emoji: '🌲', label: 'Forest' },
  { id: 'white', emoji: '💨', label: 'White Noise' },
];

const SESSIONS = [
  { id: '1', emoji: '🌲', name: 'Deep Focus',    meta: 'Yesterday • 15 min' },
  { id: '2', emoji: '🌙', name: 'Sleep Release', meta: 'Tuesday • 20 min' },
  { id: '3', emoji: '☀️', name: 'Morning Light', meta: 'Monday • 10 min' },
];

const WEEK_DAYS = ['M','T','W','T','F','S','S'];
const TOTAL_SECS = 12 * 60;

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

export default function MeditationScreen() {
  const router = useRouter();
  const [running, setRunning]       = useState(true);
  const [remaining, setRemaining]   = useState(TOTAL_SECS);
  const [sound, setSound]           = useState('rain');
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringAnim                    = useRef(new Animated.Value(1)).current;

  /* ── Timer logic ── */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { clearInterval(intervalRef.current!); setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  /* ── Ring pulse animation when running ── */
  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ringAnim, { toValue: 1.04, duration: 1500, useNativeDriver: true }),
          Animated.timing(ringAnim, { toValue: 1,    duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      ringAnim.stopAnimation();
      ringAnim.setValue(1);
    }
  }, [running]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = remaining / TOTAL_SECS; // 1 → 0

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/wellness')} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backTitle}>Meditation</Text>
        </TouchableOpacity>
        <View style={styles.streakWrap}>
          <View style={styles.streakInfo}>
            <Text style={styles.streakSub}>CURRENT STREAK</Text>
            <Text style={styles.streakVal}>5 days</Text>
          </View>
          <View style={styles.avatarSm}>
            <Text style={styles.avatarEmoji}>🧑‍💼</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Timer Section ── */}
        <View style={styles.timerSection}>
          <Text style={styles.timerLbl}>BREATHING SESSION</Text>

          <Animated.View style={[styles.ringWrap, { transform: [{ scale: ringAnim }] }]}>
            {/* Background ring */}
            <View style={styles.ringBg} />
            {/* Progress arc overlay (simplified) */}
            <View style={[
              styles.ringProgress,
              { borderTopColor: progress > 0.75 ? '#4A7C59' : 'transparent',
                borderRightColor: progress > 0.5  ? '#4A7C59' : 'transparent',
                borderBottomColor: progress > 0.25 ? '#4A7C59' : 'transparent',
                borderLeftColor: '#4A7C59' },
            ]} />
            <View style={styles.timerInner}>
              <Text style={styles.timerTime}>{pad(minutes)}:{pad(seconds)}</Text>
              <Text style={styles.timerRemaining}>remaining</Text>
            </View>
          </Animated.View>

          {/* Controls */}
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={styles.ctrlBtn}
              onPress={() => setRemaining((r) => Math.max(0, r - 10))}
            >
              <Text style={styles.ctrlBtnText}>↺ 10</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.playBtn} onPress={() => setRunning((r) => !r)}>
              {running ? (
                <View style={styles.pauseBars}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              ) : (
                <View style={styles.playIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctrlBtn}
              onPress={() => setRemaining((r) => Math.min(TOTAL_SECS, r + 10))}
            >
              <Text style={styles.ctrlBtnText}>10 ↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Atmosphere ── */}
        <View style={styles.section}>
          <View style={styles.atmoHeader}>
            <Text style={styles.sectionTitle}>Atmosphere</Text>
            <Text style={styles.atmoSub}>AMBIENT SOUND</Text>
          </View>

          <View style={styles.soundRow}>
            {SOUNDS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.soundCard, sound === s.id && styles.soundCardActive]}
                onPress={() => setSound(s.id)}
              >
                <Text style={styles.soundEmoji}>{s.emoji}</Text>
                <Text style={styles.soundLbl}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.volRow}>
            <Text style={styles.volLbl}>VOLUME</Text>
            <Text style={styles.volPct}>75%</Text>
          </View>
          <View style={styles.volBarWrap}>
            <View style={[styles.volBar, { width: '75%' }]} />
          </View>
        </View>

        {/* ── Mindfulness Streak ── */}
        <View style={styles.streakSection}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={styles.streakBadgeLbl}>MINDFULNESS STREAK</Text>
          <View style={styles.streakNumRow}>
            <Text style={styles.streakBigNum}>5</Text>
            <Text style={styles.streakRowText}>days in a row</Text>
          </View>
          <Text style={styles.streakDesc}>
            You're in the top 10% of practitioners this week. Keep breathing.
          </Text>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((d, i) => (
              <View key={i} style={[styles.dayCircle, i === 4 && styles.dayCircleActive]}>
                <Text style={[styles.dayLbl, i === 4 && styles.dayLblActive]}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Sessions ── */}
        <View style={styles.section}>
          <View style={styles.sessionsHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </View>
          {SESSIONS.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sessionItem, i < SESSIONS.length - 1 && styles.sessionItemBorder]}
            >
              <View style={styles.sessionIcon}>
                <Text style={styles.sessionEmoji}>{s.emoji}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>{s.name}</Text>
                <Text style={styles.sessionMeta}>{s.meta}</Text>
              </View>
              <Text style={styles.sessionArr}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Daily Insight Banner ── */}
        <View style={styles.insightBanner}>
          <View style={styles.insightDeco} />
          <Text style={styles.insightTag}>DAILY INSIGHT</Text>
          <Text style={styles.insightQuote}>
            "Feel the breath moving through your body like a wave."
          </Text>
        </View>

      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
            <BottomNav/>
    </SafeAreaView>
  );
}

const RING_SIZE = 180;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EF' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backArrow: { fontSize: 20, color: '#3A6B3A' },
  backTitle: { fontSize: 16, fontWeight: '700', color: '#3A6B3A' },
  streakWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakInfo: { alignItems: 'flex-end' },
  streakSub: { fontSize: 9, color: '#9A9A8E', letterSpacing: 0.5 },
  streakVal: { fontSize: 13, fontWeight: '700', color: '#1A2010' },
  avatarSm: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#4A9B8E', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 17 },

  scroll: { paddingBottom: 32 },

  /* Timer */
  timerSection: {
    backgroundColor: '#EDEAE3', borderRadius: 20,
    margin: 14, padding: 20, alignItems: 'center',
  },
  timerLbl: { fontSize: 10, letterSpacing: 2, color: '#9A9A8E', marginBottom: 16 },
  ringWrap: {
    width: RING_SIZE, height: RING_SIZE,
    position: 'relative', marginBottom: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  ringBg: {
    position: 'absolute', width: RING_SIZE, height: RING_SIZE,
    borderRadius: RING_SIZE / 2, borderWidth: 8, borderColor: '#D8D4CC',
  },
  ringProgress: {
    position: 'absolute', width: RING_SIZE, height: RING_SIZE,
    borderRadius: RING_SIZE / 2, borderWidth: 8,
    transform: [{ rotate: '-30deg' }],
  },
  timerInner: { alignItems: 'center' },
  timerTime: { fontSize: 38, fontWeight: '300', color: '#1A2010', letterSpacing: -1 },
  timerRemaining: { fontSize: 12, color: '#9A9A8E', marginTop: 2 },
  timerControls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ctrlBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#E0DDD6', alignItems: 'center', justifyContent: 'center',
  },
  ctrlBtnText: { fontSize: 12, color: '#5A5A50', fontWeight: '500' },
  playBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#4A7C59', alignItems: 'center', justifyContent: 'center',
  },
  pauseBars: { flexDirection: 'row', gap: 5 },
  pauseBar: { width: 4, height: 18, backgroundColor: '#fff', borderRadius: 2 },
  playIcon: {
    width: 0, height: 0, borderStyle: 'solid',
    borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 18,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#fff',
    marginLeft: 4,
  },

  /* Sections */
  section: { marginHorizontal: 14, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A2010' },

  atmoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  atmoSub: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.5 },

  soundRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  soundCard: {
    flex: 1, backgroundColor: '#EDEAE3', borderRadius: 14,
    padding: 12, alignItems: 'center', gap: 6,
  },
  soundCardActive: { backgroundColor: '#F0D080' },
  soundEmoji: { fontSize: 22 },
  soundLbl: { fontSize: 11, color: '#3A3A30', fontWeight: '500', textAlign: 'center' },

  volRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  volLbl: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.8 },
  volPct: { fontSize: 11, color: '#5A5A50', fontWeight: '500' },
  volBarWrap: { height: 4, backgroundColor: '#D8D4CC', borderRadius: 2, overflow: 'hidden' },
  volBar: { height: '100%', backgroundColor: '#4A7C59', borderRadius: 2 },

  /* Streak */
  streakSection: {
    backgroundColor: '#FDECEA', borderRadius: 20,
    marginHorizontal: 14, marginBottom: 14, padding: 16,
  },
  fireEmoji: { position: 'absolute', right: 14, top: 14, fontSize: 38, opacity: 0.3 },
  streakBadgeLbl: { fontSize: 9, color: '#B06060', letterSpacing: 1, fontWeight: '700', marginBottom: 8 },
  streakNumRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  streakBigNum: { fontSize: 44, fontWeight: '800', color: '#1A2010', lineHeight: 50 },
  streakRowText: { fontSize: 14, color: '#4A3A3A' },
  streakDesc: { fontSize: 12, color: '#7A5A5A', lineHeight: 18, marginBottom: 12 },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  dayCircleActive: { backgroundColor: '#3A3A30' },
  dayLbl: { fontSize: 10, fontWeight: '600', color: '#8A7070' },
  dayLblActive: { color: '#fff' },

  /* Sessions */
  sessionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  viewAll: { fontSize: 11, fontWeight: '700', color: '#4A7C59', letterSpacing: 0.5 },
  sessionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  sessionItemBorder: { borderBottomWidth: 0.5, borderBottomColor: '#EAE7E0' },
  sessionIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#EDEAE3', alignItems: 'center', justifyContent: 'center',
  },
  sessionEmoji: { fontSize: 20 },
  sessionInfo: { flex: 1 },
  sessionName: { fontSize: 13, fontWeight: '600', color: '#1A2010', marginBottom: 2 },
  sessionMeta: { fontSize: 11, color: '#9A9A8E' },
  sessionArr: { fontSize: 20, color: '#CCCCCC' },

  /* Insight */
  insightBanner: {
    marginHorizontal: 14, borderRadius: 20, height: 120,
    backgroundColor: '#C8962A', overflow: 'hidden',
    justifyContent: 'flex-end', padding: 14,
  },
  insightDeco: {
    position: 'absolute', top: 0, left: '50%',
    width: 60, height: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 100, borderBottomRightRadius: 100,
  },
  insightTag: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  insightQuote: { fontSize: 13, fontWeight: '700', color: '#fff', lineHeight: 18, fontStyle: 'italic' },
});