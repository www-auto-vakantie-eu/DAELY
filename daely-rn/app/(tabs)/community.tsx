import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

export default function CommunityScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Community"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.badgeText}>Binnenkort</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>DAELY Community komt binnenkort beschikbaar</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Volg straks sporters, creators, challenges en teams binnen jouw disciplines.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wat je kunt verwachten</Text>
        </View>

        <View style={styles.previewSection}>
          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="account-group" size={24} color="#2563EB" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Athlete to Athlete</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Verbind met andere sporters</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Challenges</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Doe mee aan challenges</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="star" size={24} color="#8B5CF6" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Creators</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Volg je favoriete creators</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="account-multiple" size={24} color="#059669" />
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Teams & Clubs</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Sluit je aan bij teams</Text>
            </View>
          </View>
        </View>

        <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
          <View style={styles.noticeContent}>
            <Text style={[styles.noticeTitle, { color: theme.titleColor }]}>Preview Mode</Text>
            <Text style={[styles.noticeText, { color: theme.subtitleColor }]}>
              Dit is een preview van wat de DAELY Community zal worden. Binnenkort voegen we volledige functionaliteit toe.
            </Text>
          </View>
        </View>

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
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  bottomSpacer: {
    height: 22,
  },
});