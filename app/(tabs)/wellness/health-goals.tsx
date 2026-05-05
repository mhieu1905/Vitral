import BottomNav from '@/components/bottom-nav';
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

const ECOSYSTEM = [
  {
    id: 'apple',
    name: 'Apple Health',
    status: 'Syncs steps & heart rate',
    emoji: '❤️',
    bg: '#FFE8E8',
    connected: true,
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    status: 'Last synced 2h ago',
    emoji: '⌚',
    bg: '#E8F0FF',
    connected: false,
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    status: 'Not connected',
    emoji: '💍',
    bg: '#FFF3E0',
    connected: null,
  },
];

type EcoState = Record<string, boolean>;

export default function HealthGoalsScreen() {
  const router = useRouter();
  const [ecoToggles, setEcoToggles] = useState<EcoState>({
    apple: true,
    garmin: false,
  });

  const toggleEco = (id: string) => {
    setEcoToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your health data and goals have been updated!');
  };

  const handleDiscard = () => {
    Alert.alert('Discard Changes', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => router.back() },
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.pageTitle}>Health Data & Goals</Text>
          <Text style={styles.pageSub}>
            Refine your physical metrics and set intentions for your daily vitality.
          </Text>
        </View>

        {/* ── Physical Metrics ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>Physical Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLbl}>WEIGHT</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricVal}>68.5</Text>
                <Text style={styles.metricUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLbl}>HEIGHT</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricVal}>174</Text>
                <Text style={styles.metricUnit}>cm</Text>
              </View>
            </View>
          </View>

          <View style={styles.bmiRow}>
            <View style={styles.bmiInfo}>
              <Text style={styles.bmiLabel}>BMI Calculation</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={styles.bmiVal}>22.6</Text>
                <Text style={styles.bmiStatus}>Normal</Text>
              </View>
            </View>
            <View style={styles.bmiBarWrap}>
              <View style={styles.bmiBar} />
            </View>
          </View>
        </View>

        {/* ── Daily Calorie Goal ── */}
        <View style={styles.calorieCard}>
          <View style={styles.calDeco} />
          <View style={styles.calHeader}>
            <Text style={styles.calIcon}>⚡</Text>
            <Text style={styles.calTitle}>Daily Calorie Goal</Text>
          </View>
          <Text style={styles.calNumber}>2,150</Text>
          <Text style={styles.calUnit}>Calories / Day</Text>
          <View style={styles.calBtnRow}>
            <TouchableOpacity style={styles.calBtn}>
              <Text style={styles.calBtnText}>Adjust Target</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calInfoBtn}>
              <Text style={styles.calInfoText}>ℹ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Connect Ecosystem ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>✳️</Text>
            <Text style={styles.cardTitle}>Connect Ecosystem</Text>
          </View>

          {ECOSYSTEM.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.ecoItem,
                idx < ECOSYSTEM.length - 1 && styles.ecoItemBorder,
              ]}
            >
              <View style={[styles.ecoIcon, { backgroundColor: item.bg }]}>
                <Text style={styles.ecoEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.ecoInfo}>
                <Text style={styles.ecoName}>{item.name}</Text>
                <Text style={styles.ecoStatus}>{item.status}</Text>
              </View>

              {/* Toggle or Add button */}
              {item.connected !== null ? (
                <TouchableOpacity
                  style={[styles.toggle, ecoToggles[item.id] && styles.toggleOn]}
                  onPress={() => toggleEco(item.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      ecoToggles[item.id] && styles.toggleThumbOn,
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* ── Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerArch} />
          <Text style={styles.bannerWatermark}>SAF E WOR</Text>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTag}>
              <Text style={styles.bannerTagText}>MINDFULNESS</Text>
            </View>
            <Text style={styles.bannerQuote}>
              Small steps lead to{'\n'}great sanctuaries.
            </Text>
          </View>
        </View>

        {/* Footer note */}
        <Text style={styles.footerNote}>
          Your data is stored locally and encrypted. We never share your health metrics without permission.
        </Text>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save{'\n'}Changes</Text>
        </TouchableOpacity>
      </View>
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
  },
  menuIconBtn: { padding: 4 },
  menuLine: {
    width: 18, height: 2,
    backgroundColor: '#2C5F2E', borderRadius: 2, marginVertical: 2,
  },
  topBarTitle: { fontSize: 15, fontWeight: '700', color: '#2C5F2E' },
  avatarSm: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#4A9B8E', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },

  scroll: { paddingBottom: 24 },

  hero: { paddingHorizontal: 18, paddingVertical: 10 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#1A2010', marginBottom: 6 },
  pageSub: { fontSize: 13, color: '#7A8070', lineHeight: 18 },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 14, padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardIcon: { fontSize: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A2010' },

  metricsGrid: { flexDirection: 'row', gap: 16, marginBottom: 14 },
  metricBox: { flex: 1 },
  metricLbl: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.8, marginBottom: 4 },
  metricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricVal: { fontSize: 28, fontWeight: '800', color: '#1A2010' },
  metricUnit: { fontSize: 13, color: '#9A9A8E' },

  bmiRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#F0EDE7',
  },
  bmiInfo: {},
  bmiLabel: { fontSize: 11, color: '#9A9A8E', marginBottom: 2 },
  bmiVal: { fontSize: 16, fontWeight: '700', color: '#1A2010' },
  bmiStatus: { fontSize: 12, color: '#4A7C59' },
  bmiBarWrap: {
    flex: 1, height: 6, backgroundColor: '#E8E4DC', borderRadius: 3, overflow: 'hidden',
  },
  bmiBar: { width: '55%', height: '100%', backgroundColor: '#4A7C59', borderRadius: 3 },

  calorieCard: {
    backgroundColor: '#3A5A2A', borderRadius: 20,
    marginHorizontal: 16, marginBottom: 14, padding: 20, overflow: 'hidden',
  },
  calDeco: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.04)', right: -20, bottom: -20,
  },
  calHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  calIcon: { fontSize: 16 },
  calTitle: { fontSize: 13, fontWeight: '600', color: '#A8C898' },
  calNumber: { fontSize: 46, fontWeight: '800', color: '#fff', lineHeight: 52 },
  calUnit: { fontSize: 13, color: '#A8C898', marginBottom: 18 },
  calBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calBtn: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  calBtnText: { fontSize: 13, fontWeight: '700', color: '#3A5A2A' },
  calInfoBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  calInfoText: { color: '#fff', fontSize: 16 },

  ecoItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12,
  },
  ecoItemBorder: { borderBottomWidth: 0.5, borderBottomColor: '#F0EDE7' },
  ecoIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  ecoEmoji: { fontSize: 20 },
  ecoInfo: { flex: 1 },
  ecoName: { fontSize: 13, fontWeight: '600', color: '#1A2010', marginBottom: 2 },
  ecoStatus: { fontSize: 11, color: '#9A9A8E' },

  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: '#D0CCC4', justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: '#4A7C59' },
  toggleThumb: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },

  addBtn: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#D0CCC4',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 18, color: '#9A9A8E', lineHeight: 22 },

  banner: {
    marginHorizontal: 16, marginBottom: 14,
    borderRadius: 20, height: 140,
    backgroundColor: '#B8D4CE', overflow: 'hidden',
    justifyContent: 'flex-end', padding: 14,
  },
  bannerArch: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 30,
    backgroundColor: '#8EC4BC', borderBottomLeftRadius: 200, borderBottomRightRadius: 200,
  },
  bannerWatermark: {
    position: 'absolute', top: 10, left: 10,
    fontSize: 30, fontWeight: '900',
    color: 'rgba(255,255,255,0.22)', letterSpacing: -1,
  },
  bannerContent: { position: 'relative', zIndex: 2 },
  bannerTag: {
    backgroundColor: '#E8B86A', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 6,
  },
  bannerTagText: { fontSize: 9, fontWeight: '800', color: '#7A5A20', letterSpacing: 0.5 },
  bannerQuote: { fontSize: 15, fontWeight: '800', color: '#fff', lineHeight: 20 },

  footerNote: {
    fontSize: 11, color: '#9A9A8E',
    textAlign: 'center', paddingHorizontal: 24,
    marginBottom: 8, lineHeight: 16,
  },

  bottomBar: {
    flexDirection: 'row', gap: 12,
    padding: 12, paddingHorizontal: 16,
    borderTopWidth: 0.5, borderTopColor: '#EAE7E0',
    backgroundColor: '#F5F3EF',
  },
  discardBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 28,
    borderWidth: 1.5, borderColor: '#D0CCC4',
    alignItems: 'center', justifyContent: 'center',
  },
  discardText: { fontSize: 14, fontWeight: '600', color: '#5A5A50' },
  saveBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 28,
    backgroundColor: '#3A5A2A',
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' },
});