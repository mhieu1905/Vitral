import BottomNav from '@/components/bottom-nav';
import { Cloud, Droplets, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3027',
  textMuted: '#6B5C52',
  sage: '#4C6647',
  sageBg: 'rgba(205, 235, 196, 0.3)',
  sageText: '#40593C',
  sageSub: '#486244',
  rose: '#7B5556',
  surfaceLow: '#FFF1E9',
  blue: '#4E607C',
};

export default function WeeklyReportPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateLabel}>OCT 23 - OCT 29</Text>
        <Text style={styles.title}>Weekly Report</Text>
      </View>

      {/* Main Chart Card */}
      <View style={styles.chartCard}>
        {/* Stylized Bar Chart */}
        <View style={styles.barChartContainer}>
          <ChartBar day="M" height={48} color="rgba(76, 102, 71, 0.2)" />
          <ChartBar day="T" height={102} color={COLORS.sage} active />
          <ChartBar day="W" height={78} color="rgba(76, 102, 71, 0.4)" />
          <ChartBar day="T" height={36} color="rgba(123, 85, 86, 0.4)" />
          <ChartBar day="F" height={66} color="rgba(76, 102, 71, 0.2)" />
          <ChartBar day="S" height={90} color="rgba(76, 102, 71, 0.6)" />
          <ChartBar day="S" height={72} color="rgba(76, 102, 71, 0.3)" />
        </View>

        <Text style={styles.chartSummary}>
          Your wellness score improved by <Text style={styles.boldSage}>12%</Text> compared to last week. You're maintaining a steady rhythm.
        </Text>
      </View>

      {/* Insights Row */}
      <View style={styles.row}>
        <TouchableOpacity activeOpacity={0.9} style={styles.insightCardSage}>
          <View style={styles.insightIconBox}>
            <Sun color={COLORS.sage} size={20} />
          </View>
          <View style={styles.insightTextContainer}>
            <Text style={styles.insightLabelSage}>Best Day</Text>
            <Text style={styles.insightValueSage}>Tuesday</Text>
            <Text style={styles.insightSubSage}>Peak energy levels & focus</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} style={styles.insightCardRose}>
          <View style={styles.insightIconBox}>
            <Cloud color={COLORS.rose} size={20} />
          </View>
          <View style={styles.insightTextContainer}>
            <Text style={styles.insightLabelRose}>Lowest Day</Text>
            <Text style={styles.insightValueRose}>Thursday</Text>
            <Text style={styles.insightSubRose}>Rest needed after a busy start</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Editorial Insight Card */}
      <TouchableOpacity activeOpacity={0.9} style={styles.editorialCard}>
        <Image 
          source={{ uri: 'https://picsum.photos/seed/meditation/800/600' }} 
          style={styles.editorialImage}
        />
        <View style={styles.editorialOverlay} />
        <View style={styles.editorialContent}>
          <Text style={styles.editorialTag}>EDITORIAL INSIGHT</Text>
          <Text style={styles.editorialTitle}>The Power of Quiet Observation</Text>
          <Text style={styles.editorialSub}>
            Learn how Tuesday's mindfulness session contributed to your highest focus score thi...
          </Text>
        </View>
      </TouchableOpacity>

      {/* Metric List */}
      <View style={styles.metricList}>
        <MetricItem icon={Moon} label="Sleep Quality" value="7h 45m average" change="+5%" color={COLORS.blue} />
        <MetricItem icon={Droplets} label="Hydration" value="2.1L average" change="+2%" color={COLORS.sage} />
      </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function ChartBar({ day, height, color, active = false }: { day: string, height: number, color: string, active?: boolean }) {
  return (
    <View style={styles.barWrapper}>
      <View style={styles.barOuter}>
        <View style={[styles.barShadow, { height: height + 10 }]} />
        <View style={[styles.barInner, { height, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barDay, active && styles.barDayActive]}>{day}</Text>
    </View>
  );
}

type MetricItemProps = {
  icon: React.ComponentType<{ color?: string; size?: number; fill?: string }>;
  label: string;
  value: string;
  change: string;
  color: string;
};

function MetricItem({ icon: Icon, label, value, change, color }: MetricItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.metricItem}>
      <View style={styles.metricLeft}>
        <View style={styles.metricIconBox}>
          <Icon color={COLORS.textDark + '99'} size={18} />
        </View>
        <View>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={styles.metricValue}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.metricChange, { color }]}>{change}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 160, paddingTop: 60, paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  dateLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, opacity: 0.6, letterSpacing: 2 },
  title: { fontSize: 40, fontWeight: '700', color: COLORS.textDark, marginTop: 4 },
  chartCard: { backgroundColor: COLORS.surfaceLow, borderRadius: 32, padding: 32, gap: 32 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barWrapper: { alignItems: 'center', width: 32, gap: 12 },
  barOuter: { width: '100%', height: 120, justifyContent: 'flex-end', alignItems: 'center' },
  barShadow: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 16 },
  barInner: { width: '100%', borderRadius: 16 },
  barDay: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, opacity: 0.6 },
  barDayActive: { color: COLORS.textDark, opacity: 1 },
  chartSummary: { fontSize: 14, color: COLORS.textDark, opacity: 0.8, lineHeight: 22 },
  boldSage: { color: COLORS.sage, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 16, marginTop: 16 },
  insightCardSage: { flex: 1, backgroundColor: COLORS.sageBg, borderRadius: 24, padding: 24, gap: 16 },
  insightCardRose: { flex: 1, backgroundColor: 'rgba(255, 218, 217, 0.2)', borderRadius: 24, padding: 24, gap: 16 },
  insightIconBox: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  insightTextContainer: { gap: 4 },
  insightLabelSage: { fontSize: 10, fontWeight: '700', color: COLORS.sageText, opacity: 0.6 },
  insightValueSage: { fontSize: 18, fontWeight: '700', color: COLORS.sageText },
  insightSubSage: { fontSize: 10, color: COLORS.sageSub },
  insightLabelRose: { fontSize: 10, fontWeight: '700', color: COLORS.rose, opacity: 0.6 },
  insightValueRose: { fontSize: 18, fontWeight: '700', color: COLORS.rose },
  insightSubRose: { fontSize: 10, color: COLORS.rose, opacity: 0.8 },
  editorialCard: { height: 240, borderRadius: 32, overflow: 'hidden', marginTop: 16, justifyContent: 'flex-end', padding: 32 },
  editorialImage: { ...StyleSheet.absoluteFillObject },
  editorialOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 26, 47, 0.6)' },
  editorialContent: { gap: 12 },
  editorialTag: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  editorialTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  editorialSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  metricList: { marginTop: 16, gap: 12 },
  metricItem: { backgroundColor: 'rgba(255, 241, 233, 0.5)', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metricIconBox: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  metricLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  metricValue: { fontSize: 10, color: COLORS.textMuted },
  metricChange: { fontSize: 12, fontWeight: '700' },
});
