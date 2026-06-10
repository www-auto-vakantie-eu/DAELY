import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { type Activity, getActivities } from '@/services/activity-storage';
import PageHeader from '../components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

const CATEGORIES = ['Kracht', 'Hyrox', 'Calisthenics', 'Mobiliteit', 'Conditie', 'Herstel'] as const;
const WORKOUT_TRACKING_TYPES = new Set(['fitness', 'crossfit', 'zwaargewicht', 'hyrox', 'calisthenics']);

const RECOMMENDED_WORKOUTS = [
  {
    title: 'Full body kracht',
    description: 'Gebalanceerde sessie met compound lifts en gecontroleerde opbouw.',
    level: 'Beginner',
    icon: 'dumbbell' as const,
  },
  {
    title: 'Hyrox engine',
    description: 'Conditionele blokken met functionele stations en pace-focus.',
    level: 'Intermediate',
    icon: 'run-fast' as const,
  },
  {
    title: 'Mobiliteit reset',
    description: 'Rustige flow voor herstel, range of motion en blessurepreventie.',
    level: 'Advanced',
    icon: 'yoga' as const,
  },
];

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.max(1, Math.round((totalSeconds % 3600) / 60));
  if (hours > 0) {
    return `${hours}u ${minutes}m`;
  }
  return `${minutes} min`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function toMetricsSummary(activity: Activity): string | null {
  const parts: string[] = [];
  const workout = activity.metrics?.workout;
  const session = activity.metrics?.session;

  if (workout?.rounds !== undefined) parts.push(`${workout.rounds} rondes`);
  if (workout?.exercises?.length) parts.push(`${workout.exercises.length} oefeningen`);
  if (workout?.totalVolumeKg !== undefined) parts.push(`${Math.round(workout.totalVolumeKg)} kg volume`);
  if (session?.intensity) parts.push(`Intensiteit: ${session.intensity}`);

  return parts.length > 0 ? parts.slice(0, 2).join(' • ') : null;
}

function isWorkoutActivity(activity: Activity): boolean {
  return WORKOUT_TRACKING_TYPES.has(activity.trackingType.trim().toLowerCase());
}

export default function WorkoutsIndexScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number] | null>(null);
  const [placeholderMessage, setPlaceholderMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getActivities()
      .then((items) => {
        if (!isMounted) return;
        const sorted = [...items].sort(
          (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime(),
        );
        setActivities(sorted.filter(isWorkoutActivity));
      })
      .catch(() => {
        if (!isMounted) return;
        setActivities([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const recentWorkouts = useMemo(() => activities.slice(0, 3), [activities]);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Workouts"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Jouw workouts</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Vind trainingen, bouw routines en start direct je sessie.
          </Text>
        </View>

        {placeholderMessage ? (
          <View style={[styles.placeholderNotice, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.placeholderNoticeText, { color: theme.titleColor }]}>{placeholderMessage}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Snelle acties</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/tracker')}
          >
            <MaterialCommunityIcons name="play-circle-outline" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Start activiteit</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Open DAELY Tracker</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/activities')}
          >
            <MaterialCommunityIcons name="history" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Bekijk activiteiten</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Zie je workout-log</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setPlaceholderMessage('Workout schema\'s komen binnenkort.')}
          >
            <MaterialCommunityIcons name="calendar-plus" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Maak workout schema</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Workout categorieen</Text>
        </View>
        <View style={styles.categoriesWrap}>
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active ? theme.titleColor : theme.card,
                    borderColor: active ? theme.titleColor : theme.border,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryLabel, { color: active ? theme.background : theme.titleColor }]}> 
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recente workout-activiteiten</Text>
        </View>
        {recentWorkouts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen workouts opgeslagen.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}> 
              Start je eerste workout met DAELY Tracker.
            </Text>
          </View>
        ) : (
          recentWorkouts.map((activity) => {
            const summary = toMetricsSummary(activity);
            return (
              <Pressable
                key={activity.id}
                style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() =>
                  router.push({
                    pathname: '/activities/[id]',
                    params: { id: activity.id },
                  })
                }
              >
                <View style={styles.activityTop}>
                  <Text style={[styles.activityName, { color: theme.titleColor }]} numberOfLines={1}>
                    {activity.disciplineName}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
                </View>
                <Text style={[styles.activityMeta, { color: theme.subtitleColor }]}> 
                  {formatDuration(activity.durationSeconds)} • {formatDate(activity.endedAt)}
                </Text>
                {summary ? (
                  <Text style={[styles.activitySummary, { color: theme.subtitleColor }]} numberOfLines={2}>
                    {summary}
                  </Text>
                ) : null}
              </Pressable>
            );
          })
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Aanbevolen workouts</Text>
        </View>
        <View style={styles.recommendationsWrap}>
          {RECOMMENDED_WORKOUTS.map((item) => (
            <View
              key={item.title}
              style={[styles.recommendationCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={styles.recommendationTop}>
                <MaterialCommunityIcons name={item.icon} size={20} color={theme.titleColor} />
                <Text style={[styles.levelPill, { color: theme.subtitleColor }]}>Niveau: {item.level}</Text>
              </View>
              <Text style={[styles.recommendationTitle, { color: theme.titleColor }]}>{item.title}</Text>
              <Text style={[styles.recommendationDescription, { color: theme.subtitleColor }]}> 
                {item.description}
              </Text>
              <Pressable
                style={[styles.viewButton, { borderColor: theme.border }]}
                onPress={() => setPlaceholderMessage('Workout schema\'s komen binnenkort.')}
              >
                <Text style={[styles.viewButtonLabel, { color: theme.titleColor }]}>Bekijken</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="disciplines" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  placeholderNotice: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  placeholderNoticeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  quickActionsGrid: {
    gap: 10,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 5,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  activityCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  activityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  activityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  activityMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  activitySummary: {
    fontSize: 13,
    lineHeight: 19,
  },
  recommendationsWrap: {
    gap: 10,
  },
  recommendationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  recommendationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelPill: {
    fontSize: 12,
    fontWeight: '700',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recommendationDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  viewButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 24,
  },
});
