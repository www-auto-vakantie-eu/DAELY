import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { BASE_ICONS } from '../ui/Icons';
import { disciplines } from '../../../data/seedData';
import { DisciplineDetailScreen } from './DisciplineDetailScreen';
import { getGenderedImage } from '../../utils/imageUtils';

export const DisciplinesScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedDiscipline,
    setSelectedDiscipline,
    setDiscSubTab,
    setCreateWorkoutDisciplineId,
    setShowCreateWorkout,
    contentGenderPreference
  } = useAppContext();

  if (selectedDiscipline) {
    return <DisciplineDetailScreen />;
  }

  return (
    <div className="px-6 pb-40 pt-16 animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">{t('disciplines.title')}</h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight">{t('disciplines.subtitle')}</p>
      </header>
      <div className="grid grid-cols-1 gap-10">
        {disciplines.map(d => (
          <div 
            key={d.id} 
            className="relative aspect-[16/10] rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl active-scale border border-black/5 bg-zinc-50"
          >
            <div onClick={() => { setSelectedDiscipline(d); setDiscSubTab('Exercises'); }} className="absolute inset-0 z-10" />
            <img src={getGenderedImage(d.image, contentGenderPreference, 'workout')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" alt={d.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-12 left-12 pointer-events-none z-20">
              <h3 className="text-5xl font-black text-white leading-none mb-3 tracking-tighter">{d.name}</h3>
              <p className="text-[11px] font-black text-zinc-200 uppercase tracking-[0.5em]">{d.subtitle}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCreateWorkoutDisciplineId(d.id);
                setShowCreateWorkout(true);
              }}
              className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-colors"
            >
              <BASE_ICONS.Plus className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
