import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function ExercisesIndexScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <PageHeader
            title="Oefeningen"
            onSettingsPress={() => router.push('/(tabs)/athlete')}
            onSearchPress={() => router.push('/nutrition/search')}
            onCartPress={() => router.push('/(tabs)/cart')}
          />

          <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="dumbbell" size={32} color="#2563EB" />
            </View>
            <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Oefeningen komen binnenkort beschikbaar</Text>
            <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
              Hier vind je straks oefeningen per discipline, niveau en doel.
            </Text>
          </View>

          <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="information" size={20} color="#2563EB" />
            <View style={styles.noticeContent}>
              <Text style={[styles.noticeTitle, { color: theme.titleColor }]}>Voorbereid</Text>
              <Text style={[styles.noticeText, { color: theme.subtitleColor }]}>
                DAELY bereidt momenteel oefeningenbibliotheek voor. Je kunt straks oefeningen bekijken, filteren op discipline en niveau, en ze direct toevoegen aan je trainingen.
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wat kun je verwachten?</Text>
          </View>

          <View style={styles.previewSection}>
            <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="filter-variant" size={24} color="#2563EB" />
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Filter op Discipline</Text>
                <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Kracht, cardio, mobiliteit en meer</Text>
              </View>
            </View>

            <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#059669" />
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Niveaus</Text>
                <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Beginner tot gevorderd</Text>
              </View>
            </View>

            <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="target" size={24} color="#F59E0B" />
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, { color: theme.titleColor }]}>Doelgericht</Text>
                <Text style={[styles.previewText, { color: theme.subtitleColor }]}>Spiergroep, kracht, uithouding</Text>
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
            onPress={() => router.push('/workouts')}
          >
            <MaterialCommunityIcons name="calendar-check" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Bekijk workouts</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Workout schema&apos;s en routines</Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
          <SharedBottomNav activeTab="disciplines" />
        </ScrollView>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
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
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
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