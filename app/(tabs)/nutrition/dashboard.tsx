import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronRight, Plus, Sparkles } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/bottom-nav";
import {
  MacroBar,
  MealCard,
  NutritionAvatar,
  NutritionTopBar,
  RingProgress,
} from "@/components/nutrition";
import {
  DASHBOARD_MACROS,
  DASHBOARD_MEALS,
  NUTRITION_TARGETS,
} from "@/constants/nutrition";
import {
  getMealImage,
  getNutritionDashboard,
  logWater,
} from "@/services/nutritionService";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const RING_SIZE = 256;
const RING_STROKE = 14;

export default function NutritionDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getNutritionDashboard();
      setDashboard(res);
    } catch (err) {
      console.log("[DASHBOARD] Error fetching nutrition dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={c.sageDark} />
        <Text style={{ marginTop: 16, fontFamily: f.displayMed, fontSize: 16, color: c.textMuted }}>
          Loading your dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  const calories = dashboard?.calories_target ?? 2400;
  const caloriesConsumed = dashboard?.calories_consumed ?? 0;
  const caloriesRemaining = dashboard?.calories_remaining ?? 2400;
  const caloriesBurned = dashboard?.calories_burned ?? 0;
  const waterGoalL = dashboard?.water_goal_l ?? 2.5;
  const waterIntakeL = dashboard?.water_intake_l ?? 0.0;
  const pct = calories > 0 ? caloriesConsumed / calories : 0;

  // Macros
  const macros = dashboard?.macros ? dashboard.macros.map((m: any) => {
    let barColor = c.sage;
    if (m.label.toLowerCase().includes("protein")) barColor = c.blueLight;
    if (m.label.toLowerCase().includes("fat")) barColor = c.yellow;
    return {
      ...m,
      color: barColor
    };
  }) : [
    { label: "Carbohydrates", current: "0g", total: "250g", pct: 0, color: c.sage },
    { label: "Protein", current: "0g", total: "120g", pct: 0, color: c.blueLight },
    { label: "Fats", current: "0g", total: "70g", pct: 0, color: c.yellow },
  ];

  // Meals
  const meals = dashboard?.meals ? dashboard.meals.map((meal: any) => ({
    ...meal,
    image: getMealImage(meal.id)
  })) : [
    { id: "b", title: "Breakfast", desc: "Not logged yet", time: "Plan: 08:30 AM", empty: true, image: getMealImage("b") },
    { id: "l", title: "Lunch", desc: "Not logged yet", time: "Plan: 01:15 PM", empty: true, image: getMealImage("l") },
    { id: "d", title: "Dinner", desc: "Not logged yet", time: "Plan: 07:30 PM", empty: true, image: getMealImage("d") },
    { id: "s", title: "Snacks", desc: "Not logged yet", time: "Plan: 04:45 PM", empty: true, image: getMealImage("s") },
  ];

  // Insight
  const insight = dashboard?.insight ?? {
    title: "Nutritional Insight",
    desc: "Start logging your meals to get personalized, AI-driven insights on your nutrition."
  };

  const handleQuickAddWater = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await logWater(250); // Add 250ml
      await fetchDashboard();
    } catch (err) {
      console.log("[DASHBOARD] Error quick adding water:", err);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.ringCard}>
          <Text style={s.ringTitle}>Daily Progress</Text>
          <Text style={s.ringTarget}>
            Target: {calories.toLocaleString()} kcal
          </Text>

          <View style={s.ringWrap}>
            <RingProgress
              size={RING_SIZE}
              stroke={RING_STROKE}
              pct={pct}
              color={c.sageDark}
              trackColor={c.cardCream}
            >
              <Text style={s.ringValue}>
                {caloriesConsumed.toLocaleString()}
              </Text>
              <Text style={s.ringUnit}>kcal consumed</Text>
            </RingProgress>
          </View>

          <View style={s.ringBottomStats}>
            <View style={s.ringStatItem}>
              <Text style={s.ringStatLabel}>REMAINING</Text>
              <Text style={[s.ringStatValue, { color: c.sageDark }]}>
                {caloriesRemaining}
              </Text>
            </View>
            <View style={s.ringStatItem}>
              <Text style={s.ringStatLabel}>BURNED</Text>
              <Text style={[s.ringStatValue, { color: c.pink }]}>
                {caloriesBurned}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.macroCard}>
          <Text style={s.macroTitle}>Macro Intake</Text>
          {macros.map((m: any) => (
            <MacroBar
              key={m.label}
              label={m.label}
              value={`${m.current} / ${m.total}`}
              pct={m.pct}
              color={m.color}
              containerStyle={{ marginTop: 24 }}
            />
          ))}
        </View>

        <View style={s.waterCard}>
          <Pressable 
            style={s.waterRow} 
            onPress={() => router.push("/nutrition/water-log")}
          >
            <View>
              <Text style={s.waterLabel}>Water Intake</Text>
              <View style={s.waterRow}>
                <Text style={s.waterValue}>
                  {waterIntakeL.toFixed(1)}{" "}
                </Text>
                <Text style={s.waterUnit}>
                  / {waterGoalL.toFixed(1)} L
                </Text>
              </View>
            </View>
          </Pressable>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={s.waterAddBtn}
            onPress={handleQuickAddWater}
          >
            <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={s.mealsHeader}>
          <Text style={s.mealsTitle}>Today&apos;s Meals</Text>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Pressable
              hitSlop={6}
              style={s.addMealBtn}
              onPress={() => router.push("/nutrition/food-log")}
            >
              <Text style={s.addMealText}>View Log</Text>
              <ChevronRight size={12} color={c.sageDark} strokeWidth={2.5} />
            </Pressable>
            <Text style={{ color: "rgba(75,101,70,0.2)", fontFamily: f.display }}>|</Text>
            <Pressable
              hitSlop={6}
              style={s.addMealBtn}
              onPress={() => router.push("/nutrition/add-food")}
            >
              <Text style={s.addMealText}>Add</Text>
              <ChevronRight size={12} color={c.sageDark} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <View style={s.mealsList}>
          {meals.map((meal: any) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => {
                if (meal.empty) {
                  router.push("/nutrition/add-food");
                } else {
                  router.push("/nutrition/food-log");
                }
              }}
            />
          ))}
        </View>

        <View style={s.insightCard}>
          <View style={s.insightIconBox}>
            <Sparkles size={25} color={c.sageDark} strokeWidth={2} />
          </View>
          <Text style={s.insightTitle}>{insight.title}</Text>
          <Text style={s.insightDesc}>
            {insight.desc}
          </Text>
          <TouchableOpacity activeOpacity={0.9} style={s.trendsBtn}>
            <Text style={s.trendsBtnText}>View Trends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Nutrition"
        onBack={() => router.replace("/nutrition")}
        rightSlot={<NutritionAvatar variant="sage" />}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingTop: 90, paddingBottom: 130 },

  ringCard: {
    marginHorizontal: 24,
    backgroundColor: c.card,
    borderRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 32,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  ringTitle: {
    fontFamily: f.displayMed,
    fontSize: 18,
    color: c.textDim,
    lineHeight: 28,
  },
  ringTarget: {
    fontFamily: f.display,
    fontSize: 14,
    color: c.textMuted,
    lineHeight: 20,
  },
  ringWrap: { marginTop: 24, alignItems: "center", justifyContent: "center" },
  ringValue: {
    fontFamily: f.displayBold,
    fontSize: 36,
    color: c.textDark,
    lineHeight: 40,
  },
  ringUnit: {
    marginTop: 4,
    fontFamily: f.displayMed,
    fontSize: 14,
    color: c.textMuted,
    lineHeight: 20,
  },
  ringBottomStats: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  ringStatItem: { alignItems: "center", gap: 4 },
  ringStatLabel: {
    fontFamily: f.display,
    fontSize: 12,
    color: c.textMuted,
    letterSpacing: 1.2,
    lineHeight: 16,
  },
  ringStatValue: { fontFamily: f.displayBold, fontSize: 20, lineHeight: 28 },

  macroCard: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: c.cardCream,
    borderRadius: 32,
    padding: 24,
  },
  macroTitle: {
    fontFamily: f.displaySemi,
    fontSize: 18,
    color: c.textDark,
    lineHeight: 28,
  },

  waterCard: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: c.sageDark,
    borderRadius: 32,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waterLabel: {
    fontFamily: f.display,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    lineHeight: 20,
  },
  waterRow: { flexDirection: "row", alignItems: "flex-end" },
  waterValue: {
    fontFamily: f.displayBold,
    fontSize: 24,
    color: "#FFFFFF",
    lineHeight: 32,
  },
  waterUnit: {
    fontFamily: f.display,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 4,
  },
  waterAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  mealsHeader: {
    marginTop: 32,
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealsTitle: {
    fontFamily: f.displayBold,
    fontSize: 24,
    color: c.textDark,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  addMealBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  addMealText: {
    fontFamily: f.displayMed,
    fontSize: 14,
    color: c.sageDark,
    lineHeight: 20,
  },

  mealsList: { marginTop: 32, marginHorizontal: 24, gap: 24 },

  insightCard: {
    marginTop: 24,
    marginHorizontal: 24,
    paddingHorizontal: 33,
    paddingVertical: 33,
    backgroundColor: c.cardPeach,
    borderRadius: 32,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    alignItems: "center",
    gap: 32,
  },
  insightIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: c.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  insightTitle: {
    fontFamily: f.displayBold,
    fontSize: 18,
    color: c.textDark,
    lineHeight: 28,
    textAlign: "center",
  },
  insightDesc: {
    marginTop: -16,
    fontFamily: f.display,
    fontSize: 14,
    color: c.textDim,
    lineHeight: 22.75,
    textAlign: "center",
  },
  trendsBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: c.sageDark,
    borderRadius: 999,
  },
  trendsBtnText: {
    fontFamily: f.displayBold,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
});
