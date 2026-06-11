import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href, useFocusEffect } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { getPerformanceSummary, type PerformanceSummary } from '@/services/performance-summary';
import { getUnreadMessageCount } from '@/services/messages-storage';

type MyDomainCard = {
  id: string;
  title: string;
  description: string;
  category: string;
  accent: string;
  image: string;
  route?: Href;
  disabled?: boolean;
};

const MY_DOMAIN_CARDS: MyDomainCard[] = [
  {
    id: 'progress',
    title: 'Progressie',
    description: 'Statistieken en resultaten van al je sporten en disciplines.',
    category: 'PROGRESSIE',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    route: '/my-progress',
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Schema&apos;s, volume, progressie en volgende sessies.',
    category: 'TRAINING',
    accent: '#2563EB',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    route: '/workouts',
  },
  {
    id: 'my-programs',
    title: 'Mijn Programma&apos;s',
    description: 'Actieve en voltooide trainingsschema&apos;s.',
    category: 'TRAINING',
    accent: '#2563EB',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    route: '/my-programs',
  },
  {
    id: 'clubs-trainers',
    title: 'Mijn clubs & trainers',
    description: 'Bekijk later je clubs, trainers, teams en toegewezen trainingen.',
    category: 'CLUBS',
    accent: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
    route: '/my-clubs',
    disabled: true,
  },
  {
    id: 'messages',
    title: 'Berichten & support',
    description: 'Chats met coaches, klantenmanager en sporters.',
    category: 'BERICHTEN',
    accent: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=1200&q=80',
    route: '/messages',
  },
  {
    id: 'nutrition',
    title: 'Voeding',
    description: 'Weekgemiddelden, macro&apos;s en adherence op doel.',
    category: 'VOEDING',
    accent: '#059669',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    route: '/my-nutrition',
  },
  {
    id: 'mind',
    title: 'Mind',
    description: 'Binnenkort beschikbaar',
    category: 'MINDSET',
    accent: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    disabled: true,
  },
  {
    id: 'stats',
    title: 'Data',
    description: 'Overzicht van al je statistieken op een plek.',
    category: 'DATA',
    accent: '#10B981',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    route: '/my-stats',
  },
  {
    id: 'orders',
    title: 'My Orders',
    description: 'Bekijk je bestellingen, leveringen en aankopen.',
    category: 'ORDERS',
    accent: '#22C55E',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1200&q=80',
    route: '/my-orders',
  },
  {
    id: 'habits',
    title: 'Habit tracker',
    description: 'Bouw dagelijkse gewoontes voor routine en focus.',
    category: 'HABITS',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1484480974693-6ced21f2f059?auto=format&fit=crop&w=1200&q=80',
    route: '/habits',
  },
  {
    id: 'today-background',
    title: 'Achtergrond wijzigen',
    description: 'Pas de achtergrond van je Vandaag-pagina aan.',
    category: 'INSTELLINGEN',
    accent: '#6366F1',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    route: '/(tabs)/today?open=background',
  },
  {
    id: 'today-shortcuts',
    title: 'Snelfuncties aanpassen',
    description: 'Pas je 3 sneltoetsen op de Vandaag-pagina aan.',
    category: 'INSTELLINGEN',
    accent: '#6366F1',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    route: '/(tabs)/today?open=shortcuts',
  },
  {
    id: 'community-sharing',
    title: 'Community delen',
    description: 'Bepaal wanneer DAELY je vraagt om updates te delen.',
    category: 'INSTELLINGEN',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    route: '/(tabs)/community-sharing-settings',
  },
];

