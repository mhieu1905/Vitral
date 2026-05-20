import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronRight,
  Leaf,
  Plus,
  ScanBarcode,
  Search,
  Utensils,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import BottomNav from "@/components/bottom-nav";
import {
  NutrientCard,
  NutritionAvatar,
  NutritionTopBar,
} from "@/components/nutrition";
import {
  ADD_FOOD_CALORIE_BALANCE,
  ADD_FOOD_FILTERS,
  NUTRIENT_FOCUS,
  RECENT_FOODS,
} from "@/constants/nutrition";
import { getFoodPresets, getFoodImage } from "@/services/nutritionService";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const W = Dimensions.get("window").width;
const BalanceIcon = ADD_FOOD_CALORIE_BALANCE.Icon;

export default function AddFood() {
  const router = useRouter();
  const { meal: rawMeal } = useLocalSearchParams<{ meal?: string }>();
  const meal = (rawMeal && rawMeal !== "undefined" && rawMeal !== "null") ? rawMeal : undefined;
  console.log("[ADD-FOOD SCREEN] meal parameter received:", meal);
  const [active, setActive] = useState<string>("Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [presets, setPresets] = useState<any[]>([]);

  // Load presets dynamically from Backend
  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await getFoodPresets();
        const arr = Object.keys(res).map((key) => {
          const item = res[key];
          return {
            title: item.title,
            meta: `${item.totalKcal} kcal • ${item.servingValue}`,
            category: item.subtitle.toLowerCase().includes("breakfast") || item.title.toLowerCase().includes("toast") || item.title.toLowerCase().includes("yogurt") 
              ? "Breakfast" 
              : item.title.toLowerCase().includes("latte") || item.title.toLowerCase().includes("coffee")
              ? "Drinks"
              : "Snacks",
            Icon: Utensils,
            iconBg: c.sageBg10,
            iconColor: c.sageDark
          };
        });
        setPresets(arr);
      } catch (err) {
        console.log("[ADD_FOOD] Error loading presets:", err);
      }
    }
    loadPresets();
  }, []);

  // Filter based on search query and category tab
  const getDisplayedFoods = () => {
    // If searching, always search across ALL foods
    if (searchQuery.trim().length > 0) {
      let list = [...RECENT_FOODS];
      presets.forEach(p => {
        if (!list.some(item => item.title.toLowerCase() === p.title.toLowerCase())) {
          list.push(p);
        }
      });

      const query = searchQuery.toLowerCase();
      list = list.filter(item => item.title.toLowerCase().includes(query));
      
      // Add custom food option at the top!
      const customItem = {
        title: searchQuery.trim(),
        meta: "✨ Custom Food Entry • Tap to adjust & log",
        Icon: Leaf,
        iconBg: c.sageBg20,
        iconColor: c.sageDark,
        isCustom: true
      };
      
      // Check if exact match exists, if not add custom item
      const exactMatch = list.some(item => item.title.toLowerCase() === query);
      if (!exactMatch) {
        list.unshift(customItem);
      }
      return list;
    }

    // Default view with no search query active
    if (active === "Recent") {
      // Recent tab shows ONLY the 3 representative typical foods
      return RECENT_FOODS;
    } else {
      // All tab shows all items (RECENT_FOODS + presets merged)
      let list = [...RECENT_FOODS];
      presets.forEach(p => {
        if (!list.some(item => item.title.toLowerCase() === p.title.toLowerCase())) {
          list.push(p);
        }
      });
      return list;
    }
  };

  const displayedFoods = getDisplayedFoods();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.searchInputWrap}>
          <Search size={18} color={c.textMuted} strokeWidth={2} />
          <TextInput
            placeholder="Search food or enter custom food name..."
            placeholderTextColor="rgba(115,121,112,0.6)"
            style={s.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity 
              hitSlop={10} 
              onPress={() => setSearchQuery("")}
              style={{ marginRight: 8 }}
            >
              <Text style={{ fontFamily: f.displayMed, fontSize: 13, color: c.textMuted }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
          <Pressable
            hitSlop={10}
            onPress={() => router.push({
              pathname: "/nutrition/scan-food",
              params: meal ? { meal } : undefined
            })}
            style={({ pressed }) => [s.scanBtn, pressed && { opacity: 0.5 }]}
          >
            <ScanBarcode size={22} color={c.sageDark} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsRow}
          style={s.chipsScroll}
        >
          {["Recent", "All"].map((label) => {
            const isActive = label === active;
            return (
              <TouchableOpacity
                key={label}
                activeOpacity={0.85}
                onPress={() => {
                  setActive(label);
                  // Clear search query when switching tabs to avoid confusion
                  setSearchQuery("");
                }}
                style={[s.chip, isActive ? s.chipActive : s.chipInactive]}
              >
                <Text
                  style={[
                    s.chipText,
                    isActive ? s.chipTextActive : s.chipTextInactive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.recentFoodsSection}>
          <Text style={s.sectionTitle}>
            {searchQuery.trim().length > 0 ? "Search Results" : "Recent & Recommended Foods"}
          </Text>

          <View style={s.foodList}>
            {displayedFoods.map((item) => {
              const Icon = item.Icon || Utensils;
              return (
                <TouchableOpacity
                  key={item.title}
                  activeOpacity={0.9}
                  style={{
                    ...s.foodCard,
                    backgroundColor: item.isCustom ? "#F4F7F3" : c.card,
                    borderColor: item.isCustom ? "rgba(75, 101, 70, 0.25)" : "transparent",
                    borderWidth: item.isCustom ? 1.5 : 0,
                    // Disable shadow and elevation for custom cards to prevent React Native transparency glitches
                    shadowOpacity: item.isCustom ? 0 : 0.03,
                    elevation: item.isCustom ? 0 : 1,
                    paddingVertical: item.isCustom ? 16 : 16,
                  }}
                  onPress={() => router.push({
                    pathname: "/nutrition/food-detail",
                    params: { name: item.title, meal: meal }
                  })}
                >
                  <View
                    style={[
                      s.foodIconBox, 
                      { 
                        backgroundColor: item.isCustom ? "rgba(168, 197, 160, 0.2)" : (item.iconBg || c.sageBg10), 
                        overflow: "hidden" 
                      }
                    ]}
                  >
                    <Image
                      source={getFoodImage(item.title)}
                      style={{ width: "100%", height: "100%", borderRadius: 16 }}
                      contentFit="cover"
                    />
                  </View>
                  <View style={s.foodTextWrap}>
                    <Text style={[s.foodTitle, item.isCustom && { fontFamily: f.displayBold, color: c.sageDark }]}>
                      {item.title}
                    </Text>
                    <Text style={s.foodMeta}>{item.meta}</Text>
                  </View>
                  <View style={s.foodAddBtn}>
                    <Plus size={14} color={c.sage} strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>
              );
            })}
            
            {displayedFoods.length === 0 ? (
              <View style={{ padding: 24, alignItems: "center" }}>
                <Text style={{ fontFamily: f.display, fontSize: 14, color: c.textMuted }}>
                  No foods found matching "{searchQuery}"
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={s.nutrientSection}>
          <View style={s.nutrientHeader}>
            <Text style={s.sectionTitle}>Nutrient Focus</Text>
            <Text style={s.viewStatsBtn}>View Stats</Text>
          </View>

          <View style={s.nutrientGrid}>
            {NUTRIENT_FOCUS.map((n) => (
              <NutrientCard key={n.label} data={n} />
            ))}
          </View>

          <View style={s.calorieBalanceCard}>
            <View style={s.balanceLeft}>
              <View style={s.balanceIconBox}>
                <BalanceIcon size={20} color={c.pink} strokeWidth={2} />
              </View>
              <View>
                <Text style={s.balanceTitle}>
                  {ADD_FOOD_CALORIE_BALANCE.title}
                </Text>
                <Text style={s.balanceSub}>{ADD_FOOD_CALORIE_BALANCE.sub}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={c.textMuted} strokeWidth={2} />
          </View>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="LogFood"
        leftIcon={Leaf}
        onLeftIconPress={() => router.replace("/nutrition/food-log")}
        height={56}
        backgroundColor="rgba(253,248,243,0.8)"
        showShadow
        titleStyle={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.6 }}
        rightSlot={<NutritionAvatar variant="sage" />}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingTop: 96, paddingBottom: 130 },

  searchInputWrap: {
    marginHorizontal: 24,
    height: 55,
    paddingHorizontal: 19,
    backgroundColor: c.cardCream,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: f.display,
    fontSize: 16,
    color: c.textDark,
    padding: 0,
  },
  scanBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: c.sageBg10,
    alignItems: "center",
    justifyContent: "center",
  },

  chipsScroll: { marginTop: 24, maxHeight: 60 },
  chipsRow: {
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999 },
  chipActive: { backgroundColor: c.sageDark },
  chipInactive: { backgroundColor: c.border },
  chipText: { fontFamily: f.displayMed, fontSize: 14, lineHeight: 20 },
  chipTextActive: { color: "#FFFFFF" },
  chipTextInactive: { color: c.textDim },

  recentFoodsSection: { marginTop: 24, marginHorizontal: 24 },
  sectionTitle: {
    fontFamily: f.displaySemi,
    fontSize: 20,
    color: c.textDark,
    lineHeight: 28,
    letterSpacing: -0.5,
  },

  foodList: { marginTop: 24, gap: 16 },
  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: c.card,
    padding: 16,
    borderRadius: 24,
    shadowColor: "#3D3530",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
  },
  foodIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  foodTextWrap: { flex: 1 },
  foodTitle: {
    fontFamily: f.displayMed,
    fontSize: 16,
    color: c.textDark,
    lineHeight: 24,
  },
  foodMeta: {
    fontFamily: f.display,
    fontSize: 14,
    color: c.textMuted,
    lineHeight: 20,
  },
  foodAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  nutrientSection: { marginTop: 40, marginHorizontal: 24 },
  nutrientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewStatsBtn: {
    fontFamily: f.displaySemi,
    fontSize: 14,
    color: c.sageDark,
    lineHeight: 20,
  },
  nutrientGrid: {
    marginTop: 24,
    flexDirection: "row",
    gap: 16,
  },

  calorieBalanceCard: {
    marginTop: 16,
    padding: 25,
    backgroundColor: "rgba(253,203,203,0.1)",
    borderColor: "rgba(253,203,203,0.2)",
    borderWidth: 1,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  balanceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(253,203,203,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceTitle: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: c.textDark,
    lineHeight: 24,
  },
  balanceSub: {
    fontFamily: f.display,
    fontSize: 14,
    color: c.textMuted,
    lineHeight: 20,
    maxWidth: W - 24 * 2 - 25 * 2 - 48 - 16 - 16,
  },
});
