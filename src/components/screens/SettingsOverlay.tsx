import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ICONS, BASE_ICONS } from '../ui/Icons';
import ThemeCardVisual from '../ui/ThemeCardVisual';
import { THEMES } from '../../data/appData';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export const SettingsOverlay: React.FC = () => {
  const {
    showSettings,
    setShowSettings,
    activeSettingsPage,
    setActiveSettingsPage,
    setIsLoggedIn,
    accountConfigView,
    setAccountConfigView,
    isWorkoutsVisible,
    setIsWorkoutsVisible,
    isProgressVisible,
    setIsProgressVisible,
    isPersonalizedPlanVisible,
    setIsPersonalizedPlanVisible,
    isHabitsVisible,
    setIsHabitsVisible,
    contentGenderPreference,
    setContentGenderPreference,
    selectedVoice,
    setSelectedVoice,
    language,
    setLanguage,
    activeThemeId,
    setActiveThemeId
  } = useAppContext();

  const currentUser = auth.currentUser;
  const profileName = currentUser?.displayName?.trim() || 'Gebruiker';
  const profileEmail = currentUser?.email?.trim() || 'Geen e-mail bekend';

  const [visualPrefsDraft, setVisualPrefsDraft] = React.useState({
    isWorkoutsVisible,
    isProgressVisible,
    isPersonalizedPlanVisible,
    isHabitsVisible,
  });

  React.useEffect(() => {
    if (accountConfigView === 'visual') {
      setVisualPrefsDraft({
        isWorkoutsVisible,
        isProgressVisible,
        isPersonalizedPlanVisible,
        isHabitsVisible,
      });
    }
  }, [accountConfigView, isWorkoutsVisible, isProgressVisible, isPersonalizedPlanVisible, isHabitsVisible]);

  const hasVisualDraftChanges =
    visualPrefsDraft.isWorkoutsVisible !== isWorkoutsVisible ||
    visualPrefsDraft.isProgressVisible !== isProgressVisible ||
    visualPrefsDraft.isPersonalizedPlanVisible !== isPersonalizedPlanVisible ||
    visualPrefsDraft.isHabitsVisible !== isHabitsVisible;

  const resetVisualDraft = () => {
    setVisualPrefsDraft({
      isWorkoutsVisible,
      isProgressVisible,
      isPersonalizedPlanVisible,
      isHabitsVisible,
    });
  };

  const applyVisualDraft = () => {
    setIsWorkoutsVisible(visualPrefsDraft.isWorkoutsVisible);
    setIsProgressVisible(visualPrefsDraft.isProgressVisible);
    setIsPersonalizedPlanVisible(visualPrefsDraft.isPersonalizedPlanVisible);
    setIsHabitsVisible(visualPrefsDraft.isHabitsVisible);
  };

  const changeLanguage = (lang: string) => {
    const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectField) {
      selectField.value = lang;
      selectField.dispatchEvent(new Event('change'));
    }
  };

  const SETTINGS_SECTIONS = [
    {
      title: 'Account',
      items: [
        { id: 'Account Configuratie', icon: BASE_ICONS.Profile, color: 'text-blue-500' },
        { id: 'Abonnement', icon: ICONS.Folder, color: 'text-rose-500' },
      ],
    },
    {
      title: 'App',
      items: [
        { id: "Thema's", icon: ICONS.Folder, color: 'text-purple-500' },
        { id: 'Training', icon: BASE_ICONS.Disciplines, color: 'text-orange-500' },
        { id: 'Voeding', icon: BASE_ICONS.Nutrition, color: 'text-emerald-500' },
        { id: 'Mind & Herstel', icon: BASE_ICONS.Mind, color: 'text-indigo-500' },
        { id: 'Integraties', icon: ICONS.Folder, color: 'text-cyan-500' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { id: 'Data & Privacy', icon: ICONS.Lock, color: 'text-zinc-500' },
      ],
    },
    {
      title: 'Meldingen',
      items: [
        { id: 'Notificaties', icon: ICONS.Folder, color: 'text-amber-500' },
        { id: 'Ondersteuning', icon: ICONS.Folder, color: 'text-zinc-400' },
      ],
    },
  ];

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 z-[4000] animate-in slide-in-from-bottom-full duration-500 overflow-y-auto pb-40 hide-scrollbar" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-base)' }}>
      <header className="px-10 pt-20 mb-12 flex justify-between items-end">
        {activeSettingsPage ? (
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveSettingsPage(null)} className="p-4 bg-zinc-100 rounded-full active-scale">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900">{activeSettingsPage}</h1>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Configuratie</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900">Systeem.</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Esthetisch Protocol</p>
          </div>
        )}
        <button onClick={() => { setShowSettings(false); setActiveSettingsPage(null); }} className="bg-zinc-100 p-6 rounded-full text-zinc-900 active-scale">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="px-6">
        {!activeSettingsPage ? (
          <div className="space-y-8">
            {SETTINGS_SECTIONS.map(section => (
              <section key={section.title}>
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">{section.title}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {section.items.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setActiveSettingsPage(page.id)}
                      className="daely-card p-6 rounded-[2rem] bg-white border border-black/5 flex items-center gap-6 active-scale shadow-lg hover:border-blue-500/20 group transition-all"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center ${page.color} group-hover:bg-zinc-900 group-hover:text-white transition-all`}>
                        <page.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-zinc-900 leading-none mb-1">{page.id}</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Beheer Voorkeuren</p>
                      </div>
                      <div className="ml-auto">
                        <BASE_ICONS.ChevronRight className="w-5 h-5 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            {activeSettingsPage === "Thema's" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  {THEMES.map(theme => (
                    <button 
                      key={theme.id}
                      onClick={() => setActiveThemeId(theme.id)}
                      className={`relative h-32 w-full rounded-[2rem] overflow-hidden transition-all duration-300 ${activeThemeId === theme.id ? 'ring-4 ring-blue-500 ring-offset-4 scale-[0.98]' : 'hover:scale-[1.02] shadow-lg'}`}
                    >
                      <ThemeCardVisual theme={theme} isActive={activeThemeId === theme.id} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                        <p className="text-white font-black text-lg tracking-tight">{theme.name}</p>
                        <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold mt-1">{theme.mood}</p>
                      </div>
                      {activeThemeId === theme.id && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <BASE_ICONS.Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSettingsPage === 'Account Configuratie' && (
              <div className="space-y-8">
                {accountConfigView === 'main' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    <section>
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">Persoonlijke Gegevens</h3>
                      <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                        <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-50 transition-colors">
                          <div>
                            <p className="text-xs font-bold text-zinc-500 mb-1">Naam</p>
                            <p className="text-lg font-black text-zinc-900">{profileName}</p>
                          </div>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </div>
                        <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-50 transition-colors">
                          <div>
                            <p className="text-xs font-bold text-zinc-500 mb-1">E-mail</p>
                            <p className="text-lg font-black text-zinc-900">{profileEmail}</p>
                          </div>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">App Voorkeuren</h3>
                      <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                        <button onClick={() => setAccountConfigView('visual')} className="w-full p-5 flex items-center justify-between group hover:bg-zinc-50 transition-colors text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                              <ICONS.Eye className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-lg font-black text-zinc-900">Visuele Instellingen</p>
                              <p className="text-xs font-bold text-zinc-500">Homepagina secties & taal</p>
                            </div>
                          </div>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </button>
                        <button onClick={() => setAccountConfigView('audio')} className="w-full p-5 flex items-center justify-between group hover:bg-zinc-50 transition-colors text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                              <ICONS.Music className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-lg font-black text-zinc-900">Audio Instellingen</p>
                              <p className="text-xs font-bold text-zinc-500">Spraakassistent & geluidseffecten</p>
                            </div>
                          </div>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </button>
                      </div>
                    </section>
                    <section>
                      <button 
                        onClick={async () => {
                          try {
                            await signOut(auth);
                            setIsLoggedIn(false);
                            setShowSettings(false);
                            setActiveSettingsPage(null);
                          } catch (error) {
                            console.error("Error signing out:", error);
                          }
                        }} 
                        className="w-full p-6 bg-red-50 text-red-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest active-scale border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        Uitloggen
                      </button>
                    </section>

                  </div>
                )}

                {accountConfigView === 'visual' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setAccountConfigView('main')} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ICONS.ChevronRight className="w-5 h-5 rotate-180" /></button>
                      <h3 className="text-2xl font-black text-zinc-900">Visuele Instellingen</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">Content Voorkeuren</h4>
                        <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden p-5">
                          <p className="text-sm font-bold text-zinc-900 mb-4">Voorkeur voor foto's en video's</p>
                          <div className="flex bg-zinc-100 p-1 rounded-2xl">
                            <button
                              onClick={() => setContentGenderPreference('none')}
                              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${contentGenderPreference === 'none' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                              Geen voorkeur
                            </button>
                            <button
                              onClick={() => setContentGenderPreference('man')}
                              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${contentGenderPreference === 'man' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                              Man
                            </button>
                            <button
                              onClick={() => setContentGenderPreference('woman')}
                              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${contentGenderPreference === 'woman' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                              Vrouw
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">Homepagina Secties</h4>
                        <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                          <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                            <span className="font-bold text-zinc-900">Mijn Workouts</span>
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={visualPrefsDraft.isWorkoutsVisible} onChange={(e) => setVisualPrefsDraft((prev) => ({ ...prev, isWorkoutsVisible: e.target.checked }))} />
                              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                            <span className="font-bold text-zinc-900">Mijn Voortgang</span>
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={visualPrefsDraft.isProgressVisible} onChange={(e) => setVisualPrefsDraft((prev) => ({ ...prev, isProgressVisible: e.target.checked }))} />
                              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                            <span className="font-bold text-zinc-900">Mijn Persoonlijke Schema</span>
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={visualPrefsDraft.isPersonalizedPlanVisible} onChange={(e) => setVisualPrefsDraft((prev) => ({ ...prev, isPersonalizedPlanVisible: e.target.checked }))} />
                              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                            <span className="font-bold text-zinc-900">Mijn Gewoontes</span>
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={visualPrefsDraft.isHabitsVisible} onChange={(e) => setVisualPrefsDraft((prev) => ({ ...prev, isHabitsVisible: e.target.checked }))} />
                              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-4">
                          <button
                            onClick={resetVisualDraft}
                            disabled={!hasVisualDraftChanges}
                            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:border-zinc-300 transition-colors"
                          >
                            Ongedaan maken
                          </button>
                          <button
                            onClick={applyVisualDraft}
                            disabled={!hasVisualDraftChanges}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                          >
                            Opslaan
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">Taal Instellingen</h4>
                        <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                          <div className="p-5">
                            <div className="grid grid-cols-2 gap-3">
                              <button onClick={() => changeLanguage('nl')} className="p-3 text-sm font-bold text-center rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">Nederlands</button>
                              <button onClick={() => changeLanguage('en')} className="p-3 text-sm font-bold text-center rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">Engels</button>
                              <button onClick={() => changeLanguage('de')} className="p-3 text-sm font-bold text-center rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">Duits</button>
                              <button onClick={() => changeLanguage('es')} className="p-3 text-sm font-bold text-center rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">Spaans</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {accountConfigView === 'audio' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setAccountConfigView('main')} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ICONS.ChevronRight className="w-5 h-5 rotate-180" /></button>
                      <h3 className="text-2xl font-black text-zinc-900">Audio Instellingen</h3>
                    </div>
                    <div className="space-y-4">
                      <button onClick={() => setAccountConfigView('voice')} className="w-full p-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm flex items-center justify-between group active-scale text-left hover:border-blue-500/30 transition-all">
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Assistent</p>
                          <p className="text-lg font-black text-zinc-900">Stem Selectie</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-blue-600">{selectedVoice}</span>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </button>
                      <button onClick={() => setAccountConfigView('language')} className="w-full p-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm flex items-center justify-between group active-scale text-left hover:border-blue-500/30 transition-all">
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Systeem</p>
                          <p className="text-lg font-black text-zinc-900">Taal</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-blue-600">{language}</span>
                          <ICONS.ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {accountConfigView === 'voice' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setAccountConfigView('audio')} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ICONS.ChevronRight className="w-5 h-5 rotate-180" /></button>
                      <h3 className="text-2xl font-black text-zinc-900">Stem Selectie</h3>
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                      {['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'].map(voice => (
                        <button 
                          key={voice}
                          onClick={() => setSelectedVoice(voice)}
                          className="w-full p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className={`text-lg font-black ${selectedVoice === voice ? 'text-blue-600' : 'text-zinc-900'}`}>{voice}</span>
                          {selectedVoice === voice && <BASE_ICONS.Check className="w-6 h-6 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {accountConfigView === 'language' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setAccountConfigView('audio')} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ICONS.ChevronRight className="w-5 h-5 rotate-180" /></button>
                      <h3 className="text-2xl font-black text-zinc-900">Taal</h3>
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden divide-y divide-zinc-50">
                      {['Engels', 'Nederlands', 'Duits', 'Spaans', 'Frans'].map(lang => (
                        <button 
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className="w-full p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className={`text-lg font-black ${language === lang ? 'text-blue-600' : 'text-zinc-900'}`}>{lang}</span>
                          {language === lang && <BASE_ICONS.Check className="w-6 h-6 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
