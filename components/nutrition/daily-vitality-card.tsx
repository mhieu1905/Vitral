import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { MealPlanMacroTile, RecipeTagTone } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  kicker: string;
  consumedKcal: number;
  totalKcal: number;
  pct: number;
  macros: MealPlanMacroTile[];
};

const TONE_COLOR: Record<RecipeTagTone, string> = {
  sage: c.sageDark,
  pink: c.pink,
  blue: c.blue,
};

const RING_SIZE = 48;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export function DailyVitalityCard({
  kicker,
  consumedKcal,
  totalKcal,
  pct,
  macros,
}: Props) {
  const clampedPct = Math.max(0, Math.min(1, pct));
  const fill = useSharedValue(0); // 0..1 progress fill

  useEffect(() => {
    fill.value = withDelay(
      460,
      withTiming(clampedPct, {
        duration: 1100,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [fill, clampedPct]);

  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));
  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_CIRC * (1 - fill.value),
  }));

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View>
          <Text style={s.kicker}>{kicker}</Text>
          <View style={s.kcalRow}>
            <Text style={s.kcalValue}>{consumedKcal.toLocaleString()}</Text>
            <Text style={s.kcalUnit}>/ {totalKcal.toLocaleString()} kcal</Text>
          </View>
        </View>

        <View style={s.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke="rgba(168,197,160,0.25)"
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={c.sageDark}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={RING_CIRC}
              animatedProps={ringProps}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>
          <Text style={s.ringText}>{Math.round(clampedPct * 100)}%</Text>
        </View>
      </View>

      <View style={s.barTrack}>
        <Animated.View style={[s.barFillWrap, barStyle]}>
          <View style={s.barFill} />
        </Animated.View>
      </View>

      <View style={s.macroGrid}>
        {macros.map((m) => (
          <View key={m.id} style={s.macroTile}>
            <Text style={[s.macroLabel, { color: `${TONE_COLOR[m.tone]}99` }]}>{m.label}</Text>
            <Text style={s.macroValue}>{m.value}</Text>
            <View style={[s.macroBar, { backgroundColor: TONE_COLOR[m.tone] }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 40,
    padding: 28,
    gap: 26,
    shadowColor: '#3D3530',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 24,
    elevation: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  kicker: {
    fontFamily: f.displayBold,
    fontSize: 11,
    color: 'rgba(75,101,70,0.65)',
    letterSpacing: 1.8,
    lineHeight: 18,
  },
  kcalRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6, gap: 6 },
  kcalValue: {
    fontFamily: f.displayBold,
    fontSize: 32,
    color: c.textDark,
    letterSpacing: -1.4,
    lineHeight: 38,
  },
  kcalUnit: {
    fontFamily: f.displaySemi,
    fontSize: 15,
    color: c.textDim,
    lineHeight: 22,
    marginBottom: 4,
  },

  ringWrap: {
    width: RING_SIZE + 8,
    height: RING_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(168,197,160,0.2)',
    borderRadius: 999,
  },
  ringText: {
    position: 'absolute',
    fontFamily: f.displayBold,
    fontSize: 11,
    color: c.sageDark,
  },

  barTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: c.cardPeach,
    overflow: 'hidden',
    padding: 3,
  },
  barFillWrap: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    flex: 1,
    backgroundColor: c.sage,
    borderRadius: 999,
    shadowColor: c.sage,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },

  macroGrid: { flexDirection: 'row', gap: 12 },
  macroTile: {
    flex: 1,
    backgroundColor: 'rgba(255,241,233,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  macroLabel: {
    fontFamily: f.displayBold,
    fontSize: 10,
    letterSpacing: 1,
    lineHeight: 15,
  },
  macroValue: {
    fontFamily: f.displayBold,
    fontSize: 16,
    color: c.textDark,
    lineHeight: 22,
  },
  macroBar: {
    height: 4,
    width: 32,
    borderRadius: 999,
    opacity: 0.4,
  },
});
