export const MIND_CATEGORIES = [
  {
    id: 'methods',
    name: 'Kenmerkende Methoden',
    icon: 'atom-variant',
    accent: '#E07A5F',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    description: 'Klassieke en bewezen meditatievormen voor structuur en rust.',
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: 'crosshairs-gps',
    accent: '#2A9D8F',
    image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?auto=format&fit=crop&w=1600&q=80',
    description: 'Technieken voor concentratie, mentale scherpte en flow.',
  },
  {
    id: 'recovery',
    name: 'Herstel',
    icon: 'heart-pulse',
    accent: '#3D5A80',
    image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1600&q=80',
    description: 'Ontspan je zenuwstelsel en versnel herstel na stress of training.',
  },
  {
    id: 'sleep',
    name: 'Slaap',
    icon: 'weather-night',
    accent: '#355070',
    image: 'https://images.unsplash.com/photo-1455642305367-68834a7d641e?auto=format&fit=crop&w=1600&q=80',
    description: 'Avondroutines om makkelijker in slaap te vallen en dieper te slapen.',
  },
  {
    id: 'pregame',
    name: 'Pre-Game',
    icon: 'rocket-launch',
    accent: '#C44536',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
    description: 'Korte mentale activaties om sterk en zelfverzekerd te starten.',
  },
] as const;

export type MindCategory = (typeof MIND_CATEGORIES)[number];
export type MindCategoryId = MindCategory['id'];
