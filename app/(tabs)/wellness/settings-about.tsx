import BottomNav from '@/components/bottom-nav';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Theme = 'light' | 'dark';

export default function AppearanceScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState(16);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuIconBtn}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>The Sanctuary</Text>
        <View style={styles.avatarSm}>
          <Text style={styles.avatarEmoji}>🧑‍💼</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSub}>Personalize your space of calm.</Text>
        </View>

        {/* ── APPEARANCE ── */}
        <Text style={styles.sectionLbl}>APPEARANCE</Text>

        {/* Light Mode Card */}
        <TouchableOpacity
          style={[styles.themeCard, styles.lightCard, theme === 'light' && styles.cardSelected]}
          onPress={() => setTheme('light')}
          activeOpacity={0.85}
        >
          <View style={[styles.radio, theme === 'light' && styles.radioChecked]}>
            {theme === 'light' && <View style={styles.radioDot} />}
          </View>
          <View style={[styles.themeIconBox, styles.themeIconLight]}>
            <Text style={styles.themeIconEmoji}>☀️</Text>
          </View>
          <Text style={styles.themeName}>Light Mode</Text>
          <Text style={styles.themeDesc}>Soft, natural illumination</Text>
        </TouchableOpacity>

        {/* Dark Mode Card */}
        <TouchableOpacity
          style={[styles.themeCard, styles.darkCard, theme === 'dark' && styles.cardSelected]}
          onPress={() => setTheme('dark')}
          activeOpacity={0.85}
        >
          <View style={[styles.radio, theme === 'dark' && styles.radioChecked]}>
            {theme === 'dark' && <View style={styles.radioDot} />}
          </View>
          <View style={[styles.themeIconBox, styles.themeIconDark]}>
            <Text style={styles.themeIconEmoji}>🌙</Text>
          </View>
          <Text style={styles.themeName}>Dark Mode</Text>
          <Text style={styles.themeDesc}>Deep, restful contrast</Text>
        </TouchableOpacity>

        {/* ── TYPOGRAPHY ── */}
        <Text style={styles.sectionLbl}>TYPOGRAPHY</Text>

        <View style={styles.typoCard}>
          <View style={styles.typoRow}>
            <Text style={styles.typoSmA}>A</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor="#4A7C59"
              maximumTrackTintColor="#D0CCC4"
              thumbTintColor="#4A7C59"
            />
            <Text style={styles.typoBigA}>A</Text>
          </View>
          <Text style={styles.typoHint}>Adjust font size for comfortable reading</Text>
        </View>

        {/* ── COMMUNITY & APP ── */}
        <Text style={styles.sectionLbl}>COMMUNITY & APP</Text>

        <View style={styles.communityCard}>
          <TouchableOpacity style={[styles.menuRow, styles.menuRowBorder]}>
            <View style={[styles.menuRowIcon, { backgroundColor: '#FFF3CC' }]}>
              <Text style={styles.menuRowEmoji}>💬</Text>
            </View>
            <Text style={styles.menuRowLbl}>Send Feedback</Text>
            <Text style={styles.menuArr}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow}>
            <View style={[styles.menuRowIcon, { backgroundColor: '#FFE8E8' }]}>
              <Text style={styles.menuRowEmoji}>⭐</Text>
            </View>
            <Text style={styles.menuRowLbl}>Rate App</Text>
            <Text style={styles.menuArr}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerLogoEmoji}>🌿</Text>
          </View>
          <Text style={styles.footerName}>The Sanctuary</Text>
          <Text style={styles.footerVer}>Version 2.4.0 (Emerald)</Text>

          {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity> */}

          <Text style={styles.footerTiny}>Made with mindfulness in the ethereal atrium.</Text>
        </View>
      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
            <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EF' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#EAE7E0',
  },
  menuIconBtn: { padding: 4, gap: 4, justifyContent: 'center' },
  menuLine: { width: 18, height: 2, backgroundColor: '#2C5F2E', borderRadius: 2, marginVertical: 2 },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#2C5F2E' },
  avatarSm: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#4A9B8E', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },

  scroll: { paddingBottom: 32 },

  hero: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#1A2010', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#8A8A7E' },

  sectionLbl: {
    fontSize: 11, fontWeight: '800', color: '#5A5A50',
    letterSpacing: 1, paddingHorizontal: 18,
    paddingTop: 20, paddingBottom: 10,
  },

  themeCard: {
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: 'transparent',
  },
  lightCard: { backgroundColor: '#C8E6C0' },
  darkCard: { backgroundColor: '#F5F3EF', borderColor: '#E0DDD8' },
  cardSelected: { borderColor: '#4A7C59' },

  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#AAAAAA',
    position: 'absolute', top: 14, right: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  radioChecked: { borderColor: '#4A7C59' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4A7C59' },

  themeIconBox: {
    width: 42, height: 42, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  themeIconLight: { backgroundColor: '#fff' },
  themeIconDark: { backgroundColor: '#1A2010' },
  themeIconEmoji: { fontSize: 22 },
  themeName: { fontSize: 16, fontWeight: '700', color: '#1A2010', marginBottom: 2 },
  themeDesc: { fontSize: 12, color: '#6B7060' },

  typoCard: {
    marginHorizontal: 16, marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
  },
  typoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  typoSmA: { fontSize: 13, fontWeight: '600', color: '#9A9A8E', width: 16 },
  typoBigA: { fontSize: 24, fontWeight: '700', color: '#1A2010', width: 28, textAlign: 'right' },
  slider: { flex: 1, height: 32 },
  typoHint: { fontSize: 11, color: '#9A9A8E', textAlign: 'center' },

  communityCard: {
    marginHorizontal: 16, marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#F0EDE7' },
  menuRowIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  menuRowEmoji: { fontSize: 17 },
  menuRowLbl: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1A2010' },
  menuArr: { fontSize: 18, color: '#BBBBBB' },

  footer: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 24 },
  footerLogo: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#3A5A30', alignItems: 'center',
    justifyContent: 'center', marginBottom: 10,
  },
  footerLogoEmoji: { fontSize: 26 },
  footerName: { fontSize: 17, fontWeight: '700', color: '#1A2010', marginBottom: 2 },
  footerVer: { fontSize: 12, color: '#9A9A8E', marginBottom: 18 },
  logoutBtn: {
    width: '100%', backgroundColor: '#D4624A',
    borderRadius: 28, paddingVertical: 15,
    alignItems: 'center', marginBottom: 12,
  },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  footerTiny: { fontSize: 11, color: '#BBBBBB', textAlign: 'center' },
});