import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

// ─── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#FAF7F4',
  white: '#FFFFFF',
  title: '#2D5A27',         // deep forest green
  body: '#6B6560',
  placeholder: '#C8BFB8',
  inputBg: '#FFFFFF',
  inputBorder: '#E8E0D8',
  inputBorderFilled: '#B07B7B',
  resendBg: '#F5EDEB',
  resendText: '#B07B7B',
  resendIcon: '#B07B7B',
  btnPrimary: '#B07B7B',    // dusty rose
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBorder: '#E0D5CC',
  btnSecondaryText: '#6B6560',
  cardBg: '#F5F1ED',
  cardIcon: '#6B7F5E',
  cardTitle: '#2D3A28',
  cardBody: '#6B6560',
  headerIcon: '#4A4540',
  timerIcon: '#B07B7B',
};

// ─── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const reset = () => {
    clearInterval(intervalRef.current!);
    setSeconds(initial);
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(intervalRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { label: `${mm}:${ss}`, expired: seconds === 0, reset };
}

// ─── Decorative circle illustration ─────────────────────────────────────────
const HeroIllustration: React.FC = () => (
  <View style={styles.heroWrapper}>
    {/* Outer gradient circle */}
    <LinearGradient
      colors={['#E8C4B0', '#C4B8A0', '#8FAF98', '#5A8070']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.heroCircle}
    >
      {/* Mountain layers */}
      <View style={styles.mountain3} />
      <View style={styles.mountain2} />
      <View style={styles.mountain1} />

      {/* Shield badge */}
      <View style={styles.shieldOuter}>
        <View style={styles.shieldInner}>
          <Text style={styles.shieldIcon}>🛡</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

// ─── OTP Input ───────────────────────────────────────────────────────────────
const CODE_LENGTH = 6;

interface OtpInputProps {
  value: string[];
  onChange: (v: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const refs = useRef<(TextInput | null)[]>([]);

  const handleKey = (index: number, text: string) => {
    if (text.length > 1) {
      // Handle paste
      const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
      const next = [...value];
      digits.forEach((d, i) => { if (index + i < CODE_LENGTH) next[index + i] = d; });
      onChange(next);
      const focus = Math.min(index + digits.length, CODE_LENGTH - 1);
      refs.current[focus]?.focus();
      return;
    }
    const next = [...value];
    next[index] = text.replace(/\D/g, '');
    onChange(next);
    if (text && index < CODE_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleBackspace = (index: number, text: string) => {
    if (!text && index > 0) {
      const next = [...value];
      next[index - 1] = '';
      onChange(next);
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpRow}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.otpCell,
            value[i] ? styles.otpCellFilled : styles.otpCellEmpty,
          ]}
        >
          <TextInput
            ref={r => { refs.current[i] = r; }}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            value={value[i] ?? ''}
            onChangeText={t => handleKey(i, t)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') handleBackspace(i, value[i]);
            }}
            selectTextOnFocus
            caretHidden
          />
          {!value[i] && <Text style={styles.otpDot}>•</Text>}
        </View>
      ))}
    </View>
  );
};

