import BottomNav from '@/components/bottom-nav';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getMoodHistory,
  getMoodStats,
  MoodLog,
  MoodStats,
} from '../../../utils/moodService';

import {
  deleteJournalEntry,
  getJournalHistory,
  JournalEntry,
} from '../../../utils/journalService';

const C = {
  bg: '#FDF8F3',
  surface: '#F5EFE6',
  dark: '#3D3530',
  muted: '#8C7B72',
  sage: '#A8C5A0',
  sageD: '#6B9E62',
  white: '#FFFFFF',
  rose: '#F5C4C4',
  roseD: '#C47A7A',
};

// ─────────────────────────────────────────────────────
// Feed Types
// ─────────────────────────────────────────────────────
type FeedItem =
  | { kind: 'mood'; data: MoodLog }
  | { kind: 'journal'; data: JournalEntry };

// ─────────────────────────────────────────────────────
// Build Timeline Feed
// ─────────────────────────────────────────────────────
function buildFeed(
  moods: MoodLog[],
  journals: JournalEntry[]
): FeedItem[] {
  const moodItems: FeedItem[] =
    moods.map((d) => ({
      kind: 'mood',
      data: d,
    }));

  const journalItems: FeedItem[] =
    journals.map((d) => ({
      kind: 'journal',
      data: d,
    }));

  return [
    ...moodItems,
    ...journalItems,
  ].sort(
    (a, b) =>
      new Date(
        b.data.logged_at
      ).getTime() -
      new Date(
        a.data.logged_at
      ).getTime()
  );
}

