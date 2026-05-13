import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { BASE_ICONS } from '../ui/Icons';
import { allWorkouts, allExercises, allPrograms } from '../../../data/seedData';
import { getExerciseImage } from '../../../utils/getExerciseImage';
import { CustomBadge } from '../ui/SharedUI';
import { getGenderedImage } from '../../utils/imageUtils';

export const DisciplineDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedDiscipline,
    setSelectedDiscipline,
    discSubTab,
    setDiscSubTab,
    selectedMuscleGroup,
    setSelectedMuscleGroup,
    exerciseSearchQuery,
    setExerciseSearchQuery,
    setActiveWorkout,
    setShowCreateWorkout,
    setCreateWorkoutDisciplineId,
    setSelectedExercise,
    contentGenderPreference
  } = useAppContext();

  if (!selectedDiscipline) return null;

  const filteredWorkouts = allWorkouts.filter(w => w.discipline_id === selectedDiscipline.id);
  const filteredExercises = allExercises.filter(e => e.primary_discipline === selectedDiscipline.id);
  const filteredPrograms = allPrograms.filter(p => p.discipline_id === selectedDiscipline.id);

  const muscleGroups = [t('disciplines.all'), ...Array.from(new Set(filteredExercises.flatMap(e => e.muscle_groups.primary)))];

  const displayedExercises = filteredExercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleGroup === t('disciplines.all') || e.muscle_groups.primary.includes(selectedMuscleGroup);
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="pb-40 animate-in slide-in-from-right duration-500 bg-white min-h-screen">
      <div className="relative h-80 w-full mb-8">
        <img src={getGenderedImage(selectedDiscipline.image, contentGenderPreference, 'workout')} className="absolute inset-0 w-full h-full object-cover" alt={selectedDiscipline.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <button onClick={() => setSelectedDiscipline(null)} className="absolute top-10 left-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white active-scale z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mb-2">{selectedDiscipline.subtitle}</p>
          <h1 className="text-5xl font-black tracking-tighter leading-none">{selectedDiscipline.name}</h1>
        </div>
      </div>

      <div className="px-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
          {[
            { id: 'Workouts', label: t('disciplines.workouts') },
            { id: 'Exercises', label: t('disciplines.exercises') },
            { id: 'Programs', label: t('disciplines.programs') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDiscSubTab(tab.id as any)}
              className={`px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs whitespace-nowrap transition-all ${discSubTab === tab.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {discSubTab === 'Workouts' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button 
              onClick={() => {
                setCreateWorkoutDisciplineId(selectedDiscipline.id);
                setShowCreateWorkout(true);
              }}
              className="w-full p-6 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 active-scale hover:border-zinc-300 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <BASE_ICONS.Plus className="w-6 h-6 text-zinc-900" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-zinc-900">{t('disciplines.create_workout')}</span>
            </button>

            {filteredWorkouts.map(w => (
              <div key={w.id} onClick={() => setActiveWorkout(w)} className="p-6 bg-zinc-50 rounded-[2rem] flex items-center gap-6 cursor-pointer active-scale border border-black/5">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <BASE_ICONS.Disciplines className="w-8 h-8 text-zinc-900" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-zinc-900 mb-1">{w.name}</h4>
                  <div className="flex gap-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span>{w.duration_min} {t('disciplines.min')}</span>
                    <span>•</span>
                    <span>{w.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {discSubTab === 'Exercises' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('disciplines.search_exercises')}
                value={exerciseSearchQuery}
                onChange={(e) => setExerciseSearchQuery(e.target.value)}
                className="w-full p-5 pl-14 bg-zinc-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
              />
              <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {muscleGroups.map(mg => (
                <button
                  key={mg}
                  onClick={() => setSelectedMuscleGroup(mg)}
                  className={`px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${selectedMuscleGroup === mg ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                >
                  {mg}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {displayedExercises.map(e => (
                <div key={e.id} onClick={() => setSelectedExercise(e)} className="bg-zinc-50 rounded-[2rem] overflow-hidden group cursor-pointer active-scale border border-black/5">
                  <div className="aspect-square relative">
                    <img src={getExerciseImage(e, contentGenderPreference)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={e.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-black leading-tight mb-1">{e.name}</h4>
                      <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{e.muscle_groups.primary[0]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {discSubTab === 'Programs' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {filteredPrograms.map(p => (
              <div key={p.id} className="relative aspect-[16/9] rounded-[2rem] overflow-hidden group cursor-pointer active-scale border border-black/5">
                <img src={getGenderedImage(p.image, contentGenderPreference, 'workout')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <CustomBadge level={`${p.duration_weeks} ${t('disciplines.weeks')}`} />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-2xl font-black text-white leading-none mb-2">{p.name}</h4>
                  <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{p.difficulty} • {p.structure.length} {t('disciplines.weeks')}</p>
                </div>
              </div>
            ))}
            {filteredPrograms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500 font-medium">{t('disciplines.no_programs')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
