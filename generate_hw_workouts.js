import { allExercises } from './data/seedData';

const workoutsInput = `
1. Heavy Squat Strength
Doel: Maximale squat kracht
Niveau: Intermediate / Advanced
Oefeningen:
Back Squat — 5 × 5
Front Squat — 4 × 5
Box Squat — 4 × 4
Walking Lunges — 3 × 10
Hanging Leg Raises — 3 × 12
Rust: 2–3 min

2. Deadlift Power Session
Doel: Deadlift kracht verbeteren
Oefeningen:
Conventional Deadlift — 5 × 5
Deficit Deadlift — 4 × 4
Romanian Deadlift — 4 × 6
Good Mornings — 3 × 8
Plank — 3 × 60 sec
Rust: 2–3 min

3. Heavy Bench Builder
Doel: Bench press kracht
Oefeningen:
Barbell Bench Press — 5 × 5
Close Grip Bench Press — 4 × 6
Paused Bench Press — 4 × 4
Weighted Dips — 3 × 8
Cable Triceps Pushdown — 3 × 12
Rust: 2 min

4. Overhead Press Strength
Doel: Schouder kracht
Oefeningen:
Barbell Overhead Press — 5 × 5
Push Press — 4 × 4
Strict Press — 4 × 5
Dumbbell Lateral Raise — 3 × 12
Face Pull — 3 × 12
Rust: 90–120 sec

5. Heavy Pull Workout
Doel: Rugkracht en pulling power
Oefeningen:
Weighted Pull-Ups — 4 × 6
Pendlay Rows — 4 × 6
T-Bar Rows — 3 × 8
Barbell Shrugs — 3 × 10
Hammer Curls — 3 × 12
Rust: 90 sec

6. Strongman Strength Session
Doel: Functionele kracht
Oefeningen:
Farmer Carry — 4 × 40 m
Yoke Walk — 4 × 20 m
Tire Flip — 4 × 6
Atlas Stones — 4 × 5
Sandbag Carry — 3 × 30 m
Rust: 2 min

7. Lower Body Power
Doel: Onderlichaam explosieve kracht
Oefeningen:
Front Squat — 4 × 5
Romanian Deadlift — 4 × 6
Box Squat — 4 × 4
Hip Thrust — 3 × 8
Standing Calf Raises — 4 × 15
Rust: 2 min

8. Upper Body Heavy Day
Doel: Upper body maximale kracht
Oefeningen:
Bench Press — 5 × 5
Weighted Pull-Ups — 4 × 6
Barbell Rows — 4 × 6
Push Press — 4 × 4
Barbell Curl — 3 × 10
Rust: 2 min

9. Grip Strength Workout
Doel: Grip en onderarm kracht
Oefeningen:
Farmer Holds — 4 × 40 sec
Plate Pinch Hold — 4 × 30 sec
Dead Hangs — 3 × 45 sec
Thick Bar Holds — 3 × 30 sec
Wrist Curls — 3 × 15
Rust: 60–90 sec

10. Full Heavyweight Strength
Doel: Complete krachttraining
Oefeningen:
Back Squat — 5 × 5
Bench Press — 5 × 5
Deadlift — 4 × 5
Overhead Press — 4 × 5
Farmer Carry — 3 × 40 m
Rust: 2–3 min
`;

// Helper to find exercise by name
function findExerciseId(name) {
  // Try exact match
  let match = allExercises.find(e => e.name.toLowerCase() === name.toLowerCase());
  if (match) return match.id;
  
  // Try partial match
  match = allExercises.find(e => e.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(e.name.toLowerCase()));
  if (match) return match.id;
  
  // Try some common aliases
  const aliases = {
    'Conventional Deadlift': 'Deadlift',
    'Deficit Deadlift': 'Deadlift',
    'Weighted Dips': 'Parallel Bar Dips',
    'Weighted Pull-Ups': 'Pull-Up',
    'Barbell Shrugs': 'Shrugs',
    'Farmer Holds': 'Farmer Carry',
    'Plate Pinch Hold': 'Plate Pinch',
    'Dead Hangs': 'Dead Hang',
    'Thick Bar Holds': 'Farmer Carry', // Approximation
    'Wrist Curls': 'Wrist Curl',
    'Standing Calf Raises': 'Standing Calf Raise',
    'Bench Press': 'Barbell Bench Press',
    'Barbell Rows': 'Bent Over Row',
    'Hammer Curls': 'Hammer Curl',
    'Strict Press': 'Overhead Press',
    'Barbell Overhead Press': 'Overhead Press',
    'Face Pull': 'Cable Face Pull'
  };
  
  if (aliases[name]) {
    match = allExercises.find(e => e.name.toLowerCase() === aliases[name].toLowerCase() || e.name.toLowerCase().includes(aliases[name].toLowerCase()));
    if (match) return match.id;
  }
  
  console.warn('Could not find exercise for:', name);
  return 'unknown_' + name.replace(/\s+/g, '_');
}

const workouts = [];
let currentWorkout = null;
let currentRest = 120;

const lines = workoutsInput.split('\n').map(l => l.trim()).filter(l => l);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^\d+\.\s/)) {
    currentWorkout = {
      id: 'hw_w_new_' + (workouts.length + 1),
      discipline_id: 'heavyweight',
      name: line.replace(/^\d+\.\s/, ''),
      duration_min: 60,
      difficulty: 'Intermediate',
      goal: '',
      exercises: [],
      rest_between_sets_sec: 120
    };
    workouts.push(currentWorkout);
  } else if (currentWorkout) {
    if (line.startsWith('Doel:')) {
      currentWorkout.goal = line.replace('Doel:', '').trim();
    } else if (line.startsWith('Niveau:')) {
      const level = line.replace('Niveau:', '').trim();
      if (level.includes('Beginner')) currentWorkout.difficulty = 'Beginner';
      else if (level.includes('Advanced')) currentWorkout.difficulty = 'Advanced';
      else currentWorkout.difficulty = 'Intermediate';
    } else if (line.startsWith('Rust:')) {
      // Parse something like "Rust: 2–3 min" or "Rust: 90 sec"
      const restStr = line.replace('Rust:', '').trim();
      if (restStr.includes('min')) {
        const minMatch = restStr.match(/(\d+)/);
        if (minMatch) {
            currentWorkout.rest_between_sets_sec = parseInt(minMatch[1]) * 60;
        }
      } else {
        const secMatch = restStr.match(/(\d+)/);
        if (secMatch) {
            currentWorkout.rest_between_sets_sec = parseInt(secMatch[1]);
        }
      }
      currentWorkout.exercises.forEach(ex => ex.rest_sec = currentWorkout.rest_between_sets_sec);
    } else if (line.includes('—')) {
      const parts = line.split('—').map(s => s.trim());
      const namePart = parts[0];
      const setsRepsPart = parts[1];
      const setsRepsMatch = setsRepsPart.match(/(\d+)\s*[x×]\s*(.+)/);
      if (setsRepsMatch) {
        const sets = parseInt(setsRepsMatch[1]);
        const reps = setsRepsMatch[2].trim();
        const exId = findExerciseId(namePart);
        currentWorkout.exercises.push({
          exercise_id: exId,
          sets: sets,
          reps: reps,
          rest_sec: currentWorkout.rest_between_sets_sec
        });
      }
    }
  }
}

console.log(JSON.stringify(workouts, null, 2));
