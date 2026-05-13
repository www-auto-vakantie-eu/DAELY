// --- Partners per creator ---
import { PARTNERS } from '../constants/partners';

export type Partner = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  promotion?: string;
};

// Dummy mapping: creatorId -> partnerIds
const CREATOR_PARTNERS: Record<string, string[]> = {
  'tim-hofman': ['myprotein', 'body-fit'],
  'marijn-kuipers': ['xxl-nutrition', 'optimum-nutrition'],
  'elise-janssen': ['orangefit'],
  // ...meer mappings
};

export async function getCreatorPartners(creatorId: string): Promise<Partner[]> {
  const partnerIds = CREATOR_PARTNERS[creatorId] || [];
  // Map partnerId naar Partner info uit PARTNERS
  return partnerIds.map((id) => {
    const p = PARTNERS.find((x) => x.id === id);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      logo: p.image,
      website: p.offerUrl,
      description: p.summary,
      promotion: p.discountLabel ? `${p.discountLabel} met code ${p.discountCode}` : undefined,
    };
  }).filter(Boolean) as Partner[];
}
import { COMMUNITY_CREATORS } from '@/constants/community-creators';
import {
  getCreatorPosts,
  getCreatorMealEntries,
  getCreatorWorkoutEntries,
} from '@/services/creator-content';

export type CreatorBadge = 'VERIFIED' | 'PRO' | 'ELITE' | 'COACH';

export interface CreatorAchievementBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  unlockedAt?: string;
}

export interface CreatorStats {
  totalPosts: number;
  approvedPosts: number;
  totalMeals: number;
  approvedMeals: number;
  totalWorkouts: number;
  approvedWorkouts: number;
  engagement: number; // Placeholder for likes/comments
  joinedDate: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  specialty: string;
  badge: CreatorBadge;
  image: string;
  followers: number;
  bio: string;
  headerImage?: string; // NIEUW veld voor headerafbeelding
  stats: CreatorStats;
  achievements: CreatorAchievementBadge[];
  recentPosts?: Array<{
    id: string;
    title: string;
    date: string;
    content: string;
  }>;
  recentWorkouts?: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>;
  gallery?: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  socials?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  isFollowing?: boolean;
  isCurrentUser?: boolean;
}

// Achievement badge definitions
const ACHIEVEMENT_BADGE_LIBRARY: Record<string, CreatorAchievementBadge> = {
  FIRST_POST: {
    id: 'first-post',
    label: 'Eerste Stap',
    icon: 'pencil-box-outline',
    color: '#3B82F6',
    description: 'Je eerste post gepubliceerd',
  },
  FIRST_MEAL: {
    id: 'first-meal',
    label: 'Voedingspionier',
    icon: 'silverware-fork-knife',
    color: '#10B981',
    description: 'Je eerste gerecht gedeeld',
  },
  FIRST_WORKOUT: {
    id: 'first-workout',
    label: 'Trainingsstarter',
    icon: 'dumbbell',
    color: '#EA580C',
    description: 'Je eerste workout gedeeld',
  },
  FOLLOWERS_100: {
    id: '100-followers',
    label: 'Rising Star',
    icon: 'star',
    color: '#F59E0B',
    description: '100 volgers bereikt',
  },
  FOLLOWERS_1000: {
    id: '1000-followers',
    label: 'Community Champion',
    icon: 'star-circle',
    color: '#EC4899',
    description: '1.000 volgers bereikt',
  },
  POSTS_10: {
    id: '10-posts',
    label: 'Consistent Creator',
    icon: 'library',
    color: '#8B5CF6',
    description: '10 posts gepubliceerd',
  },
  POSTS_50: {
    id: '50-posts',
    label: 'Prolific Creator',
    icon: 'library-multiple',
    color: '#06B6D4',
    description: '50 posts gepubliceerd',
  },
  QUALITY_CONTENT: {
    id: 'quality-content',
    label: 'Kwaliteitsmaker',
    icon: 'check-decagram',
    color: '#14B8A6',
    description: '10+ geapproved posts',
  },
  COMMUNITY_HELPER: {
    id: 'community-helper',
    label: 'Hulpzame Hand',
    icon: 'hand-extended',
    color: '#06B6D4',
    description: '50+ meals gedeeld',
  },
  TRAINER_BADGE: {
    id: 'trainer',
    label: 'Trainer',
    icon: 'human-male-board',
    color: '#EA580C',
    description: 'Gecertificeerde trainer',
  },
};

