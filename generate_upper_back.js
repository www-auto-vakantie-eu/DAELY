import * as fs from 'fs';

const list = fs.readFileSync('upper_back_list.txt', 'utf-8');
const lines = list.split('\n').filter(l => l.trim().length > 0);

const exercises = lines.map((line, i) => {
  const name = line.replace(/^\d+\.\s*/, '').trim();
  
  let equipment = 'Bodyweight';
  let category = 'Strength Training';
  let difficulty = 'Intermediate';
  
  if (name.includes('Barbell') || name.includes('Pendlay') || name.includes('Yates') || name.includes('Seal Row')) equipment = 'Halterstang';
  if (name.includes('Dumbbell') || name.includes('Renegade')) equipment = 'Dumbbells';
  if (name.includes('Machine') || name.includes('Hammer Strength') || name.includes('Pec Deck') || name.includes('Plate Loaded')) equipment = 'Machine';
  if (name.includes('Cable') || name.includes('Face Pull')) equipment = 'Cable Station';
  if (name.includes('Pull-Up') || name.includes('Inverted Row')) equipment = 'Bodyweight';
  if (name.includes('TRX')) equipment = 'TRX';
  if (name.includes('Ring')) equipment = 'Rings';
  
  if (i >= 20) difficulty = 'Advanced'; // Pull-ups and bodyweight rows can be harder
  
  return `  {
    id: 'upper_back_25_${i + 1}',
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
    tags: ['Upper Back', 'Back'],
    name: '${name.replace(/'/g, "\\'")}',
    muscle_groups: { primary: ['Back'], secondary: ['Biceps', 'Rear Delts'], stabilizers: ['Core'] },
    difficulty: '${difficulty}',
    equipment: { items: ['${equipment}'], type: '${equipment === 'Bodyweight' ? 'Bodyweight' : 'Free weights'}' },
    instruction_steps: [{ step: 1, title: 'Setup', instruction: 'Voer de oefening gecontroleerd uit.' }],
    recommended_sets_reps: [{ level: 'Beginner', recommendation: '3x10-12' }],
    media: { images: [], video: '', thumbnail: '' },
    variations: []
  }`;
});

const output = `import { Exercise } from '../types';

export const upperBackExercises: Exercise[] = [
${exercises.join(',\n')}
];
`;

fs.writeFileSync('data/upperBackData.ts', output);
console.log('Done!');
