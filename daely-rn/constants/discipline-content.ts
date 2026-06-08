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

// Helper functions for Fitness exercises (from app/discipline/fitness.tsx)
type Difficulty = 'Beginner' | 'Gemiddeld' | 'Gevorderd';

function inferCategory(name: string, spiergroep: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('barbell') || lower.includes('ez bar') || lower.includes('jm press') || lower.includes('skull crusher')) {
    return 'Barbell';
  }
  if (lower.includes('dumbbell') || lower.includes('arnold') || lower.includes('tate press') || lower.includes('zottman')) {
    return 'Dumbbell';
  }
  if (lower.includes('machine') || lower.includes('pec deck') || lower.includes('leg press') || lower.includes('hack squat') || lower.includes('captain chair')) {
    return 'Machine';
  }
  if (lower.includes('cable') || lower.includes('rope') || lower.includes('woodchopper') || lower.includes('pallof')) {
    return 'Cable';
  }
  if (lower.includes('ring') || lower.includes('handstand') || lower.includes('pistol squat') || lower.includes('dragon flag')) {
    return 'Calisthenics';
  }
  if (lower.includes('band') || lower.includes('kettlebell') || lower.includes('landmine') || lower.includes('trap bar') || lower.includes('smith')) {
    return 'Hybrid';
  }
  if (lower.includes('isometric') || lower.includes('hold') || lower.includes('tempo') || lower.includes('paused') || lower.includes('extension') || lower.includes('kickback') || lower.includes('raise')) {
    return 'Isolatie';
  }
  if (
    lower.includes('one arm') ||
    lower.includes('single leg') ||
    lower.includes('weighted') ||
    lower.includes('plyometric') ||
    lower.includes('explosive') ||
    lower.includes('snatch') ||
    lower.includes('deficit') ||
    lower.includes('jefferson')
  ) {
    return 'Gevorderd';
  }
  if (
    lower.includes('press') ||
    lower.includes('curl') ||
    lower.includes('row') ||
    lower.includes('deadlift') ||
    lower.includes('squat') ||
    lower.includes('fly') ||
    lower.includes('crossover')
  ) {
    return 'Specialist';
  }
  if (lower.includes('push-up') || lower.includes('dip') || lower.includes('plank') || lower.includes('crunch') || lower.includes('sit-up')) {
    return 'Bodyweight';
  }

  if (spiergroep === 'Buik') {
    return 'Bodyweight';
  }
  if (spiergroep === 'Benen') {
    if (lower.includes('squat') || lower.includes('deadlift') || lower.includes('lunge')) {
      return 'Barbell';
    }
    if (lower.includes('calf') || lower.includes('leg extension') || lower.includes('leg curl')) {
      return 'Machine';
    }
    if (lower.includes('jump') || lower.includes('wall sit') || lower.includes('cossack')) {
      return 'Bodyweight';
    }
  }
  if (spiergroep === 'Billen') {
    if (lower.includes('hip thrust') || lower.includes('deadlift') || lower.includes('squat') || lower.includes('lunge')) {
      return 'Barbell';
    }
    if (lower.includes('bridge') || lower.includes('clamshell') || lower.includes('fire hydrant')) {
      return 'Bodyweight';
    }
  }

  return 'Specialist';
}

