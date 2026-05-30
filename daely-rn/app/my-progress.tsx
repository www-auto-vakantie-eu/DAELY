import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { Activity, getActivities } from 'services/activity-storage';

function formatDuration(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}u ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getWeekKey(date: Date): string {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(normalized.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}

function getMetricsSummary(activity: Activity): string | null {
  if (!activity.metrics) return null;

  if (activity.metrics.workout) {
    return `${activity.metrics.workout.exercises?.length ?? 0} oefeningen${
      activity.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(activity.metrics.workout.totalVolumeKg)} kg` : ''
    }`;
  }
  if (activity.metrics.session) {
    return `Intensiteit ${activity.metrics.session.intensity ?? '-'}`;
  }
  if (activity.metrics.match) {
    return `${activity.metrics.match.matchType ?? 'match'}${
      activity.metrics.match.scoreFor !== undefined && activity.metrics.match.scoreAgainst !== undefined
        ? ` · ${activity.metrics.match.scoreFor}-${activity.metrics.match.scoreAgainst}`
        : ''
    }`;
  }
  if (activity.metrics.score) {
    return `${activity.metrics.score.scoreType ?? 'score'}${activity.metrics.score.result ? ` · ${activity.metrics.score.result}` : ''}`;
  }
  if (activity.metrics.skill) {
    return activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0
      ? activity.metrics.skill.techniques.join(', ')
      : 'Skill';
  }
  if (activity.metrics.laps) {
    return activity.metrics.laps.distanceMeters !== undefined ? `${Math.round(activity.metrics.laps.distanceMeters)} m` : 'Laps';
  }
  if (activity.metrics.gps) {
    return activity.metrics.gps.distanceMeters !== undefined ? `${Math.round(activity.metrics.gps.distanceMeters)} m` : 'GPS activiteit';
  }

  return null;
}

export default function MyProgressScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const items = await getActivities();
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
      setLoading(false);
    };

    void load();
  }, []);

  const totalActivities = activities.length;
  const totalDurationSeconds = activities.reduce((sum, activity) => sum + (activity.durationSeconds || 0), 0);
  const activeDisciplines = new Set(activities.map((activity) => activity.disciplineId)).size;
  const mostRecent = activities[0];
  const recentActivities = activities.slice(0, 3);

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentWeekKey = getWeekKey(now);

  const activitiesToday = activities.filter((activity) => activity.endedAt.startsWith(todayKey)).length;
  const activitiesThisWeek = activities.filter((activity) => getWeekKey(new Date(activity.endedAt)) === currentWeekKey).length;

  const disciplineCounts = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();

    for (const activity of activities) {
      const existing = counts.get(activity.disciplineId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(activity.disciplineId, { name: activity.disciplineName, count: 1 });
      }
    }

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activities]);

  const hasNoProgress = !loading && totalActivities === 0;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <PageHeader
        title="Progressie"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Jouw voortgang</Text>
        <Text style={[styles.heroText, { color: theme.subtitleColor }]}>Bekijk hoe consistent je sport en welke stappen je zet.</Text>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Progressie-overzicht</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Totaal activiteiten</Text>
              <Text style={styles.statValue}>{totalActivities}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Totale sporttijd</Text>
              <Text style={styles.statValue}>{formatDuration(totalDurationSeconds)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Actieve disciplines</Text>
              <Text style={styles.statValue}>{activeDisciplines}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Meest recent</Text>
              <Text style={styles.statValueSmall}>{mostRecent ? mostRecent.disciplineName : '-'}</Text>
              <Text style={styles.statMeta}>{mostRecent ? formatDateTime(mostRecent.endedAt) : 'Nog geen activiteit'}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Consistentie</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <View style={styles.consistencyWrap}>
            <View style={styles.consistencyRow}>
              <Text style={styles.consistencyLabel}>Activiteiten deze week</Text>
              <Text style={styles.consistencyValue}>{activitiesThisWeek}</Text>
            </View>
            <View style={styles.consistencyRow}>
              <Text style={styles.consistencyLabel}>Activiteiten vandaag</Text>
              <Text style={styles.consistencyValue}>{activitiesToday}</Text>
            </View>
            <Text style={[styles.consistencyHint, { color: theme.subtitleColor }]}>Blijf bouwen aan je routine.</Text>
          </View>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Discipline-overzicht</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : hasNoProgress ? (
          <View>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen progressie opgebouwd.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Start je eerste activiteit om je voortgang te zien.</Text>
          </View>
        ) : (
          <View style={styles.disciplineList}>
            {disciplineCounts.map((item) => (
              <View key={item.name} style={styles.disciplineRow}>
                <Text style={styles.disciplineName}>{item.name}</Text>
                <Text style={styles.disciplineCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recente voortgang</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : hasNoProgress ? (
          <View>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen progressie opgebouwd.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Start je eerste activiteit om je voortgang te zien.</Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentActivities.map((activity) => (
              <Pressable
                key={activity.id}
                style={styles.recentCard}
                onPress={() => router.push({ pathname: '/activities/[id]', params: { id: activity.id } })}
              >
                <Text style={styles.recentTitle}>{activity.disciplineName}</Text>
                <Text style={styles.recentMeta}>{formatDateTime(activity.endedAt)} · {formatDuration(activity.durationSeconds)}</Text>
                {getMetricsSummary(activity) ? <Text style={styles.recentSummary}>{getMetricsSummary(activity)}</Text> : null}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.ctaRow}>
        <Pressable style={styles.primaryCtaBtn} onPress={() => router.push('/tracker')}>
          <Text style={styles.primaryCtaBtnText}>Start activiteit</Text>
        </Pressable>
        <Pressable style={styles.secondaryCtaBtn} onPress={() => router.push('/activities')}>
          <Text style={styles.secondaryCtaBtnText}>Bekijk activiteiten</Text>
        </Pressable>
        <Pressable style={styles.secondaryCtaBtn} onPress={() => router.push('/my-stats')}>
          <Text style={styles.secondaryCtaBtnText}>Bekijk data</Text>
        </Pressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    marginTop: 3,
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  statValueSmall: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statMeta: {
    marginTop: 2,
    fontSize: 11,
    color: '#64748B',
  },
  consistencyWrap: {
    gap: 6,
  },
  consistencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consistencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  consistencyValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  consistencyHint: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  disciplineList: {
    gap: 8,
  },
  disciplineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  disciplineName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  disciplineCount: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  recentTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  recentSummary: {
    marginTop: 3,
    color: '#1E293B',
    fontSize: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
  },
  ctaRow: {
    marginTop: 2,
    gap: 8,
  },
  primaryCtaBtn: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryCtaBtn: {
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaBtnText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 8,
  },
});
