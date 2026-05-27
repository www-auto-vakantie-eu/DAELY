


import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { SPORT_DISCIPLINES } from './constants/sport-disciplines';
import { getActivities, Activity } from 'services/activity-storage';

export default function TrackerScreen() {
  const router = useRouter();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then((acts) => setRecentActivities(acts.slice(0, 3)));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="DAELY Tracker" />
      <Text style={styles.description}>
        Track elke sport op de manier die past bij jouw discipline.
      </Text>

      <View style={styles.recentBlock}>
        <Text style={styles.recentTitle}>Laatste activiteiten</Text>
        {recentActivities.length === 0 ? (
          <Text style={styles.recentEmpty}>Nog geen activiteiten opgeslagen.</Text>
        ) : (
          recentActivities.map((a) => (
            <View key={a.id} style={styles.recentItem}>
              <Text style={styles.recentName}>{a.disciplineName}</Text>
              <Text style={styles.recentMeta}>{a.durationSeconds}s · {new Date(a.endedAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
        <Pressable style={styles.allActivitiesBtn} onPress={() => router.push('/activities')} accessibilityRole="button">
          <Text style={styles.allActivitiesText}>Alle activiteiten bekijken</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {SPORT_DISCIPLINES.map((discipline) => (
          <Pressable
            key={discipline.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/tracker/[disciplineId]', params: { disciplineId: discipline.id } })}
            android_ripple={{ color: '#E5E7EB' }}
          >
            <Text style={styles.cardTitle}>{discipline.name}</Text>
            <Text style={styles.cardSubtitle}>{discipline.category}</Text>
            <Text style={styles.cardSubtitle}>{discipline.trackingType}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  recentBlock: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recentEmpty: {
    color: '#9CA3AF',
    fontSize: 15,
    fontStyle: 'italic',
  },
  recentItem: {
    marginBottom: 8,
  },
  recentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  recentMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  allActivitiesBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  allActivitiesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});