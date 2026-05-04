import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import { BarChart2, Droplets, Home, Moon, Quote, Smile } from 'lucide-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3027',
  textMuted: '#6B5C52',
  sage: '#4C6647',
  sageText: '#40593C',
  sageSub: '#486244',
  sageBg: 'rgba(205, 235, 196, 0.3)',
  weeklyBg: '#FFF1E9',
  weeklyText: '#3D4F6A',
  sleepBg: 'rgba(255, 218, 217, 0.2)',
  sleepText: '#6D4849',
  rose: '#7B5556',
  waterBg: '#F8E4D9',
  blue: '#4E607C',
  quoteText: '#3D3027',
  authorText: '#88776D',
};

export default function WellnessDashboard() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Welcoming Header */}
        <View style={styles.header}>
          <Text style={styles.heading1}>Welcome back, Elena</Text>
          <Text style={styles.subHeading}>Find your center in every moment.</Text>
        </View>

        {/* Bento Grid Hub */}
        <View style={styles.bentoGrid}>
          
          {/* Home Dashboard (Bento Large) */}
          <TouchableOpacity activeOpacity={0.9} style={styles.homeCard} onPress={() => router.push('/dashboard/home-details')}>
            <View style={styles.homeCardLeft}>
              <View style={styles.iconCircle}>
                <Home color={COLORS.sage} size={20} />
              </View>
              <View style={styles.homeTextContainer}>
                <Text style={styles.homeTitle}>Home Dashboard</Text>
                <Text style={styles.homeSub}>You've completed 4 of 6 daily intentions.</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Svg width="78" height="78" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="45" stroke="rgba(76, 102, 71, 0.1)" strokeWidth="8" fill="none" />
                <Circle cx="50" cy="50" r="45" stroke={COLORS.sage} strokeWidth="8" 
                  strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.66)} strokeLinecap="round" fill="none" />
              </Svg>
              <Text style={styles.progressText}>66%</Text>
            </View>
          </TouchableOpacity>

          {/* Two Column Layout */}
          <View style={styles.row}>
            {/* Weekly Report */}
            <TouchableOpacity activeOpacity={0.9} style={styles.weeklyCard} onPress={() => router.push('/dashboard/week-report')}>
              <BarChart2 color={COLORS.blue} size={18} />
              <Text style={styles.cardTitle}>Weekly Report</Text>
              <Text style={styles.weeklySub}>+12% vs last week</Text>
              <View style={styles.barChart}>
                {[24, 36, 48, 32, 24].map((h, i) => (
                  <View key={i} style={[styles.bar, { height: h, backgroundColor: i === 2 ? COLORS.blue : COLORS.blue + '33' }]} />
                ))}
              </View>
            </TouchableOpacity>

            {/* Sleep Tracker */}
            <TouchableOpacity activeOpacity={0.9} style={styles.sleepCard} onPress={() => router.push('/dashboard/sleep-tracker')}>
              <Moon color={COLORS.rose} size={20} />
              <Text style={styles.cardTitle}>Sleep Tracker</Text>
              <Text style={styles.sleepSub}>Excellent Sleep</Text>
              <Text style={styles.sleepValue}>7h 42m</Text>
            </TouchableOpacity>
          </View>

          {/* Water Intake */}
          <TouchableOpacity activeOpacity={0.9} style={styles.waterCard} onPress={() => router.push('/dashboard/water-tracker')}>
            <View style={styles.waterLeft}>
              <View style={styles.waterIconBox}>
                <Droplets color={COLORS.blue} size={16} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Water Intake</Text>
                <Text style={styles.waterSub}>65% Hydrated</Text>
              </View>
            </View>
            <View style={styles.waterBars}>
              {[1, 1, 1, 0.2, 0.2].map((op, i) => (
                <View key={i} style={[styles.waterBar, { opacity: op }]} />
              ))}
            </View>
          </TouchableOpacity>

          {/* Mood Tracker */}
          <TouchableOpacity activeOpacity={0.9} style={styles.moodCard} onPress={() => router.push('/dashboard/mood-tracker')}>
            <View style={styles.moodBgOverlay} />
            <View style={styles.moodHeader}>
              <Smile color={COLORS.rose} size={25} />
              <View style={styles.tag}>
                <Text style={styles.tagText}>DAILY CHECK-IN</Text>
              </View>
            </View>
            <View>
              <Text style={styles.moodTitle}>Mood Tracker</Text>
              <Text style={styles.moodSub}>Currently feeling: Calm & Creative</Text>
            </View>
          </TouchableOpacity>

          {/* Quote Card */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteIconBox}>
              <Quote color="#EAFFE2" size={14} fill="#EAFFE2" />
            </View>
            <Text style={styles.quoteText}>
              "The soul usually knows what to do to heal itself. The challenge is to silence the mind."
            </Text>
            <Text style={styles.authorText}>CAROLINE MYSS</Text>
          </View>

        </View>
      </ScrollView>
      {/* Bottom Nav */}
        <BottomNav />
    </SafeAreaView>
  );
}

