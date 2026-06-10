import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function FindCoachScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<'online' | 'personal'>('online');

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <PageHeader
          title="Vind een coach"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={styles.content}>
          <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="account-tie" size={48} color="#10B981" />
            </View>
            <Text style={[styles.heroTitle, { color: theme.titleColor }]}>DAELY Coach komt binnenkort beschikbaar.</Text>
            <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
              Vind straks coaches op basis van sport, doel, niveau en locatie.
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat komt eraan?</Text>
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              We bereiden coachprofielen, specialisaties en beschikbaarheid voor.
            </Text>
          </View>

          <View style={[styles.filterCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.filterTitle, { color: theme.titleColor }]}>Filter preview</Text>
            <View style={styles.filterRow}>
              <Pressable
                style={[styles.filterButton, filter === 'online' && styles.filterButtonActive]}
                onPress={() => setFilter('online')}
              >
                <Text style={[styles.filterButtonText, filter === 'online' ? styles.filterButtonTextActive : { color: theme.titleColor }]}>Online coaching</Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filter === 'personal' && styles.filterButtonActive]}
                onPress={() => setFilter('personal')}
              >
                <Text style={[styles.filterButtonText, filter === 'personal' ? styles.filterButtonTextActive : { color: theme.titleColor }]}>Personal coaching</Text>
              </Pressable>
            </View>
            <View style={styles.filterInfo}>
              <MaterialCommunityIcons name="information" size={16} color="#64748B" />
              <Text style={styles.filterInfoText}>Filters zijn preview en tonen voorbeeldresultaten.</Text>
            </View>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="dumbbell" size={28} color="#EF4444" />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Kracht & fitness coach</Text>
                <Text style={[styles.cardSubtitle, { color: theme.subtitleColor }]}>Specialiseert in krachttraining, uithoudingsvermogen en functionele fitness</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Binnenkort</Text>
              </View>
            </View>
            <Pressable style={styles.cardButton} onPress={() => router.push('/feedback')}>
              <Text style={styles.cardButtonText}>Interesse doorgeven</Text>
            </Pressable>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="run" size={28} color="#F59E0B" />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Hardloop coach</Text>
                <Text style={[styles.cardSubtitle, { color: theme.subtitleColor }]}>Specialiseert in hardloopschema&apos;s, techniek en prestatieverbetering</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Binnenkort</Text>
              </View>
            </View>
            <Pressable style={styles.cardButton} onPress={() => router.push('/feedback')}>
              <Text style={styles.cardButtonText}>Interesse doorgeven</Text>
            </Pressable>
          </View>

          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="human-handsdown" size={28} color="#3B82F6" />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.titleColor }]}>Mobiliteit coach</Text>
                <Text style={[styles.cardSubtitle, { color: theme.subtitleColor }]}>Specialiseert in mobiliteit, herstel en blessurepreventie</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Binnenkort</Text>
              </View>
            </View>
            <Pressable style={styles.cardButton} onPress={() => router.push('/feedback')}>
              <Text style={styles.cardButtonText}>Interesse doorgeven</Text>
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/feedback')}>
              <Text style={styles.primaryButtonText}>Feedback geven</Text>
            </Pressable>
            <Pressable
              style={[styles.tertiaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={() => router.push('/tracker')}
            >
              <Text style={[styles.tertiaryButtonText, { color: theme.titleColor }]}>Start activiteit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
        <SharedBottomNav activeTab="explore" />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
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
  filterCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  filterInfoText: {
    fontSize: 13,
    marginLeft: 8,
    color: '#64748B',
  },
  previewCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  buttonRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#10B981',
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
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  tertiaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 80,
  },
});