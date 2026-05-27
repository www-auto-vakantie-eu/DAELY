import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';

export default function MyOrdersScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="My Orders"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="package-variant-closed" size={36} color={theme.tabBarActive} />
        <Text style={[styles.title, { color: theme.titleColor }]}>My Orders</Text>
        <Text style={[styles.description, { color: theme.subtitleColor }]}>
          Hier vind je binnenkort je bestellingen, pakketten en aankopen.
        </Text>
        <Text style={[styles.emptyState, { color: theme.subtitleColor }]}>Nog geen bestellingen.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
});
