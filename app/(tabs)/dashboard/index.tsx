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
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back, Elena</Text>
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
