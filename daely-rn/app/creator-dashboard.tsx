import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import PageHeader from './components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function CreatorDashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAppContext();

  const creatorData = {
    name: user?.name || 'Test Creator',
    username: user?.username || 'daely_creator',
    role: user?.role || 'DAELY Creator',
    sportFocus: user?.sportFocus || 'Fitness, padel & lifestyle',
    bio: user?.bio || 'DAELY creator en sportieve ambassador die challenges, trainingen en motivatie deelt.',
    creatorBadge: user?.creatorBadge || 'DAELY Creator',
    creatorType: user?.creatorType || 'influencer-athlete',
    creatorCode: user?.creatorCode || 'DAELY-CREATOR-TEST',
    referralCode: user?.referralCode || 'DAELY-CREATOR-TEST',
    followers: user?.followers || 12840,
    activeCreatorSubscribers: user?.activeCreatorSubscribers || 342,
    estimatedMonthlyEarnings: user?.estimatedMonthlyEarnings || 338.58,
    createdChallenges: user?.createdChallenges || 6,
    sharedWorkouts: user?.sharedWorkouts || 18,
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PageHeader
          title="Creator Dashboard"
          onBackPress={() => router.back()}
        />

        {/* Header / Profielblok */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{creatorData.creatorBadge}</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: theme.titleColor }]}>{creatorData.name}</Text>
          <Text style={[styles.profileUsername, { color: theme.subtitleColor }]}>@{creatorData.username}</Text>
          <Text style={[styles.profileRole, { color: '#2563EB' }]}>{creatorData.role}</Text>
          <Text style={[styles.profileSport, { color: theme.subtitleColor }]}>
            <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" /> {creatorData.sportFocus}
          </Text>
          <Text style={[styles.profileBio, { color: theme.subtitleColor }]}>{creatorData.bio}</Text>
        </View>

        {/* Groei & Inkomsten */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Groei & Inkomsten</Text>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Volgers</Text>
            <Text style={[styles.statValue, { color: theme.titleColor }]}>{creatorData.followers.toLocaleString()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Actieve abonnees</Text>
            <Text style={[styles.statValue, { color: theme.titleColor }]}>{creatorData.activeCreatorSubscribers}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Geschatte maandelijkse opbrengst</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>€{creatorData.estimatedMonthlyEarnings.toFixed(2)}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Creator Code</Text>
            <Text style={[styles.statValue, { color: theme.titleColor }]}>{creatorData.creatorCode}</Text>
          </View>

          <View style={styles.disclaimerBox}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#F59E0B" />
            <Text style={styles.disclaimerText}>Mockdata voor testomgeving. Echte berekening gebeurt later via DAELY Business Software.</Text>
          </View>

          <View style={styles.ruleBox}>
            <Text style={[styles.ruleText, { color: theme.subtitleColor }]}>DAELY-regel: €0,99 per actieve betalende abonnee per maand</Text>
            <Text style={[styles.ruleText, { color: theme.subtitleColor }]}>Geen vergoeding over gratis maanden</Text>
          </View>
        </View>

        {/* Challenges */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Challenges</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>Aangemaakte challenges: {creatorData.createdChallenges}</Text>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]} disabled>
            <MaterialCommunityIcons name="trophy" size={22} color="#F59E0B" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Mijn challenges</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Bekijk je challenges</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="plus-circle" size={22} color="#2563EB" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Nieuwe challenge starten</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>
        </View>

        {/* Content & Trainingen */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Content & Trainingen</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>Gedeelde trainingen: {creatorData.sharedWorkouts}</Text>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]} disabled>
            <MaterialCommunityIcons name="dumbbell" size={22} color="#2563EB" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Gedeelde trainingen</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Bekijk je gedeelde workouts</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="upload" size={22} color="#059669" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Oefeningen uploaden</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="file-document" size={22} color="#8B5CF6" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Content plaatsen</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>
        </View>

        {/* Samenwerkingen */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Samenwerkingen</Text>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="tag" size={22} color="#F59E0B" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Kortingscodes</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Beheer je codes</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="handshake" size={22} color="#2563EB" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Partnerdeals</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Bekijk samenwerkingen</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="megaphone" size={22} color="#059669" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Campagnes</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Beheer campagnes</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="shopping" size={22} color="#8B5CF6" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Producten promoten</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>
        </View>

        {/* Preview */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Preview</Text>

          <Pressable style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6 }]} disabled>
            <MaterialCommunityIcons name="eye" size={22} color="#6366F1" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Bekijk hoe sporters mijn profiel zien</Text>
              <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Binnenkort</Text>
            </View>
            <MaterialCommunityIcons name="lock-outline" size={20} color={theme.subtitleColor} />
          </Pressable>
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
  profileUsername: {
    fontSize: 15,
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
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
    lineHeight: 16,
  },
  ruleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  ruleText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  bottomSpacer: {
    height: 24,
  },
});