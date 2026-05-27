import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';

export default function FindCoachScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<'online' | 'personal'>('online');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <PageHeader
        title="Find Coach"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterButton, filter === 'online' && styles.filterButtonActive]}
          onPress={() => setFilter('online')}
        >
          <Text style={{ color: filter === 'online' ? '#fff' : theme.titleColor }}>Online</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, filter === 'personal' && styles.filterButtonActive]}
          onPress={() => setFilter('personal')}
        >
          <Text style={{ color: filter === 'personal' ? '#fff' : theme.titleColor }}>Personal</Text>
        </Pressable>
      </View>
      <View style={styles.placeholderBox}>
        <Text style={{ color: theme.subtitleColor }}>
          Hier komen straks alle coaches in de buurt ({filter === 'online' ? 'Online' : 'Personal'}).
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  filterRow: { flexDirection: 'row', marginBottom: 24 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  placeholderBox: {
    marginTop: 32,
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
  },
});
