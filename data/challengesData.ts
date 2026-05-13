
import { Challenge, Difficulty } from '../types';

export const challenges: Challenge[] = [
  // 10x 7-DAY CHALLENGES (SPRINTS)
  {
    id: 'ch_s1',
    discipline_id: 'mind',
    name: 'Morning Glory',
    duration_days: 7,
    objective: '7 dagen meditatie voor 08:00 uur.',
    difficulty: 'Beginner',
    reward_ap: 250,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: '5m Meditatie', description: 'Begin je dag met focus voor 08:00.', points: 35 }))
  },
  {
    id: 'ch_s2',
    discipline_id: 'voeding',
    name: 'Sugar-Free Week',
    duration_days: 7,
    objective: 'Log 7 dagen geen toegevoegde suikers.',
    difficulty: 'Intermediate',
    reward_ap: 300,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: 'Suikervrij Loggen', description: 'Eet geen geraffineerde suikers vandaag.', points: 40 }))
  },
  {
    id: 'ch_s3',
    discipline_id: 'hardlopen',
    name: 'The Daily Mile',
    duration_days: 7,
    objective: 'Ren elke dag minimaal 1.6 km (1 mijl).',
    difficulty: 'Beginner',
    reward_ap: 200,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: '1 Mile Run', description: 'Voltooi je dagelijkse mijl.', points: 30 }))
  },
  {
    id: 'ch_s4',
    discipline_id: 'mobiliteit',
    name: 'Mobility Streak',
    duration_days: 7,
    objective: 'Voltooi dagelijks de "DAELY Flow" mobiliteitssessie.',
    difficulty: 'Beginner',
    reward_ap: 150,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: 'DAELY Flow', description: 'Maak je gewrichten los.', points: 20 }))
  },
  {
    id: 'ch_s5',
    discipline_id: 'voeding',
    name: 'Protein Peak',
    duration_days: 7,
    objective: 'Haal 7 dagen op rij je persoonlijke eiwitdoel.',
    difficulty: 'Intermediate',
    reward_ap: 250,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: 'Target Reached', description: 'Eet de juiste hoeveelheid proteïne.', points: 35 }))
  },
  {
    id: 'ch_s6',
    discipline_id: 'fitness',
    name: 'Plank Master',
    duration_days: 7,
    objective: 'Verhoog je plank-tijd elke dag met 10 seconden.',
    difficulty: 'Beginner',
    reward_ap: 200,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: `Plank: ${60 + (i * 10)}s`, description: 'Houd je core stabiel.', points: 30 }))
  },
  {
    id: 'ch_s7',
    discipline_id: 'mind',
    name: 'Cold Start',
    duration_days: 7,
    objective: 'Neem elke dag een koude douche van minimaal 2 minuten.',
    difficulty: 'Advanced',
    reward_ap: 400,
    image: 'https://images.unsplash.com/photo-1541781719179-45f04b162084?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: 'Koude Douche', description: 'Reset je zenuwstelsel.', points: 60 }))
  },
  {
    id: 'ch_s8',
    discipline_id: 'voeding',
    name: 'Hydration Hero',
    duration_days: 7,
    objective: 'Drink 7 dagen lang minimaal 3 liter water per dag.',
    difficulty: 'Beginner',
    reward_ap: 150,
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: '3L Water', description: 'Vochtbalans op peil houden.', points: 20 }))
  },
  {
    id: 'ch_s9',
    discipline_id: 'fitness',
    name: 'Burpee Blast',
    duration_days: 7,
    objective: 'Doe elke dag 50 burpees voor tijd.',
    difficulty: 'Advanced',
    reward_ap: 350,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: '50 Burpees', description: 'Ga voor je snelste tijd.', points: 50 }))
  },
  {
    id: 'ch_s10',
    discipline_id: 'mind',
    name: 'Zen Zone',
    duration_days: 7,
    objective: 'Gebruik de Mind-tab elke dag voor het slapengaan.',
    difficulty: 'Beginner',
    reward_ap: 200,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400',
    days: Array.from({ length: 7 }).map((_, i) => ({ day: i + 1, task: 'Nachtelijke Meditatie', description: 'Verbeter je slaapkwaliteit.', points: 30 }))
  },

  // 10x 30-DAY CHALLENGES (MARATHONS)
  {
    id: 'ch_m1',
    discipline_id: 'voeding',
    name: 'DAELY Lean',
    duration_days: 30,
    objective: 'Verlies vetpercentage door 30 dagen het "The Shred" menu te volgen.',
    difficulty: 'Advanced',
    reward_ap: 1500,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Shred Menu', description: 'Strikte voeding voor vetverlies.', points: 50 }))
  },
  {
    id: 'ch_m2',
    discipline_id: 'hyrox',
    name: 'Hyrox Ready',
    duration_days: 30,
    objective: 'Voltooi 20 Hyrox-specifieke workouts in één maand.',
    difficulty: 'Advanced',
    reward_ap: 2000,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Race Drill', description: 'Bouw je race-motor.', points: 65 }))
  },
  {
    id: 'ch_m3',
    discipline_id: 'calisthenics',
    name: 'Handstand Hero',
    duration_days: 30,
    objective: 'Volg het progressieve handstand-pad van de Calisthenics discipline.',
    difficulty: 'Intermediate',
    reward_ap: 1200,
    image: 'https://images.unsplash.com/photo-1599058917233-3583348123fc?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Handstand Practice', description: 'Beheers de vrije balans.', points: 40 }))
  },
  {
    id: 'ch_m4',
    discipline_id: 'hardlopen',
    name: '100km Month',
    duration_days: 30,
    objective: 'Ren in totaal 100 kilometer in 30 dagen.',
    difficulty: 'Intermediate',
    reward_ap: 1800,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Mileage Build', description: 'Zet die kilometers neer.', points: 60 }))
  },
  {
    id: 'ch_m5',
    discipline_id: 'heavyweight',
    name: 'Strength Cycle',
    duration_days: 30,
    objective: 'Voer 12 "Heavyweight" sessies uit en verhoog je 1RM.',
    difficulty: 'Advanced',
    reward_ap: 2000,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Heavy Lifting', description: 'Push je grenzen.', points: 70 }))
  },
  {
    id: 'ch_m6',
    discipline_id: 'voeding',
    name: 'Vegetarian Transition',
    duration_days: 30,
    objective: '30 dagen volledig plantaardig eten met DAELY recepten.',
    difficulty: 'Intermediate',
    reward_ap: 1400,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Plant Based Log', description: 'Ontdek de kracht van planten.', points: 45 }))
  },
  {
    id: 'ch_m7',
    discipline_id: 'mind',
    name: 'Mindfulness Mastery',
    duration_days: 30,
    objective: 'Voltooi een volledig 3-weeks Mind-programma.',
    difficulty: 'Beginner',
    reward_ap: 1000,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Mind Program', description: 'Verdiep je bewustzijn.', points: 30 }))
  },
  {
    id: 'ch_m8',
    discipline_id: 'calisthenics',
    name: 'Bodyweight Beast',
    duration_days: 30,
    objective: '30 dagen geen gewichten, alleen Calisthenics workouts.',
    difficulty: 'Intermediate',
    reward_ap: 1500,
    image: 'https://images.unsplash.com/photo-1599058917233-3583348123fc?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Body Control', description: 'Gebruik alleen je eigen massa.', points: 50 }))
  },
  {
    id: 'ch_m9',
    discipline_id: 'fitness',
    name: 'Consistentie Koning',
    duration_days: 30,
    objective: 'Log 30 dagen lang elke maaltijd en elke workout.',
    difficulty: 'Beginner',
    reward_ap: 2500,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Full Logging', description: 'Discipline in data.', points: 80 }))
  },
  {
    id: 'ch_m10',
    discipline_id: 'hyrox',
    name: 'The DAELY Hybrid',
    duration_days: 30,
    objective: 'Combineer 2 krachtsessies en 2 hardloopsessies per week voor 4 weken.',
    difficulty: 'Advanced',
    reward_ap: 2200,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400',
    days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, task: 'Hybrid Session', description: 'De ultieme all-round atleet.', points: 75 }))
  },
  {
    id: 'ch_75hard',
    discipline_id: 'mind',
    name: '75 Hard',
    duration_days: 75,
    objective: 'Voltooi de 75 Hard challenge: 2 workouts (1 buiten), strikt dieet, 4L water, 10 pagina\'s lezen, dagelijkse foto.',
    difficulty: 'Advanced',
    reward_ap: 5000,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
    days: Array.from({ length: 75 }).map((_, i) => ({ day: i + 1, task: '75 Hard Daily Tasks', description: '2 workouts, dieet, 4L water, 10 pag. lezen, foto.', points: 100 }))
  },
  {
    id: 'ch_75soft',
    discipline_id: 'mind',
    name: '75 Soft',
    duration_days: 75,
    objective: 'Voltooi de 75 Soft challenge: 1 workout (45 min), gezond eten, 3L water, 10 pagina\'s lezen.',
    difficulty: 'Intermediate',
    reward_ap: 3000,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
    days: Array.from({ length: 75 }).map((_, i) => ({ day: i + 1, task: '75 Soft Daily Tasks', description: '1 workout, gezond eten, 3L water, 10 pag. lezen.', points: 60 }))
  },
];
