/**
 * Exercise Thumbnail Manifest Foundation
 * 
 * This is a manifest foundation for exercise thumbnails - no full asset migration yet.
 * Assets will be batch-numbered later according to the strategy in:
 * docs/exercises/thumbnail-numbering-strategy.md
 * 
 * The manifest will be populated incrementally per muscle group during future migration phases.
 * app/discipline/[slug].tsx will be connected to this manifest in a later phase.
 * Old hardcoded requires in FITNESS_THUMBNAIL_MAP remain for now.
 * 
 * DO NOT:
 * - Rename, move, or delete any assets based on this foundation
 * - Replace existing thumbnail imports
 * - Modify app/discipline/[slug].tsx
 * - Stage any assets
 * 
 * This foundation provides:
 * - Type-safe structure for thumbnail entries
 * - Muscle group code mappings
 * - Helper functions for future thumbnail lookup
 * - Fallback logic for gender-specific thumbnails
 */

import type { ImageSourcePropType } from 'react-native';

// Types
export type ExerciseThumbnailGender = 'male' | 'female';

export type ExerciseThumbnailFolder = 'Mannen' | 'Vrouwen';

export type ExerciseThumbnailMuscleGroupCode =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09';

export type ExerciseThumbnailMuscleGroup =
  | 'borst'
  | 'biceps'
  | 'triceps'
  | 'schouders'
  | 'bovenrug'
  | 'onderrug'
  | 'buik-core'
  | 'billen-glutes'
  | 'benen';

// Muscle group mapping
export const EXERCISE_THUMBNAIL_MUSCLE_GROUPS = {
  '01': 'borst',
  '02': 'biceps',
  '03': 'triceps',
  '04': 'schouders',
  '05': 'bovenrug',
  '06': 'onderrug',
  '07': 'buik-core',
  '08': 'billen-glutes',
  '09': 'benen',
} as const;

// Entry type
export type ExerciseThumbnailEntry = {
  id: string;
  exerciseId: string;
  muscleGroupCode: ExerciseThumbnailMuscleGroupCode;
  muscleGroup: ExerciseThumbnailMuscleGroup;
  male?: ImageSourcePropType;
  female?: ImageSourcePropType;
  fallback?: ImageSourcePropType;
  notes?: string;
};

// Manifest object - pilot entries for chest muscle group (01)
// Will be populated incrementally per muscle group during migration
export const exerciseThumbnailManifest: Record<string, ExerciseThumbnailEntry> = {
  '1-1': {
    id: '1-1',
    exerciseId: '1-1',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-001.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-001.png'),
    notes: 'Pilot borst thumbnail mapping: barbell bench press',
  },
  '1-17': {
    id: '1-17',
    exerciseId: '1-17',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-002.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-002.png'),
    notes: 'Pilot borst thumbnail mapping: machine chest press',
  },
  '1-2': {
    id: '1-2',
    exerciseId: '1-2',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-003.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-003.png'),
    notes: 'Batch 2 borst thumbnail mapping: incline-bench-press',
  },
  '1-10': {
    id: '1-10',
    exerciseId: '1-10',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-004.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-004.png'),
    notes: 'Batch 2 borst thumbnail mapping: dumbbell-press',
  },
  '1-14': {
    id: '1-14',
    exerciseId: '1-14',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-005.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-005.png'),
    notes: 'Batch 2 borst thumbnail mapping: single-arm-dumbbell-press',
  },
  '1-15': {
    id: '1-15',
    exerciseId: '1-15',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-006.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-006.png'),
    notes: 'Batch 2 borst thumbnail mapping: dumbbell-fly',
  },
  '1-16': {
    id: '1-16',
    exerciseId: '1-16',
    muscleGroupCode: '01',
    muscleGroup: 'borst',
    male: require('@/assets/images/exercises/fitness/Mannen/m-01-007.png'),
    female: require('@/assets/images/exercises/fitness/Vrouwen/f-01-007.png'),
    notes: 'Batch 2 borst thumbnail mapping: incline-dumbbell-fly',
  },
};

// Helper functions

/**
 * Get exercise thumbnail entry by exercise ID
 */
export function getExerciseThumbnailEntry(exerciseId: string): ExerciseThumbnailEntry | undefined {
  return exerciseThumbnailManifest[exerciseId];
}

/**
 * Get exercise thumbnail for specific gender with fallback logic
 * Fallback priority: gender-specific -> opposite gender -> fallback -> undefined
 */
export function getExerciseThumbnailForGender(
  exerciseId: string,
  gender: ExerciseThumbnailGender
): ImageSourcePropType | undefined {
  const entry = getExerciseThumbnailEntry(exerciseId);

  if (!entry) return undefined;

  if (gender === 'female') {
    return entry.female ?? entry.male ?? entry.fallback;
  }

  return entry.male ?? entry.female ?? entry.fallback;
}

/**
 * Get muscle group name from code
 */
export function getMuscleGroupName(code: ExerciseThumbnailMuscleGroupCode): ExerciseThumbnailMuscleGroup {
  return EXERCISE_THUMBNAIL_MUSCLE_GROUPS[code];
}

/**
 * Check if exercise has thumbnail entry
 */
export function hasExerciseThumbnailEntry(exerciseId: string): boolean {
  return exerciseId in exerciseThumbnailManifest;
}