import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Flashlight,
  Image as ImageIcon,
  Leaf,
  Pencil,
} from "lucide-react-native";
import type { ComponentType } from "react";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Path,
  Rect,
  Stop,
  RadialGradient as SvgRadialGradient,
} from "react-native-svg";

import { NutritionAvatar } from "@/components/nutrition";
import {
  FOOD_LOG_CONFIRM_SCAN,
  type FoodLogConfirmData,
  getFoodLogConfirmFromDetail,
} from "@/constants/nutrition";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const RING = 224;
const INNER_PAD = 17;
const CHECK_VIEW = 96;
const CHECK_PATH = "M 22 50 L 42 70 L 78 30";
const CHECK_PATH_LEN = 80;

const AnimatedPath = Animated.createAnimatedComponent(Path);

function resolveConfirm(preset: string | undefined): FoodLogConfirmData {
  return preset === "detail"
    ? getFoodLogConfirmFromDetail()
    : FOOD_LOG_CONFIRM_SCAN;
}

export default function FoodLogConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ preset?: string | string[] }>();
  const presetRaw = params.preset;
  const preset = Array.isArray(presetRaw) ? presetRaw[0] : presetRaw;
  const data = resolveConfirm(preset);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      280,
      withTiming(1, { duration: 720, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress]);

  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_PATH_LEN * (1 - progress.value),
  }));

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <SvgRadialGradient id="sageAura" cx="50%" cy="40%" rx="55%" ry="45%">
            <Stop offset="0" stopColor="#A8C5A0" stopOpacity={0.35} />
            <Stop offset="0.55" stopColor="#A8C5A0" stopOpacity={0.08} />
            <Stop offset="1" stopColor="#A8C5A0" stopOpacity={0} />
          </SvgRadialGradient>
          <SvgRadialGradient id="blueAura" cx="95%" cy="78%" rx="55%" ry="40%">
            <Stop offset="0" stopColor="#B5C8E8" stopOpacity={0.22} />
            <Stop offset="1" stopColor="#B5C8E8" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#sageAura)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#blueAura)" />
      </Svg>

      <View style={s.header}>
        <Pressable
          hitSlop={10}
          onPress={() => router.replace("/nutrition/food-log")}
          style={({ pressed }) => [
            s.headerIconBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <ChevronLeft size={24} color={c.textDark} strokeWidth={2} />
        </Pressable>
        <Text style={s.headerTitle}>CONFIRMATION</Text>
        <NutritionAvatar variant="sage" />
      </View>

      <View style={s.main}>
        <Animated.View entering={FadeIn.duration(360)} style={s.heroWrap}>
          <View style={s.leafTR}>
            <Leaf
              size={28}
              color={c.sage}
              strokeWidth={1.8}
              style={{ opacity: 0.45 }}
            />
          </View>
          <View style={s.leafBL}>
            <Leaf
              size={22}
              color={c.sageDark}
              strokeWidth={1.8}
              style={{ opacity: 0.35, transform: [{ scaleX: -1 }] }}
            />
          </View>

          <View style={s.ringGlass}>
            <View style={s.ringInner}>
              <Svg
                width={CHECK_VIEW}
                height={CHECK_VIEW}
                viewBox={`0 0 ${CHECK_VIEW} ${CHECK_VIEW}`}
              >
                <AnimatedPath
                  d={CHECK_PATH}
                  stroke="#FFFFFF"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray={CHECK_PATH_LEN}
                  animatedProps={checkProps}
                />
              </Svg>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(440).delay(160)}
          style={s.msgBlock}
        >
          <Text
            style={s.headline}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Logged to your <Text style={s.headlineAccent}>food log</Text>
          </Text>
          <Text style={s.foodName}>{data.foodName}</Text>
          <View style={s.macroRow}>
            {data.macros.map((m, i) => (
              <View key={m} style={s.macroItem}>
                {i > 0 ? <View style={s.macroDot} /> : null}
                <Text style={s.macroText}>{m}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(240)}
        style={s.actions}
      >
        <Pressable
          style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.92 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace("/nutrition/food-log");
          }}
        >
          <Text style={s.primaryBtnText}>View Food Log</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            s.secondaryBtn,
            pressed && { opacity: 0.88 },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            router.replace("/nutrition/scan-food");
          }}
        >
          <Text style={s.secondaryBtnText}>Scan Another</Text>
        </Pressable>
      </Animated.View>

      <View style={s.footer}>
        <View style={s.footerBorder} />
        <View style={s.footerRow}>
          <FooterTool
            label="IMPORT"
            Icon={ImageIcon}
            onPress={() => {
              Haptics.selectionAsync();
              router.replace("/nutrition/add-food");
            }}
          />
          <FooterTool
            label="MANUAL"
            Icon={Pencil}
            onPress={() => {
              Haptics.selectionAsync();
              router.replace("/nutrition/add-food");
            }}
          />
          <FooterTool
            label="LIGHT"
            Icon={Flashlight}
            onPress={() => Haptics.selectionAsync()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FooterTool({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  onPress: () => void;
}) {
  return (
    <Pressable style={s.ftCol} onPress={onPress}>
      <View style={s.ftIconBg}>
        <Icon size={20} color={c.textDark2} strokeWidth={2} />
      </View>
      <Text style={s.ftLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  /** Solid #FFF8F5 cream as in Figma's flat gradient background. */
  safe: { flex: 1, backgroundColor: c.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: f.displayMed,
    fontSize: 16,
    color: c.textDark,
    letterSpacing: 2.4,
    lineHeight: 24,
    opacity: 0.85,
  },

  main: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
  },
  heroWrap: {
    width: RING + 56,
    height: RING + 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  leafTR: { position: "absolute", top: 16, right: 18 },
  leafBL: { position: "absolute", bottom: 22, left: 10 },
  /** Glassmorphism ring `rgba(255,255,255,0.4)` border `rgba(255,255,255,0.3)`. */
  ringGlass: {
    width: RING,
    height: RING,
    borderRadius: 999,
    padding: INNER_PAD,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 25 },
    shadowRadius: 50,
    elevation: 14,
  },
  /** Inner sage-dark disc `#4b6546`. */
  ringInner: {
    flex: 1,
    width: "100%",
    borderRadius: 999,
    backgroundColor: c.sageDark,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 8,
  },

  msgBlock: { alignItems: "center", gap: 8, maxWidth: 340, marginTop: 12 },
  /** Single-line headline; "food log" rendered inline as italic accent. */
  headline: {
    fontFamily: f.displayBold,
    fontSize: 28,
    color: c.textDark,
    letterSpacing: -0.7,
    lineHeight: 36,
    textAlign: "center",
  },
  headlineAccent: {
    fontFamily: f.displayBold,
    color: c.sageDark,
    fontStyle: "italic",
  },
  foodName: {
    marginTop: 4,
    fontFamily: f.displayMed,
    fontSize: 18,
    color: "rgba(67,72,64,0.9)",
    letterSpacing: 0.45,
    lineHeight: 28,
    textAlign: "center",
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  macroItem: { flexDirection: "row", alignItems: "center" },
  macroDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C3C8BE",
    marginHorizontal: 8,
  },
  /** Stats row — `rgba(67,72,64,0.6)` PJS Light 14px tracking 1.4. */
  macroText: {
    fontFamily: f.display,
    fontSize: 14,
    color: "rgba(67,72,64,0.6)",
    letterSpacing: 1.4,
    lineHeight: 20,
  },

  actions: {
    paddingHorizontal: 32,
    gap: 16,
    paddingBottom: 8,
  },
  /** Primary CTA `#4b6546` rounded 24, py 20. */
  primaryBtn: {
    backgroundColor: c.sageDark,
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: f.displaySemi,
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
  },
  /** Secondary glass btn `rgba(255,255,255,0.4)` border `rgba(255,255,255,0.3)`. */
  secondaryBtn: {
    borderRadius: 24,
    paddingVertical: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  secondaryBtnText: {
    fontFamily: f.displayMed,
    fontSize: 16,
    color: c.sageDark,
    lineHeight: 24,
  },

  footer: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 20,
  },
  footerBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(195,200,190,0.1)",
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  ftCol: { alignItems: "center", gap: 4, minWidth: 56 },
  /** Tool button bg `#f3e5de` (cardPeach). */
  ftIconBg: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: c.cardPeach,
    alignItems: "center",
    justifyContent: "center",
  },
  ftLabel: {
    fontFamily: f.displayMed,
    fontSize: 10,
    color: "rgba(67,72,64,0.6)",
    letterSpacing: -0.5,
    lineHeight: 15,
  },
});
