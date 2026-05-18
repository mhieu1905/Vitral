import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

// ─── ICONS (dùng @expo/vector-icons hoặc thay bằng SVG/Image) ───
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useOnboardingStore } from '../../store/onboardingStore';

// ─── TYPES ───────────────────────────────────────────────────────
type ActivityKey = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";

interface ActivityOption {
  key: ActivityKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────────
const COLORS = {
  bg: '#FAF7F4',
  primary: '#C97E7E',       // dusty rose
  primaryLight: '#F5E8E8',  // selected card bg
  primaryBorder: '#C97E7E',
  green: '#4A6741',         // dark forest green (progress bar, header)
  greenLight: '#EEF2EC',
  text: '#1C1C1C',
  subtext: '#6B6B6B',
  cardBg: '#FFFFFF',
  cardBorder: '#EEEBE8',
  checkBg: '#C97E7E',
  progressBg: '#E5E0DB',
};

// ─── ACTIVITY OPTIONS ─────────────────────────────────────────────
const ACTIVITIES: ActivityOption[] = [
  {
    key: 'sedentary',
    label: 'Sedentary',
    description: 'Desk job, minimal movement',
    bgColor: '#F5EEE9',
    iconColor: '#C97E7E',
    icon: <MaterialCommunityIcons name="sofa-single-outline" size={22} color="#C97E7E" />,
  },
  {
    key: 'lightly_active',
    label: 'Lightly Active',
    description: 'Occasional walking, light tasks',
    bgColor: '#F5F0E4',
    iconColor: '#A89060',
    icon: <FontAwesome5 name="walking" size={20} color="#A89060" />,
  },
  {
    key: 'moderately_active',
    label: 'Moderately Active',
    description: 'Exercise 3–5 days a week',
    bgColor: '#F5E8E8',
    iconColor: '#C97E7E',
    icon: <MaterialCommunityIcons name="dumbbell" size={22} color="#C97E7E" />,
  },
  {
    key: 'very_active',
    label: 'Very Active',
    description: 'Daily intense physical sport or hard labor',
    bgColor: '#EEF2EC',
    iconColor: '#4A6741',
    icon: <MaterialCommunityIcons name="soccer" size={22} color="#4A6741" />,
  },
  {
    key: 'extra_active',
    label: 'Extra Active',
    description: 'Very intense daily exercise or physical job',
    bgColor: '#EAF0EF',
    iconColor: '#5A8C85',
    icon: <FontAwesome5 name="running" size={22} color="#5A8C85" />,
  },
];

// ─── MAIN SCREEN ─────────────────────────────────────────────────
export default function ActivityLevelScreen({ navigation }: any) {
  const router = useRouter();
  const { activityLevel, setActivityLevel } = useOnboardingStore();
  const currentActivityLevel = activityLevel ?? 'moderately_active';

  const handleContinue = () => {
    if (!activityLevel) setActivityLevel(currentActivityLevel);
    router.push('/(onboarding)/notifications');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Sanctuary</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROGRESS BAR ── */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Setup Progress</Text>
          <Text style={styles.progressPercent}>75%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* ── TITLE ── */}
        <Text style={styles.title}>Activity Level</Text>
        <Text style={styles.subtitle}>
          To personalize your wellness journey, we need to understand your daily movement patterns.
        </Text>

        {/* ── ACTIVITY OPTIONS ── */}
        <View style={styles.optionsList}>
          {ACTIVITIES.map((item) => {
            const isSelected = currentActivityLevel === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setActivityLevel(item.key)}
                activeOpacity={0.8}
              >
                {/* Icon bubble */}
                <View style={[styles.iconBubble, { backgroundColor: item.bgColor }]}>
                  {item.icon}
                </View>

                {/* Text */}
                <View style={styles.cardText}>
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>

                {/* Radio */}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800' }}
          style={styles.banner}
          imageStyle={styles.bannerImage}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay} />
          <Text style={styles.bannerQuote}>
            "Movement is a form of self-care.{'\n'}
            Choose the rhythm that feels{'\n'}
            most sustainable for your spirit."
          </Text>
        </ImageBackground>
      </ScrollView>

      {/* ── CONTINUE BUTTON ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 8,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 28,
  },
  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 99,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    lineHeight: 21,
    marginBottom: 28,
  },

  // Options
  optionsList: {
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.subtext,
    lineHeight: 18,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C8C0BB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: COLORS.checkBg,
    borderColor: COLORS.checkBg,
  },

  // Banner
  banner: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerImage: {
    borderRadius: 20,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 45, 25, 0.58)',
    borderRadius: 20,
  },
  bannerQuote: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
    paddingVertical: 28,
    zIndex: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 10,
    backgroundColor: COLORS.bg,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});