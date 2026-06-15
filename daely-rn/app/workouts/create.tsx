import { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { saveCustomWorkoutTemplate, type CustomWorkoutTemplate } from '@/services/custom-workout-storage';

type Exercise = {
  id: string;
  name: string;
  spiergroep: string;
  categorie: string;
  moeilijkheid: 'Beginner' | 'Gemiddeld' | 'Gevorderd';
  discipline: string;
  instructions?: string[];
};

type ExerciseConfig = {
  sets: string;
  reps: string;
  weightKg: string;
  durationSeconds: string;
  restSeconds: string;
  note: string;
};

export default function WorkoutBuilderScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const [selectedExerciseConfigs, setSelectedExerciseConfigs] = useState<Record<string, ExerciseConfig>>({});
  const [workoutName, setWorkoutName] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');

  // Collect all exercises from all disciplines
  const allExercises = useMemo(() => {
    const exercises: Exercise[] = [];
    
    for (const disciplineKey in DISCIPLINE_CONTENT) {
      const disciplineContent = DISCIPLINE_CONTENT[disciplineKey as keyof typeof DISCIPLINE_CONTENT];
      if (disciplineContent?.exercises) {
        disciplineContent.exercises.forEach((ex: any) => {
          exercises.push({
            id: ex.id,
            name: ex.name,
            spiergroep: ex.spiergroep,
            categorie: ex.categorie,
            moeilijkheid: ex.moeilijkheid,
            discipline: disciplineKey,
            instructions: ex.instructions,
          });
        });
      }
    }
    
    return exercises;
  }, []);

  // Filter exercises by search query
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) {
      return allExercises;
    }
    
    const query = searchQuery.toLowerCase();
    return allExercises.filter(exercise =>
      exercise.name.toLowerCase().includes(query) ||
      exercise.spiergroep.toLowerCase().includes(query) ||
      exercise.categorie.toLowerCase().includes(query) ||
      exercise.discipline.toLowerCase().includes(query)
    );
  }, [allExercises, searchQuery]);

  // Get selected exercises
  const selectedExercises = useMemo(() => {
    return allExercises.filter(ex => selectedExerciseIds.has(ex.id));
  }, [allExercises, selectedExerciseIds]);

  const toggleExercise = (exerciseId: string) => {
    setSelectedExerciseIds(prev => {
      const newSet = new Set(prev);
      setSelectedExerciseConfigs(prevConfigs => {
        const newConfigs = { ...prevConfigs };
        if (newSet.has(exerciseId)) {
          newSet.delete(exerciseId);
          delete newConfigs[exerciseId];
        } else {
          newSet.add(exerciseId);
          newConfigs[exerciseId] = {
            sets: '3',
            reps: '10',
            weightKg: '',
            durationSeconds: '',
            restSeconds: '60',
            note: '',
          };
        }
        return newConfigs;
      });
      return newSet;
    });
  };

  const updateConfig = (exerciseId: string, field: keyof ExerciseConfig, value: string) => {
    setSelectedExerciseConfigs(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const handleStartWorkout = () => {
    if (selectedExerciseIds.size === 0) {
      return;
    }
    
    // Calculate total sets
    const totalSets = selectedExercises.reduce((sum, ex) => {
      const config = selectedExerciseConfigs[ex.id];
      return sum + parseInt(config?.sets || '0', 10);
    }, 0);

    const exerciseNames = selectedExercises.slice(0, 3).map(ex => ex.name).join(', ');
    const moreText = selectedExercises.length > 3 ? ` + ${selectedExercises.length - 3} meer` : '';
    
    alert(`Workout samengesteld:\n\n• ${selectedExerciseIds.size} oefeningen\n• ${totalSets} sets totaal\n\n${exerciseNames}${moreText}\n\nStart-flow wordt in de volgende stap gekoppeld.`);
  };

  const handleSaveWorkout = async () => {
    if (selectedExerciseIds.size === 0) {
      Alert.alert('Geen oefeningen', 'Selecteer eerst minimaal één oefening om je workout op te slaan.');
      return;
    }

    const title = workoutName.trim() || 'Eigen workout';
    const goal = workoutGoal.trim() || undefined;

    const template: CustomWorkoutTemplate = {
      id: `custom-${Date.now()}`,
      title,
      goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: selectedExercises.map((exercise) => {
        const config = selectedExerciseConfigs[exercise.id];
        return {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          discipline: exercise.discipline,
          spiergroep: exercise.spiergroep,
          categorie: exercise.categorie,
          moeilijkheid: exercise.moeilijkheid,
          sets: config?.sets || '3',
          reps: config?.reps || '10',
          weightKg: config?.weightKg || '',
          durationSeconds: config?.durationSeconds || '',
          restSeconds: config?.restSeconds || '60',
          note: config?.note || '',
        };
      }),
    };

    try {
      await saveCustomWorkoutTemplate(template);
      Alert.alert('Opgeslagen', `"${title}" is opgeslagen als eigen workout.`);
    } catch {
      Alert.alert('Fout', 'Er ging iets mis bij het opslaan van je workout.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#22C55E';
      case 'Gemiddeld': return '#F59E0B';
      case 'Gevorderd': return '#EF4444';
      default: return '#64748B';
    }
  };

  const formatDisciplineName = (discipline: string) => {
    return discipline
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const ConfigCard = ({ exercise, config }: { exercise: Exercise; config: ExerciseConfig }) => {
    return (
      <View style={[styles.configCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.configHeader}>
          <View style={styles.configHeaderLeft}>
            <Text style={[styles.configTitle, { color: theme.titleColor }]}>{exercise.name}</Text>
            <Text style={[styles.configSubtitle, { color: theme.subtitleColor }]}>
              {formatDisciplineName(exercise.discipline)} • {exercise.spiergroep}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleExercise(exercise.id)}>
            <MaterialCommunityIcons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.configRow}>
          <View style={styles.configInput}>
            <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Sets</Text>
            <TextInput
              style={[styles.configInputField, { backgroundColor: '#F1F5F9', color: theme.titleColor }]}
              value={config.sets}
              onChangeText={(value) => updateConfig(exercise.id, 'sets', value)}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.configInput}>
            <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Reps</Text>
            <TextInput
              style={[styles.configInputField, { backgroundColor: '#F1F5F9', color: theme.titleColor }]}
              value={config.reps}
              onChangeText={(value) => updateConfig(exercise.id, 'reps', value)}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.configInput}>
            <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Gewicht (kg)</Text>
            <TextInput
              style={[styles.configInputField, { backgroundColor: '#F1F5F9', color: theme.titleColor }]}
              value={config.weightKg}
              onChangeText={(value) => updateConfig(exercise.id, 'weightKg', value)}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={theme.subtitleColor}
            />
          </View>
        </View>

        <View style={styles.configRow}>
          <View style={styles.configInput}>
            <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Tijd (sec)</Text>
            <TextInput
              style={[styles.configInputField, { backgroundColor: '#F1F5F9', color: theme.titleColor }]}
              value={config.durationSeconds}
              onChangeText={(value) => updateConfig(exercise.id, 'durationSeconds', value)}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor={theme.subtitleColor}
            />
          </View>
          <View style={styles.configInput}>
            <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Rust (sec)</Text>
            <TextInput
              style={[styles.configInputField, { backgroundColor: '#F1F5F9', color: theme.titleColor }]}
              value={config.restSeconds}
              onChangeText={(value) => updateConfig(exercise.id, 'restSeconds', value)}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.configNote}>
          <Text style={[styles.configLabel, { color: theme.subtitleColor }]}>Notitie</Text>
          <TextInput
            style={[styles.configNoteField, { backgroundColor: '#F1F5F9', color: theme.titleColor, borderColor: theme.border }]}
            value={config.note}
            onChangeText={(value) => updateConfig(exercise.id, 'note', value)}
            placeholder="Techniek, tempo of persoonlijke focus"
            placeholderTextColor={theme.subtitleColor}
            multiline
          />
        </View>
      </View>
    );
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.titleColor} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: theme.titleColor }]}>Workout samenstellen</Text>
              <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>
                Kies oefeningen uit de DAELY-bibliotheek
              </Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchInput, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
              <TextInput
                style={[styles.searchText, { color: theme.titleColor }]}
                placeholder="Zoek oefening..."
                placeholderTextColor={theme.subtitleColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons name="close-circle" size={20} color={theme.subtitleColor} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Workout Name and Goal */}
          {selectedExerciseIds.size > 0 && (
            <View style={styles.workoutMetaSection}>
              <TextInput
                style={[styles.workoutNameInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.titleColor }]}
                placeholder="Naam van je workout"
                placeholderTextColor={theme.subtitleColor}
                value={workoutName}
                onChangeText={setWorkoutName}
              />
              <TextInput
                style={[styles.workoutGoalInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.titleColor }]}
                placeholder="Doel (bijv. Full body, Kracht, Conditie)"
                placeholderTextColor={theme.subtitleColor}
                value={workoutGoal}
                onChangeText={setWorkoutGoal}
              />
            </View>
          )}

          {/* Your Workout Configuration Section */}
          {selectedExerciseIds.size > 0 && (
            <View style={styles.configSection}>
              <View style={styles.configSectionHeader}>
                <Text style={[styles.configSectionTitle, { color: theme.titleColor }]}>
                  Jouw workout ({selectedExerciseIds.size})
                </Text>
                <TouchableOpacity onPress={() => {
                  setSelectedExerciseIds(new Set());
                  setSelectedExerciseConfigs({});
                }}>
                  <Text style={styles.clearButton}>Wissen</Text>
                </TouchableOpacity>
              </View>
              
              {selectedExercises.map((exercise) => {
                const config = selectedExerciseConfigs[exercise.id];
                if (!config) return null;
                return <ConfigCard key={exercise.id} exercise={exercise} config={config} />;
              })}
            </View>
          )}

          {/* Save Workout Button */}
          {selectedExerciseIds.size > 0 && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
              <MaterialCommunityIcons name="content-save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Opslaan als workout</Text>
            </TouchableOpacity>
          )}

          {/* Exercise List */}
          <View style={styles.exerciseList}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>
              Alle oefeningen ({filteredExercises.length})
            </Text>
            
            {filteredExercises.map((exercise) => {
              const isSelected = selectedExerciseIds.has(exercise.id);
              
              return (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.exerciseCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    isSelected && styles.exerciseCardSelected
                  ]}
                  onPress={() => toggleExercise(exercise.id)}
                >
                  <View style={styles.exerciseLeft}>
                    <View style={styles.exerciseIcon}>
                      <MaterialCommunityIcons 
                        name="dumbbell" 
                        size={20} 
                        color={isSelected ? '#2563EB' : theme.subtitleColor} 
                      />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: theme.titleColor }]}>
                        {exercise.name}
                      </Text>
                      <View style={styles.exerciseMeta}>
                        <Text style={[styles.exerciseMetaText, { color: theme.subtitleColor }]}>
                          {formatDisciplineName(exercise.discipline)}
                        </Text>
                        <Text style={styles.exerciseMetaDot}>•</Text>
                        <Text style={[styles.exerciseMetaText, { color: theme.subtitleColor }]}>
                          {exercise.spiergroep}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.exerciseRight}>
                    <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(exercise.moeilijkheid)}20` }]}>
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.moeilijkheid) }]}>
                        {exercise.moeilijkheid}
                      </Text>
                    </View>
                    <View style={[
                      styles.checkbox, 
                      { backgroundColor: isSelected ? '#2563EB' : theme.border, borderColor: theme.border }
                    ]}>
                      {isSelected && (
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredExercises.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="dumbbell" size={48} color={theme.subtitleColor} />
                <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
                  Geen oefeningen gevonden
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Start CTA */}
      {selectedExerciseIds.size > 0 && (
        <View style={[styles.ctaContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.ctaButton, selectedExerciseIds.size === 0 && styles.ctaButtonDisabled]}
            onPress={handleStartWorkout}
            disabled={selectedExerciseIds.size === 0}
          >
            <Text style={styles.ctaButtonText}>Start workout</Text>
          </TouchableOpacity>
        </View>
      )}

      <SharedBottomNav activeTab="disciplines" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  configSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  configSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  configSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  clearButton: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  configCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  configHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  configHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  configSubtitle: {
    fontSize: 13,
  },
  configRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  configInput: {
    flex: 1,
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  configInputField: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  configNote: {
    marginBottom: 0,
  },
  configNoteField: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    minHeight: 60,
    borderWidth: 1,
  },
  exerciseList: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 72,
  },
  exerciseCardSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#2563EB',
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseMetaText: {
    fontSize: 13,
  },
  exerciseMetaDot: {
    fontSize: 13,
    color: '#64748B',
  },
  exerciseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
  workoutMetaSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  workoutNameInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  workoutGoalInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});