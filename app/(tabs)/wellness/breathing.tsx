/**
 * app/(tabs)/wellness/breathing.tsx
 * Screen S-52: Breathing Exercise
 *
 * Navigation:
 *   ← Skip  → router.back()
 *   Start   → chạy timer tại chỗ
 *
 * FIX layout: inner flex:1 + 2 spacers → không còn khoảng trắng lớn
 */
import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, SafeAreaView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const C = {
  bg: '#EAF4E7', surface: '#F5EFE6',
  sage: '#A8C5A0', sageD: '#6B9E62',
  dark: '#3D3530', muted: '#8C7B72', hint: '#C4B5AC', white: '#FFFFFF',
};

const PHASES = [
  { label: 'Inhale',  time: 4, pill: 'Inhale 4s' },
  { label: 'Hold',    time: 7, pill: 'Hold 7s'   },
  { label: 'Exhale',  time: 8, pill: 'Exhale 8s' },
];
const RING = 220;

export default function BreathingScreen() {
  const router = useRouter();
  const [phase,     setPhase]     = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].time);
  const [running,   setRunning]   = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  /* Pulse loop */
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 2800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const start = () => {
    setRunning(true); setPhase(0); setCountdown(PHASES[0].time);
    let p = 0, elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += 1;
      const rem = PHASES[p].time - elapsed;
      if (rem > 0) { setCountdown(rem); }
      else { p = (p + 1) % 3; elapsed = 0; setPhase(p); setCountdown(PHASES[p].time); }
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false); setPhase(0); setCountdown(PHASES[0].time);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* inner flex:1 fills SafeAreaView completely */}
      <View style={s.inner}>

        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.push('/(tabs)/wellness/homescreen')} activeOpacity={0.7}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Breathing exercise</Text>
        </View>
        <Text style={s.subtitle}>4-7-8 technique</Text>

        {/* Spacer trên — đẩy ring lên giữa */}
        <View style={{ flex: 1 }} />

        {/* ── Ring ── */}
        <View style={s.ringWrap}>
          <Animated.View style={[s.ringOuter, { transform: [{ scale: pulseAnim }] }]} />
          <View style={s.ringMid} />
          <View style={s.ringInner} />
          <View style={{ alignItems: 'center' }}>
            <Text style={s.phaseLabel}>{PHASES[phase].label}</Text>
            <Text style={s.countdown}>{countdown}s</Text>
          </View>
        </View>

        <Text style={s.sessionInfo}>session 1 of 5  ·  Stay focused</Text>

        {/* ── Pills ── */}
        <View style={s.pillsRow}>
          {PHASES.map((p, i) => {
            const active   = i === phase;
            const bordered = !active && i === (phase + 1) % 3;
            return (
              <View
                key={i}
                style={[s.pill, active && s.pillActive, bordered && s.pillBordered]}
              >
                <Text style={[s.pillText, active && s.pillTextActive]}>{p.pill}</Text>
              </View>
            );
          })}
        </View>

        {/* Spacer dưới — simetris */}
        <View style={{ flex: 1 }} />

        {/* ── Buttons ── */}
        <View style={s.btnsRow}>
          <TouchableOpacity style={s.skipBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={s.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.startBtn, running && { backgroundColor: C.hint }]}
            onPress={() => (running ? stop() : start())}
            activeOpacity={0.85}
          >
            <Text style={s.startText}>{running ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
        </View>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontSize: 18, color: C.dark },
  headerTitle: { fontSize: 18, fontWeight: '600', color: C.dark },
  subtitle:    { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 2 },

  ringWrap: {
    width: RING, height: RING, alignSelf: 'center',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  ringOuter: {
    position: 'absolute', width: RING, height: RING, borderRadius: RING / 2,
    borderWidth: 2, borderColor: 'rgba(107,158,98,0.30)',
    backgroundColor: 'transparent',
  },
  ringMid: {
    position: 'absolute',
    width: RING - 32, height: RING - 32, borderRadius: (RING - 32) / 2,
    backgroundColor: 'rgba(168,197,160,0.20)',
  },
  ringInner: {
    position: 'absolute',
    width: RING - 72, height: RING - 72, borderRadius: (RING - 72) / 2,
    backgroundColor: 'rgba(168,197,160,0.38)',
  },
  phaseLabel: { fontSize: 30, fontWeight: '600', color: C.dark, letterSpacing: 0.5 },
  countdown:  { fontSize: 18, color: C.sageD, marginTop: 4 },

  sessionInfo: { fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 20 },

  pillsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  pill: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: 'transparent',
  },
  pillActive:     { backgroundColor: C.sage },
  pillBordered:   { borderColor: C.sage },
  pillText:       { fontSize: 12, fontWeight: '500', color: C.muted },
  pillTextActive: { color: C.white },

  btnsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginBottom: 8 },
  skipBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 12,
    backgroundColor: C.surface, alignItems: 'center',
  },
  skipText:  { fontSize: 14, fontWeight: '500', color: C.dark },
  startBtn:  {
    flex: 1, paddingVertical: 15, borderRadius: 12,
    backgroundColor: C.sage, alignItems: 'center',
  },
  startText: { fontSize: 14, fontWeight: '600', color: C.white },
});