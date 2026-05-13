import * as fs from 'fs';

const workoutsStr = fs.readFileSync('new_workouts.json', 'utf-8');
const workouts = JSON.parse(workoutsStr);

let fitnessData = fs.readFileSync('data/fitnessData.ts', 'utf-8');

// Convert workouts to string format
const workoutsString = workouts.map(w => {
  return `  { id: '${w.id}', discipline_id: '${w.discipline_id}', name: '${w.name}', duration_min: ${w.duration_min}, difficulty: '${w.difficulty}', goal: '${w.goal}', exercises: ${JSON.stringify(w.exercises).replace(/"/g, "'")}, rest_between_sets_sec: ${w.rest_between_sets_sec} }`;
}).join(',\n');

fitnessData = fitnessData.replace(
  /export const fitnessWorkouts: Workout\[\] = \[\n  \{ id: 'f_w1'.*\n\];/,
  `export const fitnessWorkouts: Workout[] = [\n  { id: 'f_w1', discipline_id: 'fitness', name: 'DAELY Foundation I', duration_min: 45, difficulty: 'Beginner', goal: 'Building Base', exercises: fitnessExercises.slice(0, 8).map(ex => ({ exercise_id: ex.id, sets: 3, reps: '10', rest_sec: 60 })), rest_between_sets_sec: 60 },\n${workoutsString}\n];`
);

fs.writeFileSync('data/fitnessData.ts', fitnessData);
console.log('Done!');
