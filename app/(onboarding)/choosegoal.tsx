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
import { Circle, Path, Rect, Svg } from "react-native-svg";

// --- Icon Components ---
const HeartIcon = ({ color = "#C4AFA6" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.79 3.85 12 5C12.21 3.85 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </Svg>
);

const SmileStarIcon = ({ color = "#C4AFA6" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
    <Path
      d="M8.5 14.5C8.5 14.5 9.5 16 12 16C14.5 16 15.5 14.5 15.5 14.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path d="M12 8V10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M11 9H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Circle cx="9" cy="11" r="0.8" fill={color} />
    <Circle cx="15" cy="11" r="0.8" fill={color} />
  </Svg>
);

const FlagIcon = ({ color = "#C4AFA6" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M5 21V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path
      d="M5 5H15L13 10H5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 10H18L16 15H5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PersonStarIcon = ({ color = "#C4AFA6" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="3.5" stroke={color} strokeWidth="1.6" />
    <Path
      d="M5 20C5 17 8 14.5 12 14.5C14 14.5 15.8 15.2 17.1 16.3"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path
      d="M18 14L18.9 16.5L21.5 16.5L19.4 18.1L20.2 20.7L18 19.1L15.8 20.7L16.6 18.1L14.5 16.5L17.1 16.5L18 14Z"
      stroke={color}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </Svg>
);

const BagIcon = ({ color = "#C4AFA6" }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="8"
      width="16"
      height="13"
      rx="2"
      stroke={color}
      strokeWidth="1.6"
    />
    <Path
      d="M8 8V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V8"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path d="M4 13H20" stroke={color} strokeWidth="1.3" strokeDasharray="2 2" />
  </Svg>
);

const RadioUnchecked = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#C4AFA6" strokeWidth="1.8" />
  </Svg>
);

const RadioChecked = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#8FAE88" strokeWidth="1.8" />
    <Circle cx="12" cy="12" r="5" fill="#8FAE88" />
  </Svg>
);

// --- Data ---
const goals = [
  {
    id: "stress",
    label: "I wanna reduce stress",
    icon: HeartIcon,
  },
  {
    id: "moodmate",
    label: "I wanna try MoodMate",
    icon: SmileStarIcon,
  },
  {
    id: "trauma",
    label: "I want to cope with trauma",
    icon: FlagIcon,
  },
  {
    id: "better",
    label: "I want to be a better person",
    icon: PersonStarIcon,
  },
  {
    id: "try",
    label: "Just trying out the app, mate!",
    icon: BagIcon,
  },
];

// --- Main Screen ---
export default function ChooseGoalScreen() {
  const [selected, setSelected] = useState<string>("moodmate");

  const setGoal = useOnboardingStore((state) => state.setGoal);

  const goal = useOnboardingStore((state) => state.goal);

  useEffect(() => {
    if (goal) setSelected(goal);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Personal Information</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>1 of 4</Text>
        </View>
      </View>

      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>What's your health{"\n"}goal?</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {goals.map((goal) => {
          const isSelected = selected === goal.id;
          const IconComponent = goal.icon;
          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => setSelected(goal.id)}
              activeOpacity={0.75}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconWrapper}>
                  <IconComponent color={isSelected ? "#ffffff" : "#C4AFA6"} />
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </View>
              {isSelected ? <RadioChecked /> : <RadioUnchecked />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && { opacity: 0.5 }]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() => {
            setGoal(selected);
            router.push("/(onboarding)/choosegender");
          }}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CREAM = "#F5F0E8";
const GREEN = "#8FAE88";
const BROWN = "#2C1A0E";
const BROWN_LIGHT = "#9E8C80";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  // --- Top Bar ---
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 8,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BROWN,
    letterSpacing: 0.2,
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

  // --- Heading ---
  headingContainer: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 36,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: BROWN,
    lineHeight: 42,
    letterSpacing: 0.2,
  },

  // --- Options ---
  optionsContainer: {
    paddingHorizontal: 18,
    gap: 12,
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDFAF5",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "#E8DDD3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: BROWN,
    flexShrink: 1,
  },
  optionLabelSelected: {
    color: "#ffffff",
  },

  // --- Button ---
  buttonContainer: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    paddingTop: 20,
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
