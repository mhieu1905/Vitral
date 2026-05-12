import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { nutritionColors as c, nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

type Props = {
  amounts: readonly number[];
  onSelect: (amount: number) => void;
  onCustom: () => void;
};

export function WaterQuickAddRow({ amounts, onSelect, onCustom }: Props) {
  return (
    <View style={s.row}>
      {amounts.map((amt) => (
        <Pressable
          key={amt}
          onPress={() => onSelect(amt)}
          style={({ pressed }) => [s.tile, pressed && s.tilePressed]}
        >
          <Text style={s.tileText}>+{amt} ml</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={onCustom}
        style={({ pressed }) => [s.customWrap, pressed && s.customPressed]}
      >
        <LinearGradient
          colors={[w.primaryLight, w.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.customInner}
        >
          <Text style={s.customLabel}>Custom</Text>
          <Plus size={12} color="#FFFFFF" strokeWidth={2.5} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.textDark,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: w.border,
  },
  tilePressed: { transform: [{ scale: 0.97 }] },
  tileText: {
    fontFamily: f.bodyMed,
    fontSize: 14,
    color: w.textBody,
  },
  customWrap: {
    width: 64,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: c.textDark,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  customPressed: { transform: [{ scale: 0.97 }] },
  customInner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  customLabel: {
    color: '#FFFFFF',
    fontFamily: f.bodyBold,
    fontSize: 11,
  },
});
