import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

// Safe preview data
const CREATOR_DATA: Record<string, {
  name: string;
  type: string;
  specialty: string;
  description: string;
  icon: string;
  color: string;
}> = {
  'fitness-creator': {
    name: 'Fitness creator',
    type: 'Creator',
    specialty: 'Strength & Hypertrofie',
    description: 'Expert in krachttraining en spieropbouw',
    icon: 'arm-flex',
    color: '#2563EB',
  },
  'running-athlete': {
    name: 'Running athlete',
    type: 'Athlete',
    specialty: 'Endurance Training',
    description: 'Marathon loper en running coach',
    icon: 'run-fast',
    color: '#059669',
  },
  'mobility-coach': {
    name: 'Mobility coach',
    type: 'Coach',
    specialty: 'Flexibility & Recovery',
    description: 'Yoga en mobiliteit specialist',
    icon: 'yoga',
    color: '#8B5CF6',
  },
  'team-captain': {
    name: 'Team captain',
    type: 'Team captain',
    specialty: 'Team Coaching',
    description: 'Gepassioneerde teamcoach',
    icon: 'account-group',
    color: '#EF4444',
  },
  'strength-coach': {
    name: 'Strength coach',
    type: 'Coach',
    specialty: 'Personal Training',
    description: 'Personal trainer en coach',
    icon: 'dumbbell',
    color: '#F59E0B',
  },
  'nutrition-creator': {
    name: 'Nutrition creator',
    type: 'Coach',
    specialty: 'Voedingsadvies',
    description: 'Voedingscoach en meal planner',
    icon: 'food',
    color: '#10B981',
  },
};

export default function CreatorDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const creatorId = params.id || 'fitness-creator';
  const creator = CREATOR_DATA[creatorId];

  if (!creator) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Creator</Text>
          </View>
          <View style={[styles.fallbackCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="information" size={48} color={theme.subtitleColor} />
            <Text style={[styles.fallbackText, { color: theme.titleColor }]}>Creator niet gevonden</Text>
          </View>
        </ScrollView>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Creator</Text>
        </View>

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <LinearGradient
            colors={[`${creator.color}40`, `${creator.color}20`]}
            style={styles.heroGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: `${creator.color}25`, borderColor: creator.color }]}>
                <MaterialCommunityIcons name={creator.icon as any} size={48} color={creator.color} />
              </View>
            </View>
          </LinearGradient>
          <View style={styles.heroContent}>
            <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.badgeText}>Samenwerking voorbereid</Text>
            </View>
            <Text style={[styles.name, { color: theme.titleColor }]}>{creator.name}</Text>
            <Text style={[styles.type, { color: creator.color }]}>{creator.type}</Text>
            <Text style={[styles.specialty, { color: theme.subtitleColor }]}>{creator.specialty}</Text>
            <Text style={[styles.description, { color: theme.subtitleColor }]}>{creator.description}</Text>
          </View>
        </View>

        {/* What you'll find */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wat je hier straks vindt</Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="dumbbell" size={24} color={creator.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Trainingen</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lightbulb" size={24} color={creator.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Tips</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="trophy" size={24} color={creator.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Challenges</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="account-group" size={24} color={creator.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Community updates</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/tracker')}>
            <MaterialCommunityIcons name="run-fast" size={24} color={theme.titleColor} />
            <Text style={[styles.ctaText, { color: theme.titleColor }]}>Start activiteit</Text>
          </Pressable>
          <Pressable style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/feedback')}>
            <MaterialCommunityIcons name="chat-outline" size={24} color={theme.titleColor} />
            <Text style={[styles.ctaText, { color: theme.titleColor }]}>Feedback geven</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
        <SharedBottomNav activeTab="community" />
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 32,
  },
  avatarContainer: {
    marginTop: -40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  heroContent: {
    padding: 16,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  ctaCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 22,
  },
  fallbackCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '600',
  },
});