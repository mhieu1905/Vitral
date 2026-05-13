import BottomNav from "@/components/bottom-nav";
import { Calendar, CheckCircle2, Footprints, Timer } from "lucide-react-native";
import React, { useState } from "react";
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
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#FFFBF8",
  surface: "#FFFFFF",
  textDark: "#3D3027",
  textMuted: "#6B5C52",
  primary: "#4C6647",
  primaryContainer: "#E3F1DF",
  secondary: "#7B5556",
  secondaryContainer: "#FEEEEE",
  tertiary: "#4E607C",
  tertiaryContainer: "#E8F0FE",
  peach: "#F8E4D9",
};

type MetricKey = "Weight" | "Steps" | "Calories";
type RangeKey = "W" | "M" | "Y";

interface RangeDataPoint {
  label: string;
  value: number;
}

interface RangeInfo {
  total: string;
  change: string;
  path: string;
  data: RangeDataPoint[];
}

interface MetricInfo {
  unit: string;
  color: string;
  ranges: Record<RangeKey, RangeInfo>;
}

const METRICS_DATA: Record<MetricKey, MetricInfo> = {
  Weight: {
    unit: "lbs",
    color: COLORS.primary,
    ranges: {
      W: {
        total: "164.2",
        change: "-1.4 lbs",
        path: "M0,40 Q50,0 100,50 T200,30 T300,60 T400,20",
        data: [
          { label: "MON", value: 165.4 },
          { label: "TUE", value: 165.0 },
          { label: "WED", value: 164.2 },
          { label: "THU", value: 164.5 },
          { label: "FRI", value: 164.0 },
          { label: "SAT", value: 163.8 },
          { label: "SUN", value: 164.2 },
        ],
      },
      M: {
        total: "165.1",
        change: "-3.2 lbs",
        path: "M0,60 Q100,20 200,80 T400,40",
        data: [
          { label: "W1", value: 168.2 },
          { label: "W2", value: 167.5 },
          { label: "W3", value: 166.0 },
          { label: "W4", value: 165.1 },
        ],
      },
      Y: {
        total: "164.2",
        change: "-12 lbs",
        path: "M0,80 Q100,40 200,20 T400,60",
        data: [
          { label: "JAN", value: 176 },
          { label: "MAR", value: 172 },
          { label: "MAY", value: 170 },
          { label: "JUL", value: 168 },
          { label: "SEP", value: 166 },
          { label: "NOV", value: 164 },
        ],
      },
    },
  },
  Steps: {
    unit: "steps",
    color: COLORS.secondary,
    ranges: {
      W: {
        total: "8,432",
        change: "+12%",
        path: "M0,80 Q100,20 200,60 T400,40",
        data: [
          { label: "MON", value: 6200 },
          { label: "TUE", value: 7800 },
          { label: "WED", value: 9100 },
          { label: "THU", value: 8432 },
          { label: "FRI", value: 7200 },
          { label: "SAT", value: 11000 },
          { label: "SUN", value: 9500 },
        ],
      },
      M: {
        total: "243,500",
        change: "+5%",
        path: "M0,40 Q100,10 200,50 T400,30",
        data: [
          { label: "W1", value: 58000 },
          { label: "W2", value: 62000 },
          { label: "W3", value: 65000 },
          { label: "W4", value: 58500 },
        ],
      },
      Y: {
        total: "2.8M",
        change: "+20%",
        path: "M0,90 Q100,30 200,10 T400,50",
        data: [
          { label: "JAN", value: 210000 },
          { label: "MAR", value: 240000 },
          { label: "MAY", value: 190000 },
          { label: "JUL", value: 280000 },
          { label: "SEP", value: 250000 },
          { label: "NOV", value: 220000 },
        ],
      },
    },
  },
  Calories: {
    unit: "kcal",
    color: COLORS.tertiary,
    ranges: {
      W: {
        total: "1,850",
        change: "-50 kcal",
        path: "M0,50 Q100,80 200,30 T400,70",
        data: [
          { label: "MON", value: 1950 },
          { label: "TUE", value: 1800 },
          { label: "WED", value: 1850 },
          { label: "THU", value: 2100 },
          { label: "FRI", value: 1750 },
          { label: "SAT", value: 2200 },
          { label: "SUN", value: 1900 },
        ],
      },
      M: {
        total: "55,500",
        change: "-2%",
        path: "M0,20 Q100,60 200,40 T400,80",
        data: [
          { label: "W1", value: 13500 },
          { label: "W2", value: 14200 },
          { label: "W3", value: 13800 },
          { label: "W4", value: 14000 },
        ],
      },
      Y: {
        total: "675k",
        change: "-8%",
        path: "M0,70 Q100,20 200,50 T400,10",
        data: [
          { label: "JAN", value: 62000 },
          { label: "MAR", value: 58000 },
          { label: "MAY", value: 55000 },
          { label: "JUL", value: 52000 },
          { label: "SEP", value: 48000 },
          { label: "NOV", value: 45000 },
        ],
      },
    },
  },
};

