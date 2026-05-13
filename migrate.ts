import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('Data.ts') && !['seedData.ts', 'challengesData.ts', 'mindData.ts', 'nutritionData.ts'].includes(f));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the exercise arrays
  const exerciseRegex = /export const [a-zA-Z]+Exercises: Exercise\[\] = \[([\s\S]*?)\];/g;
  
  content = content.replace(exerciseRegex, (match, arrayContent) => {
    // We need to parse the array content. It's a string of objects.
    // This is risky with regex. Let's try to do a simple string replacement.
    
    // Replace muscle_group: '...' with muscle_groups: { primary: ['...'], secondary: [], stabilizers: [] }
    let newArrayContent = arrayContent.replace(/muscle_group:\s*'([^']+)'/g, "muscle_groups: { primary: ['$1'], secondary: [], stabilizers: [] }");
    
    // Replace equipment: ['...'] with equipment: { items: ['...'], type: 'Free weights' }
    newArrayContent = newArrayContent.replace(/equipment:\s*\[([^\]]*)\]/g, "equipment: { items: [$1], type: 'Free weights' }");
    
    // Replace explanation: '...' with instruction_steps: [{ step: 1, title: 'Setup', instruction: '...' }]
    newArrayContent = newArrayContent.replace(/explanation:\s*'([^']+)'/g, "instruction_steps: [{ step: 1, title: 'Setup', instruction: '$1' }]");
    
    // Replace sets_reps_suggested: '...' with recommended_sets_reps: [{ level: 'Beginner', recommendation: '...' }]
    newArrayContent = newArrayContent.replace(/sets_reps_suggested:\s*'([^']+)'/g, "recommended_sets_reps: [{ level: 'Beginner', recommendation: '$1' }]");
    
    // Replace thumbnail: '...' with media: { images: [], video: '', thumbnail: '...' }
    newArrayContent = newArrayContent.replace(/thumbnail:\s*'([^']*)'/g, "media: { images: [], video: '', thumbnail: '$1' }");
    
    // Add missing fields
    newArrayContent = newArrayContent.replace(/discipline_id:\s*'([^']+)'/g, "primary_discipline: '$1', category: 'Strength Training', exercise_type: 'Compound', coaching_cues: [], common_mistakes: [], safety_tips: [], breathing: { inhale: '', exhale: '' }, alternatives: [], progressions: [], regressions: [], tags: []");
    
    return match.replace(arrayContent, newArrayContent);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
});
