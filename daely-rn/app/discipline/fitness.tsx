import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useState, useMemo } from 'react';

const { width: screenWidth } = Dimensions.get('window');

const HERO_IMAGE = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';

const WORKOUTS = [
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
];

// ─── EXERCISES ───────────────────────────────────────────────────────────────
type Difficulty = 'Beginner' | 'Gemiddeld' | 'Gevorderd';
interface Exercise {
  id: string;
  name: string;
  spiergroep: string;
  categorie: string;
  moeilijkheid: Difficulty;
}

const MUSCLE_EXERCISES: Record<string, string[]> = {
  Borst: [
    'Barbell Bench Press',
    'Incline Barbell Bench Press',
    'Decline Barbell Bench Press',
    'Close Grip Bench Press',
    'Wide Grip Bench Press',
    'Reverse Grip Bench Press',
    'Paused Bench Press',
    'Tempo Bench Press',
    'Spoto Press',
    'Dumbbell Bench Press',
    'Incline Dumbbell Press',
    'Decline Dumbbell Press',
    'Neutral Grip Dumbbell Press',
    'Single Arm Dumbbell Press',
    'Dumbbell Fly',
    'Incline Dumbbell Fly',
    'Machine Chest Press',
    'Incline Machine Press',
    'Hammer Strength Chest Press',
    'Machine Pec Fly',
    'Cable Chest Fly',
    'Cable Crossover',
    'Low to High Cable Fly',
    'High to Low Cable Fly',
    'Push-Up',
    'Wide Push-Up',
    'Decline Push-Up',
    'Ring Push-Up',
    'Chest Dips',
    'Svend Press',
  ],
  Biceps: [
    'Barbell Curl',
    'EZ Bar Curl',
    'Wide Grip EZ Curl',
    'Close Grip EZ Curl',
    'Spider Curl',
    'Preacher Curl',
    'Reverse Curl',
    'Drag Curl',
    'Behind The Back Barbell Curl',
    'Incline Dumbbell Curl',
    'Alternating Dumbbell Curl',
    'Hammer Curl',
    'Cross Body Hammer Curl',
    'Concentration Curl',
    'Seated Dumbbell Curl',
    'Zottman Curl',
    'Machine Biceps Curl',
    'Cable Curl',
    'Rope Hammer Curl',
    'Single Arm Cable Curl',
    'High Cable Curl',
    'Bayesian Cable Curl',
    'Chin-Up Supinated Grip',
    'Ring Chin-Up',
    'Towel Chin-Up',
    'Band Biceps Curl',
    'Isometric Curl Hold',
    'Tempo Curl',
    '21s Biceps Curl',
    'Preacher Machine Curl',
  ],
  Triceps: [
    'Close Grip Bench Press',
    'Skull Crusher',
    'EZ Bar Skull Crusher',
    'JM Press',
    'Dumbbell Overhead Triceps Extension',
    'Single Arm Overhead Dumbbell Extension',
    'Dumbbell Kickback',
    'Rolling Dumbbell Extension',
    'Cable Rope Pushdown',
    'Straight Bar Pushdown',
    'Reverse Grip Pushdown',
    'Single Arm Cable Pushdown',
    'Overhead Rope Extension',
    'Overhead Cable Extension',
    'Cross Body Cable Extension',
    'Machine Triceps Extension',
    'Bench Dips',
    'Parallel Bar Dips',
    'Ring Dips',
    'Diamond Push-Up',
    'Close Push-Up',
    'Bodyweight Triceps Extension',
    'Band Pushdown',
    'Band Overhead Extension',
    'Tate Press',
    'Floor Skull Crusher',
    'Paused Pushdown',
    'Tempo Pushdown',
    'Weighted Dips',
    'PJR Pullover',
  ],
  Schouders: [
    'Barbell Overhead Press',
    'Push Press',
    'Seated Barbell Press',
    'Behind The Neck Press',
    'Dumbbell Shoulder Press',
    'Arnold Press',
    'Seated Dumbbell Press',
    'Single Arm Dumbbell Press',
    'Dumbbell Lateral Raise',
    'Cable Lateral Raise',
    'Leaning Cable Lateral Raise',
    'Machine Lateral Raise',
    'Front Raise',
    'Plate Front Raise',
    'Rear Delt Fly',
    'Reverse Pec Deck',
    'Face Pull',
    'Upright Row',
    'Cable Upright Row',
    'Landmine Press',
    'Single Arm Landmine Press',
    'Handstand Push-Up',
    'Pike Push-Up',
    'Band Lateral Raise',
    'Band Pull Apart',
    'Y Raise',
    'Prone Rear Delt Raise',
    'Cuban Press',
    'Bradford Press',
    'Overhead Carry',
  ],
  Bovenrug: [
    'Pull-Up',
    'Chin-Up',
    'Neutral Grip Pull-Up',
    'Wide Grip Pull-Up',
    'Lat Pulldown Wide Grip',
    'Lat Pulldown Neutral Grip',
    'Single Arm Lat Pulldown',
    'Chest Supported Row',
    'Barbell Row',
    'Pendlay Row',
    'T-Bar Row',
    'Seated Cable Row',
    'Single Arm Cable Row',
    'Dumbbell Row',
    'Meadows Row',
    'Machine High Row',
    'Machine Row',
    'Straight Arm Pulldown',
    'Face Pull',
    'Rear Delt Row',
    'Inverted Row',
    'Ring Row',
    'Scap Pull-Up',
    'Band Row',
    'Band Pulldown',
    'Snatch Grip Row',
    'Seal Row',
    'Cable Pullover',
    'Kroc Row',
    'Trap 3 Raise',
  ],
  Onderrug: [
    'Romanian Deadlift',
    'Stiff Leg Deadlift',
    'Conventional Deadlift',
    'Sumo Deadlift',
    'Deficit Deadlift',
    'Rack Pull',
    'Good Morning',
    'Back Extension',
    'Hyperextension Hold',
    'Reverse Hyper',
    'Bird Dog',
    'Superman Hold',
    'Superman Raise',
    'Cable Pull Through',
    'Kettlebell Swing',
    'Single Leg Romanian Deadlift',
    'Jefferson Curl',
    'Hip Hinge Drill',
    'Prone Back Extension',
    'Seated Good Morning',
    'Band Good Morning',
    'Banded Back Extension',
    'Deadlift Isometric Hold',
    'Paused Romanian Deadlift',
    'Tempo Romanian Deadlift',
    'Snatch Grip Deadlift',
    'GHD Back Extension',
    'Reverse Plank',
    'Quadruped Rock Back',
    '45 Degree Back Extension',
  ],
  Buik: [
    'Crunch',
    'Reverse Crunch',
    'Bicycle Crunch',
    'Toe Touch Crunch',
    'V-Up',
    'Hollow Hold',
    'Dead Bug',
    'Plank',
    'Side Plank',
    'RKC Plank',
    'Mountain Climber',
    'Hanging Knee Raise',
    'Hanging Leg Raise',
    'Captain Chair Leg Raise',
    'Ab Wheel Rollout',
    'Swiss Ball Rollout',
    'Cable Crunch',
    'Kneeling Cable Crunch',
    'Woodchopper',
    'Russian Twist',
    'Pallof Press',
    'Decline Sit-Up',
    'Sit-Up',
    'Dragon Flag',
    'Flutter Kicks',
    'Scissor Kicks',
    'Toe Taps',
    'Jackknife Sit-Up',
    'Plank Shoulder Tap',
    'Hollow Rock',
  ],
  Billen: [
    'Barbell Hip Thrust',
    'Dumbbell Hip Thrust',
    'Single Leg Hip Thrust',
    'Glute Bridge',
    'Single Leg Glute Bridge',
    'Frog Pump',
    'Cable Kickback',
    'Machine Glute Kickback',
    'Banded Kickback',
    'Romanian Deadlift',
    'Single Leg Romanian Deadlift',
    'Bulgarian Split Squat',
    'Reverse Lunge',
    'Walking Lunge',
    'Step-Up',
    'Curtsy Lunge',
    'Cable Pull Through',
    'Kettlebell Swing',
    'Sumo Deadlift',
    'Trap Bar Deadlift',
    'Frog Stance Deadlift',
    'Lateral Band Walk',
    'Clamshell',
    'Fire Hydrant',
    'Hip Abduction Machine',
    'Cable Hip Abduction',
    'Banded Glute Bridge Hold',
    'Tempo Hip Thrust',
    'Paused Hip Thrust',
    'Smith Machine Hip Thrust',
  ],
  Benen: [
    'Back Squat',
    'Front Squat',
    'Goblet Squat',
    'Hack Squat',
    'Leg Press',
    'Bulgarian Split Squat',
    'Walking Lunge',
    'Reverse Lunge',
    'Step-Up',
    'Romanian Deadlift',
    'Stiff Leg Deadlift',
    'Leg Extension',
    'Leg Curl',
    'Seated Leg Curl',
    'Lying Leg Curl',
    'Nordic Curl',
    'Glute Ham Raise',
    'Calf Raise Standing',
    'Calf Raise Seated',
    'Donkey Calf Raise',
    'Sissy Squat',
    'Pistol Squat',
    'Wall Sit',
    'Jump Squat',
    'Box Jump',
    'Skater Jump',
    'Split Squat',
    'Cossack Squat',
    'Trap Bar Deadlift',
    'Tempo Squat',
  ],
};

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

  // Muscle-group-specific fallback behavior.
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

