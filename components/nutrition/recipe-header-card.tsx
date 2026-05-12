import { StyleSheet, Text, View } from 'react-native';

import { TagPill } from './tag-pill';
import type { RecipeStatItem, RecipeTagTone } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  title: string;
  tags: { label: string; tone: RecipeTagTone }[];
  stats: RecipeStatItem[];
};

export function RecipeHeaderCard({ title, tags, stats }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.title}>{title}</Text>

      <View style={s.tagWrap}>
        {tags.map((t) => (
          <TagPill key={t.label} label={t.label} tone={t.tone} />
        ))}
      </View>

      <View style={s.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <View key={stat.label} style={s.statCell}>
              <Icon size={20} color={c.pink} strokeWidth={1.8} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: c.card,
    borderRadius: 24,
    padding: 32,
    gap: 16,
    shadowColor: '#3D3530',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: f.displayBold,
    fontSize: 28,
    color: c.textDark,
    letterSpacing: -0.7,
    lineHeight: 36,
  },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  statsGrid: {
    flexDirection: 'row',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: c.cardPeach,
    gap: 16,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statValue: {
    marginTop: 8,
    fontFamily: f.displaySemi,
    fontSize: 17,
    color: c.textDark,
    lineHeight: 25.5,
  },
  statLabel: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textDim,
    lineHeight: 16.5,
  },
});
