import { router } from "expo-router";
import { useOnboardingStore } from "@/store/onboardingStore";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ITEM_HEIGHT = 72;
const VISIBLE_ITEMS = 5;
const MIN_AGE = 13;
const MAX_AGE = 80;

const ages = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

export default function AgePickerScreen() {
  const [selectedAge, setSelectedAge] = useState(18);
  const scrollRef = useRef<ScrollView>(null);
  const setAge = useOnboardingStore((state) => state.setAge);

  const initialIndex = ages.indexOf(18);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const age = ages[Math.min(Math.max(index, 0), ages.length - 1)];
    setSelectedAge(age);
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    const age = ages[Math.min(Math.max(index, 0), ages.length - 1)];
    setSelectedAge(age);
  };

  const snapToAge = (age: number) => {
    const index = ages.indexOf(age);
    if (index >= 0) {
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
      setSelectedAge(age);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>3 of 4</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What's your age?</Text>
      </View>

      {/* Picker */}
      <View style={styles.pickerWrapper}>
        {/* Highlight pill behind selected item */}
        <View style={styles.selectedHighlight} pointerEvents="none" />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {ages.map((age) => {
            const diff = Math.abs(age - selectedAge);
            const isSelected = diff === 0;
            const isClose = diff === 1;
            const isFar = diff === 2;

            const fontSize = isSelected ? 52 : isClose ? 36 : isFar ? 26 : 20;
            const color = isSelected
              ? "#FFFFFF"
              : isClose
              ? "#A89B8C"
              : "#C8BEB5";
            const fontWeight = isSelected ? "700" : isClose ? "500" : "400";

            return (
              <TouchableOpacity
                key={age}
                style={[styles.ageItem, { height: ITEM_HEIGHT }]}
                onPress={() => snapToAge(age)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.ageText,
                    { fontSize, color, fontWeight },
                  ]}
                >
                  {age}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={() => {
            setAge(selectedAge);
            router.push("/(onboarding)/chooseweight");
          }}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F0E8",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#C8BEB5",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: "#3D2B1F",
    lineHeight: 26,
    marginTop: -2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#3D2B1F",
    letterSpacing: 0.1,
  },
  stepBadge: {
    backgroundColor: "#EDE7DC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#7A6355",
  },

  // Title
  titleContainer: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3D2B1F",
    letterSpacing: -0.3,
  },

  // Picker
  pickerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedHighlight: {
    position: "absolute",
    width: width * 0.52,
    height: ITEM_HEIGHT + 14,
    backgroundColor: "#8FAF7E",
    borderRadius: 40,
    zIndex: 0,
    shadowColor: "#8FAF7E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  scrollView: {
    width: "100%",
    height: PICKER_HEIGHT,
    zIndex: 1,
  },
  ageItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ageText: {
    textAlign: "center",
    letterSpacing: -1,
  },

  // Button
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: "#3D2B1F",
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3D2B1F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});