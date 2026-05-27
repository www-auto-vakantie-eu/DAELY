
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PageHeader from '../components/PageHeader';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';

export default function DisciplineDetail() {
  const { disciplineId } = useLocalSearchParams<{ disciplineId: string }>();
  const router = useRouter();

  const discipline = SPORT_DISCIPLINES.find(d => d.id === disciplineId);

  if (!discipline) {
    return (
      <View style={styles.container}>
        <PageHeader title="Discipline niet gevonden" />
        <Text style={styles.fallback}>Deze discipline bestaat niet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title={discipline.name} />
      <Text style={styles.meta}>
        {discipline.category}
        {discipline.trackingType ? ` · ${discipline.trackingType}` : ''}
      </Text>
      <Text style={styles.placeholder}>Activiteit tracking komt hier</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/tracker/[disciplineId]/start', params: { disciplineId } })}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Start activiteit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  fallback: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 32,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
