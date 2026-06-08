import React from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../../../constants/sport-disciplines';

export default function DisciplineWorkoutDetailScreen() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const router = useRouter();
  const theme = useTheme();

  const workout = React.useMemo(() => {
    if (!id || !slug) return null;
    const disciplineContent = DISCIPLINE_CONTENT[slug as keyof typeof DISCIPLINE_CONTENT];
    if (disciplineContent?.workouts) {
      return disciplineContent.workouts.find((w: any) => w.id === id);
    }
    return null;
  }, [id, slug]);

  const discipline = React.useMemo(() => {
    if (!slug) return null;
    return SPORT_DISCIPLINES.find(d => d.id === slug);
  }, [slug]);

  if (!workout) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
          </Pressable>
          <Text style={[styles.title, { color: theme.titleColor }]}>Workout niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Deze workout kon niet worden geladen.
          </Text>
        </View>
      </View>
    );
  }

  const handleStartWorkout = () => {
    router.push({
      pathname: '/tracker/[disciplineId]/start',
      params: {
        disciplineId: slug,
        workoutId: id,
      },
    });
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={Platform.OS === 'web' ? styles.webContainer : undefined}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
          </Pressable>

        <View style={[styles.iconBox, { backgroundColor: workout.color + '22' }]}>
          <MaterialCommunityIcons name={workout.icon as any} size={48} color={workout.color} />
        </View>

        <Text style={[styles.workoutName, { color: theme.titleColor }]}>
          {workout.name}
        </Text>

        <Text style={[styles.muscle, { color: theme.subtitleColor }]}>
          {workout.muscle}
        </Text>

        <View style={styles.metaContainer}>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {workout.duration}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={'#F59E0B'} />
            <Text style={[styles.metaText, { color: '#F59E0B' }]}>
              {workout.level}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="dumbbell" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {workout.exercises} oefeningen
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

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: workout.color }]}
          onPress={handleStartWorkout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start workout</Text>
        </TouchableOpacity>

        <View style={[styles.placeholderContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information-outline" size={48} color={theme.subtitleColor} />
          <Text style={[styles.placeholderTitle, { color: theme.titleColor }]}>
            De exacte oefenlijst
          </Text>
          <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>
            Wordt later gekoppeld.
          </Text>
        </View>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  webContainer: {
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
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
  workoutName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  muscle: {
    fontSize: 16,
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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