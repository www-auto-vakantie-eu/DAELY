import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

const DEFAULT_VISIBILITY = {
  today: true,
  profile: true,
  disciplines: true,
  nutrition: true,
  mind: true,
  community: true,
  feed: false,
} as const;

const TAB_META: Record<string, { label: string; icon: string; visibilityKey?: keyof typeof DEFAULT_VISIBILITY }> = {
  today: { label: 'Vandaag', icon: 'calendar-today', visibilityKey: 'today' },
  index: { label: 'Mijn', icon: 'account', visibilityKey: 'profile' },
  disciplines: { label: 'Bibliotheek', icon: 'dumbbell', visibilityKey: 'disciplines' },
  nutrition: { label: 'Voeding', icon: 'silverware-fork-knife', visibilityKey: 'nutrition' },
  mind: { label: 'Mind', icon: 'meditation', visibilityKey: 'mind' },
  community: { label: 'Community', icon: 'account-multiple', visibilityKey: 'community' },
};

function isTabVisible(routeName: string, tabVisibility: Record<string, boolean | undefined>): boolean {
  const meta = TAB_META[routeName];
  if (!meta || !meta.visibilityKey) return true;
  if (meta.visibilityKey === 'community') return true;
  const value = tabVisibility[meta.visibilityKey];
  return typeof value === 'boolean' ? value : DEFAULT_VISIBILITY[meta.visibilityKey];
}

export function CustomTabBar({ state, descriptors, navigation }: Pick<BottomTabBarProps, 'state' | 'descriptors' | 'navigation'>) {
  const theme = useTheme();
  const { appSettings } = useAppContext();

  const configuredVisibility = appSettings?.tabVisibility ?? DEFAULT_VISIBILITY;

  const visibleRoutes = state.routes.filter((route) => isTabVisible(route.name, configuredVisibility));
  const routesToRender = visibleRoutes.length > 0 ? visibleRoutes : state.routes;

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}> 
      {routesToRender.map((route) => {
        const meta = TAB_META[route.name] || {
          label: route.name,
          icon: 'circle-outline',
        };
        const isFocused = state.index === state.routes.findIndex((item) => item.key === route.key);
        const { options } = descriptors[route.key] || {};
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options?.tabBarAccessibilityLabel}
            // testID={options?.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={meta.icon as any}
              size={26}
              color={isFocused ? theme.tabBarActive : theme.tabBarInactive}
            />
            <Text style={{ color: isFocused ? theme.tabBarActive : theme.tabBarInactive, fontSize: 11 }}>
              {meta.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 80 : 60,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    maxWidth: 64,
  },
});
