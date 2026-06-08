// Central discipline content structure
// Each discipline has: workouts, exercises, programs

export interface Workout {
  id: string;
  name: string;
  muscle: string;
  duration: string;
  level: string;
  icon: string;
  color: string;
  exercises: number;
}

export interface Exercise {
  id: string;
  name: string;
  spiergroep: string;
  categorie: string;
  moeilijkheid: 'Beginner' | 'Gemiddeld' | 'Gevorderd';
}

export interface Program {
  id: string;
  name: string;
  duration: string;
  level: string;
  weeks: number;
}

export interface DisciplineContent {
  workouts: Workout[];
  exercises: Exercise[];
  programs: Program[];
}

export const DISCIPLINE_CONTENT: Record<string, DisciplineContent> = {
  // Fitness - from app/discipline/fitness.tsx
  fitness: {
    workouts: [
      {
        id: '1',
        name: 'Push Day',
        muscle: 'Borst · Schouders · Triceps',
        duration: '60 min',
        level: 'Gemiddeld',
        icon: 'arm-flex',
        color: '#2563EB',
        exercises: 8,
      },
      {
        id: '2',
        name: 'Pull Day',
        muscle: 'Rug · Biceps · Rear Delt',
        duration: '55 min',
        level: 'Gemiddeld',
        icon: 'human-handsup',
        color: '#7C3AED',
        exercises: 7,
      },
      {
        id: '3',
        name: 'Leg Day',
        muscle: 'Quads · Hamstrings · Billen',
        duration: '65 min',
        level: 'Zwaar',
        icon: 'human-male',
        color: '#DC2626',
        exercises: 9,
      },
      {
        id: '4',
        name: 'Full Body',
        muscle: 'Alle spiergroepen',
        duration: '75 min',
        level: 'Gemiddeld',
        icon: 'dumbbell',
        color: '#059669',
        exercises: 10,
      },
      {
        id: '5',
        name: 'Upper Body Power',
        muscle: 'Borst · Rug · Schouders',
        duration: '50 min',
        level: 'Zwaar',
        icon: 'weight-lifter',
        color: '#D97706',
        exercises: 6,
      },
      {
        id: '6',
        name: 'Core & Stabiliteit',
        muscle: 'Buik · Lage rug · Heupen',
        duration: '35 min',
        level: 'Licht',
        icon: 'human-female-dance',
        color: '#0891B2',
        exercises: 8,
      },
    ],
    exercises: [], // Will be populated from fitness.tsx MUSCLE_EXERCISES if needed
    programs: [],
  },

  // All other disciplines with empty content for now
  crossfit: { workouts: [], exercises: [], programs: [] },
  'zwaargewicht': { workouts: [], exercises: [], programs: [] },
  hyrox: { workouts: [], exercises: [], programs: [] },
  yoga: { workouts: [], exercises: [], programs: [] },
  pilates: { workouts: [], exercises: [], programs: [] },
  calisthenics: { workouts: [], exercises: [], programs: [] },
  mobiliteit: { workouts: [], exercises: [], programs: [] },
  vechttraining: { workouts: [], exercises: [], programs: [] },
  zwangerschap: { workouts: [], exercises: [], programs: [] },
  'kegel-oefeningen': { workouts: [], exercises: [], programs: [] },
  'wielrennen-mountainbiken': { workouts: [], exercises: [], programs: [] },
  zwemmen: { workouts: [], exercises: [], programs: [] },
  roeien: { workouts: [], exercises: [], programs: [] },
  schaatsen: { workouts: [], exercises: [], programs: [] },
  voetbal: { workouts: [], exercises: [], programs: [] },
  basketbal: { workouts: [], exercises: [], programs: [] },
  volleybal: { workouts: [], exercises: [], programs: [] },
  handbal: { workouts: [], exercises: [], programs: [] },
  hockey: { workouts: [], exercises: [], programs: [] },
  'rugby-american-football': { workouts: [], exercises: [], programs: [] },
  racketsporten: { workouts: [], exercises: [], programs: [] },
  'judo-worstelen-bjj-karate-taekwondo': { workouts: [], exercises: [], programs: [] },
  turnen: { workouts: [], exercises: [], programs: [] },
  'parkour-freerunning': { workouts: [], exercises: [], programs: [] },
  'klimmen-boulderen': { workouts: [], exercises: [], programs: [] },
  'skien-snowboarden': { workouts: [], exercises: [], programs: [] },
  'surfen-kitesurfen-windsurfen': { workouts: [], exercises: [], programs: [] },
  golf: { workouts: [], exercises: [], programs: [] },
  paardensport: { workouts: [], exercises: [], programs: [] },

  // Additional slugs from DISCIPLINE_DATA (for reference, not in main discipline list)
  hardlopen: { workouts: [], exercises: [], programs: [] },
  'hardlopen-agility': { workouts: [], exercises: [], programs: [] },
  triatlon: { workouts: [], exercises: [], programs: [] },
};