import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import PageHeader from '../components/PageHeader';

export default function MindScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Mind"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="meditation" size={48} color="#8B5CF6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Mind komt binnenkort naar DAELY.</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Hier vind je straks ademhaling, focus, herstel en mentale routines.
          </Text>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="weather-windy" size={24} color="#10B981" />
            <Text style={[styles.categoryTitle, { color: theme.titleColor }]}>Ademhaling</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>
          <Text style={[styles.categoryText, { color: theme.subtitleColor }]}>
            Ademhalingsoefeningen voor focus en ontspanning.
          </Text>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="brain" size={24} color="#F59E0B" />
            <Text style={[styles.categoryTitle, { color: theme.titleColor }]}>Focus</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>
          <Text style={[styles.categoryText, { color: theme.subtitleColor }]}>
            Focusoefeningen voor mentale scherpte.
          </Text>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="hand-okay" size={24} color="#F4A259" />
            <Text style={[styles.categoryTitle, { color: theme.titleColor }]}>Tapping</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>
          <Text style={[styles.categoryText, { color: theme.subtitleColor }]}>
            Tapping-sessies voor stressreductie en emotionele balans.
          </Text>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="battery-charging" size={24} color="#3B82F6" />
            <Text style={[styles.categoryTitle, { color: theme.titleColor }]}>Herstel</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>
          <Text style={[styles.categoryText, { color: theme.subtitleColor }]}>
            Herstelroutines voor beter slapen en regeneratie.
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/mijn')}>
            <Text style={styles.primaryButtonText}>Terug naar Mijn</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => router.push('/feedback')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Feedback geven</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  categoryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  categoryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 80,
  },
});