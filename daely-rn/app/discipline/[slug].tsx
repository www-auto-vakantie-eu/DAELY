import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  StatusBar,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import SharedBottomNav from '../../components/SharedBottomNav';
import { AppScreen } from '@/components/AppScreen';
import { THEMES } from '@/constants/themes';

// Local mapping for Fitness exercise thumbnails (batch 1 + batch 2 + batch 3 back)
const FITNESS_THUMBNAIL_MAP: Record<string, ImageSourcePropType> = {
  // Batch 1
  '1-1': require('@/assets/images/exercises/fitness/fitness-barbell-bench-press.png'),
  '1-2': require('@/assets/images/exercises/fitness/fitness-incline-bench-press.png'),
  '4-1': require('@/assets/images/exercises/fitness/fitness-overhead-press.png'),
  '8-1': require('@/assets/images/exercises/fitness/fitness-barbell-squat.png'),
  '6-3': require('@/assets/images/exercises/fitness/fitness-deadlift.png'),
  '1-10': require('@/assets/images/exercises/fitness/fitness-dumbbell-press.png'),
  // Batch 2 - Barbell variants
  '1-3': require('@/assets/images/exercises/fitness/fitness-decline-barbell-bench-press.png'),
  '1-4': require('@/assets/images/exercises/fitness/fitness-close-grip-bench-press.png'),
  '1-5': require('@/assets/images/exercises/fitness/fitness-wide-grip-bench-press.png'),
  '1-6': require('@/assets/images/exercises/fitness/fitness-reverse-grip-bench-press.png'),
  '1-7': require('@/assets/images/exercises/fitness/fitness-paused-bench-press.png'),
  '1-8': require('@/assets/images/exercises/fitness/fitness-tempo-bench-press.png'),
  '1-9': require('@/assets/images/exercises/fitness/fitness-spoto-press.png'),
  '1-30': require('@/assets/images/exercises/fitness/fitness-svend-press.png'),
  // Batch 2 - Dumbbell variants
  '1-11': require('@/assets/images/exercises/fitness/fitness-incline-dumbbell-press.png'),
  '1-12': require('@/assets/images/exercises/fitness/fitness-decline-dumbbell-press.png'),
  '1-13': require('@/assets/images/exercises/fitness/fitness-neutral-grip-dumbbell-press.png'),
  '1-14': require('@/assets/images/exercises/fitness/fitness-single-arm-dumbbell-press.png'),
  '1-15': require('@/assets/images/exercises/fitness/fitness-dumbbell-fly.png'),
  '1-16': require('@/assets/images/exercises/fitness/fitness-incline-dumbbell-fly.png'),
  // Batch 2 - Machine variants
  '1-17': require('@/assets/images/exercises/fitness/fitness-machine-chest-press.png'),
  '1-18': require('@/assets/images/exercises/fitness/fitness-incline-machine-press.png'),
  '1-19': require('@/assets/images/exercises/fitness/fitness-hammer-strength-chest-press.png'),
  '1-20': require('@/assets/images/exercises/fitness/fitness-machine-pec-fly.png'),
  // Batch 2 - Cable variants
  '1-21': require('@/assets/images/exercises/fitness/fitness-cable-chest-fly.png'),
  '1-22': require('@/assets/images/exercises/fitness/fitness-cable-crossover.png'),
  '1-23': require('@/assets/images/exercises/fitness/fitness-low-to-high-cable-fly.png'),
  '1-24': require('@/assets/images/exercises/fitness/fitness-high-to-low-cable-fly.png'),
  // Batch 2 - Bodyweight variants
  '1-25': require('@/assets/images/exercises/fitness/fitness-push-up.png'),
  '1-26': require('@/assets/images/exercises/fitness/fitness-wide-push-up.png'),
  '1-27': require('@/assets/images/exercises/fitness/fitness-decline-push-up.png'),
  '1-28': require('@/assets/images/exercises/fitness/fitness-ring-push-up.png'),
  '1-29': require('@/assets/images/exercises/fitness/fitness-chest-dips.png'),
  // Batch 3 - Bovenrug (Back)
  '5-1': require('@/assets/images/exercises/fitness/fitness-pull-up.png'),
  '5-2': require('@/assets/images/exercises/fitness/fitness-chin-up.png'),
  '5-5': require('@/assets/images/exercises/fitness/fitness-lat-pulldown-wide-grip.png'),
  '5-6': require('@/assets/images/exercises/fitness/fitness-lat-pulldown-neutral-grip.png'),
  '5-7': require('@/assets/images/exercises/fitness/fitness-single-arm-lat-pulldown.png'),
  '5-8': require('@/assets/images/exercises/fitness/fitness-chest-supported-row.png'),
  '5-9': require('@/assets/images/exercises/fitness/fitness-barbell-bent-over-row.png'),
  '5-11': require('@/assets/images/exercises/fitness/fitness-t-bar-row.png'),
  '5-12': require('@/assets/images/exercises/fitness/fitness-seated-cable-row.png'),
  '5-14': require('@/assets/images/exercises/fitness/fitness-single-arm-dumbbell-row.png'),
  '5-18': require('@/assets/images/exercises/fitness/fitness-straight-arm-pulldown.png'),
  '5-19': require('@/assets/images/exercises/fitness/fitness-face-pull.png'),
  '5-27': require('@/assets/images/exercises/fitness/fitness-seal-row.png'),
  // Batch 3 - Onderrug (Lower Back)
  '6-8': require('@/assets/images/exercises/fitness/fitness-back-extension.png'),
  '6-28': require('@/assets/images/exercises/fitness/fitness-dumbbell-pullover.png'),
  // Batch 4 - Biceps
  '2-1': require('@/assets/images/exercises/fitness/fitness-barbell-curl.png'),
  '2-2': require('@/assets/images/exercises/fitness/fitness-ez-bar-curl.png'),
  '2-3': require('@/assets/images/exercises/fitness/fitness-wide-grip-ez-curl.png'),
  '2-4': require('@/assets/images/exercises/fitness/fitness-close-grip-ez-curl.png'),
  '2-5': require('@/assets/images/exercises/fitness/fitness-spider-curl.png'),
  '2-6': require('@/assets/images/exercises/fitness/fitness-preacher-curl.png'),
  '2-7': require('@/assets/images/exercises/fitness/fitness-reverse-curl.png'),
  '2-8': require('@/assets/images/exercises/fitness/fitness-drag-curl.png'),
  '2-9': require('@/assets/images/exercises/fitness/fitness-behind-the-back-barbell-curl.png'),
  '2-10': require('@/assets/images/exercises/fitness/fitness-incline-dumbbell-curl.png'),
  '2-11': require('@/assets/images/exercises/fitness/fitness-alternating-dumbbell-curl.png'),
  '2-12': require('@/assets/images/exercises/fitness/fitness-hammer-curl.png'),
  '2-13': require('@/assets/images/exercises/fitness/fitness-cross-body-hammer-curl.png'),
  '2-14': require('@/assets/images/exercises/fitness/fitness-concentration-curl.png'),
  '2-15': require('@/assets/images/exercises/fitness/fitness-seated-dumbbell-curl.png'),
  '2-16': require('@/assets/images/exercises/fitness/fitness-zottman-curl.png'),
  '2-17': require('@/assets/images/exercises/fitness/fitness-machine-biceps-curl.png'),
  '2-18': require('@/assets/images/exercises/fitness/fitness-cable-curl.png'),
  '2-19': require('@/assets/images/exercises/fitness/fitness-rope-hammer-curl.png'),
  '2-20': require('@/assets/images/exercises/fitness/fitness-single-arm-cable-curl.png'),
  '2-21': require('@/assets/images/exercises/fitness/fitness-high-cable-curl.png'),
  '2-22': require('@/assets/images/exercises/fitness/fitness-bayesian-cable-curl.png'),
  '2-23': require('@/assets/images/exercises/fitness/fitness-chin-up-supinated-grip.png'),
  '2-24': require('@/assets/images/exercises/fitness/fitness-ring-chin-up.png'),
  '2-25': require('@/assets/images/exercises/fitness/fitness-towel-chin-up.png'),
  '2-26': require('@/assets/images/exercises/fitness/fitness-band-biceps-curl.png'),
  '2-27': require('@/assets/images/exercises/fitness/fitness-isometric-curl-hold.png'),
  '2-28': require('@/assets/images/exercises/fitness/fitness-tempo-curl.png'),
  '2-29': require('@/assets/images/exercises/fitness/fitness-21s-biceps-curl.png'),
  '2-30': require('@/assets/images/exercises/fitness/fitness-preacher-machine-curl.png'),
  // Triceps
  '3-1': require('@/assets/images/exercises/fitness/fitness-close-grip-bench-press.png'),
  '3-2': require('@/assets/images/exercises/fitness/fitness-skull-crusher.png'),
  '3-3': require('@/assets/images/exercises/fitness/fitness-ez-bar-skull-crusher.png'),
  '3-4': require('@/assets/images/exercises/fitness/fitness-jm-press.png'),
  '3-5': require('@/assets/images/exercises/fitness/fitness-dumbbell-overhead-triceps-extension.png'),
  '3-6': require('@/assets/images/exercises/fitness/fitness-single-arm-overhead-dumbbell-extension.png'),
  '3-7': require('@/assets/images/exercises/fitness/fitness-dumbbell-kickback.png'),
  '3-8': require('@/assets/images/exercises/fitness/fitness-rolling-dumbbell-extension.png'),
  '3-9': require('@/assets/images/exercises/fitness/fitness-cable-rope-pushdown.png'),
  '3-10': require('@/assets/images/exercises/fitness/fitness-straight-bar-pushdown.png'),
  '3-11': require('@/assets/images/exercises/fitness/fitness-reverse-grip-pushdown.png'),
  '3-12': require('@/assets/images/exercises/fitness/fitness-single-arm-cable-pushdown.png'),
  '3-13': require('@/assets/images/exercises/fitness/fitness-overhead-rope-extension.png'),
  '3-14': require('@/assets/images/exercises/fitness/fitness-overhead-cable-extension.png'),
  '3-15': require('@/assets/images/exercises/fitness/fitness-cross-body-cable-extension.png'),
  '3-16': require('@/assets/images/exercises/fitness/fitness-machine-triceps-extension.png'),
  '3-17': require('@/assets/images/exercises/fitness/fitness-bench-dips.png'),
  '3-18': require('@/assets/images/exercises/fitness/fitness-parallel-bar-dips.png'),
  '3-19': require('@/assets/images/exercises/fitness/fitness-ring-dips.png'),
  '3-20': require('@/assets/images/exercises/fitness/fitness-diamond-push-up.png'),
  '3-21': require('@/assets/images/exercises/fitness/fitness-close-push-up.png'),
  '3-22': require('@/assets/images/exercises/fitness/fitness-bodyweight-triceps-extension.png'),
  '3-23': require('@/assets/images/exercises/fitness/fitness-band-pushdown.png'),
  '3-24': require('@/assets/images/exercises/fitness/fitness-band-overhead-extension.png'),
  '3-25': require('@/assets/images/exercises/fitness/fitness-tate-press.png'),
  '3-26': require('@/assets/images/exercises/fitness/fitness-floor-skull-crusher.png'),
  '3-27': require('@/assets/images/exercises/fitness/fitness-paused-pushdown.png'),
  '3-28': require('@/assets/images/exercises/fitness/fitness-tempo-pushdown.png'),
  '3-29': require('@/assets/images/exercises/fitness/fitness-weighted-dips.png'),
  '3-30': require('@/assets/images/exercises/fitness/fitness-pjr-pullover.png'),
  // Shoulders
  '4-2': require('@/assets/images/exercises/fitness/fitness-push-press.png'),
  '4-3': require('@/assets/images/exercises/fitness/fitness-seated-barbell-press.png'),
  '4-4': require('@/assets/images/exercises/fitness/fitness-behind-the-neck-press.png'),
  '4-5': require('@/assets/images/exercises/fitness/fitness-dumbbell-shoulder-press.png'),
  '4-6': require('@/assets/images/exercises/fitness/fitness-arnold-press.png'),
  '4-7': require('@/assets/images/exercises/fitness/fitness-seated-dumbbell-press.png'),
  '4-8': require('@/assets/images/exercises/fitness/fitness-single-arm-dumbbell-press.png'),
  '4-9': require('@/assets/images/exercises/fitness/fitness-dumbbell-lateral-raise.png'),
  '4-10': require('@/assets/images/exercises/fitness/fitness-cable-lateral-raise.png'),
  '4-11': require('@/assets/images/exercises/fitness/fitness-leaning-cable-lateral-raise.png'),
  '4-12': require('@/assets/images/exercises/fitness/fitness-machine-lateral-raise.png'),
  '4-13': require('@/assets/images/exercises/fitness/fitness-front-raise.png'),
  '4-14': require('@/assets/images/exercises/fitness/fitness-plate-front-raise.png'),
  '4-15': require('@/assets/images/exercises/fitness/fitness-rear-delt-fly.png'),
  '4-16': require('@/assets/images/exercises/fitness/fitness-reverse-pec-deck.png'),
  '4-17': require('@/assets/images/exercises/fitness/fitness-face-pull.png'),
  '4-18': require('@/assets/images/exercises/fitness/fitness-upright-row.png'),
  '4-19': require('@/assets/images/exercises/fitness/fitness-cable-upright-row.png'),
  '4-20': require('@/assets/images/exercises/fitness/fitness-landmine-press.png'),
  '4-21': require('@/assets/images/exercises/fitness/fitness-single-arm-landmine-press.png'),
  '4-22': require('@/assets/images/exercises/fitness/fitness-handstand-push-up.png'),
  '4-23': require('@/assets/images/exercises/fitness/fitness-pike-push-up.png'),
  '4-24': require('@/assets/images/exercises/fitness/fitness-band-lateral-raise.png'),
  '4-25': require('@/assets/images/exercises/fitness/fitness-band-pull-apart.png'),
  '4-26': require('@/assets/images/exercises/fitness/fitness-y-raise.png'),
  '4-27': require('@/assets/images/exercises/fitness/fitness-prone-rear-delt-raise.png'),
  '4-28': require('@/assets/images/exercises/fitness/fitness-cuban-press.png'),
  '4-29': require('@/assets/images/exercises/fitness/fitness-bradford-press.png'),
  '4-30': require('@/assets/images/exercises/fitness/fitness-overhead-carry.png'),
  // Batch 5 - Buik/Core
  '7-1': require('@/assets/images/exercises/fitness/fitness-crunch.png'),
  '7-2': require('@/assets/images/exercises/fitness/fitness-reverse-crunch.png'),
  '7-3': require('@/assets/images/exercises/fitness/fitness-bicycle-crunch.png'),
  '7-4': require('@/assets/images/exercises/fitness/fitness-toe-touch-crunch.png'),
  '7-5': require('@/assets/images/exercises/fitness/fitness-v-up.png'),
  '7-6': require('@/assets/images/exercises/fitness/fitness-hollow-hold.png'),
  '7-7': require('@/assets/images/exercises/fitness/fitness-dead-bug.png'),
  '7-8': require('@/assets/images/exercises/fitness/fitness-plank.png'),
  '7-9': require('@/assets/images/exercises/fitness/fitness-side-plank.png'),
  '7-10': require('@/assets/images/exercises/fitness/fitness-rkc-plank.png'),
  '7-11': require('@/assets/images/exercises/fitness/fitness-mountain-climber.png'),
  '7-12': require('@/assets/images/exercises/fitness/fitness-hanging-knee-raise.png'),
  '7-13': require('@/assets/images/exercises/fitness/fitness-hanging-leg-raise.png'),
  '7-14': require('@/assets/images/exercises/fitness/fitness-captain-chair-leg-raise.png'),
  '7-15': require('@/assets/images/exercises/fitness/fitness-ab-wheel-rollout.png'),
  '7-16': require('@/assets/images/exercises/fitness/fitness-swiss-ball-rollout.png'),
  '7-17': require('@/assets/images/exercises/fitness/fitness-cable-crunch.png'),
  '7-18': require('@/assets/images/exercises/fitness/fitness-kneeling-cable-crunch.png'),
  '7-19': require('@/assets/images/exercises/fitness/fitness-woodchopper.png'),
  '7-20': require('@/assets/images/exercises/fitness/fitness-russian-twist.png'),
  '7-21': require('@/assets/images/exercises/fitness/fitness-pallof-press.png'),
  '7-22': require('@/assets/images/exercises/fitness/fitness-decline-sit-up.png'),
  '7-23': require('@/assets/images/exercises/fitness/fitness-sit-up.png'),
  '7-24': require('@/assets/images/exercises/fitness/fitness-dragon-flag.png'),
  '7-25': require('@/assets/images/exercises/fitness/fitness-flutter-kicks.png'),
  '7-26': require('@/assets/images/exercises/fitness/fitness-scissor-kicks.png'),
  '7-27': require('@/assets/images/exercises/fitness/fitness-toe-taps.png'),
  '7-28': require('@/assets/images/exercises/fitness/fitness-jackknife-sit-up.png'),
  '7-29': require('@/assets/images/exercises/fitness/fitness-plank-shoulder-tap.png'),
  '7-30': require('@/assets/images/exercises/fitness/fitness-hollow-rock.png'), // gebruikt extra core_oefening bestand
};

