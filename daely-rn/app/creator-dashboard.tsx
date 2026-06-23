import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import PageHeader from './components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { StatsGrid } from '@/components/stats-grid';

export default function CreatorDashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAppContext();

  const creatorData = {
    name: user?.displayName || user?.name || 'Mila Creator',
    username: user?.username || '@mila.daely',
    role: user?.role || 'DAELY Creator',
    sportFocus: user?.sportFocus || 'Fitness, Running & Mindset',
    bio: user?.bio || 'DAELY Creator die sporters helpt starten met gezonde routines, workouts en mindset.',
    creatorBadge: user?.creatorBadge || 'DAELY Creator',
    creatorType: user?.creatorType || 'Athlete Creator',
    creatorCode: user?.creatorCode || 'DAELY-MILA',
    referralCode: user?.referralCode || 'DAELY-MILA',
    referralLink: user?.referralLink || 'https://daely.app/invite/DAELY-MILA',
    activeSubscribers: user?.activeSubscribers || 128,
    newSubscribersThisMonth: user?.newSubscribersThisMonth || 34,
    freeMonthUsers: user?.freeMonthUsers || 7,
    failedPayments: user?.failedPayments || 3,
    rewardRate: user?.rewardRate || 0.99,
    estimatedMonthlyReward: user?.estimatedMonthlyReward || 126.72,
    createdChallenges: user?.createdChallenges || 6,
    sharedWorkouts: user?.sharedWorkouts || 18,
  };

  const handleCopyLink = () => {
    Alert.alert('Link gekopieerd', `${creatorData.referralLink} is naar je klembord gekopieerd.`);
  };

  const handleShare = () => {
    Alert.alert('Delen', 'Delen functionaliteit komt binnenkort beschikbaar.');
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageHeader
          title="Creator Dashboard"
          onBackPress={() => router.back()}
        />

        {/* 1. Creator Identity */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{creatorData.creatorBadge}</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: theme.titleColor }]}>{creatorData.name}</Text>
          <Text style={[styles.profileSubtitle, { color: theme.subtitleColor }]}>
            {creatorData.creatorType} · {creatorData.username}
          </Text>
          <Text style={[styles.profileSport, { color: theme.subtitleColor }]}>
            <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" /> {creatorData.sportFocus}
          </Text>
          <Text style={[styles.profileBio, { color: theme.subtitleColor }]}>{creatorData.bio}</Text>
          <View style={styles.codeBox}>
            <Text style={[styles.codeLabel, { color: theme.subtitleColor }]}>Creator code:</Text>
            <Text style={[styles.codeValue, { color: '#2563EB' }]}>{creatorData.creatorCode}</Text>
          </View>
        </View>

        {/* 2. Overzicht */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Overzicht</Text>
          <StatsGrid
            stats={[
              {
                label: 'Actieve abonnees',
                value: creatorData.activeSubscribers.toString(),
              },
              {
                label: 'Nieuwe deze maand',
                value: creatorData.newSubscribersThisMonth.toString(),
              },
              {
                label: 'Maandvergoeding',
                value: `€${creatorData.estimatedMonthlyReward.toFixed(2)}`,
              },
              {
                label: 'Reward rate',
                value: `€${creatorData.rewardRate.toFixed(2)}`,
                unit: '/abonnee',
              },
            ]}
            columns={2}
          />
        </View>

        {/* 3. Link delen */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Link delen</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
            Deel je DAELY-link en verdien €0,99 per actieve betalende abonnee per maand.
          </Text>

          <View style={[styles.codeDisplay, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.codeDisplayText, { color: theme.titleColor }]}>{creatorData.referralLink}</Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.primaryButton, { backgroundColor: '#2563EB' }]} onPress={handleCopyLink}>
              <MaterialCommunityIcons name="content-copy" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Kopieer link</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={handleShare}>
              <MaterialCommunityIcons name="share-variant" size={18} color={theme.titleColor} />
              <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Delen</Text>
            </Pressable>
          </View>
        </View>

        {/* 4. Verdiensten */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Verdiensten</Text>
          <View style={styles.disclaimerBox}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#F59E0B" />
            <Text style={styles.disclaimerText}>Verwachte maandvergoeding gebaseerd op mockdata foundation.</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Actieve betalende abonnees</Text>
            <Text style={[styles.statValue, { color: theme.titleColor }]}>{creatorData.activeSubscribers}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Gratis maanden</Text>
            <Text style={[styles.statValue, { color: theme.subtitleColor }]}>{creatorData.freeMonthUsers} <Text style={styles.statNote}> (niet vergoed)</Text></Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Mislukte betalingen</Text>
            <Text style={[styles.statValue, { color: theme.subtitleColor }]}>{creatorData.failedPayments} <Text style={styles.statNote}> (niet vergoed)</Text></Text>
          </View>

          <View style={[styles.calculationBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.calculationLabel, { color: theme.subtitleColor }]}>Berekening:</Text>
            <Text style={[styles.calculationText, { color: theme.titleColor }]}>
              {creatorData.activeSubscribers} × €{creatorData.rewardRate.toFixed(2)} = €{creatorData.estimatedMonthlyReward.toFixed(2)}
            </Text>
          </View>

          <View style={styles.rewardBox}>
            <Text style={[styles.rewardLabel, { color: '#059669' }]}>Verwachte maandvergoeding:</Text>
            <Text style={[styles.rewardValue, { color: '#059669' }]}>€{creatorData.estimatedMonthlyReward.toFixed(2)}</Text>
          </View>
        </View>

        {/* 5. Groei */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Groei</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Nieuwe abonnees deze maand</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>+{creatorData.newSubscribersThisMonth}</Text>
          </View>
          <Text style={[styles.growthText, { color: theme.subtitleColor }]}>
            Positieve groei in actieve betalende abonnees deze maand.
          </Text>
        </View>

        {/* 6. Privacy & regels */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Privacy & regels</Text>
          <View style={styles.privacyBox}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color="#059669" />
            <Text style={styles.privacyText}>
              Creators zien alleen totalen en globale statistieken. Ze zien geen persoonlijke gezondheidsdata, geen individuele gebruikerslijsten, geen ledenbeheer en geen facturatiegegevens.
            </Text>
          </View>
          <View style={styles.ruleBox}>
            <Text style={[styles.ruleText, { color: theme.subtitleColor }]}>• €{creatorData.rewardRate.toFixed(2)} per actieve betalende abonnee per maand</Text>
            <Text style={[styles.ruleText, { color: theme.subtitleColor }]}>• Geen vergoeding over gratis maanden</Text>
            <Text style={[styles.ruleText, { color: theme.subtitleColor }]}>• Geen vergoeding over mislukte betalingen</Text>
          </View>
        </View>

        {/* 7. Later / Binnenkort */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Binnenkort</Text>
          <Pressable
            style={styles.laterItem}
            onPress={() => router.push('/community/creator/mila-creator')}
          >
            <MaterialCommunityIcons name="eye" size={18} color="#10B981" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Bekijk publieke profielpagina</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>
          <View style={styles.laterItem}>
            <MaterialCommunityIcons name="chart-line" size={18} color="#94A3B8" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Echte referral tracking en analytics</Text>
          </View>
          <View style={styles.laterItem}>
            <MaterialCommunityIcons name="cash" size={18} color="#94A3B8" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Payout status en uitbetaalhistorie</Text>
          </View>
          <View style={styles.laterItem}>
            <MaterialCommunityIcons name="card-text" size={18} color="#94A3B8" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Promotiekaarten en campagneprestaties</Text>
          </View>
          <View style={styles.laterItem}>
            <MaterialCommunityIcons name="account-circle" size={18} color="#94A3B8" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Creator publieke profielpagina</Text>
          </View>
          <View style={styles.laterItem}>
            <MaterialCommunityIcons name="file-document" size={18} color="#94A3B8" />
            <Text style={[styles.laterText, { color: theme.subtitleColor }]}>Officiële voorwaarden en contract</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  profileCard: {
    margin: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileSport: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
  },
  codeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 20,
  },
  codeDisplay: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  codeDisplayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statNote: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
    lineHeight: 16,
  },
  calculationBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  calculationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  calculationText: {
    fontSize: 15,
    fontWeight: '700',
  },
  rewardBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
    lineHeight: 16,
  },
  ruleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  ruleText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  laterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  laterText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 24,
  },
});