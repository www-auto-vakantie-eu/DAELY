import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { getPerformanceSummary, type PerformanceSummary } from '@/services/performance-summary';
import { useAppContext } from '@/contexts/AppContext';

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
    description: 'Schema\'s, volume, progressie en volgende sessies.',
    category: 'TRAINING',
    accent: '#2563EB',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    route: '/workouts',
  },
  {
    id: 'my-programs',
    title: 'Mijn programma\'s',
    description: 'Actieve en voltooide trainingsschema\'s.',
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
    id: 'creator-studio',
    title: 'Creator Studio',
    description: 'Challenges, code, groei en samenwerkingen.',
    category: 'CREATOR',
    accent: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1200&q=80',
    route: '/creator-dashboard',
  },
];

export default function MijnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { accountType } = useAppContext();
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);

  // Filter cards based on account type
  const filteredCards = MY_DOMAIN_CARDS.filter(card => {
    // Creator Studio card only for influencer accounts
    if (card.id === 'creator-studio') {
      return accountType === 'influencer';
    }
    return true;
  });

  useEffect(() => {
    getPerformanceSummary().then(setPerformanceSummary);
  }, []);

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
              <View style={styles.performanceCardContent}>
                <View style={styles.performanceCardHeader}>
                  <Text style={styles.performanceCardTitle}>Mijn prestaties</Text>
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
            </Pressable>
          )}
          {filteredCards.map((card) => (
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
                      <Text style={styles.heroTitle}>{card.title}</Text>
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
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  cardsWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  verticalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 220,
    marginBottom: 16,
  },
  slideCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  heroImage: {
    flex: 1,
  },
  heroImageStyle: {
    borderRadius: 24,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTextBlock: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    color: '#FFFFFF',
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  performanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  performanceCardGradient: {
    padding: 20,
  },
  performanceCardContent: {
    gap: 16,
  },
  performanceCardHeader: {
    marginBottom: 0,
  },
  performanceCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    color: '#0F172A',
  },
  performanceCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  performanceStat: {
    flex: 1,
  },
  performanceStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    lineHeight: 32,
  },
  performanceStatLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  performanceStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#DBEAFE',
  },
  performanceLatestPr: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  performanceCardLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 8,
  },
});
