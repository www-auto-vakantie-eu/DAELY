import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

const MENU_ITEMS = [
  { id: 'today', label: 'Vandaag', icon: 'calendar-today', route: '/(tabs)/index' },
  { id: 'mijn', label: 'Mijn', icon: 'account', route: '/(tabs)/mijn' },
  { id: 'disciplines', label: 'Bibliotheek', icon: 'dumbbell', route: '/(tabs)/disciplines' },
  { id: 'nutrition', label: 'Voeding', icon: 'silverware-fork-knife', route: '/(tabs)/nutrition' },
  { id: 'mind', label: 'Mind', icon: 'meditation', route: '/(tabs)/mind' },
  { id: 'community', label: 'Community', icon: 'account-multiple', route: '/(tabs)/community' },
] as const;

interface AppBottomMenuProps {
  activeRoute?: string;
}

export function AppBottomMenu({ activeRoute }: AppBottomMenuProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.menuBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      {MENU_ITEMS.map((item) => {
        const isFocused = activeRoute === item.id;
        const onPress = () => {
          router.push(item.route as any);
        };
        return (
          <TouchableOpacity
            key={item.id}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={item.label}
            onPress={onPress}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={26}
              color={isFocused ? theme.tabBarActive : theme.tabBarInactive}
            />
            <Text style={{ color: isFocused ? theme.tabBarActive : theme.tabBarInactive, fontSize: 11 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 80 : 60,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    maxWidth: 64,
  },
});