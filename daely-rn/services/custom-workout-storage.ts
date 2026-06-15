import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_WORKOUTS_STORAGE_KEY = 'daely.custom.workouts.v1';

export interface CustomWorkoutTemplateExercise {
  exerciseId: string;
  exerciseName: string;
  discipline: string;
  spiergroep?: string;
  categorie?: string;
  moeilijkheid?: string;
  sets: string;
  reps: string;
  weightKg: string;
  durationSeconds: string;
  restSeconds: string;
  note: string;
}

export interface CustomWorkoutTemplate {
  id: string;
  title: string;
  goal?: string;
  createdAt: string;
  updatedAt: string;
  exercises: CustomWorkoutTemplateExercise[];
}

export async function getCustomWorkoutTemplates(): Promise<CustomWorkoutTemplate[]> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_WORKOUTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCustomWorkoutTemplate(template: CustomWorkoutTemplate): Promise<void> {
  try {
    const templates = await getCustomWorkoutTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      templates[existingIndex] = updatedTemplate;
    } else {
      templates.unshift(updatedTemplate);
    }

    await AsyncStorage.setItem(CUSTOM_WORKOUTS_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save custom workout template:', error);
  }
}

export async function deleteCustomWorkoutTemplate(id: string): Promise<void> {
  try {
    const templates = await getCustomWorkoutTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    await AsyncStorage.setItem(CUSTOM_WORKOUTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete custom workout template:', error);
  }
}

export async function getCustomWorkoutTemplateById(id: string): Promise<CustomWorkoutTemplate | null> {
  try {
    const templates = await getCustomWorkoutTemplates();
    return templates.find((t) => t.id === id) || null;
  } catch {
    return null;
  }
}