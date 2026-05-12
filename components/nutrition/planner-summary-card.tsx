import { StyleSheet, Text, View } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type MacroRow = {
  label: string;
  value: string;
  pct: number;
  barColor: string;
};

type Props = {
  targetKcal: number;
  plannedKcal: number;
  macros: readonly MacroRow[];
};

export function PlannerSummaryCard({ targetKcal, plannedKcal, macros }: Props) {
  return (
    <View style={s.card}>
      <View style={s.row}>
        <View>
          <Text style={s.kicker}>DAILY TARGET</Text>
          <View style={s.kcalRow}>
            <Text style={s.kcalValue}>{targetKcal.toLocaleString()}</Text>
            <Text style={s.kcalUnit}>kcal</Text>
          </View>
        </View>
        <View style={s.right}>
          <Text style={[s.kicker, s.kickerPlanned]}>PLANNED</Text>
          <View style={s.kcalRow}>
            <Text style={[s.kcalValue, s.kcalValuePlanned]}>{plannedKcal.toLocaleString()}</Text>
            <Text style={[s.kcalUnit, s.kcalUnitPlanned]}>kcal</Text>
          </View>
        </View>
      </View>

      <View style={s.macroList}>
        {macros.map((m) => (
          <View key={m.label} style={s.macroRow}>
            <Text style={s.macroLabel}>{m.label}</Text>
            <View style={s.macroTrack}>
              <View
                style={[
                  s.macroFill,
                  {
                    width: `${Math.min(Math.max(m.pct, 0), 1) * 100}%`,
                    backgroundColor: m.barColor,
                  },
                ]}
              />
            </View>
            <Text style={s.macroValue}>{m.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: 'rgba(115,121,112,0.1)',
    borderRadius: 24,
    padding: 21,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  right: { alignItems: 'flex-end' },
  kicker: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textMuted,
    letterSpacing: 1.1,
    lineHeight: 17,
  },
  kickerPlanned: { color: c.sageDark, textAlign: 'right' },
  kcalRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 },
  kcalValue: { fontFamily: f.displayBold, fontSize: 24, color: c.textDark, lineHeight: 32 },
  kcalValuePlanned: { color: c.sageDark },
  kcalUnit: {
    fontFamily: f.display,
    fontSize: 14,
    color: c.textMuted,
    lineHeight: 20,
    marginLeft: 4,
    marginBottom: 3,
  },
  kcalUnitPlanned: { color: 'rgba(75,101,70,0.6)' },

  macroList: { gap: 12 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  macroLabel: {
    width: 48,
    fontFamily: f.displaySemi,
    fontSize: 11,
    color: c.textDim,
    lineHeight: 17,
  },
  macroTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: c.cardCream,
    overflow: 'hidden',
  },
  macroFill: { height: '100%', borderRadius: 999 },
  macroValue: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textMuted,
    lineHeight: 17,
    minWidth: 64,
    textAlign: 'right',
  },
});
