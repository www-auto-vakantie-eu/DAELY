import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncPendingSettingsRequests } from '@/services/settings-requests';
import { getStoredWorkoutActivities, saveWorkoutActivities } from '@/services/workout-activities';
import type { WorkoutActivity } from '@/constants/workout-activities';

const STORAGE_KEYS = {
  activeThemeId: 'daely.activeThemeId',
  isLoggedIn: 'daely.isLoggedIn',
  appSettings: 'daely.appSettings.v1',
  accountType: 'daely.accountType.v1',
  userProfile: 'daely.userProfile.v1',
};

export type AccountType = 'standard' | 'influencer' | 'admin';

export type UserProfile = {
  name?: string;
  email?: string;
  country?: string;
  birthdate?: string;
  gender?: string;
  username?: string;
  trainingLevel?: string;
  trainingPreferences?: string;
  goals?: string;
  bodyStats?: string;
  injuries?: string;
  equipment?: string;
  motivation?: string;
  notifications?: string;
  role?: string;
  integrations?: string;
  contentStyle?: string;
  eventGoals?: string;
  privacy?: string;
  // Creator-specific fields (for influencer accountType)
  displayName?: string;
  creatorBadge?: string;
  creatorType?: string;
  creatorCode?: string;
  referralCode?: string;
  referralLink?: string;
  primaryDiscipline?: string;
  sportFocus?: string;
  activeSubscribers?: number;
  newSubscribersThisMonth?: number;
  freeMonthUsers?: number;
  failedPayments?: number;
  estimatedMonthlyReward?: number;
  rewardRate?: number;
  totalEstimatedReward?: number;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  [key: string]: unknown;
};

export type TabVisibilitySettings = {
  today: boolean;
  profile: boolean;
  disciplines: boolean;
  nutrition: boolean;
  mind: boolean;
  community: boolean;
  feed: boolean;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  darkMode: boolean;
  soundEffects: boolean;
  notifyWorkouts: boolean;
  notifyReminders: boolean;
  notifyCommunity: boolean;
  notifyChallenges: boolean;
  notifyMarketing: boolean;
  photoPreference: 'none' | 'man' | 'woman';
  visualLanguage: 'nl' | 'en';
  selectedVoice: string;
  audioLanguage: 'nl' | 'en';
  highContrast: boolean;
  reduceMotion: boolean;
  haptics: boolean;
  textSize: 'normaal' | 'groot' | 'extra';
  analytics: boolean;
  personalization: boolean;
  location: boolean;
  biometric: boolean;
  twoFactor: boolean;
  appLanguage: 'nl' | 'en';
  accountCountry: 'NL' | 'FR' | 'BE' | 'DE' | 'ES' | 'GB' | 'US';
  units: 'metric' | 'imperial';
  weekStart: 'maandag' | 'zondag';
  includeLogs: boolean;
  feedbackSubmittedCount: number;
  referralYearSubscriptions: number;
  tabVisibility: TabVisibilitySettings;
  disciplineVisibility: Record<string, boolean>;
};

const DEFAULT_TAB_VISIBILITY: TabVisibilitySettings = {
  today: true,
  profile: true,
  disciplines: true,
  nutrition: true,
  mind: true,
  community: true,
  feed: false,
};

function sanitizeTabVisibility(raw: unknown): TabVisibilitySettings {
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const next: TabVisibilitySettings = {
    today: typeof source.today === 'boolean' ? source.today : DEFAULT_TAB_VISIBILITY.today,
    profile: typeof source.profile === 'boolean' ? source.profile : DEFAULT_TAB_VISIBILITY.profile,
    disciplines: typeof source.disciplines === 'boolean' ? source.disciplines : DEFAULT_TAB_VISIBILITY.disciplines,
    nutrition: typeof source.nutrition === 'boolean' ? source.nutrition : DEFAULT_TAB_VISIBILITY.nutrition,
    mind: typeof source.mind === 'boolean' ? source.mind : DEFAULT_TAB_VISIBILITY.mind,
    community: true,
    feed: typeof source.feed === 'boolean' ? source.feed : DEFAULT_TAB_VISIBILITY.feed,
  };

  if (!next.today && !next.profile && !next.disciplines && !next.nutrition && !next.mind && !next.community) {
    return { ...DEFAULT_TAB_VISIBILITY };
  }

  return next;
}

