import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Calendar,
  Footprints,
  Utensils as Meal,
  Waves,
  Dumbbell as Yoga,
} from "lucide-react-native";

import Svg, { Circle } from "react-native-svg";

import BottomNav from "@/components/bottom-nav";

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
};

export default function DailySummary() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>OCT 23 – OCT 29</Text>

            <Text style={styles.title}>Daily Summary</Text>
          </View>

          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* GOAL CARD */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>NET BALANCE</Text>

          <View style={styles.goalValueRow}>
            <Text style={styles.goalValue}>1,420</Text>

            <Text style={styles.goalUnit}>kcal</Text>
          </View>

          {/* CIRCLE */}
          <View style={styles.circleContainer}>
            <Svg width="240" height="240" viewBox="0 0 240 240">
              {/* OUTER BG */}
              <Circle
                cx="120"
                cy="120"
                r="90"
                stroke={COLORS.secondaryContainer}
                strokeWidth="14"
                fill="none"
              />

              {/* OUTER ACTIVE */}
              <Circle
                cx="120"
                cy="120"
                r="90"
                stroke={COLORS.secondary}
                strokeWidth="14"
                fill="none"
                strokeDasharray="565"
                strokeDashoffset="140"
                strokeLinecap="round"
                rotation="-90"
                origin="120,120"
              />

              {/* INNER BG */}
              <Circle
                cx="120"
                cy="120"
                r="68"
                stroke={COLORS.primaryContainer}
                strokeWidth="14"
                fill="none"
              />

              {/* INNER ACTIVE */}
              <Circle
                cx="120"
                cy="120"
                r="68"
                stroke={COLORS.primary}
                strokeWidth="14"
                fill="none"
                strokeDasharray="427"
                strokeDashoffset="80"
                strokeLinecap="round"
                rotation="-90"
                origin="120,120"
              />
            </Svg>

            <View style={styles.circleText}>
              <Text style={styles.inText}>In: 1,850</Text>

              <Text style={styles.outText}>Out: 430</Text>
            </View>
          </View>
        </View>

        {/* MACROS */}
        <View style={styles.macroGrid}>
          <MacroCard label="PROTEIN" value="92g" />
          <MacroCard label="CARBS" value="184g" />
          <MacroCard label="FATS" value="56g" />
        </View>

        {/* ACTIVITY */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Activity Log</Text>

            <Text style={styles.activityCount}>4 events today</Text>
          </View>

          <ActivityItem icon={Yoga} title="Morning Yoga" time="08:30 AM" />

          <ActivityItem
            icon={Meal}
            title="Healthy Grain Bowl"
            time="12:15 PM"
          />

          <ActivityItem icon={Footprints} title="Park Walk" time="04:45 PM" />

          <ActivityItem icon={Waves} title="Salmon Dinner" time="07:30 PM" />
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNav />
    </SafeAreaView>
  );
}

function MacroCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroLabel}>{label}</Text>

      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

function ActivityItem({ icon: Icon, title, time }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Icon size={20} color={COLORS.primary} />
      </View>

      <View>
        <Text style={styles.activityTime}>{time}</Text>

        <Text style={styles.activityItemTitle}>{title}</Text>
      </View>
    </View>
  );
}

function NavItem({ icon: Icon, active }: any) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <View style={[styles.navIconBox, active && styles.navIconBoxActive]}>
        <Icon size={20} color={active ? COLORS.primary : COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 140,
  },

  header: {
    paddingHorizontal: 32,
    paddingTop: 20,
    marginBottom: 32,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  dateText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#998B82",
    marginBottom: 8,
  },

  title: {
    fontSize: 46,
    fontWeight: "900",
    color: COLORS.textDark,
  },

  calendarButton: {
    padding: 10,
  },

  goalCard: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 42,
    padding: 32,
    alignItems: "center",
  },

  goalLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#998B82",
    fontWeight: "700",
    marginBottom: 12,
  },

  goalValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  goalValue: {
    fontSize: 64,
    fontWeight: "900",
    color: COLORS.textDark,
  },

  goalUnit: {
    fontSize: 24,
    marginBottom: 10,
    marginLeft: 6,
    color: "#998B82",
  },

  circleContainer: {
    marginTop: 32,
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    position: "absolute",
    alignItems: "center",
  },

  inText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  outText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },

  macroGrid: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 28,
  },

  macroCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 24,
    alignItems: "center",
  },

  macroLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#998B82",
    marginBottom: 8,
    fontWeight: "700",
  },

  macroValue: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
  },

  activitySection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },

  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  activityTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.textDark,
  },

  activityCount: {
    color: "#998B82",
    alignSelf: "center",
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  activityTime: {
    fontSize: 12,
    color: "#998B82",
    marginBottom: 4,
  },

  activityItemTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,

    flexDirection: "row",
    justifyContent: "space-around",

    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 32,

    paddingVertical: 16,
  },

  navItem: {
    alignItems: "center",
  },

  navIconBox: {
    padding: 10,
    borderRadius: 16,
  },

  navIconBoxActive: {
    backgroundColor: COLORS.primaryContainer,
  },
});
