
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import { SPORT_DISCIPLINES } from '../../constants/sport-disciplines';
import {
  saveActivity,
  type WorkoutExercise,
  type SessionIntensity,
  type SessionFeeling,
} from 'services/activity-storage';

const SESSION_STATUS = {
  NOT_STARTED: 'Nog niet gestart',
  ACTIVE: 'Actief',
  PAUSED: 'Gepauzeerd',
  FINISHED: 'Afgerond',
} as const;

type SessionStatus = keyof typeof SESSION_STATUS;

const SESSION_INTENSITY_OPTIONS: SessionIntensity[] = ['laag', 'gemiddeld', 'hoog'];
const SESSION_FEELING_OPTIONS: SessionFeeling[] = ['laag', 'neutraal', 'goed', 'sterk'];

type ExerciseDraft = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weightKg: string;
  notes: string;
};

function createExerciseDraft(): ExerciseDraft {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    sets: '',
    reps: '',
    weightKg: '',
    notes: '',
  };
}

function toPositiveInt(value: string): number | null {
  const normalized = value.trim();
  if (normalized.length === 0) return null;
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function toOptionalPositiveNumber(value: string): number | undefined {
  const normalized = value.trim();
  if (normalized.length === 0) return undefined;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function toWorkoutExercise(draft: ExerciseDraft): WorkoutExercise | null {
  const name = draft.name.trim();
  const sets = toPositiveInt(draft.sets);
  const reps = toPositiveInt(draft.reps);
  if (!name || sets === null || reps === null) return null;

  return {
    id: draft.id,
    name,
    sets,
    reps,
    weightKg: toOptionalPositiveNumber(draft.weightKg),
    notes: draft.notes.trim().length > 0 ? draft.notes.trim() : undefined,
  };
}

function calculateTotalVolumeKg(exercises: WorkoutExercise[]): number | undefined {
  const total = exercises.reduce((sum, exercise) => {
    if (exercise.weightKg === undefined) return sum;
    return sum + exercise.sets * exercise.reps * exercise.weightKg;
  }, 0);

  return total > 0 ? total : undefined;
}

export default function StartActivityScreen() {
  const { disciplineId } = useLocalSearchParams<{ disciplineId: string }>();
  const discipline = SPORT_DISCIPLINES.find((d) => d.id === disciplineId);
  const isWorkoutDiscipline = discipline?.trackingType === 'workout';
  const isSessionDiscipline = discipline?.trackingType === 'session';

  const [status, setStatus] = useState<SessionStatus>('NOT_STARTED');
  const [seconds, setSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [sessionIntensity, setSessionIntensity] = useState<SessionIntensity | undefined>(undefined);
  const [sessionFocusAreasInput, setSessionFocusAreasInput] = useState('');
  const [sessionFeelingBefore, setSessionFeelingBefore] = useState<SessionFeeling | undefined>(undefined);
  const [sessionFeelingAfter, setSessionFeelingAfter] = useState<SessionFeeling | undefined>(undefined);
  const [sessionNotes, setSessionNotes] = useState('');
  const [exerciseDrafts, setExerciseDrafts] = useState<ExerciseDraft[]>([createExerciseDraft()]);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000) as unknown as number;
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = () => {
    setStatus('ACTIVE');
    startTimer();
  };
  const handlePause = () => {
    setStatus('PAUSED');
    stopTimer();
  };
  const handleResume = () => {
    setStatus('ACTIVE');
    startTimer();
  };
  const handleStop = () => {
    setStatus('FINISHED');
    stopTimer();
  };

  const handleAddExercise = () => {
    setExerciseDrafts((previous) => [...previous, createExerciseDraft()]);
  };

  const handleExerciseChange = (id: string, field: keyof ExerciseDraft, value: string) => {
    setExerciseDrafts((previous) =>
      previous.map((draft) => (draft.id === id ? { ...draft, [field]: value } : draft))
    );
  };

  const buildWorkoutExercises = (): WorkoutExercise[] | null => {
    const parsed = exerciseDrafts
      .map((draft) => toWorkoutExercise(draft))
      .filter((item): item is WorkoutExercise => item !== null);

    if (parsed.length === 0) {
      return null;
    }

    return parsed;
  };

  const buildSessionFocusAreas = (): string[] | undefined => {
    const areas = sessionFocusAreasInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return areas.length > 0 ? areas : undefined;
  };

  React.useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (!discipline) {
    return (
      <View style={styles.container}>
        <PageHeader title="Discipline niet gevonden" />
        <Text style={styles.fallback}>Deze discipline bestaat niet.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (saving || saved || status !== 'FINISHED') return;

    const workoutExercises = isWorkoutDiscipline ? buildWorkoutExercises() : null;
    if (isWorkoutDiscipline && !workoutExercises) {
      Alert.alert('Workout metrics ontbreken', 'Voeg minimaal een geldige oefening toe met naam, sets en reps.');
      return;
    }

    const sessionFocusAreas = isSessionDiscipline ? buildSessionFocusAreas() : undefined;

    setSaving(true);
    try {
      const now = new Date();
      const startedAt = new Date(now.getTime() - seconds * 1000);
      const totalVolumeKg = workoutExercises ? calculateTotalVolumeKg(workoutExercises) : undefined;
      await saveActivity({
        id: `${discipline.id}-${now.getTime()}`,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        trackingType: discipline.trackingType,
        startedAt: startedAt.toISOString(),
        endedAt: now.toISOString(),
        durationSeconds: seconds,
        status: 'completed',
        metrics:
          isWorkoutDiscipline || isSessionDiscipline
            ? {
                workout:
                  isWorkoutDiscipline && workoutExercises
                    ? {
                        exercises: workoutExercises,
                        totalVolumeKg,
                        notes: workoutNotes.trim().length > 0 ? workoutNotes.trim() : undefined,
                      }
                    : undefined,
                session: isSessionDiscipline
                  ? {
                      intensity: sessionIntensity,
                      focusAreas: sessionFocusAreas,
                      feelingBefore: sessionFeelingBefore,
                      feelingAfter: sessionFeelingAfter,
                      notes: sessionNotes.trim().length > 0 ? sessionNotes.trim() : undefined,
                    }
                  : undefined,
              }
            : undefined,
        createdAt: now.toISOString(),
      });
      setSaved(true);
      Alert.alert('Opgeslagen', 'Activiteit succesvol opgeslagen.');
    } catch {
      Alert.alert('Fout', 'Opslaan mislukt. Probeer opnieuw.');
    }
    setSaving(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <PageHeader title={`Start ${discipline.name}`} />
      <Text style={styles.meta}>{discipline.category} · {discipline.trackingType}</Text>
      <Text style={styles.status}>Status: {SESSION_STATUS[status]}</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <View style={styles.buttonRow}>
        {status === 'NOT_STARTED' && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        {status === 'ACTIVE' && (
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>Pauze</Text>
          </TouchableOpacity>
        )}
        {status === 'PAUSED' && (
          <TouchableOpacity style={styles.button} onPress={handleResume}>
            <Text style={styles.buttonText}>Hervatten</Text>
          </TouchableOpacity>
        )}
        {(status === 'ACTIVE' || status === 'PAUSED') && (
          <TouchableOpacity style={styles.button} onPress={handleStop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>

      {isWorkoutDiscipline && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Workout metrics</Text>
          {exerciseDrafts.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseTitle}>Oefening {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder="Oefeningnaam"
                value={exercise.name}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'name', value)}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Sets"
                  keyboardType="numeric"
                  value={exercise.sets}
                  onChangeText={(value) => handleExerciseChange(exercise.id, 'sets', value)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={exercise.reps}
                  onChangeText={(value) => handleExerciseChange(exercise.id, 'reps', value)}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Gewicht (kg) optioneel"
                keyboardType="decimal-pad"
                value={exercise.weightKg}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'weightKg', value)}
              />
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Notities optioneel"
                value={exercise.notes}
                onChangeText={(value) => handleExerciseChange(exercise.id, 'notes', value)}
                multiline
              />
            </View>
          ))}
          <TouchableOpacity style={styles.secondaryButton} onPress={handleAddExercise} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>+ Oefening toevoegen</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Algemene workout-notities optioneel"
            value={workoutNotes}
            onChangeText={setWorkoutNotes}
            multiline
          />
        </View>
      )}

      {isSessionDiscipline && status === 'FINISHED' && (
        <View style={styles.metricsBlock}>
          <Text style={styles.metricsTitle}>Session metrics</Text>
          {discipline.privacyDefault === 'private' ? (
            <Text style={styles.privacyNote}>Deze activiteit staat standaard prive.</Text>
          ) : null}

          <Text style={styles.fieldLabel}>Intensiteit</Text>
          <View style={styles.optionRow}>
            {SESSION_INTENSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionChip, sessionIntensity === option ? styles.optionChipActive : null]}
                onPress={() => setSessionIntensity(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionIntensity === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Focusgebieden</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. ademhaling, core, herstel"
            value={sessionFocusAreasInput}
            onChangeText={setSessionFocusAreasInput}
          />

          <Text style={styles.fieldLabel}>Gevoel voor</Text>
          <View style={styles.optionRow}>
            {SESSION_FEELING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`before-${option}`}
                style={[styles.optionChip, sessionFeelingBefore === option ? styles.optionChipActive : null]}
                onPress={() => setSessionFeelingBefore(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionFeelingBefore === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Gevoel na</Text>
          <View style={styles.optionRow}>
            {SESSION_FEELING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`after-${option}`}
                style={[styles.optionChip, sessionFeelingAfter === option ? styles.optionChipActive : null]}
                onPress={() => setSessionFeelingAfter(option)}
                accessibilityRole="button"
              >
                <Text style={[styles.optionChipText, sessionFeelingAfter === option ? styles.optionChipTextActive : null]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notities</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notities optioneel"
            value={sessionNotes}
            onChangeText={setSessionNotes}
            multiline
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.disabledButton, saved && styles.savedButton]}
        onPress={handleSave}
        disabled={saving || saved || status !== 'FINISHED'}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {saved ? 'Opgeslagen!' : saving ? 'Opslaan...' : 'Activiteit opslaan'}
        </Text>
      </TouchableOpacity>
      {saved && <Text style={styles.successText}>Activiteit opgeslagen.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  fallback: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 32,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  metricsBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  exerciseCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  notesInput: {
    minHeight: 42,
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  privacyNote: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  optionChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  optionChipText: {
    fontSize: 13,
    color: '#374151',
  },
  optionChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    marginTop: 12,
  },
  savedButton: {
    backgroundColor: '#22C55E',
  },
  successText: {
    color: '#22C55E',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
