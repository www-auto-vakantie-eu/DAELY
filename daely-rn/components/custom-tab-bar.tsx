import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/use-theme';

const TAB_CONFIG = [
  { name: 'today', label: 'Vandaag', icon: 'calendar-today' },
  { name: 'index', label: 'Mijn', icon: 'account' },
  { name: 'disciplines', label: 'Bibliotheek', icon: 'dumbbell' },
  { name: 'nutrition', label: 'Voeding', icon: 'silverware-fork-knife' },
  { name: 'mind', label: 'Mind', icon: 'meditation' },
  { name: 'community', label: 'Community', icon: 'account-multiple' },
];

export function CustomTabBar({ state, descriptors, navigation }: Pick<BottomTabBarProps, 'state' | 'descriptors' | 'navigation'>) {
  const theme = useTheme();
  return (
    <View style={[styles.tabBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}> 
      {TAB_CONFIG.map((tab, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[state.routes[index].key] || {};
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };
        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options?.tabBarAccessibilityLabel}
            // testID={options?.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={26}
              color={isFocused ? theme.tabBarActive : theme.tabBarInactive}
            />
            <Text style={{ color: isFocused ? theme.tabBarActive : theme.tabBarInactive, fontSize: 11 }}>
              {tab.label}
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
