import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
const router = useRouter();

const SESSIONS = [
  { id: '1', device: 'iPhone 14 Pro', location: 'London, UK', time: 'Active Now', isCurrent: true },
  { id: '2', device: 'MacBook Air', location: 'London, UK', time: '2 days ago', isCurrent: false },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const [biometric, setBiometric] = useState(true);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [sessions, setSessions] = useState(SESSIONS);

  const handleRevoke = (id: string) => {
    Alert.alert('Revoke Session', 'Are you sure you want to sign out this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke', style: 'destructive',
        onPress: () => setSessions((s) => s.filter((x) => x.id !== id)),
      },
    ]);
  };

  const handleUpdatePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('Error', 'Please fill in all password fields.'); return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Error', 'New passwords do not match.'); return;
    }
    Alert.alert('Success', 'Password updated successfully!');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent. All your journals, progress, and saved meditations will be erased forever.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Sanctuary', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/wellness/profile')}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.topBarTitle}>Privacy & Security</Text>
        </TouchableOpacity>
        <View style={styles.avatarSm}>
          <Text style={styles.avatarSmText}>MA</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Your data is a{' '}
            <Text style={styles.heroTitleAccent}>sacred space.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Manage how you protect your peace and digital footprint.
          </Text>
        </View>

        {/* Biometric Lock */}
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Biometric Lock</Text>
              <Text style={styles.cardDesc}>
                Require FaceID or TouchID to access your journals and stress checks.
              </Text>
            </View>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: '#D0CCC4', true: '#4A7C59' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Data Export */}
        <View style={styles.card}>
          <View style={[styles.iconBox, styles.iconBoxPink]}>
            <Text style={styles.iconEmoji}>📥</Text>
          </View>
          <Text style={styles.cardTitle}>Data Export</Text>
          <Text style={styles.cardDesc}>
            Request a complete archive of your meditation history and journal entries.
          </Text>
          <TouchableOpacity style={styles.archiveBtn}>
            <Text style={styles.archiveBtnText}>Request Archive  ›</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={styles.card}>
          <View style={styles.pwHeader}>
            <View style={[styles.iconBox, styles.iconBoxGreen]}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
            <Text style={styles.cardTitle}>Change Password</Text>
          </View>

          <Text style={styles.fieldLabel}>CURRENT PASSWORD</Text>
          <TextInput
            style={styles.fieldInput}
            value={currentPw}
            onChangeText={setCurrentPw}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#C0BDB8"
          />

          <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
          <TextInput
            style={styles.fieldInput}
            value={newPw}
            onChangeText={setNewPw}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#C0BDB8"
          />

          <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            style={styles.fieldInput}
            value={confirmPw}
            onChangeText={setConfirmPw}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#C0BDB8"
          />

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdatePassword}>
            <Text style={styles.updateBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Active Sessions */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ACTIVE SESSIONS</Text>
          {sessions.map((s) => (
            <View key={s.id} style={styles.sessionItem}>
              <View style={styles.deviceIcon}>
                <Text style={styles.deviceEmoji}>{s.isCurrent ? '📱' : '💻'}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>{s.device}</Text>
                <Text style={styles.sessionLoc}>{s.location} · {s.time}</Text>
              </View>
              {s.isCurrent ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>CURRENT</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleRevoke(s.id)}>
                  <Text style={styles.revokeText}>REVOKE</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Delete Account */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Delete Account</Text>
          <Text style={styles.dangerDesc}>
            This action is permanent. All your journals, progress, and saved meditations will be erased forever.
          </Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteAccount}>
            <Text style={styles.dangerBtnText}>Delete Sanctuary</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔒  END-TO-END ENCRYPTED SANCTUARY</Text>
        </View>
      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
            <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EF' },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontSize: 20, color: '#1A2E1A' },
  topBarTitle: { fontSize: 15, fontWeight: '600', color: '#1A2E1A' },
  avatarSm: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#4A6741', alignItems: 'center', justifyContent: 'center',
  },
  avatarSmText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  scroll: { paddingBottom: 32 },

  hero: { paddingHorizontal: 20, paddingVertical: 16 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#1A2E1A', lineHeight: 34 },
  heroTitleAccent: { color: '#5B7A3D', fontStyle: 'italic' },
  heroSub: { fontSize: 13, color: '#6B7B5E', lineHeight: 20, marginTop: 6 },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 12, padding: 16,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardText: { flex: 1 },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#FFF3CC', alignItems: 'center',
    justifyContent: 'center', marginBottom: 10,
  },
  iconBoxPink: { backgroundColor: '#FFE8E8' },
  iconBoxGreen: { backgroundColor: '#E8F5EE' },
  iconEmoji: { fontSize: 18 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A2E1A', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#7A8A6E', lineHeight: 18 },

  archiveBtn: {
    marginTop: 12, borderWidth: 0.5, borderColor: '#D0CCC4',
    borderRadius: 10, backgroundColor: '#F0EDE7',
    paddingVertical: 10, alignItems: 'center',
  },
  archiveBtnText: { fontSize: 13, color: '#3A3A3A', fontWeight: '500' },

  pwHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  fieldLabel: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.8, marginBottom: 5, marginTop: 4 },
  fieldInput: {
    backgroundColor: '#F7F5F0', borderWidth: 0.5, borderColor: '#E0DDD5',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: '#1A2E1A', marginBottom: 10,
  },
  updateBtn: {
    backgroundColor: '#2C3A2C', borderRadius: 28,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  updateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  sectionLabel: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.8, marginBottom: 10 },
  sessionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#F0EDE7' },
  deviceIcon: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: '#F0EDE7', alignItems: 'center',
    justifyContent: 'center', marginRight: 10,
  },
  deviceEmoji: { fontSize: 16 },
  sessionInfo: { flex: 1 },
  sessionName: { fontSize: 13, fontWeight: '600', color: '#1A2E1A' },
  sessionLoc: { fontSize: 11, color: '#9A9A8E', marginTop: 1 },
  currentBadge: { backgroundColor: '#E8F5EE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  currentBadgeText: { fontSize: 10, color: '#4A7C59', fontWeight: '700' },
  revokeText: { fontSize: 10, color: '#C0392B', fontWeight: '700' },

  dangerCard: {
    backgroundColor: '#FFF0EE', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 12, padding: 16,
  },
  dangerTitle: { fontSize: 15, fontWeight: '700', color: '#C0392B', marginBottom: 6 },
  dangerDesc: { fontSize: 12, color: '#9A5A55', lineHeight: 18, marginBottom: 14 },
  dangerBtn: {
    borderWidth: 1.5, borderColor: '#C0392B', borderRadius: 28,
    paddingVertical: 12, alignItems: 'center',
  },
  dangerBtnText: { color: '#C0392B', fontSize: 13, fontWeight: '700' },

  footer: { alignItems: 'center', paddingVertical: 16 },
  footerText: { fontSize: 10, color: '#9A9A8E', letterSpacing: 0.5 },
});