type DisciplineDetail = {
  title: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  uitleg?: string;
  exercises?: unknown[];
  workouts?: unknown[];
};

const DISCIPLINE_DATA: Record<string, DisciplineDetail> = {
    // Toegevoegd: nieuwe sporten
    'wielrennen-mountainbiken': {
      title: 'Wielrennen / Mountainbiken',
      subtitle: 'Fietsen, snelheid & uithoudingsvermogen',
      icon: 'bike',
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    },
    zwemmen: {
      title: 'Zwemmen',
      subtitle: 'Techniek, kracht & conditie',
      icon: 'swim',
      heroImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    },
    roeien: {
      title: 'Roeien',
      subtitle: 'Kracht, coördinatie & teamwork',
      icon: 'rowing',
      heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    },
    triatlon: {
      title: 'Triatlon',
      subtitle: 'Combinatie van zwemmen, fietsen en hardlopen',
      icon: 'run-fast',
      heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    },
    schaatsen: {
      title: 'Schaatsen',
      subtitle: 'Snelheid, techniek & uithoudingsvermogen',
      icon: 'skate',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    voetbal: {
      title: 'Voetbal',
      subtitle: 'Techniek, teamwork & conditie',
      icon: 'soccer',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    basketbal: {
      title: 'Basketbal',
      subtitle: 'Snelheid, sprongkracht & teamwork',
      icon: 'basketball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    volleybal: {
      title: 'Volleybal',
      subtitle: 'Teamwork, sprongkracht & techniek',
      icon: 'volleyball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    handbal: {
      title: 'Handbal',
      subtitle: 'Snelheid, kracht & teamwork',
      icon: 'handball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    hockey: {
      title: 'Hockey',
      subtitle: 'Techniek, snelheid & teamwork',
      icon: 'hockey-sticks',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'rugby-american-football': {
      title: 'Rugby / American football',
      subtitle: 'Kracht, strategie & teamwork',
      icon: 'football',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    racketsporten: {
      title: 'Racketsporten',
      subtitle: 'Tennis, padel, badminton, squash & tafeltennis',
      icon: 'tennis',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
      uitleg: 'Racketsporten zijn dynamische sporten waarbij techniek, snelheid en reactievermogen centraal staan. Voorbeelden zijn tennis, padel, badminton, squash en tafeltennis.',
    },
    'judo-worstelen-bjj-karate-taekwondo': {
      title: 'Judo / Worstelen / BJJ / Karate / Taekwondo',
      subtitle: 'Kracht, techniek & discipline',
      icon: 'karate',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    turnen: {
      title: 'Turnen',
      subtitle: 'Kracht, lenigheid & controle',
      icon: 'human-female-gymnastics',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'parkour-freerunning': {
      title: 'Parkour / Freerunning',
      subtitle: 'Behendigheid & explosiviteit',
      icon: 'run-fast',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'klimmen-boulderen': {
      title: 'Klimmen / Boulderen',
      subtitle: 'Kracht, techniek & coördinatie',
      icon: 'mountain',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'skien-snowboarden': {
      title: 'Skiën / Snowboarden',
      subtitle: 'Balans, techniek & uithoudingsvermogen',
      icon: 'ski',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'surfen-kitesurfen-windsurfen': {
      title: 'Surfen / Kitesurfen / Windsurfen',
      subtitle: 'Balans, kracht & techniek',
      icon: 'waves',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    golf: {
      title: 'Golf',
      subtitle: 'Techniek, precisie & focus',
      icon: 'golf',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    paardensport: {
      title: 'Paardensport',
      subtitle: 'Samenwerking & balans',
      icon: 'horse-variant',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    crossfit: {
      title: 'CrossFit',
      subtitle: 'Functionele fitness, kracht & uithoudingsvermogen',
      icon: 'dumbbell',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    },
  fitness: {
    title: 'Fitness',
    subtitle: 'Kracht & Conditie',
    icon: 'dumbbell',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  },
  hardlopen: {
    title: 'Hardlopen (Endurance)',
    subtitle: 'Lange afstanden & uithoudingsvermogen',
    icon: 'run',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
  },
  'hardlopen-agility': {
    title: 'Hardlopen (Agility)',
    subtitle: 'Snelheid, wendbaarheid & interval',
    icon: 'run-fast',
    heroImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  },
  zwaargewicht: {
    title: 'Zwaargewicht',
    subtitle: 'Powerlifting & Gewichtheffen',
    icon: 'weight-lifter',
    heroImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  },
  hyrox: {
    title: 'Hyrox',
    subtitle: 'Functionele Fitness & Racing',
    icon: 'timer-outline',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  },
  yoga: {
    title: 'Yoga',
    subtitle: 'Flexibiliteit & Mindfulness',
    icon: 'meditation',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  },
  pilates: {
    title: 'Pilates',
    subtitle: 'Core Kracht & Stabiliteit',
    icon: 'yoga',
    heroImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  },
  calisthenics: {
    title: 'Calisthenics',
    subtitle: 'Lichaamsgewicht Training',
    icon: 'human-handsup',
    heroImage: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=1200&q=80',
  },
  mobiliteit: {
    title: 'Mobiliteit',
    subtitle: 'Gewrichtsgezondheid & Beweging',
    icon: 'human-female-dance',
    heroImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80',
    exercises: [],
  },
  vechttraining: {
    title: 'Vechttraining',
    subtitle: 'Boksen, MMA & Vechtsporten',
    icon: 'boxing-glove',
    heroImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
    exercises: [],
  },
  zwangerschap: {
    title: 'Zwangerschap',
    subtitle: 'Beweging & welzijn tijdens zwangerschap',
    icon: 'baby-face-outline',
    heroImage: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80',
    uitleg: 'Blijf actief tijdens je zwangerschap met veilige, aangepaste oefeningen. Raadpleeg altijd je arts bij twijfel.',
    workouts: [
      {
        id: 'zw1',
        name: 'Zwangerschaps Yoga',
        muscle: 'Hele lichaam',
        duration: '30 min',
        level: 'Beginner',
        icon: 'meditation',
        color: '#F59E42',
        exercises: [
          { naam: 'Cat-Cow', uitleg: 'Wissel tussen holle en bolle rug op handen en knieën.' },
          { naam: 'Child’s Pose', uitleg: 'Rustige stretch voor rug en heupen.' },
          { naam: 'Side-Lying Leg Lifts', uitleg: 'Versterk je heupen en benen.' },
          { naam: 'Wall Squat', uitleg: 'Zachte squat met steun van de muur.' },
          { naam: 'Pelvic Tilts', uitleg: 'Bekken kantelen voor core-activatie.' },
          { naam: 'Breathing Practice', uitleg: 'Diepe ademhalingsoefeningen.' },
        ],
      },
      {
        id: 'zw2',
        name: 'Lichte Krachttraining',
        muscle: 'Benen · Billen · Core',
        duration: '25 min',
        level: 'Gemiddeld',
        icon: 'weight-lifter',
        color: '#2563EB',
        exercises: [
          { naam: 'Bodyweight Squats', uitleg: 'Squats zonder extra gewicht.' },
          { naam: 'Glute Bridge', uitleg: 'Heupen omhoog duwen voor bilspieren.' },
          { naam: 'Standing Calf Raises', uitleg: 'Versterk je kuiten.' },
          { naam: 'Seated Row met weerstandsband', uitleg: 'Rugspieren activeren.' },
          { naam: 'Wall Push-ups', uitleg: 'Lichte push-up tegen de muur.' },
        ],
      },
    ],
  },
  'kegel-oefeningen': {
    title: 'Kegel oefeningen',
    subtitle: 'Bekkenbodem & core training',
    icon: 'alpha-k-circle-outline',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    uitleg: 'Kegel oefeningen versterken de bekkenbodemspieren. Ideaal voor herstel na zwangerschap en voor core stabiliteit.',
    workouts: [
      {
        id: 'k1',
        name: 'Klassieke Kegels',
        muscle: 'Bekkenbodem',
        duration: '10 min',
        level: 'Beginner',
        icon: 'alpha-k-circle-outline',
        color: '#7C3AED',
        exercises: [
          { naam: 'Basis Kegel', uitleg: 'Span je bekkenbodemspieren 5 seconden aan, ontspan 5 seconden. Herhaal 10x.' },
          { naam: 'Snelle Kegels', uitleg: 'Span en ontspan je bekkenbodemspieren zo snel mogelijk, 10x.' },
          { naam: 'Lange Kegels', uitleg: 'Span je bekkenbodemspieren 10 seconden aan, ontspan 10 seconden. Herhaal 5x.' },
        ],
      },
      {
        id: 'k2',
        name: 'Geavanceerde Kegels',
        muscle: 'Bekkenbodem · Core',
        duration: '15 min',
        level: 'Gevorderd',
        icon: 'alpha-k-circle',
        color: '#2563EB',
        exercises: [
          { naam: 'Kegel met brug', uitleg: 'Voer een glute bridge uit en span je bekkenbodemspieren aan.' },
          { naam: 'Staande Kegels', uitleg: 'Doe kegels staand voor extra uitdaging.' },
          { naam: 'Kegels met ademhaling', uitleg: 'Focus op diepe ademhaling tijdens de oefening.' },
          { naam: 'Kegels op één been', uitleg: 'Span je bekkenbodemspieren aan terwijl je op één been staat.' },
        ],
      },
    ],
  },
};

// Helper to get theme-aware Aurora tokens (same as Today/Nutrition)
function getAuroraTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';

  // Theme-aware gradient for card backgrounds
  const themeGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara
        ? currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF']
        : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  return {
    auroraGradient: themeGradient,
    auroraTitle: isClassic ? '#0F172A' : (currentTheme.colors.auroraTitle || (isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : '#1E1B4B')),
    auroraSubtitle: isClassic ? '#475569' : (currentTheme.colors.auroraSubtitle || (isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : '#4A3A8C')),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
          : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara
          ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
          : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
          : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara
          ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
          : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara
          ? ['rgba(232, 208, 176, 0.38)', 'rgba(255, 255, 255, 0.05)']
          : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    auroraHighlight: currentTheme.colors.auroraHighlight || (isSahara ? '#E7C99B' : isForce ? '#EF4444' : '#6B5B95'),
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : undefined,
  };
}

export default function DisciplineScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { activeThemeId } = useAppContext();
  const { auroraGradient, auroraTitle, auroraSubtitle, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, shortcutBorderColor, shortcutShadowColor, shortcutIconBg, shortcutIconBorder } = getAuroraTokens(activeThemeId);
  const [activeTab, setActiveTab] = useState<'workouts' | 'oefeningen' | 'programmas'>('workouts');
  const [activeFilter, setActiveFilter] = useState('Alles');
  const [carouselWidth, setCarouselWidth] = useState(0);
  const discipline = DISCIPLINE_DATA[slug ?? ''];

  const headerCarouselRef = useRef<ScrollView>(null);

  const scrollToHeaderCarousel = (tab: 'workouts' | 'oefeningen' | 'programmas') => {
    if (carouselWidth === 0) return;
    const tabIndex = tab === 'workouts' ? 0 : tab === 'oefeningen' ? 1 : 2;
    headerCarouselRef.current?.scrollTo({ x: tabIndex * carouselWidth, animated: true });
  };

  const handleHeaderCarouselScroll = (event: any) => {
    if (carouselWidth === 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / carouselWidth);
    const clampedIndex = Math.max(0, Math.min(2, pageIndex));
    const tabs: ('workouts' | 'oefeningen' | 'programmas')[] = ['workouts', 'oefeningen', 'programmas'];
    const tab = tabs[clampedIndex] || 'workouts';
    setActiveTab(tab);
  };

  if (!discipline) {
    return (
      <AppScreen>
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
          <PageHeader title="Discipline" onSettingsPress={() => router.push('/(tabs)/athlete')} onSearchPress={() => router.push('/nutrition/search')} onCartPress={() => router.push('/(tabs)/cart')} />
          <View style={[styles.fallbackCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="help-circle-outline" size={48} color={theme.subtitleColor} />
            <Text style={[styles.fallbackTitle, { color: theme.titleColor }]}>Discipline niet gevonden</Text>
          <Text style={[styles.fallbackText, { color: theme.subtitleColor }]}>Deze discipline bestaat niet of is niet beschikbaar.</Text>
          <Pressable style={[styles.fallbackButton, { backgroundColor: '#2563EB' }]} onPress={() => router.push('/(tabs)/disciplines')}>
            <Text style={styles.fallbackButtonText}>Bekijk disciplines</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
    );
  }

  // Use DISCIPLINE_CONTENT for workouts
  const disciplineContent = DISCIPLINE_CONTENT[slug ?? ''];
  const workoutsForDiscipline = disciplineContent?.workouts ?? [];
  const exercisesForDiscipline = disciplineContent?.exercises ?? [];
  const programsForDiscipline = disciplineContent?.programs ?? [];
  const filterOptions =
    slug === 'kegel-oefeningen'
      ? ['Alles', 'Man', 'Vrouw']
      : ['Alles', 'Borst', 'Biceps', 'Triceps', 'Schouders', 'Bovenrug', 'Onderrug', 'Buik', 'Billen', 'Benen'];

  // Filter exercises based on activeFilter
  const filteredExercises = activeFilter === 'Alles'
    ? exercisesForDiscipline
    : exercisesForDiscipline.filter(exercise => exercise.spiergroep === activeFilter);

  return (
    <AppScreen>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ── HEADER CAROUSEL ── */}
          <View
            style={styles.headerCarouselViewport}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              if (width > 0) {
                setCarouselWidth(width);
              }
            }}
          >
            <ScrollView
              ref={headerCarouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleHeaderCarouselScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.headerCarouselContent}
            >
              {/* Workouts Header Card */}
              <Pressable
                onPress={() => { setActiveTab('workouts'); scrollToHeaderCarousel('workouts'); }}
                style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
              >
                <View style={styles.headerPage}>
                  <ImageBackground
                    source={{ uri: discipline.heroImage }}
                    style={[
                      styles.headerCard,
                      { width: (carouselWidth || Dimensions.get('window').width) - 32 }
                    ]}
                    imageStyle={styles.headerCardImage}
                  >
                  <LinearGradient
                    colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.85)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardDiscipline}>{discipline.title}</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="dumbbell" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Workouts</Text>
                        <View style={styles.headerCardCountBadge}>
                          <Text style={styles.headerCardCount}>{workoutsForDiscipline.length}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                  </ImageBackground>
                </View>
              </Pressable>

              {/* Oefeningen Header Card */}
              <Pressable
                onPress={() => { setActiveTab('oefeningen'); scrollToHeaderCarousel('oefeningen'); }}
                style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
              >
                <View style={styles.headerPage}>
                  <ImageBackground
                    source={{ uri: discipline.heroImage }}
                    style={[
                      styles.headerCard,
                      { width: (carouselWidth || Dimensions.get('window').width) - 32 }
                    ]}
                    imageStyle={styles.headerCardImage}
                  >
                  <LinearGradient
                    colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.85)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardDiscipline}>{discipline.title}</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="arm-flex" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Oefeningen</Text>
                        <View style={styles.headerCardCountBadge}>
                          <Text style={styles.headerCardCount}>{exercisesForDiscipline.length}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                  </ImageBackground>
                </View>
              </Pressable>

              {/* Programma's Header Card */}
              <Pressable
                onPress={() => { setActiveTab('programmas'); scrollToHeaderCarousel('programmas'); }}
                style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
              >
                <View style={styles.headerPage}>
                  <ImageBackground
                    source={{ uri: discipline.heroImage }}
                    style={[
                      styles.headerCard,
                      { width: (carouselWidth || Dimensions.get('window').width) - 32 }
                    ]}
                    imageStyle={styles.headerCardImage}
                  >
                  <LinearGradient
                    colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.85)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardDiscipline}>{discipline.title}</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="calendar-week" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Programma&apos;s</Text>
                        <View style={styles.headerCardCountBadge}>
                          <Text style={styles.headerCardCount}>{programsForDiscipline.length}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                  </ImageBackground>
                </View>
              </Pressable>
            </ScrollView>

            {/* Page Indicator */}
            <View style={styles.pageIndicator}>
              <View style={[styles.pageDot, activeTab === 'workouts' && styles.pageDotActive]} />
              <View style={[styles.pageDot, activeTab === 'oefeningen' && styles.pageDotActive]} />
              <View style={[styles.pageDot, activeTab === 'programmas' && styles.pageDotActive]} />
            </View>
          </View>

        {/* ── PREMIUM FILTER CHIPS ── */}
        {activeTab === 'oefeningen' && (
          <View style={[styles.filterSection, { backgroundColor: theme.background }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {filterOptions.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={({ pressed }) => [
                      styles.filterChip,
                      { borderColor: isActive ? '#2563EB' : '#E2E8F0', backgroundColor: isActive ? '#2563EB' : '#FFFFFF' },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : '#64748B' }]}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── CONTENT ── */}
        <View style={styles.contentArea}>
          {activeTab === 'workouts' && (
            <View style={{ paddingHorizontal: 16 }}>
              {workoutsForDiscipline.map((workout) => (
                <Pressable
                  key={workout.id}
                  style={({ pressed }) => [[styles.premiumCardWrapper, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }], pressed && styles.cardPressed]}
                  onPress={() => router.push({
                    pathname: '/discipline/[slug]/workout/[id]',
                    params: { slug, id: workout.id },
                  })}
                >
                  <View style={styles.premiumCardInner}>
                    {/* Background gradient - absolute full-cover */}
                    <LinearGradient
                      colors={auroraGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.premiumCardBackground}
                      pointerEvents="none"
                    >
                      {/* Top-left ribbon */}
                      <LinearGradient
                        colors={ribbonTop}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ribbonTop}
                        pointerEvents="none"
                      />
                      {/* Mid-card ribbon */}
                      <LinearGradient
                        colors={ribbonMid}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ribbonMid}
                        pointerEvents="none"
                      />
                      {/* Diagonal top-right ribbon */}
                      <LinearGradient
                        colors={ribbonBlue}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ribbonBlue}
                        pointerEvents="none"
                      />
                      {/* Diagonal bottom-left ribbon */}
                      <LinearGradient
                        colors={ribbonRose}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ribbonRose}
                        pointerEvents="none"
                      />
                      {/* Right-side accent ribbon */}
                      <LinearGradient
                        colors={ribbonRight}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ribbonRight}
                        pointerEvents="none"
                      />
                      {/* Soft white highlight overlay */}
                      <LinearGradient
                        colors={ribbonHighlight}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.ribbonHighlight}
                        pointerEvents="none"
                      />
                    </LinearGradient>
                    {/* Content layer - above background */}
                    <View style={styles.premiumCardContent}>
                      <View style={[styles.iconBadge, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                        <MaterialCommunityIcons name={workout.icon as any} size={20} color={auroraSubtitle} />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={[styles.cardTitle, { color: auroraTitle }]}>{workout.name}</Text>
                        <View style={styles.cardMeta}>
                          <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                            <MaterialCommunityIcons name="arm-flex" size={9} color={auroraSubtitle} />
                            <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{workout.muscle}</Text>
                          </View>
                          <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                            <MaterialCommunityIcons name="clock-outline" size={9} color={auroraSubtitle} />
                            <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{workout.duration}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.chevronButton, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder, shadowColor: shortcutShadowColor }]}>
                        <MaterialCommunityIcons name="chevron-right" size={16} color={auroraSubtitle} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
              {workoutsForDiscipline.length === 0 && (
                <View style={[styles.emptyState, { borderColor: '#E2E8F0' }]}>
                  <MaterialCommunityIcons name="dumbbell" size={48} color="#94A3B8" />
                  <Text style={[styles.emptyTitle, { color: '#0F172A' }]}>Workouts voor {discipline.title}</Text>
                  <Text style={[styles.emptySubtitle, { color: '#64748B' }]}>
                    Workouts voor {discipline.title} komen binnenkort beschikbaar.
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'oefeningen' && (
            <View style={{ paddingHorizontal: 16 }}>
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => {
                  const hasThumbnail = exercise.mediaItems && exercise.mediaItems.length > 0 && exercise.mediaItems[0]?.thumbnail;
                  const localThumbnail = slug === 'fitness' ? FITNESS_THUMBNAIL_MAP[exercise.id] : null;
                  return (
                    <Pressable
                      key={exercise.id}
                      style={({ pressed }) => [[styles.premiumCardWrapper, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }], pressed && styles.cardPressed]}
                      onPress={() => router.push({
                        pathname: '/exercises/[id]',
                        params: { id: exercise.id, disciplineSlug: slug },
                      })}
                    >
                      <View style={styles.premiumCardInner}>
                        {/* Background gradient - absolute full-cover */}
                        <LinearGradient
                          colors={auroraGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.premiumCardBackground}
                          pointerEvents="none"
                        >
                          {/* Top-left ribbon */}
                          <LinearGradient
                            colors={ribbonTop}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ribbonTop}
                            pointerEvents="none"
                          />
                          {/* Mid-card ribbon */}
                          <LinearGradient
                            colors={ribbonMid}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ribbonMid}
                            pointerEvents="none"
                          />
                          {/* Diagonal top-right ribbon */}
                          <LinearGradient
                            colors={ribbonBlue}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ribbonBlue}
                            pointerEvents="none"
                          />
                          {/* Diagonal bottom-left ribbon */}
                          <LinearGradient
                            colors={ribbonRose}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ribbonRose}
                            pointerEvents="none"
                          />
                          {/* Right-side accent ribbon */}
                          <LinearGradient
                            colors={ribbonRight}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ribbonRight}
                            pointerEvents="none"
                          />
                          {/* Soft white highlight overlay */}
                          <LinearGradient
                            colors={ribbonHighlight}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.ribbonHighlight}
                            pointerEvents="none"
                          />
                        </LinearGradient>
                        {/* Content layer - above background */}
                        <View style={styles.premiumCardContent}>
                          {localThumbnail ? (
                            <Image
                              source={localThumbnail}
                              style={styles.thumbnailImage}
                              resizeMode="cover"
                            />
                          ) : hasThumbnail ? (
                            <ImageBackground
                              source={{ uri: exercise.mediaItems![0].thumbnail }}
                              style={styles.thumbnailImage}
                              imageStyle={styles.thumbnailImageInner}
                            />
                          ) : (
                            <View style={[styles.thumbnailFallback, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                              <MaterialCommunityIcons name="dumbbell" size={30} color={auroraSubtitle} />
                            </View>
                          )}
                          <View style={styles.cardInfo}>
                            <Text style={[styles.cardTitle, { color: auroraTitle }]}>{exercise.name}</Text>
                            <View style={styles.cardMeta}>
                              <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                                <MaterialCommunityIcons name="human" size={10} color={auroraSubtitle} />
                                <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{exercise.spiergroep}</Text>
                              </View>
                              <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                                <MaterialCommunityIcons name="tag" size={10} color={auroraSubtitle} />
                                <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{exercise.categorie}</Text>
                              </View>
                              <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                                <MaterialCommunityIcons name="lightning-bolt" size={10} color={auroraSubtitle} />
                                <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{exercise.moeilijkheid}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={[styles.chevronButton, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder, shadowColor: shortcutShadowColor }]}>
                            <MaterialCommunityIcons name="chevron-right" size={16} color={auroraSubtitle} />
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })
              ) : (
                <View style={[styles.emptyState, { borderColor: '#E2E8F0' }]}>
                  <MaterialCommunityIcons name="dumbbell" size={48} color="#94A3B8" />
                  <Text style={[styles.emptyTitle, { color: '#0F172A' }]}>
                    {activeFilter === 'Alles' ? `Oefeningen voor ${discipline.title}` : `Geen ${activeFilter} oefeningen`}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: '#64748B' }]}>
                    {activeFilter === 'Alles'
                      ? `Oefeningen voor ${discipline.title} komen binnenkort beschikbaar.`
                      : 'Probeer een andere filter of kies "Alles".'}
                  </Text>
                  <View style={styles.emptyActionsRow}>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: '#2563EB' }]}
                      onPress={() => router.push('/tracker')}
                    >
                      <Text style={styles.emptyCtaText}>Start activiteit</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: theme.card, borderColor: '#E2E8F0' }]}
                      onPress={() => router.push('/exercises' as any)}
                    >
                      <Text style={[styles.emptyCtaTextSecondary, { color: '#0F172A' }]}>Alle oefeningen</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'programmas' && (
            <View style={{ paddingHorizontal: 16 }}>
              {programsForDiscipline.length > 0 ? (
                programsForDiscipline.map((program) => (
                  <Pressable
                    key={program.id}
                    style={({ pressed }) => [[styles.premiumCardWrapper, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }], pressed && styles.cardPressed]}
                    onPress={() => router.push({
                      pathname: '/discipline/[slug]/program/[id]',
                      params: { slug, id: program.id },
                    })}
                  >
                    <View style={styles.premiumCardInner}>
                      {/* Background gradient - absolute full-cover */}
                      <LinearGradient
                        colors={auroraGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.premiumCardBackground}
                        pointerEvents="none"
                      >
                        {/* Top-left ribbon */}
                        <LinearGradient
                          colors={ribbonTop}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ribbonTop}
                          pointerEvents="none"
                        />
                        {/* Mid-card ribbon */}
                        <LinearGradient
                          colors={ribbonMid}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ribbonMid}
                          pointerEvents="none"
                        />
                        {/* Diagonal top-right ribbon */}
                        <LinearGradient
                          colors={ribbonBlue}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ribbonBlue}
                          pointerEvents="none"
                        />
                        {/* Diagonal bottom-left ribbon */}
                        <LinearGradient
                          colors={ribbonRose}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.ribbonRose}
                          pointerEvents="none"
                        />
                        {/* Right-side accent ribbon */}
                        <LinearGradient
                          colors={ribbonRight}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ribbonRight}
                          pointerEvents="none"
                        />
                        {/* Soft white highlight overlay */}
                        <LinearGradient
                          colors={ribbonHighlight}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={styles.ribbonHighlight}
                          pointerEvents="none"
                        />
                      </LinearGradient>
                      {/* Content layer - above background */}
                      <View style={styles.premiumCardContent}>
                        <View style={[styles.iconBadge, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                          <MaterialCommunityIcons name="calendar-week" size={22} color={auroraSubtitle} />
                        </View>
                        <View style={styles.cardInfo}>
                          <Text style={[styles.cardTitle, { color: auroraTitle }]}>{program.name}</Text>
                          <View style={styles.cardMeta}>
                            <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                              <MaterialCommunityIcons name="clock-outline" size={10} color={auroraSubtitle} />
                              <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{program.duration}</Text>
                            </View>
                            <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                              <MaterialCommunityIcons name="lightning-bolt" size={10} color={auroraSubtitle} />
                              <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{program.level}</Text>
                            </View>
                            <View style={[styles.metaTag, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                              <MaterialCommunityIcons name="calendar-week" size={10} color={auroraSubtitle} />
                              <Text style={[styles.metaTagText, { color: auroraSubtitle }]}>{program.weeks} weken</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[styles.chevronButton, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder, shadowColor: shortcutShadowColor }]}>
                          <MaterialCommunityIcons name="chevron-right" size={16} color={auroraSubtitle} />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: '#E2E8F0' }]}>
                  <MaterialCommunityIcons name="clipboard-list-outline" size={48} color="#94A3B8" />
                  <Text style={[styles.emptyTitle, { color: '#0F172A' }]}>Programma&apos;s voor {discipline.title}</Text>
                  <Text style={[styles.emptySubtitle, { color: '#64748B' }]}>
                    Programma&apos;s voor {discipline.title} komen binnenkort beschikbaar.
                  </Text>
                  <View style={styles.emptyActionsRow}>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: '#F59E0B' }]}
                      onPress={() => router.push('/tracker')}
                    >
                      <Text style={styles.emptyCtaText}>Start activiteit</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: theme.card, borderColor: '#E2E8F0' }]}
                      onPress={() => router.push('/workouts')}
                    >
                      <Text style={[styles.emptyCtaTextSecondary, { color: '#0F172A' }]}>Bekijk workouts</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="disciplines" />
    </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  headerCarouselViewport: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 8,
  },
  headerCarouselContent: { gap: 0 },
  headerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
  },
  headerCardImage: { borderRadius: 28 },
  headerCardGradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerCardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backdropFilter: 'blur(8px)',
  },
  headerCardBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  headerCardTextBlock: { gap: 6, alignSelf: 'flex-start' },
  headerCardDiscipline: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  headerCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerCardTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, lineHeight: 30, color: '#FFFFFF' },
  headerCardCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backdropFilter: 'blur(8px)',
  },
  headerCardCount: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  pageIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 8, paddingBottom: 4 },
  pageDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#E2E8F0' },
  pageDotActive: { backgroundColor: '#2563EB' },
  filterSection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  filterRow: { gap: 8, paddingBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, minHeight: 40 },
  filterChipText: { fontSize: 13, fontWeight: '600' },
  contentArea: { paddingTop: 4 },
  premiumCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, borderWidth: 0, padding: 14, marginBottom: 12, gap: 12, shadowColor: '#6B5B95', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  premiumCardWrapper: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    width: '100%',
  },
  premiumCardInner: {
    position: 'relative',
    width: '100%',
  },
  premiumCardBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  premiumCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  ribbonTop: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: '170%',
    height: '90%',
    transform: [{ rotate: '15deg' }],
  },
  ribbonMid: {
    position: 'absolute',
    top: 35,
    left: -60,
    width: '160%',
    height: 90,
    transform: [{ rotate: '-10deg' }],
  },
  ribbonBlue: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: '150%',
    height: '150%',
    transform: [{ rotate: '25deg' }],
  },
  ribbonRose: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: '150%',
    height: '150%',
    transform: [{ rotate: '-20deg' }],
  },
  ribbonRight: {
    position: 'absolute',
    top: -40,
    right: -70,
    width: '140%',
    height: '120%',
    transform: [{ rotate: '-5deg' }],
  },
  ribbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thumbnailFallback: { width: 64, height: 64, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  thumbnailImage: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden', flexShrink: 0 },
  thumbnailImageInner: { borderRadius: 14 },
  iconBadge: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6, lineHeight: 22 },
  cardMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  metaTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#F8FAFC' },
  metaTagText: { fontSize: 11, fontWeight: '600' },
  chevronButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emptyState: { marginTop: 24, alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1.5, borderStyle: 'dashed', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyActionsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  emptyCtaButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, flex: 1 },
  emptyCtaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  emptyCtaTextSecondary: { fontWeight: '700', fontSize: 15 },
  fallbackCard: { marginHorizontal: 16, marginTop: 24, padding: 32, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 12 },
  fallbackTitle: { fontSize: 20, fontWeight: '700' },
  fallbackText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  fallbackButton: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  fallbackButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  workoutCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12, gap: 14 },
  workoutIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  workoutMuscle: { fontSize: 12, marginBottom: 8 },
  workoutMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '600' },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  exerciseMuscle: { fontSize: 12 },
  exerciseSets: { fontSize: 13, fontWeight: '700' },
  exerciseMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  errorText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  bottomSpacer: { height: 120 },
});
