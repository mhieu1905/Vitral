import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
const router = useRouter();


export default function EditProfileScreen({ navigation }: any) {
  const [name,  setName]  = useState('Nguyen Minh Anh');
  const [email, setEmail] = useState('Minh@email.com');
  const [dob,   setDob]   = useState('Jan 15, 2002');
  const [phone, setPhone] = useState('0901 234 567');
  const [unit,  setUnit]  = useState<'metric' | 'imperial'>('metric');

  const save = () => {
    Alert.alert('Saved', 'Profile updated ✓');
    setTimeout(() => navigation.navigate('Profile'), 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/wellness/homescreen')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MA</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        {[
          { label: 'FULL NAME',     value: name,  set: setName,  keyboard: 'default' },
          { label: 'EMAIL',         value: email, set: setEmail, keyboard: 'email-address' },
          { label: 'DATE OF BIRTH', value: dob,   set: setDob,   keyboard: 'default' },
          { label: 'PHONE',         value: phone, set: setPhone, keyboard: 'phone-pad' },
        ].map((field, i) => (
          <View key={i} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={[styles.fieldInput, i === 0 && { borderColor: colors.sage }]}
              value={field.value}
              onChangeText={field.set}
              keyboardType={field.keyboard as any}
            />
          </View>
        ))}

        {/* Unit toggle */}
        <Text style={styles.fieldLabel}>UNITS</Text>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitBtn, unit === 'metric' && styles.unitBtnSel]}
            onPress={() => setUnit('metric')}
          >
            <Text style={[styles.unitText, unit === 'metric' && styles.unitTextSel]}>kg / cm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitBtn, unit === 'imperial' && styles.unitBtnSel]}
            onPress={() => setUnit('imperial')}
          >
            <Text style={[styles.unitText, unit === 'imperial' && styles.unitTextSel]}>lbs / ft</Text>
          </TouchableOpacity>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/(tabs)/wellness/profile')} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
      <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontSize: 18, color: colors.dark },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.dark },
  scroll:      { flex: 1, paddingHorizontal: 24 },
  avatarWrap:  { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.rose,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  avatarText:  { fontSize: 22, fontWeight: '700', color: colors.white },
  changePhoto: { fontSize: 12, color: colors.sageD, textDecorationLine: 'underline' },
  fieldGroup:  { marginBottom: 14 },
  fieldLabel: {
    fontSize: 10, fontWeight: '600', color: colors.muted,
    letterSpacing: 0.7, marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: colors.white, borderWidth: 1,
    borderColor: colors.surface, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: colors.dark,
  },
  unitToggle:    { flexDirection: 'row', gap: 8, marginBottom: 20, marginTop: 6 },
  unitBtn: {
    flex: 1, padding: 12, borderRadius: 10,
    backgroundColor: colors.surface, alignItems: 'center',
  },
  unitBtnSel:   { backgroundColor: colors.dark },
  unitText:     { fontSize: 13, fontWeight: '500', color: colors.muted },
  unitTextSel:  { color: colors.white },
  saveBtn: {
    backgroundColor: colors.dark, borderRadius: 10,
    padding: 16, alignItems: 'center', marginBottom: 24,
  },
  saveBtnText:  { fontSize: 15, fontWeight: '600', color: colors.white },
});