import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { HydrationHistoryDay } from '@/constants/nutrition';
import { nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

type Props = {
  data: HydrationHistoryDay[];
  goal: number;
  todayValue?: number;
  height?: number;
};

export function HydrationChart({ data, goal, todayValue, height = 96 }: Props) {
  const rows = data.map((d) =>
    d.isToday && todayValue !== undefined ? { ...d, value: todayValue } : d,
  );

  return (
    <View style={[s.row, { height }]}>
      {rows.map((item) => (
        <Bar key={item.day} item={item} goal={goal} maxHeight={height} />
      ))}
    </View>
  );
}

function Bar({
  item,
  goal,
  maxHeight,
}: {
  item: HydrationHistoryDay;
  goal: number;
  maxHeight: number;
}) {
  const target = Math.min(Math.max((item.value / goal) * 100, 4), 100);
  const grow = useSharedValue(0);

  useEffect(() => {
    grow.value = withTiming(target, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [grow, target]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${grow.value}%`,
  }));

  return (
    <View style={s.col}>
      <View style={[s.barTrack, { height: maxHeight - 18 }]}>
        <Animated.View style={[s.bar, barStyle]}>
          {item.isToday ? (
            <LinearGradient
              colors={[w.primaryLight, w.primaryDeep]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: w.trackSoft }]} />
          )}
        </Animated.View>
      </View>
      <Text style={[s.day, { color: item.isToday ? w.primary : w.textHint }]}>
        {item.day}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  col: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  day: {
    fontFamily: f.bodyMed,
    fontSize: 10,
  },
});
