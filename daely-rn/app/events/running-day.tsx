import React from 'react';
import { Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function EventRunningDayScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80' }} style={styles.headerImage} resizeMode="cover" />
      <Text style={[styles.title, { color: theme.titleColor }]}>Running Day Utrecht</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Hardloopevenement voor alle niveaus</Text>
      <Text style={styles.sectionTitle}>Datum & Locatie</Text>
      <Text style={styles.text}>15 september 2026, Utrecht centrum</Text>
      <Text style={styles.sectionTitle}>Beschrijving</Text>
      <Text style={styles.text}>
        Running Day Utrecht is hét hardloopevenement voor jong en oud. Kies uit 5, 10 of 21 kilometer. Geniet van een sfeervol parcours door de stad en ontvang een medaille na afloop. Ook voor wandel- en kidsruns.
      </Text>
      <Text style={styles.sectionTitle}>Inschrijven</Text>
      <Text style={styles.text}>Aanmelden via runningdayutrecht.nl</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  headerImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
  },
});
