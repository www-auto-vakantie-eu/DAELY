import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PageHeader from '../components/PageHeader';
import { getActivities, Activity } from 'services/activity-storage';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    getActivities().then((acts) => {
      setActivity(acts.find((a) => a.id === id) || null);
    });
  }, [id]);

  if (!activity) {
    return (
      <View style={styles.container}>
        <PageHeader title="Activiteit" />
        <Text style={styles.fallback}>Activiteit niet gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={activity.disciplineName || 'Activiteit'} />
      <Text style={styles.meta}>{formatDate(activity.endedAt)}</Text>
      <Text style={styles.meta}>{activity.disciplineName} · {activity.trackingType}</Text>
      <Text style={styles.meta}>Duur: {formatDuration(activity.durationSeconds)}</Text>
      <Text style={styles.meta}>Status: {activity.status}</Text>
      {activity.notes && (
        <Text style={styles.notes}>Notities: {activity.notes}</Text>
      )}
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholder}>Metrics komen binnenkort voor deze discipline.</Text>
      </View>
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
  fallback: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  meta: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
  },
  notes: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
  },
  placeholderBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  placeholder: {
    color: '#6B7280',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
