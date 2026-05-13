import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Colour tokens (matching the Figma design)
// ---------------------------------------------------------------------------
const COLORS = {
  background: '#FAF7F4',        // warm off-white
  surface: '#FFFFFF',
  inputBg: '#F5F1ED',
  border: '#E8E0D8',
  title: '#1A1A1A',
  body: '#6B6560',
  placeholder: '#B0A89E',
  icon: '#A09890',
  button: '#B07B7B',            // dusty rose
  buttonText: '#FFFFFF',
  link: '#6B6560',
  divider: '#E0D8D0',
  cardTextLight: '#F5F1ED',
  cardSubtext: '#D4CFC8',
  supportLabel: '#C8C2B8',
};

// ---------------------------------------------------------------------------
// Decorative wave card (SVG-like using Views)
// We keep it pure RN / no SVG dependency for portability.
// ---------------------------------------------------------------------------
const WaveCard: React.FC = () => (
  <View style={styles.waveCard}>
    <LinearGradient
      colors={['#7FA899', '#9BB5A0', '#C4B89A', '#D4C8A8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {/* Wave shapes built from borderRadius tricks */}
    <View style={styles.wave1} />
    <View style={styles.wave2} />
    <View style={styles.wave3} />

    <View style={styles.waveTextContainer}>
      <Text style={styles.supportLabel}>SUPPORT</Text>
      <Text style={styles.supportQuote}>
        "Breathability is the soul of focus."
      </Text>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSend = () => {
    router.push('/(auth)/verification-code');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Digital Sanctuary</Text>
          {/* Spacer so title is centred */}
          <View style={styles.backBtn} />
        </View>

        {/* ── Scrollable body ── */}
        <View style={styles.body}>
          {/* Title block */}
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          {/* Email input */}
          <View
            style={[
              styles.inputWrapper,
              focused && styles.inputWrapperFocused,
            ]}
          >
            {/* Mail icon (unicode envelope) */}
            <Text style={styles.mailIcon}>✉</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>

          {/* Send button */}
          <TouchableOpacity
            style={[styles.button, !email && styles.buttonDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={!email}
          >
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
          </View>

          {/* Back to login */}
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backToLogin}>Back to login</Text>
          </TouchableOpacity>
        </View>

        {/* ── Wave card ── */}
        <View style={styles.cardContainer}>
          <WaveCard />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const WAVE_CARD_HEIGHT = 160;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    width: 36,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.title,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.title,
    letterSpacing: 0.2,
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 8,
  },

  // ── Input ────────────────────────────────────────────────────────────────
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: COLORS.button,
    shadowOpacity: 0.08,
  },
  mailIcon: {
    fontSize: 16,
    color: COLORS.icon,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.title,
    padding: 0,
  },

  // ── Button ───────────────────────────────────────────────────────────────
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: COLORS.button,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Divider / back ───────────────────────────────────────────────────────
  dividerRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    width: width * 0.45,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  backToLogin: {
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.link,
    letterSpacing: 0.1,
  },

  // ── Wave card ─────────────────────────────────────────────────────────────
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  waveCard: {
    height: WAVE_CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  // Decorative wave layers
  wave1: {
    position: 'absolute',
    bottom: -20,
    left: -30,
    width: width * 0.7,
    height: 110,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  wave2: {
    position: 'absolute',
    bottom: 10,
    right: -40,
    width: width * 0.65,
    height: 90,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  wave3: {
    position: 'absolute',
    bottom: 30,
    left: width * 0.1,
    width: width * 0.55,
    height: 70,
    borderRadius: 60,
    backgroundColor: 'rgba(220,210,190,0.25)',
  },
  waveTextContainer: {
    padding: 20,
    zIndex: 10,
  },
  supportLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: COLORS.cardTextLight,
    marginBottom: 6,
    textAlign: 'center',
  },
  supportQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.cardTextLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});