const ALL_EXERCISES: Exercise[] = Object.entries(MUSCLE_EXERCISES).flatMap(([spiergroep, oefeningen], groupIndex) =>
  oefeningen.slice(0, 30).map((name, index) => ({
    id: `${groupIndex + 1}-${index + 1}`,
    name,
    spiergroep,
    categorie: inferCategory(name, spiergroep),
    moeilijkheid: inferDifficulty(name, spiergroep),
  }))
);

const MUSCLE_FILTERS = ['Alles', 'Borst', 'Biceps', 'Triceps', 'Schouders', 'Bovenrug', 'Onderrug', 'Buik', 'Billen', 'Benen'];

const DIFF_COLORS: Record<Difficulty, string> = {
  Beginner: '#10B981',
  Gemiddeld: '#F59E0B',
  Gevorderd: '#EF4444',
};

const CAT_COLORS: Record<string, string> = {
  Barbell: '#2563EB',
  Dumbbell: '#7C3AED',
  Machine: '#0891B2',
  Cable: '#059669',
  Bodyweight: '#D97706',
  Calisthenics: '#DC2626',
  Gevorderd: '#9333EA',
  Hybrid: '#EA580C',
  Isolatie: '#DB2777',
  Specialist: '#475569',
};

const LEVEL_COLORS: Record<string, string> = {
  Licht: '#10B981',
  Gemiddeld: '#F59E0B',
  Zwaar: '#EF4444',
};

