export const weightData = [
  { date: '1 Okt', weight: 80.2 },
  { date: '5 Okt', weight: 79.8 },
  { date: '10 Okt', weight: 79.5 },
  { date: '15 Okt', weight: 79.1 },
  { date: '20 Okt', weight: 78.8 },
  { date: '25 Okt', weight: 78.5 },
];

export const volumeData = [
  { name: 'Week 1', volume: 12500 },
  { name: 'Week 2', volume: 13200 },
  { name: 'Week 3', volume: 14100 },
  { name: 'Week 4', volume: 15500 },
];

export const THEMES = [
  { id: 'classic', name: 'DAELY CLASSIC', mood: 'CLEAN & CONFIDENT', primary: '#3B82F6', secondary: '#93C5FD', bg: '#FFFFFF', text: '#0F172A', variant: 'full' },
  { id: 'pulse', name: 'PULSE', mood: 'HIGH ENERGY & FOCUS', primary: '#A3E635', secondary: '#D9F99D', bg: '#0A0A0A', text: '#FFFFFF', variant: 'full' },
  { id: 'sand', name: 'SAHARA DUNE', mood: 'CALM & FRIENDLY', primary: '#C89B72', secondary: '#EED2B7', bg: '#FDF6EC', text: '#C89B72', variant: 'full' },
  { id: 'forest', name: 'FOREST', mood: 'RECOVERY & MIND', primary: '#2E7D32', secondary: '#A5D6A7', bg: '#EAF5EC', text: '#1B5E20', variant: 'full' },
  { id: 'lab', name: 'SPORT LAB', mood: 'DATA-DRIVEN PERFORMANCE', primary: '#BEF264', secondary: '#22D3EE', bg: '#0F0F12', text: '#FFFFFF', variant: 'full' },
  { id: 'pastel', name: 'PASTEL', mood: 'SOOTHING & BEGINNER-FRIENDLY', primary: '#C4B5FD', secondary: '#E0E7FF', bg: '#F8FAFC', text: '#8B5CF6', variant: 'full' },
  { id: 'luxury', name: 'PURE LUXURY', mood: 'ELEGANT & REFINED', primary: '#D4AF37', secondary: '#F5E6C8', bg: '#09090B', text: '#FFFFFF', variant: 'full' },
  { id: 'force', name: 'FORCE', mood: 'INTENSE & POWERFUL', primary: '#EF4444', secondary: '#FCA5A5', bg: '#7F1D1D', text: '#FFFFFF', variant: 'full' },
  { id: 'ember', name: 'EMBER', mood: 'FIERY & EXPLOSIVE', primary: '#FF8C00', secondary: '#FFD700', bg: '#0A0500', text: '#FFFFFF', variant: 'full' },
  { id: 'retro', name: 'RETRO SPORT', mood: 'VINTAGE INSPIRED & SPORTY', primary: '#2B3E50', secondary: '#E67E22', bg: '#FAF3E0', text: '#2B3E50', variant: 'full' },
  { id: 'zen', name: 'ZEN INK', mood: 'TRADITIONAL & SERENE', primary: '#8B0000', secondary: '#000000', bg: '#FAF9F6', text: '#000000', variant: 'full' },
];

