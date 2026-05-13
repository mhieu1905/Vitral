import { useOnboardingStore } from "@/store/onboardingStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Ellipse, Path, Svg } from "react-native-svg";

// ─── Sparkle ────────────────────────────────────────────────────────────────
const Sparkle = ({ x = 0, y = 0, size = 16, color = "#E8C84A" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ position: "absolute", left: x, top: y }}
  >
    <Path
      d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
      fill={color}
    />
  </Svg>
);

// ─── Male Illustration (SVG character) ──────────────────────────────────────
const MaleIllustration = () => (
  <Svg width="160" height="140" viewBox="0 0 160 140" fill="none">
    {/* Body / shirt */}
    <Ellipse cx="95" cy="130" rx="52" ry="30" fill="#8FAE88" />
    {/* White shirt collar */}
    <Path d="M72 100 Q95 115 118 100 L118 130 Q95 140 72 130 Z" fill="white" />
    {/* Neck */}
    <Rect x="87" y="72" width="20" height="22" rx="8" fill="#C9A882" />
    {/* Head */}
    <Ellipse cx="97" cy="58" rx="28" ry="30" fill="#C9A882" />
    {/* Hair - dark, wavy top */}
    <Path
      d="M69 45 Q72 22 97 20 Q122 22 126 45 Q122 30 97 28 Q72 30 69 45Z"
      fill="#2C1A0E"
    />
    {/* Beard */}
    <Path
      d="M75 72 Q80 88 97 90 Q114 88 119 72 Q110 80 97 81 Q84 80 75 72Z"
      fill="#2C1A0E"
    />
    {/* Glasses frame */}
    <Path
      d="M78 54 L86 54"
      stroke="#2C1A0E"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Rect
      x="78"
      y="50"
      width="16"
      height="10"
      rx="4"
      stroke="#2C1A0E"
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M108 54 L116 54"
      stroke="#2C1A0E"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Rect
      x="100"
      y="50"
      width="16"
      height="10"
      rx="4"
      stroke="#2C1A0E"
      strokeWidth="2"
      fill="none"
    />
    <Path d="M94 54 L100 54" stroke="#2C1A0E" strokeWidth="2" />
    {/* Ear */}
    <Ellipse cx="69" cy="60" rx="4" ry="6" fill="#C9A882" />
    <Ellipse cx="125" cy="60" rx="4" ry="6" fill="#C9A882" />
    {/* Smile */}
    <Path
      d="M89 70 Q97 76 105 70"
      stroke="#8B6347"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Hand / arm gesture */}
    <Path
      d="M118 105 Q140 90 148 75"
      stroke="#C9A882"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <Ellipse cx="150" cy="70" rx="9" ry="11" fill="#C9A882" />
  </Svg>
);

// ─── Female Illustration ─────────────────────────────────────────────────────
const FemaleIllustration = () => (
  <Svg width="160" height="150" viewBox="0 0 160 150" fill="none">
    {/* Body */}
    <Ellipse cx="90" cy="138" rx="58" ry="28" fill="#D4A5A5" />
    {/* Long hair - back layer */}
    <Path
      d="M50 55 Q35 90 40 140 Q60 155 80 150 L78 80 Q65 75 50 55Z"
      fill="#2C1A0E"
    />
    {/* Neck */}
    <Rect x="78" y="74" width="18" height="20" rx="8" fill="#E8C4A0" />
    {/* Head */}
    <Ellipse cx="87" cy="56" rx="26" ry="28" fill="#E8C4A0" />
    {/* Hair top */}
    <Path
      d="M61 45 Q65 18 87 16 Q112 18 114 45 Q108 25 87 24 Q66 25 61 45Z"
      fill="#2C1A0E"
    />
    {/* Long hair - front right */}
    <Path
      d="M113 55 Q128 85 130 140 L115 148 Q112 100 106 80 Q112 72 113 55Z"
      fill="#2C1A0E"
    />
    {/* Ear */}
    <Ellipse cx="61" cy="58" rx="4" ry="5" fill="#E8C4A0" />
    <Ellipse cx="113" cy="58" rx="4" ry="5" fill="#E8C4A0" />
    {/* Eyes */}
    <Ellipse cx="79" cy="52" rx="4" ry="5" fill="#2C1A0E" />
    <Ellipse cx="95" cy="52" rx="4" ry="5" fill="#2C1A0E" />
    <Ellipse cx="80" cy="51" rx="1.5" ry="2" fill="white" />
    <Ellipse cx="96" cy="51" rx="1.5" ry="2" fill="white" />
    {/* Nose */}
    <Path
      d="M86 58 Q84 65 87 67 Q90 65 88 58"
      stroke="#C9956A"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Smile */}
    <Path
      d="M79 72 Q87 78 95 72"
      stroke="#C9956A"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Cheek blush */}
    <Ellipse cx="70" cy="65" rx="7" ry="4" fill="#F2A0A0" opacity="0.4" />
    <Ellipse cx="104" cy="65" rx="7" ry="4" fill="#F2A0A0" opacity="0.4" />
  </Svg>
);

// ─── Missing Rect import shim ─────────────────────────────────────────────────
// react-native-svg exports Rect, but let's inline a simple one via Path if needed.
// Actually Rect is available — keeping the import above.

