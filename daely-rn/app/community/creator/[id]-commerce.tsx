import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../../components/PageHeader';

export default function CreatorCommerceScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="Creator Commerce"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.badgeText}>Binnenkort</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Creator omgeving komt binnenkort beschikbaar</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Partnerintegraties en creator marketplace worden voorbereid.
          </Text>
        </View>

        <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
          <View style={styles.noticeContent}>
            <Text style={[styles.noticeTitle, { color: theme.titleColor }]}>Preview Mode</Text>
            <Text style={[styles.noticeText, { color: theme.subtitleColor }]}>
              Dit is een preview van wat de DAELY Creator Commerce zal worden. Binnenkort voegen we volledige functionaliteit toe.
            </Text>
          </View>
        </View>

        <Pressable style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={theme.titleColor} />
          <Text style={[styles.backButtonText, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});