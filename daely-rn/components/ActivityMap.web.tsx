import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { GpsRoutePoint } from 'services/activity-storage';

interface ActivityMapProps {
  routePoints: GpsRoutePoint[];
}

export default function ActivityMap({ routePoints }: ActivityMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Routekaart</Text>
        <Text style={styles.subtitle}>
          {routePoints.length > 0
            ? `${routePoints.length} routepunten beschikbaar`
            : 'Geen routegegevens beschikbaar'}
        </Text>
        <Text style={styles.note}>
          Routekaart is beschikbaar op mobiel.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});