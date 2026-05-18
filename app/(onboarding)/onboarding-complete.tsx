import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../../utils/supabase';
import { onboardingApi } from '../../services/onboardingApi';
// ─── COLORS ──────────────────────────────────────────────────────
const C = {
  bg: '#FAF7F4',
  primary: '#C97E7E',
  primaryLight: '#F5E8E8',
  green: '#4A6741',
  greenLight: '#EEF2EC',
  text: '#1C1C1C',
  subtext: '#7A7570',
  white: '#FFFFFF',
  cardBg: '#FDF5F3',
  cardBorder: '#F0E8E5',
  statCard: '#FFFFFF',
  progressFill: '#C97E7E',
  progressBg: '#EDE3E0',
  decorDot: '#C8C0BA',
};

export default function AllSetScreen({ navigation }: any) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const data = await onboardingApi.getProfile(user.id);
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const calorieGoal = profile?.calorie_goal ? Math.round(profile.calorie_goal) : '...';
  const tdee = profile?.tdee ? Math.round(profile.tdee) : '...';
  const weight = profile?.weight_kg || '...';
  const height = profile?.height_cm || '...';
  const age = profile?.age || '...';

  const formatGoal = (g: string) => {
    if (!g) return '...';
    return g.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  const goalText = profile?.goal ? formatGoal(profile.goal) : '...';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Sanctuary</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HERO ICON ── */}
        <View style={styles.heroSection}>
          {/* Decoration dots */}
          <View style={[styles.dot, { top: 18, left: 52, width: 7, height: 7 }]} />
          <View style={[styles.dot, { top: 10, right: 80, width: 28, height: 6, borderRadius: 3 }]} />
          <View style={[styles.dot, { bottom: 10, right: 60, width: 10, height: 10 }]} />

          {/* Party popper bubble */}
          <View style={styles.heroBubble}>
            <MaterialCommunityIcons name="party-popper" size={44} color={C.green} />
          </View>
        </View>

        {/* ── TITLE ── */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Your sanctuary is ready for{'\n'}mindful health management.
          </Text>
        </View>

        <View style={styles.body}>
          {/* ── DAILY GOAL PREVIEW CARD ── */}
          <View style={styles.goalCard}>
            <Text style={styles.goalCardLabel}>DAILY GOAL PREVIEW</Text>

            <View style={styles.statsRow}>
              {/* Kcal stat */}
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="medal-outline" size={20} color={C.green} />
                <Text style={styles.statValue}>{calorieGoal}</Text>
                <Text style={styles.statUnit}>kcal Goal</Text>
              </View>

              {/* Divider */}
              <View style={styles.statDivider} />

              {/* TDEE stat */}
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="fire" size={20} color={C.primary} />
                <Text style={styles.statValue}>{tdee}</Text>
                <Text style={styles.statUnit}>TDEE (kcal)</Text>
              </View>
            </View>

            {/* Goal Calibration */}
            <View style={styles.calibrationRow}>
              <Text style={styles.calibrationLabel}>Goal: {goalText}</Text>
              <Text style={styles.calibrationPercent}>100%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* ── PERSONAL METRICS CARD ── */}
          <View style={[styles.goalCard, { marginTop: 16 }]}>
            <Text style={styles.goalCardLabel}>YOUR METRICS</Text>
            <View style={[styles.statsRow, { marginBottom: 0 }]}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{weight}</Text>
                <Text style={styles.statUnit}>kg</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{height}</Text>
                <Text style={styles.statUnit}>cm</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{age}</Text>
                <Text style={styles.statUnit}>years</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════════════
           *  VITALITY IMAGE BANNER
           * ════════════════════════════════════════════════════════
           *
           *  HƯỚNG DẪN XỬ LÝ HÌNH ẢNH:
           *  ──────────────────────────────────────────────────────
           *  Thiết kế gốc: ảnh phong cách tối giản (bình gốm, cành lá,
           *  rèm vải) với góc bo tròn và badge "Ready for Vitality" góc dưới trái.
           *
           *  CÁCH 1 — Ảnh local (khuyến nghị):
           *    1. Lưu ảnh vào: assets/images/vitality-banner.jpg
           *    2. Thay source bên dưới:
           *         source={require('../assets/images/vitality-banner.jpg')}
           *
           *  CÁCH 2 — Ảnh remote:
           *         source={{ uri: 'https://your-cdn.com/vitality.jpg' }}
           *
           *  CÁCH 3 — Không có ảnh (dùng gradient):
           *    Thay ImageBackground bằng LinearGradient:
           *
           *      import { LinearGradient } from 'expo-linear-gradient';
           *      // npx expo install expo-linear-gradient
           *
           *      <LinearGradient
           *        colors={['#6B7F5E', '#4A5E42', '#3A4E34']}
           *        style={styles.vitalityBanner}
           *      >
           *        ... badge bên trong ...
           *      </LinearGradient>
           *
           *  LƯU Ý QUAN TRỌNG:
           *  • imageStyle={{ borderRadius: 20 }} — bắt buộc để ảnh có góc bo
           *  • resizeMode="cover" — ảnh fill đầy khung
           *  • Overlay tối bên dưới badge giúp text luôn đọc được
           * ──────────────────────────────────────────────────────
           */}
          <ImageBackground
            // ↓ THAY bằng require('../assets/images/vitality-banner.jpg')
            source={{ uri: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=800&q=80' }}
            style={styles.vitalityBanner}
            imageStyle={styles.vitalityBannerImage}
            resizeMode="cover"
          >
            {/* Gradient overlay phía dưới để badge dễ đọc */}
            <View style={styles.vitalityOverlay} />

            {/* Badge góc dưới trái */}
            <View style={styles.vitalityBadge}>
              <Ionicons name="shield-checkmark-outline" size={14} color={C.white} />
              <Text style={styles.vitalityBadgeText}>Ready for Vitality</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.startBtnText}>Start Your Journey  →</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          You can adjust these goals anytime in wellness settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 14 : 4,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
    letterSpacing: 0.2,
  },

  scroll: {
    paddingBottom: 12,
  },

  // ── HERO ──────────────────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    position: 'relative',
    marginBottom: 4,
  },
  dot: {
    position: 'absolute',
    backgroundColor: C.decorDot,
    borderRadius: 99,
    opacity: 0.6,
  },
  heroBubble: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.greenLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.green,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
  },

  // Title
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: C.subtext,
    textAlign: 'center',
    lineHeight: 23,
  },

  body: {
    paddingHorizontal: 22,
    gap: 16,
  },

  // ── GOAL CARD ─────────────────────────────────────────────────
  goalCard: {
    backgroundColor: C.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 18,
  },
  goalCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.subtext,
    letterSpacing: 1.3,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 0,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.statCard,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  statDivider: {
    width: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: C.text,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 13,
    color: C.subtext,
    fontWeight: '400',
  },

  // Calibration
  calibrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calibrationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  calibrationPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: C.progressBg,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: C.progressFill,
    borderRadius: 99,
  },

  // ── VITALITY BANNER ──────────────────────────────────────────
  vitalityBanner: {
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  vitalityBannerImage: {
    borderRadius: 20,
  },
  vitalityOverlay: {
    ...StyleSheet.absoluteFillObject,
    // React Native does not support CSS linear-gradient.
    // Use a semi-transparent dark overlay at the bottom instead.
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
  },
  vitalityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    margin: 14,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
  },
  vitalityBadgeText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '500',
  },

  // ── FOOTER ───────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    paddingTop: 14,
    backgroundColor: C.bg,
    alignItems: 'center',
  },
  startBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: C.primary,
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 5,
  },
  startBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 12,
    color: C.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
});