// Tijdelijke in-memory opslag voor headerImages
const headerImageStore: Record<string, string> = {};

export function setCreatorHeaderImage(creatorId: string, url: string) {
  headerImageStore[creatorId] = url;
}

export async function getCreatorProfile(creatorId: string): Promise<CreatorProfile | null> {
  // Find creator in constants
  const creator = COMMUNITY_CREATORS.find((c) => c.id === creatorId);
  if (!creator) return null;

  // Fetch stats
  const [posts, meals, workouts] = await Promise.all([
    getCreatorPosts(),
    getCreatorMealEntries(),
    getCreatorWorkoutEntries(),
  ]);

  // Calculate stats
  const approvedPosts = posts.filter((p) => p.status === 'approved').length;
  const approvedMeals = meals.filter((m) => m.status === 'approved').length;
  const approvedWorkouts = workouts.filter((w) => w.status === 'approved').length;

  const stats: CreatorStats = {
    totalPosts: posts.length,
    approvedPosts,
    totalMeals: meals.length,
    approvedMeals,
    totalWorkouts: workouts.length,
    approvedWorkouts,
    engagement: approvedPosts * 5 + approvedMeals * 3 + approvedWorkouts * 4, // Mock engagement
    joinedDate: '2024-01-15',
  };

  // Determine achievements
  const achievements: CreatorAchievementBadge[] = [];

  if (stats.totalPosts >= 1) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.FIRST_POST);
  if (stats.totalMeals >= 1) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.FIRST_MEAL);
  if (stats.totalWorkouts >= 1) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.FIRST_WORKOUT);
  if (creator.followers >= 100) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.FOLLOWERS_100);
  if (creator.followers >= 1000) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.FOLLOWERS_1000);
  if (stats.totalPosts >= 10) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.POSTS_10);
  if (stats.totalPosts >= 50) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.POSTS_50);
  if (stats.approvedPosts >= 10) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.QUALITY_CONTENT);
  if (stats.approvedMeals >= 50) achievements.push(ACHIEVEMENT_BADGE_LIBRARY.COMMUNITY_HELPER);
  if (creator.badge === 'COACH') achievements.push(ACHIEVEMENT_BADGE_LIBRARY.TRAINER_BADGE);

  return {
    ...creator,
    headerImage: headerImageStore[creatorId],
    stats,
    achievements,
    recentPosts: [
      {
        id: 'p1',
        title: 'Hoe blijf je gemotiveerd?',
        date: '2026-03-20',
        content: 'Tips om je motivatie vast te houden, zelfs als het even tegenzit.'
      },
      {
        id: 'p2',
        title: 'Mijn favoriete ontbijt',
        date: '2026-03-18',
        content: 'Havermout met banaan, noten en een beetje honing.'
      }
    ],
    recentWorkouts: [
      {
        id: 'w1',
        title: 'Full Body HIIT',
        date: '2026-03-19',
        description: 'Intensieve intervaltraining voor het hele lichaam.'
      },
      {
        id: 'w2',
        title: 'Core & Mobility',
        date: '2026-03-16',
        description: 'Focus op buikspieren en flexibiliteit.'
      }
    ],
    gallery: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ],
    socials: {
      instagram: 'https://instagram.com/example',
      youtube: 'https://youtube.com/example',
      tiktok: 'https://tiktok.com/@example',
      website: 'https://example.com'
    }
  };
}

export async function getAllCreatorProfiles(): Promise<CreatorProfile[]> {
  const profiles = await Promise.all(
    COMMUNITY_CREATORS.map(async (c) => {
      const profile = await getCreatorProfile(c.id);
      return profile || null;
    })
  );

  return profiles.filter((p) => p !== null) as CreatorProfile[];
}
