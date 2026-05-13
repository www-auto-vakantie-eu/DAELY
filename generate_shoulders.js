import * as fs from 'fs';

const list = fs.readFileSync('shoulders_list.txt', 'utf-8');
const lines = list.split('\n').filter(l => l.trim().length > 0);

const exercises = lines.map((line, i) => {
  const name = line.replace(/^\d+\.\s*/, '').trim();
  
  let equipment = 'Bodyweight';
  let category = 'Strength Training';
  let difficulty = 'Intermediate';
  
  if (name.includes('Barbell') || name.includes('Military Press') || name.includes('Behind the Neck') || name.includes('Push Press')) equipment = 'Halterstang';
  if (name.includes('Dumbbell') || name.includes('Arnold Press')) equipment = 'Dumbbells';
  if (name.includes('Cable')) equipment = 'Cable Station';
  if (name.includes('Machine') || name.includes('Plate Loaded') || name.includes('Reverse Pec Deck')) equipment = 'Machine';
  if (name.includes('Handstand') || name.includes('Pike')) equipment = 'Bodyweight';
  if (name.includes('Landmine')) equipment = 'Landmine';
  if (name.includes('Resistance Band')) equipment = 'Resistance Band';
  
  if (name.includes('Handstand')) difficulty = 'Advanced';
  
  return `  {
    id: 'shoulders_25_${i + 1}',
    primary_discipline: 'fitness',
    category: '${category}',
    exercise_type: 'Compound',
    coaching_cues: [],
    common_mistakes: [],
    safety_tips: [],
    breathing: { inhale: '', exhale: '' },
    alternatives: [],
    progressions: [],
    regressions: [],
    tags: ['Shoulders', 'Delts'],
    name: '${name.replace(/'/g, "\\'")}',
    muscle_groups: { primary: ['Shoulders'], secondary: ['Triceps', 'Upper Back'], stabilizers: ['Core'] },
    difficulty: '${difficulty}',
    equipment: { items: ['${equipment}'], type: '${equipment === 'Bodyweight' ? 'Bodyweight' : 'Free weights'}' },
    instruction_steps: [{ step: 1, title: 'Setup', instruction: 'Voer de oefening gecontroleerd uit.' }],
    recommended_sets_reps: [{ level: 'Beginner', recommendation: '3x10-12' }],
    media: { images: [], video: '', thumbnail: '' },
    variations: []
  }`;
});

const output = `import { Exercise } from '../types';

export const shouldersExercises: Exercise[] = [
${exercises.join(',\n')}
];
`;

fs.writeFileSync('data/shouldersData.ts', output);
console.log('Done!');
