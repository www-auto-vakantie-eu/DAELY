import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { SectionHeader } from '../ui/SharedUI';
import { getGenderedImage } from '../../utils/imageUtils';

export const SelectedRecipeModal: React.FC = () => {
  const {
    selectedRecipe,
    setSelectedRecipe,
    contentGenderPreference
  } = useAppContext();

  if (!selectedRecipe) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-white animate-in slide-in-from-bottom-full duration-500 overflow-y-auto pb-40 hide-scrollbar">
      <div className="relative h-96 w-full">
        <img src={getGenderedImage(selectedRecipe.image, contentGenderPreference, 'nutrition')} alt={selectedRecipe.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <button onClick={() => setSelectedRecipe(null)} className="absolute top-10 right-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white active-scale z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-2">{selectedRecipe.category}</p>
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">{selectedRecipe.name}</h1>
          <div className="flex gap-4 opacity-80 text-xs font-bold uppercase tracking-widest">
            <span>{selectedRecipe.calories} KCAL</span>
            <span>{selectedRecipe.protein}G PROT</span>
            <span>{selectedRecipe.prep_time} MIN</span>
          </div>
        </div>
      </div>
      
      <div className="px-8 pt-10 space-y-10">
        <section>
          <SectionHeader title="Ingredients" subtitle="What you need" />
          <ul className="space-y-3">
            {selectedRecipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-zinc-900">{ing}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section>
          <SectionHeader title="Instructions" subtitle="How to make it" />
          <div className="space-y-4">
            {selectedRecipe.instructions.map((inst, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-zinc-50 rounded-[2rem]">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</div>
                <p className="text-sm font-medium text-zinc-700 leading-relaxed pt-1">{inst}</p>
              </div>
            ))}
          </div>
          {selectedRecipe.url && (
            <div className="mt-8">
              <a href={selectedRecipe.url} target="_blank" rel="noopener noreferrer" className="block w-full p-6 bg-emerald-600 text-white rounded-[2rem] text-center font-black uppercase tracking-widest active-scale shadow-xl hover:bg-emerald-700 transition-colors">
                Bekijk volledig recept op Fit.nl
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
