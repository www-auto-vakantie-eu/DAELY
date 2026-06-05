import React from 'react';
import { Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function EventHyroxScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Image source={{ uri: 'https://www.angelsgym.nl/wp-content/uploads/2026/02/hyrox-training-gym-sportschool.png' }} style={styles.headerImage} resizeMode="cover" />
      <Text style={[styles.title, { color: theme.titleColor }]}>HYROX Rotterdam 2026</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Functionele fitnesswedstrijd voor iedereen</Text>
      <Text style={styles.sectionTitle}>Datum & Locatie</Text>
      <Text style={styles.text}>12 april 2026, Rotterdam Ahoy</Text>
      <Text style={styles.sectionTitle}>Beschrijving</Text>
      <Text style={styles.text}>
        HYROX is een internationale fitnessrace die kracht, uithoudingsvermogen en snelheid combineert. Doe mee aan de Rotterdam-editie en test je fitheid tegen atleten van elk niveau. Zowel solo als in teamverband mogelijk.
      </Text>
      <Text style={styles.sectionTitle}>Inschrijven</Text>
      <Text style={styles.text}>Ga naar hyrox.com voor tickets en meer info.</Text>
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
