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
    programs: [
      {
        id: 'fitness-start-sterk',
        name: 'Start Sterk',
        duration: '4 weken',
        level: 'Beginner',
        weeks: 4,
      },
      {
        id: 'fitness-spieropbouw-basis',
        name: 'Spieropbouw Basis',
        duration: '8 weken',
        level: 'Beginner',
        weeks: 8,
      },
      {
        id: 'fitness-full-body-fit',
        name: 'Full Body Fit',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
      {
        id: 'fitness-upper-body-power',
        name: 'Upper Body Power',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
      {
        id: 'fitness-lower-body-core',
        name: 'Lower Body & Core',
        duration: '6 weken',
        level: 'Beginner',
        weeks: 6,
      },
      {
        id: 'fitness-fit-lean',
        name: 'Fit & Lean',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
    ],
  },

  // All other disciplines with empty content for now
  crossfit: { workouts: [], exercises: [], programs: [] },
  'zwaargewicht': { workouts: [], exercises: [], programs: [] },
  hyrox: { workouts: [], exercises: [], programs: [] },
  yoga: { workouts: [], exercises: [], programs: [] },
  pilates: { workouts: [], exercises: [], programs: [] },
  calisthenics: {
    workouts: [
      {
        id: 'cal-beginner',
        name: 'Beginner Bodyweight Basics',
        muscle: 'Full body · Basis',
        duration: '25 min',
        level: 'Beginner',
        icon: 'human-handsup',
        color: '#10B981',
        exercises: 6,
      },
      {
        id: 'cal-push',
        name: 'Push Strength',
        muscle: 'Borst · Schouders · Triceps',
        duration: '30 min',
        level: 'Gemiddeld',
        icon: 'arm-flex',
        color: '#EF4444',
        exercises: 5,
      },
      {
        id: 'cal-pull',
        name: 'Pull Strength',
        muscle: 'Rug · Biceps · Grip',
        duration: '30 min',
        level: 'Gemiddeld',
        icon: 'human-handsup',
        color: '#3B82F6',
        exercises: 5,
      },
      {
        id: 'cal-core',
        name: 'Core Control',
        muscle: 'Core · Stabiliteit',
        duration: '20 min',
        level: 'Gemiddeld',
        icon: 'meditation',
        color: '#8B5CF6',
        exercises: 5,
      },
      {
        id: 'cal-legs',
        name: 'Lower Body Bodyweight',
        muscle: 'Benen · Billen · Balans',
        duration: '25 min',
        level: 'Beginner',
        icon: 'human-male',
        color: '#F59E0B',
        exercises: 6,
      },
      {
        id: 'cal-skill',
        name: 'Skill Foundations',
        muscle: 'Skills · Controle',
        duration: '30 min',
        level: 'Gemiddeld',
        icon: 'hand-okay',
        color: '#06B6D4',
        exercises: 4,
      },
      {
        id: 'cal-full',
        name: 'Full Body Calisthenics',
        muscle: 'Push · Pull · Legs · Core',
        duration: '35 min',
        level: 'Gemiddeld',
        icon: 'dumbbell',
        color: '#7C3AED',
        exercises: 7,
      },
      {
        id: 'cal-mobility',
        name: 'Mobility & Control',
        muscle: 'Mobiliteit · Controle',
        duration: '20 min',
        level: 'Gemiddeld',
        icon: 'human-female-dance',
        color: '#14B8A6',
        exercises: 6,
      },
    ],
    exercises: [
      {
        id: 'cal-ex-1',
        name: 'Incline push-up',
        spiergroep: 'Borst',
        categorie: 'Push',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-2',
        name: 'Knee push-up',
        spiergroep: 'Borst',
        categorie: 'Push',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-3',
        name: 'Push-up',
        spiergroep: 'Borst',
        categorie: 'Push',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-4',
        name: 'Diamond push-up',
        spiergroep: 'Triceps',
        categorie: 'Push',
        moeilijkheid: 'Gevorderd',
      },
      {
        id: 'cal-ex-5',
        name: 'Pike push-up',
        spiergroep: 'Schouders',
        categorie: 'Push',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-6',
        name: 'Dips',
        spiergroep: 'Triceps',
        categorie: 'Push',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-7',
        name: 'Bench dips',
        spiergroep: 'Triceps',
        categorie: 'Push',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-8',
        name: 'Scapula push-up',
        spiergroep: 'Schouders',
        categorie: 'Push',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-9',
        name: 'Australian row',
        spiergroep: 'Rug',
        categorie: 'Pull',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-10',
        name: 'Negative pull-up',
        spiergroep: 'Rug',
        categorie: 'Pull',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-11',
        name: 'Pull-up',
        spiergroep: 'Rug',
        categorie: 'Pull',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-12',
        name: 'Chin-up',
        spiergroep: 'Biceps',
        categorie: 'Pull',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-13',
        name: 'Dead hang',
        spiergroep: 'Grip',
        categorie: 'Pull',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-14',
        name: 'Active hang',
        spiergroep: 'Schouders',
        categorie: 'Pull',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-15',
        name: 'Scapula pull-up',
        spiergroep: 'Bovenrug',
        categorie: 'Pull',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-16',
        name: 'Towel row',
        spiergroep: 'Rug',
        categorie: 'Pull',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-17',
        name: 'Plank',
        spiergroep: 'Core',
        categorie: 'Core',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-18',
        name: 'Side plank',
        spiergroep: 'Core',
        categorie: 'Core',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-19',
        name: 'Hollow body hold',
        spiergroep: 'Core',
        categorie: 'Controle',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-20',
        name: 'Hollow rocks',
        spiergroep: 'Core',
        categorie: 'Controle',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-21',
        name: 'Dead bug',
        spiergroep: 'Core',
        categorie: 'Controle',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-22',
        name: 'Mountain climber',
        spiergroep: 'Core',
        categorie: 'Core',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-23',
        name: 'Hanging knee raise',
        spiergroep: 'Core',
        categorie: 'Core',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-24',
        name: 'L-sit tuck hold',
        spiergroep: 'Core',
        categorie: 'Skill',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-25',
        name: 'Bodyweight squat',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-26',
        name: 'Split squat',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-27',
        name: 'Reverse lunge',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-28',
        name: 'Walking lunge',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-29',
        name: 'Step-up',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-30',
        name: 'Glute bridge',
        spiergroep: 'Billen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-31',
        name: 'Single-leg glute bridge',
        spiergroep: 'Billen',
        categorie: 'Legs',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-32',
        name: 'Wall sit',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-33',
        name: 'Calf raise',
        spiergroep: 'Benen',
        categorie: 'Legs',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-34',
        name: 'Handstand wall hold',
        spiergroep: 'Full body',
        categorie: 'Skill',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-35',
        name: 'Wall walk',
        spiergroep: 'Schouders',
        categorie: 'Skill',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-36',
        name: 'Frog stand',
        spiergroep: 'Schouders',
        categorie: 'Skill',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-37',
        name: 'L-sit progression',
        spiergroep: 'Core',
        categorie: 'Skill',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'cal-ex-38',
        name: 'Bear crawl',
        spiergroep: 'Full body',
        categorie: 'Stabiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-39',
        name: 'Crab walk',
        spiergroep: 'Full body',
        categorie: 'Stabiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-40',
        name: 'Arch hold',
        spiergroep: 'Rug',
        categorie: 'Controle',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'cal-ex-41',
        name: 'Superman hold',
        spiergroep: 'Rug',
        categorie: 'Controle',
        moeilijkheid: 'Beginner',
      },
    ],
    programs: [
      {
        id: 'cal-prog-start',
        name: 'Start met Calisthenics',
        duration: '4 weken',
        level: 'Beginner',
        weeks: 4,
      },
      {
        id: 'cal-prog-pushup',
        name: 'Push-up Progressie',
        duration: '6 weken',
        level: 'Beginner',
        weeks: 6,
      },
      {
        id: 'cal-prog-pullup',
        name: 'Pull-up Basis',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
      {
        id: 'cal-prog-core',
        name: 'Core Control Plan',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
      {
        id: 'cal-prog-fullbody',
        name: 'Full Body Bodyweight',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
      {
        id: 'cal-prog-skills',
        name: 'Skill Foundations',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
    ],
  },
  mobiliteit: {
    workouts: [
      {
        id: 'mob-morning',
        name: 'Morning Mobility Flow',
        muscle: 'Full body · Gewrichten',
        duration: '12 min',
        level: 'Beginner',
        icon: 'weather-sunrise',
        color: '#F59E0B',
        exercises: 6,
      },
      {
        id: 'mob-full',
        name: 'Full Body Mobility',
        muscle: 'Heupen · Schouders · Rug · Enkels',
        duration: '20 min',
        level: 'Beginner',
        icon: 'human-female-dance',
        color: '#10B981',
        exercises: 8,
      },
      {
        id: 'mob-hip',
        name: 'Hip Opener Flow',
        muscle: 'Heupen · Bilspieren · Onderrug',
        duration: '18 min',
        level: 'Beginner',
        icon: 'human-handsup',
        color: '#8B5CF6',
        exercises: 7,
      },
      {
        id: 'mob-shoulder',
        name: 'Shoulder Reset',
        muscle: 'Schouders · Borst · Bovenrug',
        duration: '15 min',
        level: 'Beginner',
        icon: 'arm-flex',
        color: '#3B82F6',
        exercises: 6,
      },
      {
        id: 'mob-runner',
        name: 'Runner Mobility',
        muscle: 'Heupen · Hamstrings · Kuiten · Enkels',
        duration: '18 min',
        level: 'Gemiddeld',
        icon: 'run',
        color: '#06B6D4',
        exercises: 7,
      },
      {
        id: 'mob-desk',
        name: 'Desk Body Reset',
        muscle: 'Nek · Schouders · Rug · Heupen',
        duration: '10 min',
        level: 'Beginner',
        icon: 'desk',
        color: '#EF4444',
        exercises: 5,
      },
      {
        id: 'mob-deep',
        name: 'Deep Mobility Session',
        muscle: 'Full body · Diepe posities',
        duration: '30 min',
        level: 'Gemiddeld',
        icon: 'meditation',
        color: '#7C3AED',
        exercises: 10,
      },
      {
        id: 'mob-recovery',
        name: 'Mobility Recovery Flow',
        muscle: 'Full body · Herstel',
        duration: '20 min',
        level: 'Gemiddeld',
        icon: 'restore',
        color: '#14B8A6',
        exercises: 8,
      },
    ],
    exercises: [
      {
        id: 'mob-ex-1',
        name: 'Neck circles',
        spiergroep: 'Nek',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-2',
        name: 'Chin tucks',
        spiergroep: 'Nek',
        categorie: 'Houding',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-3',
        name: 'Thoracic rotations',
        spiergroep: 'Bovenrug',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-4',
        name: 'Cat cow',
        spiergroep: 'Rug',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-5',
        name: 'Thread the needle',
        spiergroep: 'Bovenrug',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-6',
        name: 'Arm circles',
        spiergroep: 'Schouders',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-7',
        name: 'Shoulder pass-through',
        spiergroep: 'Schouders',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-8',
        name: 'Wall slides',
        spiergroep: 'Schouders',
        categorie: 'Houding',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-9',
        name: 'Scapula push-up',
        spiergroep: 'Bovenrug',
        categorie: 'Activatie',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-10',
        name: 'Child’s pose reach',
        spiergroep: 'Rug',
        categorie: 'Herstel',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-11',
        name: 'World’s greatest stretch',
        spiergroep: 'Heupen',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-12',
        name: 'Open book stretch',
        spiergroep: 'Bovenrug',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-13',
        name: 'Cobra to child’s pose',
        spiergroep: 'Rug',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-14',
        name: 'Dead bug mobility',
        spiergroep: 'Core',
        categorie: 'Controle',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-15',
        name: 'Bird dog reach',
        spiergroep: 'Core',
        categorie: 'Controle',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-16',
        name: '90/90 hip switch',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-17',
        name: 'Hip circles',
        spiergroep: 'Heupen',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-18',
        name: 'Couch stretch',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-19',
        name: 'Pigeon stretch',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-20',
        name: 'Deep squat hold',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-21',
        name: 'Lizard stretch',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gevorderd',
      },
      {
        id: 'mob-ex-22',
        name: 'Hamstring sweep',
        spiergroep: 'Benen',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-23',
        name: 'Dynamic quad stretch',
        spiergroep: 'Benen',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-24',
        name: 'Walking toe touch',
        spiergroep: 'Benen',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-25',
        name: 'Cossack squat',
        spiergroep: 'Benen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-26',
        name: 'Adductor rockback',
        spiergroep: 'Benen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-27',
        name: 'Ankle rocks',
        spiergroep: 'Enkels',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-28',
        name: 'Calf stretch dynamic',
        spiergroep: 'Enkels',
        categorie: 'Dynamische stretch',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-29',
        name: 'Tibialis raise',
        spiergroep: 'Enkels',
        categorie: 'Activatie',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'mob-ex-30',
        name: 'Heel-toe walk',
        spiergroep: 'Enkels',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'mob-ex-31',
        name: 'Knee-to-wall drill',
        spiergroep: 'Enkels',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
    ],
    programs: [
      {
        id: 'mob-prog-start',
        name: 'Start met Mobiliteit',
        duration: '4 weken',
        level: 'Beginner',
        weeks: 4,
      },
      {
        id: 'mob-prog-full',
        name: 'Full Body Mobility Basis',
        duration: '6 weken',
        level: 'Beginner',
        weeks: 6,
      },
      {
        id: 'mob-prog-runner',
        name: 'Runner Mobility Plan',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
      {
        id: 'mob-prog-desk',
        name: 'Desk Reset Program',
        duration: '4 weken',
        level: 'Beginner',
        weeks: 4,
      },
      {
        id: 'mob-prog-deep',
        name: 'Deep Range Mobility',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
      {
        id: 'mob-prog-recovery',
        name: 'Recovery & Mobility',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
    ],
  },
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
      {
        id: 'hr-rec-1',
        name: 'Easy Recovery Run',
        muscle: 'Herstel · Active Recovery',
        duration: '25 min',
        level: 'Beginner',
        icon: 'run-slow',
        color: '#10B981',
        exercises: 3,
      },
      {
        id: 'hr-int-1',
        name: 'Interval Starter',
        muscle: 'Intervals · Snelheid',
        duration: '30 min',
        level: 'Beginner',
        icon: 'timer',
        color: '#F59E0B',
        exercises: 4,
      },
      {
        id: 'hr-long-1',
        name: 'Long Run Builder',
        muscle: 'Duurvermogen · Endurance',
        duration: '60 min',
        level: 'Gemiddeld',
        icon: 'clock-outline',
        color: '#8B5CF6',
        exercises: 3,
      },
      {
        id: 'hr-hill-1',
        name: 'Hill Repeats',
        muscle: 'Kracht · Condities',
        duration: '35 min',
        level: 'Gemiddeld',
        icon: 'trending-up',
        color: '#EF4444',
        exercises: 4,
      },
      {
        id: 'hr-5k-1',
        name: '5K Pace Session',
        muscle: 'Snelheid · Tempo',
        duration: '35 min',
        level: 'Gemiddeld',
        icon: 'speedometer',
        color: '#3B82F6',
        exercises: 4,
      },
      {
        id: 'hr-strides-1',
        name: 'Strides & Technique Run',
        muscle: 'Techniek · Cadans',
        duration: '30 min',
        level: 'Beginner',
        icon: 'foot-print',
        color: '#06B6D4',
        exercises: 5,
      },
    ],
    exercises: [
      {
        id: 'hl-ex-1',
        name: 'Knieheffen',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-2',
        name: 'Hakken-billen',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-3',
        name: 'Skippings',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-4',
        name: 'A-skips',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-5',
        name: 'B-skips',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-6',
        name: 'Straight leg bounds',
        spiergroep: 'Benen',
        categorie: 'Snelheid',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-7',
        name: 'Carioca',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-8',
        name: 'Zijwaartse shuffle',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-9',
        name: 'High knees hold',
        spiergroep: 'Benen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-10',
        name: 'Ankling',
        spiergroep: 'Enkels',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-11',
        name: 'Wall drill',
        spiergroep: 'Heupen',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-12',
        name: 'Lean fall start',
        spiergroep: 'Hele lichaam',
        categorie: 'Snelheid',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-13',
        name: 'Strides',
        spiergroep: 'Benen',
        categorie: 'Snelheid',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-14',
        name: 'Cadans drill',
        spiergroep: 'Hele lichaam',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-15',
        name: 'Arm swing drill',
        spiergroep: 'Bovenlichaam',
        categorie: 'Looptechniek',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-16',
        name: 'Single-leg calf raise',
        spiergroep: 'Benen',
        categorie: 'Kracht',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-17',
        name: 'Glute bridge',
        spiergroep: 'Billen',
        categorie: 'Kracht',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-18',
        name: 'Walking lunges',
        spiergroep: 'Benen',
        categorie: 'Kracht',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-19',
        name: 'Step-ups',
        spiergroep: 'Benen',
        categorie: 'Kracht',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-20',
        name: 'Plank',
        spiergroep: 'Core',
        categorie: 'Stabiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-21',
        name: 'Side plank',
        spiergroep: 'Core',
        categorie: 'Stabiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-22',
        name: 'Dead bug',
        spiergroep: 'Core',
        categorie: 'Stabiliteit',
        moeilijkheid: 'Beginner',
      },
      {
        id: 'hl-ex-23',
        name: 'Hip airplane',
        spiergroep: 'Heupen',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Gemiddeld',
      },
      {
        id: 'hl-ex-24',
        name: 'Enkelmobiliteit drill',
        spiergroep: 'Enkels',
        categorie: 'Mobiliteit',
        moeilijkheid: 'Beginner',
      },
    ],
    programs: [
      {
        id: 'hr-prog-start',
        name: 'Start met Hardlopen',
        duration: '4 weken',
        level: 'Beginner',
        weeks: 4,
      },
      {
        id: 'hr-prog-5k-base',
        name: '5KM Basis',
        duration: '6 weken',
        level: 'Beginner',
        weeks: 6,
      },
      {
        id: 'hr-prog-5k-fast',
        name: '5KM Sneller',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
      {
        id: 'hr-prog-10k',
        name: '10KM Builder',
        duration: '8 weken',
        level: 'Gemiddeld',
        weeks: 8,
      },
      {
        id: 'hr-prog-interval',
        name: 'Interval & Snelheid',
        duration: '6 weken',
        level: 'Gemiddeld',
        weeks: 6,
      },
      {
        id: 'hr-prog-endurance',
        name: 'Duurvermogen Basis',
        duration: '10 weken',
        level: 'Gemiddeld',
        weeks: 10,
      },
    ],
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