export default function MijnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    getPerformanceSummary().then(setPerformanceSummary);
    getUnreadMessageCount().then(setUnreadMessageCount);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUnreadMessageCount().then(setUnreadMessageCount);
    }, [])
  );

  const handleCardPress = (route: Href) => {
    router.push(route);
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Mijn."
          subtitle="Alles op één plek."
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          showMessages
          unreadMessagesCount={unreadMessageCount}
          onMessagesPress={() => router.push('/messages')}
        />

        <View style={styles.cardsWrap}>
          {performanceSummary && (
            <Pressable
              style={({ pressed }) => [
                styles.performanceCard,
                pressed && styles.slideCardPressed,
              ]}
              onPress={() => router.push('/my-progress')}
            >
              <LinearGradient
                colors={['rgba(37, 99, 235, 0.15)', 'rgba(37, 99, 235, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.performanceCardGradient}
              >
                <View style={styles.performanceCardContent}>
                  <View style={styles.performanceCardHeader}>
                    <Text style={[styles.performanceCardTitle, { color: '#2563EB' }]}>Mijn prestaties</Text>
                  </View>
                  <View style={styles.performanceCardStats}>
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{performanceSummary.totalWorkoutActivities}</Text>
                      <Text style={styles.performanceStatLabel}>workouts voltooid</Text>
                    </View>
                    <View style={styles.performanceStatDivider} />
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{performanceSummary.totalPersonalRecords}</Text>
                      <Text style={styles.performanceStatLabel}>PR&apos;s behaald</Text>
                    </View>
                  </View>
                  {performanceSummary.latestPersonalRecord && (
                    <Text style={styles.performanceLatestPr}>
                      Laatste PR: {performanceSummary.latestPersonalRecord.exerciseName}
                    </Text>
                  )}
                  <Text style={styles.performanceCardLink}>Bekijk prestaties</Text>
                </View>
              </LinearGradient>
            </Pressable>
          )}
          {MY_DOMAIN_CARDS.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [
                styles.verticalCard,
                card.disabled ? { opacity: 0.74 } : null,
                pressed && !card.disabled ? styles.slideCardPressed : null,
              ]}
              disabled={card.disabled}
              onPress={() => {
                if (!card.route || card.disabled) {
                  return;
                }
                handleCardPress(card.route);
              }}
            >
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.78)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.heroOverlay}
                >
                  <View style={styles.heroTextBlock}>
                    {card.disabled ? <Text style={[styles.heroCategory, { color: card.accent }]}>Binnenkort</Text> : null}
                    <View style={styles.titleRow}>
                      <Text style={[
                        styles.heroTitle,
                        card.id === 'progress' && { color: card.accent },
                        card.id === 'workouts' && { color: '#2563EB' },
                        card.id === 'my-programs' && { color: '#2563EB' },
                        card.id === 'clubs-trainers' && { color: '#8B5CF6' },
                        card.id === 'messages' && { color: '#8B5CF6' },
                        card.id === 'nutrition' && { color: '#EF4444' },
                        card.id === 'mind' && { color: '#8B5CF6' },
                        card.id === 'stats' && { color: '#10B981' },
                        card.id === 'orders' && { color: '#22C55E' },
                        card.id === 'habits' && { color: '#F59E0B' },
                        card.id === 'feedback' && { color: '#2563EB' },
                        card.id === 'find-coach' && { color: '#10B981' },
                        card.id === 'today-background' && { color: '#6366F1' },
                        card.id === 'today-shortcuts' && { color: '#6366F1' },
                      ]}>{card.title}</Text>
                      {card.id === 'messages' && unreadMessageCount > 0 && (
                        <View style={[styles.unreadBadge, { backgroundColor: '#EF4444' }]}>
                          <Text style={styles.unreadBadgeText}>{unreadMessageCount}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.heroDescription}>{card.description}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
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
  },
  cardsWrap: {
    padding: 16,
  },
  verticalCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 210,
    marginBottom: 14,
  },
  slideCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  heroImage: {
    flex: 1,
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroTextBlock: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  heroDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#E5E7EB',
  },
  performanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  performanceCardGradient: {
    padding: 16,
  },
  performanceCardContent: {
    gap: 12,
  },
  performanceCardHeader: {
    marginBottom: 4,
  },
  performanceCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  performanceCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  performanceStat: {
    flex: 1,
  },
  performanceStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E5E7EB',
    lineHeight: 28,
  },
  performanceStatLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  performanceStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  performanceLatestPr: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  performanceCardLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