export const EVENTS_DATA = [
  {
    id: 'mud-masters',
    name: 'Mud Masters',
    type: 'Obstacle Run',
    date: '12-14 Jun & 25-27 Sep 2026',
    location: 'Haarlemmermeer / Biddinghuizen',
    logo: 'https://cdn.prod.website-files.com/6493f3f10804578f81cc9044/654dea3ef443499d9c575616_Mud%20Masters%20logo%20transparant.svg',
    image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=2070&auto=format&fit=crop',
    description: 'Mud Masters is de grootste obstacle run van Europa! Op het modderige hindernisparcours draait alles om teamwork. Ga jij voor de uitdaging van 6, 12, 16 of 42 kilometer? Ons spectaculaire hindernisparcours is geïnspireerd op echte militaire stormbanen. Samen met je team beleef je er een onvergetelijk avontuur. Daarna is het tijd voor sterke verhalen en een koud biertje op het finishfestival. De organisatie communiceert ±60.000 finishers per jaar.',
    stats: { participants: '±60.000/jaar', type: 'OCR', difficulty: 'All Levels' }
  },
  {
    id: 'strong-viking',
    name: 'Strong Viking',
    type: 'Obstacle Run',
    date: 'Multiple Dates',
    location: 'Wijchen / Amsterdam',
    logo: 'https://strongviking.com/wp-content/uploads/2023/05/SV_logo.svg',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    description: 'Strong Viking is verkozen tot de beste obstacle run van Europa. De organisatie geeft aan 100.000+ deelnemers per jaar te hebben over hun events. Oorah!',
    stats: { participants: '100.000+/jaar', type: 'OCR', difficulty: 'All Levels' }
  },
  {
    id: 'hyrox-rotterdam',
    name: 'HYROX Rotterdam',
    type: 'Fitness Race',
    date: 'April 2025',
    location: 'Rotterdam Ahoy',
    logo: 'https://hyrox.com/wp-content/uploads/2022/03/HYROX-Logo.svg',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Één van de grootste "fitness race" events ter wereld. De editie van 2024 was volledig uitverkocht met 7.500 deelnemers. Een unieke combinatie van hardlopen en functionele workouts.',
    stats: { participants: '7.500', type: 'Fitness Race', difficulty: 'Advanced' }
  },
  {
    id: 'hyrox-utrecht',
    name: 'HYROX Utrecht',
    type: 'Fitness Race',
    date: '28-30 Nov 2025',
    location: 'Jaarbeurs Utrecht',
    logo: 'https://hyrox.com/wp-content/uploads/2022/03/HYROX-Logo.svg',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    description: 'Een grootschalig meerdaags HYROX event in de Jaarbeurs Utrecht. Bereid je voor op de ultieme indoor fitness competitie waar kracht en uithoudingsvermogen samenkomen.',
    stats: { participants: '10.000+', type: 'Fitness Race', difficulty: 'Advanced' }
  },
  {
    id: 'spartan-zandvoort',
    name: 'Spartan Race Zandvoort',
    type: 'Trifecta Weekend',
    date: '2026',
    location: 'Zandvoort',
    logo: 'https://nl.spartan.com/icons/helmet-new.svg',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop',
    description: 'Groot OCR-weekend op het strand en circuit van Zandvoort met meerdere afstanden en onderdelen (Sprint, Super, Beast). Voltooi je Trifecta in één weekend!',
    stats: { participants: '5.000+', type: 'OCR', difficulty: 'Extreme' }
  },
  {
    id: 'lowlands-throwdown',
    name: 'Lowlands Throwdown',
    type: 'Functional Fitness',
    date: '30 Okt - 1 Nov 2026',
    location: 'Eindhoven',
    logo: 'https://lowlandsthrowdown.com/wp-content/uploads/2025/07/LOWLANDS_TD_basic-blue.png',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop',
    description: 'De grootste functional fitness competitie van de Benelux. Drie dagen lang strijden de fitste atleten om de titel in Eindhoven.',
    stats: { participants: '1.000+', type: 'CrossFit', difficulty: 'Elite' }
  },
  {
    id: 'dutch-throwdown',
    name: 'The Dutch Throwdown',
    type: 'Functional Fitness',
    date: '20-21 Juni 2026',
    location: 'Maaspoort, Den Bosch',
    logo: 'https://thedutchthrowdown.nl/wp-content/uploads/2024/12/dutch-td-black-768x455.png',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Een bekende "beginner-friendly" competitie. De perfecte wedstrijd voor atleten die hun eerste stappen in de competitieve fitnesswereld willen zetten.',
    stats: { participants: '2.000+', type: 'CrossFit', difficulty: 'Beginner/Intermediate' }
  },
  {
    id: 'ifbb-nederland',
    name: 'IFBB NK Bodybuilding & Fitness',
    type: 'Bodybuilding',
    date: '20 Sept 2026',
    location: 'Schiedam / Eindhoven',
    logo: 'https://logo.clearbit.com/ifbb.com',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'De Nederlandse Kampioenschappen Bodybuilding & Fitness georganiseerd door IFBB Nederland. Inclusief de Lichtstad Open/Grand Prix in Eindhoven.',
    stats: { participants: '500+', type: 'Bodybuilding', difficulty: 'Pro/Amateur' }
  },
  {
    id: 'nk-powerliften',
    name: 'Open NK Powerliften',
    type: 'Powerlifting',
    date: '8-9 Nov 2025',
    location: 'Tilburg',
    logo: 'https://logo.clearbit.com/powerlifting.sport',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Het nationaal kampioenschap powerliften. De sterkste mannen en vrouwen van Nederland strijden in de squat, bench press en deadlift.',
    stats: { participants: '300+', type: 'Powerlifting', difficulty: 'Advanced' }
  },
  {
    id: 'nk-gewichtheffen',
    name: 'Eleiko NK Senioren Gewichtheffen',
    type: 'Weightlifting',
    date: '8 Feb 2026',
    location: 'Nederland',
    logo: 'https://logo.clearbit.com/eleiko.com',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    description: 'Het officiële NK Gewichtheffen voor senioren (15+) georganiseerd door de Nederlandse Gewichthefbond.',
    stats: { participants: '200+', type: 'Olympic Lifting', difficulty: 'Elite' }
  },
  {
    id: 'euro-muscle-show',
    name: 'Euro Muscle Show',
    type: 'Expo & Competition',
    date: '19-20 Sept 2026',
    location: 'RAI Amsterdam',
    logo: 'https://logo.clearbit.com/euromuscleshow.com',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Een 2-daags strength & fitness expo inclusief competities. De organisatie verwelkomt tienduizenden fans uit heel Europa.',
    stats: { participants: 'Tens of thousands', type: 'Expo', difficulty: 'All Levels' }
  },
  {
    id: 'festyfit',
    name: 'Festyfit',
    type: 'Festival',
    date: '27-28 Nov 2026',
    location: 'Papendal, Arnhem',
    logo: 'https://logo.clearbit.com/festyfit.nl',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    description: 'Hét fitness & lifestyle festival van Nederland op het topsportcentrum Papendal. Workshops, workouts en inspiratie.',
    stats: { participants: '5.000+', type: 'Lifestyle', difficulty: 'All Levels' }
  },
  {
    id: 'nl-actief-congres',
    name: 'NL Actief Congres',
    type: 'Conference',
    date: 'TBA',
    location: 'Papendal, Arnhem',
    logo: 'https://logo.clearbit.com/nlactief.nl',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=2070&auto=format&fit=crop',
    description: 'De jaarlijkse branchebijeenkomst voor fitnessondernemers en professionals. Netwerken, kennis delen en de toekomst van de sector bespreken.',
    stats: { participants: '1.000+', type: 'Business', difficulty: 'Professional' }
  },
  {
    id: 'hfa-european-congress',
    name: 'HFA European Congress',
    type: 'Conference',
    date: '2-3 Okt 2025',
    location: 'Beurs van Berlage, Amsterdam',
    logo: 'https://logo.clearbit.com/healthandfitness.org',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=2070&auto=format&fit=crop',
    description: 'De internationale top van de fitnessbranche komt samen in Amsterdam. Meer dan 600 industry leaders delen inzichten en strategieën.',
    stats: { participants: '600+', type: 'Business', difficulty: 'Executive' }
  },
  {
    id: 'dutch-fitness-awards',
    name: 'Dutch Fitness Awards',
    type: 'Awards',
    date: '26 Jan 2026',
    location: 'Theater Figi, Zeist',
    logo: 'https://logo.clearbit.com/dutchfitnessawards.nl',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    description: 'De landelijke branche-awards en huldigingen voor de beste fitnessclubs en personal trainers van Nederland.',
    stats: { participants: '1.000+', type: 'Awards', difficulty: 'Professional' }
  }
];

