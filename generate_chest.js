import * as fs from 'fs';

const list = fs.readFileSync('chest_list.txt', 'utf-8');
const lines = list.split('\n').filter(l => l.trim().length > 0);

const exercises = lines.map((line, i) => {
  const name = line.replace(/^\d+\.\s*/, '').trim();
  
  let equipment = 'Bodyweight';
  let category = 'Strength Training';
  let difficulty = 'Intermediate';
  
  if (name.includes('Barbell') || name.includes('Bench Press') || name.includes('Floor Press')) equipment = 'Halterstang';
  if (name.includes('Dumbbell')) equipment = 'Dumbbells';
  if (name.includes('Machine') || name.includes('Pec Deck') || name.includes('Hammer Strength')) equipment = 'Machine';
  if (name.includes('Cable') || name.includes('Crossover')) equipment = 'Cable Station';
  if (name.includes('Push-Up') || name.includes('Dips') || name.includes('Planche')) equipment = 'Bodyweight';
  if (name.includes('Ring')) equipment = 'Rings';
  if (name.includes('Landmine')) equipment = 'Landmine';
  if (name.includes('Kettlebell')) equipment = 'Kettlebells';
  if (name.includes('Medicine Ball')) equipment = 'Medicine Ball';
  if (name.includes('Band') || name.includes('Slingshot')) equipment = 'Resistance Band';
  if (name.includes('Plate')) equipment = 'Weight Plate';
  if (name.includes('Chain')) equipment = 'Chains';
  
  if (i >= 40 && i < 70) difficulty = 'Advanced';
  if (i >= 90) difficulty = 'Advanced';
  
  return `  {
    id: 'chest_100_${i + 1}',
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
    tags: ['Chest'],
    name: '${name.replace(/'/g, "\\'")}',
    muscle_groups: { primary: ['Chest'], secondary: ['Triceps', 'Shoulders'], stabilizers: ['Core'] },
    difficulty: '${difficulty}',
    equipment: { items: ['${equipment}'], type: '${equipment === 'Bodyweight' ? 'Bodyweight' : 'Free weights'}' },
    instruction_steps: [{ step: 1, title: 'Setup', instruction: 'Voer de oefening gecontroleerd uit.' }],
    recommended_sets_reps: [{ level: 'Beginner', recommendation: '3x10-12' }],
    media: { images: [], video: '', thumbnail: '' },
    variations: []
  }`;
});

const output = `import { Exercise } from '../types';

export const chest100Exercises: Exercise[] = [
${exercises.join(',\n')}
];
`;

fs.writeFileSync('data/chest100Data.ts', output);
console.log('Done!');
