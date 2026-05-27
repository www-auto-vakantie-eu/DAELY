export type TrackingType = 'workout' | 'session' | 'gps' | 'laps' | 'match' | 'score' | 'skill';

export interface SportDiscipline {
  id: string;
  name: string;
  category: string;
  trackingType: TrackingType;
  metrics: string[];
  supportsGps: boolean;
  supportsWearables: boolean;
  supportsPr: boolean;
  supportsChallenges: boolean;
  privacyDefault: 'public' | 'private';
}

export const SPORT_DISCIPLINES: SportDiscipline[] = [
  { id: 'fitness', name: 'Fitness', category: 'Strength', trackingType: 'workout', metrics: ['reps', 'sets'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'crossfit', name: 'CrossFit', category: 'Functional', trackingType: 'workout', metrics: ['reps', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'zwaargewicht', name: 'Zwaargewicht', category: 'Strength', trackingType: 'workout', metrics: ['weight', 'reps'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'hyrox', name: 'Hyrox', category: 'Functional', trackingType: 'workout', metrics: ['time', 'distance'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'yoga', name: 'Yoga', category: 'Mindfulness', trackingType: 'session', metrics: ['duration'], supportsGps: false, supportsWearables: false, supportsPr: false, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'pilates', name: 'Pilates', category: 'Core', trackingType: 'session', metrics: ['duration'], supportsGps: false, supportsWearables: false, supportsPr: false, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'calisthenics', name: 'Calisthenics', category: 'Bodyweight', trackingType: 'workout', metrics: ['reps', 'sets'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'mobiliteit', name: 'Mobiliteit', category: 'Flexibility', trackingType: 'session', metrics: ['duration'], supportsGps: false, supportsWearables: false, supportsPr: false, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'vechttraining', name: 'Vechttraining', category: 'Combat', trackingType: 'session', metrics: ['rounds', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'zwangerschap', name: 'Zwangerschap', category: 'Wellness', trackingType: 'session', metrics: ['duration'], supportsGps: false, supportsWearables: false, supportsPr: false, supportsChallenges: false, privacyDefault: 'private' },
  { id: 'kegel', name: 'Kegel oefeningen', category: 'Pelvic Floor', trackingType: 'session', metrics: ['reps'], supportsGps: false, supportsWearables: false, supportsPr: false, supportsChallenges: false, privacyDefault: 'private' },
  { id: 'fietssporten', name: 'Fietssporten', category: 'Cycling', trackingType: 'gps', metrics: ['distance', 'speed'], supportsGps: true, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'zwemmen', name: 'Zwemmen', category: 'Aquatic', trackingType: 'laps', metrics: ['laps', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'watersporten', name: 'Watersporten', category: 'Aquatic', trackingType: 'gps', metrics: ['distance', 'speed'], supportsGps: true, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'schaatsen', name: 'Schaatsen', category: 'Ice', trackingType: 'gps', metrics: ['distance', 'speed'], supportsGps: true, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'voetbal', name: 'Voetbal', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'basketbal', name: 'Basketbal', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'volleybal', name: 'Volleybal', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'handbal', name: 'Handbal', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'hockey', name: 'Hockey', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'rugby', name: 'Rugby', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'american-football', name: 'American Football', category: 'Team', trackingType: 'match', metrics: ['score', 'time'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'racketsporten', name: 'Racketsporten', category: 'Racket', trackingType: 'score', metrics: ['score', 'sets'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'judo', name: 'Judo / Worstelen / BJJ / Karate / Taekwondo', category: 'Martial Arts', trackingType: 'skill', metrics: ['techniques'], supportsGps: false, supportsWearables: false, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'turnen', name: 'Turnen / Gymnastiek', category: 'Artistic', trackingType: 'skill', metrics: ['routines'], supportsGps: false, supportsWearables: false, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'parkour', name: 'Parkour / Freerunning', category: 'Urban', trackingType: 'skill', metrics: ['jumps', 'time'], supportsGps: false, supportsWearables: false, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'klimmen', name: 'Klimmen / Boulderen', category: 'Climbing', trackingType: 'skill', metrics: ['routes', 'time'], supportsGps: false, supportsWearables: false, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'golf', name: 'Golf', category: 'Precision', trackingType: 'score', metrics: ['strokes', 'holes'], supportsGps: false, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
  { id: 'paardensport', name: 'Paardensport', category: 'Equestrian', trackingType: 'gps', metrics: ['distance', 'speed'], supportsGps: true, supportsWearables: true, supportsPr: true, supportsChallenges: true, privacyDefault: 'public' },
];