import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import AppWebContainer from './components/AppWebContainer';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, isAppHydrated, appSettings } = useAppContext();

  if (!isAppHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ThemeProvider value={appSettings.darkMode || colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppWebContainer>
        <Stack screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </AppWebContainer>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
