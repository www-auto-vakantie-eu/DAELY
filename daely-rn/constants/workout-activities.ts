export type ActivityType = 'running' | 'kracht' | 'hyrox' | 'herstel' | 'mobility';

export interface SplitRow {
  label: string;
  meta: string;
}

export interface WorkoutMetric {
  label: string;
  value: string;
}

export interface WorkoutActivity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  dateIso: string;
  icon: string;
  accentColor: string;
  metrics: WorkoutMetric[];
  splits: SplitRow[];
  heartRateData: number[];
  description: string;
  image: string;
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  running: 'Running',
  kracht: 'Kracht',
  hyrox: 'HYROX',
  herstel: 'Herstel',
  mobility: 'Mobility',
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  running: '#2563EB',
  kracht: '#EA580C',
  hyrox: '#14B8A6',
  herstel: '#8B5CF6',
  mobility: '#10B981',
};

export const WORKOUT_ACTIVITIES: WorkoutActivity[] = [
  {
    id: 'run-1',
    type: 'running',
    title: 'Avondrun aan de kade',
    date: 'Vandaag · 19:42',
    dateIso: '2026-03-24T19:42:00',
    icon: 'run-fast',
    accentColor: '#2563EB',
    metrics: [
      { label: 'Afstand', value: '8.4 km' },
      { label: 'Tijd', value: '43:12' },
      { label: 'Tempo', value: '5:08 /km' },
      { label: 'HR gemidd.', value: '152 bpm' },
    ],
    splits: [
      { label: 'Km 1', meta: '5:14 · 152 bpm' },
      { label: 'Km 2', meta: '5:05 · 155 bpm' },
      { label: 'Km 3', meta: '4:58 · 159 bpm' },
      { label: 'Km 4', meta: '5:11 · 157 bpm' },
      { label: 'Km 5', meta: '5:03 · 161 bpm' },
      { label: 'Km 6', meta: '4:55 · 163 bpm' },
      { label: 'Km 7', meta: '5:22 · 154 bpm' },
      { label: 'Km 8+', meta: '5:24 · 148 bpm' },
    ],
    heartRateData: [142, 148, 151, 153, 158, 162, 159, 157, 163, 165, 160, 157, 152, 148],
    description:
      'Avondrun langs de kade. Het eerste deel snel en gecontroleerd, snelste kilometer op km 6. Koelere temperaturen zorgden voor een aangenamer tempo in de tweede helft.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'strength-1',
    type: 'kracht',
    title: 'Lower Body Strength',
    date: 'Gisteren · 18:05',
    dateIso: '2026-03-23T18:05:00',
    icon: 'dumbbell',
    accentColor: '#EA580C',
    metrics: [
      { label: 'Duur', value: '58 min' },
      { label: 'Sets', value: '18 sets' },
      { label: 'Volume', value: '9.240 kg' },
      { label: 'Oefeningen', value: '6' },
    ],
    splits: [
      { label: 'Squat', meta: '4 × 8 · 100 kg' },
      { label: 'RDL', meta: '4 × 10 · 80 kg' },
      { label: 'Leg press', meta: '3 × 12 · 160 kg' },
      { label: 'Lunges', meta: '3 × 12/kant · 20 kg' },
      { label: 'Leg curl', meta: '3 × 15 · 40 kg' },
      { label: 'Calf raises', meta: '3 × 20 · 30 kg' },
    ],
    heartRateData: [102, 118, 132, 141, 138, 145, 137, 128, 142, 148, 139, 130, 122, 114],
    description:
      'Focus op lower-body hypertrofie. PR op squats: 100 kg voor 8 reps over 4 sets. Volume bewust hoog gehouden voor optimale metabole respons. Core-activatie gedurende alle oefeningen aangehouden.',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hyrox-1',
    type: 'hyrox',
    title: 'Engine + sled session',
    date: 'Zaterdag · 09:10',
    dateIso: '2026-03-22T09:10:00',
    icon: 'lightning-bolt',
    accentColor: '#14B8A6',
    metrics: [
      { label: 'Duur', value: '47 min' },
      { label: 'Rondes', value: '7' },
      { label: 'HR gemidd.', value: '161 bpm' },
      { label: 'Stations', value: '4' },
    ],
    splits: [
      { label: 'Ski erg 1k', meta: '4:22 · 158 bpm' },
      { label: 'Sled push', meta: '1:48 · 175 bpm' },
      { label: 'Burpees', meta: '2:15 · 170 bpm' },
      { label: 'Row 1k', meta: '3:54 · 163 bpm' },
      { label: 'Farmer carry', meta: '1:56 · 165 bpm' },
      { label: 'Wall balls', meta: '2:08 · 168 bpm' },
    ],
    heartRateData: [130, 148, 163, 172, 175, 170, 163, 158, 168, 173, 165, 161, 155, 148],
    description:
      'Race-pace voorbereiding voor aankomend Hyrox-evenement. Sled push was het zwaarste station; snelste ronde op ronde 5. Hartslag bleef throughout steady-state rood — goed teken voor uithoudingsvermogen.',
    image:
      'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mobility-1',
    type: 'mobility',
    title: 'Morning mobility flow',
    date: 'Vrijdag · 07:15',
    dateIso: '2026-03-21T07:15:00',
    icon: 'human-handsup',
    accentColor: '#10B981',
    metrics: [
      { label: 'Duur', value: '25 min' },
      { label: 'Oefeningen', value: '12' },
      { label: 'HR gemidd.', value: '82 bpm' },
      { label: 'Type', value: 'Ochtend' },
    ],
    splits: [
      { label: 'Heupflexoren', meta: '3 × 60s stretch' },
      { label: 'T-spine rotatie', meta: '2 × 10 reps' },
      { label: 'Pigeon pose', meta: '2 × 90s elk' },
      { label: 'Cat-cow', meta: '2 × 15 reps' },
      { label: 'Ankle mob.', meta: '2 × 10 reps' },
    ],
    heartRateData: [74, 78, 82, 85, 83, 80, 82, 84, 86, 83, 80, 78, 76, 74],
    description:
      'Ochtend mobiliteits-sessie voor de training van de dag. Focus op heupflexibiliteit en thoracale mobiliteit na een week van intensieve trainingen.',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const WEEK_BARS = [72, 56, 88, 44, 94, 67, 81];

export const PERSONAL_RECORDS = [
  { label: '5K PR', value: '24:58', icon: 'run-fast' },
  { label: 'Langste run', value: '16.2 km', icon: 'map-marker-distance' },
  { label: 'Squat 1RM', value: '120 kg', icon: 'dumbbell' },
  { label: 'Beste streak', value: '12 dagen', icon: 'fire' },
];

export const HEATMAP: number[][] = [
  [0, 1, 2, 0, 3, 1, 0],
  [2, 3, 1, 0, 2, 2, 1],
  [0, 2, 3, 1, 0, 3, 2],
  [1, 0, 2, 2, 3, 1, 0],
  [3, 2, 1, 0, 2, 3, 1],
];