function inferDifficulty(name: string, spiergroep: string): Difficulty {
  const lower = name.toLowerCase();

  const advancedSignals = [
    'one arm',
    'single leg',
    'weighted',
    'pistol',
    'dragon flag',
    'explosive',
    'plyometric',
    'deficit',
    'snatch',
    'handstand',
    'jefferson',
  ];
  if (advancedSignals.some((signal) => lower.includes(signal))) {
    return 'Gevorderd';
  }

  const beginnerSignals = [
    'machine',
    'seated',
    'incline push-up',
    'wall sit',
    'bird dog',
    'dead bug',
    'clamshell',
    'glute bridge',
    'crunch',
    'plank',
  ];
  if (beginnerSignals.some((signal) => lower.includes(signal))) {
    return 'Beginner';
  }

  if (spiergroep === 'Buik') {
    if (lower.includes('dragon flag') || lower.includes('ab wheel') || lower.includes('hanging leg raise')) {
      return 'Gevorderd';
    }
    if (
      lower.includes('crunch') ||
      lower.includes('plank') ||
      lower.includes('dead bug') ||
      lower.includes('toe taps') ||
      lower.includes('flutter kicks') ||
      lower.includes('scissor kicks')
    ) {
      return 'Beginner';
    }
    return 'Gemiddeld';
  }

  if (spiergroep === 'Benen') {
    if (lower.includes('pistol') || lower.includes('box jump') || lower.includes('jump squat') || lower.includes('nordic')) {
      return 'Gevorderd';
    }
    if (lower.includes('leg extension') || lower.includes('leg curl') || lower.includes('wall sit') || lower.includes('calf raise')) {
      return 'Beginner';
    }
    return 'Gemiddeld';
  }

  if (spiergroep === 'Onderrug') {
    if (lower.includes('snatch') || lower.includes('deficit') || lower.includes('jefferson')) {
      return 'Gevorderd';
    }
    if (lower.includes('bird dog') || lower.includes('hip hinge drill') || lower.includes('quadruped') || lower.includes('superman hold')) {
      return 'Beginner';
    }
    return 'Gemiddeld';
  }

  if (spiergroep === 'Billen') {
    if (lower.includes('single leg') || lower.includes('trap bar') || lower.includes('frog stance deadlift')) {
      return 'Gevorderd';
    }
    if (lower.includes('clamshell') || lower.includes('fire hydrant') || lower.includes('bridge')) {
      return 'Beginner';
    }
    return 'Gemiddeld';
  }

  return 'Gemiddeld';
}

