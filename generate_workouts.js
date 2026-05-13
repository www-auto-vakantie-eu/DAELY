import { allExercises } from './data/seedData';

const workoutsInput = `
1. Full Body Strength Workout
Doel: Kracht opbouwen
Niveau: Beginner / Intermediate
Oefeningen:
Barbell Back Squat — 4 × 6
Barbell Bench Press — 4 × 6
Bent Over Row — 3 × 8
Dumbbell Shoulder Press — 3 × 10
Plank — 3 × 45 sec
Rust: 90 sec

2. Chest & Triceps Workout
Doel: Upper body push strength
Oefeningen:
Barbell Bench Press — 4 × 8
Incline Dumbbell Press — 3 × 10
Cable Chest Fly — 3 × 12
Triceps Pushdown — 3 × 12
Bench Dips — 3 × 12
Rust: 60–90 sec

3. Back & Biceps Workout
Doel: Pull strength
Oefeningen:
Pull-Ups — 4 × 8
Barbell Row — 4 × 8
Seated Cable Row — 3 × 10
Barbell Curl — 3 × 10
Hammer Curl — 3 × 12
Rust: 60–90 sec

4. Leg Day Workout
Doel: Onderlichaam kracht
Oefeningen:
Barbell Back Squat — 4 × 6
Romanian Deadlift — 4 × 8
Leg Press — 3 × 10
Walking Lunges — 3 × 12
Standing Calf Raise — 4 × 15
Rust: 90 sec

5. Shoulder Builder Workout
Doel: Schouders sterker maken
Oefeningen:
Barbell Overhead Press — 4 × 6
Dumbbell Lateral Raise — 3 × 12
Arnold Press — 3 × 10
Cable Face Pull — 3 × 12
Rear Delt Fly — 3 × 12
Rust: 60–90 sec

6. Core & Abs Workout
Doel: Core stabiliteit
Oefeningen:
Hanging Leg Raises — 3 × 12
Russian Twists — 3 × 20
Plank — 3 × 60 sec
Bicycle Crunch — 3 × 20
Ab Wheel Rollout — 3 × 10
Rust: 45 sec

7. Upper Body Workout
Doel: Bovenlichaam spiergroei
Oefeningen:
Bench Press — 4 × 8
Pull-Ups — 4 × 8
Shoulder Press — 3 × 10
Barbell Curl — 3 × 10
Triceps Pushdown — 3 × 12
Rust: 60–90 sec

8. Lower Body Workout
Doel: Kracht en stabiliteit
Oefeningen:
Front Squat — 4 × 6
Hip Thrust — 4 × 8
Bulgarian Split Squat — 3 × 10
Leg Curl — 3 × 12
Calf Raises — 4 × 15
Rust: 90 sec

9. Push Workout
Doel: Borst, schouders en triceps
Oefeningen:
Bench Press — 4 × 8
Incline Dumbbell Press — 3 × 10
Shoulder Press — 3 × 10
Lateral Raise — 3 × 12
Triceps Pushdown — 3 × 12
Rust: 60–90 sec

10. Pull Workout
Doel: Rug en biceps
Oefeningen:
Deadlift — 4 × 5
Pull-Ups — 4 × 8
Seated Cable Row — 3 × 10
Face Pull — 3 × 12
Hammer Curl — 3 × 12
Rust: 90 sec
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
    'Barbell Bench Press': 'Bench Press',
    'Bench Press': 'Barbell Bench Press',
    'Bent Over Row': 'Barbell Row',
    'Barbell Row': 'Bent Over Row',
    'Dumbbell Shoulder Press': 'Shoulder Press',
    'Shoulder Press': 'Dumbbell Shoulder Press',
    'Triceps Pushdown': 'Triceps Pushdown',
    'Pull-Ups': 'Pull-Up',
    'Walking Lunges': 'Dumbbell Walking Lunges',
    'Standing Calf Raise': 'Calf Raise',
    'Calf Raises': 'Calf Raise',
    'Barbell Overhead Press': 'Overhead Press',
    'Dumbbell Lateral Raise': 'Lateral Raise',
    'Lateral Raise': 'Dumbbell Lateral Raise',
    'Cable Face Pull': 'Face Pull',
    'Face Pull': 'Cable Face Pull',
    'Rear Delt Fly': 'Rear Delt Fly',
    'Hanging Leg Raises': 'Hanging Leg Raise',
    'Russian Twists': 'Russian Twist',
    'Bicycle Crunch': 'Bicycle Crunch',
    'Front Squat': 'Front Squat',
    'Hip Thrust': 'Barbell Hip Thrust',
    'Bulgarian Split Squat': 'Dumbbell Bulgarian Split Squat',
    'Leg Curl': 'Seated Leg Curl',
    'Deadlift': 'Deadlift',
    'Seated Cable Row': 'Seated Cable Row',
    'Cable Chest Fly': 'Cable Fly',
    'Bench Dips': 'Bench Dip',
    'Arnold Press': 'Arnold Press',
    'Ab Wheel Rollout': 'Ab Wheel Rollout',
    'Plank': 'Plank',
    'Barbell Back Squat': 'Barbell Back Squat',
    'Romanian Deadlift': 'Romanian Deadlift',
    'Leg Press': 'Leg Press',
    'Barbell Curl': 'Barbell Curl',
    'Hammer Curl': 'Hammer Curl',
    'Incline Dumbbell Press': 'Incline Dumbbell Press'
  };
  
  if (aliases[name]) {
    match = allExercises.find(e => e.name.toLowerCase() === aliases[name].toLowerCase() || e.name.toLowerCase().includes(aliases[name].toLowerCase()));
    if (match) return match.id;
  }
  
  console.warn('Could not find exercise for:', name);
  return 'unknown_' + name.replace(/\\s+/g, '_');
}

const workouts = [];
let currentWorkout = null;
let currentRest = 60;

const lines = workoutsInput.split('\n').map(l => l.trim()).filter(l => l);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^\d+\.\s/)) {
    currentWorkout = {
      id: 'f_w_new_' + (workouts.length + 1),
      discipline_id: 'fitness',
      name: line.replace(/^\d+\.\s/, ''),
      duration_min: 45,
      difficulty: 'Intermediate',
      goal: '',
      exercises: [],
      rest_between_sets_sec: 60
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
      const restMatch = line.match(/(\d+)/);
      if (restMatch) {
        currentWorkout.rest_between_sets_sec = parseInt(restMatch[1]);
        currentWorkout.exercises.forEach(ex => ex.rest_sec = currentWorkout.rest_between_sets_sec);
      }
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
