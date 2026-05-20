import BottomNav from '@/components/bottom-nav';
import { getTodaySummary } from '@/services/activityService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function ActivitySummary() {
  const router = useRouter();

  const [summary, setSummary] = useState({
    total_calories: 0,
    total_duration: 0,
    activity_count: 0,
    activities: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await getTodaySummary();
      setSummary(data);
    } catch (e) {
      console.log('Error loading summary:', e);
    } finally {
      setLoading(false);
    }
  };

  // Tính phần trăm readiness dựa trên calories
  const readiness = Math.min(Math.round((summary.total_calories / 500) * 100), 100);

  // Format duration
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}`;
    return `${m}:00`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#39382F" />
          </TouchableOpacity>
          <Text style={styles.headline}>
            {summary.activity_count > 0 ? 'Incredible Work!' : 'Nothing happened today.!'}
          </Text>
          <Text style={styles.subheadline}>
            {summary.activity_count > 0
              ? `You've completed ${summary.activity_count} workout sessions today.`
              : 'Let\'s get you started with your first workout!'}
          </Text>
        </View>

        {/* Total Session Time */}
        <View style={styles.sessionSection}>
          <View style={styles.sessionTextContainer}>
            <Text style={styles.label}>TOTAL TIME TODAY</Text>
            <View style={styles.timeRow}>
              <Text style={styles.timeValue}>
                {loading ? '--' : formatDuration(summary.total_duration)}
              </Text>
              <Text style={styles.unitText}>min</Text>
            </View>
          </View>

          <View style={styles.timerCircle}>
            <View style={styles.timerInnerCircle}>
              <MaterialCommunityIcons name="run" size={32} color="#9a9080" />
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <MaterialCommunityIcons name="fire" size={20} color="#615E5B" />
              <Text style={styles.metricLabel}>CALORIES</Text>
            </View>
            <Text style={styles.metricValue}>
              {loading ? '--' : summary.total_calories}{' '}
              <Text style={styles.metricUnit}>kcal</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <MaterialCommunityIcons name="checkbox-multiple-marked" size={20} color="#615E5B" />
              <Text style={styles.metricLabel}>SESSIONS</Text>
            </View>
            <Text style={styles.metricValue}>
              {loading ? '--' : summary.activity_count}{' '}
              <Text style={styles.metricUnit}>sessions</Text>
            </Text>
          </View>
        </View>

        {/* Activities list */}
        {summary.activities.length > 0 && (
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Detail Today</Text>
            {summary.activities.map((activity: any, index: number) => (
              <View key={index} style={styles.activityRow}>
                <View style={styles.activityLeft}>
                  <View style={styles.activityIcon}>
                    <MaterialCommunityIcons name="run" size={20} color="#526148" />
                  </View>
                  <View>
                    <Text style={styles.activityName}>{activity.activity_type}</Text>
                    <Text style={styles.activitySub}>{activity.duration} minutes</Text>
                  </View>
                </View>
                <Text style={styles.activityCalories}>{activity.calories_burned} kcal</Text>
              </View>
            ))}
          </View>
        )}

        {/* Intensity Mapping */}
        <View style={styles.intensitySection}>
          <View style={styles.intensityHeader}>
            <View>
              <Text style={styles.sectionTitle}>Intensity Mapping</Text>
              <Text style={styles.sectionSubtitle}>Distribution across session phases</Text>
            </View>
            <MaterialCommunityIcons name="poll" size={24} color="#615E5B" />
          </View>
          <View style={styles.chartContainer}>
            {[60, 100, 140, 80, 120, 90, 50].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>START</Text>
            <Text style={styles.chartLabelText}>PEAK</Text>
            <Text style={styles.chartLabelText}>COOL</Text>
          </View>
        </View>

        {/* Recovery Forecast */}
        <View style={styles.recoveryCard}>
          <View style={styles.recoveryHeader}>
            <Text style={styles.recoveryTitle}>Recovery Forecast</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>LOW INFLAMMATION</Text>
            </View>
          </View>
          <Text style={styles.recoveryDesc}>
            Based on your activity today, your body is entering a state of rapid restoration.
            Optimal rest window: <Text style={{ fontWeight: '700' }}>7–9 hours.</Text>
          </Text>

          <View style={styles.readinessContainer}>
            <View style={styles.readinessHeader}>
              <Text style={styles.readinessLabel}>CURRENT READINESS</Text>
              <Text style={styles.readinessValue}>{readiness}% RESTORED</Text>
            </View>
            <View style={styles.readinessBarBg}>
              <View style={[styles.readinessBarFill, { width: `${readiness}%` }]} />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.logMoreButton}
          onPress={() => router.push('/activity_hub/log_type')}
        >
          <Feather name="plus" size={20} color="#526148" style={{ marginRight: 8 }} />
          <Text style={styles.logMoreButtonText}>Log Additional Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => router.replace('/activity_hub')}
        >
          <Text style={styles.finishButtonText}>Back to Home</Text>
          <Feather name="check-circle" size={20} color="#FDF9F3" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF9F3' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40 },
  backBtn: { marginBottom: 16 },
  header: { marginBottom: 40 },
  headline: {
    fontSize: 36, fontFamily: 'serif', fontWeight: '700',
    color: '#39382F', marginBottom: 8,
  },
  subheadline: { fontSize: 16, color: '#615E5B', lineHeight: 24 },
  sessionSection: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 40,
  },
  sessionTextContainer: { flex: 1 },
  label: {
    fontSize: 12, letterSpacing: 1.5, color: '#9a9080',
    fontWeight: '700', marginBottom: 8,
  },
  timeRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  timeValue: {
    fontSize: 64, fontFamily: 'serif', fontWeight: '700', color: '#39382F',
  },
  unitText: { fontSize: 24, fontFamily: 'serif', color: '#9a9080' },
  timerCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#F5F2EB', justifyContent: 'center', alignItems: 'center',
  },
  timerInnerCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FDF9F3', justifyContent: 'center', alignItems: 'center',
  },
  metricsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  metricCard: { flex: 1, backgroundColor: '#FFF7F2', borderRadius: 16, padding: 20 },
  metricCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  metricLabel: { fontSize: 10, letterSpacing: 1, color: '#615E5B', fontWeight: '700' },
  metricValue: { fontSize: 32, fontFamily: 'serif', fontWeight: '700', color: '#39382F' },
  metricUnit: { fontSize: 14, color: '#9a9080', fontWeight: '400' },

  // Activities list
  activitiesSection: { marginBottom: 32 },
  activityRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF7F2', borderRadius: 16, padding: 16, marginBottom: 8,
  },
  activityLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#A8C5A030', justifyContent: 'center', alignItems: 'center',
  },
  activityName: { fontSize: 16, fontWeight: '700', color: '#39382F' },
  activitySub: { fontSize: 13, color: '#9a9080' },
  activityCalories: { fontSize: 16, fontWeight: '700', color: '#526148' },

  // Intensity
  intensitySection: { marginBottom: 40 },
  intensityHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20, fontFamily: 'serif', fontWeight: '700',
    color: '#39382F', marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 14, color: '#9a9080' },
  chartContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', height: 140, paddingTop: 10,
  },
  bar: { width: 10, backgroundColor: '#EBE7DE', borderRadius: 5 },
  chartLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 12, paddingHorizontal: 4,
  },
  chartLabelText: {
    fontSize: 10, letterSpacing: 1, color: '#9a9080', fontWeight: '700',
  },

  // Recovery
  recoveryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    shadowColor: '#39382F', shadowOpacity: 0.04, shadowRadius: 15,
    elevation: 4, marginBottom: 24,
  },
  recoveryHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  recoveryTitle: {
    fontSize: 22, fontFamily: 'serif', fontWeight: '700', color: '#39382F',
  },
  tag: {
    backgroundColor: '#A8B79B20', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#A8B79B30',
  },
  tagText: { fontSize: 10, fontWeight: '700', color: '#607252', letterSpacing: 0.5 },
  recoveryDesc: { fontSize: 15, color: '#615E5B', lineHeight: 22, marginBottom: 24 },
  readinessContainer: { marginTop: 8 },
  readinessHeader: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
  },
  readinessLabel: { fontSize: 10, letterSpacing: 1, color: '#9a9080', fontWeight: '700' },
  readinessValue: { fontSize: 10, fontWeight: '700', color: '#39382F' },
  readinessBarBg: { height: 6, backgroundColor: '#F5F2EB', borderRadius: 3 },
  readinessBarFill: { height: '100%', backgroundColor: '#615E5B', borderRadius: 3 },

  // Buttons
  logMoreButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#526148', borderRadius: 12,
    paddingVertical: 16, marginBottom: 12,
  },
  logMoreButtonText: { color: '#526148', fontSize: 16, fontWeight: '700' },
  finishButton: {
    backgroundColor: '#526148', flexDirection: 'row', paddingVertical: 20,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#526148', shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  finishButtonText: { color: '#FDF9F3', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
});