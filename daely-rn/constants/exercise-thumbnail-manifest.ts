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

// Manifest object - currently empty foundation
// Will be populated incrementally per muscle group during migration
export const exerciseThumbnailManifest: Record<string, ExerciseThumbnailEntry> = {};

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