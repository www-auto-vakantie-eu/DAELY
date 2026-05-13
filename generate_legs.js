import * as fs from 'fs';

const list = fs.readFileSync('legs_list.txt', 'utf-8');
const lines = list.split('\n').filter(l => l.trim().length > 0);

const exercises = lines.map((line, i) => {
  const name = line.replace(/^\d+\.\s*/, '').trim();
  
  let equipment = 'Bodyweight';
  let category = 'Strength Training';
  let difficulty = 'Intermediate';
  
  if (name.includes('Barbell') || name.includes('Front Squat') || name.includes('Romanian Deadlift') && !name.includes('Dumbbell')) equipment = 'Halterstang';
  if (name.includes('Dumbbell')) equipment = 'Dumbbells';
  if (name.includes('Machine') || name.includes('Leg Press') || name.includes('Leg Curl') || name.includes('Leg Extension')) equipment = 'Machine';
  if (name.includes('Bodyweight') || name.includes('Jump Squat') || name.includes('Reverse Lunges') || name.includes('Pistol Squat') || name.includes('Wall Sit') || name.includes('Curtsy Lunge')) equipment = 'Bodyweight';
  if (name.includes('Box Jumps')) equipment = 'Plyo Box';
  if (name.includes('Kettlebell')) equipment = 'Kettlebell';
  if (name.includes('Sled')) equipment = 'Sled';
  
  if (name.includes('Pistol Squat') || name.includes('Barbell Back Squat') || name.includes('Front Squat')) difficulty = 'Advanced';
  
  return `  {
    id: 'legs_25_${i + 1}',
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
    tags: ['Legs', 'Lower Body'],
    name: '${name.replace(/'/g, "\\'")}',
    muscle_groups: { primary: ['Legs'], secondary: ['Glutes', 'Calves'], stabilizers: ['Core'] },
    difficulty: '${difficulty}',
    equipment: { items: ['${equipment}'], type: '${equipment === 'Bodyweight' ? 'Bodyweight' : 'Free weights'}' },
    instruction_steps: [{ step: 1, title: 'Setup', instruction: 'Voer de oefening gecontroleerd uit.' }],
    recommended_sets_reps: [{ level: 'Beginner', recommendation: '3x10-12' }],
    media: { images: [], video: '', thumbnail: '' },
    variations: []
  }`;
});

const output = `import { Exercise } from '../types';

export const legsExercises: Exercise[] = [
${exercises.join(',\n')}
];
`;

fs.writeFileSync('data/legsData.ts', output);
console.log('Done!');
