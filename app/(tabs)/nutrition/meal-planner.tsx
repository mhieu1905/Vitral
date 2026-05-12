import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import {
  NutritionAvatar,
  NutritionTopBar,
  PlannerMealSlot,
  PlannerSummaryCard,
  WeekDayChip,
} from '@/components/nutrition';
import {
  MEAL_PLANNER_DAILY,
  MEAL_PLANNER_SLOTS,
  MEAL_PLANNER_WEEK,
} from '@/constants/nutrition';
import { nutritionColors as c } from '@/theme/nutrition';

export default function MealPlannerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.weekStrip}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.weekStripContent}
          >
            {MEAL_PLANNER_WEEK.map((d) => (
              <WeekDayChip
                key={d.id}
                shortLabel={d.shortLabel}
                dayNumber={d.dayNumber}
                active={d.isActive}
              />
            ))}
          </ScrollView>
        </View>

        <View style={s.summaryWrap}>
          <PlannerSummaryCard
            targetKcal={MEAL_PLANNER_DAILY.targetKcal}
            plannedKcal={MEAL_PLANNER_DAILY.plannedKcal}
            macros={MEAL_PLANNER_DAILY.macros}
          />
        </View>

        <View style={s.mealsWrap}>
          {MEAL_PLANNER_SLOTS.map((slot) => (
            <PlannerMealSlot key={slot.id} slot={slot} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.9}
        style={s.fab}
        onPress={() => router.push('/nutrition/select-day')}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      <NutritionTopBar
        title="Meal Planner"
        titleAlign="center"
        height={64}
        backgroundColor="rgba(253,248,243,0.9)"
        titleStyle={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.6 }}
        onBack={() => router.dismissTo('/nutrition')}
        rightSlot={<NutritionAvatar variant="sage" />}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingTop: 124, paddingHorizontal: 24, paddingBottom: 160 },

  weekStrip: { marginHorizontal: -24 },
  weekStripContent: { paddingHorizontal: 24, paddingVertical: 8, gap: 12 },

  summaryWrap: { marginTop: 16 },
  mealsWrap: { marginTop: 32, gap: 24 },

  fab: {
    position: 'absolute',
    right: 25,
    bottom: 112,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: c.sageDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.sageDark,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 25,
    elevation: 12,
    zIndex: 40,
  },
});