// Fitness muscle exercises (from app/discipline/fitness.tsx)
const FITNESS_MUSCLE_EXERCISES: Record<string, string[]> = {
  Borst: [
    'Barbell Bench Press', 'Incline Barbell Bench Press', 'Decline Barbell Bench Press', 'Close Grip Bench Press',
    'Wide Grip Bench Press', 'Reverse Grip Bench Press', 'Paused Bench Press', 'Tempo Bench Press', 'Spoto Press',
    'Dumbbell Bench Press', 'Incline Dumbbell Press', 'Decline Dumbbell Press', 'Neutral Grip Dumbbell Press',
    'Single Arm Dumbbell Press', 'Dumbbell Fly', 'Incline Dumbbell Fly', 'Machine Chest Press', 'Incline Machine Press',
    'Hammer Strength Chest Press', 'Machine Pec Fly', 'Cable Chest Fly', 'Cable Crossover', 'Low to High Cable Fly',
    'High to Low Cable Fly', 'Push-Up', 'Wide Push-Up', 'Decline Push-Up', 'Ring Push-Up', 'Chest Dips', 'Svend Press',
  ],
  Biceps: [
    'Barbell Curl', 'EZ Bar Curl', 'Wide Grip EZ Curl', 'Close Grip EZ Curl', 'Spider Curl', 'Preacher Curl',
    'Reverse Curl', 'Drag Curl', 'Behind The Back Barbell Curl', 'Incline Dumbbell Curl', 'Alternating Dumbbell Curl',
    'Hammer Curl', 'Cross Body Hammer Curl', 'Concentration Curl', 'Seated Dumbbell Curl', 'Zottman Curl',
    'Machine Biceps Curl', 'Cable Curl', 'Rope Hammer Curl', 'Single Arm Cable Curl', 'High Cable Curl',
    'Bayesian Cable Curl', 'Chin-Up Supinated Grip', 'Ring Chin-Up', 'Towel Chin-Up', 'Band Biceps Curl',
    'Isometric Curl Hold', 'Tempo Curl', '21s Biceps Curl', 'Preacher Machine Curl',
  ],
  Triceps: [
    'Close Grip Bench Press', 'Skull Crusher', 'EZ Bar Skull Crusher', 'JM Press', 'Dumbbell Overhead Triceps Extension',
    'Single Arm Overhead Dumbbell Extension', 'Dumbbell Kickback', 'Rolling Dumbbell Extension', 'Cable Rope Pushdown',
    'Straight Bar Pushdown', 'Reverse Grip Pushdown', 'Single Arm Cable Pushdown', 'Overhead Rope Extension',
    'Overhead Cable Extension', 'Cross Body Cable Extension', 'Machine Triceps Extension', 'Bench Dips',
    'Parallel Bar Dips', 'Ring Dips', 'Diamond Push-Up', 'Close Push-Up', 'Bodyweight Triceps Extension',
    'Band Pushdown', 'Band Overhead Extension', 'Tate Press', 'Floor Skull Crusher', 'Paused Pushdown',
    'Tempo Pushdown', 'Weighted Dips', 'PJR Pullover',
  ],
  Schouders: [
    'Barbell Overhead Press', 'Push Press', 'Seated Barbell Press', 'Behind The Neck Press', 'Dumbbell Shoulder Press',
    'Arnold Press', 'Seated Dumbbell Press', 'Single Arm Dumbbell Press', 'Dumbbell Lateral Raise', 'Cable Lateral Raise',
    'Leaning Cable Lateral Raise', 'Machine Lateral Raise', 'Front Raise', 'Plate Front Raise', 'Rear Delt Fly',
    'Reverse Pec Deck', 'Face Pull', 'Upright Row', 'Cable Upright Row', 'Landmine Press', 'Single Arm Landmine Press',
    'Handstand Push-Up', 'Pike Push-Up', 'Band Lateral Raise', 'Band Pull Apart', 'Y Raise', 'Prone Rear Delt Raise',
    'Cuban Press', 'Bradford Press', 'Overhead Carry',
  ],
  Bovenrug: [
    'Pull-Up', 'Chin-Up', 'Neutral Grip Pull-Up', 'Wide Grip Pull-Up', 'Lat Pulldown Wide Grip', 'Lat Pulldown Neutral Grip',
    'Single Arm Lat Pulldown', 'Chest Supported Row', 'Barbell Row', 'Pendlay Row', 'T-Bar Row', 'Seated Cable Row',
    'Single Arm Cable Row', 'Dumbbell Row', 'Meadows Row', 'Machine High Row', 'Machine Row', 'Straight Arm Pulldown',
    'Face Pull', 'Rear Delt Row', 'Inverted Row', 'Ring Row', 'Scap Pull-Up', 'Band Row', 'Band Pulldown',
    'Snatch Grip Row', 'Seal Row', 'Cable Pullover', 'Kroc Row', 'Trap 3 Raise',
  ],
  Onderrug: [
    'Romanian Deadlift', 'Stiff Leg Deadlift', 'Conventional Deadlift', 'Sumo Deadlift', 'Deficit Deadlift',
    'Rack Pull', 'Good Morning', 'Back Extension', 'Hyperextension Hold', 'Reverse Hyper', 'Bird Dog', 'Superman Hold',
    'Superman Raise', 'Cable Pull Through', 'Kettlebell Swing', 'Single Leg Romanian Deadlift', 'Jefferson Curl',
    'Hip Hinge Drill', 'Prone Back Extension', 'Seated Good Morning', 'Band Good Morning', 'Banded Back Extension',
    'Deadlift Isometric Hold', 'Paused Romanian Deadlift', 'Tempo Romanian Deadlift', 'Snatch Grip Deadlift',
    'GHD Back Extension', 'Reverse Plank', 'Quadruped Rock Back', '45 Degree Back Extension',
  ],
  Buik: [
    'Crunch', 'Reverse Crunch', 'Bicycle Crunch', 'Toe Touch Crunch', 'V-Up', 'Hollow Hold', 'Dead Bug',
    'Plank', 'Side Plank', 'RKC Plank', 'Mountain Climber', 'Hanging Knee Raise', 'Hanging Leg Raise',
    'Captain Chair Leg Raise', 'Ab Wheel Rollout', 'Swiss Ball Rollout', 'Cable Crunch', 'Kneeling Cable Crunch',
    'Woodchopper', 'Russian Twist', 'Pallof Press', 'Decline Sit-Up', 'Sit-Up', 'Dragon Flag', 'Flutter Kicks',
    'Scissor Kicks', 'Toe Taps', 'Jackknife Sit-Up', 'Plank Shoulder Tap', 'Hollow Rock',
  ],
  Billen: [
    'Barbell Hip Thrust', 'Dumbbell Hip Thrust', 'Single Leg Hip Thrust', 'Glute Bridge', 'Single Leg Glute Bridge',
    'Frog Pump', 'Cable Kickback', 'Machine Glute Kickback', 'Banded Kickback', 'Romanian Deadlift',
    'Single Leg Romanian Deadlift', 'Bulgarian Split Squat', 'Reverse Lunge', 'Walking Lunge', 'Step-Up', 'Curtsy Lunge',
    'Cable Pull Through', 'Kettlebell Swing', 'Sumo Deadlift', 'Trap Bar Deadlift', 'Frog Stance Deadlift',
    'Lateral Band Walk', 'Clamshell', 'Fire Hydrant', 'Hip Abduction Machine', 'Cable Hip Abduction',
    'Banded Glute Bridge Hold', 'Tempo Hip Thrust', 'Paused Hip Thrust', 'Smith Machine Hip Thrust',
  ],
  Benen: [
    'Back Squat', 'Front Squat', 'Goblet Squat', 'Hack Squat', 'Leg Press', 'Bulgarian Split Squat', 'Walking Lunge',
    'Reverse Lunge', 'Step-Up', 'Romanian Deadlift', 'Stiff Leg Deadlift', 'Leg Extension', 'Leg Curl',
    'Seated Leg Curl', 'Lying Leg Curl', 'Nordic Curl', 'Glute Ham Raise', 'Calf Raise Standing', 'Calf Raise Seated',
    'Donkey Calf Raise', 'Sissy Squat', 'Pistol Squat', 'Wall Sit', 'Jump Squat', 'Box Jump', 'Skater Jump',
    'Split Squat', 'Cossack Squat', 'Trap Bar Deadlift', 'Tempo Squat',
  ],
};

