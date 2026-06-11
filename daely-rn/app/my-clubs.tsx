import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from './components/AppHeader';

export default function MyClubsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Mijn clubs & trainers"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          showMessages={false}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account-group" size={48} color="#8B5CF6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Binnenkort beschikbaar</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Clubs en trainers komen hier later samen.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat kun je later verwachten?</Text>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Overzicht van je clublidmaatschappen en teams
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Toegewezen trainingen en lessen van je trainers
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Communicatie met je club en trainers
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Belangrijk om te weten</Text>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Je sporterprofiel blijft centraal - alle data is van jou
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Trainingen worden gekoppeld aan je bestaande programma&apos;s
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Beheer, betalingen en facturen lopen niet via deze app
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Vragen?</Text>
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
            Neem contact op met je club of trainer voor meer informatie over clublidmaatschappen en trainingen.
          </Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
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
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});