import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  monthLabel: string;
  dateLabel: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function SelectDayHeader({ monthLabel, dateLabel, onPrev, onNext }: Props) {
  return (
    <View style={s.section}>
      <View style={s.row}>
        <Pressable style={s.chev} hitSlop={12} onPress={onPrev}>
          <ChevronLeft size={18} color={c.sageDark} strokeWidth={2.5} />
        </Pressable>
        <View style={s.center}>
          <Text style={s.month}>{monthLabel}</Text>
          <Text style={s.date}>{dateLabel}</Text>
        </View>
        <Pressable style={s.chev} hitSlop={12} onPress={onNext}>
          <ChevronRight size={18} color={c.sageDark} strokeWidth={2.5} />
        </Pressable>
      </View>
      <View style={s.divider} />
    </View>
  );
}

const s = StyleSheet.create({
  section: { alignItems: 'center', paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  chev: { padding: 4 },
  center: { alignItems: 'center' },
  month: {
    fontFamily: f.displayBold,
    fontSize: 11,
    color: c.sageDark,
    letterSpacing: 2.2,
    lineHeight: 17,
    textAlign: 'center',
  },
  date: {
    fontFamily: f.displayBold,
    fontSize: 30,
    color: c.sageDark,
    letterSpacing: -0.75,
    lineHeight: 36,
    marginTop: 4,
  },
  divider: {
    width: 32,
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(75,101,70,0.2)',
    marginTop: 12,
  },
});