function sanitizeAppSettings(raw: unknown): AppSettings {
  const source = raw && typeof raw === 'object' ? (raw as Partial<AppSettings>) : {};
  const disciplineVisibilitySource =
    source.disciplineVisibility && typeof source.disciplineVisibility === 'object'
      ? (source.disciplineVisibility as Record<string, unknown>)
      : {};

  const disciplineVisibility = Object.fromEntries(
    Object.entries(disciplineVisibilitySource).filter(([, value]) => typeof value === 'boolean')
  ) as Record<string, boolean>;

  return {
    ...DEFAULT_APP_SETTINGS,
    ...source,
    tabVisibility: sanitizeTabVisibility(source.tabVisibility),
    disciplineVisibility,
  };
}

const DEFAULT_APP_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  darkMode: false,
  soundEffects: true,
  notifyWorkouts: true,
  notifyReminders: true,
  notifyCommunity: true,
  notifyChallenges: true,
  notifyMarketing: false,
  photoPreference: 'none',
  visualLanguage: 'nl',
  selectedVoice: 'voice-female-1',
  audioLanguage: 'nl',
  highContrast: false,
  reduceMotion: false,
  haptics: true,
  textSize: 'normaal',
  analytics: false,
  personalization: true,
  location: false,
  biometric: true,
  twoFactor: false,
  appLanguage: 'nl',
  accountCountry: 'NL',
  units: 'metric',
  weekStart: 'maandag',
  includeLogs: true,
  feedbackSubmittedCount: 0,
  referralYearSubscriptions: 0,
  tabVisibility: DEFAULT_TAB_VISIBILITY,
  disciplineVisibility: {}, // discipline slug: true/false
};

interface AppContextType {
  // Auth states
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  accountType: AccountType;
  setAccountType: (value: AccountType) => void;
  activateTestCreatorAccount: () => Promise<void>;
  isAppHydrated: boolean;
  
  // Tab navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // AI Chat
  showAiChat: boolean;
  setShowAiChat: (value: boolean) => void;
  aiChatMessages: { role: 'user' | 'ai'; text: string }[];
  setAiChatMessages: (messages: { role: 'user' | 'ai'; text: string }[]) => void;
  aiChatInput: string;
  setAiChatInput: (input: string) => void;
  isAiChatLoading: boolean;
  setIsAiChatLoading: (loading: boolean) => void;
  
  // Workout states
  activeWorkout: any | null;
  setActiveWorkout: (workout: any | null) => void;
  currentExerciseIndex: number;
  setCurrentExerciseIndex: (index: number) => void;
  completedSets: Record<number, boolean[]>;
  setCompletedSets: (sets: Record<number, boolean[]>) => void;
  workoutActivities: WorkoutActivity[];
  addWorkoutActivity: (activity: WorkoutActivity) => Promise<void>;

  // Rest timer
  restTimer: number;
  setRestTimer: (time: number) => void;
  isResting: boolean;
  setIsResting: (resting: boolean) => void;
  showWorkoutComplete: boolean;
  setShowWorkoutComplete: (show: boolean) => void;
  
  // Theme
  activeThemeId: string;
  setActiveThemeId: (themeId: string) => void;
  
  // Disciplines
  selectedDiscipline: string;
  setSelectedDiscipline: (discipline: string) => void;
  selectedMuscleGroup: string;
  setSelectedMuscleGroup: (group: string) => void;

  // Settings
  appSettings: AppSettings;
  updateAppSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateAppSettings: (partial: Partial<AppSettings>) => void;

  // User profile (used by profile/health sub-screens)
  user: UserProfile;
  updateUser: (partial: Partial<UserProfile>) => Promise<void>;
  