export const MIND_CATEGORIES = [
  { name: 'Signature Methods', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Rust & Stress', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' },
  { name: 'Focus & Productivity', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Sleep', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2093&auto=format&fit=crop' },
  { name: 'Recovery', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Mental Strength', image: 'https://nordicdutchman.nl/wp-content/uploads/2023/12/noorderlicht-kirkjufell-ijsland-1024x576.jpg' },
  { name: 'Energy & Motivation', image: 'https://images.unsplash.com/photo-1611002214172-792c1f90b59a?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Mindfulness', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Meditation Music', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Meditation Sounds', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop' }
];

export const SIGNATURE_METHODS = [
  {
    id: 'tony-robbins-priming',
    title: 'Tony Robbins Priming',
    author: 'Tony Robbins',
    image: 'https://storage.googleapis.com/bitnami-cs96dkm0ag.appspot.com/offeringtree-client-dev/1634299868033/Tony_Robbins.png',
    duration: '15 MINS',
    description: 'A powerful morning routine designed by Tony Robbins to adjust your thoughts and feelings, so you can live your life in a peak state.',
    videoId: 'faTGTgid8Uc',
    steps: [
      { name: 'Breathing Exercise', desc: '3 sets of 30 Kapalabhati breaths (breath of fire) with arms raising and lowering.' },
      { name: 'Gratitude', desc: 'Think of 3 things you are deeply grateful for. Feel the gratitude.' },
      { name: 'Connection', desc: 'Visualize a light coming down from the heavens, healing your body and mind.' },
      { name: 'Success Visualization', desc: 'Think of 3 goals you want to achieve. Visualize them as already done.' }
    ]
  },
  {
    id: 'vishen-lakhiani-6-phase',
    title: '6 Phase Meditation',
    author: 'Vishen Lakhiani',
    image: 'https://a.storyblok.com/f/60579/1200x628/b03a864cf5/6pm_fb-sharer_2018.jpg',
    duration: '20 MINS',
    description: 'A science-backed meditation protocol designed to enhance your mind, body, and spirit in just minutes a day.',
    videoId: 'oeQfRtiY-ZM',
    start: 604,
    steps: [
      { name: 'Phase 1: Connection', desc: 'Feel a sense of compassion and connection with all life.' },
      { name: 'Phase 2: Gratitude', desc: 'Express gratitude for your personal life, career, and yourself.' },
      { name: 'Phase 3: Forgiveness', desc: 'Let go of grudges and forgive someone who has wronged you.' },
      { name: 'Phase 4: Envisioning the Future', desc: 'Visualize your life 3 years from now in vivid detail.' },
      { name: 'Phase 5: Daily Intention', desc: 'Plan your perfect day unfolding beautifully.' },
      { name: 'Phase 6: Blessing', desc: 'Call upon a higher power to support you in your journey.' }
    ]
  },
  {
    id: 'sadhguru-isha-kriya',
    title: 'Isha Kriya',
    author: 'Sadhguru',
    image: 'https://images.unsplash.com/photo-1545389336-ea4e8fbf5a4b?q=80&w=2070&auto=format&fit=crop',
    duration: '15 MINS',
    description: 'A simple yet powerful guided meditation created by Sadhguru to bring health, dynamism, and peace.',
    videoId: 'PsKEgrx0Xwc',
    steps: [
      { name: 'Preparation', desc: 'Sit comfortably with your spine erect. Keep your hands upon your thighs, palms facing upwards.' },
      { name: 'Inhalation', desc: 'Inhale and think to yourself: "I am not the body."' },
      { name: 'Exhalation', desc: 'Exhale and think to yourself: "I am not even the mind."' },
      { name: 'Chanting', desc: 'Chant the sound "Aaa" 7 times, feeling the vibration just below the navel.' }
    ]
  },
  {
    id: 'benson-relaxation-response',
    title: 'Relaxation Response',
    author: 'Dr. Herbert Benson',
    image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2070&auto=format&fit=crop',
    duration: '20 MINS',
    description: 'A scientifically proven technique developed at Harvard Medical School to counteract the physiological effects of stress.',
    videoId: 'gAIYm6wpzw4',
    steps: [
      { name: 'Comfortable Position', desc: 'Sit quietly in a comfortable position and close your eyes.' },
      { name: 'Muscle Relaxation', desc: 'Deeply relax all your muscles, beginning at your feet and progressing up to your face.' },
      { name: 'Breathing Focus', desc: 'Breathe through your nose. Become aware of your breathing.' },
      { name: 'Repetition', desc: 'As you breathe out, say the word "one" silently to yourself. Continue for 10 to 20 minutes.' }
    ]
  },
  {
    id: 'deepak-chopra-3-min-focus',
    title: '3-Minute Meditation To Stay Focused',
    author: 'Deepak Chopra',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099&auto=format&fit=crop',
    duration: '3 MINS',
    description: 'A quick, go-to meditation led by Deepak Chopra to help you center yourself, relieve stress, and stay focused on the day ahead.',
    videoId: '4Bs0qUB3BHQ',
    steps: [
      { name: 'Settle In', desc: 'Find a comfortable seated position and gently close your eyes.' },
      { name: 'Observe', desc: 'Simply observe your breath without trying to change it.' },
      { name: 'Mantra', desc: 'Silently repeat a simple mantra or focus on the sensation of breathing.' },
      { name: 'Return', desc: 'When your mind wanders, gently bring your focus back to your breath.' }
    ]
  }
];
