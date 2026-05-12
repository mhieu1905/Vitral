import { Pressable, StyleSheet, Text } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  shortLabel: string;
  dayNumber: string;
  active?: boolean;
  onPress?: () => void;
};

export function WeekDayChip({ shortLabel, dayNumber, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.chip, active && s.chipActive, pressed && { opacity: 0.85 }]}
    >
      <Text style={[s.short, active && s.shortActive]}>{shortLabel}</Text>
      <Text style={[s.number, active && s.numberActive]}>{dayNumber}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chip: {
    width: 56,
    height: 80,
    borderRadius: 16,
    backgroundColor: c.cardCream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  chipActive: {
    backgroundColor: c.sageDark,
    shadowColor: c.sageDark,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 6,
  },
  short: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textDim,
    letterSpacing: 0.55,
    lineHeight: 17,
  },
  shortActive: { color: '#FFFFFF' },
  number: {
    fontFamily: f.displayBold,
    fontSize: 18,
    color: c.textDim,
    lineHeight: 28,
    marginTop: 4,
  },
  numberActive: { color: '#FFFFFF' },
});
