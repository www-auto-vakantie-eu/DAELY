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
  creatorBadge?: string;
  creatorType?: string;
  creatorCode?: string;
  referralLink?: string;
  sportFocus?: string;
}> = {
  'mila-creator': {
    name: 'Mila Creator',
    type: 'DAELY Creator',
    specialty: 'Fitness, Running & Mindset',
    description: 'DAELY Creator die sporters helpt starten met gezonde routines, workouts en mindset.',
    icon: 'trophy',
    color: '#2563EB',
    creatorBadge: 'DAELY Creator',
    creatorType: 'Athlete Creator',
    creatorCode: 'DAELY-MILA',
    referralLink: 'https://daely.app/invite/DAELY-MILA',
    sportFocus: 'Fitness, Running & Mindset',
  },
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
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <View style={[styles.fallbackCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="information" size={48} color={theme.subtitleColor} />
              <Text style={[styles.fallbackText, { color: theme.titleColor }]}>Creator niet gevonden</Text>
            </View>
          </ScrollView>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
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
              {creator.creatorBadge && (
                <View style={[styles.badge, { backgroundColor: '#2563EB' }]}>
                  <Text style={styles.badgeText}>{creator.creatorBadge}</Text>
                </View>
              )}
              {!creator.creatorBadge && (
                <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.badgeText}>Samenwerking voorbereid</Text>
                </View>
              )}
              <Text style={[styles.name, { color: theme.titleColor }]}>{creator.name}</Text>
              <Text style={[styles.type, { color: creator.color }]}>{creator.type}</Text>
              {creator.creatorType && (
                <Text style={[styles.creatorType, { color: theme.subtitleColor }]}>{creator.creatorType}</Text>
              )}
              <Text style={[styles.specialty, { color: theme.subtitleColor }]}>{creator.specialty}</Text>
              <Text style={[styles.description, { color: theme.subtitleColor }]}>{creator.description}</Text>
              {creator.creatorCode && (
                <View style={[styles.codeBox, { backgroundColor: '#F0F9FF', borderColor: '#BFDBFE' }]}>
                  <Text style={[styles.codeLabel, { color: '#64748B' }]}>Creator code:</Text>
                  <Text style={[styles.codeValue, { color: '#2563EB' }]}>{creator.creatorCode}</Text>
                </View>
              )}
            </View>
          </View>

          {/* CTA for DAELY Creator */}
          {creator.creatorCode && creator.referralLink && (
            <View style={[styles.ctaBlock, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
              <View style={styles.ctaHeader}>
                <MaterialCommunityIcons name="rocket-launch" size={24} color="#10B981" />
                <Text style={[styles.ctaTitle, { color: '#047857' }]}>Start met DAELY via {creator.name}</Text>
              </View>
              <Text style={[styles.ctaDescription, { color: '#065F46' }]}>
                Gebruik creator code <Text style={styles.ctaCode}>{creator.creatorCode}</Text> om te starten
              </Text>
              <Pressable
                style={[styles.ctaButton, { backgroundColor: '#10B981' }]}
                onPress={() => {}}
              >
                <MaterialCommunityIcons name="link" size={18} color="#FFFFFF" />
                <Text style={styles.ctaButtonText}>Kopieer invite link</Text>
              </Pressable>
              <Text style={[styles.ctaNote, { color: '#6B7280' }]}>
                Mock/foundation - geen echte referral tracking
              </Text>
            </View>
          )}

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
      </ScrollView>
      <SharedBottomNav activeTab="community" />
    </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
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
  creatorType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
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
  codeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '700',
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
  ctaBlock: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  ctaDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaCode: {
    fontWeight: '700',
    color: '#2563EB',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});