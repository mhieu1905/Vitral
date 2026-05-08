import { Feather, Ionicons } from '@expo/vector-icons';
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
 * FILE PATH: app/(tabs)/index.tsx
 * ROLE: Transit Home (Trang chủ 4 nút)
 * 
 * FIX: 
 * 1. Cập nhật nút LOG để dẫn chính xác sang '/activity_hub/log_type'.
 * 2. Cập nhật nút HUB để dẫn sang '/activity_hub'.
 */

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3530',
  textMuted: '#8C7B72',
  accent: '#A8C5A0',
  border: '#F2ECE4',
};

export default function TransitDashboard() {
  const router = useRouter();

  // Hàm chuyển hướng linh hoạt
  const navigateTo = (route: string) => {
    router.push(route); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>MORNING, ELENA</Text>
          <Text style={styles.headline}>Your vitality{"\n"}at a glance.</Text>
        </View>

        {/* Metrics List - Simple Row Style */}
        <View style={styles.metricsList}>
          <MetricItem label="Daily Flow" value="74%" />
          <MetricItem label="Heart Rate" value="72" unit="BPM" />
          <MetricItem label="Energy" value="1,420" unit="KCAL" />
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK ACCESS</Text>
          
          <TouchableOpacity 
            style={styles.listAction} 
            activeOpacity={0.7}
            onPress={() => navigateTo('/activity_hub')}
          >
            <Text style={styles.actionTitle}>Morning Grounding</Text>
            <Feather name="arrow-right" size={20} color="#D1CDC5" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.listAction} 
            activeOpacity={0.7}
            onPress={() => navigateTo('/activity_hub')}
          >
            <Text style={styles.actionTitle}>Primal Flow</Text>
            <Feather name="arrow-right" size={20} color="#D1CDC5" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* SPECIALIZED HUB NAVIGATION (4 ITEMS) */}
      <View style={styles.bottomNav}>
        <NavItem 
          icon="grid-outline" 
          label="HUB" 
          onPress={() => navigateTo('/activity_hub')} 
        />
        <NavItem 
          icon="add-circle-outline" 
          label="LOG" 
          
          onPress={() => navigateTo('/activity_hub/log_type')} 
        />
        <NavItem 
          icon="book-outline" 
          label="LIBRARY" 
          onPress={() => navigateTo('/activity_hub/library')} 
        />
        <NavItem 
          icon="stats-chart-outline" 
          label="INSIGHTS" 
          onPress={() => navigateTo('/activity_hub/healthy')} 
        />
      </View>
    </SafeAreaView>
  );
}

// Sub-component: Metric Row
const MetricItem = ({ label, value, unit = '' }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <View style={styles.metricValueContainer}>
      <Text style={styles.metricValue}>{value}</Text>
      {unit ? <Text style={styles.metricUnit}> {unit}</Text> : null}
    </View>
  </View>
);

// Sub-component: Nav Item
const NavItem = ({ icon, label, active = false, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      <Ionicons name={icon} size={22} color={active ? COLORS.textDark : COLORS.textMuted} />
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 60,
  },
  greeting: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.textMuted,
    fontWeight: "700",
    fontFamily: 'DM Sans',
    marginBottom: 8,
  },
  headline: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'DM Sans',
    lineHeight: 40,
  },
  metricsList: {
    marginBottom: 80,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2ECE4',
  },
  metricLabel: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'DM Sans',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBC5BB',
    fontFamily: 'DM Sans',
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#D1CDC5',
    fontWeight: '700',
    marginBottom: 24,
    fontFamily: 'DM Sans',
  },
  listAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textDark,
    fontFamily: 'DM Sans',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF8F3FA',
    paddingBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: '#A8C5A020',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: 'DM Sans',
  },
  navTextActive: {
    color: COLORS.textDark,
  },
});
