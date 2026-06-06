import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

export default function ChallengesIndexScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Challenges"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="trophy" size={32} color="#F59E0B" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Challenges komen binnenkort beschikbaar</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Hier vind je straks sportieve uitdagingen en voortgang.
          </Text>
        </View>

        <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
          <View style={styles.noticeContent}>
            <Text style={[styles.noticeTitle, { color: theme.titleColor }]}>Voorbereid</Text>
            <Text style={[styles.noticeText, { color: theme.subtitleColor }]}>
              DAELY bereidt momenteel challenges voor. Je kunt straks deelnemen aan sportieve uitdagingen, je voortgang bijhouden en deelnemen aan community challenges.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wat kun je verwachten?</Text>
        </View>

        <View style={styles.previewSection}>
          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="calendar-star" size={24} color="#F59E0B" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Persoonlijke Challenges</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Stel je eigen doelen en tijdslijnen</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="account-group" size={24} color="#2563EB" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Community Challenges</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Doe mee met groepsuitdagingen</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#059669" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Voortgang Tracking</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Houd je resultaten bij</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Ondertussen</Text>
        </View>

        <Pressable
          style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/tracker')}
        >
          <MaterialCommunityIcons name="run-fast" size={22} color={theme.titleColor} />
          <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Start activiteit</Text>
          <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Open DAELY Tracker</Text>
        </Pressable>

        <Pressable
          style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/activities')}
        >
          <MaterialCommunityIcons name="history" size={22} color={theme.titleColor} />
          <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Bekijk activiteiten</Text>
          <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Zie je workout-log</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
  },
  noticeCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewSection: {
    gap: 12,
    marginBottom: 24,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: 22,
  },
});