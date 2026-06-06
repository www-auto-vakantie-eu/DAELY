export type TodayQuote = {
  id: string;
  text: string;
  author?: string;
  category: 'general' | 'discipline' | 'mindset' | 'recovery' | 'performance' | 'nutrition' | 'community';
  sourceType: 'daely_original' | 'athlete' | 'coach' | 'public_person' | 'brand';
  status: 'safe' | 'needs_verification' | 'licensed';
};

export const TODAY_QUOTES: TodayQuote[] = [
  {
    id: '1',
    text: 'Vandaag hoeft niet perfect te zijn. Wel bewust, actief en beter dan gisteren.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '2',
    text: 'Kleine keuzes bouwen grote progressie.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '3',
    text: 'Train slim, herstel goed, blijf bouwen.',
    category: 'performance',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '4',
    text: 'Je hoeft niet alles te doen. Wel het juiste.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '5',
    text: 'Elke dag telt, ook de rustige.',
    category: 'general',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '6',
    text: 'Progressie begint met verschijnen.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '7',
    text: 'Vandaag is een nieuwe kans om ritme te bouwen.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '8',
    text: 'Sterker worden begint met consistent blijven.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '9',
    text: 'Win vandaag op discipline, niet op motivatie.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '10',
    text: 'Rust is geen pauze van progressie. Het is onderdeel ervan.',
    category: 'recovery',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '11',
    text: 'Focus op het proces, niet alleen op het resultaat.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '12',
    text: 'Een slechte dag is geen slechte leven.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '13',
    text: 'Bouw kracht voor het moment dat je het nodig hebt.',
    category: 'performance',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '14',
    text: 'Succes is de som van kleine inspanningen, herhaald dag in dag uit.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '15',
    text: 'Je lichaam is je thuis. Behandel het met respect.',
    category: 'recovery',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '16',
    text: 'Geduld is niet wachten. Geduld is blijven werken terwijl je wacht.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '17',
    text: 'De enige slechte workout is degene die je niet doet.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '18',
    text: 'Energie komt van actie, niet van denken.',
    category: 'performance',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '19',
    text: 'Start waar je bent, met wat je hebt.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '20',
    text: 'Consistentie wint van intensiteit.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '21',
    text: 'Vandaag is de dag om jezelf te zijn, niet om iemand anders.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '22',
    text: 'Je kunt niet terug in de tijd, maar je kunt opnieuw beginnen.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '23',
    text: 'Groei gebeurt buiten je comfortzone.',
    category: 'performance',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '24',
    text: 'Een goede routine is beter dan een goede training.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '25',
    text: 'Luister naar je lichaam. Het vertelt je wat je nodig hebt.',
    category: 'recovery',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '26',
    text: 'Focus op wat je kunt controleren, niet op wat je niet kunt.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '27',
    text: 'Resultaten volgen gewoontes, niet motivatie.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '28',
    text: 'Je bent sterker dan je denkt.',
    category: 'mindset',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '29',
    text: 'Vandaag is een kans om beter te worden dan gisteren.',
    category: 'general',
    sourceType: 'daely_original',
    status: 'safe',
  },
  {
    id: '30',
    text: 'Bouw je dag rond gewoontes die je vooruit helpen.',
    category: 'discipline',
    sourceType: 'daely_original',
    status: 'safe',
  },
];

// Placeholder voor bekende quotes (niet live gebruiken)
export const KNOWN_QUOTES_PENDING_VERIFICATION: TodayQuote[] = [];