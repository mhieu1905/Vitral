/**
 * app/(tabs)/wellness/journal.tsx
 * Screen S-50: Daily Journal
 *
 * Navigation:
 *   ← back      → wellness-hub (hoặc index tùy entry point)
 *   Save Entry  → router.back()
 */

/**
 * app/(tabs)/wellness/journal.tsx
 * Screen S-50: Daily Journal
 *
 * Navigation:
 *   ← back      → wellness-hub (hoặc index tùy entry point)
 *   Save Entry  → router.back()
 */

import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { saveJournalEntry } from '../../../utils/journalService';

const C = {
  bg: '#FDF8F3',
  surface: '#F5EFE6',
  sage: '#A8C5A0',
  sageD: '#6B9E62',
  sageL: '#D6E8D2',
  dark: '#3D3530',
  muted: '#8C7B72',
  hint: '#C4B5AC',
  white: '#FFFFFF',
};

const MOODS = ['😄', '😊', '😐', '😢', '😤'];
const TAGS = ['Grateful', 'Calm', 'Hopeful'];

export default function JournalScreen() {
  const router = useRouter();

  const [mood, setMood] = useState(1);
  const [text, setText] = useState('');
  const [selTags, setSelTags] = useState<string[]>(['Grateful']);

  // loading save
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) =>
    setSelTags((p) =>
      p.includes(t)
        ? p.filter((x) => x !== t)
        : [...p, t]
    );

  // save journal
  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    try {
      await saveJournalEntry(mood, text, selTags);

      router.push('/(tabs)/wellness');
    } catch (err: any) {
      Alert.alert(
        'Lỗi',
        err.message ?? 'Không lưu được nhật ký'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() =>
              router.push('/(tabs)/wellness/homescreen')
            }
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={s.headerTitle}>Back</Text>

            <Text style={s.headerDate}>
              Tuesday, Jan 14
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Mood strip ── */}
          <View style={s.moodStrip}>
            {MOODS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.moodCircle,
                  i === mood && s.moodCircleSel,
                ]}
                onPress={() => setMood(i)}
                activeOpacity={0.8}
              >
                <Text style={s.moodEmoji}>
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Textarea ── */}
          <TextInput
            style={s.textarea}
            placeholder='"Write freely, this is your space..."'
            placeholderTextColor={C.hint}
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            selectionColor={C.sage}
          />

          {/* ── Tags ── */}
          <View style={s.tagsRow}>
            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  s.tag,
                  selTags.includes(tag) && s.tagSel,
                ]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    s.tagText,
                    selTags.includes(tag) &&
                      s.tagTextSel,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Save ── */}
          <TouchableOpacity
            style={[
              s.saveBtn,
              saving && { opacity: 0.6 },
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.saveBtnText}>
                Save Entry
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <BottomNav />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 18,
    color: C.dark,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: C.dark,
  },

  headerDate: {
    fontSize: 11,
    color: C.muted,
    marginTop: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },

  moodStrip: {
    backgroundColor: C.white,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginBottom: 14,

    shadowColor: '#3D3530',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  moodCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  moodCircleSel: {
    backgroundColor: '#D6E8D2',
    borderColor: C.sage,
  },

  moodEmoji: {
    fontSize: 22,
  },

  textarea: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.surface,
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: C.dark,
    minHeight: 200,
    lineHeight: 22,
    marginBottom: 14,
  },

  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  tag: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: C.surface,
  },

  tagSel: {
    backgroundColor: C.sage,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: C.muted,
  },

  tagTextSel: {
    color: C.white,
  },

  saveBtn: {
    backgroundColor: C.dark,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
});

