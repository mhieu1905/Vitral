import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { supabase } from "../../utils/supabase";
import { healthProfileService } from "../../services/healthProfileService";

const { width } = Dimensions.get("window");

const BUBBLE_SIZE = width * 0.72;
const BG_COLOR = "#1C0F08";
const BUBBLE_COLOR = "#3D2010";

interface BubbleProps {
  style: object;
  delay: number;
}

function Bubble({ style, delay }: BubbleProps) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 2200,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.92,
            duration: 2200,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.85,
            duration: 2200,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        style,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.quad), // ✅ FIX
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ])
      );

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 200);
    const a3 = animateDot(dot3, 400);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View style={styles.dotsRow}>
      <Animated.Text style={[styles.dot, dotStyle(dot1)]}>•</Animated.Text>
      <Animated.Text style={[styles.dot, dotStyle(dot2)]}>•</Animated.Text>
      <Animated.Text style={[styles.dot, dotStyle(dot3)]}>•</Animated.Text>
    </View>
  );
}

export default function LoadingScreen() {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 800,
      delay: 300,
      easing: Easing.out(Easing.quad), // ✅ OK
      useNativeDriver: true,
    }).start();

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const profile = await healthProfileService.getUserHealthProfile(session.user.id);
          if (profile) {
            router.replace("/(tabs)/dashboard");
          } else {
            router.replace("/(onboarding)/goal-selection");
          }
        } else {
          router.replace("/(onboarding)/welcome");
        }
      } catch (error) {
        console.error("Session check error:", error);
        router.replace("/(onboarding)/welcome");
      }
    };

    const timer = setTimeout(() => {
      checkSession();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

      <Bubble
        delay={0}
        style={{
          position: "absolute",
          top: -BUBBLE_SIZE * 0.08,
          left: -BUBBLE_SIZE * 0.12,
        }}
      />

      <Bubble
        delay={600}
        style={{
          position: "absolute",
          top: BUBBLE_SIZE * 0.25,
          right: -BUBBLE_SIZE * 0.12,
        }}
      />

      <Bubble
        delay={300}
        style={{
          position: "absolute",
          bottom: BUBBLE_SIZE * 0.1,
          left: -BUBBLE_SIZE * 0.12,
        }}
      />

      <Bubble
        delay={900}
        style={{
          position: "absolute",
          bottom: -BUBBLE_SIZE * 0.08,
          right: -BUBBLE_SIZE * 0.12,
        }}
      />

      <Animated.View style={[styles.centerContent, { opacity: textOpacity }]}>
        <View style={styles.loadingRow}>
          <Text style={styles.loadingText}>Loading </Text>
          <LoadingDots />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: BUBBLE_COLOR,
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 1,
    gap: 2,
  },
  dot: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 26,
  },
});