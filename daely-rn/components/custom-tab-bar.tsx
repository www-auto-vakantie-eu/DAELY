import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/use-theme';

const TAB_ORDER = ['today', 'index', 'disciplines', 'nutrition', 'mind', 'community'] as const;

const TAB_META: Record<string, { label: string; icon: string }> = {
  today: { label: 'Vandaag', icon: 'calendar-today' },
  index: { label: 'Mijn', icon: 'account' },
  disciplines: { label: 'Bibliotheek', icon: 'dumbbell' },
  nutrition: { label: 'Voeding', icon: 'silverware-fork-knife' },
  mind: { label: 'Mind', icon: 'meditation' },
  community: { label: 'Community', icon: 'account-multiple' },
};

export function CustomTabBar({ state, descriptors, navigation }: Pick<BottomTabBarProps, 'state' | 'descriptors' | 'navigation'>) {
  const theme = useTheme();
  const routesToRender = TAB_ORDER
    .map((name) => state.routes.find((route) => route.name === name))
    .filter((route): route is (typeof state.routes)[number] => Boolean(route));

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
