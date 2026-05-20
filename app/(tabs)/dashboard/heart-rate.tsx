import BottomNav from "@/components/bottom-nav";
import { Heart } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Dimensions, ScrollView, StatusBar, StyleSheet, Text, View
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFBF8",
  surface: "#FFFFFF",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  primary: "#4C6647", // Sage
  accent: "#FDF1EB", // Soft Peach
  white: "#FFFFFF",

  // Zone Colors
  zoneRest: "#CDE5C9",
  zoneFatBurn: "#4E607C",
  zoneCardio: "#7B5556",
  zonePeak: "#A34A4A",
};

export default function HeartRateNative() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Heart Rate</Text>
        </View>

        {/* Current Heart Rate Card */}
        <View style={styles.currentCard}>
          <Text style={styles.cardLabel}>Current Heart Rate</Text>
          <View style={styles.rateRow}>
            <Text style={styles.rateValue}>72</Text>
            <Text style={styles.rateUnit}>BPM</Text>
          </View>

          <View style={styles.restingBadge}>
            <Heart
              size={16}
              color={COLORS.zoneCardio}
              fill={COLORS.zoneCardio}
            />
            <Text style={styles.restingBadgeText}>Resting Zone</Text>
          </View>
        </View>

        {/* Today's Rhythm Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Today's Rhythm</Text>

          <View style={styles.chartContainer}>
            <Svg height="160" width={width - 120} viewBox="0 0 400 120">
              <Defs>
                <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop
                    offset="0"
                    stopColor={COLORS.primary}
                    stopOpacity={0.15}
                  />
                  <Stop offset="1" stopColor={COLORS.primary} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path
                d="M0,80 Q50,75 100,60 T200,40 T300,70 T400,65 L400,120 L0,120 Z"
                fill="url(#chartGrad)"
              />
              <Path
                d="M0,80 Q50,75 100,60 T200,40 T300,70 T400,65"
                fill="none"
                stroke={COLORS.primary}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.xAxis}>
              {["12 AM", "6 AM", "12 PM", "6 PM", "Now"].map((label) => (
                <Text key={label} style={styles.xAxisText}>
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Time in Zones */}
        <View style={styles.zonesSection}>
          <Text style={styles.sectionTitle}>Time in Zones</Text>

          <ZoneItem
            label="Rest"
            range="< 100 BPM"
            duration="14h 20m"
            percentage="65%"
            color={COLORS.zoneRest}
          />
          <ZoneItem
            label="Fat Burn"
            range="100 - 135 BPM"
            duration="2h 15m"
            percentage="20%"
            color={COLORS.zoneFatBurn}
          />
          <ZoneItem
            label="Cardio"
            range="135 - 165 BPM"
            duration="45m"
            percentage="10%"
            color={COLORS.zoneCardio}
          />
          <ZoneItem
            label="Peak"
            range="> 165 BPM"
            duration="10m"
            percentage="5%"
            color={COLORS.zonePeak}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

function ZoneItem({ label, range, duration, percentage, color }: any) {
  return (
    <View style={styles.zoneItem}>
      <View style={[styles.zoneIndicator, { backgroundColor: color }]} />
      <View style={styles.zoneTextContent}>
        <Text style={styles.zoneLabel}>{label}</Text>
        <Text style={styles.zoneRange}>{range}</Text>
      </View>
      <View style={styles.zoneValueContent}>
        <Text style={styles.zoneDuration}>{duration}</Text>
        <Text style={styles.zonePercentage}>{percentage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 140 },
  header: { paddingHorizontal: 28, marginTop: 40, marginBottom: 32 },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -1,
  },

  currentCard: {
    marginHorizontal: 28,
    padding: 40,
    borderRadius: 48,
    backgroundColor: "#FFFFFF", // Clean white surfacing as seen in image
    alignItems: "center",
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textMuted,
    opacity: 0.8,
    marginBottom: 16,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 20,
  },
  rateValue: {
    fontSize: 96,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -4,
  },
  rateUnit: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    opacity: 0.9,
  },
  restingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
  },
  restingBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.zoneCardio,
  },

  chartCard: {
    marginHorizontal: 28,
    marginTop: 32,
    padding: 32,
    borderRadius: 48,
    backgroundColor: COLORS.accent + "30",
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 32,
  },
  chartContainer: { alignItems: "center" },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 4,
  },
  xAxisText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.5,
  },

  zonesSection: { marginTop: 40, paddingHorizontal: 28 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 24,
  },

  zoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.02)",
  },
  zoneIndicator: { width: 6, height: 44, borderRadius: 3, marginRight: 20 },
  zoneTextContent: { flex: 1 },
  zoneLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  zoneRange: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    opacity: 0.6,
  },
  zoneValueContent: { alignItems: "flex-end" },
  zoneDuration: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  zonePercentage: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.5,
  },
});
