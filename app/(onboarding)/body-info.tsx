import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingStore } from "../../store/onboardingStore";

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = "male" | "female" | "other" | "prefer_not_to_say";

// ─── Custom Slider ─────────────────────────────────────────────────────────────
interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
}

const CustomSlider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
}) => {
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

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={sliderStyles.wrapper} onLayout={onLayout} {...panResponder.panHandlers}>
      {/* Track background */}
      <View style={sliderStyles.track}>
        {/* Fill */}
        <View style={[sliderStyles.fill, { width: `${percent * 100}%` }]} />
      </View>
      {/* Thumb */}
      {trackWidth > 0 && (
        <View
          style={[
            sliderStyles.thumb,
            { left: thumbLeft },
          ]}
        />
      )}
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  wrapper: {
    height: 36,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 5,
    backgroundColor: "#DDD8D2",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#4A6741",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A6741",
    top: "50%",
    marginTop: -12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function AboutYourselfScreen() {
  const router = useRouter();
  
  // Use global store
  const { 
    height, setHeight,
    weight, setWeight,
    age, setAge,
    gender, setGender
  } = useOnboardingStore();

  // Initialize defaults if null
  const currentHeight = height ?? 175;
  const currentWeight = weight ?? 68.5;
  const currentAge = age ? String(age) : "";
  const currentGender = gender ?? "male";

  const handleContinue = () => {
    // Save defaults to store if they were null and not changed by user
    if (height === null) setHeight(currentHeight);
    if (weight === null) setWeight(currentWeight);
    if (gender === null) setGender(currentGender);
    // Age must be entered
    if (!age) {
      alert("Please enter your age");
      return;
    }
    
    router.push('/(onboarding)/activity-level');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F5" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Sanctuary</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Progress ── */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Step 2 of 4</Text>
        <Text style={styles.progressPercent}>50%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* ── Scroll Content ── */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          This information helps us personalize your wellness journey and set accurate health targets.
        </Text>

        {/* ── Height Card ── */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Height</Text>
            <View style={styles.valueRow}>
              <Text style={styles.valueNumber}>{currentHeight}</Text>
              <Text style={styles.valueUnit}> cm</Text>
            </View>
          </View>
          <CustomSlider
            min={100}
            max={250}
            step={1}
            value={currentHeight}
            onChange={setHeight}
          />
        </View>

        {/* ── Weight Card ── */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Weight</Text>
            <View style={styles.valueRow}>
              <Text style={styles.valueNumber}>{currentWeight.toFixed(1)}</Text>
              <Text style={styles.valueUnit}> kg</Text>
            </View>
          </View>
          <CustomSlider
            min={30}
            max={200}
            step={0.5}
            value={currentWeight}
            onChange={setWeight}
          />
        </View>

        {/* ── Age Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Age</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="28"
              placeholderTextColor="#BDB6AE"
              keyboardType="number-pad"
              value={currentAge}
              onChangeText={(t) => {
                const parsed = parseInt(t.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(parsed)) setAge(parsed);
                else setAge(null as unknown as number);
              }}
              maxLength={3}
            />
            <Text style={styles.calIcon}>📅</Text>
          </View>
        </View>

        {/* ── Gender Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[styles.genderChip, currentGender === g.value && styles.genderChipSelected]}
                onPress={() => setGender(g.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderChipText, currentGender === g.value && styles.genderChipTextSelected]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Footer Button ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ROSE = "#C4798A";
const GREEN = "#4A6741";
const BG = "#FAF7F5";
const CARD_BG = "#F2EDE9";
const TEXT_DARK = "#1A1A1A";
const TEXT_MID = "#5A5A5A";
const TEXT_LIGHT = "#9A9490";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36,
    alignItems: "center",
  },
  backArrow: {
    fontSize: 20,
    color: ROSE,
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: ROSE,
    letterSpacing: 0.2,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "400",
  },
  progressPercent: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "600",
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#E2DAD4",
    marginHorizontal: 20,
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 3,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT_DARK,
    lineHeight: 33,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 20,
    marginBottom: 28,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "400",
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  valueNumber: {
    fontSize: 32,
    fontWeight: "300",
    color: TEXT_DARK,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  valueUnit: {
    fontSize: 15,
    color: TEXT_MID,
    marginLeft: 2,
    fontWeight: "400",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFAF8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8E2DC",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
    padding: 0,
  },
  calIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  genderChip: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 50,
    backgroundColor: "#E8E2DC",
  },
  genderChipSelected: {
    backgroundColor: "#7DA870",
  },
  genderChipText: {
    fontSize: 14,
    color: TEXT_MID,
    fontWeight: "500",
  },
  genderChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EAE3DE",
  },
  continueBtn: {
    backgroundColor: ROSE,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: ROSE,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});