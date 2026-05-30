import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

type DashboardCard = {
  id: string;
  title: string;
  description: string;
  route?: Href;
  disabled?: boolean;
};

const PRIMARY_ACTIONS: DashboardCard[] = [
  {
    id: 'start-activity',
    title: 'Start activiteit',
    description: 'Begin direct met tracken van training, sessie of wedstrijd.',
    route: '/tracker',
  },
  {
    id: 'activities',
    title: 'Activiteiten',
    description: 'Bekijk je recente sessies en navigeer naar details.',
    route: '/activities',
  },
];

const PERFORMANCE_CARDS: DashboardCard[] = [
  {
    id: 'progress',
    title: 'Progressie',
    description: 'Resultaten en groei over al je sportdisciplines.',
    route: '/my-progress',
  },
  {
    id: 'data',
    title: 'Data',
    description: 'Centraal overzicht van statistieken en trends.',
    route: '/my-stats',
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Schema\'s, volume en geplande trainingsmomenten.',
    route: '/workouts',
  },
];

const HEALTH_CARDS: DashboardCard[] = [
  {
    id: 'nutrition',
    title: 'Voeding',
    description: 'Log en monitor je voeding rondom prestaties en herstel.',
    route: '/my-nutrition',
  },
  {
    id: 'mind',
    title: 'Mind',
    description: 'Mindset en mentale tools komen binnenkort.',
    disabled: true,
  },
  {
    id: 'habits',
    title: 'Habit tracker',
    description: 'Bouw dagelijkse gewoontes voor routine en focus.',
    route: '/habits',
  },
];

const ACCOUNT_SUPPORT_CARDS: DashboardCard[] = [
  {
    id: 'orders',
    title: 'My Orders',
    description: 'Bekijk je bestellingen, leveringen en aankopen.',
    route: '/my-orders',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Deel ideeën, bugs en verbeteringen met DAELY.',
    route: '/feedback',
  },
  {
    id: 'find-coach',
    title: 'Vind Coach',
    description: 'Zoek begeleiding die past bij jouw doelen.',
    route: '/find-coach',
  },
];

export default function MijnScreen() {
  const theme = useTheme();
  const router = useRouter();

  const renderPrimaryCard = (item: DashboardCard) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [styles.primaryCard, pressed ? styles.primaryCardPressed : null]}
      onPress={() => {
        if (item.route) {
          router.push(item.route);
        }
      }}
    >
      <View style={styles.primaryCardIconWrap}>
        <MaterialCommunityIcons name={item.id === 'start-activity' ? 'run-fast' : 'history'} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.primaryCardTextWrap}>
        <Text style={styles.primaryCardTitle}>{item.title}</Text>
        <Text style={styles.primaryCardDescription}>{item.description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#FFFFFF" />
    </Pressable>
  );

  const renderStandardCard = (item: DashboardCard) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.standardCard,
        { backgroundColor: theme.card, borderColor: theme.border },
        item.disabled ? styles.standardCardDisabled : null,
        pressed && !item.disabled ? styles.standardCardPressed : null,
      ]}
      disabled={item.disabled}
      onPress={() => {
        if (item.route) {
          router.push(item.route);
        }
      }}
    >
      <View style={styles.standardCardTextWrap}>
        <Text style={[styles.standardCardTitle, { color: item.disabled ? '#64748B' : theme.titleColor }]}>{item.title}</Text>
        <Text style={[styles.standardCardDescription, { color: item.disabled ? '#94A3B8' : theme.subtitleColor }]}>{item.description}</Text>
      </View>
      <View style={styles.standardCardRightWrap}>
        <Text style={[styles.standardCardCta, { color: item.disabled ? '#94A3B8' : '#2563EB' }]}>{item.disabled ? 'Binnenkort' : 'Openen'}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={item.disabled ? '#94A3B8' : '#2563EB'} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mijn"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Mijn DAELY</Text>
          <Text style={[styles.introSubtitle, { color: theme.subtitleColor }]}>Je persoonlijke sportomgeving, voortgang en acties.</Text>
          <Text style={[styles.introStatus, { color: theme.subtitleColor }]}>Blijf bouwen aan je routine.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Primaire acties</Text>
          <View style={styles.primaryList}>{PRIMARY_ACTIONS.map(renderPrimaryCard)}</View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Mijn prestaties</Text>
          <View style={styles.standardList}>{PERFORMANCE_CARDS.map(renderStandardCard)}</View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Mijn gezondheid</Text>
          <View style={styles.standardList}>{HEALTH_CARDS.map(renderStandardCard)}</View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Mijn account & support</Text>
          <View style={styles.standardList}>{ACCOUNT_SUPPORT_CARDS.map(renderStandardCard)}</View>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  introCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  introStatus: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  primaryList: {
    gap: 10,
  },
  primaryCard: {
    borderRadius: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryCardPressed: {
    opacity: 0.92,
  },
  primaryCardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  primaryCardTextWrap: {
    flex: 1,
  },
  primaryCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  primaryCardDescription: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 18,
  },
  standardList: {
    gap: 10,
  },
  standardCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  standardCardPressed: {
    opacity: 0.9,
  },
  standardCardDisabled: {
    opacity: 0.75,
  },
  standardCardTextWrap: {
    flex: 1,
  },
  standardCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  standardCardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  standardCardRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  standardCardCta: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 8,
  },
});
