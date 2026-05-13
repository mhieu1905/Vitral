import { router } from "expo-router";
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  ClipPath,
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#F2EDE8',
  headerGreen: '#8FAF7E',
  logoDot: '#FFFFFF',
  title: '#2C1A0E',
  label: '#2C1A0E',
  inputBg: '#FFFFFF',
  inputBorder: '#E0D8D0',
  inputBorderError: '#D4756A',
  inputErrorBg: '#FAF0EE',
  inputText: '#2C1A0E',
  placeholder: '#B0A49A',
  errorText: '#C0544A',
  btn: '#3B2314',
  btnText: '#F2EDE8',
  signInLabel: '#2C1A0E',
  signInLink: '#8B5E3C',
  icon: '#8B7A6E',
};

// ─── Wave Header ──────────────────────────────────────────────────────────────
function WaveHeader() {
  return (
    <View style={styles.headerContainer}>
      {/* Green background with wave cutout at bottom */}
      <View style={styles.greenBg}>
        {/* 4-dot logo */}
        <View style={styles.logoWrap}>
          <View style={[styles.dot, { top: 0, left: 10 }]} />
          <View style={[styles.dot, { bottom: 0, left: 10 }]} />
          <View style={[styles.dot, { top: 10, left: 0 }]} />
          <View style={[styles.dot, { top: 10, right: 0 }]} />
        </View>
      </View>
      {/* Wave SVG */}
      <Svg
        width={width}
        height={48}
        viewBox={`0 0 ${width} 48`}
        style={styles.wave}
      >
        <Path
          d={`M0,0 Q${width * 0.25},48 ${width * 0.5},24 Q${width * 0.75},0 ${width},24 L${width},0 Z`}
          fill={C.headerGreen}
        />
      </Svg>
    </View>
  );
}

// ─── Email Icon ───────────────────────────────────────────────────────────────
function EmailIcon({ color = C.icon }: { color?: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M16 12 C16 14.5 17 17 19.5 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Lock Icon ────────────────────────────────────────────────────────────────
function LockIcon({ color = C.icon }: { color?: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

// ─── Warning Icon ─────────────────────────────────────────────────────────────
function WarningIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke={C.errorText}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 9v4M12 17h.01" stroke={C.errorText} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Eye Icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ visible, color = C.icon }: { visible: boolean; color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.8" />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
        </>
      ) : (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M1 1l22 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

// ─── Sign Up Screen ───────────────────────────────────────────────────────────
export default function SignUpScreen({
  onSignUp,
  onSignIn,
}: {
  onSignUp?: (email: string, password: string) => void;
  onSignIn?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState(true); // shown by default to match design
  const [touched, setTouched] = useState(false);

  // Animations
  const formAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(formAnim, {
      toValue: 1,
      friction: 7,
      tension: 50,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched) setEmailError(!validateEmail(val));
  };

  const handleEmailBlur = () => {
    setTouched(true);
    setEmailError(!validateEmail(email));
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    setTouched(true);
    const valid = validateEmail(email);
    setEmailError(!valid);

    if (!valid) { shake(); return; }
    if (password !== confirmPassword || password.length < 6) { shake(); return; }

    onSignUp?.(email, password);

    router.replace("/(auth)/login");
  };

  const formStyle = {
    opacity: formAnim,
    transform: [
      {
        translateY: formAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [32, 0],
        }),
      },
    ],
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={C.headerGreen} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Wave header */}
        <WaveHeader />

        {/* Form */}
        <Animated.View style={[styles.form, formStyle]}>
          <Text style={styles.title}>Sign Up For Free</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <Animated.View style={{ transform: [{ translateX: errorShake }] }}>
              <View
                style={[
                  styles.inputRow,
                  emailError && touched && styles.inputRowError,
                ]}
              >
                <View style={styles.inputIcon}>
                  <EmailIcon color={emailError && touched ? C.inputBorderError : C.icon} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email..."
                  placeholderTextColor={C.placeholder}
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {/* Error message */}
              {emailError && touched && (
                <View style={styles.errorRow}>
                  <WarningIcon />
                  <Text style={styles.errorText}>Invalid Email Address!!!</Text>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your password..."
                placeholderTextColor={C.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(v => !v)}
                activeOpacity={0.7}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Confirmation */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password Confirmation</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password..."
                placeholderTextColor={C.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirm(v => !v)}
                activeOpacity={0.7}
              >
                <EyeIcon visible={showConfirm} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Sign Up</Text>
            <Text style={styles.btnArrow}>→</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <View style={styles.signInRow}>
            <Text style={styles.signInLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
              <Text style={styles.signInLink}>Sign In.</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const HEADER_HEIGHT = 140;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: C.bg,
  },
  // ── Header
  headerContainer: {
    width: '100%',
    marginBottom: 8,
  },
  greenBg: {
    width: '100%',
    height: HEADER_HEIGHT,
    backgroundColor: C.headerGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    marginTop: -1,
  },
  logoWrap: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.logoDot,
    opacity: 0.92,
  },
  // ── Form
  form: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 0,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: C.title,
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '600',
    color: C.label,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBg,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    paddingHorizontal: 14,
    height: 54,
  },
  inputRowError: {
    borderColor: C.inputBorderError,
    backgroundColor: '#FDF6F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.inputText,
    fontFamily: 'Georgia',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputErrorBg,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#EAC5C0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    color: C.errorText,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  // ── Button
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.btn,
    borderRadius: 50,
    paddingVertical: 18,
    marginTop: 24,
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
  // ── Sign In
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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