// ─────────────────────────────────────────────────────
// Mood Card
// ─────────────────────────────────────────────────────
function MoodCard({
  item,
}: {
  item: MoodLog;
}) {
  const date = new Date(
    item.logged_at
  );

  return (
    <View style={s.card}>
      <View
        style={[
          s.kindBadge,
          {
            backgroundColor:
              'rgba(168,197,160,0.25)',
          },
        ]}
      >
        <Text
          style={[
            s.kindText,
            { color: C.sageD },
          ]}
        >
          Mood Check-in
        </Text>
      </View>

      <View style={s.cardRow}>
        <Text style={s.bigEmoji}>
          {item.mood_emoji}
        </Text>

        <View style={s.cardBody}>
          <Text style={s.cardTitle}>
            {item.mood_label}
          </Text>

          {item.note ? (
            <Text
              style={s.noteText}
              numberOfLines={2}
            >
              {item.note}
            </Text>
          ) : null}

          <Text style={s.cardDate}>
            {date.toLocaleDateString(
              'vi-VN',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            )}
            {' · '}
            {date.toLocaleTimeString(
              'vi-VN',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// Journal Card
// ─────────────────────────────────────────────────────
function JournalCard({
  item,
  onDelete,
}: {
  item: JournalEntry;
  onDelete: (id: string) => void;
}) {
  const date = new Date(
    item.logged_at
  );

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View
          style={[
            s.kindBadge,
            {
              backgroundColor:
                'rgba(245,196,196,0.35)',
            },
          ]}
        >
          <Text
            style={[
              s.kindText,
              { color: C.roseD },
            ]}
          >
            Journal
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            onDelete(item.id)
          }
          activeOpacity={0.7}
        >
          <Text style={s.deleteText}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.cardRow}>
        <Text style={s.bigEmoji}>
          {item.mood_emoji}
        </Text>

        <View style={s.cardBody}>
          {item.content ? (
            <Text
              style={s.journalText}
              numberOfLines={3}
            >
              {item.content}
            </Text>
          ) : (
            <Text
              style={s.journalEmpty}
            >
              No content
            </Text>
          )}

          <Text style={s.cardDate}>
            {date.toLocaleDateString(
              'vi-VN',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            )}
            {' · '}
            {date.toLocaleTimeString(
              'vi-VN',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </Text>
        </View>
      </View>

      {item.tags?.length > 0 && (
        <View style={s.tagsRow}>
          {item.tags.map(
            (tag, i) => (
              <View
                key={i}
                style={s.tag}
              >
                <Text
                  style={s.tagText}
                >
                  {tag}
                </Text>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────
// Stat Bar
// ─────────────────────────────────────────────────────
function StatBar({
  stat,
}: {
  stat: MoodStats;
}) {
  return (
    <View style={s.statRow}>
      <Text style={s.statEmoji}>
        {stat.emoji}
      </Text>

      <View style={s.barTrack}>
        <View
          style={[
            s.barFill,
            {
              width: `${stat.percentage}%`,
            },
          ]}
        />
      </View>

      <Text style={s.statPct}>
        {stat.percentage}%
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────
export default function MoodHistoryScreen() {
  const router = useRouter();

  const [feed, setFeed] =
    useState<FeedItem[]>([]);

  const [stats, setStats] =
    useState<MoodStats[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [tab, setTab] = useState<
    'feed' | 'stats'
  >('feed');

  // ───────────────────────────────────────────────────
  // Delete Journal
  // ───────────────────────────────────────────────────
  const handleDeleteJournal =
    async (id: string) => {
      // WEB
      if (Platform.OS === 'web') {
        try {
          const confirmed =
            window.confirm(
              'Bạn có chắc muốn xóa journal này?'
            );

          if (!confirmed) return;

          await deleteJournalEntry(
            id
          );

          setFeed((prev) =>
            prev.filter(
              (item) =>
                !(
                  item.kind ===
                    'journal' &&
                  item.data.id === id
                )
            )
          );
        } catch (err: any) {
          alert(
            err.message ??
              'Không thể xóa journal'
          );
        }

        return;
      }

      // MOBILE
      Alert.alert(
        'Xóa nhật ký',
        'Bạn có chắc muốn xóa journal này?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteJournalEntry(
                  id
                );

                setFeed((prev) =>
                  prev.filter(
                    (item) =>
                      !(
                        item.kind ===
                          'journal' &&
                        item.data.id ===
                          id
                      )
                  )
                );
              } catch (err: any) {
                Alert.alert(
                  'Lỗi',
                  err.message ??
                    'Không thể xóa journal'
                );
              }
            },
          },
        ]
      );
    };

  // ───────────────────────────────────────────────────
  // Load Data
  // ───────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);

      const [
        moods,
        journals,
        st,
      ] = await Promise.all([
        getMoodHistory(30),
        getJournalHistory(30),
        getMoodStats(),
      ]);

      setFeed(
        buildFeed(
          moods,
          journals
        )
      );

      setStats(st);
    } catch (err: any) {
      console.error(
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────
  // Auto reload when screen focused
  // ───────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // ───────────────────────────────────────────────────
  // Render Feed Item
  // ───────────────────────────────────────────────────
  const renderItem = ({
    item,
  }: {
    item: FeedItem;
  }) =>
    item.kind === 'mood' ? (
      <MoodCard
        item={
          item.data as MoodLog
        }
      />
    ) : (
      <JournalCard
        item={
          item.data as JournalEntry
        }
        onDelete={
          handleDeleteJournal
        }
      />
    );

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() =>
            router.back()
          }
        >
          <Text style={s.backArrow}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={s.title}>
          My History
        </Text>

        <View
          style={{ width: 34 }}
        />
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity
          style={[
            s.tab,
            tab === 'feed' &&
              s.tabActive,
          ]}
          onPress={() =>
            setTab('feed')
          }
        >
          <Text
            style={[
              s.tabText,
              tab === 'feed' &&
                s.tabTextActive,
            ]}
          >
            Timeline
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.tab,
            tab === 'stats' &&
              s.tabActive,
          ]}
          onPress={() =>
            setTab('stats')
          }
        >
          <Text
            style={[
              s.tabText,
              tab === 'stats' &&
                s.tabTextActive,
            ]}
          >
            Statistics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          style={{
            marginTop: 40,
          }}
          color={C.sage}
        />
      ) : tab === 'feed' ? (
        <FlatList
          data={feed}
          keyExtractor={(item) =>
            item.data.id
          }
          renderItem={renderItem}
          contentContainerStyle={
            s.list
          }
          ListEmptyComponent={
            <Text style={s.empty}>
              Chưa có dữ liệu nào.
            </Text>
          }
        />
      ) : (
        <View style={s.statsWrap}>
          <Text
            style={s.statsTitle}
          >
            Mood 7 ngày gần nhất
          </Text>

          {stats.every(
            (s) =>
              s.count === 0
          ) ? (
            <Text style={s.empty}>
              Chưa có dữ liệu
              thống kê.
            </Text>
          ) : (
            stats.map((st, i) => (
              <StatBar
                key={i}
                stat={st}
              />
            ))
          )}
        </View>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
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

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: C.dark,
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor:
      'transparent',
  },

  tabActive: {
    borderBottomColor:
      C.sageD,
  },

  tabText: {
    fontSize: 14,
    color: C.muted,
    fontWeight: '500',
  },

  tabTextActive: {
    color: C.sageD,
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  empty: {
    textAlign: 'center',
    color: C.muted,
    marginTop: 40,
    fontSize: 14,
  },

  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9534F',
  },

  kindBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },

  kindText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  bigEmoji: {
    fontSize: 32,
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.dark,
    marginBottom: 4,
  },

  cardDate: {
    fontSize: 11,
    color: C.muted,
  },

  noteText: {
    fontSize: 13,
    color: C.dark,
    lineHeight: 18,
    marginBottom: 4,
  },

  journalText: {
    fontSize: 14,
    color: C.dark,
    lineHeight: 20,
    marginBottom: 4,
  },

  journalEmpty: {
    fontSize: 13,
    color: C.muted,
    fontStyle: 'italic',
    marginBottom: 4,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },

  tag: {
    backgroundColor:
      'rgba(168,197,160,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 11,
    color: C.sageD,
    fontWeight: '500',
  },

  statsWrap: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  statsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.dark,
    marginBottom: 16,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },

  statEmoji: {
    fontSize: 22,
    width: 32,
  },

  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor:
      C.surface,
    borderRadius: 5,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: C.sage,
    borderRadius: 5,
  },

  statPct: {
    fontSize: 13,
    color: C.muted,
    width: 36,
    textAlign: 'right',
  },
});