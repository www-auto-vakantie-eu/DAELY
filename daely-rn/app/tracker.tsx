

import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { SPORT_DISCIPLINES } from './constants/sport-disciplines';

export default function TrackerScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <PageHeader title="DAELY Tracker" />
      <Text style={styles.description}>
        Track elke sport op de manier die past bij jouw discipline.
      </Text>
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