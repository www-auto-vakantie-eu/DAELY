import * as fs from 'fs';

const list = fs.readFileSync('biceps_list.txt', 'utf-8');
const lines = list.split('\n').filter(l => l.trim().length > 0);

const exercises = lines.map((line, i) => {
  const name = line.replace(/^\d+\.\s*/, '').trim();
  
  let equipment = 'Bodyweight';
  let category = 'Strength Training';
  let difficulty = 'Intermediate';
  
  if (name.includes('Barbell') || name.includes('EZ Bar')) equipment = 'Halterstang';
  if (name.includes('Dumbbell')) equipment = 'Dumbbells';
  if (name.includes('Cable') || name.includes('Rope')) equipment = 'Cable Station';
  if (name.includes('Machine') || name.includes('Plate Loaded')) equipment = 'Machine';
  if (name.includes('Chin-Up') || name.includes('Pull-Up')) equipment = 'Bodyweight';
  if (name.includes('TRX')) equipment = 'TRX';
  if (name.includes('Ring')) equipment = 'Gymnastic Rings';
  
  if (name.includes('Chin-Up') || name.includes('Pull-Up')) difficulty = 'Advanced';
  
  return `  {
    id: 'biceps_25_${i + 1}',
    primary_discipline: 'fitness',
    category: '${category}',
    exercise_type: 'Isolation',
    coaching_cues: [],
    common_mistakes: [],
    safety_tips: [],
    breathing: { inhale: '', exhale: '' },
    alternatives: [],
    progressions: [],
    regressions: [],
    tags: ['Biceps', 'Arms'],
    name: '${name.replace(/'/g, "\\'")}',
    muscle_groups: { primary: ['Biceps'], secondary: ['Forearms'], stabilizers: ['Core'] },
    difficulty: '${difficulty}',
    equipment: { items: ['${equipment}'], type: '${equipment === 'Bodyweight' ? 'Bodyweight' : 'Free weights'}' },
    instruction_steps: [{ step: 1, title: 'Setup', instruction: 'Voer de oefening gecontroleerd uit.' }],
    recommended_sets_reps: [{ level: 'Beginner', recommendation: '3x10-12' }],
    media: { images: [], video: '', thumbnail: '' },
    variations: []
  }`;
});

const output = `import { Exercise } from '../types';

export const bicepsExercises: Exercise[] = [
${exercises.join(',\n')}
];
`;

fs.writeFileSync('data/bicepsData.ts', output);
console.log('Done!');
