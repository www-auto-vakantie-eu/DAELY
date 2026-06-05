import { ImageSourcePropType } from 'react-native';

export const HERO_BACKGROUND_STORAGE_KEY = 'daely.today.heroBackground.v1';

export type HeroBackgroundOptionId = 'ownPhoto' | 'daelyClassic' | 'sunriseEnergy' | 'midnightFocus' | 'recoveryFlow' | 'performanceBlue' | 'forestBalance' | 'communityPulse' | 'pureMinimal' | 'badgeWall' | 'streakFire' | 'levelUp' | 'trophyRoom' | 'heroEnergy' | 'raceDay' | 'dataPulse' | 'gymBlackout' | 'footballMatchday' | 'neonNight';

export type HeroBackgroundOption = {
  id: HeroBackgroundOptionId;
  label: string;
  source?: ImageSourcePropType;
  disabled?: boolean;
  locked?: boolean;
  unlockLabel?: string;
  category?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};

export const HERO_BACKGROUND_OPTIONS: HeroBackgroundOption[] = [
  { id: 'ownPhoto', label: 'Eigen foto (Binnenkort)', disabled: true },
  { id: 'daelyClassic', label: 'DAELY Classic', source: require('../assets/images/theme-classic.png') },
  { id: 'sunriseEnergy', label: 'Sunrise Energy', source: require('../assets/images/theme-ember.png') },
  { id: 'midnightFocus', label: 'Midnight Focus', source: require('../assets/images/theme-rogue.png') },
  { id: 'recoveryFlow', label: 'Recovery Flow', source: require('../assets/images/theme-zen.ink.png') },
  { id: 'performanceBlue', label: 'Performance Blue', source: require('../assets/images/theme-pulse.png') },
  { id: 'forestBalance', label: 'Forest Balance', source: require('../assets/images/theme-forest-breath.png') },
  { id: 'communityPulse', label: 'Community Pulse', source: require('../assets/images/theme-retro-sport.png') },
  { id: 'pureMinimal', label: 'Pure Minimal' },
  { id: 'badgeWall', label: 'Badge Wall', source: require('../assets/images/theme-badge-wall.png'), locked: true, unlockLabel: 'Ontgrendel met je eerste badge', category: 'achievements', rarity: 'rare' },
  { id: 'streakFire', label: 'Streak Fire', source: require('../assets/images/theme-streak-fire.png'), locked: true, unlockLabel: 'Ontgrendel met een 7-daagse streak', category: 'gamification', rarity: 'epic' },
  { id: 'levelUp', label: 'Level Up', source: require('../assets/images/theme-level-up.png'), locked: true, unlockLabel: 'Ontgrendel bij level 5', category: 'achievements', rarity: 'rare' },
  { id: 'trophyRoom', label: 'Trophy Room', source: require('../assets/images/theme-trophy-room.png'), locked: true, unlockLabel: 'Ontgrendel na je eerste challenge win', category: 'achievements', rarity: 'legendary' },
  { id: 'heroEnergy', label: 'Hero Energy', source: require('../assets/images/theme-hero-energy.png'), locked: true, unlockLabel: 'Ontgrendel bij 10 voltooide workouts', category: 'performance', rarity: 'epic' },
  { id: 'raceDay', label: 'Race Day', source: require('../assets/images/theme-race-day.png'), locked: true, unlockLabel: 'Ontgrendel tijdens challenge week', category: 'sport', rarity: 'legendary' },
  { id: 'dataPulse', label: 'Data Pulse', source: require('../assets/images/theme-data-pulse.png'), locked: true, unlockLabel: 'Ontgrendel na 14 dagen tracking', category: 'performance', rarity: 'rare' },
  { id: 'gymBlackout', label: 'Gym Blackout', source: require('../assets/images/theme-gym-blackout.png'), locked: true, unlockLabel: 'Ontgrendel met 20 krachttrainingen', category: 'sport', rarity: 'epic' },
  { id: 'footballMatchday', label: 'Football Matchday', source: require('../assets/images/theme-football-matchday.png'), locked: true, unlockLabel: 'Ontgrendel via voetbalprofiel', category: 'sport', rarity: 'rare' },
  { id: 'neonNight', label: 'Neon Night', source: require('../assets/images/theme-neon-night.png'), locked: true, unlockLabel: 'Ontgrendel met 5 avondtrainingen', category: 'premium', rarity: 'epic' },
];