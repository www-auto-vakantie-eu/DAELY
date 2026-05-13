import React, { useEffect, useRef } from 'react';
import { useAppContext } from './src/context/AppContext';
import OnlyFor from './src/components/OnlyFor';
import UserWelcome from './src/components/user/UserWelcome';
import AdminWelcome from './src/components/admin/AdminWelcome';

import { ICONS, BASE_ICONS } from './src/components/ui/Icons';
import { THEMES } from './src/data/appData';

import { HomeScreen } from './src/components/screens/HomeScreen';
import { DisciplinesScreen } from './src/components/screens/DisciplinesScreen';
import { NutritionScreen } from './src/components/screens/NutritionScreen';
import { MindScreen } from './src/components/screens/MindScreen';
import { CommunityScreen } from './src/components/screens/CommunityScreen';
import { AthleteScreen } from './src/components/screens/AthleteScreen';
import { LoginScreen, CreateAccountScreen, ForgotPasswordScreen } from './src/components/screens/AuthScreens';
import { AppModals } from './src/components/screens/AppModals';
import { AiChatModal } from './src/components/screens/AiChatModal';
import { LiveWorkoutModal } from './src/components/screens/LiveWorkoutModal';
import { FeedbackModal } from './src/components/screens/FeedbackModal';
import { SettingsOverlay } from './src/components/screens/SettingsOverlay';
import { PersonalizedPlanModal } from './src/components/screens/PersonalizedPlanModal';
import { SelectedRecipeModal } from './src/components/screens/SelectedRecipeModal';
import { DataUploadModal } from './src/components/screens/DataUploadModal';
import ThemeCardVisual from './src/components/ui/ThemeCardVisual';

const App: React.FC = () => {
    const {
    isLoggedIn,
    isCreatingAccount,
    isForgotPassword,
    activeTab,
    setActiveTab,
    activeHomeSlide,
    showWelcome,
    setShowWelcome,
    activeThemeId,
    fetchWorkouts,
    showAiChat,
    aiChatMessages,
    setAiChatMessages,
    aiChatInput,
    setAiChatInput,
    setIsAiChatLoading,
    setActiveWorkout,
    setCurrentExerciseIndex,
    setCompletedSets,
    restTimer,
    setRestTimer,
    isResting,
    setIsResting,
    setShowWorkoutComplete,
    selectedDiscipline,
    setSelectedMuscleGroup,
    homeCarouselRef,
    userRole
  } = useAppContext();
const changeLanguage = (lang: string) => {
    const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectField) {
      selectField.value = lang;
      selectField.dispatchEvent(new Event('change'));
    }
  };
  // States for overlays and sub-navigation
  const fileInputRef = useRef<HTMLInputElement>(null);
  // AI Schedule Generator State
  // AI Chat State
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Live Workout State
  // Rest Timer Effect
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
  }, [isResting, restTimer]);

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

  const finishWorkout = () => {
    setShowWorkoutComplete(true);
    // In a real app, we would save the completed workout data here
  };

  const closeLiveWorkout = () => {
    setActiveWorkout(null);
    setCurrentExerciseIndex(0);
    setCompletedSets({});
    setRestTimer(0);
    setIsResting(false);
    setShowWorkoutComplete(false);
  };

  useEffect(() => {
    if (showAiChat && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, showAiChat]);

  const handleSendAiMessage = async () => {
    if (!aiChatInput.trim()) return;
    
    const userMessage = aiChatInput.trim();
    setAiChatInput('');
    setAiChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('AI chat request failed');
      }

      const data = await response.json();

      setAiChatMessages(prev => [...prev, { role: 'ai', text: data.text || "Sorry, ik kon even geen antwoord bedenken." }]);
    } catch (error) {
      console.error("Error generating chat response:", error);
      setAiChatMessages(prev => [...prev, { role: 'ai', text: "Er ging iets mis met de verbinding. Probeer het later nog eens!" }]);
    } finally {
      setIsAiChatLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    setSelectedMuscleGroup('All');
  }, [selectedDiscipline]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--daely-primary', theme.primary);
    root.style.setProperty('--daely-secondary', theme.secondary);
    root.style.setProperty('--bg-base', theme.bg);
    root.style.setProperty('--text-base', theme.text);
  }, [activeThemeId]);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!showWelcome && homeCarouselRef.current) {
      const width = homeCarouselRef.current.clientWidth;
      homeCarouselRef.current.scrollTo({ left: width * activeHomeSlide, behavior: 'instant' });
    }
  }, [showWelcome]);

  // Removed renderHome, using HomeScreen component instead


  if (!isLoggedIn) {
    if (isCreatingAccount) return <CreateAccountScreen />;
    if (isForgotPassword) return <ForgotPasswordScreen />;
    return <LoginScreen />;
  }

  // Role-based routing: toon specifieke dashboards
  if (userRole) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col font-inter selection:bg-blue-500/30 overflow-hidden animate-in fade-in duration-1000" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-base)' }}>
        <main className="flex-1 flex flex-col items-center justify-center">
          <OnlyFor roles={['user']}>
            <UserWelcome />
          </OnlyFor>
          <OnlyFor roles={['influencer', 'partner', 'event_manager']}>
            <AdminWelcome />
          </OnlyFor>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col font-inter selection:bg-blue-500/30 overflow-hidden animate-in fade-in duration-1000" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-base)' }}>
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {activeTab === 'Home' && <HomeScreen />}
        {activeTab === 'Disciplines' && <DisciplinesScreen />}
        {activeTab === 'Voeding' && <NutritionScreen />}
        {activeTab === 'Mind' && <MindScreen />}
        {activeTab === 'Community' && <CommunityScreen />}
        {activeTab === 'Athlete' && <AthleteScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[100]">
        <div className="bg-white/80 backdrop-blur-3xl border-t border-zinc-100 px-10 pt-8 pb-14 flex justify-between items-center rounded-t-[3.5rem] shadow-xl">
          {[
            { id: 'Home', icon: BASE_ICONS.Profile },
            { id: 'Disciplines', icon: BASE_ICONS.Disciplines },
            { id: 'Voeding', icon: BASE_ICONS.Nutrition },
            { id: 'Mind', icon: BASE_ICONS.Mind },
            { id: 'Community', icon: BASE_ICONS.Community },
            { id: 'Athlete', icon: ICONS.Settings }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-1 group">
              <div className={`${activeTab === tab.id ? 'text-blue-600 scale-125 -translate-y-3' : 'text-blue-300'} transition-all duration-500`}><tab.icon className={`w-7 h-7 ${activeTab === tab.id ? 'stroke-[3px]' : 'stroke-[2px]'}`} /></div>
              <div className={`w-2 h-2 rounded-full accent-gradient transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
            </button>
          ))}
        </div>
      </nav>

      <AppModals />
      <AiChatModal />
      <LiveWorkoutModal />
      <FeedbackModal />
      <SettingsOverlay />
      <PersonalizedPlanModal />
      <SelectedRecipeModal />
      <DataUploadModal />
    </div>
  );
};

export default App;
