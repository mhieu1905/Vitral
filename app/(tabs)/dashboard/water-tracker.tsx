import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import BottomNav from '@/components/bottom-nav';
import { Droplets, Plus } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, ClipPath, Rect, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const IS_COMPACT = height < 820;
const BOTTLE_WIDTH = IS_COMPACT ? 118 : 132;
const BOTTLE_HEIGHT = IS_COMPACT ? 248 : 280;

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3027',
  textMuted: '#6B5C52',
  sage: '#4C6647',
  rose: '#F8E4D9',
  waterTop: '#A5C0E5',
  waterBottom: '#5A7391',
  pillBg: '#F1EBE5',
};

export default function HydrationPage() {
  const percentage = 0.6;
  const waterHeight = BOTTLE_HEIGHT * percentage;
  const waterPath = `M0 14 C ${BOTTLE_WIDTH * 0.25} 0, ${BOTTLE_WIDTH * 0.75} 28, ${BOTTLE_WIDTH} 14 V ${BOTTLE_HEIGHT} H 0 Z`;
  const bottleRadius = BOTTLE_WIDTH / 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} scrollEnabled={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hydration</Text>
        <Text style={styles.subtitle}>Stay fluid, stay mindful.</Text>
      </View>

      {/* Central Bottle Visualization */}
      <View style={styles.bottleSection}>
        <View style={[styles.bottleWrapper, { width: BOTTLE_WIDTH, height: BOTTLE_HEIGHT }]}>
          <Svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} viewBox={`0 0 ${BOTTLE_WIDTH} ${BOTTLE_HEIGHT}`}>
            <Defs>
              <LinearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={COLORS.waterTop} />
                <Stop offset="1" stopColor={COLORS.waterBottom} />
              </LinearGradient>
              <ClipPath id="pillClip">
                <Rect x="0" y="0" width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} rx={bottleRadius} ry={bottleRadius} />
              </ClipPath>
            </Defs>

            {/* Bottle Background/Border */}
            <Rect 
              x="2" y="2" width={BOTTLE_WIDTH - 4} height={BOTTLE_HEIGHT - 4} rx={bottleRadius - 2} ry={bottleRadius - 2}
              fill="white" stroke="#F1EBE5" strokeWidth="1" 
            />

            {/* Water Fill with Wave */}
            <G clipPath="url(#pillClip)">
              <G transform={`translate(0, ${BOTTLE_HEIGHT - waterHeight})`}>
                <Path 
                  d={waterPath}
                  fill="url(#waterGradient)" 
                />
              </G>
            </G>
          </Svg>
          
          {/* Percentage Overlay */}
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>60%</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.amountRow}>
          <Text style={styles.currentAmount}>1500</Text>
          <Text style={styles.goalAmount}> / 2500ml</Text>
        </View>
        
        <View style={styles.badge}>
          <Droplets color={COLORS.textDark} size={14} style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>4 glasses to go</Text>
        </View>
      </View>

      {/* Action Cards */}
      <View style={styles.cardsRow}>
        <TouchableOpacity activeOpacity={0.9} style={styles.addCardRose}>
          <Text style={styles.addValueDark}>+250ml</Text>
          <Text style={styles.addLabelDark}>SMALL CUP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={0.9} style={styles.addCardSage}>
          <Text style={styles.addValueLight}>+500ml</Text>
          <Text style={styles.addLabelLight}>LARGE BOTTLE</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Action */}
      <TouchableOpacity activeOpacity={0.8} style={styles.customButton}>
        <View style={styles.plusCircle}>
          <Plus color={COLORS.textDark} size={20} />
        </View>
        <Text style={styles.customButtonText}>Add Custom Amount</Text>
      </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, paddingBottom: 24, paddingTop: IS_COMPACT ? 18 : 26, paddingHorizontal: 24 },
  header: { marginBottom: IS_COMPACT ? 18 : 24 },
  title: { fontSize: IS_COMPACT ? 30 : 34, fontWeight: '700', color: COLORS.textDark, letterSpacing: -0.6 },
  subtitle: { fontSize: IS_COMPACT ? 14 : 15, fontWeight: '500', color: COLORS.textMuted, marginTop: 2 },
  
  bottleSection: { alignItems: 'center', marginBottom: IS_COMPACT ? 18 : 24 },
  bottleWrapper: { alignItems: 'center', justifyContent: 'center' },
  percentageContainer: { position: 'absolute', zIndex: 10 },
  percentageText: { fontSize: IS_COMPACT ? 44 : 48, fontWeight: '700', color: COLORS.textDark, opacity: 0.82 },
  
  statsSection: { alignItems: 'center', marginBottom: IS_COMPACT ? 24 : 28 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  currentAmount: { fontSize: IS_COMPACT ? 40 : 44, fontWeight: '700', color: COLORS.textDark },
  goalAmount: { fontSize: IS_COMPACT ? 20 : 22, fontWeight: '500', color: COLORS.textMuted },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.pillBg, 
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24 
  },
  badgeText: { fontSize: 13, fontWeight: '600', color: COLORS.textDark, opacity: 0.7 },
  
  cardsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  addCardRose: { flex: 1, backgroundColor: COLORS.rose, borderRadius: 24, paddingVertical: IS_COMPACT ? 18 : 22, paddingHorizontal: 16, alignItems: 'center', gap: 6 },
  addCardSage: { flex: 1, backgroundColor: COLORS.sage, borderRadius: 24, paddingVertical: IS_COMPACT ? 18 : 22, paddingHorizontal: 16, alignItems: 'center', gap: 6 },
  addValueDark: { fontSize: IS_COMPACT ? 22 : 24, fontWeight: '700', color: COLORS.textDark },
  addLabelDark: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  addValueLight: { fontSize: IS_COMPACT ? 22 : 24, fontWeight: '700', color: '#FFFFFF' },
  addLabelLight: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  
  customButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.5, 
    borderColor: 'rgba(61, 48, 39, 0.15)', 
    borderRadius: 24,
    paddingVertical: IS_COMPACT ? 14 : 16,
    gap: 12
  },
  plusCircle: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: COLORS.textDark, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  customButtonText: { fontSize: IS_COMPACT ? 17 : 18, fontWeight: '600', color: COLORS.textDark },
});
