import { useFocusEffect, useRouter } from "expo-router";
import { Cookie, Moon, Plus, Salad, Sun } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/bottom-nav";
import {
  FoodLogSection,
  NutritionAvatar,
  NutritionTopBar,
} from "@/components/nutrition";
import { getFoodLogToday, getFoodImage } from "@/services/nutritionService";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const getSectionIcon = (id: string) => {
  switch (id.toLowerCase()) {
    case 'b': return Sun;
    case 'l': return Salad;
    case 's': return Cookie;
    case 'd': return Moon;
    default: return Sun;
  }
};

export default function FoodLogScreen() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await getFoodLogToday();
      setOverview(res);
    } catch (err) {
      console.log("[FOOD-LOG] Error fetching food log overview:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOverview();
    }, [fetchOverview])
  );

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={c.sageDark} />
        <Text style={{ marginTop: 16, fontFamily: f.displayMed, fontSize: 16, color: c.textMuted }}>
          Loading food logs...
        </Text>
      </SafeAreaView>
    );
  }

  const consumed = overview?.consumed ?? 0;
  const goal = overview?.goal ?? 2400;
  const remaining = overview?.remaining ?? 2400;
  const pct = overview?.pct ?? 0;
  const macroPies = overview?.macro_pies ?? [
    { label: "Carbs", value: "0g", pct: 0 },
    { label: "Protein", value: "0g", pct: 0 },
    { label: "Fats", value: "0g", pct: 0 },
  ];

  const sections = overview?.sections ? overview.sections.map((sec: any) => ({
    ...sec,
    Icon: getSectionIcon(sec.id),
    items: sec.items.map((item: any) => ({
      ...item,
      image: getFoodImage(item.title)
    }))
  })) : [
    { id: "b", title: "Breakfast", consumed: "0 kcal consumed", items: [], Icon: Sun },
    { id: "l", title: "Lunch", consumed: "0 kcal consumed", items: [], Icon: Salad },
    { id: "d", title: "Dinner", consumed: "0 kcal consumed", items: [], Icon: Moon },
    { id: "s", title: "Snacks", consumed: "0 kcal consumed", items: [], Icon: Cookie },
  ];

  const breakfastSec = sections.find((s: any) => s.id === 'b');
  const lunchSec = sections.find((s: any) => s.id === 'l');
  const dinnerSec = sections.find((s: any) => s.id === 'd');
  const snackSec = sections.find((s: any) => s.id === 's');

  const handleItemPress = (section: any, itemId: string) => {
    const item = section?.items?.find((it: any) => it.id === itemId);
    if (item) {
      const mealMap: { [key: string]: string } = {
        b: "breakfast",
        l: "lunch",
        d: "dinner",
        s: "snacks"
      };
      const mealType = mealMap[section.id] || "breakfast";
      router.push({
        pathname: "/nutrition/food-detail",
        params: { name: item.title, meal: mealType }
      });
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.headerSection}>
          <View style={s.headerLeft}>
            <Text style={s.kicker}>TODAY&apos;S JOURNEY</Text>
            <View style={s.amountRow}>
              <Text style={s.amountValue}>
                {consumed.toLocaleString()}
              </Text>
              <Text style={s.amountTotal}>
                / {goal.toLocaleString()} kcal
              </Text>
            </View>
          </View>
          <View style={s.leftBadge}>
            <Text style={s.leftBadgeText}>{remaining} left</Text>
          </View>
        </View>

        <View style={s.progressBg}>
          <View
            style={[s.progressFill, { width: `${Math.min(pct * 100, 100)}%` }]}
          />
        </View>

        {breakfastSec && (
          <FoodLogSection
            section={breakfastSec}
            onItemPress={(itemId) => handleItemPress(breakfastSec, itemId)}
            onItemMore={(itemId) => handleItemPress(breakfastSec, itemId)}
            onAdd={() => router.push({ pathname: "/nutrition/add-food", params: { meal: "breakfast" } })}
          />
        )}

        {lunchSec && (
          <FoodLogSection
            section={lunchSec}
            onItemPress={(itemId) => handleItemPress(lunchSec, itemId)}
            onItemMore={(itemId) => handleItemPress(lunchSec, itemId)}
            onAdd={() => router.push({ pathname: "/nutrition/add-food", params: { meal: "lunch" } })}
          />
        )}

        {dinnerSec && dinnerSec.items.length > 0 ? (
          <FoodLogSection
            section={dinnerSec}
            onItemPress={(itemId) => handleItemPress(dinnerSec, itemId)}
            onItemMore={(itemId) => handleItemPress(dinnerSec, itemId)}
            onAdd={() => router.push({ pathname: "/nutrition/add-food", params: { meal: "dinner" } })}
          />
        ) : (
          <View style={s.dinnerCard}>
            <View style={s.dinnerIconBox}>
              <Moon size={21} color={c.sageDark} strokeWidth={2} />
            </View>
            <Text style={s.dinnerTitle}>Dinner</Text>
            <Text style={s.dinnerSub}>Nothing logged for tonight yet</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={s.addDinnerBtn}
              onPress={() => router.push({ pathname: "/nutrition/add-food", params: { meal: "dinner" } })}
            >
              <Plus size={10} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={s.addDinnerText}>Add Dinner</Text>
            </TouchableOpacity>
          </View>
        )}

        {snackSec && (
          <FoodLogSection
            section={snackSec}
            onItemPress={(itemId) => handleItemPress(snackSec, itemId)}
            onItemMore={(itemId) => handleItemPress(snackSec, itemId)}
            onAdd={() => router.push({ pathname: "/nutrition/add-food", params: { meal: "snacks" } })}
          />
        )}

        <View style={s.macroBalance}>
          <Text style={s.macroBalanceTitle}>Macro Balance</Text>
          <View style={s.macroGrid}>
            {macroPies.map((m: any) => (
              <View key={m.label} style={s.macroItem}>
                <Text style={s.macroItemLabel}>{m.label}</Text>
                <Text style={s.macroItemValue}>{m.value}</Text>
                <View style={s.macroItemBarBg}>
                  <View
                    style={[s.macroItemBarFill, { width: `${Math.min(m.pct * 100, 100)}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Food Log"
        titleAlign="center"
        height={80}
        backgroundColor="rgba(253,248,243,0.9)"
        showBorderBottom
        titleStyle={{ fontSize: 20, lineHeight: 28, letterSpacing: -0.5 }}
        onBack={() => router.replace("/nutrition")}
        rightSlot={<NutritionAvatar variant="sageFaded" />}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bgAlt },
  scroll: { flex: 1 },
  content: { paddingTop: 104, paddingBottom: 130 },

  headerSection: {
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerLeft: { flexShrink: 1 },
  kicker: {
    fontFamily: f.displayBold,
    fontSize: 10,
    color: "rgba(75,101,70,0.6)",
    letterSpacing: 2,
    lineHeight: 15,
  },
  amountRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  amountValue: {
    fontFamily: f.displayBold,
    fontSize: 36,
    color: c.sageDark,
    lineHeight: 40,
  },
  amountTotal: {
    fontFamily: f.display,
    fontSize: 18,
    color: "rgba(75,101,70,0.4)",
    lineHeight: 28,
    marginBottom: 2,
  },
  leftBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: c.sageBg20,
    borderRadius: 999,
  },
  leftBadgeText: {
    fontFamily: f.displaySemi,
    fontSize: 12,
    color: c.sageDark,
    lineHeight: 16,
  },

  progressBg: {
    marginTop: 16,
    marginHorizontal: 24,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(168,197,160,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: c.sage,
    borderRadius: 999,
  },

  dinnerCard: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderColor: "rgba(168,197,160,0.3)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 32,
    padding: 42,
    alignItems: "center",
    gap: 16,
  },
  dinnerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(168,197,160,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  dinnerTitle: {
    fontFamily: f.displayBold,
    fontSize: 18,
    color: c.sageDark,
    lineHeight: 28,
    textAlign: "center",
  },
  dinnerSub: {
    marginTop: -12,
    fontFamily: f.display,
    fontSize: 14,
    color: "rgba(75,101,70,0.4)",
    lineHeight: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  addDinnerBtn: {
    marginTop: -8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: c.sage,
    borderRadius: 999,
    shadowColor: c.sage,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 3,
  },
  addDinnerText: {
    fontFamily: f.displayBold,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },

  macroBalance: {
    marginTop: 32,
    marginHorizontal: 24,
    padding: 40,
    backgroundColor: c.sageDark,
    borderRadius: 40,
    shadowColor: c.sageDark,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 25,
    elevation: 6,
  },
  macroBalanceTitle: {
    fontFamily: f.displayBold,
    fontSize: 10,
    color: "rgba(168,197,160,0.6)",
    letterSpacing: 2.5,
    lineHeight: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  macroGrid: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 32,
  },
  macroItem: { flex: 1, alignItems: "center", gap: 16 },
  macroItemLabel: {
    fontFamily: f.displaySemi,
    fontSize: 12,
    color: c.sage,
    lineHeight: 16,
  },
  macroItemValue: {
    marginTop: -12,
    fontFamily: f.displayBold,
    fontSize: 20,
    color: c.bgAlt,
    lineHeight: 28,
  },
  macroItemBarBg: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  macroItemBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: c.sage,
  },
});
