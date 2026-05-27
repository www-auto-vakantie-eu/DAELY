import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PARTNERS } from '@/constants/partners';
import { PARTNER_LOGO_ASSETS } from '@/constants/partner-logo-assets';
import { Image } from 'react-native';

export default function PartnerInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const partner = PARTNERS.find((p) => p.id === id);

  if (!partner) {
    return (
      <View style={styles.centered}>
        <Text>Partner niet gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={PARTNER_LOGO_ASSETS[partner.id] ? PARTNER_LOGO_ASSETS[partner.id] : { uri: partner.image }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{partner.name}</Text>
        <Text style={styles.intro}>{partner.summary || 'Geen introductie beschikbaar.'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Producten</Text>
        <Text>{partner.category || 'Geen informatie.'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Samenwerking met Creators</Text>
        <Text>{partner.discountLabel || 'Geen informatie.'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus</Text>
        <Text>{partner.group || 'Geen informatie.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  intro: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
