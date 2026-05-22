import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ChevronLeft, Clock, Flame, MoreVertical } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BottomNav from "@/components/bottom-nav";
import {
  AddWaterSheet,
  HydrationChart,
  WaterCircle,
  WaterQuickAddRow,
  WaterStatCard,
  WaterToast,
} from "@/components/nutrition";
import {
  HYDRATION_HISTORY,
  WATER_CUSTOM_DEFAULT_ML,
  WATER_LOG_GOAL_ML,
  WATER_QUICK_TILE_AMOUNTS_ML,
  WATER_STATS_FACTORY,
  getWaterMotivationalMessage,
} from "@/constants/nutrition";
import {
  getHydrationHistory,
  getNutritionDashboard,
  logWater,
} from "@/services/nutritionService";
import {
  nutritionColors as c,
  nutritionFonts as f,
  waterColors as w,
} from "@/theme/nutrition";

const TOAST_DURATION_MS = 3500;

export default function WaterLogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(WATER_LOG_GOAL_ML);
  const [history, setHistory] = useState(HYDRATION_HISTORY);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetInitialSelected, setSheetInitialSelected] = useState(0);
  const [toast, setToast] = useState<{ visible: boolean; amount: number }>({
    visible: false,
    amount: 0,
  });

  const fetchWaterIntake = useCallback(async () => {
    try {
      const res = await getNutritionDashboard();
      setIntake(Math.round((res.water_intake_l || 0) * 1000));
      setGoal(Math.round((res.water_goal_l || 2.5) * 1000));
    } catch (err) {
      console.log("[WATER-LOG] Error fetching water stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchWaterIntake();
  }, [fetchWaterIntake]);

  const fetchHydrationHistory = useCallback(async () => {
    try {
      const data = await getHydrationHistory(7);
      if (Array.isArray(data) && data.length > 0) setHistory(data);
    } catch (err) {
      console.log("[WATER-LOG] Error fetching hydration history:", err);
    }
  }, []);

  useEffect(() => {
    fetchHydrationHistory();
  }, [fetchHydrationHistory]);

  const percentage = Math.min(Math.round((intake / goal) * 100), 100);
  const remaining = Math.max(goal - intake, 0);
  const motivation = getWaterMotivationalMessage(percentage);
  const stats = useMemo(() => WATER_STATS_FACTORY(Clock, Flame), []);

  const openSheet = (preset: number) => {
    setSheetInitialSelected(preset);
    setSheetVisible(true);
    void Haptics.selectionAsync();
  };

  const closeSheet = () => setSheetVisible(false);

  const handleConfirm = async (amount: number) => {
    try {
      setSheetVisible(false);

      // Save water log to database
      await logWater(amount);

      // Success triggers
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await fetchWaterIntake();

      setToast({ visible: true, amount });
      setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, TOAST_DURATION_MS);
    } catch (err) {
      console.log("[WATER-LOG] Error logging water intake:", err);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["bottom"]}>
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <Pressable
          hitSlop={10}
          onPress={() => router.dismissTo("/nutrition")}
          style={s.iconBtn}
        >
          <ChevronLeft size={18} color={c.sageDark} strokeWidth={2.5} />
        </Pressable>
        <Text style={s.title}>Water Log</Text>
        <Pressable hitSlop={10} style={s.iconGhost}>
          <MoreVertical size={18} color={c.textMuted} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heroWrap}>
          <WaterCircle percentage={percentage} intake={intake} goal={goal} />
        </View>

        <View style={s.statusCard}>
          <Text style={s.statusPrimary}>
            {remaining > 0
              ? `${remaining.toLocaleString()} ml left to reach your goal`
              : "You've reached your goal!"}
          </Text>
          <Text style={s.statusSecondary}>{motivation}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Add</Text>
          <WaterQuickAddRow
            amounts={WATER_QUICK_TILE_AMOUNTS_ML}
            onSelect={openSheet}
            onCustom={() => openSheet(0)}
          />
        </View>

        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Hydration History</Text>
            <Pressable hitSlop={6}>
              <Text style={s.sectionLink}>View All</Text>
            </Pressable>
          </View>
          <View style={s.chartCard}>
            <HydrationChart data={history} goal={goal} todayValue={intake} />
          </View>
        </View>

        <View style={s.statsRow}>
          {stats.map((stat) => (
            <WaterStatCard
              key={stat.id}
              icon={stat.icon}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              caption={stat.caption}
              captionTone={stat.captionTone}
            />
          ))}
        </View>
      </ScrollView>

      <WaterToast
        visible={toast.visible}
        amount={toast.amount}
        bottomOffset={96}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <AddWaterSheet
        visible={sheetVisible}
        initialSelected={sheetInitialSelected}
        initialCustom={WATER_CUSTOM_DEFAULT_ML}
        onClose={closeSheet}
        onConfirm={handleConfirm}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: w.bg },

  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: w.bg,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: c.textDark,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  iconGhost: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: c.textDark2,
  },

  scroll: { flex: 1 },
  content: { paddingBottom: 130 },

  heroWrap: { alignItems: "center", marginTop: 10, marginBottom: 16 },

  statusCard: {
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: w.tint,
    borderWidth: 1,
    borderColor: w.border,
    marginBottom: 22,
  },
  statusPrimary: {
    textAlign: "center",
    fontFamily: f.bodyBold,
    fontSize: 13,
    color: c.blue,
  },
  statusSecondary: {
    textAlign: "center",
    fontFamily: f.body,
    fontSize: 11,
    color: c.textMuted,
    marginTop: 2,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: f.displaySemi,
    fontSize: 15,
    color: c.textDark2,
    marginBottom: 12,
  },
  sectionLink: {
    fontFamily: f.bodyMed,
    fontSize: 12,
    color: c.blue,
  },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: w.border,
    shadowColor: c.textDark,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
});
