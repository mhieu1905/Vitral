import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MacroBar, NutritionTopBar } from "@/components/nutrition";
import { AVOCADO_TOAST } from "@/constants/nutrition";
import {
  getFoodDetails,
  getFoodHeroImage,
  logFood,
} from "@/services/nutritionService";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const W = Dimensions.get("window").width;
const VITAMIN_WIDTH = (W - 24 * 2 - 25 * 2 - 32) / 2;

export default function FoodDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string, meal?: string }>();
  const foodName = params.name || "Avocado & Sourdough";

  const [foodDetails, setFoodDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await getFoodDetails(foodName);
        if (active) {
          setFoodDetails(res);
        }
      } catch (err) {
        console.log("[DETAIL] Error fetching food details:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [foodName]);

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={c.sageDark} />
      </SafeAreaView>
    );
  }

  const food = foodDetails || AVOCADO_TOAST;
  const heroImage = getFoodHeroImage(food.title);

  // Stepper responsive scaling for premium micro-interactions
  const calorieValue = Math.round(food.totalKcal * qty);
  const displayMacros = food.macros.map((m: any) => {
    const numericPart = parseFloat(m.value) || 0;
    const unit = m.value.replace(/[\d\.]/g, "");
    return {
      ...m,
      value: `${Math.round(numericPart * qty)}${unit}`,
      pct: Math.min(m.pct * qty, 1.0)
    };
  });

  const displayFactGroups = food.factGroups.map((group: any) => ({
    rows: group.rows.map((row: any) => {
      // Don't scale Cholesterol / Sodium / Sugars if 0
      const numericPart = parseFloat(row.value) || 0;
      const unit = row.value.replace(/[\d\.]/g, "");
      return {
        ...row,
        value: `${Math.round(numericPart * qty)}${unit}`
      };
    })
  }));

  const handleAddLog = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const baseCarbs = parseFloat(food.macros.find((m: any) => m.label.toLowerCase().includes("carb"))?.value) || 0;
      const baseProtein = parseFloat(food.macros.find((m: any) => m.label.toLowerCase().includes("protein"))?.value) || 0;
      const baseFat = parseFloat(food.macros.find((m: any) => m.label.toLowerCase().includes("fat"))?.value) || 0;

      const rawMeal = params.meal;
      let mealType = (rawMeal && rawMeal !== "undefined" && rawMeal !== "null") ? rawMeal : "";
      if (!mealType) {
        mealType = "breakfast";
        const hour = new Date().getHours();
        if (hour >= 11 && hour < 16) mealType = "lunch";
        else if (hour >= 16 && hour < 19) mealType = "snacks";
        else if (hour >= 19 || hour < 5) mealType = "dinner";
      }

      console.log("[DETAIL SCREEN] logging food:", food.title, "mealType:", mealType);

      await logFood({
        food_name: food.title,
        meal_type: mealType,
        calories: food.totalKcal * qty,
        protein_g: baseProtein * qty,
        carbs_g: baseCarbs * qty,
        fat_g: baseFat * qty,
        serving_size: food.servingValue,
        serving_qty: qty
      });

      router.replace({
        pathname: "/nutrition/food-log-confirm",
        params: { preset: "detail", meal: mealType },
      });
    } catch (err) {
      console.log("[DETAIL] Error logging food to database:", err);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <Image source={heroImage} style={s.heroImg} contentFit="cover" />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
            style={s.heroGradient}
          />
          <View style={s.heroTextWrap}>
            <Text style={s.heroTitle}>{food.title}</Text>
            <Text style={s.heroSubtitle}>{food.subtitle}</Text>
          </View>
        </View>

        <View style={s.calorieCard}>
          <Text style={s.totalEnergyLabel}>TOTAL ENERGY</Text>
          <View style={s.calorieRow}>
            <Text style={s.calorieValue}>{calorieValue}</Text>
            <Text style={s.calorieUnit}>kcal</Text>
          </View>
        </View>

        <View style={s.macroCard}>
          <View style={s.macroHeader}>
            <Text style={s.macroHeaderTitle}>Daily Macros</Text>
            <Text style={s.macroHeaderSub}>Per Serving</Text>
          </View>

          {displayMacros.map((m: any, i: number) => (
            <MacroBar
              key={m.label}
              label={m.label}
              value={m.value}
              pct={m.pct}
              color={m.barColor}
              labelColor={m.labelColor}
              trackColor="rgba(255,255,255,0.5)"
              height={8}
              labelStyle={{ fontSize: 12, lineHeight: 16 }}
              valueStyle={{ fontSize: 12, color: c.textDark, lineHeight: 16 }}
              containerStyle={{ marginTop: i === 0 ? 0 : 16 }}
            />
          ))}
        </View>

        <View style={s.servingCard}>
          <View>
            <Text style={s.servingLabel}>{food.servingLabel}</Text>
            <Text style={s.servingValue}>{food.servingValue}</Text>
          </View>
          <View style={s.stepper}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={s.stepperBtnMinus}
              onPress={() => {
                Haptics.selectionAsync();
                setQty(q => Math.max(q - 1, 1));
              }}
            >
              <Minus size={11} color={c.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={s.stepperCount}>{qty}</Text>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={s.stepperBtnPlus}
              onPress={() => {
                Haptics.selectionAsync();
                setQty(q => q + 1);
              }}
            >
              <Plus size={11} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.factsTitleRow}>
          <View style={s.factsBar} />
          <Text style={s.factsTitle}>Nutrition Facts</Text>
        </View>

        <View style={s.factsCard}>
          {displayFactGroups.map((group: any, gi: number) => {
            const isLast = gi === food.factGroups.length - 1;
            return (
              <View
                key={`g${gi}`}
                style={[
                  s.factGroup,
                  isLast && {
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                  },
                ]}
              >
                {group.rows.map((row: any, ri: number) => (
                  <View
                    key={`g${gi}r${ri}`}
                    style={row.sub ? s.factSubRow : s.factMainRow}
                  >
                    <Text style={row.sub ? s.factSubLabel : s.factMainLabel}>
                      {row.label}
                    </Text>
                    <Text style={row.sub ? s.factSubValue : s.factMainValue}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}

          <View style={s.vitaminsGrid}>
            {food.vitamins.map((v: any) => (
              <View key={v.label} style={s.vitaminItem}>
                <Text style={s.vitaminLabel}>{v.label}</Text>
                <Text style={s.vitaminValue}>{v.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Nutrition Details"
        titleAlign="center"
        height={64}
        backgroundColor="rgba(253,248,243,0.8)"
        onBack={() => {
          const m = params.meal && params.meal !== "undefined" && params.meal !== "null" ? params.meal : "";
          router.replace({
            pathname: "/nutrition/add-food",
            params: m ? { meal: m } : undefined
          });
        }}
        rightSlot={
          <Pressable hitSlop={10}>
            <Heart size={19} color={c.sageDark} strokeWidth={2} />
          </Pressable>
        }
      />

      <LinearGradient
        colors={["rgba(255,248,245,0)", c.bg, c.bg]}
        locations={[0, 0.5, 1]}
        style={s.bottomBar}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={s.addBtn}
          onPress={handleAddLog}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={s.addBtnLabel}>Add to Log</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 130 },

  hero: {
    marginTop: 64,
    marginHorizontal: 24,
    marginBottom: 16,
    height: 365,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: c.cardCream,
  },
  heroImg: { width: "100%", height: "100%" },
  heroGradient: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  heroTextWrap: { position: "absolute", left: 24, bottom: 24, right: 24 },
  heroTitle: {
    fontFamily: f.displayBold,
    fontSize: 24,
    color: "#FFFFFF",
    lineHeight: 32,
  },
  heroSubtitle: {
    fontFamily: f.display,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 8,
    lineHeight: 20,
  },

  calorieCard: {
    marginHorizontal: 24,
    backgroundColor: c.card,
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(195,200,190,0.1)",
    shadowColor: "#3D3530",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 2,
  },
  totalEnergyLabel: {
    fontFamily: f.displayMed,
    fontSize: 12,
    color: c.textMuted2,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  calorieRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  calorieValue: {
    fontFamily: f.displayBold,
    fontSize: 48,
    color: c.sageDark,
    lineHeight: 48,
  },
  calorieUnit: {
    fontFamily: f.displayMed,
    fontSize: 18,
    color: c.sage,
    lineHeight: 28,
    marginBottom: 4,
  },

  macroCard: {
    marginTop: 16,
    marginHorizontal: 24,
    backgroundColor: c.cardCream,
    borderRadius: 24,
    padding: 24,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  macroHeaderTitle: {
    fontFamily: f.displaySemi,
    fontSize: 14,
    color: c.textDark,
    lineHeight: 20,
  },
  macroHeaderSub: {
    fontFamily: f.display,
    fontSize: 11,
    color: c.textMuted2,
    lineHeight: 16.5,
  },

  servingCard: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: c.cardPeach,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  servingLabel: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textMuted2,
    letterSpacing: 0.55,
    lineHeight: 16.5,
  },
  servingValue: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: c.textDark,
    lineHeight: 24,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.card,
    borderRadius: 999,
    padding: 7,
    borderWidth: 1,
    borderColor: "rgba(195,200,190,0.2)",
    gap: 16,
  },
  stepperBtnMinus: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: c.cardCream,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnPlus: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: c.sageDark,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperCount: {
    fontFamily: f.displayBold,
    fontSize: 14,
    color: c.textDark,
    lineHeight: 20,
    minWidth: 8,
    textAlign: "center",
  },

  factsTitleRow: {
    marginTop: 24,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  factsBar: {
    width: 32,
    height: 4,
    borderRadius: 999,
    backgroundColor: c.sageDark,
  },
  factsTitle: {
    fontFamily: f.displayBold,
    fontSize: 18,
    color: c.textDark,
    lineHeight: 28,
  },

  factsCard: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: c.card,
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(195,200,190,0.1)",
    shadowColor: "#3D3530",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 1,
  },
  factGroup: {
    paddingBottom: 17,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.borderSoft,
  },
  factMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  factMainLabel: {
    fontFamily: f.displaySemi,
    fontSize: 14,
    color: c.textDark,
    lineHeight: 20,
  },
  factMainValue: {
    fontFamily: f.displayBold,
    fontSize: 14,
    color: c.textDark,
    lineHeight: 20,
  },
  factSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingLeft: 16,
  },
  factSubLabel: {
    fontFamily: f.display,
    fontSize: 12,
    color: c.textMuted2,
    lineHeight: 16,
  },
  factSubValue: {
    fontFamily: f.display,
    fontSize: 12,
    color: c.textMuted2,
    lineHeight: 16,
  },

  vitaminsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 8,
    gap: 16,
  },
  vitaminItem: {
    width: VITAMIN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vitaminLabel: {
    fontFamily: f.display,
    fontSize: 12,
    color: c.textMuted2,
    lineHeight: 16,
  },
  vitaminValue: {
    fontFamily: f.displayMed,
    fontSize: 12,
    color: c.sageDark,
    lineHeight: 16,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 104,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  addBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: c.sageDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: c.sageDark,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 6,
  },
  addBtnLabel: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
  },
});
