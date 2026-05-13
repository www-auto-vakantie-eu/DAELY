
import { Meditation, MentalProgram, EducationTopic } from '../types';

export const meditations: Meditation[] = [
  // Rust & Stress
  { id: 'm19', title: 'Anxiety Anchor', category: 'Rust & Stress', duration_min: 10, goal: 'Gronding bij overprikkeling.', image: '' },
  { id: 'm22', title: 'Cortisol Drop', category: 'Rust & Stress', duration_min: 15, goal: 'Specifieke ademhaling tegen stresshormonen.', image: '' },
  { id: 'm27', title: 'Self-Compassion Scan', category: 'Rust & Stress', duration_min: 12, goal: 'Omgaan met blessures of falen.', image: '' },
  { id: 'm28', title: 'Pressure Release', category: 'Rust & Stress', duration_min: 15, goal: 'Externe druk neutraliseren.', image: '' },
  { id: 'm29', title: 'Anger Alchemist', category: 'Rust & Stress', duration_min: 10, goal: 'Frustratie omzetten in energie.', image: '' },
  { id: 'm33', title: 'The Mountain Pose Mind', category: 'Rust & Stress', duration_min: 10, goal: 'Stabiliteit in woelige tijden.', image: '' },
  { id: 'm37', title: 'Patience Protocol', category: 'Rust & Stress', duration_min: 9, goal: 'Wanneer resultaten uitblijven.', image: '' },
  { id: 'm39', title: 'The Forgiveness Flow', category: 'Rust & Stress', duration_min: 15, goal: 'Emotionele ballast loslaten.', image: '' },
  { id: 'm42', title: 'Traffic Jam Zen', category: 'Rust & Stress', duration_min: 5, goal: 'Geduld oefenen in de auto.', image: '' },
  { id: 'm47', title: 'Wait Well', category: 'Rust & Stress', duration_min: 4, goal: 'Mindfulness tijdens wachten.', image: '' },

  // Focus & Productivity
  { id: 'm2', title: 'Deep Work Deep Dive', category: 'Focus & Productivity', duration_min: 15, goal: 'Binaurale beats voor cognitieve flow.', image: '' },
  { id: 'm4', title: 'Morning Intent', category: 'Focus & Productivity', duration_min: 8, goal: 'Doelen stellen voor de dag.', image: '' },
  { id: 'm5', title: 'Creative Spark', category: 'Focus & Productivity', duration_min: 12, goal: 'Open monitoring meditatie.', image: '' },
  { id: 'm7', title: 'Alpha Wave Alpha', category: 'Focus & Productivity', duration_min: 20, goal: 'Focusbehoud tijdens lange taken.', image: '' },
  { id: 'm8', title: 'The Observer', category: 'Focus & Productivity', duration_min: 7, goal: 'Afstand nemen van afleidende gedachten.', image: '' },
  { id: 'm20', title: 'Rainy Window Reset', category: 'Focus & Productivity', duration_min: 20, goal: 'Auditieve kalmte.', image: '' },
  { id: 'm25', title: 'The Void', category: 'Focus & Productivity', duration_min: 40, goal: 'Stilte-sessie zonder begeleiding.', image: '' },
  { id: 'm31', title: 'Digital Detox Breath', category: 'Focus & Productivity', duration_min: 8, goal: 'Loskomen van overprikkeling.', image: '' },
  { id: 'm35', title: 'Public Speaking Prep', category: 'Focus & Productivity', duration_min: 10, goal: 'Sociale angst verminderen.', image: '' },
  { id: 'm38', title: 'Mindful Eating Intro', category: 'Focus & Productivity', duration_min: 5, goal: 'Voor de maaltijd te luisteren.', image: '' },
  { id: 'm44', title: 'Pre-Call Calm', category: 'Focus & Productivity', duration_min: 2, goal: 'Stem en hartslag kalmeren.', image: '' },
  { id: 'm48', title: 'Hydration Ritual', category: 'Focus & Productivity', duration_min: 2, goal: 'Bewust drinken.', image: '' },

  // Sleep
  { id: 'm12', title: 'The Heavy Body', category: 'Sleep', duration_min: 15, goal: 'Body scan voor spierontspanning.', image: '' },
  { id: 'm13', title: 'Delta Drift', category: 'Sleep', duration_min: 30, goal: 'Inslapen na late trainingen.', image: '' },
  { id: 'm17', title: 'White Noise Woods', category: 'Sleep', duration_min: 45, goal: 'Omgevingsgeluid voor diepe slaap.', image: '' },
  { id: 'm21', title: 'The Evening Review', category: 'Sleep', duration_min: 8, goal: 'De dag afsluiten zonder stress.', image: '' },
  { id: 'm23', title: 'Lunar Breath', category: 'Sleep', duration_min: 12, goal: 'Koelende meditatie.', image: '' },
  { id: 'm50', title: 'Power Nap Guide', category: 'Sleep', duration_min: 20, goal: 'Perfect getimede middagrust.', image: '' },

  // Recovery
  { id: 'm11', title: 'NSDR (Non-Sleep Deep Rest)', category: 'Recovery', duration_min: 20, goal: 'Direct herstel van het zenuwstelsel.', image: 'https://images.unsplash.com/photo-1541781719179-45f04b162084?q=80&w=400' },
  { id: 'm14', title: 'Post-Match Decompression', category: 'Recovery', duration_min: 12, goal: 'Adrenaline verlagen.', image: '' },
  { id: 'm15', title: 'Parasympathetic Switch', category: 'Recovery', duration_min: 10, goal: 'Activeer de rust en vertering stand.', image: '' },
  { id: 'm18', title: 'Muscle Release Yoga Nidra', category: 'Recovery', duration_min: 25, goal: 'Mentale ontspanning van bindweefsel.', image: '' },
  { id: 'm24', title: 'Gratitude Grounding', category: 'Recovery', duration_min: 10, goal: 'Positieve bias training.', image: '' },
  { id: 'm32', title: 'Social Battery Recharge', category: 'Recovery', duration_min: 15, goal: 'Na drukke community events.', image: '' },
  { id: 'm36', title: 'Grief & Growth', category: 'Recovery', duration_min: 20, goal: 'Verlies verwerken en doorgaan.', image: '' },
  { id: 'm43', title: 'Office Desk Relief', category: 'Recovery', duration_min: 3, goal: 'Snelle nekmobiliteit + adem.', image: '' },
  { id: 'm45', title: 'Walking Zen', category: 'Recovery', duration_min: 10, goal: 'Mindfulness tijdens wandeling.', image: '' },
  { id: 'm49', title: 'Post-Flight Reset', category: 'Recovery', duration_min: 15, goal: 'Tegen jetlag en stijfheid.', image: '' },

  // Mental Strength
  { id: 'm1', title: 'Pre-Competition Clarity', category: 'Mental Strength', duration_min: 10, goal: 'Visualisatie van succes en focus.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400' },
  { id: 'm6', title: 'Stoic Resilience', category: 'Mental Strength', duration_min: 10, goal: 'Omgaan met tegenslag tijdens training.', image: '' },
  { id: 'm9', title: 'Tunnel Vision', category: 'Mental Strength', duration_min: 6, goal: 'Verscherpen van zintuiglijke waarneming.', image: '' },
  { id: 'm26', title: 'Impulse Control', category: 'Mental Strength', duration_min: 7, goal: 'Omgaan met verlangens.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400' },
  { id: 'm30', title: 'Confidence Catalyst', category: 'Mental Strength', duration_min: 12, goal: 'Versterken van het zelfbeeld.', image: '' },
  { id: 'm34', title: 'Inner Critic Silence', category: 'Mental Strength', duration_min: 12, goal: 'Perfectionisme temperen.', image: '' },
  { id: 'm40', title: 'Fear Facing', category: 'Mental Strength', duration_min: 12, goal: 'Comfortzone vergroten.', image: '' },
  { id: 'm46', title: 'Cold Plunge Courage', category: 'Mental Strength', duration_min: 3, goal: 'Voorbereiding op koud water.', image: '' },

  // Energy & Motivation
  { id: 'm10', title: 'Pre-Workout Ignition', category: 'Energy & Motivation', duration_min: 5, goal: 'Psychologische energy up-regulation.', image: '' },

  // Mindfulness
  { id: 'm3', title: 'The Zone Breath', category: 'Mindfulness', duration_min: 5, goal: 'Box-breathing voor onmiddellijke kalmte.', image: '' },
  { id: 'm16', title: 'Ocean Breath Flow', category: 'Mindfulness', duration_min: 15, goal: 'Kalmeren van hartslag.', image: '' },
  { id: 'm41', title: '60-Second Reset', category: 'Mindfulness', duration_min: 1, goal: 'Noodknop bij paniek.', image: '' },

  // Meditation Music
  // (Empty for now, can be populated later)

  // Meditation Sounds
  // (Empty for now, can be populated later)
];

