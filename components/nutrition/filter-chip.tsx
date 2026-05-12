import { Pressable, StyleSheet, Text } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        active ? s.chipActive : s.chipIdle,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[s.label, active && s.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(195,200,190,0.3)',
  },
  chipActive: {
    backgroundColor: c.sageDark,
  },
  label: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textDim,
    lineHeight: 16.5,
  },
  labelActive: { color: '#FFFFFF' },
});
