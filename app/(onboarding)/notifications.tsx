import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingStore } from '../../store/onboardingStore';
import { onboardingApi } from '../../services/onboardingApi';
import { supabase } from '../../utils/supabase';

// ─── COLORS ──────────────────────────────────────────────────────
const C = {
  bg: '#FAF7F4',
  primary: '#C97E7E',
  primaryLight: '#F5E8E8',
  green: '#4A6741',
  greenLight: '#D6E5D3',
  text: '#1C1C1C',
  subtext: '#6B6B6B',
  white: '#FFFFFF',
  border: '#E8E3DE',
  toggleTrack: '#C97E7E',
  cardBg: '#FDF1F1',
  timeBorder: '#E0D8D2',
  chipBorder: '#D8D2CC',
  chipActiveBg: '#4A6741',
  chipActiveText: '#FFFFFF',
};

type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export default function StayNotifiedScreen({ navigation }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('Afternoon');
  
  const store = useOnboardingStore();

  const TIME_SLOTS: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];

  const timeMap: Record<TimeSlot, string> = {
    Morning: '08:00 AM',
    Afternoon: '02:00 PM',
    Evening: '07:00 PM',
  };

  const dbTimeMap: Record<TimeSlot, string> = {
    Morning: '08:00:00',
    Afternoon: '14:00:00',
    Evening: '19:00:00',
  };

  // Sync selectedSlot based on store's reminderTime on mount
  useEffect(() => {
    if (store.reminderTime) {
      if (store.reminderTime.startsWith('08')) setSelectedSlot('Morning');
      else if (store.reminderTime.startsWith('14')) setSelectedSlot('Afternoon');
      else if (store.reminderTime.startsWith('19')) setSelectedSlot('Evening');
    }
  }, []);

  const handleFinishSetup = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Could not authenticate user. Please log in again.");
      }

      // Prepare payload
      const payload = {
        user_id: user.id,
        goal: store.goal || 'improve_fitness',
        height_cm: store.height || 175,
        weight_kg: store.weight || 70,
        age: store.age || 25,
        gender: store.gender || 'prefer_not_to_say',
        activity_level: store.activityLevel || 'moderately_active',
        notification_enabled: store.notificationEnabled,
        reminder_time: store.notificationEnabled ? dbTimeMap[selectedSlot] : null,
      };

      if (store.isProfileExists) {
        await onboardingApi.updateProfile(user.id, payload);
      } else {
        await onboardingApi.createProfile(payload);
        store.setIsProfileExists(true);
      }

      router.push('/(onboarding)/onboarding-complete');
    } catch (error) {
      const err = error as any;
      Alert.alert("Error", err.message || "Something went wrong saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    store.setNotificationEnabled(false);
    store.setReminderTime(null);
    handleFinishSetup();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stay Notified</Text>
        <TouchableOpacity onPress={handleSkip} disabled={loading}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' }}
            style={styles.heroBg}
            imageStyle={styles.heroBgImage}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay} />
            <View style={styles.circlePink} />
            <View style={styles.circleBeige} />
            <View style={styles.bellCard}>
              <Ionicons name="notifications-outline" size={40} color={C.green} />
            </View>
          </ImageBackground>
        </View>

        {/* ── TITLE ── */}
        <View style={styles.body}>
          <Text style={styles.title}>Stay Notified</Text>
          <Text style={styles.subtitle}>
            Receive gentle nudges for your daily{'\n'}reflection and wellness rituals.
          </Text>

          {/* ── ALLOW NOTIFICATIONS TOGGLE ── */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleIconWrap}>
              <Ionicons name="notifications-outline" size={18} color={C.subtext} />
            </View>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Allow notifications</Text>
              <Text style={styles.toggleSub}>Daily mindful reminders</Text>
            </View>
            <Switch
              value={store.notificationEnabled}
              onValueChange={(val) => {
                store.setNotificationEnabled(val);
                if (val) store.setReminderTime(dbTimeMap[selectedSlot]);
              }}
              trackColor={{ false: '#D0CBC6', true: C.toggleTrack }}
              thumbColor={C.white}
              ios_backgroundColor="#D0CBC6"
            />
          </View>

          {/* ── DAILY REMINDER TIME ── */}
          <Text style={styles.sectionLabel}>DAILY REMINDER TIME</Text>

          <View style={[styles.timeBox, !store.notificationEnabled && { opacity: 0.5 }]}>
            <Text style={styles.timeText}>{timeMap[selectedSlot]}</Text>
            <Ionicons name="time-outline" size={20} color={C.subtext} />
          </View>

          {/* Time slot chips */}
          <View style={[styles.chipsRow, !store.notificationEnabled && { opacity: 0.5 }]}>
            {TIME_SLOTS.map((slot) => {
              const isActive = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => {
                    if (!store.notificationEnabled) return;
                    setSelectedSlot(slot);
                    store.setReminderTime(dbTimeMap[slot]);
                  }}
                  activeOpacity={0.8}
                  disabled={!store.notificationEnabled}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} activeOpacity={0.85} onPress={handleFinishSetup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={C.white} />
          ) : (
            <Text style={styles.finishBtnText}>Finish Setup  ✓✓</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          You can change these settings anytime in your profile.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 4,
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
    color: C.primary,
    letterSpacing: 0.2,
  },
  skipText: {
    fontSize: 15,
    color: C.text,
    fontWeight: '500',
    width: 36,
    textAlign: 'right',
  },
  scroll: {
    paddingBottom: 16,
  },
  heroSection: {
    height: 220,
    marginBottom: 8,
    overflow: 'hidden',
  },
  heroBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBgImage: {
    opacity: 0.18,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 242, 236, 0.72)',
  },
  circlePink: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(220, 170, 165, 0.45)',
  },
  circleBeige: {
    position: 'absolute',
    bottom: 28,
    left: 28,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 185, 155, 0.40)',
  },
  bellCard: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: C.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
    zIndex: 2,
  },
  body: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: C.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#F0E6E6',
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
    color: C.subtext,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.subtext,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: C.timeBorder,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 16,
    backgroundColor: C.white,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: C.text,
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: C.chipBorder,
    backgroundColor: C.white,
  },
  chipActive: {
    backgroundColor: C.chipActiveBg,
    borderColor: C.chipActiveBg,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.text,
  },
  chipTextActive: {
    color: C.white,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    paddingTop: 12,
    backgroundColor: C.bg,
    alignItems: 'center',
  },
  finishBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: C.primary,
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  finishBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerNote: {
    fontSize: 12,
    color: C.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
});