
import { Discipline, Creator, Program, Recipe, Meditation, UserGoal, Exercise, Workout, EducationTopic, MentalProgram, Challenge, Badge, SubscriptionTierDetails } from '../types';
import { fitnessExercises, fitnessWorkouts, fitnessPrograms, fitnessEducation } from './fitnessData';
import { runningExercises, runningWorkouts, runningPrograms, runningEducation } from './runningData';
import { mobilityExercises, mobilityWorkouts, mobilityPrograms, mobilityEducation } from './mobilityData';
import { hyroxExercises, hyroxWorkouts, hyroxPrograms, hyroxEducation } from './hyroxData';
import { yogaExercises, pilatesExercises, yogaPilatesWorkouts, yogaPilatesPrograms, yogaPilatesEducation } from './yogaPilatesData';
import { combatExercises, combatWorkouts, combatPrograms, combatEducation } from './combatData';
import { heavyweightExercises, heavyweightWorkouts, heavyweightPrograms, heavyweightEducation } from './heavyweightData';
import { calisthenicsExercises, calisthenicsWorkouts, calisthenicsPrograms, calisthenicsEducation } from './calisthenicsData';
import { recipes as nutritionRecipes, weeklyMenus, nutritionPrograms, nutritionEducation } from './nutritionData';
import { meditations as mindMeditations, mentalPrograms, mindEducation } from './mindData';
import { challenges as challengeData } from './challengesData';

export const subscriptionTiers: SubscriptionTierDetails[] = [
  {
    id: 'Elite',
    name: 'DAELY Elite',
    price: 8.99,
    features: [
      'Toegang tot alle functies',
      'Alle programma\'s en workouts',
      'Volledige Voeding-sectie',
      'Alle Mentale programma\'s',
      'Advanced Performance Analytics'
    ]
  },
  {
    id: 'Coach',
    name: 'DAELY Coach',
    price: 14.99,
    features: [
      'Alles in Elite',
      'Extra interactie met de DAELY COACH app',
      'Coach kan dingen aanpassen in jouw account',
      'Gepersonaliseerde begeleiding'
    ]
  }
];

export const badges: Badge[] = [
  { id: 'b1', name: 'Early Bird', description: '10 workouts voltooid voor 07:00.', icon: '🌅', unlocked: true, category: 'Special' },
  { id: 'b2', name: 'Iron Lungs', description: '50km hardlopen binnen één maand.', icon: '🫁', unlocked: false, category: 'Discipline' },
  { id: 'b3', name: 'Zen Master', description: '30 dagen achtereen gemediteerd.', icon: '🧘', unlocked: true, category: 'Streak' },
  { id: 'b4', name: 'DAELY Hybrid', description: 'Kracht- en hardloopprogramma gelijktijdig voltooid.', icon: '🧬', unlocked: false, category: 'Special' },
  { id: 'b5', name: 'First Blood', description: 'Voltooi je eerste workout.', icon: '⚡', unlocked: true, category: 'Milestone' },
  { id: 'b6', name: 'Gauntlet Finisher', description: 'Voltooi je eerste 30-daagse challenge.', icon: '🛡️', unlocked: true, category: 'Milestone' },
  { id: 'b7', name: 'Centurion', description: '100 workouts voltooid.', icon: '💯', unlocked: false, category: 'Milestone' },
  { id: 'b8', name: 'Master of AP', description: 'Behaal 5000 Daely Points.', icon: '💎', unlocked: false, category: 'Milestone' },
  { id: 'b9', name: 'Triple Threat', description: '3 dagen achter elkaar getraind.', icon: '🔥', unlocked: true, category: 'Streak' },
  { id: 'b10', name: 'Week Warrior', description: '7-daagse streak behaald.', icon: '⚔️', unlocked: true, category: 'Streak' },
  { id: 'b11', name: 'Iron Disciple', description: 'Level 10 in Fitness.', icon: '🏋️', unlocked: true, category: 'Discipline' },
  { id: 'b12', name: 'Flow State', description: '20 Yoga sessies voltooid.', icon: '🌊', unlocked: false, category: 'Discipline' },
  { id: 'b13', name: 'Mind Monk', description: '10 uur gemediteerd.', icon: '🧠', unlocked: true, category: 'Discipline' },
  { id: 'b14', name: 'Combat Ready', description: '50 Combat drills voltooid.', icon: '🥊', unlocked: false, category: 'Discipline' },
  { id: 'b15', name: 'Explorer', description: 'Workout in 5 disciplines.', icon: '🗺️', unlocked: true, category: 'Special' },
  { id: 'b16', name: 'Elite Member', description: 'Geabonneerd op Daely Elite.', icon: '⭐', unlocked: true, category: 'Special' },
  { id: 'b17', name: 'Consistency King', description: 'Consistency Score van 100% voor 30 dagen.', icon: '👑', unlocked: false, category: 'Streak' },
  { id: 'b18', name: 'Nutritionist', description: '100 maaltijden gelogd.', icon: '🍎', unlocked: false, category: 'Special' },
  { id: 'b19', name: 'Follower', description: 'Volg 5 Verified Creators.', icon: '🤝', unlocked: true, category: 'Special' },
  { id: 'b20', name: 'Performance Alpha', description: 'Nieuw PR gevestigd.', icon: '📈', unlocked: true, category: 'Milestone' },
];

