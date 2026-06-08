import React from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../constants/sport-disciplines';

export default function ExerciseDetailScreen() {
  const { id, disciplineSlug } = useLocalSearchParams<{ id: string; disciplineSlug?: string }>();
  const router = useRouter();
  const theme = useTheme();

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

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
        </Pressable>

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