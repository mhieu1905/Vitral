import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Unit = "kg" | "lbs";

const TICK_SPACING = 18; // px between each 0.1 unit tick
const TICKS_PER_UNIT = 10;
const MIN_KG = 30;
const MAX_KG = 250;
const MIN_LBS = 66;
const MAX_LBS = 550;

function getRange(unit: Unit) {
  return unit === "kg"
    ? { min: MIN_KG, max: MAX_KG }
    : { min: MIN_LBS, max: MAX_LBS };
}

// Each integer has TICKS_PER_UNIT ticks
function buildTicks(unit: Unit) {
  const { min, max } = getRange(unit);
  const ticks: number[] = [];
  for (let v = min; v <= max; v++) {
    for (let t = 0; t < TICKS_PER_UNIT; t++) {
      ticks.push(parseFloat((v + t / TICKS_PER_UNIT).toFixed(1)));
    }
  }
  return ticks;
}

function tickHeight(tick: number): number {
  const frac = Math.round((tick % 1) * 10);
  if (frac === 0) return 36; // major tick (whole number)
  if (frac === 5) return 24; // half tick
  return 14; // minor tick
}

function tickWidth(tick: number): number {
  const frac = Math.round((tick % 1) * 10);
  if (frac === 0) return 2.5;
  if (frac === 5) return 1.8;
  return 1.2;
}

export default function WeightPickerScreen() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [weight, setWeight] = useState(128);
  const scrollRef = useRef<ScrollView>(null);
  const ticks = buildTicks(unit);
  const { min } = getRange(unit);

  const valueToOffset = useCallback(
    (val: number) => {
      return Math.round((val - min) * TICKS_PER_UNIT) * TICK_SPACING;
    },
    [min],
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const tickIndex = Math.round(x / TICK_SPACING);
    const val = parseFloat((min + tickIndex / TICKS_PER_UNIT).toFixed(1));
    setWeight(val);
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const tickIndex = Math.round(x / TICK_SPACING);
    scrollRef.current?.scrollTo({
      x: tickIndex * TICK_SPACING,
      animated: true,
    });
    const val = parseFloat((min + tickIndex / TICKS_PER_UNIT).toFixed(1));
    setWeight(val);
  };

  const switchUnit = (u: Unit) => {
    if (u === unit) return;
    const newWeight =
      u === "lbs" ? Math.round(weight * 2.20462) : Math.round(weight / 2.20462);
    setUnit(u);
    setWeight(newWeight);
    // scroll after state settles
    setTimeout(() => {
      const newMin = u === "kg" ? MIN_KG : MIN_LBS;
      const offset =
        Math.round((newWeight - newMin) * TICKS_PER_UNIT) * TICK_SPACING;
      scrollRef.current?.scrollTo({ x: offset, animated: false });
    }, 50);
  };

  const displayWeight = Math.floor(weight);
  const initialOffset = valueToOffset(weight);

  // Label positions: show integer labels every whole number, but only show a
  // few around the current value to avoid crowding
  const labelStep = 1; // one label per integer

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
          <Text style={styles.stepText}>4 of 4</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What's your weight?</Text>
      </View>

      {/* Unit Toggle */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleTrack}>
          <TouchableOpacity
            style={[styles.toggleOption, unit === "kg" && styles.toggleActive]}
            onPress={() => switchUnit("kg")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "kg" && styles.toggleTextActive,
              ]}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, unit === "lbs" && styles.toggleActive]}
            onPress={() => switchUnit("lbs")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "lbs" && styles.toggleTextActive,
              ]}
            >
              lbs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weight Display */}
      <View style={styles.weightDisplay}>
        <Text style={styles.weightNumber}>{displayWeight}</Text>
        <Text style={styles.weightUnit}>{unit}</Text>
      </View>

      {/* Ruler Picker */}
      <View style={styles.rulerContainer}>
        {/* Center indicator line */}
        <View style={styles.centerLine} pointerEvents="none" />

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_SPACING}
          decelerationRate="fast"
          contentOffset={{ x: initialOffset, y: 0 }}
          contentContainerStyle={{
            paddingHorizontal: width / 2,
            alignItems: "flex-end",
            paddingBottom: 0,
          }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.rulerScroll}
        >
          <View style={styles.tickRow}>
            {ticks.map((tick, i) => {
              const frac = Math.round((tick % 1) * 10);
              const isMajor = frac === 0;
              const diff = Math.abs(tick - weight);
              const isSelected = diff < 0.05;

              let color = "#D4C4B8";
              if (isSelected) color = "#8FAF7E";
              else if (diff < 1) color = "#C4A99A";
              else if (diff < 2) color = "#D4C4B8";

              return (
                <View
                  key={i}
                  style={[
                    styles.tick,
                    {
                      height: tickHeight(tick),
                      width: tickWidth(tick),
                      backgroundColor: color,
                      marginHorizontal: (TICK_SPACING - tickWidth(tick)) / 2,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Integer labels below ticks */}
          <View style={[StyleSheet.absoluteFill, { top: undefined }]}>
            <View style={styles.labelsRow}>
              {ticks
                .filter((t) => Math.round((t % 1) * 10) === 0)
                .map((t, i) => {
                  const offset = i * TICKS_PER_UNIT * TICK_SPACING;
                  const diff = Math.abs(t - weight);
                  const labelColor = diff < 1.5 ? "#8C7B72" : "#C0B0A8";
                  return (
                    <View
                      key={t}
                      style={[
                        styles.labelWrapper,
                        { left: offset - width / 2 + 4 },
                      ]}
                    >
                      <Text style={[styles.labelText, { color: labelColor }]}>
                        {Math.round(t)}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Finish Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.finishButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.finishText}>Finish →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3D2B1F",
    letterSpacing: -0.3,
  },

  // Toggle
  toggleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  toggleTrack: {
    flexDirection: "row",
    backgroundColor: "#EDE7DC",
    borderRadius: 40,
    padding: 4,
    width: 180,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 36,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#D4928A",
    shadowColor: "#D4928A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#A89B8C",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },

  // Weight display
  weightDisplay: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 20,
  },
  weightNumber: {
    fontSize: 80,
    fontWeight: "800",
    color: "#3D2B1F",
    letterSpacing: -3,
    lineHeight: 88,
  },
  weightUnit: {
    fontSize: 26,
    fontWeight: "500",
    color: "#8C7B72",
    marginBottom: 14,
    marginLeft: 6,
  },

  // Ruler
  rulerContainer: {
    height: 80,
    position: "relative",
    justifyContent: "flex-end",
  },
  centerLine: {
    position: "absolute",
    left: width / 2 - 1.5,
    top: 0,
    bottom: 24,
    width: 3,
    backgroundColor: "#8FAF7E",
    borderRadius: 2,
    zIndex: 2,
  },
  rulerScroll: {
    flex: 1,
  },
  tickRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 48,
    paddingBottom: 4,
  },
  tick: {
    borderRadius: 2,
  },
  labelsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  labelWrapper: {
    position: "absolute",
    bottom: 0,
    width: TICK_SPACING * TICKS_PER_UNIT,
    alignItems: "center",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Button
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 32,
  },
  finishButton: {
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
  finishText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
