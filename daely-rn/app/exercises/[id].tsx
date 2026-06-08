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

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
        </Pressable>

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
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={'#F59E0B'} />
            <Text style={[styles.metaText, { color: '#F59E0B' }]}>
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

        <View style={[styles.placeholderContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information-outline" size={48} color={theme.subtitleColor} />
          <Text style={[styles.placeholderTitle, { color: theme.titleColor }]}>
            Uitvoering en video-instructies
          </Text>
          <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>
            Worden later toegevoegd.
          </Text>
        </View>
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
  placeholderContainer: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
});