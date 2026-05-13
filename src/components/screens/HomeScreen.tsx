import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../ui/SharedUI';
import { ICONS } from '../ui/Icons';
import { useAppContext } from '../../context/AppContext';
import { getGenderedImage } from '../../utils/imageUtils';
import type { Creator } from '../../../types';
import { fetchCreators, getPreferredCountry } from '../../services/contentApi';

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [country] = useState(() => getPreferredCountry());
  const {
    streak,
    daelyPoints,
    showWelcome,
    homeCarouselRef,
    setActiveHomeSlide,
    isWorkoutsVisible,
    handleStartLongPress,
    handleEndLongPress,
    longPressProgress,
    activeHomeSlide,
    setShowMyWorkoutsOverlay,
    showQuickMenu,
    setShowQuickMenu,
    setShowMyNutritionOverlay,
    isProgressVisible,
    setShowProgressDashboard,
    isPersonalizedPlanVisible,
    setShowPersonalizedPlan,
    isHabitsVisible,
    setShowMyHabits,
    setShowScheduleCalendar,
    followedCreators,
    activeHomeCreatorId,
    selectHomeCreator,
    workouts,
    setActiveWorkout,
    contentGenderPreference
  } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    const loadCreators = async () => {
      try {
        const data = await fetchCreators(country);
        if (isMounted) {
          setCreators(data);
        }
      } catch (error) {
        console.error('Failed to load creators for home screen:', error);
      }
    };

    loadCreators();

    return () => {
      isMounted = false;
    };
  }, [country]);

  const activeCreator = useMemo(
    () => creators.find(c => c.id === activeHomeCreatorId) || null,
    [creators, activeHomeCreatorId]
  );

  return (
    <div className="px-6 pb-40 pt-12 animate-in fade-in duration-700 relative">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gradient leading-tight">Session.</h1>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-1">{t('home.subtitle')}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm">
            <ICONS.Fire className="text-orange-500 w-5 h-5" />
            <span className="text-xl font-black text-zinc-900">{streak}</span>
          </div>
          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{daelyPoints} AP</span>
        </div>
      </header>

      {followedCreators.length > 0 && (
        <section className="mb-8 -mx-6 px-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-4 pb-4">
            <div 
              onClick={() => selectHomeCreator(null)}
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${activeHomeCreatorId === null ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-100'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-zinc-900 text-white ${activeHomeCreatorId === null ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <span className="font-black text-xl">D</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-900">Daely</span>
            </div>
            
            {followedCreators.map(creatorId => {
              const creator = creators.find(c => c.id === creatorId);
              if (!creator) return null;
              
              const isActive = activeHomeCreatorId === creator.id;
              return (
                <div 
                  key={creator.id}
                  onClick={() => selectHomeCreator(creator.id)}
                  className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${isActive ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-100'}`}
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                    <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-900 truncate w-16 text-center">{creator.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-8">
        {showWelcome ? (
          <Card noPadding className="relative h-[420px] group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-zinc-950 animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 rounded-full accent-gradient p-1 mb-6 animate-bounce">
                {activeHomeCreatorId ? (
                  <img src={activeCreator?.image} alt="Creator" className="w-full h-full rounded-full object-cover border-4 border-zinc-950" />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-black text-2xl text-white">DB</div>
                )}
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter text-center leading-tight">
                {activeHomeCreatorId ? (
                  <>{t('home.protocol_by')}<br /><span className="text-blue-500">{activeCreator?.name || 'Creator'}</span></>
                ) : (
                  <>{t('home.welcome_back')}<br /><span className="text-blue-500">Dylan Brouwers.</span></>
                )}
              </h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-6">{t('home.initializing')}</p>
            </div>
          </Card>
        ) : (
          <div className="relative">
            <div 
              ref={homeCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = e.currentTarget.clientWidth;
                setActiveHomeSlide(Math.round(scrollLeft / width));
              }}
            >
              {isWorkoutsVisible && (
                <div className="w-full shrink-0 snap-center">
                  <Card noPadding className="relative h-[500px] w-full group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale animate-in fade-in duration-1000">
                    <img 
                      src={getGenderedImage("https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", contentGenderPreference, 'workout')} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                      alt="My Workouts"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mb-3">
                        {activeHomeCreatorId ? t('home.daily_protocol') : t('home.library')}
                      </span>
                      <h2 className="text-5xl font-black mb-4 leading-none tracking-tighter text-white">
                        {activeHomeCreatorId ? `${activeCreator?.name.split(' ')[0] || 'Creator'}'s Protocol` : t('home.my_workouts')}
                      </h2>
                      <p className="text-sm text-zinc-300 mb-8 max-w-[280px] font-medium leading-relaxed italic opacity-80">
                        {activeHomeCreatorId 
                          ? `"${activeCreator?.philosophy || t('home.train_like_pro')}"` 
                          : `"${t('home.personal_collection')}"`}
                      </p>
                      <Button 
                        className="w-full py-6 text-lg tracking-tight shadow-2xl bg-blue-600 hover:bg-blue-700 text-white border-none"
                        onMouseDown={handleStartLongPress}
                        onMouseUp={handleEndLongPress}
                        onTouchStart={handleStartLongPress}
                        onTouchEnd={handleEndLongPress}
                        onMouseLeave={handleEndLongPress}
                        onClick={() => { if (!showQuickMenu) setShowMyWorkoutsOverlay(true); }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <ICONS.Play className="w-5 h-5" />
                          {activeHomeCreatorId ? t('home.start_protocol') : t('home.open_library')}
                        </span>
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-75"
                          style={{ width: `${longPressProgress}%` }}
                        />
                      </Button>
                      {showQuickMenu && (
                         <div className="absolute bottom-24 left-10 mb-4 w-64 bg-zinc-950 rounded-[2rem] p-4 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200 z-[1000] origin-bottom-left">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 px-2">{t('home.most_recent')}</p>
                            <div className="space-y-2">
                               {(activeHomeCreatorId 
                                  ? workouts.filter(w => w.id.includes(activeHomeCreatorId.replace('c', '')) || w.id.includes('1')).slice(0, 3)
                                  : workouts.slice(0, 3)
                               ).map((w) => (
                                  <button 
                                    key={w.id} 
                                    onClick={() => {
                                      setActiveWorkout(w);
                                      setShowQuickMenu(false);
                                    }}
                                    className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold text-left flex items-center justify-between group/item"
                                  >
                                     <span className="truncate pr-2">{w.name}</span>
                                     <ICONS.Play className="w-4 h-4 text-blue-500 shrink-0" />
                                  </button>
                               ))}
                            </div>
                         </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              <div className="w-full shrink-0 snap-center">
                <Card noPadding className="relative h-[500px] w-full group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale animate-in fade-in duration-1000">
                  <img 
                    src={getGenderedImage("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800", contentGenderPreference, 'nutrition')} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                    alt="Mijn Voedingsschema"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-3">{t('home.meals_macros')}</span>
                    <h2 className="text-5xl font-black mb-4 leading-none tracking-tighter text-white">{t('home.my_nutrition')}</h2>
                    <p className="text-sm text-zinc-300 mb-8 max-w-[280px] font-medium leading-relaxed italic opacity-80">"{t('home.fuel_body')}"</p>
                    <Button 
                      className="w-full py-6 text-lg tracking-tight shadow-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                      onClick={() => setShowMyNutritionOverlay(true)}
                    >
                      {t('home.view_plan')}
                    </Button>
                  </div>
                </Card>
              </div>

              {isProgressVisible && (
                <div className="w-full shrink-0 snap-center">
                  <Card noPadding className="relative h-[500px] w-full group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale animate-in fade-in duration-1000">
                    <img 
                      src={getGenderedImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", contentGenderPreference, 'workout')} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                      alt="Mijn Voortgang"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-3">{t('home.stats_analysis')}</span>
                      <h2 className="text-5xl font-black mb-4 leading-none tracking-tighter text-white">{t('home.my_progress')}</h2>
                      <p className="text-sm text-zinc-300 mb-8 max-w-[280px] font-medium leading-relaxed italic opacity-80">"{t('home.track_journey')}"</p>
                      <Button 
                        className="w-full py-6 text-lg tracking-tight shadow-2xl bg-violet-500 hover:bg-violet-600 text-white border-none"
                        onClick={() => setShowProgressDashboard(true)}
                      >
                        {t('home.view_progress')}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {isPersonalizedPlanVisible && (
                <div className="w-full shrink-0 snap-center">
                  <Card noPadding className="relative h-[500px] w-full group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale animate-in fade-in duration-1000">
                    <img 
                      src={getGenderedImage("https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=800", contentGenderPreference, 'workout')} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                      alt="Mijn Persoonlijke Schema"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-3">{t('home.ai_generated')}</span>
                      <h2 className="text-5xl font-black mb-4 leading-none tracking-tighter text-white">{t('home.my_personalized_plan')}</h2>
                      <p className="text-sm text-zinc-300 mb-8 max-w-[280px] font-medium leading-relaxed italic opacity-80">"{t('home.roadmap_success')}"</p>
                      <Button 
                        className="w-full py-6 text-lg tracking-tight shadow-2xl bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                        onClick={() => setShowPersonalizedPlan(true)}
                      >
                        {t('home.open_plan')}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {isHabitsVisible && (
                <div className="w-full shrink-0 snap-center">
                  <Card noPadding className="relative h-[500px] w-full group border-none shadow-2xl overflow-hidden bg-zinc-900 active-scale animate-in fade-in duration-1000">
                    <img 
                      src={getGenderedImage("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800", contentGenderPreference, 'mind')} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                      alt="Mijn Gewoontes"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.5em] mb-3">{t('home.daily_tracking')}</span>
                      <h2 className="text-5xl font-black mb-4 leading-none tracking-tighter text-white">{t('home.my_habits')}</h2>
                      <p className="text-sm text-zinc-300 mb-8 max-w-[280px] font-medium leading-relaxed italic opacity-80">"{t('home.small_actions')}"</p>
                      <Button 
                        className="w-full py-6 text-lg tracking-tight shadow-2xl bg-orange-500 hover:bg-orange-600 text-white border-none"
                        onClick={() => setShowMyHabits(true)}
                      >
                        {t('home.track_habits')}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-10">
              {[
                isWorkoutsVisible,
                true,
                isProgressVisible,
                isPersonalizedPlanVisible,
                isHabitsVisible
              ].filter(Boolean).map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeHomeSlide === idx ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mb-12 overflow-visible">
        <div onClick={() => setShowScheduleCalendar(true)} className="mb-4 daely-card p-5 rounded-[2rem] bg-white border border-black/5 flex items-center gap-4 active-scale transition-all shadow-xl hover:border-emerald-500/30 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                <ICONS.Calendar className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-semibold tracking-tight text-zinc-900 leading-none mb-1">{t('home.calendar_schedule')}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('home.plan_success')}</p>
            </div>
            <div className="ml-auto">
                <ICONS.ChevronRight className="w-5 h-5 text-zinc-300" />
            </div>
        </div>
      </section>

      {showQuickMenu && <div className="fixed inset-0 z-[999]" onClick={() => setShowQuickMenu(false)} />}
    </div>
  );
};
