import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { CONNECTED_DEVICES, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';

export default function ConnectedDevicesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);

  useEffect(() => {
    const restoreWhoopState = async () => {
      try {
        const tokenRaw = await AsyncStorage.getItem(WHOOP_TOKEN_STORAGE_KEY);
        setIsWhoopConnected(!!tokenRaw);
      } catch {
        setIsWhoopConnected(false);
      }
    };

    void restoreWhoopState();
  }, []);

  const connectableDevices = useMemo(
    () => CONNECTED_DEVICES.filter((device) => device.status === 'available'),
    []
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="Gekoppelde apparaten"
        showSettings={false}
        showSearch={false}
        showCart={false}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Automatische data</Text>
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>Koppel een apparaat via Data koppelen om je statistieken automatisch te verrijken.</Text>
          <Pressable style={styles.openLinkButton} onPress={() => router.push('/(tabs)/data-link')}>
            <Text style={styles.openLinkButtonText}>Naar Data koppelen</Text>
          </Pressable>
        </View>

        {connectableDevices.map((device) => {
          const isConnected = device.id === 'whoop' ? isWhoopConnected : false;

          return (
            <View key={device.id} style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
              <Text style={[styles.deviceData, { color: theme.subtitleColor }]}>Data: {device.dataPoints.join(', ')}</Text>
              <View style={[styles.statePill, isConnected ? styles.statePillConnected : styles.statePillDisconnected]}>
                <Text style={styles.statePillText}>{isConnected ? 'Verbonden' : 'Nog niet gekoppeld'}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  openLinkButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  openLinkButtonText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  deviceName: {
    fontSize: 17,
    fontWeight: '800',
  },
  deviceData: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  statePill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statePillConnected: {
    backgroundColor: '#DCFCE7',
  },
  statePillDisconnected: {
    backgroundColor: '#E5E7EB',
  },
  statePillText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },
});
