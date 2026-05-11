import BottomNav from '@/components/bottom-nav';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RecoveryAndBiometrics() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION 1: RECOVERY SCORE --- */}
        <View style={styles.recoveryCard}>
          <View style={styles.recoveryHeader}>
            <View>
              <Text style={styles.label}>STATUS</Text>
              <Text style={styles.headline}>Recovery Score</Text>
            </View>
            <View style={styles.scoreCircle}>
               <Text style={styles.scoreValue}>85</Text>
            </View>
          </View>
          
          <Text style={styles.recoveryDesc}>
            Your body is well-rested. The balanced activity from yesterday has optimized your neural recovery tonight.
          </Text>

          <View style={styles.miniMetricsRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>STRAIN</Text>
              <Text style={styles.miniValue}>Moderate</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>SLEEP</Text>
              <Text style={styles.miniValue}>8h 12m</Text>
            </View>
          </View>
        </View>

        {/* --- SECTION 2: ACTIVITY TRENDS --- */}
        <View style={styles.trendsCard}>
          <View style={styles.trendsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Activity Trends</Text>
              <Text style={styles.sectionSubtitle}>Last 7 Days</Text>
            </View>
            <View style={styles.avgContainer}>
               <Text style={styles.avgValue}>2,480</Text>
               <Text style={styles.avgLabel}>AVG CALORIES</Text>
            </View>
          </View>

          {/* Bar Chart Placeholder */}
          <View style={styles.chartContainer}>
             <Bar height={40} />
             <Bar height={60} />
             <Bar height={50} />
             <Bar height={80} />
             <Bar height={70} />
             <Bar height={100} active />
          </View>
          <View style={styles.chartLabels}>
             <Text style={styles.dayText}>MON</Text>
             <Text style={styles.dayText}>TUE</Text>
             <Text style={styles.dayText}>WED</Text>
             <Text style={styles.dayText}>THU</Text>
             <Text style={styles.dayText}>FRI</Text>
             <Text style={styles.dayText}>SAT</Text>
             <Text style={styles.dayText}>SUN</Text>
          </View>
        </View>

        {/* --- SECTION 3: BIOMETRICS GRID (HRV & SLEEP) --- */}
        <View style={styles.biometricsGrid}>
          {/* HRV Trends */}
          <View style={styles.bioCard}>
            <Text style={styles.bioTitle}>HRV Trends</Text>
            <Text style={styles.bioSubtitle}>Night-time average</Text>
            
            <View style={styles.waveContainer}>
               {/* Simplified Wave Placeholder */}
               <MaterialCommunityIcons name="pulse" size={48} color="#8C6464" />
               <Text style={styles.waveValue}>64 <Text style={{fontSize: 12}}>ms</Text></Text>
            </View>
            
            <Text style={styles.bioFooter}>Optimal Range</Text>
          </View>

          {/* Sleep Quality */}
          <View style={styles.bioCard}>
            <Text style={styles.bioTitle}>Sleep Quality</Text>
            <Text style={styles.bioSubtitle}>Weekly summary</Text>
            
            <View style={styles.sleepMetrics}>
               <SleepBar label="REM" progress="80%" color="#526148" />
               <SleepBar label="DEEP" progress="60%" color="#8C6464" />
            </View>

            <View style={styles.statusBadge}>
               <MaterialCommunityIcons name="leaf" size={14} color="#526148" />
               <Text style={styles.statusBadgeText}>Excellent</Text>
            </View>
          </View>
        </View>

        {/* --- SECTION 4: WHY YOUR HRV PEAKED --- */}
        <View style={styles.analysisCard}>
           <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Why your HRV peaked last night</Text>
              <Text style={styles.analysisDesc}>
                The decrease in ambient room temperature and your consistent meditation practice have significantly improved your parasympathetic tone.
              </Text>
              <TouchableOpacity>
                <Text style={styles.readAnalysis}>READ ANALYSIS</Text>
                <View style={styles.underline} />
              </TouchableOpacity>
           </View>
           <View style={styles.analysisImagePlaceholder}>
              {/* Image would go here */}
              <Ionicons name="sunny-outline" size={40} color="#EBE7DE" />
           </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav/>
    </SafeAreaView>
  );
}

const Bar = ({ height, active }) => (
  <View style={[styles.bar, { height: height }, active && styles.barActive]} />
);

const SleepBar = ({ label, progress, color }) => (
  <View style={styles.sleepBarRow}>
    <Text style={styles.sleepLabel}>{label}</Text>
    <View style={styles.sleepProgressBg}>
       <View style={[styles.sleepProgressFill, { width: progress, backgroundColor: color }]} />
    </View>
  </View>
);

const NavItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      <Feather name={icon} size={20} color={active ? "#FDF9F3" : "#9a9080"} />
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
  label: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#9a9080",
    fontWeight: "700",
    marginBottom: 4,
  },
  headline: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  recoveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    marginBottom: 20,
    shadowColor: '#39382F',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  recoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#D4E4CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#39382F',
  },
  recoveryDesc: {
    fontSize: 16,
    color: '#615E5B',
    lineHeight: 24,
    marginBottom: 32,
  },
  miniMetricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    borderRadius: 16,
    padding: 16,
  },
  miniLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#9a9080',
    fontWeight: '700',
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  trendsCard: {
    backgroundColor: '#F2EBEB',
    borderRadius: 32,
    padding: 32,
    marginBottom: 20,
  },
  trendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9a9080',
  },
  avgContainer: {
    alignItems: 'flex-end',
  },
  avgValue: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  avgLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: '#9a9080',
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
  },
  bar: {
    width: 32,
    backgroundColor: '#EBE7DE',
    borderRadius: 4,
  },
  barActive: {
    backgroundColor: '#526148',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9a9080',
    width: 32,
    textAlign: 'center',
  },
  biometricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  bioCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#39382F',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 2,
  },
  bioSubtitle: {
    fontSize: 10,
    color: '#9a9080',
    marginBottom: 16,
  },
  waveContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  waveValue: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    position: 'absolute',
  },
  bioFooter: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9a9080',
    textAlign: 'center',
    marginTop: 8,
  },
  sleepMetrics: {
    gap: 12,
    marginBottom: 20,
  },
  sleepBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sleepLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#615E5B',
    width: 30,
  },
  sleepProgressBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#F5F2EB',
    borderRadius: 2,
  },
  sleepProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
    backgroundColor: '#F2EBEB',
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#526148',
  },
  analysisCard: {
    backgroundColor: '#FFF7F2',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  analysisTextContainer: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 8,
  },
  analysisDesc: {
    fontSize: 14,
    color: '#615E5B',
    lineHeight: 20,
    marginBottom: 16,
  },
  readAnalysis: {
    fontSize: 11,
    fontWeight: '700',
    color: '#39382F',
    letterSpacing: 0.5,
  },
  underline: {
    height: 1,
    backgroundColor: '#39382F',
    width: 85,
    marginTop: 2,
  },
  analysisImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F2EBEB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF9F3',
    paddingBottom: 30,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(57, 56, 47, 0.05)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: '#A8B79B',
  },
  navText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9a9080',
  },
  navTextActive: {
    color: '#39382F',
  },
});
