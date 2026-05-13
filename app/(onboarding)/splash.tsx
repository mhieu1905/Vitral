import { useRouter } from "expo-router";
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLORS = {
  background: '#F2EDE8',
  logo: '#8B5E3C',
  wordmark: '#3B2314',
};

const FONT = {
  wordmark: 'Georgia', // Serif to match the bold elegant wordmark
};

// ─── Logo: 4-circle clover/flower shape ──────────────────────────────────────
function VitalTrackLogo({ size = 80 }: { size?: number }) {
  const r = size * 0.28; // circle radius
  const offset = size * 0.22; // distance from center

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Top circle */}
      <View
        style={[
          styles.circle,
          {
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            backgroundColor: COLORS.logo,
            position: 'absolute',
            top: size / 2 - offset - r,
            left: size / 2 - r,
          },
        ]}
      />
      {/* Bottom circle */}
      <View
        style={[
          styles.circle,
          {
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            backgroundColor: COLORS.logo,
            position: 'absolute',
            top: size / 2 + offset - r,
            left: size / 2 - r,
          },
        ]}
      />
      {/* Left circle */}
      <View
        style={[
          styles.circle,
          {
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            backgroundColor: COLORS.logo,
            position: 'absolute',
            top: size / 2 - r,
            left: size / 2 - offset - r,
          },
        ]}
      />
      {/* Right circle */}
      <View
        style={[
          styles.circle,
          {
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            backgroundColor: COLORS.logo,
            position: 'absolute',
            top: size / 2 - r,
            left: size / 2 + offset - r,
          },
        ]}
      />
    </View>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(10)).current;
  const router = useRouter();

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(() => {
      router.replace("/(onboarding)/loading");
    });

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Centered brand mark */}
      <View style={styles.brand}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <VitalTrackLogo size={96} />
        </Animated.View>

        <Animated.Text
          style={[
            styles.wordmark,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          Vital Track
        </Animated.Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    gap: 20,
  },
  circle: {
    // base style; dimensions set inline
  },
  wordmark: {
    fontFamily: FONT.wordmark,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.wordmark,
    letterSpacing: 0.4,
    marginTop: 4,
  },
});