import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8085').replace(/\/$/, '');
const WHOOP_TOKEN_STORAGE_KEY = 'whoop_oauth_token';

const DEVICES = [
  { name: 'Garmin', icon: 'watch-variant', logo: 'https://1000logos.net/wp-content/uploads/2021/05/Garmin-logo.png' },
  { name: 'Fitbit', icon: 'watch-variant', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Fitbit_logo.png' },
  { name: 'Polar', icon: 'watch-variant' },
  { name: 'Suunto', icon: 'watch-variant' },
  { name: 'Apple Watch', icon: 'apple-watch' },
  { name: 'Google Fit', icon: 'google-fit' },
  { name: 'Oura', icon: 'ring' },
  { name: 'Withings', icon: 'watch-variant' },
  { name: 'Xiaomi / Amazfit / Zepp', icon: 'watch-variant' },
  { name: 'Wahoo Fitness', icon: 'watch-variant' },
  { name: 'Whoop', icon: 'watch-variant' },
  { name: 'Samsung Health', icon: 'cellphone' },
  { name: 'Coros', icon: 'watch-variant' },
];

export default function DataLinkScreen() {
  const theme = useTheme();
  const [isConnectingWhoop, setIsConnectingWhoop] = useState(false);
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

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
          : AuthSession.makeRedirectUri({ path: 'whoop-callback', useProxy: false });
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
    } catch (error: any) {
      setStatusMessage(`WHOOP koppelen mislukt: ${error?.message || 'Onbekende fout'}`);
      Alert.alert('WHOOP koppelen mislukt', error?.message || 'Onbekende fout');
    } finally {
      setIsConnectingWhoop(false);
    }
  };

  const onPressDevice = async (deviceName: string) => {
    if (deviceName.toLowerCase() === 'whoop') {
      await connectWhoop();
      return;
    }

    Alert.alert('Nog niet beschikbaar', `${deviceName} koppeling volgt binnenkort.`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.titleColor }]}>Koppel je apparaat</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Selecteer een apparaat om te koppelen.</Text>
      {statusMessage ? <Text style={[styles.feedbackText, { color: theme.subtitleColor }]}>{statusMessage}</Text> : null}
      <View style={styles.deviceList}>
        {DEVICES.map((device) => (
          <Pressable key={device.name} style={styles.deviceButton} onPress={() => onPressDevice(device.name)}>
            {device.logo ? (
              <Image source={{ uri: device.logo }} style={styles.deviceLogo} resizeMode="contain" />
            ) : (
              <MaterialCommunityIcons name={device.icon as any} size={28} color={theme.titleColor} style={{ marginRight: 16 }} />
            )}
            <Text style={[styles.deviceLabel, { color: theme.titleColor }]}>{device.name}</Text>
            {device.name.toLowerCase() === 'whoop' ? (
              <View style={styles.statusPill}>
                {isConnectingWhoop ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Text style={[styles.statusText, { color: isWhoopConnected ? '#059669' : '#2563EB' }]}>
                    {isWhoopConnected ? 'Verbonden' : 'Koppelen'}
                  </Text>
                )}
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  deviceList: {
    width: '100%',
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceLabel: {
    fontSize: 18,
    flex: 1,
  },
  deviceLogo: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  statusPill: {
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#E0F2FE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