type NavIconProps = {
  icon: React.ComponentType<{
    color?: string;
    size?: number;
    fill?: string;
  }>; 
  label: string;
  active?: boolean;
};

function NavIcon({ icon: Icon, label, active = false }: NavIconProps) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <View style={[styles.navIconBox, active && styles.navIconBoxActive]}>
        <Icon color={active ? COLORS.sage : COLORS.authorText} size={20} />
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  header: { paddingHorizontal: 24, paddingTop: 40, marginBottom: 24 },
  heading1: { fontFamily: 'DM Sans', fontSize: 32, fontWeight: '600', color: '#3D3027', letterSpacing: -0.8 },
  subHeading: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '500', color: '#6B5C52', opacity: 0.8, marginTop: 8 },
  bentoGrid: { paddingHorizontal: 24, gap: 16 },
  homeCard: { backgroundColor: COLORS.sageBg, borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  homeCardLeft: { gap: 16 },
  iconCircle: { width: 48, height: 48, backgroundColor: 'rgba(76, 102, 71, 0.1)', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  homeTextContainer: { gap: 4 },
  homeTitle: { fontFamily: 'DM Sans', fontSize: 20, fontWeight: '600', color: '#40593C' },
  homeSub: { fontFamily: 'DM Sans', fontSize: 14, color: '#486244', maxWidth: 190 },
  progressContainer: { alignItems: 'center', justifyContent: 'center' },
  progressText: { position: 'absolute', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '700', color: COLORS.sage },
  row: { flexDirection: 'row', gap: 16 },
  weeklyCard: { flex: 1.2, backgroundColor: COLORS.weeklyBg, borderRadius: 24, padding: 20, paddingBottom: 30, gap: 4 },
  sleepCard: { flex: 0.8, backgroundColor: COLORS.sleepBg, borderRadius: 24, padding: 20, gap: 4, borderWidth: 1, borderColor: 'rgba(123, 85, 86, 0.05)' },
  cardTitle: { fontFamily: 'DM Sans', fontSize: 16, fontWeight: '600', color: '#3D3027' },
  weeklySub: { fontFamily: 'DM Sans', fontSize: 12, fontWeight: '500', color: '#3D4F6A' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 60, paddingTop: 12 },
  bar: { width: 8, borderRadius: 4 },
  sleepSub: { fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#6D4849' },
  sleepValue: { fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: '700', color: COLORS.rose, marginTop: 12 },
  waterCard: { backgroundColor: COLORS.waterBg, borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  waterIconBox: { width: 48, height: 48, backgroundColor: 'rgba(78, 96, 124, 0.1)', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  waterSub: { fontFamily: 'DM Sans', fontSize: 14, color: '#3D4F6A' },
  waterBars: { flexDirection: 'row', gap: 4 },
  waterBar: { width: 8, height: 24, backgroundColor: COLORS.blue, borderRadius: 4 },
  moodCard: { height: 160, borderRadius: 24, padding: 24, justifyContent: 'space-between', overflow: 'hidden' },
  moodBgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E8A68E', opacity: 0.4 },
  moodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { backgroundColor: 'rgba(255, 248, 245, 0.8)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  tagText: { fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: '700', color: COLORS.rose, letterSpacing: 0.5 },
  moodTitle: { fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: '700', color: '#3D3027' },
  moodSub: { fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '500', color: '#6B5C52' },
  quoteCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 40, paddingTop: 40, paddingBottom: 32, alignItems: 'center', marginTop: 16 },
  quoteIconBox: { position: 'absolute', top: -16, width: 32, height: 32, backgroundColor: COLORS.sage, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quoteText: { fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontStyle: 'italic', fontWeight: '500', textAlign: 'center', color: '#3D3027', lineHeight: 29 },
  authorText: { fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '700', color: '#88776D', letterSpacing: 2.4, marginTop: 16 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.background, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopLeftRadius: 32, borderTopRightRadius: 32, elevation: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: -2 }, shadowRadius: 8, borderTopWidth: 0 },
  navItem: { alignItems: 'center', gap: 4 },
  navIconBox: { padding: 8, borderRadius: 12 },
  navIconBoxActive: { backgroundColor: COLORS.sageBg },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#88776D' },
  navLabelActive: { color: COLORS.sage },
});