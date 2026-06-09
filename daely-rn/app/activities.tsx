import React, { useEffect, useState } from 'react';
import { Platform, Text, StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { getActivities, Activity } from 'services/activity-storage';
import { useTheme } from '@/hooks/use-theme';
import { AppBottomMenu } from '@/components/AppBottomMenu';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    getActivities().then((acts) => {
      const sorted = [...acts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setActivities(sorted);
    });
  }, []);

  const totalDurationSeconds = activities.reduce((sum, a) => sum + a.durationSeconds, 0);
  const uniqueDisciplines = new Set(activities.map((a) => a.disciplineId)).size;
  const lastActivity = activities[0];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'ios' ? 80 : 60 }]} showsVerticalScrollIndicator={false}>
      <PageHeader title="Activiteiten" />

      <View style={styles.contentWrapper}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="timer" size={32} color="#2563EB" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Activiteiten</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Bekijk je trainingen, sessies en voortgang.
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Totaal activiteiten</Text>
            <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{activities.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Totale sporttijd</Text>
            <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{formatTotalDuration(totalDurationSeconds)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Disciplines</Text>
            <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{uniqueDisciplines}</Text>
          </View>
        </View>

        {lastActivity && (
          <View style={[styles.lastActivityCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.lastActivityTitle, { color: theme.titleColor }]}>Laatste activiteit</Text>
            <Text style={[styles.lastActivityName, { color: theme.titleColor }]}>{lastActivity.disciplineName}</Text>
            <Text style={[styles.lastActivityMeta, { color: theme.subtitleColor }]}>
              {formatDate(lastActivity.endedAt)} · {formatDuration(lastActivity.durationSeconds)}
            </Text>
          </View>
        )}

        {activities.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="run-fast" size={48} color="#2563EB" />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen activiteiten opgeslagen</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
              Start je eerste activiteit om je voortgang op te bouwen.
            </Text>
            <Pressable style={styles.startButton} onPress={() => router.push('/tracker')}>
              <Text style={styles.startButtonText}>Start activiteit</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Alle activiteiten</Text>
            </View>
            {activities.map((a) => (
              <Pressable
                key={a.id}
                style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push({ pathname: '/activities/[id]', params: { id: a.id } })}
              >
                <View style={styles.itemTopRow}>
                  <View style={styles.itemIconContainer}>
                    <MaterialCommunityIcons name="dumbbell" size={20} color="#2563EB" />
                  </View>
                  <Text style={[styles.name, { color: theme.titleColor }]}>{a.workoutName || a.disciplineName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={styles.statusText}>{a.status}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={[styles.typeBadge, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text style={[styles.typeBadgeText, { color: theme.titleColor }]}>{trackingTypeCode(a.trackingType)}</Text>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={[styles.typeBadgeText, { color: '#1D4ED8' }]}>{a.trackingType}</Text>
                  </View>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{formatDate(a.endedAt)}</Text>
                </View>

                {a.programId && a.programWeek !== undefined && a.programDay !== undefined && (
                  <View style={styles.programBadgeRow}>
                    <View style={[styles.programBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.programBadgeText, { color: '#92400E' }]}>
                        Week {a.programWeek} · Dag {a.programDay}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.durationRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={theme.subtitleColor} />
                  <Text style={[styles.durationText, { color: theme.titleColor }]}>Duur: {formatDuration(a.durationSeconds)}</Text>
                </View>

                <View style={[styles.metricsSummaryCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Text style={[styles.metricsSummaryLabel, { color: theme.subtitleColor }]}>Samenvatting</Text>
                  <Text style={[styles.metricsSummaryText, { color: theme.titleColor }]}>{getMetricsSummary(a)}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </View>
    </ScrollView>
    <AppBottomMenu activeRoute="today" />
  </View>
  );
}

function trackingTypeCode(trackingType: string) {
  switch (trackingType) {
    case 'workout':
      return 'WO';
    case 'session':
      return 'SE';
    case 'match':
      return 'MA';
    case 'score':
      return 'SC';
    case 'skill':
      return 'SK';
    case 'laps':
      return 'LP';
    case 'gps':
      return 'GPS';
    default:
      return '--';
  }
}

function getMetricsSummary(a: Activity) {
  if (a.metrics?.workout) {
    const parts: string[] = [];
    if (a.metrics.workout.completedExercisesCount !== undefined && a.metrics.workout.totalExercisesCount !== undefined) {
      parts.push(`${a.metrics.workout.completedExercisesCount}/${a.metrics.workout.totalExercisesCount} oefeningen`);
    } else if (a.metrics.workout.exercises && a.metrics.workout.exercises.length > 0) {
      parts.push(`${a.metrics.workout.exercises.length} oefeningen`);
    }
    if (a.metrics.workout.totalVolumeKg !== undefined) {
      parts.push(`${Math.round(a.metrics.workout.totalVolumeKg)} kg volume`);
    }
    return parts.length > 0 ? parts.join(' · ') : 'Workout';
  }
  if (a.metrics?.session) {
    return `${a.metrics.session.intensity ? `Intensiteit ${a.metrics.session.intensity}` : 'Session'}${a.metrics.session.focusAreas && a.metrics.session.focusAreas.length > 0 ? ` · ${a.metrics.session.focusAreas.join(', ')}` : ''}`;
  }
  if (a.metrics?.match) {
    return `${a.metrics.match.matchType ?? 'match'}${a.metrics.match.scoreFor !== undefined && a.metrics.match.scoreAgainst !== undefined ? ` · ${a.metrics.match.scoreFor}-${a.metrics.match.scoreAgainst}` : ''}${a.metrics.match.opponent ? ` · vs ${a.metrics.match.opponent}` : ''}`;
  }
  if (a.metrics?.score) {
    if (a.metrics.score.scoreType === 'racket') {
      return `${a.metrics.score.result ?? 'score'}${a.metrics.score.opponent ? ` · vs ${a.metrics.score.opponent}` : ''}${a.metrics.score.setsFor !== undefined && a.metrics.score.setsAgainst !== undefined ? ` · ${a.metrics.score.setsFor}-${a.metrics.score.setsAgainst}` : ''}`;
    }
    if (a.metrics.score.scoreType === 'golf') {
      return `Golf${a.metrics.score.holesPlayed !== undefined ? ` · ${a.metrics.score.holesPlayed} holes` : ''}${a.metrics.score.strokes !== undefined ? ` · ${a.metrics.score.strokes} slagen` : ''}`;
    }
    return 'Score activiteit';
  }
  if (a.metrics?.skill) {
    return `${a.metrics.skill.techniques && a.metrics.skill.techniques.length > 0 ? a.metrics.skill.techniques.join(', ') : 'Skill'}${a.metrics.skill.attempts !== undefined || a.metrics.skill.successfulAttempts !== undefined ? ` · ${a.metrics.skill.successfulAttempts ?? '-'} / ${a.metrics.skill.attempts ?? '-'} succes` : ''}${a.metrics.skill.grade ? ` · ${a.metrics.skill.grade}` : ''}`;
  }
  if (a.metrics?.laps) {
    return `${a.metrics.laps.distanceMeters !== undefined ? `${Math.round(a.metrics.laps.distanceMeters)} m` : 'Laps'}${a.metrics.laps.laps !== undefined ? ` · ${Math.round(a.metrics.laps.laps)} banen` : ''}${a.metrics.laps.strokeType ? ` · ${a.metrics.laps.strokeType}` : ''}`;
  }
  if (a.metrics?.gps) {
    const parts: string[] = [];
    if (a.metrics.gps.distanceMeters !== undefined) {
      parts.push(`${Math.round(a.metrics.gps.distanceMeters)} m`);
    }
    if (a.metrics.gps.averageSpeedKmh !== undefined && a.metrics.gps.averageSpeedKmh !== null) {
      parts.push(`${a.metrics.gps.averageSpeedKmh.toFixed(1)} km/u gem.`);
    }
    if (a.metrics.gps.maxSpeedKmh !== undefined && a.metrics.gps.maxSpeedKmh !== null) {
      parts.push(`max ${a.metrics.gps.maxSpeedKmh.toFixed(1)} km/u`);
    }
    return parts.length > 0 ? parts.join(' · ') : 'GPS activiteit';
  }
  return 'Geen metrics beschikbaar';
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatTotalDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}u ${minutes}m`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  contentWrapper: {
    gap: 16,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  lastActivityCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  lastActivityTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastActivityName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  lastActivityMeta: {
    fontSize: 14,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 14,
  },
  programBadgeRow: {
    marginBottom: 12,
  },
  programBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  programBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  durationText: {
    fontSize: 15,
    fontWeight: '700',
  },
  metricsSummaryCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricsSummaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricsSummaryText: {
    fontSize: 13,
    lineHeight: 18,
  },
});