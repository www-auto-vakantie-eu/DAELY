import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

export default function TappingScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Tapping"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="hand-okay" size={48} color="#F4A259" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Tapping-sessies komen binnenkort beschikbaar.</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Deze module helpt je straks met ontspanning, focus en herstel.
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Binnenkort</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat is Tapping?</Text>
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
            Tapping (ook wel EFT genoemd) is een techniek die je helpt om stress, angst en emotionele spanning los te laten door zachtjes op specifieke punten op je lichaam te tikken terwijl je focust op je uitdaging.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat kun je verwachten?</Text>
          <View style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
            <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Snelle stressreductie</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
            <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Emotionele balans</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
            <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Betere focus</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
            <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Herstel en rust</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/mind')}>
            <Text style={styles.primaryButtonText}>Terug naar Mind</Text>
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
    backgroundColor: 'rgba(244, 162, 89, 0.1)',
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
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#F4A259',
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