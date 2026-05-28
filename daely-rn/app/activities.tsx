import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Pressable } from 'react-native';
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

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Activiteiten" />
      {activities.length === 0 ? (
        <Text style={styles.empty}>Nog geen activiteiten opgeslagen.</Text>
      ) : (
        activities.map((a) => (
          <Pressable
            key={a.id}
            style={styles.item}
            onPress={() => router.push({ pathname: '/activities/[id]', params: { id: a.id } })}
          >
            <Text style={styles.name}>{a.disciplineName}</Text>
            <Text style={styles.meta}>{a.trackingType} · {formatDuration(a.durationSeconds)} · {formatDate(a.endedAt)}</Text>
            {a.metrics?.workout && (
              <Text style={styles.workoutMeta}>
                {a.metrics.workout.exercises?.length ?? 0} oefeningen
                {a.metrics.workout.totalVolumeKg !== undefined ? ` · Volume ${Math.round(a.metrics.workout.totalVolumeKg)} kg` : ''}
              </Text>
            )}
            {a.metrics?.session && (
              <Text style={styles.sessionMeta}>
                {a.metrics.session.intensity ? `Intensiteit ${a.metrics.session.intensity}` : 'Session'}
                {a.metrics.session.focusAreas && a.metrics.session.focusAreas.length > 0
                  ? ` · ${a.metrics.session.focusAreas.join(', ')}`
                  : ''}
              </Text>
            )}
            {a.metrics?.match && (
              <Text style={styles.matchMeta}>
                {a.metrics.match.matchType ? a.metrics.match.matchType : 'match'}
                {a.metrics.match.scoreFor !== undefined && a.metrics.match.scoreAgainst !== undefined
                  ? ` · ${a.metrics.match.scoreFor}-${a.metrics.match.scoreAgainst}`
                  : ''}
                {a.metrics.match.opponent ? ` · vs ${a.metrics.match.opponent}` : ''}
              </Text>
            )}
            <Text style={styles.status}>{a.status}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
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
  empty: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: '#22C55E',
  },
  workoutMeta: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  sessionMeta: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  matchMeta: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
});
