import { MindCategoryId } from '@/constants/mind-categories';

export interface MindProgram {
  id: string;
  title: string;
  minutes: number;
  sessions: number;
  image: string;
  description: string;
  categories: MindCategoryId[];
  steps?: string[];
}

export const MIND_PROGRAMS: MindProgram[] = [
  {
    id: 'tony-robbins-priming',
    title: 'Tony Robbins - Priming',
    minutes: 11,
    sessions: 12,
    image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1600&q=80',
    description: 'Energieke visualisatie en ademhaling om je staat in enkele minuten te verhogen, focus te scherpen en intentie te zetten voor je dag of training.',
    categories: ['methods', 'focus', 'pregame'],
    steps: [
      'Start met 60 seconden krachtige ademhaling door de neus met een rechte houding.',
      'Breng aandacht naar 3 dingen waar je oprecht dankbaar voor bent.',
      'Visualiseer 1 specifieke uitkomst die je vandaag wilt neerzetten.',
      'Veranker de emotie: voel kracht, vertrouwen en energie in je lichaam.',
      'Sluit af met een heldere intentie in 1 zin en stap direct in actie.',
    ],
  },
  {
    id: 'wim-hof-method',
    title: 'Wim Hof Methode',
    minutes: 14,
    sessions: 10,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
    description: 'Ademhalingsrondes met gecontroleerde retentie gevolgd door herstelademhaling, gericht op veerkracht, stressregulatie en mentale helderheid.',
    categories: ['methods', 'recovery'],
    steps: [
      'Ga zitten of liggen en ontspan je schouders en kaak.',
      'Doe 30 tot 40 diepe ademhalingen: volledig in, ontspannen uit.',
      'Na de laatste uitademing houd je de adem rustig vast zolang comfortabel.',
      'Adem diep in en houd 15 seconden vast als herstelademhaling.',
      'Herhaal 3 rondes en eindig met 2 minuten rustige neusademhaling.',
    ],
  },
  {
    id: 'vishen-lakhiani-6-phase',
    title: 'Vishen Lakhiani - 6 Phase',
    minutes: 21,
    sessions: 8,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    description: 'Gestructureerde 6-fasen meditatie met compassie, dankbaarheid, vergeving, toekomstvisie, intentie en zegeningen voor krachtige mentale priming.',
    categories: ['methods', 'focus', 'sleep'],
    steps: [
      'Fase 1 - Compassie: stuur warme aandacht naar jezelf en anderen.',
      'Fase 2 - Dankbaarheid: benoem 3 concrete momenten waar je dankbaar voor bent.',
      'Fase 3 - Vergeving: laat spanning los rond een persoon of situatie.',
      'Fase 4 - Toekomstvisie: zie je ideale 3-jaars toekomst levendig voor je.',
      'Fase 5 - Perfecte dag: visualiseer hoe vandaag optimaal verloopt.',
      'Fase 6 - Zegeningen: vraag kracht en helderheid voor jezelf en je omgeving.',
    ],
  },
  {
    id: 'stress-reset-breathing',
    title: 'Stress Reset Ademhaling',
    minutes: 12,
    sessions: 14,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    description: 'Korte ademhalingsflow om spanning snel te verlagen en focus te herstellen.',
    categories: ['methods', 'recovery', 'focus'],
  },
  {
    id: 'deep-sleep-winddown',
    title: 'Deep Sleep Winddown',
    minutes: 20,
    sessions: 10,
    image: 'https://images.unsplash.com/photo-1455642305367-68834a7d641e?auto=format&fit=crop&w=1600&q=80',
    description: 'Avondroutine voor rust in je zenuwstelsel en betere slaapkwaliteit.',
    categories: ['methods', 'sleep', 'recovery'],
  },
  {
    id: 'laser-focus-flow',
    title: 'Laser Focus Flow',
    minutes: 10,
    sessions: 18,
    image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?auto=format&fit=crop&w=1600&q=80',
    description: 'Mentale activatie om afleiding te verminderen en concentratie op te bouwen.',
    categories: ['focus', 'pregame'],
  },
  {
    id: 'calm-recovery-bodyscan',
    title: 'Calm Recovery Bodyscan',
    minutes: 15,
    sessions: 9,
    image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1600&q=80',
    description: 'Herstelgerichte bodyscan om stress te ontladen en herstel te versnellen.',
    categories: ['recovery', 'methods'],
  },
  {
    id: 'confidence-primer',
    title: 'Confidence Primer',
    minutes: 8,
    sessions: 13,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
    description: 'Korte mentale activatie om met meer zekerheid je training in te gaan.',
    categories: ['pregame', 'focus'],
  },
  {
    id: 'mobility-mind-connection',
    title: 'Mobility Mind Connect',
    minutes: 14,
    sessions: 11,
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1600&q=80',
    description: 'Combinatie van focus en zachte beweging om lichaam en geest te synchroniseren.',
    categories: ['methods', 'recovery', 'focus'],
  },
];