export const mentalPrograms: MentalProgram[] = [
  { id: 'mp1', name: 'The Unstoppable Mind', duration_weeks: 4, objective: 'Discipline & Grit', description: 'Ontwikkel de discipline van een elite atleet.', topics: [] },
  { id: 'mp2', name: 'Stress Mastery', duration_weeks: 6, objective: 'Resilience', description: 'Van chronische stress naar veerkracht.', topics: [] },
  { id: 'mp3', name: 'The Sleep Engine', duration_weeks: 3, objective: 'Recovery Architecture', description: 'Slaaphygiëne en neurologische herprogrammering.', topics: [] },
  { id: 'mp4', name: 'Peak Performance Visualisation', duration_weeks: 2, objective: 'Victory mapping', description: 'Technieken van topsporters om succes te borgen.', topics: [] },
  { id: 'mp5', name: 'Mindful Nutrition', duration_weeks: 4, objective: 'Fuel relationship', description: 'Relatie met eten herstellen voor optimale prestaties.', topics: [] },
  { id: 'mp6', name: 'Focus Architecture', duration_weeks: 3, objective: 'Concentration', description: 'Concentratievermogen in een digitale wereld.', topics: [] },
  { id: 'mp7', name: 'The Resilience Path', duration_weeks: 8, objective: 'Trauma to Power', description: 'Trauma en tegenslag omzetten in pure kracht.', topics: [] },
  { id: 'mp8', name: 'Ego Dissolution', duration_weeks: 4, objective: 'Internal Validation', description: 'Leren trainen zonder afhankelijk te zijn van externe validatie.', topics: [] },
  { id: 'mp9', name: 'Breathwork Expert', duration_weeks: 5, objective: 'CO2 Tolerance', description: 'Beheersing van CO2-tolerantie en ademhaling.', topics: [] },
  { id: 'mp10', name: 'The Creative Athlete', duration_weeks: 3, objective: 'Output Balance', description: 'Balans tussen fysieke inspanning en mentale output.', topics: [] },
];

export const mindEducation: EducationTopic[] = [
  { id: 'm_ed1', discipline_id: 'mind', title: 'Neuroplasticiteit', content: 'Je brein is als een spier: het past zich aan aan de prikkels die je het geeft.' },
];
