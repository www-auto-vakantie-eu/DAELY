import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { CONNECTED_DEVICES, type ConnectedDevice, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';

const VISIBLE_DEVICE_IDS = new Set(['whoop', 'fitbit', 'apple-health', 'garmin', 'google-fit-health-connect']);

const DEVICE_BENEFITS: Record<string, string> = {
  whoop: 'Voor herstel, strain en slaapinzicht in je dagelijkse ritme.',
  fitbit: 'Voor stappen, hartslag en slaaptrends in je dagoverzicht.',
  'apple-health': 'Voor iPhone-gezondheidsdata en workouts op een plek.',
  garmin: 'Voor sportprofielen, training en belasting op detailniveau.',
  'google-fit-health-connect': 'Voor Android dagdata en gezondheidsmetingen.',
};

type DeviceUiStatus = 'connected' | 'not_connected' | 'soon';

export default function ConnectedDevicesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);

  useEffect(() => {
    const restoreDeviceState = async () => {
      try {
        const values = await AsyncStorage.multiGet([WHOOP_TOKEN_STORAGE_KEY, 'fitbit_oauth_token', 'fitbit_connected']);
        const valueMap = new Map(values);

        setIsWhoopConnected(!!valueMap.get(WHOOP_TOKEN_STORAGE_KEY));
        const fitbitConnected = !!valueMap.get('fitbit_oauth_token') || valueMap.get('fitbit_connected') === 'true';
        setIsFitbitConnected(fitbitConnected);
      } catch {
        setIsWhoopConnected(false);
        setIsFitbitConnected(false);
      }
    };

    void restoreDeviceState();
  }, []);

  const visibleDevices = useMemo(
    () => CONNECTED_DEVICES.filter((device) => VISIBLE_DEVICE_IDS.has(device.id)),
    []
  );

  const isDeviceConnected = (device: ConnectedDevice): boolean => {
    if (device.id === 'whoop') {
      return isWhoopConnected;
    }

    if (device.id === 'fitbit') {
      return isFitbitConnected;
    }

    return false;
  };

  const connectedCount = visibleDevices.filter((device) => isDeviceConnected(device)).length;
  const connectableCount = visibleDevices.filter((device) => device.status === 'available' && !isDeviceConnected(device)).length;
  const soonCount = visibleDevices.filter((device) => device.status === 'soon').length;

  const getDeviceStatus = (device: ConnectedDevice): DeviceUiStatus => {
    if (device.status === 'soon') {
      return 'soon';
    }

    return isDeviceConnected(device) ? 'connected' : 'not_connected';
  };

  const getStatusLabel = (status: DeviceUiStatus): string => {
    if (status === 'connected') {
      return 'Verbonden';
    }

    if (status === 'soon') {
      return 'Binnenkort';
    }

    return 'Nog niet gekoppeld';
  };

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
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Jouw gekoppelde data</Text>
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>Bekijk welke wearables en apps verbonden zijn met DAELY.</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.metricValue, { color: theme.titleColor }]}>{connectedCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Verbonden</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.metricValue, { color: theme.titleColor }]}>{connectableCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Koppelbaar</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.metricValue, { color: theme.titleColor }]}>{soonCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.subtitleColor }]}>Binnenkort</Text>
          </View>
        </View>

        {connectedCount === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen apparaten gekoppeld.</Text>
            <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>Koppel WHOOP of Fitbit om je data automatisch te verrijken.</Text>
            <Pressable style={styles.primaryLinkButton} onPress={() => router.push('/(tabs)/data-link')}>
              <Text style={styles.primaryLinkButtonText}>Data koppelen</Text>
            </Pressable>
          </View>
        ) : null}

        {visibleDevices.map((device) => {
          const uiStatus = getDeviceStatus(device);
          const isSoon = uiStatus === 'soon';
          const showConnectCta = uiStatus === 'not_connected' && (device.id === 'whoop' || device.id === 'fitbit');

          return (
            <View key={device.id} style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <View style={styles.deviceHeader}>
                <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
                <View
                  style={[
                    styles.statePill,
                    uiStatus === 'connected'
                      ? styles.statePillConnected
                      : isSoon
                        ? styles.statePillSoon
                        : styles.statePillDisconnected,
                  ]}
                >
                  <Text style={styles.statePillText}>{getStatusLabel(uiStatus)}</Text>
                </View>
              </View>

              <Text style={[styles.deviceBenefit, { color: theme.subtitleColor }]}>
                {DEVICE_BENEFITS[device.id] ?? 'Koppeling beschikbaar voor extra dataverrijking.'}
              </Text>

              <View style={styles.chipsRow}>
                {device.dataPoints.map((point) => (
                  <View key={`${device.id}-${point}`} style={[styles.dataChip, { borderColor: theme.border }]}>
                    <Text style={[styles.dataChipText, { color: theme.subtitleColor }]}>{point}</Text>
                  </View>
                ))}
              </View>

              {showConnectCta ? (
                <Pressable style={styles.cardButtonPrimary} onPress={() => router.push('/(tabs)/data-link')}>
                  <Text style={styles.cardButtonPrimaryText}>Koppelen</Text>
                </Pressable>
              ) : null}

              {isSoon ? (
                <View style={styles.cardButtonDisabled}>
                  <Text style={styles.cardButtonDisabledText}>Binnenkort</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        <Pressable style={styles.bottomButton} onPress={() => router.push('/(tabs)/data-link')}>
          <Text style={styles.bottomButtonText}>Data koppelen</Text>
        </Pressable>
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
    gap: 14,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
  },
  primaryLinkButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryLinkButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  deviceName: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  deviceBenefit: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  chipsRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F8FAFC',
  },
  dataChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statePill: {
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
  statePillSoon: {
    backgroundColor: '#E5E7EB',
  },
  statePillText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },
  cardButtonPrimary: {
    marginTop: 12,
    borderRadius: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
  },
  cardButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardButtonDisabled: {
    marginTop: 12,
    borderRadius: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9CA3AF',
    opacity: 0.9,
  },
  cardButtonDisabledText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomButton: {
    marginTop: 2,
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
