import BottomNav from "@/components/bottom-nav";
import { AlarmClock, Moon, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { AddSleepSheet } from "@/components/dashboard/add-sleep-sheet";
import {
  getLocalDateYYYYMMDD,
  getSleepToday,
  upsertSleepToday,
} from "@/services/sleepService";

const COLORS = {
  background: "#FDF8F3",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  sage: "#4C6647",
  rose: "#7B5556",
  lightBlue: "#BDD2F1",
  awake: "#EAE0D5",
  insightBg: "#3D4F6A",
  cardBg: "#FFF1E9",
};

export default function SleepTrackerPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getSleepToday>
  > | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const today = getLocalDateYYYYMMDD();
      const res = await getSleepToday(today);
      setData(res);
    } catch (e) {
      console.log("[SLEEP] getSleepToday failed:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const score = data?.score ?? 0;
  const statusText = data?.status_text ?? (loading ? "Loading…" : "No log yet");
  const totalMin = data?.total_duration_min ?? 0;
  const wakeTime = data?.wake_time ?? "--:--";
  const arch = data?.architecture ?? {
    awake_min: 0,
    rem_min: 0,
    light_min: 0,
    deep_min: 0,
  };

  const scorePct = useMemo(
    () => Math.max(0, Math.min(1, score / 100)),
    [score],
  );
  const totalDurationText = useMemo(() => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (totalMin <= 0) return "--";
    return `${h}h ${m}m`;
  }, [totalMin]);

  const legend = useMemo(() => {
    const fmt = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      if (h <= 0) return `${m}m`;
      if (m <= 0) return `${h}h`;
      return `${h}h ${m}m`;
    };
    return {
      awake: fmt(arch.awake_min),
      rem: fmt(arch.rem_min),
      light: fmt(arch.light_min),
      deep: fmt(arch.deep_min),
    };
  }, [arch.awake_min, arch.deep_min, arch.light_min, arch.rem_min]);

  const segFlex = useMemo(() => {
    const sum = arch.awake_min + arch.rem_min + arch.light_min + arch.deep_min;
    if (sum <= 0) return { awake: 0.1, rem: 0.25, light: 0.45, deep: 0.2 };
    return {
      awake: Math.max(0.04, arch.awake_min / sum),
      rem: Math.max(0.04, arch.rem_min / sum),
      light: Math.max(0.04, arch.light_min / sum),
      deep: Math.max(0.04, arch.deep_min / sum),
    };
  }, [arch.awake_min, arch.deep_min, arch.light_min, arch.rem_min]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Main Sleep Quality Circle */}
        <View style={styles.qualitySection}>
          <Pressable
            onPress={() => setSheetOpen(true)}
            style={styles.circularContainer}
          >
            <Svg width="280" height="280" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(76, 102, 71, 0.1)"
                strokeWidth="4"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="45"
                stroke={COLORS.sage}
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 * (1 - scorePct)}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <View style={styles.qualityTextContainer}>
              <Text style={styles.qualityLabel}>SLEEP QUALITY</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={styles.scoreTotal}>/100</Text>
              </View>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </Pressable>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Moon color={COLORS.sage} size={24} />
            <Text style={styles.statLabel}>Total Duration</Text>
            <Text style={styles.statValue}>{totalDurationText}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F8E4D9" }]}>
            <AlarmClock color={COLORS.rose} size={24} />
            <Text style={styles.statLabel}>Wake Time</Text>
            <Text style={styles.statValue}>{wakeTime}</Text>
          </View>
        </View>

        {/* Sleep Architecture Section */}
        <View style={styles.architectureSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sleep Architecture</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Daily View</Text>
            </View>
          </View>

          {/* Segmented Bar */}
          <View style={styles.segmentedBar}>
            <View
              style={[
                styles.segment,
                {
                  flex: segFlex.awake,
                  backgroundColor: COLORS.awake,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                },
              ]}
            />
            <View
              style={[
                styles.segment,
                { flex: segFlex.rem, backgroundColor: COLORS.rose },
              ]}
            />
            <View
              style={[
                styles.segment,
                { flex: segFlex.light, backgroundColor: COLORS.lightBlue },
              ]}
            />
            <View
              style={[
                styles.segment,
                {
                  flex: segFlex.deep,
                  backgroundColor: COLORS.sage,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                },
              ]}
            />
          </View>

          {/* Legend Grid */}
          <View style={styles.legendGrid}>
            <View style={styles.legendRow}>
              <LegendItem
                color={COLORS.awake}
                label="AWAKE"
                value={legend.awake}
              />
              <LegendItem color={COLORS.rose} label="REM" value={legend.rem} />
            </View>
            <View style={styles.legendRow}>
              <LegendItem
                color={COLORS.lightBlue}
                label="LIGHT"
                value={legend.light}
              />
              <LegendItem
                color={COLORS.sage}
                label="DEEP"
                value={legend.deep}
              />
            </View>
          </View>
        </View>

        {/* Insights Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Sparkles color="#FFFFFF" size={20} />
            <Text style={styles.insightTag}>INSIGHTS</Text>
          </View>
          <Text style={styles.insightTitle}>{data?.insight_title ?? "—"}</Text>
          <Text style={styles.insightDescription}>
            {data?.insight_description ?? "—"}
          </Text>
        </View>
      </ScrollView>

      <AddSleepSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={async (v) => {
          try {
            const log_date = getLocalDateYYYYMMDD();
            await upsertSleepToday({
              log_date,
              start_time: v.start_time,
              end_time: v.end_time,
              awake_minutes: v.awake_minutes,
              quality_user: v.quality_user,
            });
            setSheetOpen(false);
            await refresh();
          } catch (e) {
            console.log("[SLEEP] upsertSleepToday failed:", e);
          }
        }}
      />
      <BottomNav />
    </SafeAreaView>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View>
        <Text style={styles.legendLabel}>{label}</Text>
        <Text style={styles.legendValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 100, paddingTop: 40 },
  qualitySection: { alignItems: "center", marginBottom: 40 },
  circularContainer: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  qualityTextContainer: { position: "absolute", alignItems: "center" },
  qualityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 1.2,
  },
  scoreRow: { flexDirection: "row", alignItems: "baseline", marginVertical: 4 },
  scoreText: { fontSize: 72, fontWeight: "700", color: COLORS.textDark },
  scoreTotal: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.textMuted,
    marginLeft: 2,
  },
  statusText: { fontSize: 18, fontWeight: "600", color: COLORS.sage },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 32,
    padding: 24,
    gap: 8,
  },
  statLabel: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
  statValue: { fontSize: 24, fontWeight: "700", color: COLORS.textDark },
  architectureSection: { paddingHorizontal: 24, marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: COLORS.textDark },
  pill: {
    backgroundColor: "rgba(107, 92, 82, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
  segmentedBar: { height: 32, flexDirection: "row", marginBottom: 24 },
  segment: { height: "100%" },
  legendGrid: { gap: 16 },
  legendRow: { flexDirection: "row", justifyContent: "space-between" },
  legendItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  legendValue: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },
  insightCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.insightBg,
    borderRadius: 40,
    padding: 32,
    gap: 12,
  },
  insightHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  insightTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    opacity: 0.6,
    letterSpacing: 1.5,
  },
  insightTitle: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  insightDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    lineHeight: 22,
  },
});
