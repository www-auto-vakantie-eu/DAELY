
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { CustomTabBar } from '@/components/custom-tab-bar';
import { HapticTab } from '@/components/haptic-tab';
import { AppScreen } from '@/components/AppScreen';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { GlobalCartButton } from '../components/GlobalCartButton';

export default function TabLayout() {
  const router = useRouter();
  const { isLoggedIn, isAppHydrated } = useAppContext();

  const theme = useTheme();

  useEffect(() => {
    if (isAppHydrated && !isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isAppHydrated, isLoggedIn, router]);

  return (
    <AppScreen>
      <GlobalCartButton />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              paddingBottom: 32,
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
            default: {
              paddingBottom: 12,
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
          }),
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="today"
          options={{
            title: 'Vandaag',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="calendar-today" color={color} />,
          }}
        />
        <Tabs.Screen
          name="mijn"
          options={{
            title: 'Mijn',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="account" color={color} />,
          }}
        />
        <Tabs.Screen
          name="disciplines"
          options={{
            title: 'Bibliotheek',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="dumbbell" color={color} />,
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Voeding',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="silverware-fork-knife" color={color} />,
          }}
        />
        <Tabs.Screen
          name="mind"
          options={{
            title: 'Mind',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="meditation" color={color} />,
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarIcon: ({ color }: any) => <MaterialCommunityIcons size={26} name="account-multiple" color={color} />,
          }}
        />
        {/* Progress tab verwijderd */}
      </Tabs>
    </AppScreen>
  );
}
