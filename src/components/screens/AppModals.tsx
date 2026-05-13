import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNutrition } from '../../hooks/useNutrition';
import { db } from '../../firebase';
import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { ICONS, BASE_ICONS } from '../ui/Icons';
import { Card, Button, SectionHeader, CustomBadge } from '../ui/SharedUI';
import { nutritionRecipes, foodDatabase } from '../../data/nutritionData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { weightData, volumeData } from '../../data/appData';
import { getExerciseImage } from '../../../utils/getExerciseImage';
import { disciplines, allExercises, allWorkouts } from '../../../data/seedData';
import { GoogleGenAI } from "@google/genai";
import { getGenderedImage } from '../../utils/imageUtils';

export const AppModals: React.FC = () => {
  const {
    showMyWorkoutsOverlay, setShowMyWorkoutsOverlay,
    showCreateWorkout, setShowCreateWorkout,
    createWorkoutDisciplineId, setCreateWorkoutDisciplineId,
    newWorkoutExercises, setNewWorkoutExercises,
    showAddExerciseModal, setShowAddExerciseModal,
    exerciseSearchQuery, setExerciseSearchQuery,
    showScheduleCalendar, setShowScheduleCalendar,
    workouts, setWorkouts, fetchWorkouts,
    selectedDateToAddWorkout, setSelectedDateToAddWorkout,
    showAiModal, setShowAiModal,
    setActiveWorkout,
    selectedWorkoutType, setSelectedWorkoutType,
    isGenerating, setIsGenerating,
    aiDays, setAiDays,
    aiGoal, setAiGoal,
    aiEquipment, setAiEquipment,
    showProgressDashboard, setShowProgressDashboard,
    workoutHistory,
    streak,
    showMyHabits, setShowMyHabits,
    user,
    weightLogs,
    dailyHabits,
    customWorkouts,
    showMyNutritionOverlay,
    setShowMyNutritionOverlay,
    nutritionSelectedDay,
    setNutritionSelectedDay,
    nutritionPlan,
    showGroceryList,
    setShowGroceryList,
    showSwapMeal,
    setShowSwapMeal,
    showAddCustomFood,
    setShowAddCustomFood,
    customFoodForm,
    setCustomFoodForm,
    foodSearchQuery,
    setFoodSearchQuery,
    foodSearchResults,
    setFoodSearchResults,
    isSearchingFood,
    setIsSearchingFood,
    selectedNutritionRecipe,
    setSelectedNutritionRecipe,
    recipeServings,
    setRecipeServings,
    showNutritionSettings,
    setShowNutritionSettings,
    nutritionGoal,
    setNutritionGoal,
    nutritionKcalTarget,
    setNutritionKcalTarget,
    nutritionMacros,
    setNutritionMacros,
    showWeekOverview,
    setShowWeekOverview,
    selectedExercise,
    setSelectedExercise,
    daelyPoints,
    setDaelyPoints,
    activeHomeCreatorId,
    contentGenderPreference
  } = useAppContext();

  const [selectedProgressExercise, setSelectedProgressExercise] = useState<string>('');
  const [newWeight, setNewWeight] = useState('');
  const [createWorkoutName, setCreateWorkoutName] = useState('');
  const [createWorkoutDesc, setCreateWorkoutDesc] = useState('');

  const handleSaveCustomWorkout = async () => {
    if (!user || !createWorkoutName || newWorkoutExercises.length === 0) return;
    try {
      const newWorkout = {
        name: createWorkoutName,
        description: createWorkoutDesc,
        discipline_id: createWorkoutDisciplineId,
        duration_min: newWorkoutExercises.length * 5, // Rough estimate
        difficulty: 'Gemiddeld',
        exercises: newWorkoutExercises.map(ex => ({
          exercise_id: ex.id,
          sets: 3,
          reps: '8-12',
          rest_seconds: 60
        })),
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, `users/${user.uid}/customWorkouts`), newWorkout);
      setShowCreateWorkout(false);
      setCreateWorkoutName('');
      setCreateWorkoutDesc('');
      setCreateWorkoutDisciplineId('');
      setNewWorkoutExercises([]);
    } catch (e) {
      console.error("Error saving custom workout", e);
    }
  };

  const handleLogWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight)) || !user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/weightLogs`), {
        weight: Number(newWeight),
        date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
        timestamp: serverTimestamp()
      });
      setNewWeight('');

      // Gamification: Award Daely Points for logging weight
      setDaelyPoints(prev => Math.max(0, Math.min(1000000, prev + 5)));
      await updateDoc(doc(db, 'users', user.uid), {
        daelyPoints: increment(5)
      });
    } catch (e) {
      console.error("Error logging weight", e);
    }
  };

  const {
    handleAddCustomFood,
    handleFoodSearch,
    handleSelectFood,
    handleSwapMeal,
    handleToggleMealConsumed,
    handleDeleteMeal,
    calculateDayMacros,
    generateGroceryList,
    dynamicMacroData
  } = useNutrition();

  const muscleGroupData = useMemo(() => {
    if (!workoutHistory) return [];
    const counts: Record<string, number> = {};
    workoutHistory.forEach(w => {
      w.exercises?.forEach((ex: any) => {
        const primary = ex.muscle_groups?.primary?.[0];
        if (primary) {
          counts[primary] = (counts[primary] || 0) + (ex.sets?.length || 1);
        }
      });
    });
    return Object.entries(counts)
      .map(([subject, A]) => ({ subject, A }))
      .sort((a, b) => b.A - a.A)
      .slice(0, 6); // Top 6 for a nice radar chart
  }, [workoutHistory]);

  const uniqueExercises = useMemo(() => {
    if (!workoutHistory) return [];
    const names = new Set<string>();
    workoutHistory.forEach(w => {
      w.exercises?.forEach((ex: any) => {
        if (ex.max1RM > 0) names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [workoutHistory]);

  useEffect(() => {
    if (uniqueExercises.length > 0 && !selectedProgressExercise) {
      setSelectedProgressExercise(uniqueExercises[0]);
    }
  }, [uniqueExercises, selectedProgressExercise]);

  const exerciseProgressionData = useMemo(() => {
    if (!workoutHistory || !selectedProgressExercise) return [];
    const data: any[] = [];
    const sortedHistory = [...workoutHistory].reverse(); // Ascending order
    sortedHistory.forEach(w => {
      const ex = w.exercises?.find((e: any) => e.name === selectedProgressExercise);
      if (ex && ex.max1RM > 0) {
        const date = w.completedAt?.toDate ? w.completedAt.toDate() : new Date(w.completedAt);
        data.push({
          date: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
          e1RM: Math.round(ex.max1RM)
        });
      }
    });
    return data;
  }, [workoutHistory, selectedProgressExercise]);

  // We will insert the modals code here
  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Maak een wekelijks workout schema voor iemand die ${aiDays} dagen per week wil trainen. Doel: ${aiGoal}. Beschikbare apparatuur: ${aiEquipment}.
      Geef een array terug met workouts voor de komende week. Gebruik datums in oktober 2026, beginnend bij 2026-10-26 (vandaag) of 2026-10-27.
      Voor elke workout, geef de datum (YYYY-MM-DD), titel, type (Krachttraining, Cardio & Conditie, of Herstel / Yoga), en tijd (bijv. 18:00 - 19:00).
      Voeg ook een array van "exercises" toe voor elke workout. Elke exercise heeft een "name" (bijv. "Bench Press"), "sets" (aantal sets, bijv. 3), en "reps" (bijv. "8-12").`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY" as any,
            items: {
              type: "OBJECT" as any,
              properties: {
                date: { type: "STRING" as any },
                title: { type: "STRING" as any },
                type: { type: "STRING" as any },
                time: { type: "STRING" as any },
                exercises: {
                  type: "ARRAY" as any,
                  items: {
                    type: "OBJECT" as any,
                    properties: {
                      name: { type: "STRING" as any },
                      sets: { type: "INTEGER" as any },
                      reps: { type: "STRING" as any }
                    },
                    required: ["name", "sets", "reps"]
                  }
                }
              },
              required: ["date", "title", "type", "time", "exercises"]
            }
          }
        }
      });

      const generatedWorkouts = JSON.parse(response.text || "[]");
      
      for (const workout of generatedWorkouts) {
        await fetch('/api/workouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workout)
        });
      }

      await fetchWorkouts();
      setShowAiModal(false);
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Er is een fout opgetreden bij het genereren van het schema.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddWorkout = async () => {
    if (!selectedDateToAddWorkout || !selectedWorkoutType) return;
    
    // Format date as YYYY-MM-DD (assuming current month/year for now, e.g. 2026-10-XX)
    const dateStr = `2026-10-${selectedDateToAddWorkout.toString().padStart(2, '0')}`;
    
    let title = '';
    let time = '';
    let exercises: any[] = [];
    
    // Check if selectedWorkoutType is a custom workout ID
    const customWorkout = customWorkouts.find(cw => cw.id === selectedWorkoutType);
    
    if (customWorkout) {
      title = customWorkout.name;
      time = '12:00 - 13:00'; // Default time
      exercises = customWorkout.exercises.map((ex: any) => {
        const fullEx = allExercises.find(e => e.id === ex.exercise_id);
        return {
          name: fullEx ? fullEx.name : 'Onbekende Oefening',
          sets: ex.sets,
          reps: ex.reps
        };
      });
    } else if (selectedWorkoutType === 'Krachttraining') {
      title = 'Spiergroei I.';
      time = '18:00 - 19:15';
      exercises = [
        { name: 'Barbell Squat', sets: 4, reps: '8-10' },
        { name: 'Bench Press', sets: 4, reps: '8-10' },
        { name: 'Pull-ups', sets: 3, reps: 'Max' }
      ];
    } else if (selectedWorkoutType === 'Cardio & Conditie') {
      title = 'Verleg Je Grenzen';
      time = '10:00 - 11:30';
      exercises = [
        { name: 'Hardloopband', sets: 1, reps: '30 min' },
        { name: 'Roeimachine', sets: 1, reps: '15 min' }
      ];
    } else {
      title = 'Actief Herstel';
      time = '19:00 - 19:45';
      exercises = [
        { name: 'Yoga Flow', sets: 1, reps: '30 min' },
        { name: 'Foamrollen', sets: 1, reps: '15 min' }
      ];
    }

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: dateStr,
          title,
          type: selectedWorkoutType,
          time,
          exercises
        })
      });

      if (res.ok) {
        fetchWorkouts();
        setSelectedDateToAddWorkout(null);
        setSelectedWorkoutType(null);
      }
    } catch (e) {
      console.error('Failed to add workout', e);
    }
  };

  const chartWeightData = weightLogs && weightLogs.length > 0 ? weightLogs : weightData;
  const latestWeight = chartWeightData[chartWeightData.length - 1]?.weight || 78.5;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayHabits = dailyHabits?.[todayStr] || {};

  const HABIT_LIST = [
      { id: 'water', title: 'Ochtend Hydratatie', desc: 'Drink 500ml water', icon: '💧' },
      { id: 'meditation', title: 'Meditatie', desc: '10 minuten mindfulness', icon: '🧘' },
      { id: 'protein', title: 'Eiwitdoel', desc: 'Haal 150g eiwit', icon: '🥩' },
      { id: 'steps', title: 'Stappen', desc: '10.000 stappen per dag', icon: '🚶' },
      { id: 'sleep', title: 'Slaap', desc: '8 uur slaap', icon: '😴' }
  ];

  const completedHabitsCount = HABIT_LIST.filter(h => todayHabits[h.id]).length;

  const handleToggleHabit = async (habitId: string) => {
    if (!user) return;
    const newValue = !todayHabits[habitId];
    try {
      await setDoc(doc(db, `users/${user.uid}/dailyHabits/${todayStr}`), {
        habits: {
          ...todayHabits,
          [habitId]: newValue
        },
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Gamification: Award Daely Points for completing a habit
      if (newValue) {
        setDaelyPoints(prev => Math.max(0, Math.min(1000000, prev + 10)));
        await updateDoc(doc(db, 'users', user.uid), {
          daelyPoints: increment(10)
        });
      } else {
        // Optional: Deduct points if un-completing
        setDaelyPoints(prev => Math.max(0, Math.min(1000000, prev - 10)));
        await updateDoc(doc(db, 'users', user.uid), {
          daelyPoints: increment(-10)
        });
      }
    } catch (e) {
      console.error("Error toggling habit", e);
    }
  };

  return (
    <>
      {showMyNutritionOverlay && (
          <div className="fixed inset-0 z-[2000] bg-zinc-50 animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12 shrink-0">
                  <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-2">METABOLIC PROTOCOL</p>
                      <h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Mijn Voeding</h1>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setShowNutritionSettings(true)} className="p-4 bg-white border border-black/5 rounded-full active-scale shadow-sm text-zinc-400 hover:text-emerald-600"><ICONS.Settings className="w-6 h-6" /></button>
                      <button onClick={() => setShowMyNutritionOverlay(false)} className="p-4 bg-zinc-900 text-white rounded-full active-scale shadow-xl"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                  </div>
              </header>
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-4 pt-2 -mt-2 shrink-0">
                  {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'].map(day => (
                      <button 
                          key={day}
                          onClick={() => setNutritionSelectedDay(day)}
                          className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${nutritionSelectedDay === day ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-zinc-500 border border-black/5 hover:bg-zinc-100'}`}
                      >
                          {day}
                      </button>
                  ))}
              </div>

              <div className="space-y-10">
                  <section>
                      <div className="flex justify-between items-end mb-6">
                          <SectionHeader title="Dagplanning" subtitle={nutritionSelectedDay} />
                          <button onClick={() => setShowGroceryList(true)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 px-4 py-2 rounded-full"><ICONS.List className="w-3 h-3" /> Boodschappen</button>
                      </div>
                      
                      {(() => {
                          const dayPlan = nutritionPlan.find(p => p.day === nutritionSelectedDay);
                          if (!dayPlan) return <div className="p-8 text-center text-zinc-400 font-medium">Geen plan ingesteld voor deze dag.</div>;
                          
                          const macros = calculateDayMacros(dayPlan);
                          
                          return (
                              <>
                                  <Card className="bg-zinc-950 border-none p-6 shadow-2xl mb-8">
                                      <div className="flex justify-between items-center mb-6">
                                          <div>
                                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">KCAL DOEL</p>
                                              <p className="text-3xl font-black text-white">{macros.consumed.kcal} <span className="text-sm text-zinc-500">/ {nutritionKcalTarget}</span></p>
                                          </div>
                                          <div className="text-right">
                                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">RESTEREND</p>
                                              <p className="text-xl font-bold text-zinc-300">{Math.max(0, nutritionKcalTarget - macros.consumed.kcal)}</p>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4 text-center">
                                          <div className="bg-white/5 rounded-2xl p-3">
                                              <p className="text-lg font-black text-white">{macros.consumed.protein}g</p>
                                              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1">Eiwit ({nutritionMacros.protein}g)</p>
                                              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${Math.min(100, (macros.consumed.protein / nutritionMacros.protein) * 100)}%`}}/></div>
                                          </div>
                                          <div className="bg-white/5 rounded-2xl p-3">
                                              <p className="text-lg font-black text-white">{macros.consumed.carbs}g</p>
                                              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Koolh ({nutritionMacros.carbs}g)</p>
                                              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${Math.min(100, (macros.consumed.carbs / nutritionMacros.carbs) * 100)}%`}}/></div>
                                          </div>
                                          <div className="bg-white/5 rounded-2xl p-3">
                                              <p className="text-lg font-black text-white">{macros.consumed.fats}g</p>
                                              <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest mt-1">Vet ({nutritionMacros.fats}g)</p>
                                              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-amber-500" style={{width: `${Math.min(100, (macros.consumed.fats / nutritionMacros.fats) * 100)}%`}}/></div>
                                          </div>
                                      </div>
                                  </Card>

                                  <div className="space-y-4">
                                      {dayPlan.meals.map((meal) => {
                                          const recipe = nutritionRecipes.find(r => r.id === meal.recipeId);
                                          if (!recipe && !meal.customDetails) return null;
                                          
                                          const isCustom = !!meal.customDetails;
                                          const title = isCustom ? meal.customDetails.name : recipe?.title;
                                          const kcal = isCustom ? meal.customDetails.kcal : recipe?.macrosPerServing.kcal;
                                          const protein = isCustom ? meal.customDetails.protein : recipe?.macrosPerServing.protein;
                                          const carbs = isCustom ? meal.customDetails.carbs : recipe?.macrosPerServing.carbs;
                                          const fats = isCustom ? meal.customDetails.fats : recipe?.macrosPerServing.fats;

                                          return (
                                              <div key={meal.id} className={`p-5 rounded-[2rem] border transition-all ${meal.isConsumed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-black/5 shadow-sm'}`}>
                                                  <div className="flex justify-between items-start mb-4">
                                                      <div className="flex items-center gap-3">
                                                          <button onClick={() => handleToggleMealConsumed(dayPlan.day, meal.id)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${meal.isConsumed ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-300 hover:bg-zinc-200'}`}>
                                                              <ICONS.Check className="w-4 h-4" />
                                                          </button>
                                                          <div>
                                                              <div className="flex items-center gap-2">
                                                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{meal.type}</span>
                                                                  <span className="text-[10px] font-bold text-zinc-400">{meal.time}</span>
                                                              </div>
                                                              <h4 className={`text-base font-black mt-1 ${meal.isConsumed ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>{title}</h4>
                                                          </div>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                          {!isCustom && <button onClick={() => setShowSwapMeal({day: dayPlan.day, mealId: meal.id, mealType: meal.type})} className="p-2 text-zinc-400 hover:text-blue-500 bg-zinc-50 rounded-full"><ICONS.Refresh className="w-4 h-4" /></button>}
                                                          <button onClick={() => handleDeleteMeal(dayPlan.day, meal.id)} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-full"><ICONS.Close className="w-4 h-4" /></button>
                                                      </div>
                                                  </div>
                                                  <div className="flex items-center gap-4 pl-11">
                                                      <div className="flex gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                          <span>{kcal} KCAL</span>
                                                          <span className="text-emerald-600">{protein}G P</span>
                                                          <span className="text-blue-600">{carbs}G K</span>
                                                          <span className="text-amber-600">{fats}G V</span>
                                                      </div>
                                                      {!isCustom && <button onClick={() => { setSelectedNutritionRecipe(recipe); setRecipeServings(1); }} className="ml-auto text-[10px] font-black text-zinc-900 uppercase tracking-widest hover:text-emerald-600 flex items-center gap-1">Recept <ICONS.ChevronRight className="w-3 h-3" /></button>}
                                                  </div>
                                              </div>
                                          );
                                      })}
                                      
                                      <button onClick={() => setShowAddCustomFood(true)} className="w-full p-5 rounded-[2rem] border-2 border-dashed border-zinc-200 text-zinc-400 font-bold flex items-center justify-center gap-3 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                                          <BASE_ICONS.Plus className="w-5 h-5" />
                                          <span>Extra voeding toevoegen</span>
                                      </button>
                                  </div>
                              </>
                          );
                      })()}
                  </section>
              </div>
          </div>
      )}

      {showAddCustomFood && (
          <div className="fixed inset-0 z-[2100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
              <div className="bg-white w-full sm:w-[400px] sm:rounded-[2rem] rounded-t-[2rem] p-8 animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                      <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-1">SPONTAAN</p>
                          <h3 className="text-2xl font-black text-zinc-900">Extra Voeding</h3>
                      </div>
                      <button onClick={() => setShowAddCustomFood(false)} className="p-3 bg-zinc-100 rounded-full text-zinc-500"><ICONS.Close className="w-5 h-5" /></button>
                  </div>
                  <div className="overflow-y-auto hide-scrollbar space-y-4 flex-1 pb-8">
                      <div>
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Zoek in database</label>
                          <div className="relative">
                              <input 
                                  type="text" 
                                  value={foodSearchQuery} 
                                  onChange={e => handleFoodSearch(e.target.value)}
                                  placeholder="Zoek producten, merken..."
                                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
                              />
                              <BASE_ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                              {isSearchingFood && (
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                              )}
                          </div>
                          
                          {foodSearchResults.length > 0 && (
                              <div className="mt-2 border border-black/5 rounded-2xl overflow-hidden bg-white shadow-lg max-h-48 overflow-y-auto hide-scrollbar">
                                  {foodSearchResults.map(food => (
                                      <div 
                                          key={food.id} 
                                          onClick={() => handleSelectFood(food)}
                                          className="p-3 border-b border-black/5 last:border-0 hover:bg-emerald-50 cursor-pointer transition-colors"
                                      >
                                          <p className="text-sm font-bold text-zinc-900">{food.name}</p>
                                          <div className="flex gap-2 mt-1 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                              <span>{food.brand}</span>
                                              <span>•</span>
                                              <span>{food.kcal} KCAL</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                      
                      <div className="flex items-center gap-4 my-4">
                          <div className="h-px bg-zinc-100 flex-1"></div>
                          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">OF VUL HANDMATIG IN</span>
                          <div className="h-px bg-zinc-100 flex-1"></div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Naam / Beschrijving</label>
                          <input 
                              type="text" 
                              value={customFoodForm.name} 
                              onChange={e => setCustomFoodForm({...customFoodForm, name: e.target.value})}
                              placeholder="Bijv. Appel, Eiwitreep..."
                              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">KCAL</label>
                              <input 
                                  type="number" 
                                  value={customFoodForm.kcal || ''} 
                                  onChange={e => setCustomFoodForm({...customFoodForm, kcal: Number(e.target.value)})}
                                  placeholder="0"
                                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Eiwit (g)</label>
                              <input 
                                  type="number" 
                                  value={customFoodForm.protein || ''} 
                                  onChange={e => setCustomFoodForm({...customFoodForm, protein: Number(e.target.value)})}
                                  placeholder="0"
                                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-4 py-4 text-emerald-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Koolh (g)</label>
                              <input 
                                  type="number" 
                                  value={customFoodForm.carbs || ''} 
                                  onChange={e => setCustomFoodForm({...customFoodForm, carbs: Number(e.target.value)})}
                                  placeholder="0"
                                  className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-4 text-blue-900 font-bold text-sm focus:outline-none focus:border-blue-500"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 block">Vet (g)</label>
                              <input 
                                  type="number" 
                                  value={customFoodForm.fats || ''} 
                                  onChange={e => setCustomFoodForm({...customFoodForm, fats: Number(e.target.value)})}
                                  placeholder="0"
                                  className="w-full bg-amber-50/50 border border-amber-100 rounded-2xl px-4 py-4 text-amber-900 font-bold text-sm focus:outline-none focus:border-amber-500"
                              />
                          </div>
                      </div>
                      
                      <Button 
                          className="w-full py-5 text-base mt-4 bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-xl shadow-emerald-500/20" 
                          onClick={handleAddCustomFood}
                          disabled={!customFoodForm.name}
                      >
                          TOEVOEGEN AAN VANDAAG
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {showSwapMeal && (
          <div className="fixed inset-0 z-[2100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
              <div className="bg-white w-full sm:w-[400px] sm:rounded-[2rem] rounded-t-[2rem] p-8 animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                      <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-1">ALTERNATIEVEN</p>
                          <h3 className="text-2xl font-black text-zinc-900">Swap {showSwapMeal.mealType}</h3>
                      </div>
                      <button onClick={() => setShowSwapMeal(null)} className="p-3 bg-zinc-100 rounded-full text-zinc-500"><ICONS.Close className="w-5 h-5" /></button>
                  </div>
                  <div className="overflow-y-auto hide-scrollbar space-y-3 flex-1 pb-8">
                      {nutritionRecipes.filter(r => r.mealTypes.includes(showSwapMeal.mealType)).map(recipe => (
                          <div key={recipe.id} onClick={() => handleSwapMeal(recipe)} className="p-4 border border-black/5 rounded-[1.5rem] flex gap-4 items-center active-scale cursor-pointer hover:border-blue-500/30 group">
                              <img src={getGenderedImage(recipe.imageUrl, contentGenderPreference, 'nutrition')} alt={recipe.title} className="w-16 h-16 rounded-xl object-cover" />
                              <div className="flex-1">
                                  <h4 className="text-sm font-bold text-zinc-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{recipe.title}</h4>
                                  <div className="flex gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                      <span>{recipe.macrosPerServing.kcal} KCAL</span>
                                      <span className="text-emerald-600">{recipe.macrosPerServing.protein}G P</span>
                                  </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600"><ICONS.Refresh className="w-4 h-4" /></div>
                          </div>
                      ))}
                      {nutritionRecipes.filter(r => r.mealTypes.includes(showSwapMeal.mealType)).length === 0 && (
                          <p className="text-sm text-zinc-500 text-center py-8">Geen alternatieven gevonden voor dit maaltijdmoment.</p>
                      )}
                  </div>
              </div>
          </div>
      )}

      {selectedNutritionRecipe && (
          <div className="fixed inset-0 z-[2200] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col overflow-y-auto hide-scrollbar">
              <div className="relative h-72 shrink-0">
                  <img src={getGenderedImage(selectedNutritionRecipe.imageUrl, contentGenderPreference, 'nutrition')} alt={selectedNutritionRecipe.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <button onClick={() => setSelectedNutritionRecipe(null)} className="absolute top-12 right-6 p-4 bg-white/10 backdrop-blur-md text-white rounded-full"><ICONS.Close className="w-6 h-6" /></button>
                  <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex gap-2 mb-3">
                          {selectedNutritionRecipe.mealTypes.map((t: string) => <span key={t} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">{t}</span>)}
                      </div>
                      <h1 className="text-3xl font-black text-white leading-tight">{selectedNutritionRecipe.title}</h1>
                  </div>
              </div>
              <div className="p-8 pb-40">
                  <div className="flex gap-6 mb-8 pb-8 border-b border-black/5">
                      <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">TIJD</p><p className="text-sm font-bold text-zinc-900">{selectedNutritionRecipe.prepTimeMin} min</p></div>
                      <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">NIVEAU</p><p className="text-sm font-bold text-zinc-900">{selectedNutritionRecipe.difficulty}</p></div>
                      <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">KCAL</p><p className="text-sm font-bold text-zinc-900">{selectedNutritionRecipe.macrosPerServing.kcal * recipeServings}</p></div>
                  </div>
                  
                  <div className="mb-8">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-black text-zinc-900">Ingrediënten</h3>
                          <div className="flex items-center gap-4 bg-zinc-50 rounded-full p-1">
                              <button onClick={() => setRecipeServings(Math.max(1, recipeServings - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-900 font-bold">-</button>
                              <span className="text-sm font-bold text-zinc-900 w-16 text-center">{recipeServings} portie{recipeServings > 1 ? 's' : ''}</span>
                              <button onClick={() => setRecipeServings(recipeServings + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-900 font-bold">+</button>
                          </div>
                      </div>
                      <div className="space-y-3">
                          {selectedNutritionRecipe.ingredients.map((ing: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl">
                                  <span className="text-sm font-bold text-zinc-900">{ing.name}</span>
                                  <span className="text-sm font-medium text-zinc-500">{ing.amount * recipeServings} {ing.unit}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xl font-black text-zinc-900 mb-6">Macro's (totaal)</h3>
                      <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                              <p className="text-xl font-black text-emerald-600">{selectedNutritionRecipe.macrosPerServing.protein * recipeServings}g</p>
                              <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">Eiwit</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-2xl text-center">
                              <p className="text-xl font-black text-blue-600">{selectedNutritionRecipe.macrosPerServing.carbs * recipeServings}g</p>
                              <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mt-1">Koolh</p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-2xl text-center">
                              <p className="text-xl font-black text-amber-600">{selectedNutritionRecipe.macrosPerServing.fats * recipeServings}g</p>
                              <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mt-1">Vet</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {showGroceryList && (
          <div className="fixed inset-0 z-[2100] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-2">WEEKPLAN</p>
                      <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">Boodschappen</h1>
                  </div>
                  <button onClick={() => setShowGroceryList(false)} className="p-4 bg-zinc-100 rounded-full active-scale"><ICONS.Close className="w-6 h-6" /></button>
              </header>
              <div className="space-y-8">
                  {Object.entries(generateGroceryList()).map(([category, items]) => (
                      <div key={category}>
                          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4">{category}</h3>
                          <div className="space-y-2">
                              {items.map((item, idx) => (
                                  <label key={idx} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl cursor-pointer group">
                                      <div className="w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                                          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-0 transition-opacity" />
                                      </div>
                                      <div className="flex-1 flex justify-between items-center">
                                          <span className="text-sm font-bold text-zinc-900">{item.name}</span>
                                          <span className="text-sm font-medium text-zinc-500">{item.amount} {item.unit}</span>
                                      </div>
                                  </label>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {showNutritionSettings && (
          <div className="fixed inset-0 z-[2100] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-2">CONFIGURATIE</p>
                      <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">Plan Instellingen</h1>
                  </div>
                  <button onClick={() => setShowNutritionSettings(false)} className="p-4 bg-zinc-100 rounded-full active-scale"><ICONS.Close className="w-6 h-6" /></button>
              </header>
              <div className="space-y-8">
                  <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Doelstelling</label>
                      <div className="grid grid-cols-2 gap-3">
                          {['Afvallen', 'Onderhoud', 'Spieropbouw', 'Recompositie'].map(g => (
                              <button key={g} onClick={() => setNutritionGoal(g)} className={`p-4 rounded-2xl text-sm font-bold transition-all ${nutritionGoal === g ? 'bg-zinc-900 text-white shadow-lg' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}>{g}</button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Dagelijks Doel (KCAL)</label>
                      <input type="number" value={nutritionKcalTarget} onChange={e => setNutritionKcalTarget(Number(e.target.value))} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-5 text-zinc-900 font-bold text-lg focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Macro Verdeling (Gram)</label>
                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Eiwit</p>
                              <input type="number" value={nutritionMacros.protein} onChange={e => setNutritionMacros({...nutritionMacros, protein: Number(e.target.value)})} className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900 font-bold text-center focus:outline-none focus:border-emerald-500" />
                          </div>
                          <div>
                              <p className="text-[9px] font-bold text-blue-600 uppercase mb-1">Koolh</p>
                              <input type="number" value={nutritionMacros.carbs} onChange={e => setNutritionMacros({...nutritionMacros, carbs: Number(e.target.value)})} className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-blue-900 font-bold text-center focus:outline-none focus:border-blue-500" />
                          </div>
                          <div>
                              <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">Vet</p>
                              <input type="number" value={nutritionMacros.fats} onChange={e => setNutritionMacros({...nutritionMacros, fats: Number(e.target.value)})} className="w-full bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-3 text-amber-900 font-bold text-center focus:outline-none focus:border-amber-500" />
                          </div>
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Allergieën & Voorkeuren</label>
                      <div className="flex flex-wrap gap-2">
                          {['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij', 'Notenvrij'].map(pref => (
                              <button key={pref} className="px-4 py-2 rounded-full bg-zinc-50 text-zinc-500 text-xs font-bold border border-zinc-200 hover:border-zinc-400">{pref}</button>
                          ))}
                      </div>
                  </div>
                  <Button className="w-full py-5 text-base mt-8 bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-xl shadow-emerald-500/20" onClick={() => setShowNutritionSettings(false)}>OPSLAAN & HERBEREKENEN</Button>
              </div>
          </div>
      )}

      {showMyWorkoutsOverlay && (
          <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-2">
                      {activeHomeCreatorId ? 'CREATOR PROTOCOL' : 'PERSOONLIJK ARCHIEF'}
                    </p>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">
                      {activeHomeCreatorId ? 'Workouts' : 'Mijn Workouts'}
                    </h1>
                  </div>
                  <button onClick={() => setShowMyWorkoutsOverlay(false)} className="p-6 bg-zinc-100 rounded-full active-scale"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </header>
              <div className="space-y-12">
                  <section>
                      <div className="flex items-center gap-3 mb-6">
                        <ICONS.Heart className="text-red-500 w-5 h-5 fill-red-500/10" />
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">
                          {activeHomeCreatorId ? 'Uitgelicht' : 'Favorieten'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          {(activeHomeCreatorId 
                            ? workouts.filter(w => w.id.includes(activeHomeCreatorId.replace('c', '')) || w.id.includes('1')).slice(0, 4)
                            : workouts.slice(0, 4)
                          ).map((workout) => (
                              <div 
                                key={workout.id} 
                                onClick={() => {
                                  setActiveWorkout(workout);
                                  setShowMyWorkoutsOverlay(false);
                                }}
                                className="daely-card p-6 rounded-[2rem] aspect-square flex flex-col justify-between active-scale shadow-lg border-black/5 cursor-pointer hover:border-blue-500/30 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center">
                                  <ICONS.Play className="w-4 h-4 text-zinc-900" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{workout.duration_min} MIN</p>
                                  <p className="text-base font-black text-zinc-900 leading-tight line-clamp-2">{workout.name}</p>
                                </div>
                              </div>
                          ))}
                      </div>
                  </section>
                  {!activeHomeCreatorId && (
                    <section>
                        <div className="flex items-center gap-3 mb-6"><BASE_ICONS.Plus className="text-blue-500 w-5 h-5" /><h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Eigen Schema's</h3></div>
                        
                        {customWorkouts && customWorkouts.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {customWorkouts.map((workout) => (
                                    <div 
                                      key={workout.id} 
                                      onClick={() => {
                                        setActiveWorkout({
                                          ...workout,
                                          exercises: workout.exercises.map((we: any) => {
                                            const fullEx = allExercises.find(e => e.id === we.exercise_id);
                                            return fullEx ? { ...fullEx, ...we } : we;
                                          })
                                        });
                                        setShowMyWorkoutsOverlay(false);
                                      }}
                                      className="daely-card p-6 rounded-[2rem] aspect-square flex flex-col justify-between active-scale shadow-lg border-black/5 cursor-pointer hover:border-blue-500/30 transition-colors bg-blue-50/30"
                                    >
                                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <ICONS.Play className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">{workout.duration_min} MIN</p>
                                        <p className="text-base font-black text-zinc-900 leading-tight line-clamp-2">{workout.name}</p>
                                      </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button onClick={() => setShowCreateWorkout(true)} className="w-full p-8 rounded-[2rem] border-2 border-dashed border-zinc-200 text-zinc-400 font-bold flex items-center justify-center gap-4 hover:border-blue-500 hover:text-blue-500 transition-all"><BASE_ICONS.Plus className="w-6 h-6" /><span>Workout Maken</span></button>
                    </section>
                  )}
              </div>
          </div>
      )}

      {showCreateWorkout && (
          <div className="fixed inset-0 z-[2010] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div><p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-2">EIGEN SCHEMA</p><h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Workout Maken</h1></div>
                  <button onClick={() => setShowCreateWorkout(false)} className="p-6 bg-zinc-100 rounded-full active-scale"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </header>
              <div className="space-y-8 flex-1">
                  <div className="space-y-4">
                      <label className="text-sm font-bold text-zinc-900">Naam Workout</label>
                      <input 
                        type="text" 
                        value={createWorkoutName}
                        onChange={e => setCreateWorkoutName(e.target.value)}
                        placeholder="bijv. Full Body Power" 
                        className="w-full p-6 bg-zinc-50 border-none rounded-[2rem] text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-sm font-bold text-zinc-900">Discipline</label>
                      <div className="relative">
                          <select 
                            value={createWorkoutDisciplineId}
                            onChange={(e) => setCreateWorkoutDisciplineId(e.target.value)}
                            className="w-full p-6 bg-zinc-50 border-none rounded-[2rem] text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          >
                              <option value="">Selecteer Categorie</option>
                              {disciplines.map(d => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ICONS.ChevronRight className="w-6 h-6 text-zinc-400 rotate-90" />
                          </div>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <label className="text-sm font-bold text-zinc-900">Oefeningen</label>
                      {newWorkoutExercises.length > 0 && (
                          <div className="space-y-3 mb-4">
                              {newWorkoutExercises.map((ex, idx) => (
                                  <div key={`${ex.id}-${idx}`} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-zinc-200 rounded-xl flex items-center justify-center overflow-hidden">
                                              <img src={getExerciseImage(ex, contentGenderPreference)} className="w-full h-full object-cover" alt={ex.name} />
                                          </div>
                                          <div>
                                              <p className="font-bold text-zinc-900">{ex.name}</p>
                                              <p className="text-xs">
                                                <span className="font-bold text-zinc-400 mr-2">{ex.category}</span>
                                                <span className="font-bold text-zinc-700">{ex.muscle_groups.primary[0]}</span>
                                                {(ex.muscle_groups.primary.length > 1 || (ex.muscle_groups.secondary && ex.muscle_groups.secondary.length > 0)) && (
                                                  <span className="text-zinc-500">
                                                    {' • ' + [...ex.muscle_groups.primary.slice(1), ...(ex.muscle_groups.secondary || [])].slice(0, 3).join(', ')}
                                                  </span>
                                                )}
                                              </p>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => setNewWorkoutExercises(prev => prev.filter((_, i) => i !== idx))}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                      >
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                      </button>
                                  </div>
                              ))}
                          </div>
                      )}
                      <button 
                          onClick={() => setShowAddExerciseModal(true)}
                          className="w-full p-6 rounded-[2rem] border-2 border-dashed border-zinc-200 text-zinc-400 font-bold flex items-center justify-center gap-4 hover:border-blue-500 hover:text-blue-500 transition-all"
                      >
                          <BASE_ICONS.Plus className="w-6 h-6" /><span>Oefening Toevoegen</span>
                      </button>
                  </div>
                  <div className="space-y-4">
                      <label className="text-sm font-bold text-zinc-900">Beschrijving</label>
                      <textarea 
                        value={createWorkoutDesc}
                        onChange={e => setCreateWorkoutDesc(e.target.value)}
                        placeholder="Beschrijf je workout..." 
                        className="w-full p-6 bg-zinc-50 border-none rounded-[2rem] text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none"
                      ></textarea>
                  </div>
              </div>
              <div className="mt-12">
                  <button 
                    onClick={handleSaveCustomWorkout} 
                    disabled={!createWorkoutName || newWorkoutExercises.length === 0}
                    className="w-full p-6 bg-zinc-900 text-white rounded-[2rem] font-black text-lg active-scale disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Workout Opslaan
                  </button>
              </div>
          </div>
      )}

      {showAddExerciseModal && (
          <div className="fixed inset-0 z-[2020] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-8">
                  <div><p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-2">SELECTEER OEFENING</p><h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Toevoegen aan Workout</h1></div>
                  <button onClick={() => setShowAddExerciseModal(false)} className="p-6 bg-zinc-100 rounded-full active-scale"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </header>
              <div className="mb-8">
                  <div className="relative">
                      <BASE_ICONS.Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
                      <input 
                          type="text" 
                          placeholder="Zoek oefeningen..." 
                          value={exerciseSearchQuery}
                          onChange={(e) => setExerciseSearchQuery(e.target.value)}
                          className="w-full pl-16 pr-6 py-6 bg-zinc-50 border-none rounded-[2rem] text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                  <div className="space-y-4">
                      {allExercises
                          .filter(e => {
                              const matchesDiscipline = createWorkoutDisciplineId ? e.primary_discipline === createWorkoutDisciplineId : true;
                              const matchesSearch = e.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase());
                              return matchesDiscipline && matchesSearch;
                          })
                          .map(e => (
                              <button 
                                  key={e.id}
                                  onClick={() => {
                                      setNewWorkoutExercises(prev => [...prev, e]);
                                      setShowAddExerciseModal(false);
                                      setExerciseSearchQuery('');
                                  }}
                                  className="w-full flex items-center gap-6 p-4 bg-zinc-50 rounded-[2rem] hover:bg-zinc-100 transition-colors text-left"
                              >
                                  <div className="w-20 h-20 bg-zinc-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                                      <img src={getExerciseImage(e, contentGenderPreference)} className="w-full h-full object-cover" alt={e.name} />
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="text-xl font-black text-zinc-900 mb-1">{e.name}</h4>
                                      <p className="text-sm uppercase tracking-wider">
                                        <span className="font-bold text-zinc-400 mr-2">{e.category}</span>
                                        <span className="font-black text-zinc-700">{e.muscle_groups.primary[0]}</span>
                                        {(e.muscle_groups.primary.length > 1 || (e.muscle_groups.secondary && e.muscle_groups.secondary.length > 0)) && (
                                          <span className="font-bold text-zinc-400">
                                            {' • ' + [...e.muscle_groups.primary.slice(1), ...(e.muscle_groups.secondary || [])].slice(0, 3).join(', ')}
                                          </span>
                                        )}
                                      </p>
                                  </div>
                                  <div className="p-4 bg-white rounded-full shadow-sm">
                                      <BASE_ICONS.Plus className="w-6 h-6 text-blue-500" />
                                  </div>
                              </button>
                          ))
                      }
                      {allExercises.filter(e => {
                          const matchesDiscipline = createWorkoutDisciplineId ? e.primary_discipline === createWorkoutDisciplineId : true;
                          const matchesSearch = e.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase());
                          return matchesDiscipline && matchesSearch;
                      }).length === 0 && (
                          <div className="text-center py-12">
                              <p className="text-zinc-500 font-medium">Geen oefeningen gevonden.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}


      {showScheduleCalendar && (
          <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-2">PLANNING PROTOCOL</p>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Kalender & Schema</h1>
                  </div>
                  <button onClick={() => setShowScheduleCalendar(false)} className="p-6 bg-zinc-100 rounded-full active-scale">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
              </header>

              {/* Calendar View */}
              <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-black tracking-tighter">Oktober 2026</h2>
                      <div className="flex gap-2">
                          <button className="p-3 bg-zinc-100 rounded-full active-scale"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                          <button className="p-3 bg-zinc-100 rounded-full active-scale"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                      </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                      {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(day => (
                          <div key={day} className="text-xs font-bold text-zinc-400 uppercase">{day}</div>
                      ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {/* Empty days for offset */}
                      <div className="aspect-square rounded-2xl bg-transparent" />
                      <div className="aspect-square rounded-2xl bg-transparent" />
                      <div className="aspect-square rounded-2xl bg-transparent" />
                      {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isToday = day === 26;
                          const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
                          const hasWorkout = workouts.some(w => w.date === dateStr);
                          return (
                              <div 
                                key={day} 
                                onClick={() => setSelectedDateToAddWorkout(day)}
                                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer active-scale transition-colors ${isToday ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'}`}
                              >
                                  <span className={`text-lg font-bold ${isToday ? 'text-white' : 'text-zinc-900'}`}>{day}</span>
                                  {hasWorkout && (
                                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-emerald-500'}`} />
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Add Workout Button */}
              <div className="mb-12 flex gap-3">
                  <Button 
                    className="flex-1 py-6 text-lg tracking-tight shadow-xl bg-zinc-900 hover:bg-zinc-800 text-white border-none flex items-center justify-center gap-3"
                    onClick={() => setSelectedDateToAddWorkout(26)} // Default to today
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    WORKOUT TOEVOEGEN
                  </Button>
                  <Button 
                    className="py-6 px-6 text-lg tracking-tight shadow-xl bg-emerald-500 hover:bg-emerald-600 text-white border-none flex items-center justify-center gap-2"
                    onClick={() => setShowAiModal(true)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    AI
                  </Button>
              </div>

              {/* Schedule List */}
              <div>
                  <h2 className="text-2xl font-black tracking-tighter mb-6">Aankomende Sessies</h2>
                  <div className="space-y-4">
                      {workouts.length === 0 ? (
                        <p className="text-zinc-500 text-sm">Geen workouts gepland. Voeg er een toe!</p>
                      ) : (
                        workouts.map((workout, idx) => {
                          const day = parseInt(workout.date.split('-')[2], 10);
                          const isToday = day === 26;
                          
                          return (
                            <Card key={workout.id || idx} className="flex items-center gap-4 p-4 border-none shadow-sm bg-zinc-50">
                                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${isToday ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-200 text-zinc-600'}`}>
                                    <span className="text-xs font-bold uppercase">{isToday ? 'Vandaag' : 'Okt'}</span>
                                    <span className="text-xl font-black">{day}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-zinc-900">{workout.title}</h4>
                                    <p className="text-sm text-zinc-500">{workout.time} • {workout.type}</p>
                                </div>
                                {isToday && (
                                  <button 
                                    onClick={() => setActiveWorkout(workout)}
                                    className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md active-scale"
                                  >
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                  </button>
                                )}
                            </Card>
                          );
                        })
                      )}
                  </div>
              </div>

              {/* Add Workout Modal */}
              {selectedDateToAddWorkout !== null && (
                <div className="fixed inset-0 z-[2010] bg-black/50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedDateToAddWorkout(null)}>
                  <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm animate-in zoom-in-95 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter mb-1">Workout Toevoegen</h3>
                            <p className="text-sm font-bold text-zinc-400">{selectedDateToAddWorkout} Oktober 2026</p>
                        </div>
                        <button onClick={() => setSelectedDateToAddWorkout(null)} className="p-2 bg-zinc-100 rounded-full active-scale">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      {customWorkouts && customWorkouts.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Eigen Workouts</p>
                          {customWorkouts.map(cw => (
                            <button 
                              key={cw.id}
                              onClick={() => setSelectedWorkoutType(cw.id)}
                              className={`w-full p-5 rounded-2xl border font-bold text-left transition-colors flex items-center justify-between group mb-2 ${selectedWorkoutType === cw.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'}`}
                            >
                              <span>{cw.name}</span>
                              <svg className={`w-5 h-5 transition-colors ${selectedWorkoutType === cw.id ? 'text-blue-500' : 'text-zinc-300 group-hover:text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Standaard Categorieën</p>
                      <button 
                        onClick={() => setSelectedWorkoutType('Krachttraining')}
                        className={`w-full p-5 rounded-2xl border font-bold text-left transition-colors flex items-center justify-between group ${selectedWorkoutType === 'Krachttraining' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'}`}
                      >
                        <span>Krachttraining</span>
                        <svg className={`w-5 h-5 transition-colors ${selectedWorkoutType === 'Krachttraining' ? 'text-emerald-500' : 'text-zinc-300 group-hover:text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                      <button 
                        onClick={() => setSelectedWorkoutType('Cardio & Conditie')}
                        className={`w-full p-5 rounded-2xl border font-bold text-left transition-colors flex items-center justify-between group ${selectedWorkoutType === 'Cardio & Conditie' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'}`}
                      >
                        <span>Cardio & Conditie</span>
                        <svg className={`w-5 h-5 transition-colors ${selectedWorkoutType === 'Cardio & Conditie' ? 'text-emerald-500' : 'text-zinc-300 group-hover:text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                      <button 
                        onClick={() => setSelectedWorkoutType('Herstel / Yoga')}
                        className={`w-full p-5 rounded-2xl border font-bold text-left transition-colors flex items-center justify-between group ${selectedWorkoutType === 'Herstel / Yoga' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'}`}
                      >
                        <span>Herstel / Yoga</span>
                        <svg className={`w-5 h-5 transition-colors ${selectedWorkoutType === 'Herstel / Yoga' ? 'text-emerald-500' : 'text-zinc-300 group-hover:text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>

                    <Button 
                      onClick={handleAddWorkout}
                      disabled={!selectedWorkoutType}
                      className={`w-full py-5 rounded-2xl font-bold text-white active-scale border-none shadow-xl ${selectedWorkoutType ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-zinc-300 shadow-none'}`}
                    >
                      BEVESTIGEN
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Schedule Generator Modal */}
              {showAiModal && (
                <div className="fixed inset-0 z-[2010] bg-black/50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => !isGenerating && setShowAiModal(false)}>
                  <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm animate-in zoom-in-95 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter mb-1">Smart Coach</h3>
                            <p className="text-sm font-bold text-emerald-500">AI Schema Genereren</p>
                        </div>
                        <button onClick={() => !isGenerating && setShowAiModal(false)} className="p-2 bg-zinc-100 rounded-full active-scale" disabled={isGenerating}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-bold text-zinc-500 mb-2">Dagen per week ({aiDays})</label>
                        <input 
                          type="range" 
                          min="1" max="7" 
                          value={aiDays} 
                          onChange={(e) => setAiDays(parseInt(e.target.value))}
                          className="w-full accent-emerald-500"
                          disabled={isGenerating}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-zinc-500 mb-2">Doel</label>
                        <select 
                          value={aiGoal}
                          onChange={(e) => setAiGoal(e.target.value)}
                          className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          disabled={isGenerating}
                        >
                          <option value="Spieropbouw">Spieropbouw</option>
                          <option value="Afvallen">Afvallen</option>
                          <option value="Conditie verbeteren">Conditie verbeteren</option>
                          <option value="Algemene fitheid">Algemene fitheid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-zinc-500 mb-2">Apparatuur</label>
                        <select 
                          value={aiEquipment}
                          onChange={(e) => setAiEquipment(e.target.value)}
                          className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          disabled={isGenerating}
                        >
                          <option value="Sportschool (alles)">Sportschool (alles)</option>
                          <option value="Thuis (dumbbells)">Thuis (dumbbells)</option>
                          <option value="Lichaamsgewicht">Lichaamsgewicht</option>
                        </select>
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerateSchedule}
                      disabled={isGenerating}
                      className={`w-full py-5 rounded-2xl font-bold text-white active-scale border-none shadow-xl flex items-center justify-center gap-2 ${isGenerating ? 'bg-zinc-400' : 'bg-emerald-500 shadow-emerald-500/20'}`}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          SCHEMA MAKEN...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          GENEREER SCHEMA
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
          </div>
      )}

      {showProgressDashboard && (
          <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div><p className="text-[10px] font-black text-violet-600 uppercase tracking-[0.5em] mb-2">ANALYTICS PROTOCOL</p><h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Mijn Voortgang</h1></div>
                  <button onClick={() => setShowProgressDashboard(false)} className="p-6 bg-zinc-100 rounded-full active-scale"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </header>
              
              <div className="space-y-10">
                  <section>
                      <SectionHeader title="Algemene Statistieken" subtitle="Prestaties" />
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Workouts</p>
                              <p className="text-3xl font-black text-zinc-900">{workoutHistory?.length || 0}</p>
                          </div>
                          <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Duur</p>
                              <p className="text-3xl font-black text-zinc-900">
                                {(() => {
                                  const totalMins = workoutHistory?.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) || 0;
                                  const h = Math.floor(totalMins / 60);
                                  const m = totalMins % 60;
                                  return h > 0 ? `${h}u ${m}m` : `${m}m`;
                                })()}
                              </p>
                          </div>
                          <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Calorieën</p>
                              <p className="text-3xl font-black text-zinc-900">
                                {(workoutHistory?.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0) || 0).toLocaleString()}
                              </p>
                          </div>
                          <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Daely Punten</p>
                              <p className="text-3xl font-black text-zinc-900">{daelyPoints || 0} AP</p>
                          </div>
                          <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Reeks</p>
                              <p className="text-3xl font-black text-zinc-900">{streak || 0} Dagen</p>
                          </div>
                      </div>
                  </section>

                  <section>
                      <SectionHeader title="Gewichtstrend" subtitle="Lichaamssamenstelling" />
                      <Card className="bg-white border border-zinc-100 p-6 shadow-sm relative overflow-hidden">
                          <div className="mb-6 flex justify-between items-start">
                             <div>
                               <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">{latestWeight} <span className="text-xl text-zinc-500">KG</span></h3>
                               <p className="text-sm font-bold text-emerald-500 mt-1">Huidig gewicht</p>
                             </div>
                             <div className="flex items-center gap-2">
                               <input 
                                 type="number" 
                                 value={newWeight} 
                                 onChange={e => setNewWeight(e.target.value)} 
                                 placeholder="Bijv. 78.5" 
                                 className="w-24 p-2 rounded-xl border border-zinc-200 text-sm font-bold text-center focus:outline-none focus:border-emerald-500"
                               />
                               <Button onClick={handleLogWeight} className="py-2 px-4 bg-emerald-500 text-white rounded-xl font-bold text-sm">Log</Button>
                             </div>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartWeightData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                  itemStyle={{ color: '#18181b' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                      </Card>
                  </section>

                  <section>
                      <SectionHeader title="Energieverbruik" subtitle="Verbrande Calorieën" />
                      <Card className="bg-zinc-950 border-none p-6 shadow-xl relative overflow-hidden">
                          <div className="mb-6">
                             <h3 className="text-4xl font-black text-white tracking-tighter">
                               {(workoutHistory?.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0) || 0).toLocaleString()} <span className="text-xl text-zinc-500">KCAL</span>
                             </h3>
                             <p className="text-sm font-bold text-emerald-400 mt-1">Totaal verbrande calorieën</p>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={(() => {
                                const last7Days = Array.from({length: 7}, (_, i) => {
                                  const d = new Date();
                                  d.setDate(d.getDate() - (6 - i));
                                  return { date: d, name: d.toLocaleDateString('en-US', { weekday: 'short' }) };
                                });
                                return last7Days.map(day => {
                                  const dayWorkouts = workoutHistory?.filter(w => {
                                    if (!w.completedAt) return false;
                                    const wDate = w.completedAt.toDate ? w.completedAt.toDate() : new Date(w.completedAt);
                                    return wDate.toDateString() === day.date.toDateString();
                                  }) || [];
                                  return {
                                    name: day.name,
                                    calories: dayWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0)
                                  };
                                });
                              })()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }} />
                                <Tooltip 
                                  cursor={{ fill: '#27272a' }}
                                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', fontWeight: 'bold', color: '#fff' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                      </Card>
                  </section>

                  <section>
                      <SectionHeader title="Trainingsvolume" subtitle="Totaal Getild Gewicht" />
                      <Card className="bg-white border border-zinc-100 p-6 shadow-sm relative overflow-hidden">
                          <div className="mb-6">
                             <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">
                               {(workoutHistory?.reduce((acc, curr) => acc + (curr.totalVolume || 0), 0) || 0).toLocaleString()} <span className="text-xl text-zinc-500">KG</span>
                             </h3>
                             <p className="text-sm font-bold text-blue-500 mt-1">Totaal getild volume</p>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={(() => {
                                const last7Days = Array.from({length: 7}, (_, i) => {
                                  const d = new Date();
                                  d.setDate(d.getDate() - (6 - i));
                                  return { date: d, name: d.toLocaleDateString('en-US', { weekday: 'short' }) };
                                });
                                return last7Days.map(day => {
                                  const dayWorkouts = workoutHistory?.filter(w => {
                                    if (!w.completedAt) return false;
                                    const wDate = w.completedAt.toDate ? w.completedAt.toDate() : new Date(w.completedAt);
                                    return wDate.toDateString() === day.date.toDateString();
                                  }) || [];
                                  return {
                                    name: day.name,
                                    volume: dayWorkouts.reduce((acc, curr) => acc + (curr.totalVolume || 0), 0)
                                  };
                                });
                              })()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} />
                                <Tooltip 
                                  cursor={{ fill: '#f4f4f5' }}
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                      </Card>
                  </section>
                  
                  <section>
                      <SectionHeader title="Spiergroep Verdeling" subtitle="Afgelopen periode" />
                      <Card className="bg-white border border-zinc-100 p-6 shadow-sm relative overflow-hidden">
                          <div className="h-64 w-full">
                            {muscleGroupData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={muscleGroupData}>
                                  <PolarGrid stroke="#f4f4f5" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                  <Radar name="Sets" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold">
                                Nog niet genoeg data verzameld.
                              </div>
                            )}
                          </div>
                      </Card>
                  </section>

                  <section>
                      <div className="flex justify-between items-end mb-4">
                        <SectionHeader title="Kracht Progressie" subtitle="Geschatte 1RM" />
                        {uniqueExercises.length > 0 && (
                          <select 
                            value={selectedProgressExercise}
                            onChange={(e) => setSelectedProgressExercise(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500 mb-6"
                          >
                            {uniqueExercises.map(ex => (
                              <option key={ex} value={ex}>{ex}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <Card className="bg-white border border-zinc-100 p-6 shadow-sm relative overflow-hidden">
                          <div className="h-48 w-full">
                            {exerciseProgressionData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={exerciseProgressionData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} dy={10} />
                                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                  />
                                  <Line type="monotone" dataKey="e1RM" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold">
                                Selecteer een oefening of voltooi meer workouts.
                              </div>
                            )}
                          </div>
                      </Card>
                  </section>

                  <section>
                      <SectionHeader title="Macro Verdeling" subtitle="Voeding" />
                      <Card className="bg-white border border-zinc-100 p-6 shadow-sm relative overflow-hidden">
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dynamicMacroData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} stackOffset="expand">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 600 }} tickFormatter={(value) => `${value * 100}%`} />
                                <Tooltip 
                                  cursor={{ fill: '#f4f4f5' }}
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="protein" stackId="a" fill="#f97316" name="Eiwitten" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="carbs" stackId="a" fill="#eab308" name="Koolhydraten" />
                                <Bar dataKey="fat" stackId="a" fill="#ef4444" name="Vetten" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center gap-4 mt-4">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-xs font-bold text-zinc-500">Eiwitten</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs font-bold text-zinc-500">Koolhydraten</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs font-bold text-zinc-500">Vetten</span></div>
                          </div>
                      </Card>
                  </section>
              </div>
          </div>
      )}

      {showMyHabits && (
          <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
              <header className="flex justify-between items-end mb-12">
                  <div>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-2">DAGELIJKS PROTOCOL</p>
                      <h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Mijn Gewoontes</h1>
                  </div>
                  <button onClick={() => setShowMyHabits(false)} className="p-6 bg-zinc-100 rounded-full active-scale">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
              </header>

              <div className="flex-1">
                  <section className="mb-12">
                      <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Gewoontes van Vandaag</h2>
                          <span className="text-sm font-bold text-orange-500">{completedHabitsCount}/{HABIT_LIST.length} Voltooid</span>
                      </div>
                      
                      <div className="space-y-4">
                          {HABIT_LIST.map((habit, i) => {
                              const isCompleted = !!todayHabits[habit.id];
                              return (
                                  <div key={i} onClick={() => handleToggleHabit(habit.id)} className={`p-5 rounded-[2rem] border cursor-pointer active-scale ${isCompleted ? 'bg-orange-50 border-orange-200' : 'bg-white border-black/5'} flex items-center gap-4 transition-all`}>
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isCompleted ? 'bg-orange-100' : 'bg-zinc-100'}`}>
                                          {habit.icon}
                                      </div>
                                      <div className="flex-1">
                                          <p className={`text-sm font-semibold tracking-tight leading-none mb-1 ${isCompleted ? 'text-orange-900' : 'text-zinc-900'}`}>{habit.title}</p>
                                          <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-orange-600' : 'text-zinc-400'}`}>{habit.desc}</p>
                                      </div>
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300'}`}>
                                          {isCompleted && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </section>

                  <section>
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-6">Wekelijkse Consistentie</h2>
                      <div className="bg-zinc-950 p-6 rounded-[2rem] text-white">
                          <div className="flex justify-between items-end mb-8">
                              <div>
                                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">HUIDIGE REEKS</p>
                                  <p className="text-4xl font-black">12 Dagen</p>
                              </div>
                              <ICONS.Fire className="w-8 h-8 text-orange-500" />
                          </div>
                          <div className="flex justify-between">
                              {['M', 'D', 'W', 'D', 'V', 'Z', 'Z'].map((day, i) => (
                                  <div key={i} className="flex flex-col items-center gap-2">
                                      <div className={`w-8 h-12 rounded-full ${i < 3 ? 'bg-orange-500' : i === 3 ? 'bg-orange-500/50' : 'bg-white/10'}`} />
                                      <span className="text-[10px] font-black text-zinc-500">{day}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </section>
              </div>
          </div>
      )}

      
      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[6000] bg-zinc-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="relative h-80 w-full shrink-0">
            {selectedExercise.media?.video ? (
              <iframe 
                src={selectedExercise.media.video} 
                className="absolute inset-0 w-full h-full object-cover" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            ) : (
              <img src={getExerciseImage(selectedExercise, contentGenderPreference)} className="absolute inset-0 w-full h-full object-cover" alt={selectedExercise.name} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />
            <button onClick={() => setSelectedExercise(null)} className="absolute top-10 left-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white active-scale z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="absolute bottom-8 left-8 right-8 text-white pointer-events-none">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mb-2">{selectedExercise.primary_discipline} • {selectedExercise.category}</p>
              <h1 className="text-4xl font-black tracking-tighter leading-none">{selectedExercise.name}</h1>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pb-40 bg-white rounded-t-[2rem] -mt-6 relative z-10">
            <div className="flex gap-2 flex-wrap mb-8">
              {selectedExercise.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{tag}</span>
              ))}
            </div>
            
            <div className="space-y-8">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Moeilijkheid</span>
                  <span className="font-black text-zinc-900 capitalize">
                    {selectedExercise.difficulty === 'Beginner' ? 'Beginner' : 
                     selectedExercise.difficulty === 'Intermediate' ? 'Gemiddeld' : 
                     selectedExercise.difficulty === 'Advanced' ? 'Gevorderd' : 
                     selectedExercise.difficulty || "Beginner"}
                  </span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Type</span>
                  <span className="font-black text-zinc-900 capitalize">
                    {selectedExercise.exercise_type === 'Compound' ? 'Compound' : 
                     selectedExercise.exercise_type === 'Isolation' ? 'Isolatie' : 
                     selectedExercise.exercise_type || "Compound"}
                  </span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Apparatuur</span>
                  <span className="font-black text-zinc-900 capitalize">
                    {selectedExercise.equipment 
                      ? (typeof selectedExercise.equipment === 'string' 
                          ? (selectedExercise.equipment === 'Bodyweight' ? 'Lichaamsgewicht' : selectedExercise.equipment)
                          : selectedExercise.equipment.items?.map((item: string) => item === 'Bodyweight' ? 'Lichaamsgewicht' : item).join(', ') || "Lichaamsgewicht")
                      : "Lichaamsgewicht"}
                  </span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Primaire Spieren</span>
                  <span className="font-black text-zinc-900 capitalize">{selectedExercise.muscle_groups?.primary?.join(', ') || "-"}</span>
                </div>
              </div>

              {/* Instructions */}
              {selectedExercise.instruction_steps && selectedExercise.instruction_steps.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                    Stap-voor-stap Instructies
                  </h3>
                  <div className="space-y-4">
                    {selectedExercise.instruction_steps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">{step.step}</div>
                        <div>
                          <h4 className="font-bold text-zinc-900">{step.title}</h4>
                          <p className="text-zinc-500 text-sm leading-relaxed">{step.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coaching Cues */}
              {selectedExercise.coaching_cues && selectedExercise.coaching_cues.length > 0 && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Belangrijke Coaching Tips
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.coaching_cues.map((cue: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-blue-800 text-sm">
                        <span className="text-blue-400 font-bold">•</span>
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {selectedExercise.common_mistakes && selectedExercise.common_mistakes.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-black text-red-900 mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Veelgemaakte Fouten
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.common_mistakes.map((mistake: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-red-800 text-sm">
                        <span className="text-red-400 font-bold">✕</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Breathing & Sets/Reps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedExercise.breathing && (selectedExercise.breathing.inhale || selectedExercise.breathing.exhale) && (
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3">Ademhalingspatroon</h3>
                    <div className="space-y-2 text-sm">
                      {selectedExercise.breathing.inhale && (
                        <div className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Inademen</span>
                          <span className="font-medium text-zinc-900 text-right">
                            {typeof selectedExercise.breathing.inhale === 'string' 
                              ? selectedExercise.breathing.inhale
                                  .replace(/On the way down/i, 'Tijdens het zakken')
                                  .replace(/On the way up/i, 'Tijdens het omhoog komen')
                                  .replace(/During the eccentric phase/i, 'Tijdens de excentrische fase')
                                  .replace(/During the concentric phase/i, 'Tijdens de concentrische fase')
                                  .replace(/As you lower the weight/i, 'Terwijl je het gewicht laat zakken')
                                  .replace(/As you lift the weight/i, 'Terwijl je het gewicht optilt')
                              : selectedExercise.breathing.inhale}
                          </span>
                        </div>
                      )}
                      {selectedExercise.breathing.exhale && (
                        <div className="flex justify-between pt-1">
                          <span className="text-zinc-500">Uitademen</span>
                          <span className="font-medium text-zinc-900 text-right">
                            {typeof selectedExercise.breathing.exhale === 'string' 
                              ? selectedExercise.breathing.exhale
                                  .replace(/On the way down/i, 'Tijdens het zakken')
                                  .replace(/On the way up/i, 'Tijdens het omhoog komen')
                                  .replace(/During the eccentric phase/i, 'Tijdens de excentrische fase')
                                  .replace(/During the concentric phase/i, 'Tijdens de concentrische fase')
                                  .replace(/As you lower the weight/i, 'Terwijl je het gewicht laat zakken')
                                  .replace(/As you lift the weight/i, 'Terwijl je het gewicht optilt')
                              : selectedExercise.breathing.exhale}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedExercise.recommended_sets_reps && selectedExercise.recommended_sets_reps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3">Aanbevolen Sets & Reps</h3>
                    <div className="space-y-2 text-sm">
                      {selectedExercise.recommended_sets_reps.map((rec: any, idx: number) => (
                        <div key={idx} className={`flex justify-between ${idx !== selectedExercise.recommended_sets_reps.length - 1 ? 'border-b border-zinc-100 pb-2' : 'pt-1'}`}>
                          <span className="text-zinc-500">
                            {rec.level === 'Beginner' ? 'Beginner' : 
                             rec.level === 'Intermediate' ? 'Gemiddeld' : 
                             rec.level === 'Advanced' ? 'Gevorderd' : 
                             rec.level}
                          </span>
                          <span className="font-medium text-zinc-900 text-right">
                            {typeof rec.recommendation === 'string' ? rec.recommendation.replace('sets of', 'sets van') : rec.recommendation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Variations & Alternatives */}
              {((selectedExercise.variations && selectedExercise.variations.length > 0) || (selectedExercise.alternatives && selectedExercise.alternatives.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                  {selectedExercise.variations && selectedExercise.variations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3">Variaties</h3>
                      <ul className="space-y-2">
                        {selectedExercise.variations.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-zinc-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedExercise.alternatives && selectedExercise.alternatives.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3">Alternatieven</h3>
                      <ul className="space-y-2">
                        {selectedExercise.alternatives.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-zinc-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </>
  );
};
