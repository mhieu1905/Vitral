import BottomNav from "@/components/bottom-nav";
import { useRouter } from "expo-router";
import {
  AreaChart,
  BarChart3,
  Droplets,
  FileText,
  Footprints,
  Heart,
  Home,
  Moon,
  Quote,
  Sparkles,
  Sun,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
import { healthProfileService } from "@/services/healthProfileService";
import { tdeeService } from "@/services/tdeeService";
import type { NutritionTarget } from "@/types/tdee";
import { GOAL_LABELS } from "@/types/healthProfile";
import type { HealthProfile } from "@/types/healthProfile";

const COLORS = {
  background: "#FFFBF8",
  surface: "#FFFFFF",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  primary: "#4C6647", // Sage
  sageLight: "#E3F1DF",
  peach: "#FDF1EB", // Soft Peach
  peachLight: "#FEEEEE",
  white: "#FFFFFF",
};

export default function DashboardNative() {
  const router = useRouter();
  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [userName, setUserName] = useState("there");
  const [targetLoading, setTargetLoading] = useState(true);

  const loadNutritionTarget = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "there"
      );
      const hp = await healthProfileService.getUserHealthProfile(user.id);
      if (hp) {
        setProfile(hp);
        setNutritionTarget(tdeeService.getDailyNutritionTarget(hp));
      }
    } catch (e) {
      console.error("[Dashboard] Failed to load nutrition target:", e);
    } finally {
      setTargetLoading(false);
    }
  }, []);

  useEffect(() => { loadNutritionTarget(); }, [loadNutritionTarget]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back, {userName}</Text>
          <Text style={styles.subtitle}>Find your center in every moment.</Text>
        </View>

        {/* Main Home Dashboard Card */}
        <View style={styles.mainCard}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.homeCard}
            onPress={() => router.push("/dashboard/home-details")}
          >
            <View style={styles.mainCardHeader}>
              <View style={styles.homeIconBox}>
                <Home size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.percentageText}>66%</Text>
            </View>
            <Text style={styles.mainCardTitle}>Home Dashboard</Text>
            <Text style={styles.mainCardSubtitle}>
              You've completed 4 of 6 daily intentions.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Two Columns Grid */}
        <View style={styles.gridRow}>
          {/* Weekly Report */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.smallCard, { marginRight: 8 }]}
            onPress={() => router.push("/dashboard/week-report")}
          >
            <View style={styles.smallCardIconBox}>
              <BarChart3 size={20} color={COLORS.textDark} />
            </View>
            <Text style={styles.smallCardTitle}>Weekly Report</Text>
            <Text style={styles.reportTag}>+12% vs last week</Text>

            <View style={styles.miniBarChart}>
              {[30, 45, 60, 90, 70, 40].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.miniBar,
                    {
                      height: h,
                      backgroundColor: i === 3 ? COLORS.primary : "#D9E2D6",
                    },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>

          {/* Sleep Tracker */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.smallCard, { marginLeft: 8 }]}
            onPress={() => router.push("/dashboard/sleep-tracker")}
          >
            <View style={styles.smallCardIconBox}>
              <Moon size={20} color={COLORS.textDark} />
            </View>
            <Text style={styles.smallCardTitle}>Sleep Tracker</Text>
            <Text style={styles.sleepStatus}>Excellent Sleep</Text>
            <Text style={styles.sleepValue}>7h 42m</Text>
          </TouchableOpacity>
        </View>

        {/* Water Intake Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.waterCard}
          onPress={() => router.push("/dashboard/water-tracker")}
        >
          <View style={styles.waterIconBox}>
            <Droplets size={22} color="#7B5556" />
          </View>
          <View style={styles.waterTextContent}>
            <Text style={styles.waterTitle}>Water Intake</Text>
            <Text style={styles.waterSubtitle}>65% Hydrated</Text>
          </View>
          <View style={styles.waterProgressBar}>
            {[true, true, true, true, false].map((filled, i) => (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  { backgroundColor: filled ? COLORS.primary : "#D9D3D0" },
                ]}
              />
            ))}
          </View>
        </TouchableOpacity>

        {/* Nutrition Targets Card */}
        <NutritionTargetsCard
          target={nutritionTarget}
          profile={profile}
          loading={targetLoading}
        />

        {/* Health Hub Section */}
        <View style={styles.hubSection}>
          <Text style={styles.sectionTitle}>Health Hub</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hubScroll}
          >
            <HubItem
              icon={<Sparkles size={24} color="#4C6647" />}
              label="Achievements"
              color="#E3F1DF"
              onPress={() => router.push("/dashboard/achievements")}
            />
            <HubItem
              icon={<FileText size={24} color="#7B5556" />}
              label="Daily Summary"
              color="#FEEEEE"
              onPress={() => router.push("/dashboard/daily-summary")}
            />
            <HubItem
              icon={<Heart size={24} color="#A34A4A" />}
              label="Heart Rate"
              color="#FDF1EB"
              onPress={() => router.push("/dashboard/heart-rate")}
            />
            <HubItem
              icon={<AreaChart size={24} color="#4C6647" />}
              label="Progress Charts"
              color="#E3F1DF"
              onPress={() => router.push("/dashboard/progress-chart")}
            />
            <HubItem
              icon={<Footprints size={24} color="#4E607C" />}
              label="Steps Detail"
              color="#E8F0FE"
              onPress={() => router.push("/dashboard/steps-detail")}
            />
          </ScrollView>
        </View>

        {/* Mood Tracker Card */}
        <View style={styles.moodTrackerCard}>
          <View style={styles.moodHeader}>
            <View style={styles.moodIconRow}>
              <Sun size={24} color={COLORS.textDark} />
              <View style={styles.moodIconLine} />
            </View>
            <View style={styles.dailyCheckInBadge}>
              <Text style={styles.dailyCheckInText}>DAILY CHECK-IN</Text>
            </View>
          </View>
          <View style={styles.moodContent}>
            <Text style={styles.moodTitle}>Mood Tracker</Text>
            <Text style={styles.moodSubtitle}>
              Currently feeling: Calm & Creative
            </Text>
          </View>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteIconCircle}>
            <Quote size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={styles.quoteText}>
            "The soul usually knows what to do to heal itself. The challenge is
            to silence the mind."
          </Text>
          <Text style={styles.authorText}>CAROLINE MYSS</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

