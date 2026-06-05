import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';

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
    id: 'nutrition',
    title: 'Voeding',
    description: 'Weekgemiddelden, macro\'s en adherence op doel.',
    category: 'VOEDING',
    accent: '#059669',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    route: '/my-nutrition',
  },
  {
    id: 'mind',
    title: 'Mind',
    description: 'Binnenkort beschikbaar op jouw Mijn-pagina.',
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
    id: 'feedback',
    title: 'Feedback',
    description: 'Deel ideeën, bugs en verbeteringen met DAELY.',
    category: 'FEEDBACK',
    accent: '#2563EB',
    image: 'https://images.unsplash.com/photo-1542744173-8f7f515655d9?auto=format&fit=crop&w=1200&q=80',
    route: '/feedback',
  },
  {
    id: 'find-coach',
    title: 'Vind Coach',
    description: 'Zoek begeleiding die past bij jouw doelen.',
    category: 'COACH',
    accent: '#10B981',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    route: '/find-coach',
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
];

export default function MijnScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleCardPress = (route: Href) => {
    router.push(route);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mijn"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />
        
        <Pressable
          style={styles.startActivityButton}
          onPress={() => router.push('/tracker')}
        >
          <Text style={styles.startActivityText}>Start activiteit</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/activities')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Activiteiten</Text>
        </Pressable>

        <View style={styles.cardsWrap}>
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
                    <Text style={[
                      styles.heroTitle,
                      card.id === 'progress' && { color: card.accent },
                      card.id === 'workouts' && { color: '#2563EB' },
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
                    <Text style={styles.heroDescription}>{card.description}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  startActivityButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startActivityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cardsWrap: {
    padding: 16,
    gap: 14,
  },
  verticalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 140,
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
  secondaryButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