// ─── Security card ───────────────────────────────────────────────────────────
const SecurityCard: React.FC = () => (
  <View style={styles.secCard}>
    <View style={styles.secIconWrapper}>
      <Text style={styles.secIconEmoji}>🔐</Text>
    </View>
    <View style={styles.secText}>
      <Text style={styles.secTitle}>Security Protocol</Text>
      <Text style={styles.secBody}>
        This 2-step verification ensures that your health journey and personal
        data remain private and secure.
      </Text>
    </View>
  </View>
);

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function VerificationCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const { label, expired, reset } = useCountdown(59);

  const filled = code.filter(Boolean).length;
  const isComplete = filled === CODE_LENGTH;

  const handleVerify = () => {
    console.log('Verify:', code.join(''));
  };

  const handleResend = () => {
    if (!expired) return;
    setCode(Array(CODE_LENGTH).fill(''));
    reset();
    console.log('Resend code');
  };

  const handleNotReceived = () => {
    console.log('Did not receive code');
  };

  const handleBack = () => router.back();
  const handleSettings = () => console.log('Settings');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Text style={styles.headerArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Code</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.headerBtn}>
          <Text style={styles.headerGear}>⚙</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero illustration */}
          <HeroIllustration />

          {/* Title */}
          <Text style={styles.title}>Protecting Your{'\n'}Peace</Text>
          <Text style={styles.subtitle}>
            We have sent a 6-digit code to your email. Enter it below to return
            to your sanctuary.
          </Text>

          {/* OTP */}
          <OtpInput value={code} onChange={setCode} />

          {/* Resend row */}
          <TouchableOpacity
            style={styles.resendBadge}
            onPress={handleResend}
            disabled={!expired}
            activeOpacity={expired ? 0.75 : 1}
          >
            <Text style={styles.resendIcon}>⏱</Text>
            <Text style={[styles.resendText, expired && styles.resendTextActive]}>
              {expired ? 'Resend code now' : `Resend code in ${label}`}
            </Text>
          </TouchableOpacity>

          {/* Primary button */}
          <TouchableOpacity
            style={[styles.btnPrimary, !isComplete && styles.btnDisabled]}
            onPress={handleVerify}
            activeOpacity={0.85}
            disabled={!isComplete}
          >
            <Text style={styles.btnPrimaryText}>Verify Identity  ✓</Text>
          </TouchableOpacity>

          {/* Secondary button */}
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handleNotReceived}
            activeOpacity={0.75}
          >
            <Text style={styles.btnSecondaryText}>I didn't receive a code</Text>
          </TouchableOpacity>

          {/* Security card */}
          <SecurityCard />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const CIRCLE = width * 0.52;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: C.bg,
  },
  headerBtn: { width: 36, alignItems: 'center' },
  headerArrow: { fontSize: 22, color: C.headerIcon },
  headerGear: { fontSize: 20, color: C.headerIcon },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },

  // Scroll
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },

  // Hero
  heroWrapper: {
    marginBottom: 28,
    alignItems: 'center',
  },
  heroCircle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mountain3: {
    position: 'absolute',
    bottom: -10,
    left: -20,
    width: CIRCLE * 1.1,
    height: CIRCLE * 0.6,
    borderTopLeftRadius: CIRCLE * 0.5,
    borderTopRightRadius: CIRCLE * 0.3,
    backgroundColor: '#3D6B55',
    opacity: 0.9,
  },
  mountain2: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    width: CIRCLE * 0.9,
    height: CIRCLE * 0.5,
    borderTopLeftRadius: CIRCLE * 0.4,
    borderTopRightRadius: CIRCLE * 0.5,
    backgroundColor: '#5A8570',
    opacity: 0.85,
  },
  mountain1: {
    position: 'absolute',
    bottom: -6,
    left: CIRCLE * 0.05,
    width: CIRCLE * 0.9,
    height: CIRCLE * 0.38,
    borderTopLeftRadius: CIRCLE * 0.6,
    borderTopRightRadius: CIRCLE * 0.35,
    backgroundColor: '#7AA68A',
    opacity: 0.75,
  },
  shieldOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  shieldInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: { fontSize: 22 },

  // Title
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: C.title,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: C.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // OTP
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },
  otpCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  otpCellEmpty: {
    backgroundColor: C.inputBg,
    borderColor: C.inputBorder,
  },
  otpCellFilled: {
    backgroundColor: C.inputBg,
    borderColor: C.inputBorderFilled,
  },
  otpInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    opacity: 1,
    borderRadius: 50,
  },
  otpDot: {
    fontSize: 18,
    color: C.placeholder,
    pointerEvents: 'none',
  },

  // Resend
  resendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.resendBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 28,
    gap: 6,
  },
  resendIcon: { fontSize: 13, color: C.resendIcon },
  resendText: { fontSize: 13, color: C.resendText, fontWeight: '500' },
  resendTextActive: { fontWeight: '700' },

  // Buttons
  btnPrimary: {
    width: '100%',
    backgroundColor: C.btnPrimary,
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: C.btnPrimary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: {
    color: C.btnPrimaryText,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnSecondary: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: C.btnSecondaryBorder,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: C.white,
  },
  btnSecondaryText: {
    color: C.btnSecondaryText,
    fontSize: 15,
    fontWeight: '500',
  },

  // Security card
  secCard: {
    width: '100%',
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  secIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E2D8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  secIconEmoji: { fontSize: 20 },
  secText: { flex: 1 },
  secTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.cardTitle,
    marginBottom: 6,
  },
  secBody: {
    fontSize: 13,
    color: C.cardBody,
    lineHeight: 19,
  },
});