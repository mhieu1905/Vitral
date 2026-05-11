import { useRouter } from 'expo-router';
import { ChevronRight, Plus, Sparkles } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import {
  MacroBar,
  MealCard,
  NutritionAvatar,
  NutritionTopBar,
  RingProgress,
} from '@/components/nutrition';
import {
  DASHBOARD_MACROS,
  DASHBOARD_MEALS,
  NUTRITION_TARGETS,
} from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

const RING_SIZE = 256;
const RING_STROKE = 14;

export default function NutritionDashboard() {
  const router = useRouter();
  const pct = NUTRITION_TARGETS.caloriesConsumed / NUTRITION_TARGETS.calories;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.ringCard}>
          <Text style={s.ringTitle}>Daily Progress</Text>
          <Text style={s.ringTarget}>Target: {NUTRITION_TARGETS.calories.toLocaleString()} kcal</Text>

          <View style={s.ringWrap}>
            <RingProgress
              size={RING_SIZE}
              stroke={RING_STROKE}
              pct={pct}
              color={c.sageDark}
              trackColor={c.cardCream}
            >
              <Text style={s.ringValue}>{NUTRITION_TARGETS.caloriesConsumed.toLocaleString()}</Text>
              <Text style={s.ringUnit}>kcal consumed</Text>
            </RingProgress>
          </View>

          <View style={s.ringBottomStats}>
            <View style={s.ringStatItem}>
              <Text style={s.ringStatLabel}>REMAINING</Text>
              <Text style={[s.ringStatValue, { color: c.sageDark }]}>{NUTRITION_TARGETS.caloriesRemaining}</Text>
            </View>
            <View style={s.ringStatItem}>
              <Text style={s.ringStatLabel}>BURNED</Text>
              <Text style={[s.ringStatValue, { color: c.pink }]}>{NUTRITION_TARGETS.caloriesBurned}</Text>
            </View>
          </View>
        </View>

        <View style={s.macroCard}>
          <Text style={s.macroTitle}>Macro Intake</Text>
          {DASHBOARD_MACROS.map((m) => (
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
          <View>
            <Text style={s.waterLabel}>Water Intake</Text>
            <View style={s.waterRow}>
              <Text style={s.waterValue}>{NUTRITION_TARGETS.waterIntakeL} </Text>
              <Text style={s.waterUnit}>/ {NUTRITION_TARGETS.waterGoalL} L</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={s.waterAddBtn}>
            <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={s.mealsHeader}>
          <Text style={s.mealsTitle}>Today&apos;s Meals</Text>
          <Pressable hitSlop={6} style={s.addMealBtn} onPress={() => router.push('/nutrition/add-food')}>
            <Text style={s.addMealText}>Add Meal</Text>
            <ChevronRight size={12} color={c.sageDark} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={s.mealsList}>
          {DASHBOARD_MEALS.map((meal) => (
            <MealCard key={meal.id} meal={meal} onPress={() => router.push('/nutrition/food-detail')} />
          ))}
        </View>

        <View style={s.insightCard}>
          <View style={s.insightIconBox}>
            <Sparkles size={25} color={c.sageDark} strokeWidth={2} />
          </View>
          <Text style={s.insightTitle}>Nutritional Insight</Text>
          <Text style={s.insightDesc}>
            You&apos;ve reached 80% of your protein goal today. Increasing your intake slightly during dinner will help with muscle recovery after your morning workout.
          </Text>
          <TouchableOpacity activeOpacity={0.9} style={s.trendsBtn}>
            <Text style={s.trendsBtnText}>View Trends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Nutrition"
        onBack={() => router.replace('/nutrition')}
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  ringTitle: { fontFamily: f.displayMed, fontSize: 18, color: c.textDim, lineHeight: 28 },
  ringTarget: { fontFamily: f.display, fontSize: 14, color: c.textMuted, lineHeight: 20 },
  ringWrap: { marginTop: 24, alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontFamily: f.displayBold, fontSize: 36, color: c.textDark, lineHeight: 40 },
  ringUnit: { marginTop: 4, fontFamily: f.displayMed, fontSize: 14, color: c.textMuted, lineHeight: 20 },
  ringBottomStats: { marginTop: 32, flexDirection: 'row', justifyContent: 'space-around' },
  ringStatItem: { alignItems: 'center', gap: 4 },
  ringStatLabel: { fontFamily: f.display, fontSize: 12, color: c.textMuted, letterSpacing: 1.2, lineHeight: 16 },
  ringStatValue: { fontFamily: f.displayBold, fontSize: 20, lineHeight: 28 },

  macroCard: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: c.cardCream,
    borderRadius: 32,
    padding: 24,
  },
  macroTitle: { fontFamily: f.displaySemi, fontSize: 18, color: c.textDark, lineHeight: 28 },

  waterCard: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: c.sageDark,
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterLabel: { fontFamily: f.display, fontSize: 14, color: '#FFFFFF', opacity: 0.8, lineHeight: 20 },
  waterRow: { flexDirection: 'row', alignItems: 'flex-end' },
  waterValue: { fontFamily: f.displayBold, fontSize: 24, color: '#FFFFFF', lineHeight: 32 },
  waterUnit: { fontFamily: f.display, fontSize: 14, color: '#FFFFFF', lineHeight: 20, marginBottom: 4 },
  waterAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mealsHeader: { marginTop: 32, marginHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealsTitle: { fontFamily: f.displayBold, fontSize: 24, color: c.textDark, lineHeight: 32, letterSpacing: -0.6 },
  addMealBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addMealText: { fontFamily: f.displayMed, fontSize: 14, color: c.sageDark, lineHeight: 20 },

  mealsList: { marginTop: 32, marginHorizontal: 24, gap: 24 },

  insightCard: {
    marginTop: 24,
    marginHorizontal: 24,
    paddingHorizontal: 33,
    paddingVertical: 33,
    backgroundColor: c.cardPeach,
    borderRadius: 32,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    alignItems: 'center',
    gap: 32,
  },
  insightIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  insightTitle: { fontFamily: f.displayBold, fontSize: 18, color: c.textDark, lineHeight: 28, textAlign: 'center' },
  insightDesc: {
    marginTop: -16,
    fontFamily: f.display,
    fontSize: 14,
    color: c.textDim,
    lineHeight: 22.75,
    textAlign: 'center',
  },
  trendsBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: c.sageDark,
    borderRadius: 999,
  },
  trendsBtnText: { fontFamily: f.displayBold, fontSize: 14, color: '#FFFFFF', lineHeight: 20 },
});
