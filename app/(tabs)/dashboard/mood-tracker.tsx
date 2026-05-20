import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import BottomNav from '@/components/bottom-nav';
import { Frown, Meh, Smile, Laugh, ChevronRight } from 'lucide-react-native';

const COLORS = {
  background: '#FDF8F3',
  textDark: '#3D3027',
  textMuted: '#6B5C52',
  sage: '#4C6647',
  rose: '#7B5556',
  cardBg: '#FFF1E9',
  inputBg: '#FFFFFF',
  blueCard: '#E8F1FF',
  pinkCard: '#FFF1F1',
};

const MOODS = [
  { id: 'gloomy', label: 'GLOOMY', Icon: Frown },
  { id: 'low', label: 'LOW', Icon: Frown },
  { id: 'still', label: 'STILL', Icon: Meh },
  { id: 'bright', label: 'BRIGHT', Icon: Smile },
  { id: 'radiant', label: 'RADIANT', Icon: Laugh },
];

export default function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState('bright');
  const [reflection, setReflection] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How is your heart today?</Text>
        <Text style={styles.subtitle}>Capture your emotional landscape in a quiet moment.</Text>
      </View>

      {/* Mood Entry Card */}
      <View style={styles.entryCard}>
        <View style={styles.moodRow}>
          {MOODS.map((mood) => (
            <TouchableOpacity 
              key={mood.id} 
              onPress={() => setSelectedMood(mood.id)}
              style={styles.moodItem}
            >
              <View style={[
                styles.moodIconBox, 
                selectedMood === mood.id && styles.moodIconBoxActive
              ]}>
                <mood.Icon 
                  size={28} 
                  color={selectedMood === mood.id ? '#FFFFFF' : COLORS.textMuted} 
                />
              </View>
              <Text style={[
                styles.moodLabel, 
                selectedMood === mood.id && styles.moodLabelActive
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>ADD A REFLECTION</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write what's on your mind..."
            placeholderTextColor="rgba(107, 92, 82, 0.4)"
            multiline
            value={reflection}
            onChangeText={setReflection}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.9}>
          <Text style={styles.saveButtonText}>Save Reflection</Text>
        </TouchableOpacity>
      </View>

      {/* Recent History */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent History</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Yesterday Card */}
        <View style={styles.largeHistoryCard}>
          <View style={styles.historyCardHeader}>
            <View style={styles.historyMoodIcon}>
              <Smile size={20} color={COLORS.sage} />
            </View>
            <View style={styles.historyMeta}>
              <Text style={styles.historyDay}>YESTERDAY</Text>
              <Text style={styles.historyTime}>9:30 AM</Text>
            </View>
          </View>
          <Text style={styles.historyQuote}>
            "The morning light in the kitchen made me feel so peaceful. Coffee tasted better today."
          </Text>
        </View>

        {/* Small Cards Row */}
        <View style={styles.smallCardsRow}>
          <View style={[styles.smallCard, { backgroundColor: COLORS.blueCard }]}>
            <View style={styles.smallCardHeader}>
              <Meh size={18} color="#4E607C" />
              <Text style={styles.smallCardDay}>TUE</Text>
            </View>
            <Text style={styles.smallCardText} numberOfLines={3}>
              A quiet, steady day at the office. Productive but tired.
            </Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: COLORS.pinkCard }]}>
            <View style={styles.smallCardHeader}>
              <Frown size={18} color={COLORS.rose} />
              <Text style={styles.smallCardDay}>MON</Text>
            </View>
            <Text style={styles.smallCardText} numberOfLines={3}>
              Feeling a bit overwhelmed by the new project...
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 120, paddingTop: 60, paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 40, fontWeight: '700', color: COLORS.textDark, lineHeight: 48 },
  subtitle: { fontSize: 18, fontWeight: '500', color: COLORS.textMuted, marginTop: 12, lineHeight: 26, opacity: 0.8 },
  
  entryCard: { backgroundColor: COLORS.cardBg, borderRadius: 40, padding: 24, gap: 24 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: { alignItems: 'center', gap: 12 },
  moodIconBox: { 
    width: 56, 
    height: 56, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#3D3027',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  moodIconBoxActive: { backgroundColor: COLORS.sage },
  moodLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, opacity: 0.5 },
  moodLabelActive: { color: COLORS.sage, opacity: 1 },
  
  inputSection: { gap: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.sage, letterSpacing: 1 },
  textInput: { 
    backgroundColor: COLORS.inputBg, 
    borderRadius: 24, 
    padding: 20, 
    height: 120, 
    textAlignVertical: 'top',
    fontSize: 16,
    color: COLORS.textDark,
  },
  
  saveButton: { backgroundColor: COLORS.sage, borderRadius: 20, paddingVertical: 20, alignItems: 'center' },
  saveButtonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  
  historySection: { marginTop: 48 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  historyTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textDark },
  viewAll: { fontSize: 14, fontWeight: '600', color: COLORS.sage },
  
  largeHistoryCard: { backgroundColor: COLORS.cardBg, borderRadius: 32, padding: 24, gap: 16 },
  historyCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyMoodIcon: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  historyMeta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDay: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, opacity: 0.6, letterSpacing: 1 },
  historyTime: { fontSize: 10, fontWeight: '600', color: COLORS.textMuted, opacity: 0.4 },
  historyQuote: { fontSize: 18, fontStyle: 'italic', color: COLORS.textDark, lineHeight: 28, fontWeight: '500' },
  
  smallCardsRow: { flexDirection: 'row', gap: 16, marginTop: 16 },
  smallCard: { flex: 1, borderRadius: 28, padding: 20, gap: 12, minHeight: 140 },
  smallCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallCardDay: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, opacity: 0.6, letterSpacing: 1 },
  smallCardText: { fontSize: 14, fontWeight: '500', color: COLORS.textDark, lineHeight: 20 },
});
