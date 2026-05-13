export type UserRole = "user" | "influencer" | "partner" | "event_manager" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  // Voeg hier extra velden toe indien nodig
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type CreatorLevel = 'Open' | 'Pro' | 'Verified';
export type SubscriptionTier = 'Elite' | 'Coach';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'Milestone' | 'Streak' | 'Discipline' | 'Special';
}

export interface SubscriptionTierDetails {
  id: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
}

export interface Recipe {
  id: string;
  name: string;
  category: 'Ontbijt' | 'Lunch' | 'Diner' | 'Snack' | 'Smoothies';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
  prep_time: number;
  ingredients: string[];
  instructions: string[];
  url?: string;
}

export interface WeeklyMenu {
  id: string;
  name: string;
  focus: string;
  days: {
    day: number;
    meals: { breakfast: string; lunch: string; dinner: string; snack: string; };
  }[];
}

export interface NutritionProgram {
  id: string;
  name: string;
  objective: string;
  duration_weeks: number;
  description: string;
  macro_split: { p: number; c: number; f: number; };
}

export interface EducationTopic {
  id: string;
  discipline_id: string;
  title: string;
  content: string;
  image?: string;
}

export interface Discipline { id: string; name: string; image: string; subtitle?: string; }
export interface Exercise { 
  id: string; 
  name: string; 
  category: string;
  primary_discipline: string;
  exercise_type: string;
  difficulty: Difficulty | string; 
  muscle_groups: {
    primary: string[];
    secondary: string[];
    stabilizers: string[];
  };
  equipment: {
    items: string[];
    type: string;
  };
  instruction_steps: { step: number; title: string; instruction: string; }[];
  coaching_cues: string[];
  common_mistakes: string[];
  safety_tips: string[];
  breathing: {
    inhale: string;
    exhale: string;
  };
  recommended_sets_reps: { level: string; recommendation: string; }[];
  variations?: string[]; 
  alternatives?: string[];
  progressions?: string[];
  regressions?: string[];
  tags?: string[];
  media: {
    images: string[];
    video: string;
    thumbnail: string;
  };
}
export interface Workout { id: string; discipline_id: string; name: string; duration_min: number; difficulty: Difficulty; goal: string; exercises: { exercise_id: string; sets: number; reps: string; rest_sec: number; }[]; rest_between_sets_sec: number; }
export interface Program { id: string; discipline_id: string; creator_id: string; name: string; duration_weeks: number; objective: string; difficulty: Difficulty; rating: number; image?: string; structure: { week_number: number; focus: string; workouts: string[]; is_deload?: boolean; }[]; }

export interface Creator { 
  id: string; 
  name: string; 
  specialty: string; 
  bio: string; 
  philosophy: string; 
  image: string; 
  followers: string; 
  verified: boolean; 
  level: CreatorLevel; 
  rating: number; 
  consistency_score: number;
  subscription_price?: number;
  commission_rate?: number;
  earnings?: number;
  active_subscribers?: number;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface UserGoal { id: string; type: 'Weight' | 'Muscle' | 'Consistency' | 'KM'; label: string; target: number; current: number; unit: string; }

export interface Meditation {
  id: string;
  title: string;
  category: 'Focus' | 'Stress' | 'Slaap' | 'Ademhaling' | 'Performance' | 'Herstel' | 'Rust & Stress' | 'Focus & Productivity' | 'Sleep' | 'Recovery' | 'Mental Strength' | 'Energy & Motivation' | 'Mindfulness';
  duration_min: number;
  goal: string;
  image: string;
}

export interface MentalProgram { id: string; name: string; duration_weeks: number; objective: string; description: string; topics: string[]; }

export interface ChallengeDay {
  day: number;
  task: string;
  description: string;
  points: number;
}

export interface Challenge {
  id: string;
  discipline_id: string;
  name: string;
  duration_days: 7 | 30 | 75;
  objective: string;
  difficulty: Difficulty;
  reward_ap: number;
  days: ChallengeDay[];
  image: string;
}
