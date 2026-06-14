import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import AppHeader from './components/AppHeader';
import { Activity, getActivities } from 'services/activity-storage';
import { getPerformanceSummary, PerformanceSummary } from 'services/performance-summary';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { getUnreadMessageCount } from '@/services/messages-storage';

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
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const items = await getActivities();
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
      const summary = await getPerformanceSummary();
      setPerformanceSummary(summary);
      const unread = await getUnreadMessageCount();
      setUnreadMessageCount(unread);
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
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          title="Progressie"
          subtitle="Jouw sportdashboard"
          showMessages
          unreadMessagesCount={unreadMessageCount}
          onMessagesPress={() => router.push('/messages')}
          onSettingsPress={() => router.push('/(tabs)/athlete')}
        />

      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.heroIconBadge}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#2563EB" />
          </View>
          <Text style={styles.heroTitle}>Jouw voortgang</Text>
          <Text style={styles.heroText}>Bouw consistentie op met trainingen, PR&apos;s en activiteit.</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Progressie-overzicht</Text>
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

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Consistentie</Text>
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
            <View style={styles.weekDots}>
              <View style={[styles.weekDot, activitiesThisWeek > 0 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 1 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 2 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 3 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 4 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 5 && styles.weekDotActive]} />
              <View style={[styles.weekDot, activitiesThisWeek > 6 && styles.weekDotActive]} />
            </View>
            <Text style={styles.consistencyHint}>Blijf bouwen aan je routine.</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PR Overzicht</Text>
          <View style={styles.sectionIconBadge}>
            <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Workouts voltooid</Text>
              <Text style={styles.statValue}>{performanceSummary?.totalWorkoutActivities ?? 0}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>PR&apos;s behaald</Text>
              <Text style={styles.statValue}>{performanceSummary?.totalPersonalRecords ?? 0}</Text>
            </View>
            {performanceSummary?.latestPersonalRecord ? (
              <View style={[styles.statCard, styles.statCardFull]}>
                <Text style={styles.statLabel}>Laatste PR</Text>
                <Text style={styles.statValue}>{performanceSummary.latestPersonalRecord.exerciseName}</Text>
                <Text style={styles.statMeta}>
                  {performanceSummary.latestPersonalRecord.weightKg ? `${performanceSummary.latestPersonalRecord.weightKg} kg` : ''}
                  {performanceSummary.latestPersonalRecord.reps ? ` × ${performanceSummary.latestPersonalRecord.reps}` : ''}
                  {performanceSummary.latestPersonalRecord.durationSeconds ? `${performanceSummary.latestPersonalRecord.durationSeconds}s` : ''}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      {performanceSummary?.recentPersonalRecords && performanceSummary.recentPersonalRecords.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recente PR&apos;s</Text>
          <View style={styles.recentList}>
            {performanceSummary.recentPersonalRecords.slice(0, 10).map((pr) => (
              <View key={`${pr.exerciseName}-${pr.achievedAt}`} style={styles.recentCard}>
                <Text style={styles.recentTitle}>{pr.exerciseName}</Text>
                <Text style={styles.recentMeta}>{formatDateTime(pr.achievedAt)}</Text>
                <Text style={styles.recentSummary}>
                  {pr.weightKg ? `${pr.weightKg} kg` : ''}
                  {pr.reps ? ` × ${pr.reps}` : ''}
                  {pr.durationSeconds ? `${pr.durationSeconds}s` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discipline-overzicht</Text>
          <View style={styles.sectionIconBadge}>
            <MaterialCommunityIcons name="chart-bar" size={20} color="#2563EB" />
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : hasNoProgress ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chart-line" size={40} color="#DBEAFE" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nog geen progressie opgebouwd.</Text>
            <Text style={styles.emptyText}>Start je eerste activiteit om je voortgang per discipline te zien.</Text>
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

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recente voortgang</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : hasNoProgress ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="history" size={40} color="#DBEAFE" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nog geen progressie opgebouwd.</Text>
            <Text style={styles.emptyText}>Start je eerste activiteit om je voortgang te zien.</Text>
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
    <SharedBottomNav activeTab="mijn" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  heroContent: {
    gap: 12,
  },
  heroIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCardFull: {
    width: '100%',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    lineHeight: 32,
  },
  statValueSmall: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  statMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
  consistencyWrap: {
    gap: 12,
  },
  consistencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consistencyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  consistencyValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  weekDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  weekDotActive: {
    backgroundColor: '#2563EB',
  },
  consistencyHint: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  disciplineList: {
    gap: 10,
  },
  disciplineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  disciplineName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  disciplineCount: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
  },
  recentList: {
    gap: 10,
  },
  recentCard: {
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  recentTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  recentSummary: {
    marginTop: 4,
    color: '#1E293B',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  emptyIcon: {
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
  },
  ctaRow: {
    marginTop: 4,
    gap: 12,
  },
  primaryCtaBtn: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryCtaBtn: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 8,
  },
});