function NutritionTargetsCard({
  target,
  profile,
  loading,
}: {
  target: NutritionTarget | null;
  profile: HealthProfile | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <View style={nt.card}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }
  if (!target || !profile) return null;

  const macros = [
    { label: "Protein", grams: target.protein_target, color: "#6B9E62", bg: "#E3F1DF" },
    { label: "Carbs",   grams: target.carbs_target,   color: "#C4943A", bg: "#FDF5E6" },
    { label: "Fat",     grams: target.fat_target,      color: "#A34A4A", bg: "#FDF1EB" },
  ];

  return (
    <View style={nt.card}>
      {/* Header */}
      <View style={nt.headerRow}>
        <Text style={nt.headerTitle}>Daily Nutrition</Text>
        <View style={nt.goalBadge}>
          <Text style={nt.goalBadgeText}>{GOAL_LABELS[profile.goal]}</Text>
        </View>
      </View>

      {/* BMR / TDEE / Calorie Goal */}
      <View style={nt.metricsRow}>
        <View style={nt.metricItem}>
          <Text style={nt.metricEmoji}>⚡</Text>
          <Text style={nt.metricValue}>{target.bmr}</Text>
          <Text style={nt.metricLabel}>BMR</Text>
        </View>
        <View style={nt.metricDivider} />
        <View style={nt.metricItem}>
          <Text style={nt.metricEmoji}>🔥</Text>
          <Text style={nt.metricValue}>{target.tdee}</Text>
          <Text style={nt.metricLabel}>TDEE</Text>
        </View>
        <View style={nt.metricDivider} />
        <View style={nt.metricItem}>
          <Text style={nt.metricEmoji}>🎯</Text>
          <Text style={[nt.metricValue, { color: COLORS.primary }]}>
            {target.calorie_goal}
          </Text>
          <Text style={nt.metricLabel}>Goal</Text>
        </View>
      </View>

      {/* kcal label */}
      <Text style={nt.kcalHint}>kcal / day</Text>

      {/* Macro bars */}
      <View style={nt.macroSection}>
        <Text style={nt.macroTitle}>MACRO TARGETS</Text>
        {macros.map((m) => (
          <View key={m.label} style={nt.macroRow}>
            <View style={[nt.macroDot, { backgroundColor: m.color }]} />
            <Text style={nt.macroLabel}>{m.label}</Text>
            <View style={nt.macroBarTrack}>
              <View
                style={[
                  nt.macroBarFill,
                  {
                    backgroundColor: m.color,
                    width: `${Math.min((m.grams / (target.protein_target + target.carbs_target + target.fat_target)) * 100 * 2.5, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[nt.macroGrams, { color: m.color }]}>{m.grams}g</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const nt = StyleSheet.create({
  card: {
    marginHorizontal: 28,
    marginTop: 16,
    padding: 24,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  goalBadge: {
    backgroundColor: COLORS.sageLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  goalBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  metricItem: { alignItems: "center", flex: 1, gap: 2 },
  metricEmoji: { fontSize: 18 },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  kcalHint: {
    textAlign: "center",
    fontSize: 10,
    color: COLORS.textMuted,
    opacity: 0.6,
    marginBottom: 18,
    fontWeight: "600",
  },
  macroSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 16,
  },
  macroTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.5,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    width: 54,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  macroBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  macroBarFill: {
    height: 8,
    borderRadius: 4,
  },
  macroGrams: {
    width: 40,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
});

function HubItem({ icon, label, color, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.hubItemCard}
      onPress={onPress}
    >
      <View style={[styles.hubIconCircle, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.hubItemLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 140 },
  header: { paddingHorizontal: 28, marginTop: 40, marginBottom: 32 },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    opacity: 0.7,
    marginTop: 4,
  },

  mainCard: {
    marginHorizontal: 28,
    padding: 32,
    borderRadius: 48,
    backgroundColor: COLORS.sageLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  homeCard: { width: "100%" },
  mainCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  homeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    opacity: 0.9,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  mainCardSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textMuted,
    opacity: 0.8,
    lineHeight: 22,
  },

  gridRow: { flexDirection: "row", paddingHorizontal: 28, marginTop: 16 },
  smallCard: {
    flex: 1,
    padding: 24,
    borderRadius: 40,
    backgroundColor: COLORS.peach,
  },
  smallCardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white + "80",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  smallCardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  reportTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4E607C",
    marginBottom: 12,
  },
  miniBarChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 90,
    marginTop: 8,
  },
  miniBar: { width: 8, borderRadius: 4 },
  sleepStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.6,
    marginBottom: 16,
  },
  sleepValue: { fontSize: 28, fontWeight: "900", color: COLORS.textDark },

  waterCard: {
    marginHorizontal: 28,
    marginTop: 16,
    padding: 24,
    borderRadius: 40,
    backgroundColor: COLORS.peach,
    flexDirection: "row",
    alignItems: "center",
  },
  waterIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.peachLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  waterTextContent: { flex: 1 },
  waterTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  waterSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.6,
  },
  waterProgressBar: { flexDirection: "row", gap: 6 },
  progressSegment: { width: 12, height: 28, borderRadius: 6 },

  hubSection: { marginTop: 40 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  hubScroll: { paddingHorizontal: 28, gap: 12 },
  hubItemCard: {
    width: 110,
    padding: 12,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  hubIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  hubItemLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },

  moodTrackerCard: {
    marginHorizontal: 28,
    marginTop: 40,
    padding: 32,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    opacity: 0.8,
  },
  moodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  moodIconRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  moodIconLine: {
    width: 12,
    height: 3,
    backgroundColor: COLORS.textDark,
    borderRadius: 2,
  },
  dailyCheckInBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  dailyCheckInText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  moodContent: { gap: 4 },
  moodTitle: { fontSize: 24, fontWeight: "800", color: COLORS.textDark },
  moodSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textMuted,
    opacity: 0.7,
  },

  quoteCard: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  quoteIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B9B88",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 20,
  },
  authorText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.6,
    letterSpacing: 2,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: COLORS.background,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.02)",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navButtonActive: { backgroundColor: "#BDD4B9", borderRadius: 16 },
  navLabel: { fontSize: 10, fontWeight: "800" },
});
