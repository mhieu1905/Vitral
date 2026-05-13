import {
  Activity,
  Apple,
  Flame,
  Flower2,
  Footprints,
  Heart,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Lock,
  Moon,
  Share2,
  Sparkles,
  Sun,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

import BottomNav from "@/components/bottom-nav";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFBF8",
  surface: "#FFFFFF",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  primary: "#4C6647", // Dark Sage
  streakGreen: "#CDE5C9", // Light Green
  streakGreenDark: "#B8D8B2", // Slightly darker green
  badgeBg: "#FDF1EB", // Soft Peach
  white: "#FFFFFF",
};

const BADGES = [
  {
    id: 1,
    name: "First Sprout",
    icon: <Leaf size={24} color="#4C6647" />,
    circleColor: "#E3F1DF",
    locked: false,
  },
  {
    id: 2,
    name: "Self Care",
    icon: <Heart size={24} color="#7B5556" />,
    circleColor: "#FEEEEE",
    locked: false,
  },
  {
    id: 3,
    name: "Restful",
    icon: <Moon size={24} color="#4E607C" />,
    circleColor: "#E8F0FE",
    locked: false,
  },
  {
    id: 4,
    name: "Early Riser",
    icon: <Sun size={24} color="#A67C00" />,
    circleColor: "#FFF4D6",
    locked: false,
  },
  {
    id: 5,
    name: "Active",
    icon: <Footprints size={24} color="#6B5C52" />,
    circleColor: "#F0F0F0",
    locked: true,
  },
  {
    id: 6,
    name: "Mindful",
    icon: <Lightbulb size={24} color="#6B5C52" />,
    circleColor: "#F0F0F0",
    locked: true,
  },
];

export default function Achievements() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Celebrate your journey.</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCardContainer}>
          <View style={styles.streakCard}>
            <View style={styles.absoluteGradient}>
              <Svg height="100%" width="100%">
                <Defs>
                  <SvgGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#D4EBD1" stopOpacity="1" />
                    <Stop offset="1" stopColor="#B6D7AF" stopOpacity="1" />
                  </SvgGradient>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#streakGrad)"
                />
              </Svg>
            </View>

            <View style={styles.streakContent}>
              <Flame
                size={42}
                color={COLORS.primary}
                fill={COLORS.primary}
                style={styles.flameIcon}
              />
              <Text style={styles.streakNumber}>14 Days</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
          </View>
        </View>

        {/* Badge Section */}
        <View style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          <View style={styles.badgeGrid}>
            {BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeCardWrapper}>
                <View
                  style={[
                    styles.badgeCard,
                    badge.locked
                      ? styles.badgeCardLocked
                      : styles.badgeCardUnlocked,
                  ]}
                >
                  {badge.locked && (
                    <View style={styles.lockIconContainer}>
                      <Lock size={12} color="#A0A0A0" />
                    </View>
                  )}
                  <View
                    style={[
                      styles.badgeCircle,
                      { backgroundColor: badge.circleColor },
                      badge.locked && { opacity: 0.5 },
                    ]}
                  >
                    {badge.icon}
                  </View>
                  <Text
                    style={[styles.badgeName, badge.locked && { opacity: 0.5 }]}
                  >
                    {badge.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.shareButtonText}>Share Progress</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 140 },
  header: { paddingHorizontal: 28, marginTop: 32, marginBottom: 28 },
  title: {
    fontSize: 40,
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

  streakCardContainer: { paddingHorizontal: 28 },
  streakCard: {
    height: 210,
    borderRadius: 48,
    overflow: "hidden",
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  absoluteGradient: { ...StyleSheet.absoluteFillObject },
  streakContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  flameIcon: { marginBottom: 4 },
  streakNumber: {
    fontSize: 64,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -2,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    opacity: 0.8,
  },

  badgeSection: { marginTop: 44, paddingHorizontal: 28 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 24,
  },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 },
  badgeCardWrapper: { width: "33.33%", padding: 8 },
  badgeCard: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
  },
  badgeCardUnlocked: { backgroundColor: COLORS.badgeBg },
  badgeCardLocked: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#F0E0D6",
  },
  lockIconContainer: { position: "absolute", top: 12, right: 12 },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },

  shareButton: {
    marginHorizontal: 28,
    marginTop: 44,
    backgroundColor: COLORS.primary,
    height: 72,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  shareButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "800" },

  navButtonActive: { backgroundColor: "#BDD4B9", borderRadius: 16 },
  navLabel: { fontSize: 10, fontWeight: "800" },
});
