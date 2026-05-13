import { useRouter } from "expo-router";
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  G,
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#F2EDE8',
  logoCircle: '#3B2314',
  logoCircleDot: '#F2EDE8',
  title: '#2C1A0E',
  subtitle: '#7A6A60',
  btn: '#3B2314',
  btnText: '#F2EDE8',
  signInLabel: '#2C1A0E',
  signInLink: '#8B5E3C',
};

// ─── 4-dot Logo Icon (dark circle with cream dots) ───────────────────────────
function LogoIcon() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoCircle}>
        {/* top */}
        <View style={[styles.dot, { top: 10, left: 18 }]} />
        {/* bottom */}
        <View style={[styles.dot, { bottom: 10, left: 18 }]} />
        {/* left */}
        <View style={[styles.dot, { top: 18, left: 10 }]} />
        {/* right */}
        <View style={[styles.dot, { top: 18, right: 10 }]} />
      </View>
    </View>
  );
}

// ─── Robot Mascot (SVG) ───────────────────────────────────────────────────────
function RobotMascot() {
  return (
    <Svg width={220} height={260} viewBox="0 0 220 260">
      <Defs>
        {/* Main body gradient: green → lime */}
        <LinearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#00D4C8" />
          <Stop offset="50%" stopColor="#7EE840" />
          <Stop offset="100%" stopColor="#A8F040" />
        </LinearGradient>
        {/* Arm gradient */}
        <LinearGradient id="armGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#00C4B8" />
          <Stop offset="100%" stopColor="#7EE840" />
        </LinearGradient>
        {/* Shadow ellipse */}
        <RadialGradient id="shadowGrad" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#C8E8F8" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#C8E8F8" stopOpacity="0" />
        </RadialGradient>
        {/* Visor gradient */}
        <LinearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#1A1A2E" />
          <Stop offset="100%" stopColor="#0D0D1A" />
        </LinearGradient>
        {/* Shine spot */}
        <RadialGradient id="shineGrad" cx="30%" cy="30%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="110" cy="248" rx="55" ry="12" fill="url(#shadowGrad)" />

      {/* Left arm (raised, waving) */}
      <Path
        d="M68 168 Q38 155 32 135 Q28 120 42 118 Q56 116 62 132 Q68 148 75 158 Z"
        fill="url(#armGrad)"
      />

      {/* Right arm (down) */}
      <Path
        d="M152 168 Q178 162 184 148 Q190 134 178 128 Q166 122 158 136 Q150 150 148 162 Z"
        fill="url(#armGrad)"
      />

      {/* Body (rounded rectangle) */}
      <Rect
        x="62"
        y="145"
        width="96"
        height="88"
        rx="30"
        ry="30"
        fill="url(#bodyGrad)"
      />

      {/* Head (large circle) */}
      <Circle cx="110" cy="118" r="62" fill="url(#bodyGrad)" />

      {/* Shine on head */}
      <Circle cx="110" cy="118" r="62" fill="url(#shineGrad)" />

      {/* Antenna stem */}
      <Rect x="107" y="48" width="6" height="20" rx="3" fill="#00D4C8" />
      {/* Antenna ball */}
      <Circle cx="110" cy="44" r="7" fill="#00D4C8" />
      <Circle cx="110" cy="44" r="4" fill="#7EE840" />

      {/* Visor / face panel */}
      <Rect
        x="68"
        y="100"
        width="84"
        height="44"
        rx="20"
        fill="url(#visorGrad)"
      />

      {/* Left eye white */}
      <Circle cx="90" cy="118" r="13" fill="white" />
      {/* Left pupil */}
      <Circle cx="91" cy="119" r="7" fill="#1A1A2E" />
      {/* Left eye shine */}
      <Circle cx="87" cy="115" r="3" fill="white" />

      {/* Right eye white */}
      <Circle cx="130" cy="118" r="13" fill="white" />
      {/* Right pupil */}
      <Circle cx="131" cy="119" r="7" fill="#1A1A2E" />
      {/* Right eye shine */}
      <Circle cx="127" cy="115" r="3" fill="white" />

      {/* Smile */}
      <Path
        d="M94 136 Q110 148 126 136"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body shine */}
      <Ellipse cx="95" cy="162" rx="14" ry="8" fill="white" opacity="0.18" />
    </Svg>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
export default function WelcomeScreen({
  onGetStarted,
  onSignIn,
}: {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const robotAnim = useRef(new Animated.Value(0)).current;
  const robotFloat = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // Entrance sequence
    Animated.stagger(140, [
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(robotAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(btnAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating loop for robot
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotFloat, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(robotFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const headerStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-24, 0],
        }),
      },
    ],
  };

  const robotStyle = {
    opacity: robotAnim,
    transform: [
      {
        scale: robotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.75, 1],
        }),
      },
      { translateY: robotFloat },
    ],
  };

  const btnStyle = {
    opacity: btnAnim,
    transform: [
      {
        translateY: btnAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header: logo + title + subtitle */}
      <Animated.View style={[styles.header, headerStyle]}>
        <LogoIcon />
        <Text style={styles.title}>Welcome to MoodMate</Text>
        <Text style={styles.subtitle}>
          Your mindful mental health application for{'\n'}everyone, anywhere 🌿
        </Text>
      </Animated.View>

      {/* Robot mascot */}
      <Animated.View style={[styles.robotWrap, robotStyle]}>
        <RobotMascot />
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.footer, btnStyle]}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInLabel}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
            <Text style={styles.signInLink}>Sign In.</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logoWrap: {
    marginBottom: 4,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.logoCircle,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.logoCircleDot,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: C.title,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: 'Georgia',
    fontSize: 15,
    color: C.subtitle,
    textAlign: 'center',
    lineHeight: 23,
  },
  robotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.btn,
    borderRadius: 50,
    width: '100%',
    paddingVertical: 18,
    gap: 10,
  },
  btnText: {
    color: C.btnText,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Georgia',
    letterSpacing: 0.3,
  },
  btnArrow: {
    color: C.btnText,
    fontSize: 18,
    fontWeight: '600',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInLabel: {
    fontSize: 14,
    color: C.signInLabel,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  signInLink: {
    fontSize: 14,
    color: C.signInLink,
    fontWeight: '700',
    fontFamily: 'Georgia',
    textDecorationLine: 'underline',
  },
});