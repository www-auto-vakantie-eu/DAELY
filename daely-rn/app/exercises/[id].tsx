import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { getExerciseStats, ExerciseStats } from '@/services/exercise-history';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function ExerciseDetailScreen() {
  const { id, disciplineSlug } = useLocalSearchParams<{ id: string; disciplineSlug?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const slideWidth = Platform.OS === 'web' ? Math.min(screenWidth, 430) : screenWidth;

  const exercise = React.useMemo(() => {
    if (!id) return null;

    if (disciplineSlug) {
      const disciplineContent = DISCIPLINE_CONTENT[disciplineSlug as keyof typeof DISCIPLINE_CONTENT];
      if (disciplineContent?.exercises) {
        return disciplineContent.exercises.find((e: any) => e.id === id);
      }
    }

    for (const disciplineKey in DISCIPLINE_CONTENT) {
      const disciplineContent = DISCIPLINE_CONTENT[disciplineKey as keyof typeof DISCIPLINE_CONTENT];
      if (disciplineContent?.exercises) {
        const found = disciplineContent.exercises.find((e: any) => e.id === id);
        if (found) return found;
      }
    }
    return null;
  }, [id, disciplineSlug]);

  const alternatives = React.useMemo(() => {
    if (!exercise || !disciplineSlug) return [];
    
    const disciplineContent = DISCIPLINE_CONTENT[disciplineSlug as keyof typeof DISCIPLINE_CONTENT];
    if (!disciplineContent?.exercises) return [];
    
    return disciplineContent.exercises
      .filter((e: any) => 
        e.id !== exercise.id && 
        (e.spiergroep === exercise.spiergroep || e.categorie === exercise.categorie)
      )
      .slice(0, 3);
  }, [exercise, disciplineSlug]);

  const mediaItems = React.useMemo(() => {
    if (!exercise) return [];
    if (exercise.mediaItems && exercise.mediaItems.length > 0) {
      return exercise.mediaItems;
    }
    // Fallback: always show 3 placeholder slides
    return [
      { id: 'demo', type: 'demo_video' as const, title: 'Voorbeeld', description: 'Bekijk de beweging stap voor stap' },
      { id: 'muscle', type: 'muscle_highlight' as const, title: 'Spierfocus', description: `Zie welke spieren vooral actief zijn` },
      { id: 'illustration', type: 'illustration' as const, title: 'Techniektekening', description: 'Bekijk de oefening in eenvoudige stappen' },
    ];
  }, [exercise]);

  useEffect(() => {
    if (exercise?.id || exercise?.name) {
      getExerciseStats(exercise.id, exercise.name).then(setExerciseStats);
    }
  }, [exercise?.id, exercise?.name]);

  if (!exercise) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.titleColor }]}>Oefening niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Deze oefening kon niet worden geladen.
          </Text>
        </View>
        <SharedBottomNav activeTab="disciplines" />
      </AppScreen>
    );
  }

  const getFallbackInstructions = () => [
    'Neem een gecontroleerde startpositie aan.',
    'Voer de beweging rustig en technisch uit.',
    'Houd spanning op de juiste spiergroep.',
    'Keer gecontroleerd terug naar de startpositie.',
  ];

  const getFallbackTechniqueTips = () => [
    'Focus op juiste houding en techniek boven snelheid.',
    'Houd je core stabiel tijdens de beweging.',
    'Adem rustig uit tijdens de inspanning.',
    'Gebruik een volledige bewegingsuitslag zonder te compenseren.',
    'Span de doelspiergroep aan tijdens de beweging.',
  ];

  const getFallbackCommonMistakes = () => [
    'Te snel uitvoeren ten koste van techniek.',
    'Slechte houding of compensatiebewegingen.',
    'Geen controle over de beweging.',
    'Verkeerde ademhaling of adem inhouden.',
    'Te zwaar starten zonder goede techniek.',
  ];

  const getFallbackSafetyNotes = () => [
    'Stop direct bij scherpe pijn of ongemak.',
    'Kies een niveau dat je technisch goed kunt uitvoeren.',
    'Bouw rustig op in gewicht of intensiteit.',
    'Bij blessure of zwangerschap, raadpleeg een professional.',
  ];

  const getFallbackEquipment = () => {
    if (exercise.categorie === 'Bodyweight' || exercise.categorie === 'Calisthenics') {
      return ['Lichaamsgewicht'];
    }
    return ['Geen specifieke benodigdheden'];
  };

  const getDifficultyColor = (level: string) => {
    switch(level) {
      case 'Beginner': return '#10B981';
      case 'Gemiddeld': return '#F59E0B';
      case 'Gevorderd': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Vandaag';
    if (diffDays === 1) return 'Gisteren';
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  const formatSet = (set?: { reps?: number; weightKg?: number; durationSeconds?: number }) => {
    if (!set) return '-';
    if (set.weightKg !== undefined && set.reps !== undefined) {
      return `${set.weightKg} kg × ${set.reps}`;
    }
    if (set.reps !== undefined) {
      return `${set.reps} herhalingen`;
    }
    if (set.durationSeconds !== undefined) {
      const minutes = Math.floor(set.durationSeconds / 60);
      const seconds = set.durationSeconds % 60;
      return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }
    return '-';
  };

  const renderSection = (title: string, icon: string, children: React.ReactNode) => (
    <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon as any} size={20} color={theme.titleColor} />
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderBulletPoints = (items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    return items.map((item, index) => (
      <View key={index} style={styles.bulletItem}>
        <View style={[styles.bullet, { backgroundColor: theme.border }]} />
        <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>{item}</Text>
      </View>
    ));
  };

  const renderMediaSlide = (item: any, index: number) => {
    const getSlideIcon = () => {
      switch(item.type) {
        case 'demo_video': return 'play-circle';
        case 'muscle_highlight': return 'human';
        case 'illustration': return 'drawing';
        default: return 'image';
      }
    };

    const getSlideGradientColor = () => {
      switch(item.type) {
        case 'demo_video': return '#2563EB';
        case 'muscle_highlight': return '#10B981';
        case 'illustration': return '#7C3AED';
        default: return '#6B7280';
      }
    };

    const gradientColor = getSlideGradientColor();

    return (
      <View key={item.id} style={[styles.mediaSlide, { width: slideWidth }]}>
        <LinearGradient
          colors={[gradientColor + '88', gradientColor + '44']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.mediaCard}
        >
          <View style={styles.mediaGradient}>
            <View style={styles.mediaIconContainer}>
              <MaterialCommunityIcons name={getSlideIcon() as any} size={72} color="#FFFFFF" />
            </View>
            {item.type === 'demo_video' && (
              <View style={styles.playBadge}>
                <MaterialCommunityIcons name="play" size={32} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.mediaTextBlock}>
            <View style={styles.mediaBadge}>
              <Text style={styles.mediaBadgeText}>{item.title}</Text>
            </View>
            <Text style={styles.mediaDescription}>{item.description}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Media Hero Carousel */}
          <View style={styles.mediaHeader}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={slideWidth}
              snapToAlignment="start"
              decelerationRate="fast"
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
                setActiveMediaIndex(index);
              }}
            >
              {mediaItems.map((item, index) => renderMediaSlide(item, index))}
            </ScrollView>
            <View style={styles.paginationDots}>
              {mediaItems.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: index === activeMediaIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.content}>
            {/* Premium Title Card */}
            <View style={[styles.titleCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.exerciseName, { color: theme.titleColor }]}>
                {exercise.name}
              </Text>
              <Text style={[styles.focusText, { color: theme.subtitleColor }]}>
                Focus op {exercise.spiergroep} • {exercise.categorie}
              </Text>
              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.moeilijkheid) + '22' }]}>
                  <Text style={[styles.badgeText, { color: getDifficultyColor(exercise.moeilijkheid) }]}>
                    {exercise.moeilijkheid}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.border }]}>
                  <Text style={[styles.badgeText, { color: theme.subtitleColor }]}>
                    {exercise.categorie}
                  </Text>
                </View>
              </View>
            </View>

            {/* Jouw historie */}
            {renderSection('Jouw historie', 'history',
              exerciseStats && exerciseStats.timesPerformed > 0 ? (
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Laatste keer</Text>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>
                      {exerciseStats.lastPerformedAt ? formatDate(exerciseStats.lastPerformedAt) : '-'}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Laatste set</Text>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>
                      {formatSet(exerciseStats.lastSet)}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Beste set</Text>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>
                      {formatSet(exerciseStats.bestSet)}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Aantal keer</Text>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>
                      {exerciseStats.timesPerformed}×
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={[styles.noHistoryText, { color: theme.subtitleColor }]}>
                  Je hebt deze oefening nog niet gelogd.
                </Text>
              )
            )}

        {/* Uitvoering */}
        {renderSection('Uitvoering', 'run', renderBulletPoints(exercise.instructions || getFallbackInstructions()))}

        {/* Techniekpunten */}
        {renderSection('Waar let je op?', 'eye', renderBulletPoints(exercise.techniqueTips || getFallbackTechniqueTips()))}

        {/* Veelgemaakte fouten */}
        {renderSection('Veelgemaakte fouten', 'alert-circle', renderBulletPoints(exercise.commonMistakes || getFallbackCommonMistakes()))}

        {/* Alternatieven */}
        {alternatives.length > 0 && (
          renderSection('Alternatieven', 'swap-horizontal', 
            alternatives.map((alt: any) => (
              <Pressable 
                key={alt.id}
                style={[styles.altItem, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => router.push({
                  pathname: '/exercises/[id]',
                  params: { id: alt.id, disciplineSlug }
                })}
              >
                <Text style={[styles.altName, { color: theme.titleColor }]}>{alt.name}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
              </Pressable>
            ))
          )
        )}

        {/* Veiligheid */}
        {renderSection('Veiligheid & Tips', 'shield-check', renderBulletPoints(exercise.safetyNotes || getFallbackSafetyNotes()))}

        {/* Equipment */}
        {renderSection('Benodigdheden', 'dumbbell',
          <View style={styles.chipContainer}>
            {(exercise.equipment || getFallbackEquipment()).map((item, index) => (
              <View key={index} style={[styles.equipmentChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.equipmentText, { color: theme.subtitleColor }]}>{item}</Text>
              </View>
            ))}
          </View>
        )}
          </View>
      </ScrollView>
      <SharedBottomNav activeTab="disciplines" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mediaHeader: {
    height: 280,
    position: 'relative',
  },
  mediaSlide: {
    alignItems: 'center',
  },
  mediaCard: {
    width: '100%',
    height: 280,
  },
  mediaGradient: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  mediaIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  playBadge: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mediaTextBlock: {
    gap: 4,
  },
  mediaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 8,
  },
  mediaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mediaDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28,
    marginBottom: 24,
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  focusText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  altItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  altName: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  equipmentText: {
    fontSize: 13,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  noHistoryText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});