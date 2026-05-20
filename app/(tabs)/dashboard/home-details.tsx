import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import BottomNav from '@/components/bottom-nav';
import { Layout, Activity, Utensils, Heart, User, Footprints, Flame, Moon, Droplets } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3027',
  textMuted: '#6B5C52',
  sage: '#4C6647',
  sageBg: 'rgba(205, 235, 196, 0.3)',
  rose: '#7B5556',
  surfaceLow: '#FFF1E9',
  authorText: '#88776D',
};

export default function ActivityDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Large Circular Goal Section */}
        <View style={styles.goalSection}>
          <View style={styles.circularContainer}>
            {/* Outer Ring (Sage - 72%) */}
            <Svg width="256" height="256" viewBox="0 0 100 100" style={styles.svgAbsolute}>
              <Circle cx="50" cy="50" r="44" stroke="rgba(76, 102, 71, 0.1)" strokeWidth="5" fill="none" />
              <Circle cx="50" cy="50" r="44" stroke={COLORS.sage} strokeWidth="5" 
                strokeDasharray="276.5" strokeDashoffset={276.5 * (1 - 0.72)} strokeLinecap="round" fill="none" />
            </Svg>
            
            {/* Inner Ring (Rose - 45%) */}
            <Svg width="256" height="256" viewBox="0 0 100 100" style={styles.svgAbsolute}>
              <Circle cx="50" cy="50" r="36" stroke="rgba(123, 85, 86, 0.1)" strokeWidth="4" fill="none" />
              <Circle cx="50" cy="50" r="36" stroke={COLORS.rose} strokeWidth="4" 
                strokeDasharray="226.2" strokeDashoffset={226.2 * (1 - 0.45)} strokeLinecap="round" fill="none" />
            </Svg>

            <View style={styles.goalTextContainer}>
              <Text style={styles.goalPercentage}>72%</Text>
              <Text style={styles.goalLabel}>Daily Goal</Text>
            </View>
          </View>

          <Text style={styles.quoteText}>
            "Balance is not something you find, it's something you create."
          </Text>
        </View>

        {/* Activity Grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <ActivityCard icon={Footprints} label="STEPS" value="8,432" percentage="78%" />
            <ActivityCard icon={Flame} label="CALORIES" value="1,240" percentage="42%" />
          </View>
          <View style={styles.row}>
            <ActivityCard icon={Moon} label="SLEEP" value="7h 20m" percentage="92%" />
            <ActivityCard icon={Droplets} label="WATER" value="1.8 L" percentage="65%" />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
          <BottomNav />
    </SafeAreaView>
  );
}

type ActivityCardProps = {
  icon: React.ComponentType<{ color?: string; size?: number; fill?: string }>;
  label: string;
  value: string;
  percentage: string;
};

function ActivityCard({ icon: Icon, label, value, percentage }: ActivityCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconBox}>
          <Icon color={COLORS.sage} size={20} />
        </View>
        <Text style={styles.cardPercentage}>{percentage}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

type NavIconProps = {
  icon: React.ComponentType<{ color?: string; size?: number; fill?: string }>;
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
  content: { paddingBottom: 120, paddingTop: 40 },
  goalSection: { alignItems: 'center', paddingHorizontal: 40, marginBottom: 48 },
  circularContainer: { width: 256, height: 256, alignItems: 'center', justifyContent: 'center' },
  svgAbsolute: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  goalTextContainer: { alignItems: 'center' },
  goalPercentage: { fontFamily: 'Plus Jakarta Sans', fontSize: 48, fontWeight: '700', color: COLORS.textDark },
  goalLabel: { fontFamily: 'DM Sans', fontSize: 18, fontWeight: '500', color: COLORS.textMuted },
  quoteText: { fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontStyle: 'italic', fontWeight: '500', textAlign: 'center', color: COLORS.textDark, opacity: 0.8, marginTop: 40, lineHeight: 28 },
  grid: { paddingHorizontal: 24, gap: 16 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  card: { flex: 1, backgroundColor: COLORS.surfaceLow, borderRadius: 24, padding: 20, height: 160, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIconBox: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardPercentage: { fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '700', color: COLORS.textMuted, opacity: 0.6 },
  cardFooter: { gap: 4 },
  cardLabel: { fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, opacity: 0.8 },
  cardValue: { fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: '700', color: COLORS.textDark },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.8)', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  navItem: { alignItems: 'center', gap: 4 },
  navIconBox: { padding: 8, borderRadius: 12 },
  navIconBoxActive: { backgroundColor: COLORS.sageBg },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#88776D' },
  navLabelActive: { color: COLORS.sage },
});