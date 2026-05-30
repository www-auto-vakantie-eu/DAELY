import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
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

const SECTION_COPY: Record<ConnectedDeviceStatus, string | null> = {
  available: 'Koppel direct en verrijk je dagdata automatisch.',
  soon: 'Deze koppelingen komen binnenkort beschikbaar.',
  optional_later: 'Optioneel later voor import van bestaande activiteiten en routes.',
};

const DEVICE_BENEFITS: Record<string, string> = {
  whoop: 'Ideaal voor herstel, strain en slaapinzicht.',
  fitbit: 'Voor dagelijkse activiteit, slaap en hartslagtrends.',
  'apple-health': 'Voor iPhone dagdata en gezondheidsmetingen.',
  garmin: 'Voor training, belasting en sportprofielen.',
  'google-fit-health-connect': 'Voor Android activiteit en gezondheidsdata.',
  strava: 'Voor import van historische sessies en routes.',
  polar: 'Voor trainingsbelasting en herstelmetingen.',
  suunto: 'Voor outdoor activiteiten en routegegevens.',
  oura: 'Voor slaapkwaliteit, readiness en herstel.',
  coros: 'Voor running metrics en trainingsprogressie.',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Onbekende fout';
}

export default function DataLinkScreen() {
  const theme = useTheme();
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
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Data koppelen</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>
            Koppel je wearables en apps om je activiteiten, herstel en dagelijkse data automatisch te verrijken.
          </Text>
          <Text style={[styles.introHint, { color: theme.subtitleColor }]}>Je data verschijnt daarna op Vandaag en Data.</Text>
        </View>

        {statusMessage ? <Text style={[styles.feedbackText, { color: theme.subtitleColor }]}>{statusMessage}</Text> : null}

        {SECTION_ORDER.map((status) => (
          <View key={status} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{SECTION_TITLE[status]}</Text>
            {SECTION_COPY[status] ? (
              <Text style={[styles.sectionDescription, { color: theme.subtitleColor }]}>{SECTION_COPY[status]}</Text>
            ) : null}
            <View style={styles.cardList}>
              {groupedDevices[status].map((device) => {
                const isAvailable = device.status === 'available';
                const isSoon = device.status === 'soon';
                const isWhoop = device.id === 'whoop';
                const isBusy = isWhoop && isConnectingWhoop;
                const isConnected = isWhoop && isWhoopConnected;
                const cardVariant = isAvailable
                  ? styles.deviceCardAvailable
                  : isSoon
                    ? styles.deviceCardSoon
                    : styles.deviceCardOptional;

                return (
                  <View key={device.id} style={[styles.deviceCard, cardVariant, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.deviceHeaderRow}>
                      <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isAvailable ? styles.statusAvailable : styles.statusUpcoming,
                          status === 'optional_later' ? styles.statusOptional : null,
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>{CONNECTED_DEVICE_STATUS_LABELS[device.status]}</Text>
                      </View>
                    </View>
                    <Text style={[styles.deviceBenefit, { color: theme.subtitleColor }]}>
                      {DEVICE_BENEFITS[device.id] ?? 'Koppel dit apparaat om extra context aan je data toe te voegen.'}
                    </Text>
                    <View style={styles.chipRow}>
                      {device.dataPoints.map((point) => (
                        <View key={`${device.id}-${point}`} style={[styles.dataChip, { borderColor: theme.border }]}>
                          <Text style={[styles.dataChipText, { color: theme.subtitleColor }]}>{point}</Text>
                        </View>
                      ))}
                    </View>
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

        <View style={[styles.usageCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.usageTitle, { color: theme.titleColor }]}>Waar wordt je data gebruikt?</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Vandaag: dagdata en herstel</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Data: voortgang en trends</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Activiteiten: verrijkte sessies</Text>
        </View>
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
  },
  introHint: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  feedbackText: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  cardList: {
    gap: 12,
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 16,
  },
  deviceCardAvailable: {
    padding: 16,
    borderColor: '#BFDBFE',
  },
  deviceCardSoon: {
    padding: 12,
    opacity: 0.95,
  },
  deviceCardOptional: {
    padding: 14,
    opacity: 0.9,
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
  statusOptional: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: '700',
  },
  deviceBenefit: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  chipRow: {
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
  connectionHint: {
    marginTop: 8,
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
  usageCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  usageItem: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
});
