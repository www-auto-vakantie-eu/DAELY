import React from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

// Dummy data, later vervangen door echte gekoppelde apparaten uit de backend
const CONNECTED_DEVICES = [
  {
    name: 'Garmin',
    logo: 'https://1000logos.net/wp-content/uploads/2021/05/Garmin-logo.png',
    status: 'Verbonden',
  },
  {
    name: 'Fitbit',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Fitbit_logo.png',
    status: 'Verbonden',
  },
  // Voeg meer dummy devices toe indien gewenst
];

export default function ConnectedDevicesScreen() {
  const theme = useTheme();

  const showDetailsFallback = (deviceName: string) => {
    Alert.alert('Binnenkort beschikbaar', `Details voor ${deviceName} volgen binnenkort.`);
  };

  const showUnlinkFallback = (deviceName: string) => {
    Alert.alert('Binnenkort beschikbaar', `${deviceName} ontkoppelen volgt binnenkort.`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.titleColor }]}>Gekoppelde apparaten</Text>
      {CONNECTED_DEVICES.length === 0 ? (
        <Text style={[styles.empty, { color: theme.subtitleColor }]}>Je hebt nog geen apparaten gekoppeld.</Text>
      ) : (
        CONNECTED_DEVICES.map((device) => (
          <View key={device.name} style={styles.deviceRow}>
            <Image source={{ uri: device.logo }} style={styles.deviceLogo} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
              <Text style={[styles.deviceStatus, { color: theme.subtitleColor }]}>{device.status}</Text>
            </View>
            <Pressable style={styles.detailsBtn} onPress={() => showDetailsFallback(device.name)}>
              <MaterialCommunityIcons name="information-outline" size={22} color="#2563EB" />
              <Text style={styles.detailsText}>Details</Text>
            </Pressable>
            <Pressable style={styles.unlinkBtn} onPress={() => showUnlinkFallback(device.name)}>
              <MaterialCommunityIcons name="link-off" size={22} color="#EF4444" />
              <Text style={styles.unlinkText}>Ontkoppelen</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  deviceLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
  },
  deviceStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    marginLeft: 12,
  },
  detailsText: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  unlinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    marginLeft: 12,
  },
  unlinkText: {
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
});
