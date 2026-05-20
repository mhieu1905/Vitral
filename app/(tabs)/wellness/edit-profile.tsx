import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { supabase } from '../../../utils/supabase';
import { useHealthProfileStore } from '../../../store/healthProfileStore';
import {
  ActivityLevel,
  GenderType,
  HealthGoal,
  GOAL_LABELS,
  GOAL_ICONS,
  ACTIVITY_LABELS,
  ACTIVITY_DESCRIPTIONS,
  GENDER_LABELS,
} from '../../../types/healthProfile';
import { calculateAllMetrics } from '../../../utils/tdeeCalculator';

// ─── Option arrays ────────────────────────────────────────────────────────────
const GOAL_OPTIONS: { id: HealthGoal; label: string; icon: string; color: string }[] = [
  { id: 'lose_weight',     label: 'Lose Weight',     icon: '✕', color: '#4A6741' },
  { id: 'build_muscle',    label: 'Build Muscle',    icon: '🏋', color: '#B05060' },
  { id: 'maintain_weight', label: 'Maintain Weight',  icon: '≋', color: '#5A8C85' },
  { id: 'gain_weight',     label: 'Gain Weight',     icon: '☽', color: '#4A7A6A' },
  { id: 'improve_fitness', label: 'Improve Fitness',  icon: '⊙', color: '#B05060' },
];

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string; desc: string; emoji: string }[] = [
  { key: 'sedentary',        label: 'Sedentary',        desc: 'Desk job, minimal movement', emoji: '🛋️' },
  { key: 'lightly_active',   label: 'Lightly Active',   desc: 'Occasional walking, light tasks', emoji: '🚶' },
  { key: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3–5 days a week', emoji: '🏋️' },
  { key: 'very_active',      label: 'Very Active',      desc: 'Daily intense physical sport', emoji: '⚽' },
  { key: 'extra_active',     label: 'Extra Active',     desc: 'Very intense daily exercise', emoji: '🏃' },
];

const GENDER_OPTIONS: { value: GenderType; label: string }[] = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other' },
];

// ─── Custom Slider ──────────────────────────────────────────────────────────
import { PanResponder, LayoutChangeEvent } from 'react-native';

interface SliderProps {
  min: number; max: number; step?: number;
  value: number; onChange: (val: number) => void;
}

