import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../ui/Icons';
import { Card } from '../ui/SharedUI';
import { getGenderedImage } from '../../utils/imageUtils';
import type { Recipe } from '../../../types';
import { fetchRecipes } from '../../services/contentApi';

export const FILTER_CATEGORIES = {
  'Maaltijd': ['Ontbijt', 'Lunch', 'Diner', 'Snack', 'Pre-Workout', 'Post-Workout', 'Herstel', 'Smoothies'],
  'Dieet': ['Eiwitrijk', 'Koolhydraatarm', 'Keto', 'Veganistisch', 'Vegetarisch', 'Pescotarisch', 'Glutenvrij', 'Zuivelvrij', 'Mediterraans', 'Paleo'],
  'Doel': ['Spieropbouw', 'Vetverlies', 'Prestatie', 'Uithoudingsvermogen', 'Herstel Focus', 'Lean Bulk', 'Droogtrainen', 'Onderhoud', 'Levensduur'],
  'Macro': ['Eiwitrijk', 'Koolhydraatrijk', 'Vetarm', 'Gebalanceerd', 'Onder 500 kcal', '500 - 800 kcal', '800+ kcal'],
  'Tijd': ['Onder 10 min', '10 - 20 min', '20 - 40 min', 'Meal Prep Vriendelijk'],
  'Budget': ['€', '€€', '€€€'],
  'Uitsluiten': ['Geen Noten', 'Geen Zuivel', 'Geen Gluten', 'Geen Soja', 'Zoutarm']
};

