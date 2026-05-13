import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Ellipse, Path, Svg } from "react-native-svg";

// --- Icon Components ---
const EmailIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#5A3E2B" strokeWidth="1.5" />
    <Path
      d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16"
      stroke="#5A3E2B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M16 8V12.5"
      stroke="#5A3E2B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 11V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V11"
      stroke="#5A3E2B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M5 11H19V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V11Z"
      stroke="#5A3E2B"
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="16" r="1.5" fill="#5A3E2B" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3L21 21"
      stroke="#9E8C80"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M10.58 10.58C10.22 10.94 10 11.44 10 12C10 13.1 10.9 14 12 14C12.56 14 13.06 13.78 13.42 13.42"
      stroke="#9E8C80"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M6.71 6.71C4.94 7.97 3.54 9.82 3 12C4.27 16.94 7.82 20 12 20C13.85 20 15.57 19.39 17.01 18.34"
      stroke="#9E8C80"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M9.88 4.13C10.58 3.95 11.28 3.86 12 3.86C16.18 3.86 19.73 6.92 21 11.86C20.76 12.79 20.41 13.67 19.96 14.47"
      stroke="#9E8C80"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const EyeIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12C4.27 7.06 7.82 4 12 4C16.18 4 19.73 7.06 21 12C19.73 16.94 16.18 20 12 20C7.82 20 4.27 16.94 3 12Z"
      stroke="#9E8C80"
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="12" r="3" stroke="#9E8C80" strokeWidth="1.5" />
  </Svg>
);

const FacebookIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 2H15C13.67 2 12.4 2.53 11.46 3.46C10.53 4.4 10 5.67 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73 14.1 6.47 14.29 6.29C14.47 6.1 14.73 6 15 6H18V2Z"
      stroke="#5A3E2B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.8 10.2H12V14H17.6C17.1 16.3 15 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.5 6 14.87 6.55 15.93 7.47L18.74 4.66C17 3.03 14.62 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 11.39 21.93 10.79 21.8 10.2Z"
      stroke="#5A3E2B"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);

const InstagramIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 2H8C4.69 2 2 4.69 2 8V16C2 19.31 4.69 22 8 22H16C19.31 22 22 19.31 22 16V8C22 4.69 19.31 2 16 2Z"
      stroke="#5A3E2B"
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="12" r="4" stroke="#5A3E2B" strokeWidth="1.5" />
    <Circle
      cx="17.5"
      cy="6.5"
      r="0.5"
      fill="#5A3E2B"
      stroke="#5A3E2B"
      strokeWidth="1"
    />
  </Svg>
);

// --- Flower Logo ---
const FlowerLogo = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Ellipse cx="24" cy="14" rx="8" ry="11" fill="white" opacity="0.9" />
    <Ellipse cx="24" cy="34" rx="8" ry="11" fill="white" opacity="0.9" />
    <Ellipse cx="14" cy="24" rx="11" ry="8" fill="white" opacity="0.9" />
    <Ellipse cx="34" cy="24" rx="11" ry="8" fill="white" opacity="0.9" />
    <Circle cx="24" cy="24" r="6" fill="white" />
  </Svg>
);

// --- Wave Header ---
const WaveHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.greenBackground}>
      <View style={styles.logoWrapper}>
        <FlowerLogo />
      </View>
    </View>
    <Svg
      width="100%"
      height="60"
      viewBox="0 0 375 60"
      preserveAspectRatio="none"
      style={styles.wave}
    >
      <Path
        d="M0 0 Q93.75 60 187.5 30 Q281.25 0 375 60 L375 0 L0 0 Z"
        fill="#8FAE88"
      />
    </Svg>
  </View>
);

// --- Main Screen ---
export default function LoginScreen() {
  const [email, setEmail] = useState("hellovitaltrack@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#8FAE88" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with wave */}
          <WaveHeader />

          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.appName}>Vital Track</Text>

            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}
              >
                <View style={styles.inputIcon}>
                  <EmailIcon />
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="your@email.com"
                  placeholderTextColor="#C4AFA6"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <View style={styles.inputIcon}>
                  <LockIcon />
                </View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password..."
                  placeholderTextColor="#C4AFA6"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              activeOpacity={0.85}
              onPress={() => router.push("/(onboarding)/goal-selection")}
            >
              <Text style={styles.signInText}>Sign In →</Text>
            </TouchableOpacity>

            {/* Social Login */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <FacebookIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <GoogleIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <InstagramIcon />
              </TouchableOpacity>
            </View>

            {/* Footer Links */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>

              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.footerLink}>Sign Up.</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotWrapper} onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.footerLink}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const CREAM = "#F5F0E8";
const GREEN = "#8FAE88";
const BROWN = "#2C1A0E";
const BROWN_BORDER = "#D4C5B5";
const BROWN_LIGHT = "#9E8C80";
const LINK_COLOR = "#A0785A";

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: GREEN,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: CREAM,
  },

  // --- Header ---
  headerContainer: {
    backgroundColor: GREEN,
    height: 180,
  },
  greenBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  logoWrapper: {
    marginTop: 10,
  },
  wave: {
    position: "absolute",
    bottom: 0,
  },

  // --- Content ---
  content: {
    flex: 1,
    backgroundColor: CREAM,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: BROWN,
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  appName: {
    fontSize: 30,
    fontWeight: "700",
    color: BROWN,
    textAlign: "center",
    letterSpacing: 0.3,
    marginBottom: 36,
    lineHeight: 36,
  },

  // --- Fields ---
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: BROWN,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFAF5",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BROWN_BORDER,
    paddingHorizontal: 14,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: BROWN,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },

  // --- Sign In Button ---
  signInButton: {
    backgroundColor: BROWN,
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 32,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // --- Social ---
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FDFAF5",
    borderWidth: 1.5,
    borderColor: BROWN_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Footer ---
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  footerText: {
    fontSize: 13,
    color: BROWN_LIGHT,
  },
  footerLink: {
    fontSize: 13,
    color: LINK_COLOR,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  forgotWrapper: {
    alignItems: "center",
  },
});
