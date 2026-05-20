import { BarChart2, Flame, Route } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View
} from 'react-native';
import Svg from "react-native-svg";
import BottomNav from "@/components/bottom-nav";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFBF8",
  surface: "#FFFFFF",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  primary: "#4C6647", // Sage
  primaryLight: "#E3F1DF",
  accent: "#FDF1EB", // Soft Peach
  outline: "#FDEAE0",
  white: "#FFFFFF",
};

export default function StepsDetail() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>STEPS DETAIL</Text>
        </View>

        {/* Today's Total Card */}
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>TODAY'S TOTAL</Text>
          <View style={styles.stepsValueRow}>
            <Text style={styles.stepsValue}>8,432</Text>
            <Text style={styles.stepsUnit}>steps</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg} />
            <View style={[styles.progressBarFill, { width: "84.32%" }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>0</Text>
            <Text style={styles.progressLabelText}>Goal: 10,000</Text>
          </View>
        </View>

        {/* Hourly Activity Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Hourly Activity</Text>
            <BarChart2 size={24} color={COLORS.textDark} opacity={0.6} />
          </View>

          <View style={styles.chartArea}>
            <HourlyBars />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { marginRight: 8 }]}>
            <View style={styles.statIconCircle}>
              <Route size={22} color="#4C6647" />
            </View>
            <Text style={styles.statLabel}>Distance</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValueText}>5.2</Text>
              <Text style={styles.statUnitText}>km</Text>
            </View>
          </View>

          <View style={[styles.statBox, { marginLeft: 8 }]}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#FEEEEE" }]}
            >
              <Flame size={22} color="#7B5556" />
            </View>
            <Text style={styles.statLabel}>Calories</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValueText}>340</Text>
              <Text style={styles.statUnitText}>kcal</Text>
            </View>
          </View>
        </View>

        {/* Recent Route Map */}
        <View style={styles.mapCard}>
          <Text style={styles.mapCardTitle}>Recent Route</Text>
          <View style={styles.mapContainer}>
            <Image
              source={{
                uri: "https://i.sstatic.net/50Xta.png?auto=format&fit=crop&q=80&w=1000",
              }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            {/* Simple visual overlay for the route line if desired */}
            <View style={styles.mapOverlay}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100">
                {/* Dummy route path style mimicking the image */}
              </Svg>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

function HourlyBars() {
  const bars = [
    { height: 40, active: false, label: "8a" },
    { height: 85, active: true, label: "10a" },
    { height: 85, active: true, label: "12p" },
    { height: 85, active: true, label: "2p" },
    { height: 10, active: false, label: "4p" },
    { height: 10, active: false, label: "6p" },
  ];

  return (
    <View style={styles.barsRow}>
      {bars.map((bar, i) => (
        <View key={i} style={styles.barColumn}>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: bar.height,
                  backgroundColor: bar.active ? COLORS.primary : "#B4BDAC",
                },
              ]}
            />
          </View>
          <Text style={styles.xAxisText}>{bar.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 60 },
  header: { paddingHorizontal: 32, marginTop: 40, marginBottom: 24 },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -1,
  },

  card: {
    marginHorizontal: 32,
    marginBottom: 20,
    padding: 32,
    borderRadius: 48,
    backgroundColor: COLORS.accent + "50", // Matching the light peach tint in original
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.5,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: "center",
  },
  stepsValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
    marginBottom: 24,
  },
  stepsValue: {
    fontSize: 72,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -2,
  },
  stepsUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textMuted,
    opacity: 0.6,
  },

  progressContainer: {
    height: 12,
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "#E0CFC5",
    borderRadius: 6,
    width: "100%",
    opacity: 0.4,
  },
  progressBarFill: {
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    position: "absolute",
    left: 0,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  progressLabelText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.6,
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cardTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  chartArea: { marginTop: 10 },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: "center", // căn giữa bar + label theo cột
    gap: 10,
  },
  barWrapper: {
    height: 100,
    justifyContent: "flex-end", // bar mọc từ dưới lên
  },
  bar: {
    width: 40,
    borderRadius: 20,
  },
  xAxisText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.4,
  },

  statsGrid: { flexDirection: "row", paddingHorizontal: 32, marginBottom: 20 },
  statBox: {
    flex: 1,
    padding: 32,
    borderRadius: 48,
    backgroundColor: COLORS.accent + "50",
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.5,
    marginBottom: 8,
  },
  statValueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  statValueText: { fontSize: 32, fontWeight: "900", color: COLORS.textDark },
  statUnitText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.4,
  },

  mapCard: {
    marginHorizontal: 32,
    padding: 32,
    borderRadius: 54,
    backgroundColor: COLORS.accent + "50",
    overflow: "hidden",
  },
  mapCardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 24,
  },
  mapContainer: {
    height: 180,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#EBE0D8",
  },
  mapImage: { width: "100%", height: "100%", opacity: 0.8 },
  mapOverlay: { ...StyleSheet.absoluteFillObject },
});
