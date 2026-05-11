import { usePathname, useRouter } from 'expo-router';
import { Activity, Heart, Layout, User, Utensils } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NavIconProps = {
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

const NavIcon = ({ Icon, label, active, onPress }: NavIconProps) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.navIconBox, active && styles.navIconBoxActive]}>
      <Icon color={active ? '#4C6647' : '#88776D'} size={20} />
    </View>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard');
  const isActivity = pathname === '/activity' || pathname.startsWith('/activity/');
  const isNutrition = pathname === '/nutrition' || pathname.startsWith('/nutrition/');
  const isWellness = pathname === '/wellness' || pathname.startsWith('/wellness/');

  return (
    <View style={styles.bottomNav}>
      <NavIcon Icon={User} label="Onboarding" />
      <NavIcon Icon={Layout} label="Dashboard" active={isDashboard} onPress={() => router.replace('/(tabs)/dashboard')} />
      <NavIcon Icon={Activity} label="Activity" active={isActivity} onPress={() => router.replace('/(tabs)/activity/home')} />
      <NavIcon Icon={Utensils} label="Nutrition" active={isNutrition} onPress={() => router.replace('/(tabs)/nutrition')} />
      <NavIcon Icon={Heart} label="Wellness" active={isWellness} onPress={() => router.replace('/(tabs)/wellness/homescreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FDF8F3', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopLeftRadius: 32, borderTopRightRadius: 32, elevation: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: -2 }, shadowRadius: 8, borderTopWidth: 0 },
  navItem: { alignItems: 'center', gap: 4 },
  navIconBox: { padding: 8, borderRadius: 12 },
  navIconBoxActive: { backgroundColor: 'rgba(205, 235, 196, 0.3)' },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#88776D' },
  navLabelActive: { color: '#4C6647' },
});