type Tab = 'workouts' | 'oefeningen' | 'programmas';

export default function FitnessScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('workouts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Alles');

  const filteredExercises = useMemo(() => {
    return ALL_EXERCISES.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Alles' || ex.spiergroep === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HERO HEADER ── */}
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero}>
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.80)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Back button */}
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
              <Text style={styles.backLabel}>Bibliotheek</Text>
            </Pressable>

            {/* Title block */}
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>FITNESS</Text>
              <Text style={styles.heroSubtitle}>Kracht & Hypertrofie</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* ── TAB KNOPPEN ── */}
        <View style={[styles.tabRow, { backgroundColor: theme.background }]}>
          {(['workouts', 'oefeningen', 'programmas'] as Tab[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'programmas' ? "Programma's" : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <Pressable
                key={tab}
                style={[
                  styles.tabButton,
                  { borderColor: theme.border },
                  isActive && { backgroundColor: theme.tabBarActive, borderColor: theme.tabBarActive },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabLabel, { color: isActive ? '#FFFFFF' : theme.subtitleColor }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── ZOEKBALK + SPIERGROEP FILTER ── */}
        <View style={[styles.searchSection, { backgroundColor: theme.background }]}>
          <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
            <TextInput
              style={[styles.searchInput, { color: theme.titleColor }]}
              placeholder="Zoek oefeningen..."
              placeholderTextColor={theme.subtitleColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.subtitleColor} />
              </Pressable>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {MUSCLE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    { borderColor: theme.border, backgroundColor: theme.card },
                    isActive && { backgroundColor: theme.tabBarActive, borderColor: theme.tabBarActive },
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : theme.subtitleColor }]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── CONTENT ── */}
        <View style={styles.contentArea}>

          {/* WORKOUTS TAB */}
          {activeTab === 'workouts' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Kant-en-klare Workouts</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
                {WORKOUTS.length} workouts beschikbaar
              </Text>
              {WORKOUTS.map((workout) => (
                <Pressable
                  key={workout.id}
                  style={({ pressed }) => [
                    styles.workoutCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={[styles.workoutIconBox, { backgroundColor: workout.color + '22' }]}>
                    <MaterialCommunityIcons name={workout.icon as any} size={26} color={workout.color} />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={[styles.workoutName, { color: theme.titleColor }]}>{workout.name}</Text>
                    <Text style={[styles.workoutMuscle, { color: theme.subtitleColor }]}>{workout.muscle}</Text>
                    <View style={styles.workoutMeta}>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="clock-outline" size={12} color={theme.subtitleColor} />
                        <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{workout.duration}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="lightning-bolt" size={12} color={LEVEL_COLORS[workout.level]} />
                        <Text style={[styles.metaText, { color: LEVEL_COLORS[workout.level] }]}>{workout.level}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="dumbbell" size={12} color={theme.subtitleColor} />
                        <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{workout.exercises} oefeningen</Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} />
                </Pressable>
              ))}
            </>
          )}

          {/* OEFENINGEN TAB */}
          {activeTab === 'oefeningen' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>
                {activeFilter === 'Alles' ? 'Alle Oefeningen' : activeFilter}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
                {filteredExercises.length} oefeningen{searchQuery ? ` voor "${searchQuery}"` : ''}
              </Text>
              {filteredExercises.length === 0 ? (
                <View style={[styles.emptyState, { borderColor: theme.border }]}>
                  <MaterialCommunityIcons name="magnify-close" size={40} color={theme.subtitleColor} />
                  <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Geen resultaten</Text>
                  <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>
                    Probeer een andere zoekterm of filter.
                  </Text>
                </View>
              ) : (
                filteredExercises.map((ex) => (
                  <Pressable
                    key={ex.id}
                    style={({ pressed }) => [
                      styles.exerciseCard,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: '/exercise/[id]',
                        params: {
                          id: ex.id,
                          name: ex.name,
                          spiergroep: ex.spiergroep,
                          categorie: ex.categorie,
                          moeilijkheid: ex.moeilijkheid,
                        },
                      })
                    }
                  >
                    <View style={[styles.exerciseDot, { backgroundColor: CAT_COLORS[ex.categorie] ?? '#6B7280' }]} />
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: theme.titleColor }]}>{ex.name}</Text>
                      <View style={styles.exerciseMeta}>
                        <View style={[styles.catBadge, { backgroundColor: (CAT_COLORS[ex.categorie] ?? '#6B7280') + '22' }]}>
                          <Text style={[styles.catText, { color: CAT_COLORS[ex.categorie] ?? '#6B7280' }]}>{ex.categorie}</Text>
                        </View>
                        <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[ex.moeilijkheid] + '22' }]}>
                          <Text style={[styles.diffText, { color: DIFF_COLORS[ex.moeilijkheid] }]}>{ex.moeilijkheid}</Text>
                        </View>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={theme.subtitleColor} />
                  </Pressable>
                ))
              )}
            </>
          )}

          {/* PROGRAMMA'S TAB */}
          {activeTab === 'programmas' && (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <MaterialCommunityIcons name="calendar-outline" size={48} color={theme.subtitleColor} />
              <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Programma&apos;s</Text>
              <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>
                Trainingsschema&apos;s van meerdere weken worden hier toegevoegd.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 0 },

  /* Hero */
  hero: { width: screenWidth, height: 280 },
  heroGradient: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start' },
  backLabel: { fontSize: 16, fontWeight: '500', color: '#FFFFFF' },
  heroTextBlock: { gap: 4 },
  heroTitle: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1.5, lineHeight: 50 },
  heroSubtitle: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.80)', letterSpacing: 1 },

  /* Tabs */
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, gap: 10 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  tabLabel: { fontSize: 13, fontWeight: '700' },

  /* Search + filters */
  searchSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { gap: 8, paddingBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 12, fontWeight: '700' },

  /* Content */
  contentArea: { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 3 },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginBottom: 14 },

  /* Workout Card */
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 14,
  },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  workoutIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  workoutMuscle: { fontSize: 12, marginBottom: 8 },
  workoutMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '600' },

  /* Exercise Card */
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 8,
    gap: 12,
  },
  exerciseDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  exerciseMeta: { flexDirection: 'row', gap: 6 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  catText: { fontSize: 10, fontWeight: '700' },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  diffText: { fontSize: 10, fontWeight: '700' },

  /* Empty state */
  emptyState: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  bottomSpacer: { height: 120 },
});
