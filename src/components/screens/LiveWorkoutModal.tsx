import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/SharedUI';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';

export const LiveWorkoutModal: React.FC = () => {
  const {
    user,
    activeWorkout,
    setActiveWorkout,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    completedSets,
    setCompletedSets,
    restTimer,
    setRestTimer,
    isResting,
    setIsResting,
    showWorkoutComplete,
    setShowWorkoutComplete,
    setDaelyPoints,
    workoutHistory,
    streak,
    setStreak
  } = useAppContext();

  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [exerciseSetsCount, setExerciseSetsCount] = useState<Record<number, number>>({});
  
  // Focus Mode State
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(false);
  const [focusLostTime, setFocusLostTime] = useState<number | null>(null);
  const [showFocusLostWarning, setShowFocusLostWarning] = useState(false);
  const [focusPenalty, setFocusPenalty] = useState(0);
  
  // State to track logged values per set: { [exerciseIndex]: { [setIndex]: { weight: number, reps: number } } }
  const [setLogs, setSetLogs] = useState<Record<number, Record<number, { weight: string, reps: string }>>>({});

  // Wake Lock State
  const [wakeLock, setWakeLock] = useState<any>(null);

  // Request Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await (navigator as any).wakeLock.request('screen');
          setWakeLock(lock);
          console.log('Screen Wake Lock is active');
        }
      } catch (err: any) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
      }
    };

    if (activeWorkout && !showWorkoutComplete) {
      requestWakeLock();
    }

    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          setWakeLock(null);
          console.log('Screen Wake Lock released');
        });
      }
    };
  }, [activeWorkout, showWorkoutComplete]);

  // Re-acquire Wake Lock on visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && activeWorkout && !showWorkoutComplete) {
        try {
          if ('wakeLock' in navigator) {
            const lock = await (navigator as any).wakeLock.request('screen');
            setWakeLock(lock);
          }
        } catch (err: any) {
          console.error(`Wake Lock error on visibility change: ${err.name}, ${err.message}`);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeWorkout, showWorkoutComplete]);

  useEffect(() => {
    if (activeWorkout && !showWorkoutComplete && !workoutStartTime) {
      setWorkoutStartTime(Date.now());
      const initialCounts: Record<number, number> = {};
      activeWorkout.exercises?.forEach((ex: any, idx: number) => {
        initialCounts[idx] = ex.sets || 3;
      });
      setExerciseSetsCount(initialCounts);
    }
  }, [activeWorkout, showWorkoutComplete, workoutStartTime]);

  // Workout duration timer
  useEffect(() => {
    let interval: any;
    if (workoutStartTime && !showWorkoutComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStartTime, showWorkoutComplete]);

  // Rest timer
  useEffect(() => {
    let interval: any;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer, setRestTimer, setIsResting]);

  // Focus Mode Logic (Page Visibility API)
  useEffect(() => {
    if (!isFocusModeEnabled || showWorkoutComplete) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User left the app
        setFocusLostTime(Date.now());
      } else {
        // User returned
        if (focusLostTime) {
          const timeAway = (Date.now() - focusLostTime) / 1000;
          if (timeAway > 5) { // 5 seconds grace period
            const penalty = Math.min(Math.floor(timeAway), 50); // Lose 1 point per second, max 50
            setFocusPenalty(penalty);
            setShowFocusLostWarning(true);
            setDaelyPoints(prev => Math.max(0, Math.min(1000000, prev - penalty)));
            
            if (user) {
              try {
                await updateDoc(doc(db, 'users', user.uid), {
                  daelyPoints: increment(-penalty)
                });
              } catch (error) {
                console.error("Failed to update daely points", error);
              }
            }
          }
          setFocusLostTime(null);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isFocusModeEnabled, showWorkoutComplete, focusLostTime, setDaelyPoints, user]);

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    setCompletedSets(prev => {
      const currentExerciseSets = prev[exerciseIndex] || [];
      const newExerciseSets = [...currentExerciseSets];
      newExerciseSets[setIndex] = !newExerciseSets[setIndex];
      
      // If marking as complete, start rest timer
      if (newExerciseSets[setIndex]) {
        startRestTimer(90); // 90 seconds default rest
      }
      
      return { ...prev, [exerciseIndex]: newExerciseSets };
    });
  };

  const handleLogChange = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setSetLogs(prev => ({
      ...prev,
      [exerciseIndex]: {
        ...(prev[exerciseIndex] || {}),
        [setIndex]: {
          ...(prev[exerciseIndex]?.[setIndex] || { weight: '', reps: '' }),
          [field]: value
        }
      }
    }));
  };

  const finishWorkout = async () => {
    setShowWorkoutComplete(true);
    
    if (user && activeWorkout) {
      try {
        const durationMs = workoutStartTime ? Date.now() - workoutStartTime : 0;
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
        
        // Count total completed sets and calculate volume
        let totalCompletedSets = 0;
        let totalVolume = 0;
        
        const detailedExercises = activeWorkout.exercises.map((ex: any, exIdx: number) => {
          const sets = [];
          const setCount = exerciseSetsCount[exIdx] || ex.sets || 3;
          let max1RM = 0;
          for (let i = 0; i < setCount; i++) {
            if (completedSets[exIdx]?.[i]) {
              totalCompletedSets++;
              const log = setLogs[exIdx]?.[i];
              const weight = parseFloat(log?.weight || '0');
              const reps = parseInt(log?.reps || '0');
              if (weight > 0 && reps > 0) {
                totalVolume += (weight * reps);
                sets.push({ weight, reps });
                const e1RM = weight * (1 + reps / 30);
                if (e1RM > max1RM) max1RM = e1RM;
              }
            }
          }
          return {
            name: ex.name || ex.exercise_id,
            category: ex.category || '',
            muscle_groups: ex.muscle_groups || { primary: [] },
            sets,
            max1RM
          };
        }).filter((ex: any) => ex.sets.length > 0);

        // Estimate calories (very rough estimate: ~5-8 kcal per minute of weightlifting)
        const estimatedCalories = durationMinutes * 6;

        const path = `users/${user.uid}/workoutHistory`;
        await addDoc(collection(db, path), {
          userId: user.uid,
          workoutId: activeWorkout.id || 'custom',
          title: activeWorkout.title || activeWorkout.name || 'Workout',
          durationMinutes: durationMinutes,
          caloriesBurned: estimatedCalories,
          completedSetsCount: totalCompletedSets,
          totalVolume: totalVolume,
          exercises: detailedExercises,
          completedAt: serverTimestamp()
        });

        // Gamification: Update Daely Points and Streak
        const pointsEarned = 50 + Math.floor(durationMinutes / 10) * 10; // 50 base + 10 per 10 mins
        
        let newStreak = streak;
        if (workoutHistory && workoutHistory.length > 0) {
          const lastWorkout = workoutHistory[0];
          if (lastWorkout.completedAt) {
            const lastDate = lastWorkout.completedAt.toDate ? lastWorkout.completedAt.toDate() : new Date(lastWorkout.completedAt);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate.toDateString() === yesterday.toDateString()) {
              newStreak += 1;
            } else if (lastDate.toDateString() !== today.toDateString()) {
              newStreak = 1;
            }
          }
        } else {
          newStreak = 1; // First workout
        }

        setDaelyPoints(prev => Math.max(0, Math.min(1000000, prev + pointsEarned)));
        setStreak(newStreak);

        await updateDoc(doc(db, 'users', user.uid), {
          daelyPoints: increment(pointsEarned),
          streak: newStreak
        });

      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/workoutHistory`);
      }
    }
  };

  const closeLiveWorkout = () => {
    setActiveWorkout(null);
    setCurrentExerciseIndex(0);
    setCompletedSets({});
    setSetLogs({});
    setRestTimer(0);
    setIsResting(false);
    setShowWorkoutComplete(false);
    setWorkoutStartTime(null);
    setElapsedTime(0);
    setIsFocusModeEnabled(false);
    setFocusLostTime(null);
    setShowFocusLostWarning(false);
    setFocusPenalty(0);
  };

  const getPreviousStats = (exerciseName: string, setIdx: number) => {
    if (!workoutHistory) return null;
    for (const pastWorkout of workoutHistory) {
      const pastEx = pastWorkout.exercises?.find((e: any) => e.name === exerciseName);
      if (pastEx && pastEx.sets && pastEx.sets[setIdx]) {
        return pastEx.sets[setIdx];
      }
    }
    return null;
  };

  if (!activeWorkout) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-zinc-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between shadow-sm z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-500 font-bold text-sm uppercase tracking-wider font-mono">{formatTime(elapsedTime)}</p>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900">{activeWorkout.title || activeWorkout.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFocusModeEnabled(!isFocusModeEnabled)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 transition-colors ${isFocusModeEnabled ? 'bg-violet-100 text-violet-600 border border-violet-200' : 'bg-zinc-100 text-zinc-500 border border-transparent hover:bg-zinc-200'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            {isFocusModeEnabled ? 'FOCUS AAN' : 'FOCUS UIT'}
          </button>
          <button onClick={closeLiveWorkout} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-40 hide-scrollbar">
        {showWorkoutComplete ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <span className="text-6xl">🏆</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-4">Lekker bezig!</h1>
            <p className="text-lg text-zinc-500 mb-12 max-w-xs mx-auto">Je hebt {activeWorkout.title || activeWorkout.name} succesvol afgerond in {formatTime(elapsedTime)}. Tijd om te herstellen!</p>
            <Button onClick={closeLiveWorkout} className="w-full max-w-xs py-6 text-lg font-bold bg-zinc-900 text-white rounded-2xl shadow-xl hover:bg-zinc-800">
              TERUG NAAR HOME
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {activeWorkout.exercises && activeWorkout.exercises.length > 0 ? (
              activeWorkout.exercises.map((exercise: any, exIdx: number) => (
                <div key={exIdx} className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">{exercise.name || exercise.exercise_id}</h3>
                      {exercise.muscle_groups && (
                        <p className="text-[10px] uppercase tracking-widest mt-1">
                          <span className="font-bold text-zinc-400 mr-2">{exercise.category}</span>
                          <span className="font-black text-blue-500">{exercise.muscle_groups.primary[0]}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full whitespace-nowrap">{exercise.sets} sets</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Column Headers */}
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest w-8">Set</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">KG</span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">Reps</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest w-12 text-center">Klaar</span>
                    </div>

                    {Array.from({ length: exerciseSetsCount[exIdx] || exercise.sets || 3 }).map((_, setIdx) => {
                      const isComplete = completedSets[exIdx]?.[setIdx] || false;
                      const log = setLogs[exIdx]?.[setIdx] || { weight: '', reps: '' };
                      const prevStats = getPreviousStats(exercise.name || exercise.exercise_id, setIdx);
                      
                      return (
                        <div key={setIdx} className={`flex flex-col p-3 rounded-2xl border-2 transition-all duration-300 ${isComplete ? 'border-emerald-500 bg-emerald-50/50' : 'border-zinc-100 bg-zinc-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isComplete ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                              {setIdx + 1}
                            </div>
                            
                            <div className="flex gap-2 flex-1 justify-center px-4">
                              <div className="flex flex-col items-center relative">
                                <input 
                                  type="number" 
                                  placeholder={prevStats ? prevStats.weight.toString() : "-"}
                                  value={log.weight}
                                  onChange={(e) => handleLogChange(exIdx, setIdx, 'weight', e.target.value)}
                                  disabled={isComplete}
                                  className="w-16 h-10 bg-white border border-zinc-200 rounded-xl text-center font-bold text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:bg-transparent"
                                />
                                {prevStats && !log.weight && <span className="text-[8px] font-bold text-zinc-400 mt-1 absolute -bottom-4 whitespace-nowrap">Vorige: {prevStats.weight}</span>}
                              </div>
                              <div className="flex flex-col items-center relative">
                                <input 
                                  type="number" 
                                  placeholder={prevStats ? prevStats.reps.toString() : (exercise.reps?.toString() || "-")}
                                  value={log.reps}
                                  onChange={(e) => handleLogChange(exIdx, setIdx, 'reps', e.target.value)}
                                  disabled={isComplete}
                                  className="w-16 h-10 bg-white border border-zinc-200 rounded-xl text-center font-bold text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:bg-transparent"
                                />
                                {prevStats && !log.reps && <span className="text-[8px] font-bold text-zinc-400 mt-1 absolute -bottom-4 whitespace-nowrap">Vorige: {prevStats.reps}</span>}
                              </div>
                            </div>

                            <button 
                              onClick={() => toggleSetComplete(exIdx, setIdx)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all active-scale ${isComplete ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white border-2 border-zinc-200 text-zinc-300 hover:border-emerald-200 hover:text-emerald-200'}`}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-6">
                    <button 
                      onClick={() => setExerciseSetsCount(prev => ({ ...prev, [exIdx]: Math.max(1, (prev[exIdx] || exercise.sets || 3) - 1) }))}
                      className="px-4 py-2 text-xs font-bold text-zinc-500 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                      - Set Verwijderen
                    </button>
                    <button 
                      onClick={() => setExerciseSetsCount(prev => ({ ...prev, [exIdx]: (prev[exIdx] || exercise.sets || 3) + 1 }))}
                      className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      + Set Toevoegen
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>Geen specifieke oefeningen gevonden voor deze workout.</p>
                <p className="text-sm mt-2">Gebruik de timer hieronder voor je eigen routine.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Area (Timer & Finish) */}
      {!showWorkoutComplete && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pt-20">
          {isResting && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border border-zinc-100 flex items-center gap-3 animate-in slide-in-from-bottom-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-xl text-zinc-900">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1">Rust</span>
              <button onClick={() => setIsResting(false)} className="ml-2 text-zinc-400 hover:text-zinc-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          )}
          <Button 
            onClick={finishWorkout}
            className="w-full py-6 text-lg font-black tracking-tight bg-zinc-900 text-white rounded-2xl shadow-2xl hover:bg-zinc-800 active-scale"
          >
            WORKOUT AFRONDEN
          </Button>
        </div>
      )}

      {/* Focus Lost Warning Modal */}
      {showFocusLostWarning && (
        <div className="fixed inset-0 z-[7000] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 tracking-tighter mb-2">Focus Verloren!</h3>
            <p className="text-zinc-500 mb-6">Je hebt de app verlaten tijdens je workout. Blijf gefocust op je doelen!</p>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8">
              <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">Penalty</p>
              <p className="text-3xl font-black text-red-500">-{focusPenalty} XP</p>
            </div>
            <Button 
              onClick={() => setShowFocusLostWarning(false)}
              className="w-full py-4 text-lg font-bold bg-zinc-900 text-white rounded-xl shadow-xl hover:bg-zinc-800"
            >
              IK BLIJF NU HIER
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