// Generate Fitness exercises with proper structure
const FITNESS_EXERCISES: Exercise[] = Object.entries(FITNESS_MUSCLE_EXERCISES).flatMap(([spiergroep, oefeningen], groupIndex) =>
  oefeningen.slice(0, 30).map((name, index) => ({
    id: `${groupIndex + 1}-${index + 1}`,
    name,
    spiergroep,
    categorie: inferCategory(name, spiergroep),
    moeilijkheid: inferDifficulty(name, spiergroep),
  }))
);

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
    exercises: FITNESS_EXERCISES,
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
  'kegel-oefeningen': {
    workouts: [
      {
        id: 'k1',
        name: 'Klassieke Kegels',
        muscle: 'Bekkenbodem',
        duration: '10 min',
        level: 'Beginner',
        icon: 'alpha-k-circle-outline',
        color: '#7C3AED',
        exercises: 3,
      },
      {
        id: 'k2',
        name: 'Geavanceerde Kegels',
        muscle: 'Bekkenbodem · Core',
        duration: '15 min',
        level: 'Gevorderd',
        icon: 'alpha-k-circle',
        color: '#2563EB',
        exercises: 4,
      },
    ],
    exercises: [],
    programs: [],
  },
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
  hardlopen: {
    workouts: [
      {
        id: 'hr-end-1',
        name: 'Endurance Base Run',
        muscle: 'Uithoudingsvermogen · Zone 2',
        duration: '45 min',
        level: 'Beginner',
        icon: 'run',
        color: '#2563EB',
        exercises: 4,
      },
      {
        id: 'hr-end-2',
        name: 'Tempo Progression',
        muscle: 'Tempo · Aerobe drempel',
        duration: '55 min',
        level: 'Gemiddeld',
        icon: 'speedometer',
        color: '#0EA5E9',
        exercises: 5,
      },
    ],
    exercises: [],
    programs: [],
  },
  'hardlopen-agility': {
    workouts: [
      {
        id: 'hr-agi-1',
        name: 'Agility Ladder Flow',
        muscle: 'Voetwerk · Wendbaarheid',
        duration: '30 min',
        level: 'Beginner',
        icon: 'stairs',
        color: '#F97316',
        exercises: 6,
      },
      {
        id: 'hr-agi-2',
        name: 'Sprint & Cut Intervals',
        muscle: 'Explosiviteit · Richtingswissel',
        duration: '35 min',
        level: 'Gevorderd',
        icon: 'run-fast',
        color: '#EF4444',
        exercises: 7,
      },
      {
        id: 'hr-agi-3',
        name: 'Reaction Cone Drills',
        muscle: 'Reactiesnelheid · Coördinatie',
        duration: '28 min',
        level: 'Gemiddeld',
        icon: 'gesture-double-tap',
        color: '#8B5CF6',
        exercises: 5,
      },
    ],
    exercises: [],
    programs: [],
  },
  zwangerschap: {
    workouts: [
      {
        id: 'zw1',
        name: 'Zwangerschaps Yoga',
        muscle: 'Hele lichaam',
        duration: '30 min',
        level: 'Beginner',
        icon: 'meditation',
        color: '#F59E42',
        exercises: 6,
      },
      {
        id: 'zw2',
        name: 'Lichte Krachttraining',
        muscle: 'Benen · Billen · Core',
        duration: '25 min',
        level: 'Gemiddeld',
        icon: 'weight-lifter',
        color: '#2563EB',
        exercises: 5,
      },
    ],
    exercises: [],
    programs: [],
  },
  triatlon: { workouts: [], exercises: [], programs: [] },
};