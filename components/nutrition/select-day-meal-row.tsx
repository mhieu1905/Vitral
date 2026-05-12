import { CheckCircle2, ChevronRight, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SelectDayMealSlot } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  slot: SelectDayMealSlot;
  onPress?: () => void;
};

export function SelectDayMealRow({ slot, onPress }: Props) {
  const Icon = slot.icon;

  if (slot.status === 'planned') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [s.active, pressed && { opacity: 0.9 }]}
      >
        <View style={s.accentWrap} pointerEvents="none">
          <View style={s.accent} />
        </View>
        <View style={[s.iconBox, s.iconBoxActive]}>
          <Icon size={22} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={s.info}>
          <Text style={s.titleActive}>{slot.title}</Text>
          <Text style={s.metaActive}>{slot.meta}</Text>
        </View>
        <ChevronRight size={16} color={c.sageDark} strokeWidth={2.5} />
      </Pressable>
    );
  }

  if (slot.status === 'logged') {
    return (
      <View style={s.logged}>
        <View style={[s.iconBox, s.iconBoxLogged]}>
          <Icon size={22} color={c.sageDark} strokeWidth={1.8} />
        </View>
        <View style={s.info}>
          <Text style={s.title}>{slot.title}</Text>
          <Text style={s.meta}>{slot.meta}</Text>
        </View>
        <View style={s.pill}>
          <CheckCircle2 size={12} color={c.sageDark} strokeWidth={2} />
          <Text style={s.pillText}>LOGGED</Text>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.pending, pressed && { opacity: 0.9 }]}
    >
      <View style={[s.iconBox, s.iconBoxPending]}>
        <Icon size={20} color={c.textMuted} strokeWidth={1.8} />
      </View>
      <View style={s.info}>
        <Text style={s.titlePending}>{slot.title}</Text>
        <Text style={s.metaPending}>{slot.meta}</Text>
      </View>
      <View style={s.addBtn}>
        <Plus size={14} color={c.sageDark} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  logged: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 32,
    padding: 21,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  active: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75,101,70,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(75,101,70,0.2)',
    borderRadius: 32,
    padding: 22,
    shadowColor: c.sageDark,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 6,
  },
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,248,245,0.4)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(195,200,190,0.7)',
    borderRadius: 32,
    padding: 21,
  },
  accentWrap: {
    position: 'absolute',
    left: -4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  accent: {
    width: 8,
    height: 48,
    borderRadius: 999,
    backgroundColor: c.sageDark,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  iconBoxLogged: { backgroundColor: c.cardCream },
  iconBoxActive: {
    backgroundColor: c.sageDark,
    shadowColor: c.sageDark,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 6,
  },
  iconBoxPending: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  info: { flex: 1 },
  title: { fontFamily: f.displayBold, fontSize: 15, color: c.textDark, lineHeight: 22.5 },
  titleActive: { fontFamily: f.displayBold, fontSize: 15, color: c.textDark, lineHeight: 22.5 },
  titlePending: {
    fontFamily: f.displaySemi,
    fontSize: 15,
    color: 'rgba(33,26,22,0.6)',
    lineHeight: 22.5,
  },
  meta: {
    fontFamily: f.displayMed,
    fontSize: 12,
    color: 'rgba(67,72,64,0.7)',
    letterSpacing: 0.3,
    lineHeight: 18,
    marginTop: 2,
  },
  metaActive: {
    fontFamily: f.displayBold,
    fontSize: 12,
    color: c.sageDark,
    letterSpacing: 0.3,
    lineHeight: 18,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  metaPending: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: 'rgba(67,72,64,0.5)',
    letterSpacing: 0.275,
    lineHeight: 16.5,
    marginTop: 2,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(75,101,70,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(75,101,70,0.05)',
  },
  pillText: {
    fontFamily: f.displayBold,
    fontSize: 11,
    color: c.sageDark,
    letterSpacing: 0.55,
    lineHeight: 16.5,
  },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(195,200,190,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
});
