import { useRouter } from "expo-router";
import { Moon, Plus } from "lucide-react-native";
import {
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
import {
  FOOD_LOG_MACRO_PIES,
  FOOD_LOG_SECTIONS,
  FOOD_LOG_SNACK_SECTION,
  FOOD_LOG_TOTAL,
} from "@/constants/nutrition";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

export default function FoodLogScreen() {
  const router = useRouter();

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
                {FOOD_LOG_TOTAL.consumed.toLocaleString()}
              </Text>
              <Text style={s.amountTotal}>
                / {FOOD_LOG_TOTAL.goal.toLocaleString()} kcal
              </Text>
            </View>
          </View>
          <View style={s.leftBadge}>
            <Text style={s.leftBadgeText}>{FOOD_LOG_TOTAL.remaining} left</Text>
          </View>
        </View>

        <View style={s.progressBg}>
          <View
            style={[s.progressFill, { width: `${FOOD_LOG_TOTAL.pct * 100}%` }]}
          />
        </View>

        {FOOD_LOG_SECTIONS.map((sec) => (
          <FoodLogSection
            key={sec.id}
            section={sec}
            onItemMore={() => router.push("/nutrition/food-detail")}
            onAdd={() => router.push("/nutrition/add-food")}
          />
        ))}

        <View style={s.dinnerCard}>
          <View style={s.dinnerIconBox}>
            <Moon size={21} color={c.sageDark} strokeWidth={2} />
          </View>
          <Text style={s.dinnerTitle}>Dinner</Text>
          <Text style={s.dinnerSub}>Nothing logged for tonight yet</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={s.addDinnerBtn}
            onPress={() => router.push("/nutrition/add-food")}
          >
            <Plus size={10} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={s.addDinnerText}>Add Dinner</Text>
          </TouchableOpacity>
        </View>

        <FoodLogSection
          section={FOOD_LOG_SNACK_SECTION}
          onItemMore={() => router.push("/nutrition/food-detail")}
          onAdd={() => router.push("/nutrition/add-food")}
        />

        <View style={s.macroBalance}>
          <Text style={s.macroBalanceTitle}>Macro Balance</Text>
          <View style={s.macroGrid}>
            {FOOD_LOG_MACRO_PIES.map((m) => (
              <View key={m.label} style={s.macroItem}>
                <Text style={s.macroItemLabel}>{m.label}</Text>
                <Text style={s.macroItemValue}>{m.value}</Text>
                <View style={s.macroItemBarBg}>
                  <View
                    style={[s.macroItemBarFill, { width: `${m.pct * 100}%` }]}
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
