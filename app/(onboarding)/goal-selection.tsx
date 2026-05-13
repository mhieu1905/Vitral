import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────
type GoalId =
  | "lose_weight"
  | "build_muscle"
  | "reduce_stress"
  | "better_sleep"
  | "mindful_focus"
  | "emotional_balance";

interface Goal {
  id: GoalId;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const GOALS: Goal[] = [
  {
    id: "lose_weight",
    title: "Lose weight",
    description: "Find a healthy, sustainable balance for your body.",
    icon: "✕",
    iconBg: "#E8EDE6",
    iconColor: "#4A6741",
  },
  {
    id: "build_muscle",
    title: "Build muscle",
    description: "Strengthen your frame and increase vitality.",
    icon: "🏋",
    iconBg: "#F5E6E8",
    iconColor: "#B05060",
  },
  {
    id: "reduce_stress",
    title: "Reduce stress",
    description: "Focus on finding calm and anxiety reduction.",
    icon: "≋",
    iconBg: "#EAF0EF",
    iconColor: "#5A8C85",
  },
  {
    id: "better_sleep",
    title: "Better sleep",
    description: "Prioritize deep and restorative rest nightly.",
    icon: "☽",
    iconBg: "#EAF0EF",
    iconColor: "#4A7A6A",
  },
  {
    id: "mindful_focus",
    title: "Mindful focus",
    description: "Enhance concentration and daily presence.",
    icon: "⊙",
    iconBg: "#F5E6E8",
    iconColor: "#B05060",
  },
  {
    id: "emotional_balance",
    title: "Emotional balance",
    description: "Focus on mood tracking and inner stability.",
    icon: "♥",
    iconBg: "#EDE8DC",
    iconColor: "#7A6A3A",
  },
];

// ─── GoalCard Component ────────────────────────────────────────────────────────
interface GoalCardProps {
  goal: Goal;
  selected: boolean;
  onPress: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {/* Check badge (top-right when selected) */}
    {selected && (
      <View style={styles.checkBadge}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
    )}

    <View style={[styles.iconCircle, { backgroundColor: goal.iconBg }]}>
      <Text style={[styles.iconText, { color: goal.iconColor }]}>
        {goal.icon}
      </Text>
    </View>
    <Text style={styles.cardTitle}>{goal.title}</Text>
    <Text style={styles.cardDesc}>{goal.description}</Text>
  </TouchableOpacity>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function GoalSettingScreen() {
  const [selected, setSelected] = useState<Set<GoalId>>(new Set());
  const router = useRouter();

  const toggleGoal = (id: GoalId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.size === 0) return;
    router.push("/(onboarding)/body-info");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F5" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Sanctuary</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>STEP 1 OF 4</Text>
        <Text style={styles.progressStep}>Goal Setting</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>What is your main{"\n"}goal?</Text>
        <Text style={styles.subtitle}>
          Select the path that resonates most with your journey today.
        </Text>

        {/* Goal Cards — multi-select */}
        {GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            selected={selected.has(goal.id)}
            onPress={() => toggleGoal(goal.id)}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Continue Button (fixed) ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueBtn,
            selected.size === 0 && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={selected.size > 0 ? 0.85 : 1}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ROSE = "#C4798A";
const ROSE_LIGHT = "#D4909F";
const BG = "#FAF7F5";
const CARD_BG = "#F5F0EC";
const CARD_SELECTED_BORDER = "#C4798A";
const TEXT_DARK = "#1E1E1E";
const TEXT_MID = "#4A4A4A";
const TEXT_LIGHT = "#8A8A8A";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
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

  // Progress
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    letterSpacing: 0.8,
    fontWeight: "500",
  },
  progressStep: {
    fontSize: 11,
    color: TEXT_LIGHT,
    letterSpacing: 0.4,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#E5DDD8",
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    width: "25%",
    height: "100%",
    backgroundColor: "#4A6741",
    borderRadius: 2,
  },

  // Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 36,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MID,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
  },

  // Cards
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    position: "relative",
  },
  cardSelected: {
    borderColor: CARD_SELECTED_BORDER,
    backgroundColor: "#FDF0F2",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 4,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 13,
    color: TEXT_MID,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  // Check badge
  checkBadge: {
    position: "absolute",
    top: 14,
    right: 16,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: CARD_SELECTED_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },

  // Footer
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
  continueBtnDisabled: {
    backgroundColor: ROSE_LIGHT,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});