export const NutritionScreen: React.FC = () => {
  const { t } = useTranslation();
  const { setSelectedRecipe, contentGenderPreference } = useAppContext();
  const [showFuelingFilters, setShowFuelingFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('Maaltijd');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    'Maaltijd': [],
    'Dieet': [],
    'Doel': [],
    'Macro': [],
    'Tijd': [],
    'Budget': [],
    'Uitsluiten': []
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
        'Maaltijd': [],
        'Dieet': [],
        'Doel': [],
        'Macro': [],
        'Tijd': [],
        'Budget': [],
        'Uitsluiten': []
    });
  };

  const activeFilterCount = Object.values(selectedFilters).flat().length;

  useEffect(() => {
    let isMounted = true;

    const loadRecipes = async () => {
      try {
        setError('');
        const data = await fetchRecipes();
        if (isMounted) {
          setRecipes(data);
        }
      } catch (err) {
        console.error('Failed to load recipes:', err);
        if (isMounted) {
          setError('Voeding kon niet worden geladen.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="px-6 pb-40 pt-16 animate-in fade-in duration-500 relative">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">{t('nutrition.title')}</h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">{t('nutrition.subtitle')}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFuelingFilters(!showFuelingFilters)}
            className={`p-4 border rounded-2xl active-scale transition-all shadow-sm flex items-center gap-2 ${showFuelingFilters ? 'bg-blue-600 border-blue-600 text-white' : 'bg-zinc-50 border-black/5 text-zinc-400 hover:text-blue-500'}`}
          >
            <ICONS.Filter className="w-5 h-5" />
            {activeFilterCount > 0 && <span className="text-[10px] font-black bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>

          {showFuelingFilters && (
            <div className="absolute top-full right-0 mt-4 w-[340px] bg-white rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 z-[1000] animate-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{t('nutrition.protocol_filters')}</p>
                    <button onClick={clearFilters} className="text-[10px] font-black text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest">{t('nutrition.clear_all')}</button>
                </div>

                <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar border-b border-zinc-100">
                    {Object.keys(FILTER_CATEGORIES).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveFilterTab(tab)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeFilterTab === tab ? 'text-zinc-900' : 'text-zinc-400'}`}
                        >
                            {tab}
                            {activeFilterTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {(FILTER_CATEGORIES as any)[activeFilterTab].map((option: string) => {
                        const isSelected = selectedFilters[activeFilterTab]?.includes(option);
                        return (
                            <button 
                                key={option}
                                onClick={() => toggleFilter(activeFilterTab, option)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-zinc-50 border-black/5 text-zinc-500 hover:bg-zinc-100'}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                <button 
                    onClick={() => setShowFuelingFilters(false)}
                    className="w-full mt-10 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active-scale shadow-xl"
                >
                    {t('nutrition.apply_filters')}
                </button>
            </div>
          )}
        </div>
      </header>

      {activeFilterCount > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2">{t('nutrition.active')}</span>
            {Object.entries(selectedFilters).map(([cat, values]) => 
                values.map(val => (
                    <div key={`${cat}-${val}`} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                        {val}
                        <button onClick={() => toggleFilter(cat, val)} className="hover:text-blue-800"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                    </div>
                ))
            )}
        </div>
      )}

      {isLoading && (
        <Card className="p-6 mb-8 text-sm font-semibold text-zinc-500 border border-black/5">
          Recepten worden geladen...
        </Card>
      )}

      {!isLoading && error && (
        <Card className="p-6 mb-8 text-sm font-semibold text-red-600 border border-red-100 bg-red-50">
          {error}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8">
        {recipes.filter(recipe => {
          if (activeFilterCount === 0) return true;
          
          const cat = recipe.category.toLowerCase();
          const name = recipe.name.toLowerCase();
          const instructions = recipe.instructions.join(' ').toLowerCase();
          const ingredients = recipe.ingredients.join(' ').toLowerCase();

          // Check Meal filters
          if (selectedFilters['Maaltijd'] && selectedFilters['Maaltijd'].length > 0) {
            const mealMatch = selectedFilters['Maaltijd'].some(m => {
                if (m === 'Ontbijt') return cat === 'ontbijt';
                if (m === 'Lunch') return cat === 'lunch';
                if (m === 'Diner') return cat === 'diner';
                if (m === 'Snack') return cat === 'snack';
                if (m === 'Smoothies') return name.includes('smoothie');
                if (m === 'Shakes') return name.includes('shake');
                return false;
            });
            if (!mealMatch) return false;
          }

          // Check Diet filters (keywords & exclusions)
          if (selectedFilters['Dieet'] && selectedFilters['Dieet'].length > 0) {
            const dietMatch = selectedFilters['Dieet'].every(d => {
                const lowD = d.toLowerCase();
                if (lowD === 'veganistisch') return ingredients.includes('vegan') || name.includes('vegan');
                if (lowD === 'vegetarisch') return !ingredients.includes('kip') && !ingredients.includes('zalm') && !ingredients.includes('vlees') && !ingredients.includes('beef') && !ingredients.includes('steak');
                if (lowD === 'eiwitrijk') return recipe.protein > 30;
                if (lowD === 'koolhydraatarm') return recipe.carbs < 30;
                return name.includes(lowD) || ingredients.includes(lowD);
            });
            if (!dietMatch) return false;
          }

          // Check Macro Focus
          if (selectedFilters['Macro'] && selectedFilters['Macro'].length > 0) {
            const macroMatch = selectedFilters['Macro'].some(m => {
                if (m === 'Onder 500 kcal') return recipe.calories < 500;
                if (m === '500 - 800 kcal') return recipe.calories >= 500 && recipe.calories <= 800;
                if (m === '800+ kcal') return recipe.calories > 800;
                if (m === 'Eiwitrijk') return recipe.protein > 40;
                return false;
            });
            if (!macroMatch) return false;
          }

          // Check Goal filters
          if (selectedFilters['Doel'] && selectedFilters['Doel'].length > 0) {
            const goalMatch = selectedFilters['Doel'].some(g => {
                const lowG = g.toLowerCase();
                return name.includes(lowG) || instructions.includes(lowG) || ingredients.includes(lowG);
            });
            if (!goalMatch) return false;
          }

          // Check Time filters
          if (selectedFilters['Tijd'] && selectedFilters['Tijd'].length > 0) {
            const timeMatch = selectedFilters['Tijd'].some(t => {
                if (t === 'Onder 10 min') return recipe.prep_time <= 10;
                if (t === '10 - 20 min') return recipe.prep_time > 10 && recipe.prep_time <= 20;
                if (t === '20 - 40 min') return recipe.prep_time > 20 && recipe.prep_time <= 40;
                if (t === 'Meal Prep Vriendelijk') return instructions.includes('prep') || name.includes('prep');
                return false;
            });
            if (!timeMatch) return false;
          }

          // Check Budget
          if (selectedFilters['Budget'] && selectedFilters['Budget'].length > 0) {
            const budgetMatch = selectedFilters['Budget'].some(b => {
                if (b === '€') return recipe.calories < 400; // Mock budget logic
                if (b === '€€') return recipe.calories >= 400 && recipe.calories < 600;
                if (b === '€€€') return recipe.calories >= 600;
                return false;
            });
            if (!budgetMatch) return false;
          }

          // Check Exclude
          if (selectedFilters['Uitsluiten'] && selectedFilters['Uitsluiten'].length > 0) {
            const excludeMatch = selectedFilters['Uitsluiten'].every(e => {
                const lowE = e.toLowerCase();
                if (lowE.startsWith('geen ')) {
                    const excludeTerm = lowE.replace('geen ', '');
                    return !ingredients.includes(excludeTerm) && !name.includes(excludeTerm);
                }
                if (lowE.startsWith('zoutarm')) {
                    return !ingredients.includes('zout') && !ingredients.includes('salt');
                }
                return !ingredients.includes(lowE) && !name.includes(lowE);
            });
            if (!excludeMatch) return false;
          }

          return true;
        }).map(recipe => (
          <Card key={recipe.id} noPadding onClick={() => setSelectedRecipe(recipe)} className="relative aspect-[16/11] group active-scale shadow-xl border-none">
              <img src={getGenderedImage(recipe.image, contentGenderPreference, 'nutrition')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={recipe.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h4 className="text-3xl font-black tracking-tighter mb-1">{recipe.name}</h4>
                <div className="flex gap-4 opacity-70 text-[10px] font-bold uppercase tracking-widest"><span>{recipe.calories} {t('nutrition.kcal')}</span><span>{recipe.protein}{t('nutrition.g_protein')}</span></div>
              </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
