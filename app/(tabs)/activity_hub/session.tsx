import BottomNav from '@/components/bottom-nav';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * FILE PATH: app/(tabs)/activity_hub/summary.tsx
 * ROLE: Session Complete Summary (Member 3)
 * 
 * FIXES:
 * 1. Corrected router import: Changed from a generated type path to 'expo-router'.
 * 2. Navigation Logic: The "View Session Summary" button now uses 'router.replace('/')' 
 *    to return to the Home/Transit screen (or '/activity_hub' for the detailed dashboard).
 * 3. Integrated 5-tab Navigation: Matches the overall project navigation set.
 */

const { width } = Dimensions.get('window');

export default function ActivitySummary() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.replace(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headline}>Incredible Work!</Text>
          <Text style={styles.subheadline}>Your sanctuary reflects your effort today.</Text>
        </View>

        {/* Total Session Time Section */}
        <View style={styles.sessionSection}>
          <View style={styles.sessionTextContainer}>
            <Text style={styles.label}>TOTAL SESSION TIME</Text>
            <View style={styles.timeRow}>
              <Text style={styles.timeValue}>54:12</Text>
              <Text style={styles.unitText}>min</Text>
            </View>
          </View>
          
          <View style={styles.timerCircle}>
            <View style={styles.timerInnerCircle}>
              <View style={styles.timerIndicator} />
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <MaterialCommunityIcons name="fire" size={20} color="#615E5B" />
              <Text style={styles.metricLabel}>ENERGY</Text>
            </View>
            <Text style={styles.metricValue}>642 <Text style={styles.metricUnit}>kcal</Text></Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <MaterialCommunityIcons name="heart-outline" size={20} color="#615E5B" />
              <Text style={styles.metricLabel}>AVERAGE HR</Text>
            </View>
            <Text style={styles.metricValue}>142 <Text style={styles.metricUnit}>bpm</Text></Text>
          </View>
        </View>

        {/* Intensity Mapping Section */}
        <View style={styles.intensitySection}>
          <View style={styles.intensityHeader}>
            <View>
              <Text style={styles.sectionTitle}>Intensity Mapping</Text>
              <Text style={styles.sectionSubtitle}>Distribution across session phases</Text>
            </View>
            <MaterialCommunityIcons name="poll" size={24} color="#615E5B" />
          </View>

          <View style={styles.chartContainer}>
            <Bar height={60} />
            <Bar height={100} />
            <Bar height={140} />
            <Bar height={80} />
            <Bar height={120} />
            <Bar height={90} />
            <Bar height={50} />
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>START</Text>
            <Text style={styles.chartLabelText}>PEAK</Text>
            <Text style={styles.chartLabelText}>COOL</Text>
          </View>
        </View>

        {/* Recovery Forecast Section */}
        <View style={styles.recoveryCard}>
          <View style={styles.recoveryHeader}>
            <Text style={styles.recoveryTitle}>Recovery Forecast</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>LOW INFLAMMATION</Text>
            </View>
          </View>
          <Text style={styles.recoveryDesc}>
            Based on your heart rate variability, your body is entering a state of rapid restoration. Optimal rest window: <Text style={{ fontWeight: '700' }}>7–9 hours.</Text>
          </Text>

          <View style={styles.readinessContainer}>
            <View style={styles.readinessHeader}>
              <Text style={styles.readinessLabel}>CURRENT READINESS</Text>
              <Text style={styles.readinessValue}>82% RESTORED</Text>
            </View>
            <View style={styles.readinessBarBg}>
              <View style={[styles.readinessBarFill, { width: '82%' }]} />
            </View>
          </View>
        </View>

        {/* Finish / Return Button */}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => navigateTo('/(tabs)/activity/home')}
        >
          <Text style={styles.finishButtonText}>Complete Session</Text>
          <Feather name="check-circle" size={20} color="#FDF9F3" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Navigation (5-Tab Set) */}
       <BottomNav/>
    </SafeAreaView>
  );
}

const Bar = ({ height }) => (
  <View style={[styles.bar, { height: height }]} />
);

const NavItem = ({ icon, label, active, onPress, type = 'ionicons' }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      {type === 'ionicons' ? (
        <MaterialCommunityIcons name={icon} size={22} color={active ? "#39382F" : "#9a9080"} />
      ) : (
        <MaterialCommunityIcons name={icon} size={22} color={active ? "#39382F" : "#9a9080"} />
      )}
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9F3",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  headline: {
    fontSize: 36,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 16,
    color: '#615E5B',
    lineHeight: 24,
  },
  sessionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#9a9080',
    fontWeight: '700',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeValue: {
    fontSize: 64,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  unitText: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#9a9080',
  },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDF9F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#EBE7DE',
    borderRadius: 2,
    position: 'absolute',
    top: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    borderRadius: 16,
    padding: 20,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#615E5B',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  metricUnit: {
    fontSize: 14,
    color: '#9a9080',
    fontWeight: '400',
  },
  intensitySection: {
    marginBottom: 40,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9a9080',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  bar: {
    width: 10,
    backgroundColor: '#EBE7DE',
    borderRadius: 5,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  chartLabelText: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#9a9080',
    fontWeight: '700',
  },
  recoveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#39382F',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 32,
  },
  recoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recoveryTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  tag: {
    backgroundColor: '#A8B79B20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A8B79B30',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#607252',
    letterSpacing: 0.5,
  },
  recoveryDesc: {
    fontSize: 15,
    color: '#615E5B',
    lineHeight: 22,
    marginBottom: 24,
  },
  readinessContainer: {
    marginTop: 8,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  readinessLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#9a9080',
    fontWeight: '700',
  },
  readinessValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#39382F',
  },
  readinessBarBg: {
    height: 6,
    backgroundColor: '#F5F2EB',
    borderRadius: 3,
  },
  readinessBarFill: {
    height: '100%',
    backgroundColor: '#615E5B',
    borderRadius: 3,
  },
  finishButton: {
    backgroundColor: '#526148',
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#526148',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  finishButtonText: {
    color: '#FDF9F3',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF9F3FA',
    paddingBottom: 34,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(57, 56, 47, 0.05)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: '#A8B79B30',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9a9080',
    textTransform: 'uppercase',
  },
  navTextActive: {
    color: '#39382F',
  },
});
