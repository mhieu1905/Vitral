import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  Info,
  Plus,
  RotateCw,
  Sparkles,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutritionAvatar } from "@/components/nutrition";
import { SCAN_RESULT, ScanResultData } from "@/constants/nutrition";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";
import { logFood } from "@/services/nutritionService";

const { width: W, height: H } = Dimensions.get("window");
const CARD_W = W - 48 - 50;
const FRAME_W = W - 48;

export default function ScanSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawMeal = params.meal as string;
  const meal = (rawMeal && rawMeal !== "undefined" && rawMeal !== "null") ? rawMeal : undefined;

  let scanData: ScanResultData = SCAN_RESULT;
  if (params.scannedData) {
    try {
      const parsed = JSON.parse(params.scannedData as string);
      scanData = {
        ...SCAN_RESULT,
        ...parsed,
        image: params.imageUri ? { uri: params.imageUri as string } : SCAN_RESULT.image,
        cameraBg: params.imageUri ? { uri: params.imageUri as string } : SCAN_RESULT.cameraBg,
      };
    } catch (e) {
      console.error("Failed to parse scanned data", e);
    }
  }

  const getNutritionValue = (unitName: string): number => {
    const item = scanData.nutrition.find(n => n.unit === unitName);
    if (!item) return 0;
    return parseInt(item.value.replace(/[^0-9.]/g, ""), 10) || 0;
  };

  const getMealTypeFromTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 19) return "snacks";
    return "dinner";
  };

  const handleAddToLog = async () => {
    try {
      setIsSubmitting(true);
      const calories = getNutritionValue("KCAL");
      const protein = getNutritionValue("PROT");
      const fat = getNutritionValue("FAT");
      const carbs = getNutritionValue("CARBS");
      const mealType = meal || getMealTypeFromTime();

      await logFood({
        food_name: scanData.title.replace(/\n/g, " "),
        meal_type: mealType,
        calories: calories,
        protein_g: protein,
        fat_g: fat,
        carbs_g: carbs,
        serving_size: "estimation",
        serving_qty: 1
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      router.replace({
        pathname: "/nutrition/food-log-confirm",
        params: {
          preset: "scan",
          foodName: scanData.title.replace(/\n/g, " "),
          calories: calories.toString(),
          protein: protein.toString(),
          fat: fat.toString(),
          carbs: carbs.toString(),
          meal: mealType
        }
      });
    } catch (error) {
      console.error("Failed to log scanned food:", error);
      Alert.alert("Error", "Failed to add food to your log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const corners = useSharedValue(0);
  const cardScale = useSharedValue(0.88);
  const sparkleA = useSharedValue(0);
  const sparkleB = useSharedValue(0);

  useEffect(() => {
    corners.value = withTiming(1, {
      duration: 360,
      easing: Easing.out(Easing.cubic),
    });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 160 });
    sparkleA.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    sparkleB.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [corners, cardScale, sparkleA, sparkleB]);

  const cornerStyle = useAnimatedStyle(() => ({
    opacity: corners.value,
    transform: [{ scale: interpolate(corners.value, [0, 1], [0.85, 1]) }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const sparkleAStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleA.value, [0, 1], [0.2, 0.9]),
    transform: [{ scale: interpolate(sparkleA.value, [0, 1], [0.6, 1]) }],
  }));
  const sparkleBStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleB.value, [0, 1], [0.15, 0.7]),
    transform: [{ scale: interpolate(sparkleB.value, [0, 1], [0.8, 1.1]) }],
  }));

  return (
    <View style={s.root}>
      <Image
        source={scanData.cameraBg}
        style={s.bg}
        contentFit="cover"
        blurRadius={4}
      />
      <View style={s.bgDim} />

      <Animated.View
        style={[s.sparkle, { top: H * 0.22, left: W * 0.18 }, sparkleAStyle]}
      />
      <Animated.View
        style={[
          s.sparkle,
          { width: 8, height: 8, top: H * 0.3, right: W * 0.18 },
          sparkleBStyle,
        ]}
      />
      <Animated.View
        style={[
          s.sparkle,
          { width: 6, height: 6, bottom: H * 0.26, left: W * 0.42 },
          sparkleAStyle,
        ]}
      />
      <Animated.View
        style={[
          s.sparkle,
          { width: 5, height: 5, top: H * 0.5, right: W * 0.32 },
          sparkleBStyle,
        ]}
      />

      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <Pressable
            hitSlop={10}
            onPress={() => router.replace("/nutrition/add-food")}
            style={s.headerBtn}
          >
            <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
          <Text style={s.headerTitle}>Scanner</Text>
          <NutritionAvatar variant="sage" />
        </View>

        <View style={s.body}>
          <Animated.View
            style={[s.frameWrap, cornerStyle]}
            pointerEvents="box-none"
          >
            <View style={s.cornerTL} />
            <View style={s.cornerTR} />
            <View style={s.cornerBL} />
            <View style={s.cornerBR} />

            <Animated.View style={[s.card, cardStyle]}>
              <View style={s.cardTopRow}>
                <View
                  style={[
                    s.cardImgBox,
                    { backgroundColor: scanData.imageBg },
                  ]}
                >
                  <Image
                    source={scanData.image}
                    style={s.cardImg}
                    contentFit="cover"
                  />
                </View>
                <View style={s.cardTextWrap}>
                  <View style={s.titleRow}>
                    <Text style={s.cardTitle}>{scanData.title}</Text>
                    <CheckCircle2
                      size={20}
                      color={c.sageDark}
                      strokeWidth={2}
                      fill="rgba(168,197,160,0.25)"
                    />
                  </View>
                  <Text style={s.cardBrand}>{scanData.brand}</Text>
                </View>
              </View>

              <View style={s.cardTags}>
                {scanData.tags.map((t) => (
                  <View
                    key={t.label}
                    style={[s.tag, { backgroundColor: t.bg }]}
                  >
                    <Text style={[s.tagText, { color: t.color }]}>
                      {t.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={s.nutritionGrid}>
                {scanData.nutrition.map((n, i) => (
                  <Animated.View
                    key={n.unit}
                    entering={FadeInUp.duration(280).delay(380 + i * 60)}
                    style={[s.gridCell, i > 0 && s.gridCellBorder]}
                  >
                    <Text style={s.gridValue}>{n.value}</Text>
                    <Text style={s.gridUnit}>{n.unit}</Text>
                  </Animated.View>
                ))}
              </View>

              <Animated.View
                entering={FadeIn.duration(420).delay(620)}
                style={s.successRow}
              >
                <Sparkles
                  size={13}
                  color={c.sageDark}
                  strokeWidth={2}
                  fill={c.sageDark}
                />
                <Text style={s.successText}>Scanned successfully</Text>
              </Animated.View>
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(360).delay(520)}>
            <Pressable
              hitSlop={12}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({
                  pathname: "/nutrition/food-detail",
                  params: { name: scanData.title.replace(/\n/g, " "), meal: meal || "" }
                });
              }}
              style={({ pressed }) => [
                s.feedbackRow,
                pressed && { opacity: 0.75 },
              ]}
            >
              <Info size={13} color="rgba(255,255,255,0.9)" strokeWidth={2} />
              <Text style={s.feedbackText}>
                Tap to see full nutrition profile
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(420).delay(280).springify().damping(16)}
          style={s.actions}
        >
          <Pressable
            style={({ pressed }) => [s.primaryBtn, (pressed || isSubmitting) && { opacity: 0.9 }]}
            disabled={isSubmitting}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleAddToLog();
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={s.primaryBtnText}>Add to Food Log</Text>
              </>
            )}
          </Pressable>

          <View style={s.secondaryRow}>
            <Pressable
              style={({ pressed }) => [s.glassBtn, pressed && { opacity: 0.7 }]}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({
                  pathname: "/nutrition/food-detail",
                  params: { name: scanData.title.replace(/\n/g, " "), meal: meal || "" }
                });
              }}
            >
              <FileText size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={s.glassText}>View Details</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [s.glassBtn, pressed && { opacity: 0.7 }]}
              onPress={() => {
                Haptics.selectionAsync();
                router.replace("/nutrition/scan-food");
              }}
            >
              <RotateCw size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={s.glassText}>Scan Again</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>

      <Animated.View
        entering={ZoomIn.duration(360).delay(120)}
        style={s.sideControls}
      >
        <Pressable
          hitSlop={6}
          style={s.sideBtn}
          onPress={() => Haptics.selectionAsync()}
        >
          <Zap size={20} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
        <Pressable
          hitSlop={6}
          style={s.sideBtn}
          onPress={() => Haptics.selectionAsync()}
        >
          <ImageIcon size={20} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
      </Animated.View>

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.35)"]}
        pointerEvents="none"
        style={s.bottomVignette}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  bg: { ...StyleSheet.absoluteFillObject },
  bgDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomVignette: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
  },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: f.displaySemi,
    fontSize: 22,
    color: "#FFFFFF",
    letterSpacing: -0.55,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  frameWrap: {
    width: FRAME_W,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: c.sage,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  cornerTL: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: c.sage,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: c.sage,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: c.sage,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: c.sage,
    borderBottomRightRadius: 12,
  },

  card: {
    width: CARD_W,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    gap: 18,
    shadowColor: "#3D3530",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 40,
    elevation: 10,
  },
  cardTopRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  cardImgBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImg: { width: "100%", height: "100%" },
  cardTextWrap: { flex: 1, gap: 4 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontFamily: f.displayBold,
    fontSize: 17,
    color: c.textDark,
    lineHeight: 22,
  },
  cardBrand: {
    fontFamily: f.body,
    fontSize: 13,
    color: c.textDim,
    lineHeight: 19,
  },
  cardTags: { 
    flexDirection: "row", 
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6, 
    paddingTop: 6,
    paddingBottom: 6 
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontFamily: f.displayBold,
    fontSize: 9,
    letterSpacing: 0.3,
    lineHeight: 13,
    textAlign: "center",
  },

  nutritionGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(255,248,245,0.55)",
    borderRadius: 12,
  },
  gridCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 4,
  },
  gridCellBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.7)",
  },
  gridValue: {
    fontFamily: f.displayBold,
    fontSize: 16,
    color: c.sageDark,
    lineHeight: 22,
  },
  gridUnit: {
    fontFamily: f.displaySemi,
    fontSize: 10,
    color: c.textDim,
    letterSpacing: 0.5,
  },

  successRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  successText: {
    fontFamily: f.bodyMed,
    fontSize: 13,
    color: c.sageDark,
    lineHeight: 19,
  },

  feedbackRow: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackText: {
    fontFamily: f.bodyMed,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.35,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  actions: { gap: 12, paddingBottom: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: c.sageDark,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    elevation: 8,
  },
  primaryBtnText: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  secondaryRow: { flexDirection: "row", gap: 12 },
  glassBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  glassText: {
    fontFamily: f.displayMed,
    fontSize: 15,
    color: "#FFFFFF",
  },

  sideControls: {
    position: "absolute",
    right: 24,
    bottom: 200,
    gap: 14,
  },
  sideBtn: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  sparkle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
});
