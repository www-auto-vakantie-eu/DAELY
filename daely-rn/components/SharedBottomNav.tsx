import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

const TAB_ORDER = ['today', 'mijn', 'disciplines', 'nutrition', 'mind', 'community'] as const;

const TAB_META: Record<string, { label: string; icon: string; route: string }> = {
  today: { label: 'Vandaag', icon: 'calendar-today', route: '/(tabs)/today' },
  mijn: { label: 'Mijn', icon: 'account', route: '/(tabs)/mijn' },
  disciplines: { label: 'Bibliotheek', icon: 'dumbbell', route: '/(tabs)/disciplines' },
  nutrition: { label: 'Voeding', icon: 'silverware-fork-knife', route: '/(tabs)/nutrition' },
  mind: { label: 'Mind', icon: 'meditation', route: '/(tabs)/mind' },
  community: { label: 'Community', icon: 'account-multiple', route: '/(tabs)/community' },
};

interface SharedBottomNavProps {
  activeTab?: string;
}

export default function SharedBottomNav({ activeTab = 'disciplines' }: SharedBottomNavProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      {TAB_ORDER.map((tab) => {
        const meta = TAB_META[tab];
        const isFocused = activeTab === tab;
        const onPress = () => {
          router.push(meta.route as any);
        };
        return (
          <TouchableOpacity
            key={tab}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
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