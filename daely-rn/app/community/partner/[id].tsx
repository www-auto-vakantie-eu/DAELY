import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

// Safe preview data
const PARTNER_DATA: Record<string, {
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
}> = {
  'daely-performance': {
    name: 'DAELY Performance',
    category: 'Equipment',
    description: 'Premium sportvoeding en supplementen',
    icon: 'lightning-bolt',
    color: '#F59E0B',
  },
  'daely-recovery': {
    name: 'DAELY Recovery',
    category: 'Overig',
    description: 'Recovery tools en fysiotherapie',
    icon: 'heart-pulse',
    color: '#EF4444',
  },
  'daely-essentials': {
    name: 'DAELY Essentials',
    category: 'Kleding',
    description: 'Basis uitrusting en accessoires',
    icon: 'star',
    color: '#8B5CF6',
  },
  'daely-nutrition': {
    name: 'DAELY Nutrition',
    category: 'Nutrition',
    description: 'Voedingsadvies en maaltijdplannen',
    icon: 'food',
    color: '#059669',
  },
  'daely-supplements': {
    name: 'DAELY Supplements',
    category: 'Supplementen',
    description: 'Premium supplementen en shakes',
    icon: 'bottle-tonic',
    color: '#10B981',
  },
  'daely-gear': {
    name: 'DAELY Gear',
    category: 'Equipment',
    description: 'Sportuitrusting en accessoires',
    icon: 'weight-lifter',
    color: '#6366F1',
  },
};

export default function PartnerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const partnerId = params.id || 'daely-performance';
  const partner = PARTNER_DATA[partnerId];

  if (!partner) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Partner</Text>
          </View>
          <View style={[styles.fallbackCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="information" size={48} color={theme.subtitleColor} />
            <Text style={[styles.fallbackText, { color: theme.titleColor }]}>Partner niet gevonden</Text>
          </View>
        </ScrollView>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Partner</Text>
        </View>

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <LinearGradient
            colors={[`${partner.color}40`, `${partner.color}20`]}
            style={styles.heroGradient}
          >
            <View style={styles.logoContainer}>
              <View style={[styles.logo, { backgroundColor: `${partner.color}25`, borderColor: partner.color }]}>
                <MaterialCommunityIcons name={partner.icon as any} size={48} color={partner.color} />
              </View>
            </View>
          </LinearGradient>
          <View style={styles.heroContent}>
            <View style={[styles.badge, { backgroundColor: '#6B7280' }]}>
              <Text style={styles.badgeText}>Samenwerking voorbereid</Text>
            </View>
            <Text style={[styles.name, { color: theme.titleColor }]}>{partner.name}</Text>
            <Text style={[styles.category, { color: partner.color }]}>{partner.category}</Text>
            <Text style={[styles.description, { color: theme.subtitleColor }]}>{partner.description}</Text>
          </View>
        </View>

        {/* What this partner adds */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wat deze partner straks toevoegt</Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="package-variant" size={24} color={partner.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Producten</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="tag" size={24} color={partner.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Voordelen</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="account-star" size={24} color={partner.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Creator samenwerkingen</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="trophy" size={24} color={partner.color} />
            <Text style={[styles.featureText, { color: theme.titleColor }]}>Sportieve ondersteuning</Text>
          </View>
        </View>

        {/* Collaborations */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Samenwerkingen</Text>
        </View>

        <View style={styles.collabSection}>
          <View style={[styles.collabCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="dumbbell" size={20} color={partner.color} />
            <Text style={[styles.collabText, { color: theme.titleColor }]}>Fitness discipline</Text>
          </View>
          <View style={[styles.collabCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="run-fast" size={20} color={partner.color} />
            <Text style={[styles.collabText, { color: theme.titleColor }]}>Running discipline</Text>
          </View>
          <View style={[styles.collabCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="yoga" size={20} color={partner.color} />
            <Text style={[styles.collabText, { color: theme.titleColor }]}>Mobility discipline</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/shop')}>
            <MaterialCommunityIcons name="shopping" size={24} color={theme.titleColor} />
            <Text style={[styles.ctaText, { color: theme.titleColor }]}>Bekijk shop</Text>
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
  logoContainer: {
    marginTop: -40,
  },
  logo: {
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
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  collabSection: {
    gap: 12,
    marginBottom: 24,
  },
  collabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  collabText: {
    fontSize: 14,
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