const CustomSlider: React.FC<SliderProps> = ({ min, max, step = 1, value, onChange }) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbSize = 24;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => Math.round(v / step) * step;
  const percent = trackWidth > 0 ? (value - min) / (max - min) : 0;
  const thumbLeft = percent * (trackWidth - thumbSize);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (trackWidth === 0) return;
      const x = evt.nativeEvent.locationX - thumbSize / 2;
      const ratio = x / (trackWidth - thumbSize);
      onChange(snap(clamp(min + ratio * (max - min))));
    },
    onPanResponderMove: (_, gs) => {
      if (trackWidth === 0) return;
      const ratio = (thumbLeft + gs.dx) / (trackWidth - thumbSize);
      onChange(snap(clamp(min + ratio * (max - min))));
    },
  });

  return (
    <View style={sliderStyles.wrapper} onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)} {...panResponder.panHandlers}>
      <View style={sliderStyles.track}>
        <View style={[sliderStyles.fill, { width: `${percent * 100}%` }]} />
      </View>
      {trackWidth > 0 && <View style={[sliderStyles.thumb, { left: thumbLeft }]} />}
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  wrapper: { height: 36, justifyContent: 'center', position: 'relative' },
  track: { height: 5, backgroundColor: '#DDD8D2', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.sageD, borderRadius: 3 },
  thumb: {
    position: 'absolute', width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.sageD, top: '50%', marginTop: -12,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, isLoading: storeLoading, updateProfile, fetchProfile } = useHealthProfileStore();
  const [userId, setUserId] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form state
  const [goal, setGoal] = useState<HealthGoal>('maintain_weight');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(68);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<GenderType>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');

  // Load existing profile data
  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        if (!profile) {
          await fetchProfile(user.id);
        }
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setInitialLoading(false);
    }
  }, [profile, fetchProfile]);

  useEffect(() => { loadData(); }, [loadData]);

  // Populate form when profile is loaded
  useEffect(() => {
    if (profile) {
      setGoal(profile.goal);
      setHeight(profile.height_cm);
      setWeight(profile.weight_kg);
      setAge(String(profile.age));
      setGender(profile.gender);
      setActivityLevel(profile.activity_level);
    }
  }, [profile]);

  // Live TDEE preview
  const parsedAge = parseInt(age, 10);
  const preview = parsedAge > 0
    ? calculateAllMetrics(weight, height, parsedAge, gender, activityLevel, goal)
    : null;

  const handleSave = async () => {
    if (!age || parseInt(age, 10) <= 0) {
      Alert.alert('Validation', 'Please enter a valid age.');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(userId, {
        goal,
        height_cm: height,
        weight_kg: weight,
        age: parseInt(age, 10),
        gender,
        activity_level: activityLevel,
      });
      Alert.alert('Success', 'Profile updated ✓', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.sageD} />
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Health Profile</Text>
        <View style={{ width: 34 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── SECTION: Health Goal ── */}
          <Text style={styles.sectionTitle}>Health Goal</Text>
          <View style={styles.goalGrid}>
            {GOAL_OPTIONS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalCard, goal === g.id && styles.goalCardSelected]}
                onPress={() => setGoal(g.id)}
                activeOpacity={0.8}
              >
                {goal === g.id && (
                  <View style={styles.goalCheck}>
                    <Text style={styles.goalCheckMark}>✓</Text>
                  </View>
                )}
                <View style={[styles.goalIconCircle, { backgroundColor: g.color + '18' }]}>
                  <Text style={[styles.goalIconText, { color: g.color }]}>{g.icon}</Text>
                </View>
                <Text style={styles.goalCardTitle}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── SECTION: Body Info ── */}
          <Text style={styles.sectionTitle}>Body Information</Text>

          {/* Height */}
          <View style={styles.inputCard}>
            <View style={styles.inputCardRow}>
              <Text style={styles.inputCardLabel}>Height</Text>
              <View style={styles.valueRow}>
                <Text style={styles.valueNumber}>{height}</Text>
                <Text style={styles.valueUnit}> cm</Text>
              </View>
            </View>
            <CustomSlider min={100} max={250} step={1} value={height} onChange={setHeight} />
          </View>

          {/* Weight */}
          <View style={styles.inputCard}>
            <View style={styles.inputCardRow}>
              <Text style={styles.inputCardLabel}>Weight</Text>
              <View style={styles.valueRow}>
                <Text style={styles.valueNumber}>{weight.toFixed(1)}</Text>
                <Text style={styles.valueUnit}> kg</Text>
              </View>
            </View>
            <CustomSlider min={30} max={200} step={0.5} value={weight} onChange={setWeight} />
          </View>

          {/* Age */}
          <View style={styles.inputCard}>
            <Text style={styles.inputCardLabel}>Age</Text>
            <View style={styles.ageInputWrap}>
              <TextInput
                style={styles.ageInput}
                placeholder="Enter age"
                placeholderTextColor={colors.hint}
                keyboardType="number-pad"
                value={age}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, '');
                  setAge(cleaned);
                }}
                maxLength={3}
              />
              <Text style={styles.ageUnit}>years</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.inputCard}>
            <Text style={styles.inputCardLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderChip, gender === g.value && styles.genderChipSelected]}
                  onPress={() => setGender(g.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.genderChipText, gender === g.value && styles.genderChipTextSel]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── SECTION: Activity Level ── */}
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.activityList}>
            {ACTIVITY_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.activityCard, activityLevel === item.key && styles.activityCardSel]}
                onPress={() => setActivityLevel(item.key)}
                activeOpacity={0.8}
              >
                <View style={[styles.activityIcon, { backgroundColor: activityLevel === item.key ? 'rgba(107,158,98,0.15)' : colors.surface }]}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                </View>
                <View style={styles.activityText}>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                  <Text style={styles.activityDesc}>{item.desc}</Text>
                </View>
                <View style={[styles.radio, activityLevel === item.key && styles.radioSel]}>
                  {activityLevel === item.key && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── SECTION: TDEE Preview ── */}
          {preview && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>ESTIMATED DAILY METRICS</Text>
              <View style={styles.previewRow}>
                <View style={styles.previewItem}>
                  <Text style={styles.previewValue}>{Math.round(preview.tdee)}</Text>
                  <Text style={styles.previewUnit}>TDEE (kcal)</Text>
                </View>
                <View style={styles.previewDivider} />
                <View style={styles.previewItem}>
                  <Text style={styles.previewValue}>{Math.round(preview.calorieGoal)}</Text>
                  <Text style={styles.previewUnit}>Goal (kcal)</Text>
                </View>
              </View>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: colors.dark },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.dark },

  scroll: { flex: 1, paddingHorizontal: 24 },

  // Section
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: colors.dark,
    marginTop: 20, marginBottom: 12,
  },

  // Goal grid
  goalGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8,
  },
  goalCard: {
    width: '47%', backgroundColor: colors.white,
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.surface,
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: colors.sageD, backgroundColor: 'rgba(168,197,160,0.08)',
  },
  goalCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.sageD, alignItems: 'center', justifyContent: 'center',
  },
  goalCheckMark: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  goalIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  goalIconText: { fontSize: 18 },
  goalCardTitle: { fontSize: 12, fontWeight: '600', color: colors.dark, textAlign: 'center' },

  // Input cards
  inputCard: {
    backgroundColor: colors.white, borderRadius: 14,
    borderWidth: 1, borderColor: colors.surface,
    padding: 16, marginBottom: 10,
  },
  inputCardRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 8,
  },
  inputCardLabel: { fontSize: 13, color: colors.muted, fontWeight: '500', marginBottom: 8 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  valueNumber: { fontSize: 26, fontWeight: '300', color: colors.dark },
  valueUnit: { fontSize: 13, color: colors.muted },

  // Age
  ageInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  ageInput: { flex: 1, fontSize: 16, color: colors.dark, padding: 0 },
  ageUnit: { fontSize: 13, color: colors.muted },

  // Gender
  genderRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  genderChip: {
    paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 50, backgroundColor: colors.surface,
  },
  genderChipSelected: { backgroundColor: colors.sageD },
  genderChipText: { fontSize: 13, color: colors.muted, fontWeight: '500' },
  genderChipTextSel: { color: colors.white, fontWeight: '600' },

  // Activity
  activityList: { gap: 8, marginBottom: 8 },
  activityCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.surface,
    padding: 14, gap: 12,
  },
  activityCardSel: { borderColor: colors.sageD, backgroundColor: 'rgba(168,197,160,0.06)' },
  activityIcon: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  activityText: { flex: 1 },
  activityLabel: { fontSize: 14, fontWeight: '600', color: colors.dark },
  activityDesc: { fontSize: 11, color: colors.muted, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: colors.hint,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white,
  },
  radioSel: { backgroundColor: colors.sageD, borderColor: colors.sageD },
  radioCheck: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  // Preview card
  previewCard: {
    backgroundColor: 'rgba(168,197,160,0.12)', borderRadius: 14,
    padding: 16, marginTop: 16, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(168,197,160,0.3)',
  },
  previewLabel: {
    fontSize: 10, fontWeight: '700', color: colors.sageD,
    letterSpacing: 1.2, marginBottom: 12,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  previewItem: { flex: 1, alignItems: 'center', gap: 2 },
  previewValue: { fontSize: 22, fontWeight: '700', color: colors.dark },
  previewUnit: { fontSize: 11, color: colors.muted },
  previewDivider: { width: 1, height: 36, backgroundColor: 'rgba(168,197,160,0.4)' },

  // Save button
  saveBtn: {
    backgroundColor: colors.dark, borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: colors.white },
});