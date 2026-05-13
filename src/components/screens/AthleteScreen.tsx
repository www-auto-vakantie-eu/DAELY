import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { ICONS, BASE_ICONS } from '../ui/Icons';
import { Card, CustomBadge, Button, SectionHeader } from '../ui/SharedUI';
import { badges, allWorkouts } from '../../../data/seedData';
import { getGenderedImage } from '../../utils/imageUtils';
import type { Challenge, Recipe } from '../../../types';
import { fetchChallenges, fetchEvents, fetchPartners, fetchRecipes, getPreferredCountry, type CommunityEvent, type PartnerItem } from '../../services/contentApi';

export const AthleteScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    athleteSubTab,
    setAthleteSubTab,
    setShowSettings,
    setShowProgressDashboard,
    daelyPoints,
    userTier,
    streak,
    workouts,
    setActiveTab,
    setSelectedChallenge,
    setSelectedEvent,
    hasSubmittedFeedback,
    setShowFeedbackModal,
    selectedEvent,
    selectedChallenge,
    activeChallenges,
    setActiveChallenges,
    selectedCreator,
    setSelectedCreator,
    creatorSubTab,
    setCreatorSubTab,
    selectedSignatureMethod,
    setSelectedSignatureMethod,
    isPlayingSignatureMethod,
    setIsPlayingSignatureMethod,
    followedCreators,
    setFollowedCreators,
    toggleFollowCreator,
    activeHomeCreatorId,
    setActiveHomeCreatorId,
    contentGenderPreference
  } = useAppContext();

  const [activePartnerFilter, setActivePartnerFilter] = React.useState<string>(t('athlete.partners.all'));
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [events, setEvents] = React.useState<CommunityEvent[]>([]);
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [partners, setPartners] = React.useState<PartnerItem[]>([]);
  const [isContentLoading, setIsContentLoading] = React.useState(true);
  const [contentError, setContentError] = React.useState('');
  const [country] = React.useState(() => getPreferredCountry());

  React.useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setContentError('');
        const [challengeData, eventData, recipeData, partnerData] = await Promise.all([
          fetchChallenges(country),
          fetchEvents(country),
          fetchRecipes(undefined, country),
          fetchPartners(country),
        ]);

        if (isMounted) {
          setChallenges(challengeData);
          setEvents(eventData);
          setRecipes(recipeData);
          setPartners(partnerData);
        }
      } catch (error) {
        console.error('Failed to load athlete content:', error);
        if (isMounted) {
          setContentError('Een deel van de Athlete content kon niet worden geladen.');
        }
      } finally {
        if (isMounted) {
          setIsContentLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [country]);

  const renderPartners = () => {
    return (
      <div className="px-6 pb-40 bg-white min-h-screen -mx-6 pt-10">
        <div className="space-y-4 mb-12">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              to={`/partners/${partner.id}`}
              className="w-full bg-white border border-zinc-200 p-4 rounded-3xl text-center font-black text-base hover:border-blue-500 hover:shadow-lg transition-all active-scale no-underline"
            >
              {partner.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="px-6 pb-40 pt-16 animate-in fade-in duration-500">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">{t('athlete.title')}</h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">{t('athlete.subtitle')}</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-4 rounded-full bg-zinc-50 border border-black/5 text-zinc-400 active-scale">
          <ICONS.Settings className="w-6 h-6" />
        </button>
      </header>

      <div className="flex gap-8 mb-12 overflow-x-auto hide-scrollbar border-b border-zinc-100">
        {['Profile', 'PARTNERS', 'Challenges'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setAthleteSubTab(tab as any)} 
            className={`pb-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${athleteSubTab === tab ? 'text-zinc-900' : 'text-zinc-500'}`}
          >
            {tab === 'Profile' ? t('athlete.tabs.profile') : tab === 'PARTNERS' ? t('athlete.tabs.partners') : t('athlete.tabs.challenges')}
            {athleteSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
          </button>
        ))}
      </div>

      {athleteSubTab === 'Profile' && (
         <div className="animate-in fade-in duration-500">
            <section className="mb-12">
               <Card className="bg-white border border-black/5 p-12 flex flex-col items-center text-center shadow-2xl">
                  <div className="w-32 h-32 rounded-full accent-gradient p-1 mb-8 shadow-2xl active-scale cursor-pointer">
                     <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-5xl text-zinc-900 border-4 border-zinc-50">DB</div>
                  </div>
                  <h2 className="text-5xl font-black mb-2 tracking-tighter text-zinc-900 leading-none">Dylan Brouwers</h2>
                  <div className="flex items-center gap-3 mb-10"><CustomBadge level={userTier} /><span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">{t('athlete.profile.elite_member')}</span></div>
                  <div className="grid grid-cols-3 gap-12 w-full py-10 border-y border-zinc-100">
                     <div><p className="text-3xl font-black text-zinc-900">{daelyPoints}</p><p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">XP</p></div>
                     <div><p className="text-3xl font-black text-zinc-900">{streak}</p><p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">{t('athlete.profile.days')}</p></div>
                     <div><p className="text-3xl font-black text-zinc-900">Elite</p><p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">{t('athlete.profile.rank')}</p></div>
                  </div>
               </Card>
            </section>
            
            {!hasSubmittedFeedback && (
              <section id="feedback-win-sectie" className="mb-12">
                 <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                       <ICONS.Trophy className="w-24 h-24 text-blue-600" />
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">{t('athlete.profile.feedback_title')}</h3>
                       <p className="text-sm font-medium text-zinc-600 mb-6 leading-relaxed">{t('athlete.profile.feedback_desc')}</p>
                       <Button 
                          variant="primary" 
                          className="w-full py-4 text-sm tracking-widest uppercase shadow-blue-500/25"
                          onClick={() => setShowFeedbackModal(true)}
                       >
                          {t('athlete.profile.feedback_btn')}
                       </Button>
                    </div>
                 </Card>
              </section>
            )}

            <section className="mb-12">
               <SectionHeader title={t('athlete.profile.achievements')} subtitle={t('athlete.profile.badges')} />
               <div className="grid grid-cols-2 gap-4 pb-12">
                  {badges.map(badge => (
                     <Card key={badge.id} className={`flex flex-col items-center text-center p-8 active-scale ${badge.unlocked ? 'bg-white' : 'bg-zinc-50 opacity-50'}`}>
                        <div className="text-5xl mb-4 grayscale-[0.2]">{badge.icon}</div>
                        <h4 className="text-sm font-black text-zinc-900 mb-1 uppercase tracking-tight">{badge.name}</h4>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-3">{badge.category}</p>
                        <p className="text-[10px] text-zinc-500 font-medium leading-tight">{badge.description}</p>
                     </Card>
                  ))}
               </div>
            </section>
         </div>
      )}

      {athleteSubTab === 'PARTNERS' && renderPartners()}

      {athleteSubTab === 'Challenges' && (
         <div className="animate-in fade-in duration-500">
            {isContentLoading && (
              <Card className="p-6 mb-6 text-sm font-semibold text-zinc-500 border border-black/5">
                Challenges worden geladen...
              </Card>
            )}
            {!isContentLoading && contentError && (
              <Card className="p-6 mb-6 text-sm font-semibold text-red-600 border border-red-100 bg-red-50">
                {contentError}
              </Card>
            )}
            <section className="mb-8">
               <SectionHeader title={t('athlete.challenges.active')} subtitle={t('athlete.challenges.current_goals')} />
               <div className="space-y-4">
                  {Object.keys(activeChallenges).length > 0 ? (
                    Object.entries(activeChallenges).map(([challengeId, data]) => {
                      const challenge = challenges.find(c => c.id === challengeId);
                      if (!challenge) return null;
                      const progressPercent = Math.round((data.progress / challenge.duration_days) * 100);
                      return (
                        <div key={challengeId} onClick={() => setSelectedChallenge(challenge)} className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5 cursor-pointer hover:bg-zinc-100 transition-colors active-scale">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-black text-zinc-900">{challenge.name}</h4>
                              <span className="text-xs font-bold text-blue-600">{challenge.duration_days - data.progress} {t('athlete.challenges.days_left')}</span>
                           </div>
                           <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                           </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5 text-center">
                      <p className="text-zinc-500 font-medium text-sm">{t('athlete.challenges.no_active')}</p>
                    </div>
                  )}
               </div>
            </section>
            <section>
               <SectionHeader title={t('athlete.challenges.discover')} subtitle={t('athlete.challenges.available')} />
               <div className="grid grid-cols-1 gap-4">
                  {challenges.filter(c => !activeChallenges[c.id]).map(challenge => (
                     <Card key={challenge.id} noPadding onClick={() => setSelectedChallenge(challenge)} className="relative aspect-[16/9] group active-scale shadow-lg overflow-hidden border-none cursor-pointer">
                        <img src={getGenderedImage(challenge.image, contentGenderPreference, 'workout')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={challenge.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                           <div className="flex justify-between items-end mb-2">
                             <h4 className="text-2xl font-black leading-tight">{challenge.name}</h4>
                             <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                               {t(`athlete.challenges.difficulty.${challenge.difficulty.toLowerCase()}`)}
                             </span>
                           </div>
                           <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{challenge.duration_days} {t('athlete.profile.days')} • {challenge.reward_ap} AP</p>
                        </div>
                     </Card>
                  ))}
               </div>
            </section>
         </div>
      )}

      {athleteSubTab === 'Events' && (
         <div className="animate-in fade-in duration-500">
            {isContentLoading && (
              <Card className="p-6 mb-6 text-sm font-semibold text-zinc-500 border border-black/5">
                Events worden geladen...
              </Card>
            )}
            {!isContentLoading && contentError && (
              <Card className="p-6 mb-6 text-sm font-semibold text-red-600 border border-red-100 bg-red-50">
                {contentError}
              </Card>
            )}
            <section>
               <SectionHeader title={t('athlete.events.discover')} subtitle={t('athlete.events.upcoming')} />
               <div className="space-y-4">
                  {events.map(event => (
                     <div 
                        key={event.id} 
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 bg-zinc-50 rounded-[1.5rem] border border-black/5 flex items-center gap-4 cursor-pointer hover:bg-zinc-100 transition-colors active-scale"
                     >
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                           {event.logo ? (
                              <img src={event.logo} alt={event.name} className={`w-10 h-10 object-contain ${event.id === 'strong-viking' || event.id.startsWith('hyrox') ? 'brightness-0' : ''}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                           ) : (
                              <span className="text-xs font-black text-zinc-400">{event.name.substring(0, 2).toUpperCase()}</span>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-base font-black text-zinc-900 truncate">{event.name}</h4>
                           <p className="text-xs text-zinc-500 font-medium truncate">{event.date} • {event.location}</p>
                        </div>
                        <ICONS.ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                     </div>
                  ))}
               </div>
            </section>
         </div>
      )}

      {/* Event Details Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-500">
          <div className="relative h-72 shrink-0">
            <img src={getGenderedImage(selectedEvent.image, contentGenderPreference, 'workout')} alt={selectedEvent.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-12 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active-scale"
            >
              <ICONS.ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl p-2 shrink-0">
                  <img src={selectedEvent.logo} alt={selectedEvent.name} className={`w-full h-full object-contain ${selectedEvent.id === 'strong-viking' || selectedEvent.id.startsWith('hyrox') ? 'brightness-0' : ''}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
               </div>
               <div className="pb-2">
                  <span className="inline-block px-2 py-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md mb-2">
                    {t(`athlete.events.event_types.${selectedEvent.type.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`)}
                  </span>
                  <h2 className="text-3xl font-black text-white leading-none tracking-tighter">{selectedEvent.name}</h2>
               </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="flex items-center gap-4 mb-8">
               <div className="flex items-center gap-2 text-zinc-600">
                  <ICONS.Calendar className="w-4 h-4" />
                  <span className="text-sm font-bold">{selectedEvent.date}</span>
               </div>
               <div className="w-1 h-1 bg-zinc-300 rounded-full" />
               <div className="flex items-center gap-2 text-zinc-600">
                  <ICONS.MapPin className="w-4 h-4" />
                  <span className="text-sm font-bold">{selectedEvent.location}</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('athlete.events.participants')}</p>
                  <p className="text-sm font-black text-zinc-900">{selectedEvent.stats.participants}</p>
               </div>
               <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('athlete.events.type')}</p>
                  <p className="text-sm font-black text-zinc-900">
                    {t(`athlete.events.event_stats_types.${selectedEvent.stats.type.toLowerCase().replace(/ /g, '_')}`)}
                  </p>
               </div>
               <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('athlete.events.level')}</p>
                  <p className="text-sm font-black text-zinc-900">
                    {t(`athlete.events.event_levels.${selectedEvent.stats.difficulty.toLowerCase().replace(/\//g, '_').replace(/ /g, '_')}`)}
                  </p>
               </div>
            </div>

            <div className="mb-8">
               <h3 className="text-lg font-black text-zinc-900 mb-3">{t('athlete.events.about')}</h3>
               <p className="text-zinc-600 text-sm leading-relaxed font-medium">{selectedEvent.description}</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
             <Button variant="primary" className="w-full py-5 text-base shadow-xl shadow-blue-500/20">
                {t('athlete.events.register')}
             </Button>
          </div>
        </div>
      )}

      {/* Challenge Details Overlay */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-500">
          <div className="relative h-72 shrink-0">
            <img src={getGenderedImage(selectedChallenge.image, contentGenderPreference, 'workout')} alt={selectedChallenge.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <button 
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-12 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active-scale"
            >
              <ICONS.ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
               <div className="pb-2">
                  <span className="inline-block px-2 py-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md mb-2">
                    {t(`athlete.challenges.difficulty.${selectedChallenge.difficulty.toLowerCase()}`)}
                  </span>
                  <h2 className="text-3xl font-black text-white leading-none tracking-tighter">{selectedChallenge.name}</h2>
               </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="flex items-center gap-4 mb-8">
               <div className="flex items-center gap-2 text-zinc-600">
                  <ICONS.Calendar className="w-4 h-4" />
                  <span className="text-sm font-bold">{selectedChallenge.duration_days} {t('athlete.profile.days')}</span>
               </div>
               <div className="w-1 h-1 bg-zinc-300 rounded-full" />
               <div className="flex items-center gap-2 text-zinc-600">
                  <span className="text-sm font-bold text-blue-600">+{selectedChallenge.reward_ap} AP</span>
               </div>
            </div>

            <div className="mb-8">
               <h3 className="text-lg font-black text-zinc-900 mb-3">{t('athlete.challenges.objective')}</h3>
               <p className="text-zinc-600 text-sm leading-relaxed font-medium">{selectedChallenge.objective}</p>
            </div>

            {activeChallenges[selectedChallenge.id] ? (
              <div className="mb-8">
                 <h3 className="text-lg font-black text-zinc-900 mb-3">{t('athlete.challenges.progress')}</h3>
                 <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-black/5">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-lg font-black text-zinc-900">{t('athlete.challenges.day')} {activeChallenges[selectedChallenge.id].progress} {t('athlete.challenges.of')} {selectedChallenge.duration_days}</h4>
                       <span className="text-xs font-bold text-blue-600">{Math.round((activeChallenges[selectedChallenge.id].progress / selectedChallenge.duration_days) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 rounded-full overflow-hidden mb-6">
                       <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(activeChallenges[selectedChallenge.id].progress / selectedChallenge.duration_days) * 100}%` }} />
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => {
                        const currentProgress = activeChallenges[selectedChallenge.id].progress;
                        if (currentProgress < selectedChallenge.duration_days) {
                          setActiveChallenges(prev => ({
                            ...prev,
                            [selectedChallenge.id]: {
                              ...prev[selectedChallenge.id],
                              progress: currentProgress + 1
                            }
                          }));
                        }
                      }}
                    >
                      {t('athlete.challenges.complete_day')} {activeChallenges[selectedChallenge.id].progress + 1}
                    </Button>
                 </div>
              </div>
            ) : (
              <div className="mb-8">
                 <h3 className="text-lg font-black text-zinc-900 mb-3">{t('athlete.challenges.daily_tasks')}</h3>
                 <div className="space-y-3">
                   {selectedChallenge.days.slice(0, 3).map((day, idx) => (
                     <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-black/5 flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-zinc-400 shrink-0">
                         {day.day}
                       </div>
                       <div>
                         <h4 className="text-sm font-black text-zinc-900">{day.task}</h4>
                         <p className="text-xs text-zinc-500">{day.description}</p>
                       </div>
                     </div>
                   ))}
                   {selectedChallenge.days.length > 3 && (
                     <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5 flex items-center justify-center text-zinc-400 font-bold text-sm">
                       + {selectedChallenge.days.length - 3} {t('athlete.challenges.more_days')}
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>

          {!activeChallenges[selectedChallenge.id] && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
               <Button 
                 variant="primary" 
                 className="w-full py-5 text-base shadow-xl shadow-blue-500/20"
                 onClick={() => {
                   setActiveChallenges(prev => ({
                     ...prev,
                     [selectedChallenge.id]: { startDate: new Date().toISOString(), progress: 0 }
                   }));
                 }}
               >
                  {t('athlete.challenges.start')}
               </Button>
            </div>
          )}
        </div>
      )}

      {/* Signature Method Overlay */}
      {selectedSignatureMethod && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-500">
          <div className="relative h-72 shrink-0">
            {isPlayingSignatureMethod && selectedSignatureMethod.videoId ? (
               <iframe 
                 className="w-full h-full"
                 src={`https://www.youtube.com/embed/${selectedSignatureMethod.videoId}?autoplay=1&rel=0${selectedSignatureMethod.start ? `&start=${selectedSignatureMethod.start}` : ''}`}
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
            ) : (
               <>
                 <img src={getGenderedImage(selectedSignatureMethod.image, contentGenderPreference, 'mind')} alt={selectedSignatureMethod.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
               </>
            )}
            <button 
              onClick={() => { setSelectedSignatureMethod(null); setIsPlayingSignatureMethod(false); }}
              className="absolute top-12 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active-scale z-10"
            >
              <ICONS.ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white -mt-8 rounded-t-[2rem] relative z-10 px-6 pt-8 pb-32">
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{selectedSignatureMethod.author}</p>
             <h2 className="text-4xl font-black tracking-tighter text-zinc-900 mb-4 leading-none">{selectedSignatureMethod.title}</h2>
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8">
               {selectedSignatureMethod.duration.replace('MINS', t('mind.mins'))}
             </p>
             
             <p className="text-zinc-600 leading-relaxed mb-10 text-lg">{selectedSignatureMethod.description}</p>
             
             <h3 className="text-xl font-black text-zinc-900 mb-6">{t('athlete.signature.method_steps')}</h3>
             <div className="space-y-6 mb-10">
                {selectedSignatureMethod.steps.map((step: any, idx: number) => (
                   <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">
                         {idx + 1}
                      </div>
                      <div>
                         <h4 className="font-bold text-zinc-900 mb-1">{step.name}</h4>
                         <p className="text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
             
             {!isPlayingSignatureMethod && selectedSignatureMethod.videoId && (
               <button 
                 onClick={() => setIsPlayingSignatureMethod(true)}
                 className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest active-scale flex items-center justify-center gap-3"
               >
                  <ICONS.Play className="w-5 h-5" />
                  <span>{t('athlete.signature.start_session')}</span>
               </button>
             )}
          </div>
        </div>
      )}

      {/* Creator Profile Overlay */}
      {selectedCreator && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-500">
          <div className="relative h-72 shrink-0">
            <img src={getGenderedImage(selectedCreator.image, contentGenderPreference, 'workout')} alt={selectedCreator.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <button 
              onClick={() => setSelectedCreator(null)}
              className="absolute top-12 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active-scale z-10"
            >
              <ICONS.ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="absolute bottom-8 left-6 right-6 text-white">
               <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-4xl font-black tracking-tighter leading-none">{selectedCreator.name}</h2>
                  {selectedCreator.verified && <span className="text-blue-500 text-2xl">✓</span>}
               </div>
               <p className="text-sm font-bold opacity-80 mb-4">{selectedCreator.specialty}</p>
               <div className="flex items-center gap-3">
                  <a href={`https://instagram.com/${(selectedCreator.instagram || 'instagram').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                    <ICONS.Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a href={`https://tiktok.com/@${(selectedCreator.tiktok || 'tiktok').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                    <ICONS.Tiktok className="w-5 h-5 text-white" />
                  </a>
                  <a href={`https://youtube.com/@${(selectedCreator.youtube || 'youtube').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                    <ICONS.Youtube className="w-5 h-5 text-white" />
                  </a>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowCreator(selectedCreator.id);
                    }}
                    className={`ml-auto px-6 py-2 rounded-full font-bold text-sm transition-all ${
                      followedCreators.includes(selectedCreator.id) 
                        ? 'bg-white/20 text-white border border-white/30 backdrop-blur-md' 
                        : 'bg-white text-zinc-900'
                    }`}
                  >
                    {followedCreators.includes(selectedCreator.id) ? t('athlete.creator.following') : t('athlete.creator.follow')}
                  </button>
               </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white -mt-8 rounded-t-[2rem] relative z-10 px-6 pt-8 pb-32">
             <p className="text-zinc-600 leading-relaxed mb-8 text-sm">{selectedCreator.bio}</p>
             
             <div className="flex gap-8 mb-8 overflow-x-auto hide-scrollbar border-b border-zinc-100">
                {[t('athlete.creator.activity'), t('athlete.creator.workouts'), t('athlete.creator.nutrition')].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setCreatorSubTab(tab as any)} 
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${creatorSubTab === tab ? 'text-zinc-900' : 'text-zinc-400'}`}
                  >
                    {tab}
                    {creatorSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
                  </button>
                ))}
             </div>
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {creatorSubTab === t('athlete.creator.activity') && (
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><ICONS.Trophy className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-bold text-zinc-900 mb-1">{t('athlete.creator.activity_items.bench_press')}</p>
                            <p className="text-xs text-zinc-500">{t('athlete.creator.activity_items.bench_press_time')}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0"><ICONS.Mind className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-bold text-zinc-900 mb-1">{t('athlete.creator.activity_items.meditation')}</p>
                            <p className="text-xs text-zinc-500">{t('athlete.creator.activity_items.meditation_time')}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><BASE_ICONS.Nutrition className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-bold text-zinc-900 mb-1">{t('athlete.creator.activity_items.nutrition_plan')}</p>
                            <p className="text-xs text-zinc-500">{t('athlete.creator.activity_items.nutrition_plan_time')}</p>
                         </div>
                      </div>
                   </div>
                )}
                
                {creatorSubTab === t('athlete.creator.workouts') && (
                   <div className="space-y-4">
                      {allWorkouts.slice(0, 3).map(w => (
                         <Card key={w.id} className="bg-white border border-black/5 flex justify-between items-center group active-scale shadow-sm p-4">
                           <div className="flex-1 pr-4">
                             <h4 className="text-lg font-black text-zinc-900 leading-tight mb-1">{w.name}</h4>
                             <div className="flex gap-3 opacity-70 text-[10px] font-bold uppercase tracking-widest">
                               <span>{w.duration_min} {t('disciplines.min')}</span>
                               <span>{t(`athlete.challenges.difficulty.${w.difficulty.toLowerCase()}`)}</span>
                             </div>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <ICONS.Play className="w-4 h-4" />
                           </div>
                         </Card>
                      ))}
                   </div>
                )}

                {creatorSubTab === t('athlete.creator.nutrition') && (
                   <div className="space-y-4">
                      {recipes.slice(0, 3).map(r => (
                         <Card key={r.id} className="bg-white border border-black/5 flex justify-between items-center group active-scale shadow-sm p-4">
                           <div className="flex-1 pr-4">
                             <h4 className="text-lg font-black text-zinc-900 leading-tight mb-1">{r.name}</h4>
                             <div className="flex gap-3 opacity-70 text-[10px] font-bold uppercase tracking-widest">
                               <span>{r.calories} {t('athlete.creator.kcal')}</span>
                               <span>{r.protein}{t('athlete.creator.protein')}</span>
                             </div>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                             <BASE_ICONS.ChevronRight className="w-4 h-4" />
                           </div>
                         </Card>
                      ))}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
