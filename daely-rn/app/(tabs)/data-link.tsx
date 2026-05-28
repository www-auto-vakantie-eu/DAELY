import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/PageHeader';
import {
  CONNECTED_DEVICES,
  CONNECTED_DEVICE_STATUS_LABELS,
  type ConnectedDevice,
  type ConnectedDeviceStatus,
  WHOOP_TOKEN_STORAGE_KEY,
} from '../constants/connected-devices';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8085').replace(/\/$/, '');

const SECTION_ORDER: ConnectedDeviceStatus[] = ['available', 'soon', 'optional_later'];

const SECTION_TITLE: Record<ConnectedDeviceStatus, string> = {
  available: 'Beschikbaar',
  soon: 'Binnenkort',
  optional_later: 'Later optioneel',
};

const BUTTON_LABEL: Record<ConnectedDeviceStatus, string> = {
  available: 'Koppelen',
  soon: 'Binnenkort',
  optional_later: 'Later',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Onbekende fout';
}

export default function DataLinkScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isConnectingWhoop, setIsConnectingWhoop] = useState(false);
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const restoreWhoopState = async () => {
      try {
        const tokenRaw = await AsyncStorage.getItem(WHOOP_TOKEN_STORAGE_KEY);
        setIsWhoopConnected(!!tokenRaw);
      } catch {
        setIsWhoopConnected(false);
      }
    };

    restoreWhoopState();
  }, []);

  const connectWhoop = async () => {
    setIsConnectingWhoop(true);
    setStatusMessage('WHOOP login wordt gestart...');

    try {
      const redirectUri =
        Platform.OS === 'web'
          ? `${window.location.origin}/whoop-callback`
          : AuthSession.makeRedirectUri({ path: 'whoop-callback' });
      const state = `whoop-${Date.now()}`;

      const authUrlResponse = await fetch(
        `${API_BASE_URL}/api/whoop/auth/url?state=${encodeURIComponent(state)}&redirectUri=${encodeURIComponent(redirectUri)}`
      );

      if (!authUrlResponse.ok) {
        const errorText = await authUrlResponse.text();
        throw new Error(errorText || 'Kon WHOOP authorization URL niet ophalen');
      }

      const authData = (await authUrlResponse.json()) as { authorizeUrl?: string };
      if (!authData.authorizeUrl) {
        throw new Error('WHOOP authorization URL ontbreekt in backend response');
      }

      setStatusMessage('Open WHOOP login...');
      const authResult = await WebBrowser.openAuthSessionAsync(authData.authorizeUrl, redirectUri);
      if (authResult.type !== 'success' || !authResult.url) {
        if (Platform.OS === 'web' && authData.authorizeUrl) {
          window.location.assign(authData.authorizeUrl);
          return;
        }

        setStatusMessage('WHOOP login geannuleerd.');
        return;
      }

      const callbackUrl = new URL(authResult.url);
      const code = callbackUrl.searchParams.get('code') || '';
      const returnedState = callbackUrl.searchParams.get('state') || '';

      if (!code) {
        throw new Error('Geen OAuth code ontvangen van WHOOP');
      }

      if (returnedState && returnedState !== state) {
        throw new Error('OAuth state mismatch, probeer opnieuw');
      }

      const exchangeResponse = await fetch(`${API_BASE_URL}/api/whoop/oauth/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri, state }),
      });

      if (!exchangeResponse.ok) {
        const errorText = await exchangeResponse.text();
        throw new Error(errorText || 'Token exchange mislukt');
      }

      const exchangeData = (await exchangeResponse.json()) as {
        token?: { access_token?: string; refresh_token?: string; expires_in?: number };
      };
      const accessToken = exchangeData.token?.access_token;

      if (!accessToken) {
        throw new Error('Geen access token ontvangen');
      }

      const profileResponse = await fetch(`${API_BASE_URL}/api/whoop/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        throw new Error(errorText || 'WHOOP profiel ophalen mislukt');
      }

      await AsyncStorage.setItem(
        WHOOP_TOKEN_STORAGE_KEY,
        JSON.stringify({
          ...exchangeData.token,
          connectedAt: new Date().toISOString(),
        })
      );

      setIsWhoopConnected(true);
      setStatusMessage('WHOOP succesvol verbonden.');
      Alert.alert('WHOOP gekoppeld', 'Je WHOOP apparaat is succesvol verbonden.');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setStatusMessage(`WHOOP koppelen mislukt: ${message}`);
      Alert.alert('WHOOP koppelen mislukt', message);
    } finally {
      setIsConnectingWhoop(false);
    }
  };

  const handleConnect = async (device: ConnectedDevice) => {
    if (device.id === 'whoop') {
      await connectWhoop();
      return;
    }

    if (device.id === 'fitbit') {
      setStatusMessage('Koppeling voorbereiden...');
      Alert.alert('Fitbit', 'Koppeling voorbereiden...');
    }
  };

  const groupedDevices = useMemo(() => {
    const grouped: Record<ConnectedDeviceStatus, ConnectedDevice[]> = {
      available: [],
      soon: [],
      optional_later: [],
    };

    for (const device of CONNECTED_DEVICES) {
      grouped[device.status].push(device);
    }

    return grouped;
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="Data koppelen"
        showSettings={false}
        showSearch={false}
        showCart={false}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Automatische data verrijking</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>
            Koppel je wearables en apps om je activiteiten, herstel en dagelijkse data automatisch te verrijken.
          </Text>
          <Text style={[styles.introHint, { color: theme.subtitleColor }]}>Na koppeling verschijnt je data op Vandaag en Data.</Text>
          <Pressable style={styles.linkedDevicesButton} onPress={() => router.push('/(tabs)/connected-devices')}>
            <Text style={styles.linkedDevicesButtonText}>Bekijk gekoppelde apparaten</Text>
          </Pressable>
        </View>

        {statusMessage ? <Text style={[styles.feedbackText, { color: theme.subtitleColor }]}>{statusMessage}</Text> : null}

        {SECTION_ORDER.map((status) => (
          <View key={status} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{SECTION_TITLE[status]}</Text>
            <View style={styles.cardList}>
              {groupedDevices[status].map((device) => {
                const isAvailable = device.status === 'available';
                const isWhoop = device.id === 'whoop';
                const isBusy = isWhoop && isConnectingWhoop;
                const isConnected = isWhoop && isWhoopConnected;

                return (
                  <View key={device.id} style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.deviceHeaderRow}>
                      <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
                      <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusUpcoming]}>
                        <Text style={styles.statusBadgeText}>{CONNECTED_DEVICE_STATUS_LABELS[device.status]}</Text>
                      </View>
                    </View>
                    <Text style={[styles.deviceDataText, { color: theme.subtitleColor }]}>Data: {device.dataPoints.join(', ')}</Text>
                    {isWhoop ? (
                      <Text style={[styles.connectionHint, { color: theme.subtitleColor }]}>
                        Status: {isConnected ? 'Verbonden' : 'Nog niet gekoppeld'}
                      </Text>
                    ) : null}

                    <Pressable
                      style={[
                        styles.actionButton,
                        isAvailable ? styles.actionButtonPrimary : styles.actionButtonDisabled,
                        isBusy ? styles.actionButtonBusy : null,
                      ]}
                      onPress={isAvailable ? () => void handleConnect(device) : undefined}
                      disabled={!isAvailable || isBusy}
                    >
                      {isBusy ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.actionButtonText}>{BUTTON_LABEL[device.status]}</Text>
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
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
  },
  introCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
  },
  introHint: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  linkedDevicesButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkedDevicesButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  feedbackText: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardList: {
    gap: 10,
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusAvailable: {
    backgroundColor: '#DBEAFE',
  },
  statusUpcoming: {
    backgroundColor: '#E5E7EB',
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: '700',
  },
  deviceDataText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  connectionHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 12,
    borderRadius: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#1D4ED8',
  },
  actionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  actionButtonBusy: {
    opacity: 0.9,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