export const disciplines: Discipline[] = [
  { id: 'fitness', name: 'Fitness', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', subtitle: 'Kracht & Hypertrofie' },
  { id: 'heavyweight', name: 'Heavyweight', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800', subtitle: 'Powerlifting Focus' },
  { id: 'hardlopen', name: 'Hardlopen', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800', subtitle: 'Endurance & Speed' },
  { id: 'calisthenics', name: 'Calisthenics', image: 'https://d9hhrg4mnvzow.cloudfront.net/www.fitapp.app/project-calisthenics/e98a6f28-simon-hero-img-desktop-3x_100000000000000000001o.jpg', subtitle: 'Bodyweight Mastery' },
  { id: 'mobiliteit', name: 'Mobiliteit', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800', subtitle: 'Range of Motion' },
  { id: 'hyrox', name: 'Hyrox', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800', subtitle: 'Race Preparation' },
  { id: 'yoga', name: 'Yoga', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800', subtitle: 'Balance & Flow' },
  { id: 'pilates', name: 'Pilates', image: 'https://images.squarespace-cdn.com/content/v1/61b145b04b4aaf6e35670707/0f19ba6e-ac19-4af9-bd33-4cb6ac38b532/reformerpilatesstudioadelaide.jpg', subtitle: 'Core Stability' },
  { id: 'combat', name: 'Combat Training', image: 'https://martial-art-concepts.com/wp-content/uploads/2019/11/Kickboxing-bag.jpg', subtitle: 'Techniek & Conditie' },
];

export const creators: Creator[] = [
  {
    id: 'c4',
    name: 'Danique Hosmar',
    specialty: 'Fitness & Lifestyle',
    bio: 'Inspirerende fitness en lifestyle content creator gericht op balans en gezondheid.',
    philosophy: 'Balans is de sleutel tot een gezonde levensstijl.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
    followers: '1.2M',
    verified: true,
    level: 'Verified',
    rating: 4.8,
    consistency_score: 96,
    subscription_price: 10.99,
    commission_rate: 70,
    earnings: 11500,
    active_subscribers: 1050,
    instagram: '@danique.hosmar'
  },
  {
    id: 'c5',
    name: 'Tesspiratie',
    specialty: 'Fitness & Lifestyle',
    bio: 'Inspirerende content over fitness, mindset en een gezonde levensstijl.',
    philosophy: 'Consistentie is belangrijker dan perfectie.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400',
    followers: '150k',
    verified: true,
    level: 'Pro',
    rating: 4.9,
    consistency_score: 95,
    subscription_price: 9.99,
    commission_rate: 70,
    earnings: 8500,
    active_subscribers: 850,
    instagram: '@tesspiratie'
  },
  {
    id: 'c6',
    name: 'Kevin_hazeleger94',
    specialty: 'Fitness & Strength',
    bio: 'Gepassioneerde atleet die zijn fitnessreis en krachttraining deelt om anderen te motiveren.',
    philosophy: 'Hard werken loont altijd.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400',
    followers: '12k',
    verified: false,
    level: 'Pro',
    rating: 4.8,
    consistency_score: 90,
    subscription_price: 5.99,
    commission_rate: 70,
    earnings: 2500,
    active_subscribers: 250,
    instagram: '@kevin_hazeleger94'
  }
];

import { chest100Exercises } from './chest100Data';
import { upperBackExercises } from './upperBackData';
import { lowerBackExercises } from './lowerBackData';
import { shouldersExercises } from './shouldersData';
import { tricepsExercises } from './tricepsData';
import { bicepsExercises } from './bicepsData';
import { legsExercises } from './legsData';
import { absExercises } from './absData';

export const allExercises = [
  ...fitnessExercises, ...runningExercises, ...mobilityExercises, ...hyroxExercises, ...yogaExercises, ...pilatesExercises, ...combatExercises, ...heavyweightExercises, ...calisthenicsExercises, ...chest100Exercises, ...upperBackExercises, ...lowerBackExercises, ...shouldersExercises, ...tricepsExercises, ...bicepsExercises, ...legsExercises, ...absExercises
];

export const allWorkouts = [...fitnessWorkouts, ...runningWorkouts, ...mobilityWorkouts, ...hyroxWorkouts, ...yogaPilatesWorkouts, ...combatWorkouts, ...heavyweightWorkouts, ...calisthenicsWorkouts];
export const allPrograms = [...fitnessPrograms, ...runningPrograms, ...mobilityPrograms, ...hyroxPrograms, ...yogaPilatesPrograms, ...combatPrograms, ...heavyweightPrograms, ...calisthenicsPrograms];
export const allEducation = [...fitnessEducation, ...runningEducation, ...mobilityEducation, ...hyroxEducation, ...yogaPilatesEducation, ...combatEducation, ...nutritionEducation, ...mindEducation, ...heavyweightEducation, ...calisthenicsEducation];

export const recipes: Recipe[] = nutritionRecipes;
export const meditations: Meditation[] = mindMeditations;
export const challenges: Challenge[] = challengeData;
export { weeklyMenus, nutritionPrograms, mentalPrograms };

export const userGoals: UserGoal[] = [
  { id: 'g1', type: 'Weight', label: 'Streefgewicht', target: 82, current: 85, unit: 'kg' },
  { id: 'g2', type: 'Consistency', label: 'Trainingen p/w', target: 5, current: 3, unit: 'sessies' },
];
