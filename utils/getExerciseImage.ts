import { Exercise } from '../types';
import { getGenderedImage } from '../src/utils/imageUtils';

export function getExerciseImage(exercise: Exercise, preference: 'man' | 'woman' | 'none' = 'none'): string {
  let url = '';
  if (exercise.media?.thumbnail) {
    url = exercise.media.thumbnail;
  } else {
    const name = exercise.name.toLowerCase();
    const discipline = exercise.primary_discipline;
    const muscle = exercise.muscle_groups?.primary?.[0]?.toLowerCase() || '';

    if (name.includes('squat') || muscle.includes('benen') || muscle.includes('legs') || muscle.includes('quad') || muscle.includes('glute')) {
      url = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800'; // Squat
    } else if (name.includes('bench') || name.includes('push') || muscle.includes('borst') || muscle.includes('chest')) {
      url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'; // Bench press / Chest
    } else if (name.includes('deadlift') || muscle.includes('hamstring') || muscle.includes('onderrug')) {
      url = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800'; // Deadlift
    } else if (name.includes('pull') || name.includes('row') || muscle.includes('rug') || muscle.includes('back') || muscle.includes('lats')) {
      url = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800'; // Pull / Back
    } else if (name.includes('curl') || muscle.includes('biceps')) {
      url = 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800'; // Biceps
    } else if (name.includes('tricep') || name.includes('dip') || muscle.includes('triceps')) {
      url = 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=800'; // Triceps
    } else if (name.includes('press') || name.includes('shoulder') || muscle.includes('schouder') || muscle.includes('shoulder') || muscle.includes('delts')) {
      url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'; // Shoulders
    } else if (name.includes('run') || name.includes('sprint') || discipline === 'hardlopen') {
      url = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800'; // Running
    } else if (discipline === 'calisthenics' || name.includes('muscle up') || name.includes('planche') || name.includes('front lever') || name.includes('handstand')) {
      url = 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800'; // Calisthenics
    } else if (discipline === 'yoga' || discipline === 'pilates' || name.includes('yoga') || name.includes('stretch') || name.includes('pose') || name.includes('dog')) {
      url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'; // Yoga
    } else if (discipline === 'combat' || name.includes('punch') || name.includes('kick') || name.includes('box') || name.includes('strike') || name.includes('guard')) {
      url = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800'; // Combat
    } else if (discipline === 'hyrox' || name.includes('sled') || name.includes('wall ball') || name.includes('burpee') || name.includes('sandbag') || name.includes('farmer')) {
      url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'; // Hyrox / Crossfit
    } else if (discipline === 'mobility' || name.includes('mobility') || name.includes('rotation') || name.includes('flex')) {
      url = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800'; // Mobility
    } else if (name.includes('core') || name.includes('plank') || name.includes('crunch') || muscle.includes('abs') || muscle.includes('core') || muscle.includes('buik')) {
      url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800'; // Core
    } else {
      url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800';
    }
  }
  
  return getGenderedImage(url, preference, 'workout');
}