export default function NativeProgress() {
  const [activeTab, setActiveTab] = useState("Stats");
  const [activeMetric, setActiveMetric] = useState<MetricKey>("Weight");
  const [activeRange, setActiveRange] = useState<RangeKey>("W");

  const metric = METRICS_DATA[activeMetric];
  const rangeData = metric.ranges[activeRange];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>OVERVIEW & TRENDS</Text>
          <Text style={styles.title}>PROGRESS</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Calendar color={COLORS.textDark} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Metric Selector */}
        <View style={styles.metricSelector}>
          {(Object.keys(METRICS_DATA) as MetricKey[]).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveMetric(key)}
              style={[
                styles.metricTab,
                activeMetric === key && styles.metricTabActive,
                activeMetric === key && {
                  shadowColor: METRICS_DATA[key].color,
                },
              ]}
            >
              <Text
                style={[
                  styles.metricTabText,
                  {
                    color:
                      activeMetric === key
                        ? METRICS_DATA[key].color
                        : COLORS.textMuted,
                  },
                ]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>
            TOTAL{" "}
            {activeRange === "W"
              ? "THIS WEEK"
              : activeRange === "M"
                ? "THIS MONTH"
                : "THIS YEAR"}
          </Text>
          <View style={styles.chartValueRow}>
            <Text style={styles.chartValue}>{rangeData.total}</Text>
            <Text style={[styles.chartChange, { color: metric.color }]}>
              {rangeData.change}
            </Text>
          </View>

          {/* Simple Mock Chart using SVG */}
          <View style={styles.chartContainer}>
            <Svg
              height="150"
              width="100%"
              viewBox="0 -20 400 140"
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={metric.color} stopOpacity={0.2} />
                  <Stop offset="1" stopColor={metric.color} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path
                d={rangeData.path + " L400,120 L0,120 Z"}
                fill="url(#grad)"
              />
              <Path
                d={rangeData.path}
                fill="none"
                stroke={metric.color}
                strokeWidth="4"
              />
              {/* WED dot - only show for weekly at index 2 */}
              {activeRange === "W" && (
                <Circle
                  cx="100"
                  cy="50"
                  r="6"
                  fill={metric.color}
                  stroke="#fff"
                  strokeWidth="3"
                />
              )}
            </Svg>
          </View>

          {/* X-Axis Labels */}
          <View style={styles.xAxis}>
            {rangeData.data.map((d) => (
              <Text key={d.label} style={styles.xAxisText}>
                {d.label}
              </Text>
            ))}
          </View>

          {/* Range Tabs */}
          <View style={styles.rangeSelector}>
            {(["W", "M", "Y"] as RangeKey[]).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setActiveRange(r)}
                style={[
                  styles.rangeTab,
                  activeRange === r && { backgroundColor: metric.color },
                ]}
              >
                <Text
                  style={[
                    styles.rangeTabText,
                    activeRange === r && { color: "#fff" },
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats List */}
        <View style={styles.statsList}>
          <StatRow
            label="AVG. STEPS"
            value="8,432"
            icon={<Footprints size={24} color={COLORS.primary} />}
          />
          <StatRow
            label="GOAL COMPLETION"
            value="85%"
            subValue="+2%"
            icon={<CheckCircle2 size={24} color={COLORS.primary} />}
          />
          <StatRow
            label="ACTIVE MINUTES"
            value="42"
            icon={<Timer size={24} color={COLORS.primary} />}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

function StatRow({ label, value, subValue, icon }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.statValueContainer}>
          <Text style={styles.statValue}>{value}</Text>
          {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
        </View>
      </View>
      <View style={styles.statIconBox}>{icon}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 32,
    marginTop: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.3,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -1,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  scrollContent: { paddingBottom: 120 },
  metricSelector: {
    marginHorizontal: 32,
    padding: 6,
    borderRadius: 40,
    backgroundColor: COLORS.secondaryContainer + "40",
    flexDirection: "row",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  metricTab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  metricTabActive: {
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  metricTabText: { fontSize: 14, fontWeight: "700" },
  chartCard: {
    marginHorizontal: 32,
    marginTop: 32,
    padding: 32,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FDEAE0",
    overflow: "hidden",
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.4,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  chartValueRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  chartValue: { fontSize: 48, fontWeight: "900", color: COLORS.textDark },
  chartChange: { fontSize: 14, fontWeight: "800" },
  chartContainer: {
    height: 150,
    marginTop: 24,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  xAxisText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.3,
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 40,
  },
  rangeTab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9ECE6",
    alignItems: "center",
    justifyContent: "center",
  },
  rangeTabText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.6,
  },
  statsList: { paddingHorizontal: 32, marginTop: 32, gap: 16 },
  statRow: {
    padding: 24,
    paddingHorizontal: 32,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FDEAE0",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    opacity: 0.4,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValueContainer: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  statValue: { fontSize: 32, fontWeight: "900", color: COLORS.textDark },
  statSubValue: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  statIconBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: COLORS.peach + "40",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 60,
    height: 60,
  },
  navButtonActive: { backgroundColor: "#BDD4B9", borderRadius: 20 },
  navLabel: { fontSize: 10, fontWeight: "900" },
});
