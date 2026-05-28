import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { getActivities, Activity } from 'services/activity-storage';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();

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

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Activiteiten" />

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Totaal activiteiten</Text>
          <Text style={styles.summaryValue}>{activities.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Totale sporttijd</Text>
          <Text style={styles.summaryValue}>{formatTotalDuration(totalDurationSeconds)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Disciplines</Text>
          <Text style={styles.summaryValue}>{uniqueDisciplines}</Text>
        </View>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nog geen activiteiten</Text>
          <Text style={styles.emptyText}>Start je eerste activiteit met DAELY Tracker.</Text>
          <Pressable style={styles.startButton} onPress={() => router.push('/tracker')}>
            <Text style={styles.startButtonText}>Start activiteit</Text>
          </Pressable>
        </View>
      ) : (
        activities.map((a) => (
          <Pressable
            key={a.id}
            style={styles.itemCard}
            onPress={() => router.push({ pathname: '/activities/[id]', params: { id: a.id } })}
          >
            <View style={styles.itemTopRow}>
              <Text style={styles.name}>{a.disciplineName}</Text>
              <Text style={styles.status}>{a.status}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.trackingTypeIndicator}>{trackingTypeCode(a.trackingType)}</Text>
              <Text style={styles.trackingTypeBadge}>{a.trackingType}</Text>
              <Text style={styles.metaText}>{formatDate(a.endedAt)}</Text>
            </View>

            <Text style={styles.durationText}>Duur: {formatDuration(a.durationSeconds)}</Text>

            <View style={styles.metricsSummaryCard}>
              <Text style={styles.metricsSummaryLabel}>Samenvatting</Text>
              <Text style={styles.metricsSummaryText}>{getMetricsSummary(a)}</Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
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
    return `${a.metrics.workout.exercises?.length ?? 0} oefeningen${a.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(a.metrics.workout.totalVolumeKg)} kg volume` : ''}`;
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
    return `${a.metrics.gps.distanceMeters !== undefined ? `${Math.round(a.metrics.gps.distanceMeters)} m` : 'GPS activiteit'}${a.metrics.gps.averageSpeedKmh !== undefined ? ` · ${a.metrics.gps.averageSpeedKmh.toFixed(1)} km/u gem.` : ''}${a.metrics.gps.maxSpeedKmh !== undefined ? ` · max ${a.metrics.gps.maxSpeedKmh.toFixed(1)} km/u` : ''}`;
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
  return d.toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  summaryItem: {
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  emptyCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  status: {
    fontSize: 12,
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  trackingTypeIndicator: {
    backgroundColor: '#E2E8F0',
    color: '#334155',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },
  trackingTypeBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 8,
    overflow: 'hidden',
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  metricsSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
  },
  metricsSummaryLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  metricsSummaryText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
});