  // Utilities
  fetchWorkouts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [accountTypeState, setAccountTypeState] = useState<AccountType>('standard');
  const [isAppHydrated, setIsAppHydrated] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState('today');
  
  // AI Chat
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  
  // Workouts
  const [activeWorkout, setActiveWorkout] = useState<any | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});
  const [workoutActivities, setWorkoutActivities] = useState<WorkoutActivity[]>([]);
  
  // Rest Timer
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);
  
  // Theme
  const [activeThemeIdState, setActiveThemeIdState] = useState('classic');
  
  // Disciplines
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [user, setUser] = useState<UserProfile>({});
  
  // Utilities
  const fetchWorkouts = useCallback(async () => {
    try {
      const activities = await getStoredWorkoutActivities();
      setWorkoutActivities(activities);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }, []);

  const addWorkoutActivity = useCallback(async (activity: WorkoutActivity) => {
    try {
      const current = await getStoredWorkoutActivities();
      const updated = [activity, ...current];
      await saveWorkoutActivities(updated);
      setWorkoutActivities(updated);
    } catch (error) {
      console.error('Error saving workout activity:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    const hydrateAppPreferences = async () => {
      try {
        const [savedThemeId, savedIsLoggedIn, savedAppSettings, savedAccountType, savedUserProfile] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.activeThemeId),
          AsyncStorage.getItem(STORAGE_KEYS.isLoggedIn),
          AsyncStorage.getItem(STORAGE_KEYS.appSettings),
          AsyncStorage.getItem(STORAGE_KEYS.accountType),
          AsyncStorage.getItem(STORAGE_KEYS.userProfile),
        ]);

        if (savedThemeId) {
          // Migrate old theme IDs to new theme IDs
          const themeMigration: Record<string, string> = {
            'default': 'classic',
            'forest-breath': 'zenInk',
            'pure-luxury': 'marble',
            'innovation': 'aurora',
            'pastel-calm': 'pastelCalm',
            'retro-sport': 'retroSport',
            'pulse': 'wave',
            'rogue': 'venom',
            'dune': 'saharaDune',
            'ember': 'volcanicAsh',
          };
          const normalizedThemeId = themeMigration[savedThemeId] || savedThemeId;
          setActiveThemeIdState(normalizedThemeId);
        }

        if (savedIsLoggedIn) {
          setIsLoggedInState(savedIsLoggedIn === 'true');
        }

        if (savedAppSettings) {
          const parsed = JSON.parse(savedAppSettings) as unknown;
          setAppSettings(sanitizeAppSettings(parsed));
        }

        if (savedAccountType === 'standard' || savedAccountType === 'influencer' || savedAccountType === 'admin') {
          setAccountTypeState(savedAccountType);
        }

        if (savedUserProfile) {
          const parsedUserProfile = JSON.parse(savedUserProfile) as UserProfile;
          if (parsedUserProfile && typeof parsedUserProfile === 'object') {
            setUser(parsedUserProfile);
          }
        }
      } catch (error) {
        console.error('Error hydrating app preferences:', error);
      } finally {
        setIsAppHydrated(true);
      }
    };

    hydrateAppPreferences();
  }, []);

  const setIsLoggedIn = useCallback(async (value: boolean) => {
    setIsLoggedInState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.isLoggedIn, String(value));
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  }, []);

  const setAccountType = useCallback(async (value: AccountType) => {
    setAccountTypeState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.accountType, value);
    } catch (error) {
      console.error('Error saving account type:', error);
    }
  }, []);

  const setActiveThemeId = useCallback(async (themeId: string) => {
    // Migrate old theme IDs to new theme IDs
    const themeMigration: Record<string, string> = {
      'default': 'classic',
      'forest-breath': 'zenInk',
      'pure-luxury': 'marble',
      'innovation': 'aurora',
      'pastel-calm': 'pastelCalm',
      'retro-sport': 'retroSport',
      'pulse': 'wave',
      'rogue': 'venom',
      'dune': 'saharaDune',
      'ember': 'volcanicAsh',
    };
    const normalizedThemeId = themeMigration[themeId] || themeId;
    setActiveThemeIdState(normalizedThemeId);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.activeThemeId, normalizedThemeId);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  const updateAppSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setAppSettings((prev) => {
      const next = {
        ...prev,
        [key]: key === 'tabVisibility' ? sanitizeTabVisibility(value) : value,
      } as AppSettings;
      AsyncStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(next)).catch((error) => {
        console.error('Error saving app setting:', error);
      });
      return next;
    });
  }, []);

  const updateAppSettings = useCallback((partial: Partial<AppSettings>) => {
    setAppSettings((prev) => {
      const next = {
        ...prev,
        ...partial,
        tabVisibility: sanitizeTabVisibility(partial.tabVisibility ?? prev.tabVisibility),
      };
      AsyncStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(next)).catch((error) => {
        console.error('Error saving app settings:', error);
      });
      return next;
    });
  }, []);

  const updateUser = useCallback(async (partial: Partial<UserProfile>) => {
    setUser((previous) => {
      const next = { ...previous, ...partial };
      AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(next)).catch((error) => {
        console.error('Error saving user profile:', error);
      });
      return next;
    });
  }, []);

  // Test creator account activation (for influencer accountType)
  const activateTestCreatorAccount = useCallback(async () => {
    await setAccountType('influencer');
    await updateUser({
      name: 'Mila Creator',
      displayName: 'Mila Creator',
      username: '@mila.daely',
      email: 'mila@daely.app',
      country: 'Netherlands',
      role: 'DAELY Creator',
      creatorBadge: 'DAELY Creator',
      creatorType: 'Athlete Creator',
      creatorCode: 'DAELY-MILA',
      referralCode: 'DAELY-MILA',
      referralLink: 'https://daely.app/invite/DAELY-MILA',
      primaryDiscipline: 'Fitness',
      sportFocus: 'Fitness, Running & Mindset',
      bio: 'DAELY Creator die sporters helpt starten met gezonde routines, workouts en mindset.',
      activeSubscribers: 128,
      newSubscribersThisMonth: 34,
      freeMonthUsers: 7,
      failedPayments: 3,
      estimatedMonthlyReward: 126.72,
      rewardRate: 0.99,
      totalEstimatedReward: 842.49,
      socialLinks: {
        instagram: 'https://instagram.com/mila.daely',
        tiktok: 'https://tiktok.com/@mila.daely',
        youtube: 'https://youtube.com/@mila.daely',
      },
    });
  }, [setAccountType, updateUser]);

  const attemptSyncPendingRequests = useCallback(async () => {
    try {
      await syncPendingSettingsRequests();
    } catch (error) {
      console.error('Error syncing pending settings requests:', error);
    }
  }, []);

  useEffect(() => {
    if (!isAppHydrated) {
      return;
    }

    attemptSyncPendingRequests();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        attemptSyncPendingRequests();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAppHydrated, attemptSyncPendingRequests]);

  const value: AppContextType = {
    isLoggedIn: isLoggedInState,
    setIsLoggedIn,
    accountType: accountTypeState,
    setAccountType,
    activateTestCreatorAccount,
    isAppHydrated,
    activeTab,
    setActiveTab,
    showAiChat,
    setShowAiChat,
    aiChatMessages,
    setAiChatMessages,
    aiChatInput,
    setAiChatInput,
    isAiChatLoading,
    setIsAiChatLoading,
    activeWorkout,
    setActiveWorkout,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    completedSets,
    setCompletedSets,
    workoutActivities,
    addWorkoutActivity,
    restTimer,
    setRestTimer,
    isResting,
    setIsResting,
    showWorkoutComplete,
    setShowWorkoutComplete,
    activeThemeId: activeThemeIdState,
    setActiveThemeId,
    selectedDiscipline,
    setSelectedDiscipline,
    selectedMuscleGroup,
    setSelectedMuscleGroup,
    appSettings,
    updateAppSetting,
    updateAppSettings,
    user,
    updateUser,
    fetchWorkouts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
