import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { nutritionColors as c, nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  percentage: number;
  intake: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
};

export function WaterCircle({
  percentage,
  intake,
  goal,
  size = 220,
  strokeWidth = 14,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const innerSize = size - strokeWidth * 2 - 4;
  const innerOffset = strokeWidth + 2;

  const progress = useSharedValue(0);
  const wavePhase = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(100, percentage)), {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, progress]);

  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [wavePhase]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference,
  }));

  const fillStyle = useAnimatedStyle(() => ({
    height: `${progress.value}%`,
  }));

  const wavePath = useDerivedValue(() => {
    const phase = wavePhase.value * 8;
    return `M0,10 C30,${0 + phase} 70,${20 - phase} 100,10 C130,${0 + phase} 170,${20 - phase} 200,10 L200,20 L0,20 Z`;
  });

  const waveProps = useAnimatedProps(() => ({
    d: wavePath.value,
  }));

  return (
    <View style={[s.wrap, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-90deg' }] }]}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={w.track}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={w.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={ringProps}
        />
        <Circle cx={size / 2} cy={strokeWidth / 2} r={6} fill={w.highlight} />
      </Svg>

      <View
        style={[
          s.inner,
          {
            width: innerSize,
            height: innerSize,
            top: innerOffset,
            left: innerOffset,
            borderRadius: innerSize / 2,
          },
        ]}
      >
        <View style={[s.innerBg, { backgroundColor: w.tint }]} />
        <Animated.View style={[s.fill, fillStyle]}>
          <LinearGradient
            colors={[w.wave, w.primary, w.primaryDeep]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Svg
            viewBox="0 0 200 20"
            width="100%"
            height={20}
            preserveAspectRatio="none"
            style={s.waveSvg}
          >
            <AnimatedPath fill={w.wave} animatedProps={waveProps} />
          </Svg>
        </Animated.View>
      </View>

      <View style={s.center} pointerEvents="none">
        <Text style={s.label}>Today&apos;s Intake</Text>
        <View style={s.valueRow}>
          <Text style={s.value}>{intake.toLocaleString()}</Text>
          <Text style={s.unit}>ml</Text>
        </View>
        <Text style={s.goal}>Goal: {goal.toLocaleString()} ml</Text>
      </View>

      <View style={s.badgeWrap} pointerEvents="none">
        <LinearGradient
          colors={[w.primaryLight, w.primary]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={s.badge}
        >
          <Text style={s.badgeText}>{percentage}%</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    position: 'absolute',
    overflow: 'hidden',
  },
  innerBg: { ...StyleSheet.absoluteFillObject },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
  waveSvg: {
    position: 'absolute',
    top: -16,
    left: 0,
    right: 0,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: f.body,
    fontSize: 11,
    color: w.textHint,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  value: {
    fontFamily: f.displayBold,
    fontSize: 36,
    lineHeight: 36,
    color: w.textStrong,
    letterSpacing: -1,
  },
  unit: {
    fontFamily: f.bodyMed,
    fontSize: 14,
    color: w.textMuted,
    marginBottom: 4,
  },
  goal: {
    fontFamily: f.body,
    fontSize: 11,
    color: w.textHint,
    marginTop: 4,
  },
  badgeWrap: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    shadowColor: c.textDark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: f.bodyBold,
    fontSize: 13,
  },
});
