import { Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  quote: string;
};

export function SelectDayHelperCard({ quote }: Props) {
  return (
    <View style={s.card}>
      <View style={s.blur} pointerEvents="none" />
      <Sparkles size={26} color={c.sageDark} strokeWidth={1.8} />
      <Text style={s.quote}>{quote}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,241,233,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 40,
    paddingTop: 49,
    paddingBottom: 33,
    paddingHorizontal: 33,
    alignItems: 'center',
    overflow: 'hidden',
  },
  blur: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 128,
    height: 128,
    borderRadius: 999,
    backgroundColor: 'rgba(75,101,70,0.05)',
  },
  quote: {
    marginTop: 16,
    fontFamily: f.displayMed,
    fontStyle: 'italic',
    fontSize: 15,
    color: 'rgba(33,26,22,0.8)',
    lineHeight: 24.38,
    textAlign: 'center',
    maxWidth: 240,
  },
});
