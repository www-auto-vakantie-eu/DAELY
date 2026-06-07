import type { UserProfile, AppSettings } from '@/contexts/AppContext';

export type ContentAudience = 'male' | 'female' | 'neutral';

/**
 * Bepaalt de content audience op basis van user profile en app settings.
 * 
 * Prioriteit:
 * 1. appSettings.photoPreference (expliciete voorkeur)
 * 2. user.gender (profiel gender als fallback)
 * 3. neutral (als alles onbekend)
 */
export function resolveContentAudience(user: UserProfile, appSettings: AppSettings): ContentAudience {
  // Prioriteit 1: expliciete photoPreference instelling
  if (appSettings.photoPreference === 'man') {
    return 'male';
  }
  if (appSettings.photoPreference === 'woman') {
    return 'female';
  }

  // Prioriteit 2: fallback naar profile gender
  if (user.gender) {
    const genderLower = user.gender.toLowerCase();
    if (genderLower === 'man' || genderLower === 'male') {
      return 'male';
    }
    if (genderLower === 'vrouw' || genderLower === 'woman' || genderLower === 'female') {
      return 'female';
    }
  }

  // Prioriteit 3: neutral fallback
  return 'neutral';
}

/**
 * Discipline image interface met gender-specific opties
 */
export interface DisciplineMedia {
  image?: string; // neutral fallback
  images?: {
    man?: string; // male specific
    vrouw?: string; // female specific
  };
}

/**
 * Haalt de juiste discipline image op basis van content audience.
 * 
 * Prioriteit:
 * 1. audience-specific image (man/vrouw)
 * 2. neutral fallback image
 * 3. default fallback
 */
export function getGenderedDisciplineImage(
  media: DisciplineMedia,
  audience: ContentAudience,
  fallbackImage: string
): string {
  // Prioriteit 1: audience-specific image
  if (audience === 'male' && media.images?.man) {
    return media.images.man.trim();
  }
  if (audience === 'female' && media.images?.vrouw) {
    return media.images.vrouw.trim();
  }

  // Prioriteit 2: neutral fallback image
  if (media.image) {
    return media.image.trim();
  }

  // Prioriteit 3: default fallback
  return fallbackImage;
}