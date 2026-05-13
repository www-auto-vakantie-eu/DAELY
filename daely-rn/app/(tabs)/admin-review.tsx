import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import {
  getCreatorPosts,
  getCreatorMealEntries,
  getCreatorWorkoutEntries,
  setCreatorPostStatus,
  setCreatorMealStatus,
  setCreatorWorkoutStatus,
  type CreatorMealEntry,
  type CreatorPost,
  type CreatorWorkoutEntry,
} from '@/services/creator-content';

const ADMIN_REVIEW_CODE = process.env.EXPO_PUBLIC_ADMIN_REVIEW_CODE?.trim();

function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminReviewScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [codeInput, setCodeInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [meals, setMeals] = useState<CreatorMealEntry[]>([]);
  const [workouts, setWorkouts] = useState<CreatorWorkoutEntry[]>([]);

  const pendingPosts = useMemo(() => posts.filter((p) => p.status === 'pending'), [posts]);
  const pendingMeals = useMemo(() => meals.filter((m) => m.status === 'pending'), [meals]);
  const pendingWorkouts = useMemo(() => workouts.filter((w) => w.status === 'pending'), [workouts]);

  const refreshAll = async () => {
    setIsRefreshing(true);
    try {
      const [p, m, w] = await Promise.all([
        getCreatorPosts(),
        getCreatorMealEntries(),
        getCreatorWorkoutEntries(),
      ]);
      setPosts(p);
      setMeals(m);
      setWorkouts(w);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isUnlocked) return;
    refreshAll().catch(() => {
      Alert.alert('Fout', 'Kon moderatie-items niet laden.');
    });
  }, [isUnlocked]);

  const unlock = () => {
    if (!ADMIN_REVIEW_CODE) {
      Alert.alert('Configuratie ontbreekt', 'EXPO_PUBLIC_ADMIN_REVIEW_CODE is niet ingesteld.');
      return;
    }

    if (codeInput.trim() !== ADMIN_REVIEW_CODE) {
      Alert.alert('Onjuiste code', 'Controleer de admin review code en probeer opnieuw.');
      return;
    }
    setIsUnlocked(true);
  };

  const approvePost = async (id: string) => {
    await setCreatorPostStatus(id, 'approved');
    await refreshAll();
  };

  const returnPostToDraft = async (id: string) => {
    await setCreatorPostStatus(id, 'draft');
    await refreshAll();
  };

  const approveMeal = async (id: string) => {
    await setCreatorMealStatus(id, 'approved');
    await refreshAll();
  };

  const returnMealToDraft = async (id: string) => {
    await setCreatorMealStatus(id, 'draft');
    await refreshAll();
  };

  const approveWorkout = async (id: string) => {
    await setCreatorWorkoutStatus(id, 'approved');
    await refreshAll();
  };

  const returnWorkoutToDraft = async (id: string) => {
    await setCreatorWorkoutStatus(id, 'draft');
    await refreshAll();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
            <Text style={[styles.backLabel, { color: theme.titleColor }]}>Terug</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.titleColor }]}>Admin Review.</Text>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Keur creator-content goed voordat het live gaat.</Text>

        {!isUnlocked ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Beveiligde toegang</Text>
            <TextInput
              style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="Admin review code"
              placeholderTextColor={theme.subtitleColor}
              autoCapitalize="characters"
            />
            <Pressable style={styles.actionButton} onPress={unlock}>
              <Text style={styles.actionButtonText}>Open Moderatiepaneel</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Pressable style={styles.refreshButton} onPress={() => refreshAll()} disabled={isRefreshing}>
              <MaterialCommunityIcons name={isRefreshing ? 'progress-clock' : 'refresh'} size={16} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>{isRefreshing ? 'Vernieuwen...' : 'Vernieuwen'}</Text>
            </Pressable>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Pending Posts ({pendingPosts.length})</Text>
              {pendingPosts.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Geen pending posts.</Text>
              ) : (
                pendingPosts.map((post) => (
                  <View key={post.id} style={[styles.itemRow, { borderColor: theme.border }]}>
                    <View style={styles.itemTextWrap}>
                      <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{post.title}</Text>
                      <Text style={[styles.itemMeta, { color: theme.subtitleColor }]}>{formatStamp(post.createdAt)}</Text>
                    </View>
                    <View style={styles.rowActions}>
                      <Pressable style={styles.approveBtn} onPress={() => approvePost(post.id)}>
                        <Text style={styles.btnText}>Approve</Text>
                      </Pressable>
                      <Pressable style={styles.draftBtn} onPress={() => returnPostToDraft(post.id)}>
                        <Text style={styles.btnText}>Draft</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Pending Gerechten ({pendingMeals.length})</Text>
              {pendingMeals.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Geen pending gerechten.</Text>
              ) : (
                pendingMeals.map((entry) => (
                  <View key={entry.id} style={[styles.itemRow, { borderColor: theme.border }]}>
                    <View style={styles.itemTextWrap}>
                      <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{entry.meal.title}</Text>
                      <Text style={[styles.itemMeta, { color: theme.subtitleColor }]}>{entry.meal.kcal} KCAL • {entry.meal.protein}g • {formatStamp(entry.createdAt)}</Text>
                    </View>
                    <View style={styles.rowActions}>
                      <Pressable style={styles.approveBtn} onPress={() => approveMeal(entry.id)}>
                        <Text style={styles.btnText}>Approve</Text>
                      </Pressable>
                      <Pressable style={styles.draftBtn} onPress={() => returnMealToDraft(entry.id)}>
                        <Text style={styles.btnText}>Draft</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Pending Workouts ({pendingWorkouts.length})</Text>
              {pendingWorkouts.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Geen pending workouts.</Text>
              ) : (
                pendingWorkouts.map((entry) => (
                  <View key={entry.id} style={[styles.itemRow, { borderColor: theme.border }]}>
                    <View style={styles.itemTextWrap}>
                      <Text style={[styles.itemTitle, { color: theme.titleColor }]}>{entry.workout.title}</Text>
                      <Text style={[styles.itemMeta, { color: theme.subtitleColor }]}>{entry.workout.type.toUpperCase()} • {formatStamp(entry.createdAt)}</Text>
                    </View>
                    <View style={styles.rowActions}>
                      <Pressable style={styles.approveBtn} onPress={() => approveWorkout(entry.id)}>
                        <Text style={styles.btnText}>Approve</Text>
                      </Pressable>
                      <Pressable style={styles.draftBtn} onPress={() => returnWorkoutToDraft(entry.id)}>
                        <Text style={styles.btnText}>Draft</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 100 },
  topRow: { marginBottom: 16 },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backLabel: { fontSize: 14, fontWeight: '700' },
  title: { fontSize: 54, lineHeight: 58, fontWeight: '900', letterSpacing: -1.8 },
  subtitle: { marginTop: 4, marginBottom: 14, fontSize: 14, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  actionButton: {
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  actionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  refreshButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyText: { fontSize: 13, fontWeight: '500' },
  itemRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTextWrap: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  itemMeta: { fontSize: 11, fontWeight: '500' },
  rowActions: { flexDirection: 'row', gap: 6 },
  approveBtn: {
    borderRadius: 999,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  draftBtn: {
    borderRadius: 999,
    backgroundColor: '#6B7280',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});