// ─── Gender Symbol ────────────────────────────────────────────────────────────
const MaleSymbol = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="14" r="6" stroke={color} strokeWidth="2" />
    <Path
      d="M14.5 9.5L20 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M16 4H20V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FemaleSymbol = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="6" stroke={color} strokeWidth="2" />
    <Path d="M12 15V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ─── Back Arrow ───────────────────────────────────────────────────────────────
const BackArrow = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#2C1A0E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
type Gender = "male" | "female" | null;

export default function ChooseGenderScreen() {
  const [selected, setSelected] = useState<Gender>(null);
  const [skipped, setSkipped] = useState(false);
  const setGender = useOnboardingStore((state) => state.setGender);

  const gender = useOnboardingStore((state) => state.gender);

  useEffect(() => {
    if (gender) setSelected(gender);
  }, []);

  const handleSkip = () => {
    setSelected(null);
    setSkipped(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Personal Information</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>2 of 4</Text>
        </View>
      </View>

      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>What's your official{"\n"}gender?</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* Male Card */}
        <TouchableOpacity
          style={[styles.card, selected === "male" && styles.cardSelected]}
          onPress={() => {
            setSelected("male");
            setSkipped(false);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.cardLabel,
                selected === "male" && styles.cardLabelSelected,
              ]}
            >
              I am Male
            </Text>
            <View style={styles.illustrationWrapper}>
              {/* Sparkles */}
              <View style={{ position: "absolute", right: 60, top: 10 }}>
                <Svg width="16" height="16" viewBox="0 0 24 24">
                  <Path
                    d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
                    fill="#E8C84A"
                  />
                </Svg>
              </View>
              <View style={{ position: "absolute", right: 20, top: 30 }}>
                <Svg width="10" height="10" viewBox="0 0 24 24">
                  <Path
                    d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
                    fill="#E8C84A"
                  />
                </Svg>
              </View>
              <MaleIllustration />
            </View>
            <MaleSymbol color={selected === "male" ? "#8FAE88" : "#C4AFA6"} />
          </View>
        </TouchableOpacity>

        {/* Female Card */}
        <TouchableOpacity
          style={[styles.card, selected === "female" && styles.cardSelected]}
          onPress={() => {
            setSelected("female");
            setSkipped(false);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.cardLabel,
                selected === "female" && styles.cardLabelSelected,
              ]}
            >
              I am Female
            </Text>
            <View style={styles.illustrationWrapper}>
              {/* Sparkles */}
              <View style={{ position: "absolute", right: 80, top: 12 }}>
                <Svg width="14" height="14" viewBox="0 0 24 24">
                  <Path
                    d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
                    fill="#E8C84A"
                  />
                </Svg>
              </View>
              <View style={{ position: "absolute", right: 50, top: 0 }}>
                <Svg width="10" height="10" viewBox="0 0 24 24">
                  <Path
                    d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
                    fill="#E8C84A"
                  />
                </Svg>
              </View>
              <FemaleIllustration />
            </View>
            <FemaleSymbol
              color={selected === "female" ? "#D4A5A5" : "#C4AFA6"}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Skip + Continue */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.skipButton, skipped && styles.skipButtonActive]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={[styles.skipText, skipped && styles.skipTextActive]}>
            Prefer to skip, thanks
          </Text>
          <Text style={[styles.skipX, skipped && styles.skipTextActive]}>
            {" "}
            ×
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !selected && { opacity: 0.5 }]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() => {
            if (selected) {
              setGender(selected);
              router.push("/(onboarding)/chooseage");
            }
          }}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CREAM = "#F5F0E8";
const GREEN = "#8FAE88";
const BROWN = "#2C1A0E";
const BORDER = "#E0D5C8";

// Quick shim — Rect isn't used directly in JSX but SVG Rect is used inside Svg components above
const Rect = ({ x, y, width, height, rx, fill, stroke, strokeWidth }: any) => (
  <Path
    d={`M${+x + +rx},${y} h${+width - 2 * +rx} a${rx},${rx} 0 0 1 ${rx},${rx} v${+height - 2 * +rx} a${rx},${rx} 0 0 1 -${rx},${rx} h-${+width - 2 * +rx} a${rx},${rx} 0 0 1 -${rx},-${rx} v-${+height - 2 * +rx} a${rx},${rx} 0 0 1 ${rx},-${rx} z`}
    fill={fill || "none"}
    stroke={stroke}
    strokeWidth={strokeWidth}
  />
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDFAF5",
  },
  topBarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: BROWN,
  },
  stepBadge: {
    backgroundColor: "#F2E5D9",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C4957A",
  },
  headingContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: BROWN,
    lineHeight: 40,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 18,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FDFAF5",
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#C4B5A5",
    shadowOpacity: 0.1,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
  },
  cardLabelSelected: {
    color: BROWN,
  },
  illustrationWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 170,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  bottomContainer: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 14,
    gap: 12,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBF0E8",
    borderRadius: 30,
    height: 48,
    paddingHorizontal: 24,
  },
  skipButtonActive: {
    backgroundColor: "#DDE8D8",
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8FAE88",
  },
  skipTextActive: {
    color: "#5A7A55",
  },
  skipX: {
    fontSize: 18,
    fontWeight: "400",
    color: "#8FAE88",
  },
  continueButton: {
    backgroundColor: BROWN,
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
