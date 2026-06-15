import { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

type Exercise = {
  id: string;
  name: string;
  spiergroep: string;
  categorie: string;
  moeilijkheid: 'Beginner' | 'Gemiddeld' | 'Gevorderd';
  discipline: string;
  instructions?: string[];
};

export default function WorkoutBuilderScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());

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
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleStartWorkout = () => {
    if (selectedExerciseIds.size === 0) {
      return;
    }
    
    // For MVP: show alert that workout is ready
    // In future: integrate with existing tracker/start-flow
    alert(`Workout samengesteld met ${selectedExerciseIds.size} oefeningen.\n\nStart-flow wordt in de volgende stap gekoppeld.`);
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

          {/* Selected Overview */}
          {selectedExerciseIds.size > 0 && (
            <View style={[styles.selectedOverview, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.selectedHeader}>
                <Text style={[styles.selectedTitle, { color: theme.titleColor }]}>
                  Geselecteerd: {selectedExerciseIds.size}
                </Text>
                <TouchableOpacity onPress={() => setSelectedExerciseIds(new Set())}>
                  <Text style={styles.clearButton}>Wissen</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedList}>
                {selectedExercises.slice(0, 10).map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[styles.selectedChip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}
                    onPress={() => toggleExercise(exercise.id)}
                  >
                    <Text style={styles.selectedChipText}>{exercise.name}</Text>
                    <MaterialCommunityIcons name="close" size={14} color="#64748B" />
                  </TouchableOpacity>
                ))}
                {selectedExerciseIds.size > 10 && (
                  <View style={[styles.selectedChip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                    <Text style={styles.selectedChipText}>+{selectedExerciseIds.size - 10} meer</Text>
                  </View>
                )}
              </ScrollView>
            </View>
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
  selectedOverview: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  selectedList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
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