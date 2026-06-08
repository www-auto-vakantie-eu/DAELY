import React from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT, Workout, Program } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../../../constants/sport-disciplines';

interface WeekDayWorkout {
  week: number;
  day: number;
  workout?: Workout;
}

export default function DisciplineProgramDetailScreen() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const router = useRouter();
  const theme = useTheme();

  const program = React.useMemo(() => {
    if (!id || !slug) return null;
    const disciplineContent = DISCIPLINE_CONTENT[slug as keyof typeof DISCIPLINE_CONTENT];
    if (disciplineContent?.programs) {
      return disciplineContent.programs.find((p: Program) => p.id === id);
    }
    return null;
  }, [id, slug]);

  const discipline = React.useMemo(() => {
    if (!slug) return null;
    return SPORT_DISCIPLINES.find(d => d.id === slug);
  }, [slug]);

  const workouts = React.useMemo(() => {
    if (!slug) return [];
    const disciplineContent = DISCIPLINE_CONTENT[slug as keyof typeof DISCIPLINE_CONTENT];
    return disciplineContent?.workouts ?? [];
  }, [slug]);

  const weeklyPlan = React.useMemo(() => {
    if (!program || !program.workoutIds || !program.daysPerWeek || !program.weeks) {
      return [];
    }

    const plan: WeekDayWorkout[] = [];
    for (let week = 1; week <= program.weeks; week++) {
      for (let day = 1; day <= program.daysPerWeek; day++) {
        const workoutIndex = (day - 1) % program.workoutIds.length;
        const workoutId = program.workoutIds[workoutIndex];
        const workout = workouts.find((w: Workout) => w.id === workoutId);
        plan.push({ week, day, workout });
      }
    }
    return plan;
  }, [program, workouts]);

  const handleStartWorkout = (workoutId: string, week: number, day: number) => {
    router.push({
      pathname: '/tracker/[disciplineId]/start',
      params: {
        disciplineId: slug,
        workoutId,
        programId: id,
        week: String(week),
        day: String(day),
      },
    });
  };

  if (!program) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
          </Pressable>
          <Text style={[styles.title, { color: theme.titleColor }]}>Programma niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Dit programma kon niet worden geladen.
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

        <View style={[styles.iconBox, { backgroundColor: '#2563EB22' }]}>
          <MaterialCommunityIcons name="calendar-week" size={48} color="#2563EB" />
        </View>

        <Text style={[styles.programName, { color: theme.titleColor }]}>
          {program.name}
        </Text>

        <View style={styles.metaContainer}>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {program.duration}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={'#F59E0B'} />
            <Text style={[styles.metaText, { color: '#F59E0B' }]}>
              {program.level}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="calendar-week" size={16} color={theme.subtitleColor} />
            <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
              {program.weeks} weken
            </Text>
          </View>
          {program.daysPerWeek && (
            <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="calendar" size={16} color={theme.subtitleColor} />
              <Text style={[styles.metaText, { color: theme.subtitleColor }]}>
                {program.daysPerWeek} dagen/week
              </Text>
            </View>
          )}
        </View>

        {discipline && (
          <View style={styles.disciplineContainer}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Discipline</Text>
            <Text style={[styles.disciplineName, { color: theme.titleColor }]}>
              {discipline.name}
            </Text>
          </View>
        )}

        {program.goal && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Doel</Text>
            <Text style={[styles.sectionText, { color: theme.titleColor }]}>
              {program.goal}
            </Text>
          </View>
        )}

        {program.description && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.label, { color: theme.subtitleColor }]}>Beschrijving</Text>
            <Text style={[styles.sectionText, { color: theme.titleColor }]}>
              {program.description}
            </Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Wekelijkse Schema</Text>

        {weeklyPlan.length === 0 ? (
          <View style={[styles.placeholderContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="information-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.placeholderTitle, { color: theme.titleColor }]}>
              Het weekschema
            </Text>
            <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>
              Wordt later gekoppeld.
            </Text>
          </View>
        ) : (
          <View style={styles.weeksContainer}>
            {weeklyPlan.map((item) => {
              if (!item || !item.workout) return null;
              return (
                <View
                  key={`${item.week}-${item.day}`}
                  style={[styles.dayCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={styles.dayHeader}>
                    <Text style={[styles.weekDayLabel, { color: theme.subtitleColor }]}>
                      Week {item.week} · Dag {item.day}
                    </Text>
                  </View>
                  <View style={styles.workoutInfo}>
                    <View style={[styles.workoutIconBox, { backgroundColor: item.workout.color + '22' }]}>
                      <MaterialCommunityIcons name={item.workout.icon as any} size={24} color={item.workout.color} />
                    </View>
                    <View style={styles.workoutDetails}>
                      <Text style={[styles.workoutName, { color: theme.titleColor }]}>
                        {item.workout.name}
                      </Text>
                      <Text style={[styles.workoutMeta, { color: theme.subtitleColor }]}>
                        {item.workout.muscle} · {item.workout.duration}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.startWorkoutButton, { backgroundColor: item.workout?.color || '#2563EB' }]}
                    onPress={() => item.workout && handleStartWorkout(item.workout.id, item.week, item.day)}
                    activeOpacity={0.8}
                    disabled={!item.workout}
                  >
                    <MaterialCommunityIcons name="play" size={16} color="#FFFFFF" />
                    <Text style={styles.startWorkoutButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
  programName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
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
  weeksContainer: {
    gap: 12,
  },
  dayCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  dayHeader: {
    marginBottom: 12,
  },
  weekDayLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: 14,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 6,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});