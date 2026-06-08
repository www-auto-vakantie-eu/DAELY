import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';

export default function ExerciseDetailScreen() {
  const { id, disciplineSlug } = useLocalSearchParams<{ id: string; disciplineSlug?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

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

  const discipline = React.useMemo(() => {
    if (!disciplineSlug) return null;
    return SPORT_DISCIPLINES.find(d => d.id === disciplineSlug);
  }, [disciplineSlug]);

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
      { id: 'demo', type: 'demo_video' as const, title: 'Voorbeeld', description: 'Visualisatie wordt voorbereid' },
      { id: 'muscle', type: 'muscle_highlight' as const, title: 'Spieren', description: `${exercise.spiergroep}` },
      { id: 'illustration', type: 'illustration' as const, title: 'Tekening', description: 'Techniektekening wordt voorbereid' },
    ];
  }, [exercise]);

  if (!exercise) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
          </Pressable>
          <Text style={[styles.title, { color: theme.titleColor }]}>Oefening niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Deze oefening kon niet worden geladen.
          </Text>
        </View>
      </View>
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

    const getSlideColor = () => {
      switch(item.type) {
        case 'demo_video': return '#2563EB';
        case 'muscle_highlight': return '#10B981';
        case 'illustration': return '#7C3AED';
        default: return '#6B7280';
      }
    };

    return (
      <View key={item.id} style={[styles.mediaSlide, { width: screenWidth }]}>
        <View style={[styles.mediaCard, { backgroundColor: theme.card }]}>
          <LinearGradient
            colors={[getSlideColor() + '33', getSlideColor() + '11']}
            style={styles.mediaGradient}
          />
          <View style={styles.mediaContent}>
            <View style={[styles.mediaIconContainer, { backgroundColor: getSlideColor() + '22' }]}>
              <MaterialCommunityIcons name={getSlideIcon() as any} size={64} color={getSlideColor()} />
            </View>
            <View style={styles.mediaBadge}>
              <Text style={styles.mediaBadgeText}>{item.title}</Text>
            </View>
            <Text style={[styles.mediaTitle, { color: theme.titleColor }]}>{item.description}</Text>
            {item.type === 'demo_video' && (
              <View style={[styles.playBadge, { backgroundColor: getSlideColor() }]}>
                <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
        </Pressable>

        {/* Media Hero Carousel */}
        <View style={styles.mediaHeader}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
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
                  { backgroundColor: index === activeMediaIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Premium Header */}
        <View style={[styles.iconBox, { backgroundColor: '#10B98122' }]}>
          <MaterialCommunityIcons name="human" size={48} color="#10B981" />
        </View>

        <Text style={[styles.exerciseName, { color: theme.titleColor }]}>
          {exercise.name}
        </Text>

        <View style={styles.metaContainer}>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="human" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {exercise.spiergroep}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="tag" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {exercise.categorie}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={getDifficultyColor(exercise.moeilijkheid)} />
            <Text style={[styles.metaText, { color: getDifficultyColor(exercise.moeilijkheid) }]}>
              {exercise.moeilijkheid}
            </Text>
          </View>
        </View>

        {discipline && (
          <View style={styles.disciplineContainer}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Discipline</Text>
            <Text style={[styles.disciplineName, { color: theme.titleColor }]}>
              {discipline.name}
            </Text>
          </View>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mediaHeader: {
    marginBottom: 24,
  },
  mediaSlide: {
    alignItems: 'center',
  },
  mediaCard: {
    width: '100%',
    height: 280,
    position: 'relative',
    overflow: 'hidden',
  },
  mediaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mediaContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mediaIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mediaBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  mediaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mediaTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  mediaDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  playBadge: {
    position: 'absolute',
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disciplineContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  disciplineName: {
    fontSize: 16,
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
});