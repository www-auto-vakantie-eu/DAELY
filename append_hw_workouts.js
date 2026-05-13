import * as fs from 'fs';

const workoutsStr = fs.readFileSync('new_hw_workouts.json', 'utf-8');
const workouts = JSON.parse(workoutsStr);

let hwData = fs.readFileSync('data/heavyweightData.ts', 'utf-8');

// Convert workouts to string format
const workoutsString = workouts.map(w => {
  return `  { id: '${w.id}', discipline_id: '${w.discipline_id}', name: '${w.name}', duration_min: ${w.duration_min}, difficulty: '${w.difficulty}', goal: '${w.goal}', exercises: ${JSON.stringify(w.exercises).replace(/"/g, "'")}, rest_between_sets_sec: ${w.rest_between_sets_sec} }`;
}).join(',\n');

hwData = hwData.replace(
  /export const heavyweightWorkouts: Workout\[\] = \[\n  \{ id: 'hw_w1'.*\n  \{ id: 'hw_w2'.*\n  \{ id: 'hw_w3'.*\n\];/,
  `export const heavyweightWorkouts: Workout[] = [\n  { id: 'hw_w1', discipline_id: 'heavyweight', name: 'Strength Start', duration_min: 60, difficulty: 'Beginner', goal: 'Basis kracht', exercises: [], rest_between_sets_sec: 120 },\n  { id: 'hw_w2', discipline_id: 'heavyweight', name: 'The Bridge', duration_min: 70, difficulty: 'Intermediate', goal: 'Volume', exercises: [], rest_between_sets_sec: 150 },\n  { id: 'hw_w3', discipline_id: 'heavyweight', name: 'The Beast', duration_min: 90, difficulty: 'Advanced', goal: 'Max effort', exercises: [], rest_between_sets_sec: 240 },\n${workoutsString}\n];`
);

fs.writeFileSync('data/heavyweightData.ts', hwData);
console.log('Done!');
