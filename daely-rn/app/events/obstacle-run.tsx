import React from 'react';
import { Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function EventObstacleRunScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Image source={{ uri: 'https://www.spartan.com/cdn/shop/articles/obstacle-race-training.jpg' }} style={styles.headerImage} resizeMode="cover" />
      <Text style={[styles.title, { color: theme.titleColor }]}>Obstacle Run Amsterdam</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Uitdagend parcours vol obstakels</Text>
      <Text style={styles.sectionTitle}>Datum & Locatie</Text>
      <Text style={styles.text}>28 juni 2026, Amsterdam Bos</Text>
      <Text style={styles.sectionTitle}>Beschrijving</Text>
      <Text style={styles.text}>
        De Obstacle Run Amsterdam is een avontuurlijke race met modder, water en uitdagende hindernissen. Geschikt voor beginners en gevorderden. Kies uit verschillende afstanden en beleef een sportieve dag met vrienden of familie.
      </Text>
      <Text style={styles.sectionTitle}>Inschrijven</Text>
      <Text style={styles.text}>Meer info en inschrijven via obstaclerunamsterdam.nl</Text>
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
