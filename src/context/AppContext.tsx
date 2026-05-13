import React, { createContext, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { THEMES, EVENTS_DATA, MIND_CATEGORIES, SIGNATURE_METHODS } from '../data/appData';
import { defaultWeekPlan, foodDatabase } from '../data/nutritionData';
import type { Discipline, Exercise, Recipe, Meditation, Challenge, Creator, SubscriptionTier } from '../../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, getDoc, collection, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

import type { UserRole } from '../../types';

interface AppContextType {
    userRole: UserRole | null;
    setUserRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  // Add all state variables here
  user: User | null;
  isAuthReady: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingAccount: boolean;
  setIsCreatingAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isForgotPassword: boolean;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isWorkoutsVisible: boolean;
  setIsWorkoutsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isProgressVisible: boolean;
  setIsProgressVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPersonalizedPlanVisible: boolean;
  setIsPersonalizedPlanVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isHabitsVisible: boolean;
  setIsHabitsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentGenderPreference: 'man' | 'woman' | 'none';
  setContentGenderPreference: React.Dispatch<React.SetStateAction<'man' | 'woman' | 'none'>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeHomeSlide: number;
  setActiveHomeSlide: React.Dispatch<React.SetStateAction<number>>;
  showWelcome: boolean;
  setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
  activeThemeId: string;
  setActiveThemeId: React.Dispatch<React.SetStateAction<string>>;
  perspectiveCreator: Creator | null;
  setPerspectiveCreator: React.Dispatch<React.SetStateAction<Creator | null>>;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  activeSettingsPage: string | null;
  setActiveSettingsPage: React.Dispatch<React.SetStateAction<string | null>>;
  isEditingProfilePic: boolean;
  setIsEditingProfilePic: React.Dispatch<React.SetStateAction<boolean>>;
  profileImage: string | null;
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  selectedIcon: string | null;
  setSelectedIcon: React.Dispatch<React.SetStateAction<string | null>>;
  showIconPicker: boolean;
  setShowIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
  showProgressDashboard: boolean;
  setShowProgressDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  showScheduleCalendar: boolean;
  setShowScheduleCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateToAddWorkout: number | null;
  setSelectedDateToAddWorkout: React.Dispatch<React.SetStateAction<number | null>>;
  selectedWorkoutType: string | null;
  setSelectedWorkoutType: React.Dispatch<React.SetStateAction<string | null>>;
  workouts: any[];
  setWorkouts: React.Dispatch<React.SetStateAction<any[]>>;
  fetchWorkouts: () => Promise<void>;
  customWorkouts: any[];
  setCustomWorkouts: React.Dispatch<React.SetStateAction<any[]>>;
  weightLogs: any[];
  setWeightLogs: React.Dispatch<React.SetStateAction<any[]>>;
  dailyHabits: Record<string, Record<string, boolean>>;
  setDailyHabits: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  showAiModal: boolean;
  setShowAiModal: React.Dispatch<React.SetStateAction<boolean>>;
  aiDays: number;
  setAiDays: React.Dispatch<React.SetStateAction<number>>;
  aiGoal: string;
  setAiGoal: React.Dispatch<React.SetStateAction<string>>;
  aiEquipment: string;
  setAiEquipment: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  showAiChat: boolean;
  setShowAiChat: React.Dispatch<React.SetStateAction<boolean>>;
  aiChatMessages: {role: 'user' | 'ai', text: string}[];
  setAiChatMessages: React.Dispatch<React.SetStateAction<{role: 'user' | 'ai', text: string}[]>>;
  aiChatInput: string;
  setAiChatInput: React.Dispatch<React.SetStateAction<string>>;
  isAiChatLoading: boolean;
  setIsAiChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeWorkout: any | null;
  setActiveWorkout: React.Dispatch<React.SetStateAction<any | null>>;
  currentExerciseIndex: number;
  setCurrentExerciseIndex: React.Dispatch<React.SetStateAction<number>>;
  completedSets: Record<number, boolean[]>;
  setCompletedSets: React.Dispatch<React.SetStateAction<Record<number, boolean[]>>>;
  restTimer: number;
  setRestTimer: React.Dispatch<React.SetStateAction<number>>;
  isResting: boolean;
  setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
  showWorkoutComplete: boolean;
  setShowWorkoutComplete: React.Dispatch<React.SetStateAction<boolean>>;
  showMyChallenges: boolean;
  setShowMyChallenges: React.Dispatch<React.SetStateAction<boolean>>;
  showEvents: boolean;
  setShowEvents: React.Dispatch<React.SetStateAction<boolean>>;
  showMyWorkoutsOverlay: boolean;
  setShowMyWorkoutsOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateWorkout: boolean;
  setShowCreateWorkout: React.Dispatch<React.SetStateAction<boolean>>;
  createWorkoutDisciplineId: string;
  setCreateWorkoutDisciplineId: React.Dispatch<React.SetStateAction<string>>;
  showAddExerciseModal: boolean;
  setShowAddExerciseModal: React.Dispatch<React.SetStateAction<boolean>>;
  exerciseSearchQuery: string;
  setExerciseSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  newWorkoutExercises: Exercise[];
  setNewWorkoutExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  showMyHabits: boolean;
  setShowMyHabits: React.Dispatch<React.SetStateAction<boolean>>;
  showMyNutritionOverlay: boolean;
  setShowMyNutritionOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  nutritionSelectedDay: string;
  setNutritionSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  nutritionPlan: {day: string, meals: {id: string, type: string, time: string, recipeId: string, isConsumed: boolean, customDetails?: {name: string, kcal: number, protein: number, carbs: number, fats: number}}[]}[];
  setNutritionPlan: React.Dispatch<React.SetStateAction<{day: string, meals: {id: string, type: string, time: string, recipeId: string, isConsumed: boolean, customDetails?: {name: string, kcal: number, protein: number, carbs: number, fats: number}}[]}[]>>;
  showGroceryList: boolean;
  setShowGroceryList: React.Dispatch<React.SetStateAction<boolean>>;
  showWeekOverview: boolean;
  setShowWeekOverview: React.Dispatch<React.SetStateAction<boolean>>;
  showSwapMeal: {day: string, mealId: string, mealType: string} | null;
  setShowSwapMeal: React.Dispatch<React.SetStateAction<{day: string, mealId: string, mealType: string} | null>>;
  showAddCustomFood: boolean;
  setShowAddCustomFood: React.Dispatch<React.SetStateAction<boolean>>;
  customFoodForm: { name: string, kcal: number, protein: number, carbs: number, fats: number };
  setCustomFoodForm: React.Dispatch<React.SetStateAction<{ name: string, kcal: number, protein: number, carbs: number, fats: number }>>;
  foodSearchQuery: string;
  setFoodSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  foodSearchResults: typeof foodDatabase;
  setFoodSearchResults: React.Dispatch<React.SetStateAction<typeof foodDatabase>>;
  isSearchingFood: boolean;
  setIsSearchingFood: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNutritionRecipe: any | null;
  setSelectedNutritionRecipe: React.Dispatch<React.SetStateAction<any | null>>;
  recipeServings: number;
  setRecipeServings: React.Dispatch<React.SetStateAction<number>>;
  showNutritionSettings: boolean;
  setShowNutritionSettings: React.Dispatch<React.SetStateAction<boolean>>;
  nutritionGoal: string;
  setNutritionGoal: React.Dispatch<React.SetStateAction<string>>;
  nutritionKcalTarget: number;
  setNutritionKcalTarget: React.Dispatch<React.SetStateAction<number>>;
  nutritionMacros: { protein: number, carbs: number, fats: number };
  setNutritionMacros: React.Dispatch<React.SetStateAction<{ protein: number, carbs: number, fats: number }>>;
  showPersonalizedPlan: boolean;
  setShowPersonalizedPlan: React.Dispatch<React.SetStateAction<boolean>>;
  planGenerating: boolean;
  setPlanGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  personalizedPlan: string | null;
  setPersonalizedPlan: React.Dispatch<React.SetStateAction<string | null>>;
  showQuickMenu: boolean;
  setShowQuickMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showDataUploadModal: boolean;
  setShowDataUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataUploadType: string;
  setDataUploadType: React.Dispatch<React.SetStateAction<string>>;
  dataUploadAction: string;
  setDataUploadAction: React.Dispatch<React.SetStateAction<string>>;
  dataUploadFile: File | null;
  setDataUploadFile: React.Dispatch<React.SetStateAction<File | null>>;
  dataUploadSuccess: boolean;
  setDataUploadSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  showFeedbackModal: boolean;
  setShowFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackRating: number;
  setFeedbackRating: React.Dispatch<React.SetStateAction<number>>;
  feedbackUsability: number;
  setFeedbackUsability: React.Dispatch<React.SetStateAction<number>>;
  feedbackPrimaryUse: string;
  setFeedbackPrimaryUse: React.Dispatch<React.SetStateAction<string>>;
  feedbackText: string;
  setFeedbackText: React.Dispatch<React.SetStateAction<string>>;
  hasSubmittedFeedback: boolean;
  setHasSubmittedFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  showFeedbackSuccess: boolean;
  setShowFeedbackSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDiscipline: Discipline | null;
  setSelectedDiscipline: React.Dispatch<React.SetStateAction<Discipline | null>>;
  selectedExercise: Exercise | null;
  setSelectedExercise: React.Dispatch<React.SetStateAction<Exercise | null>>;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  selectedMeditation: Meditation | null;
  setSelectedMeditation: React.Dispatch<React.SetStateAction<Meditation | null>>;
  discSubTab: 'Workouts' | 'Exercises' | 'Programs';
  setDiscSubTab: React.Dispatch<React.SetStateAction<'Workouts' | 'Exercises' | 'Programs'>>;
  athleteSubTab: 'Profile' | 'PARTNERS' | 'Challenges' | 'Events';
  setAthleteSubTab: React.Dispatch<React.SetStateAction<'Profile' | 'PARTNERS' | 'Challenges' | 'Events'>>;
  selectedMuscleGroup: string;
  setSelectedMuscleGroup: React.Dispatch<React.SetStateAction<string>>;
  selectedMindCategory: string;
  setSelectedMindCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSignatureMethod: any;
  setSelectedSignatureMethod: React.Dispatch<React.SetStateAction<any>>;
  isPlayingSignatureMethod: boolean;
  setIsPlayingSignatureMethod: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: any;
  setSelectedEvent: React.Dispatch<React.SetStateAction<any>>;
  selectedChallenge: Challenge | null;
  setSelectedChallenge: React.Dispatch<React.SetStateAction<Challenge | null>>;
  selectedCreator: Creator | null;
  setSelectedCreator: React.Dispatch<React.SetStateAction<Creator | null>>;
  creatorSubTab: 'Activity' | 'Workouts' | 'Nutrition';
  setCreatorSubTab: React.Dispatch<React.SetStateAction<'Activity' | 'Workouts' | 'Nutrition'>>;
  activeChallenges: Record<string, { startDate: string, progress: number }>;
  setActiveChallenges: React.Dispatch<React.SetStateAction<Record<string, { startDate: string, progress: number }>>>;
  followedCreators: string[];
  setFollowedCreators: React.Dispatch<React.SetStateAction<string[]>>;
  activeHomeCreatorId: string | null;
  setActiveHomeCreatorId: React.Dispatch<React.SetStateAction<string | null>>;
  workoutHistory: any[];
  setWorkoutHistory: React.Dispatch<React.SetStateAction<any[]>>;
  toggleFollowCreator: (creatorId: string) => Promise<void>;
  selectHomeCreator: (creatorId: string | null) => Promise<void>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  showLanguageSelector: boolean;
  setShowLanguageSelector: React.Dispatch<React.SetStateAction<boolean>>;
  accountConfigView: 'main' | 'visual' | 'audio' | 'voice' | 'language';
  setAccountConfigView: React.Dispatch<React.SetStateAction<'main' | 'visual' | 'audio' | 'voice' | 'language'>>;
  selectedVoice: string;
  setSelectedVoice: React.Dispatch<React.SetStateAction<string>>;
  showFuelingFilters: boolean;
  setShowFuelingFilters: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterTab: string;
  setActiveFilterTab: React.Dispatch<React.SetStateAction<string>>;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  daelyPoints: number;
  setDaelyPoints: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  userTier: SubscriptionTier;
  setUserTier: React.Dispatch<React.SetStateAction<SubscriptionTier>>;
  
  // Refs
  homeCarouselRef: React.RefObject<HTMLDivElement>;
  
  // Handlers
  handleStartLongPress: () => void;
  handleEndLongPress: () => void;
  longPressProgress: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isWorkoutsVisible, setIsWorkoutsVisible] = useState(true);
  const [isProgressVisible, setIsProgressVisible] = useState(true);
  const [isPersonalizedPlanVisible, setIsPersonalizedPlanVisible] = useState(true);
  const [isHabitsVisible, setIsHabitsVisible] = useState(true);
  const [contentGenderPreference, setContentGenderPreference] = useState<'man' | 'woman' | 'none'>('none');
  const [activeTab, setActiveTab] = useState('Home');
  const [activeHomeSlide, setActiveHomeSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState('classic');
  const [perspectiveCreator, setPerspectiveCreator] = useState<Creator | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsPage, setActiveSettingsPage] = useState<string | null>(null);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false);
  const [selectedDateToAddWorkout, setSelectedDateToAddWorkout] = useState<number | null>(null);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<any[]>([]);
  const [weightLogs, setWeightLogs] = useState<any[]>([]);
  const [dailyHabits, setDailyHabits] = useState<Record<string, Record<string, boolean>>>({});
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDays, setAiDays] = useState(3);
  const [aiGoal, setAiGoal] = useState('Spieropbouw');
  const [aiEquipment, setAiEquipment] = useState('Sportschool');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi, ik ben je AI coach. Hoe kan ik je vandaag helpen?' }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<any | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);
  const [showMyChallenges, setShowMyChallenges] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showMyWorkoutsOverlay, setShowMyWorkoutsOverlay] = useState(false);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [createWorkoutDisciplineId, setCreateWorkoutDisciplineId] = useState<string>('');
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [newWorkoutExercises, setNewWorkoutExercises] = useState<Exercise[]>([]);
  const [showMyHabits, setShowMyHabits] = useState(false);
  const [showMyNutritionOverlay, setShowMyNutritionOverlay] = useState(false);
  const [nutritionSelectedDay, setNutritionSelectedDay] = useState('Maandag');
  const [nutritionPlan, setNutritionPlan] = useState<{day: string, meals: {id: string, type: string, time: string, recipeId: string, isConsumed: boolean, customDetails?: {name: string, kcal: number, protein: number, carbs: number, fats: number}}[]}[]>(defaultWeekPlan as any);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [showWeekOverview, setShowWeekOverview] = useState(false);
  const [showSwapMeal, setShowSwapMeal] = useState<{day: string, mealId: string, mealType: string} | null>(null);
  const [showAddCustomFood, setShowAddCustomFood] = useState(false);
  const [customFoodForm, setCustomFoodForm] = useState({ name: '', kcal: 0, protein: 0, carbs: 0, fats: 0 });
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [foodSearchResults, setFoodSearchResults] = useState<typeof foodDatabase>([]);
  const [isSearchingFood, setIsSearchingFood] = useState(false);
  const [selectedNutritionRecipe, setSelectedNutritionRecipe] = useState<any | null>(null);
  const [recipeServings, setRecipeServings] = useState(1);
  const [showNutritionSettings, setShowNutritionSettings] = useState(false);
  const [nutritionGoal, setNutritionGoal] = useState('Spieropbouw');
  const [nutritionKcalTarget, setNutritionKcalTarget] = useState(2800);
  const [nutritionMacros, setNutritionMacros] = useState({ protein: 210, carbs: 280, fats: 75 });
  const [showPersonalizedPlan, setShowPersonalizedPlan] = useState(false);
  const [planGenerating, setPlanGenerating] = useState(false);
  const [personalizedPlan, setPersonalizedPlan] = useState<string | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showDataUploadModal, setShowDataUploadModal] = useState(false);
  const [dataUploadType, setDataUploadType] = useState('bloed');
  const [dataUploadAction, setDataUploadAction] = useState('adjust_plan');
  const [dataUploadFile, setDataUploadFile] = useState<File | null>(null);
  const [dataUploadSuccess, setDataUploadSuccess] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackUsability, setFeedbackUsability] = useState(0);
  const [feedbackPrimaryUse, setFeedbackPrimaryUse] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [discSubTab, setDiscSubTab] = useState<'Workouts' | 'Exercises' | 'Programs'>('Workouts');
  const [athleteSubTab, setAthleteSubTab] = useState<'Profile' | 'PARTNERS' | 'Challenges' | 'Events'>('Profile');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('All');
  const [selectedMindCategory, setSelectedMindCategory] = useState<string>('All');
  const [selectedSignatureMethod, setSelectedSignatureMethod] = useState<any>(null);
  const [isPlayingSignatureMethod, setIsPlayingSignatureMethod] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [creatorSubTab, setCreatorSubTab] = useState<'Activity' | 'Workouts' | 'Nutrition'>('Activity');
  const [activeChallenges, setActiveChallenges] = useState<Record<string, { startDate: string, progress: number }>>({});
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const [activeHomeCreatorId, setActiveHomeCreatorId] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [language, setLanguage] = useState('English');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [accountConfigView, setAccountConfigView] = useState<'main' | 'visual' | 'audio' | 'voice' | 'language'>('main');
  const [selectedVoice, setSelectedVoice] = useState('Male 1');
  const [showFuelingFilters, setShowFuelingFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('Meal');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    Meal: [],
    Diet: [],
    Goal: [],
    Time: [],
    Difficulty: []
  });
  const [daelyPoints, setDaelyPoints] = useState(1250);
  const [streak, setStreak] = useState(12);
  const [userTier, setUserTier] = useState<SubscriptionTier>('Elite');

  const homeCarouselRef = useRef<HTMLDivElement>(null);
  
  const [longPressProgress, setLongPressProgress] = useState(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartLongPress = () => {
    setLongPressProgress(0);
    longPressIntervalRef.current = setInterval(() => {
      setLongPressProgress(prev => {
        if (prev >= 100) {
          if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 10);

    longPressTimerRef.current = setTimeout(() => {
      setShowMyWorkoutsOverlay(true);
      if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
      setLongPressProgress(0);
    }, 500);
  };

  const handleEndLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
    setLongPressProgress(0);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'user',
                        } else {
                          // Haal de rol op uit het bestaande document
                          const data = userDoc.data();
                          if (data && data.role) {
                            setUserRole(data.role as UserRole);
                          } else {
                            setUserRole('user');
                          }
              streak: 0,
              daelyPoints: 0,
              followedCreators: [],
              activeHomeCreatorId: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Error setting up user document:", error);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAuthReady) return;

    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const hasDaelyPoints = typeof data.daelyPoints === 'number';
        const hasLegacyAuraPoints = typeof data.auraPoints === 'number';
        const resolvedPoints = hasDaelyPoints
          ? data.daelyPoints
          : hasLegacyAuraPoints
            ? data.auraPoints
            : 0;

        setStreak(data.streak || 0);
        setDaelyPoints(resolvedPoints);
        setFollowedCreators(data.followedCreators || []);
        setActiveHomeCreatorId(data.activeHomeCreatorId || null);

        // Update userRole live
        if (data.role) setUserRole(data.role as UserRole);
        // One-time migration for users that still have legacy auraPoints only.
        if (!hasDaelyPoints && hasLegacyAuraPoints) {
          void updateDoc(doc(db, 'users', user.uid), {
            daelyPoints: data.auraPoints,
            updatedAt: serverTimestamp(),
          }).catch((error) => {
            console.error('Error migrating auraPoints to daelyPoints:', error);
          });
        }
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
    });

    const q = query(collection(db, `users/${user.uid}/workoutHistory`), orderBy('completedAt', 'desc'));
    const unsubscribeHistory = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkoutHistory(history);
    }, (error) => {
      console.error("Error fetching workout history:", error);
    });

    const qWeight = query(collection(db, `users/${user.uid}/weightLogs`), orderBy('timestamp', 'asc'));
    const unsubscribeWeight = onSnapshot(qWeight, (snapshot) => {
      setWeightLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error fetching weight logs:", error));

    const unsubscribeNutrition = onSnapshot(doc(db, `users/${user.uid}/nutrition/weeklyPlan`), (docSnap) => {
      if (docSnap.exists() && docSnap.data().plan) {
        setNutritionPlan(docSnap.data().plan);
      }
    }, (error) => console.error("Error fetching nutrition plan:", error));

    const qHabits = query(collection(db, `users/${user.uid}/dailyHabits`));
    const unsubscribeHabits = onSnapshot(qHabits, (snapshot) => {
      const habitsData: Record<string, Record<string, boolean>> = {};
      snapshot.docs.forEach(doc => {
        habitsData[doc.id] = doc.data().habits || {};
      });
      setDailyHabits(habitsData);
    }, (error) => console.error("Error fetching habits:", error));

    const qCustomWorkouts = query(collection(db, `users/${user.uid}/customWorkouts`));
    const unsubscribeCustomWorkouts = onSnapshot(qCustomWorkouts, (snapshot) => {
      setCustomWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error fetching custom workouts:", error));

    return () => {
      unsubscribeUser();
      unsubscribeHistory();
      unsubscribeWeight();
      unsubscribeNutrition();
      unsubscribeHabits();
      unsubscribeCustomWorkouts();
    };
  }, [user, isAuthReady]);

  const toggleFollowCreator = async (creatorId: string) => {
    if (!user) {
      // Handle local state if not logged in
      setFollowedCreators(prev => {
        const isFollowing = prev.includes(creatorId);
        if (isFollowing) {
          if (activeHomeCreatorId === creatorId) setActiveHomeCreatorId(null);
          return prev.filter(id => id !== creatorId);
        }
        setActiveHomeCreatorId(creatorId);
        return [...prev, creatorId];
      });
      return;
    }

    try {
      const isFollowing = followedCreators.includes(creatorId);
      const newFollowed = isFollowing 
        ? followedCreators.filter(id => id !== creatorId)
        : [...followedCreators, creatorId];
      
      let newActiveHomeCreatorId = activeHomeCreatorId;
      if (isFollowing && activeHomeCreatorId === creatorId) {
        newActiveHomeCreatorId = null;
      } else if (!isFollowing) {
        newActiveHomeCreatorId = creatorId;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        followedCreators: newFollowed,
        activeHomeCreatorId: newActiveHomeCreatorId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const selectHomeCreator = async (creatorId: string | null) => {
    if (!user) {
      setActiveHomeCreatorId(creatorId);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        activeHomeCreatorId: creatorId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('/api/workouts');
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (e) {
      console.error('Failed to fetch workouts', e);
    }
  };

  const value = {
      userRole, setUserRole,
    user, isAuthReady,
    fetchWorkouts,
    isLoggedIn, setIsLoggedIn,
    isCreatingAccount, setIsCreatingAccount,
    isForgotPassword, setIsForgotPassword,
    isWorkoutsVisible, setIsWorkoutsVisible,
    isProgressVisible, setIsProgressVisible,
    isPersonalizedPlanVisible, setIsPersonalizedPlanVisible,
    isHabitsVisible, setIsHabitsVisible,
    contentGenderPreference, setContentGenderPreference,
    activeTab, setActiveTab,
    activeHomeSlide, setActiveHomeSlide,
    showWelcome, setShowWelcome,
    activeThemeId, setActiveThemeId,
    perspectiveCreator, setPerspectiveCreator,
    showSettings, setShowSettings,
    activeSettingsPage, setActiveSettingsPage,
    isEditingProfilePic, setIsEditingProfilePic,
    profileImage, setProfileImage,
    selectedIcon, setSelectedIcon,
    showIconPicker, setShowIconPicker,
    showProgressDashboard, setShowProgressDashboard,
    showScheduleCalendar, setShowScheduleCalendar,
    selectedDateToAddWorkout, setSelectedDateToAddWorkout,
    selectedWorkoutType, setSelectedWorkoutType,
    workouts, setWorkouts,
    customWorkouts, setCustomWorkouts,
    weightLogs, setWeightLogs,
    dailyHabits, setDailyHabits,
    showAiModal, setShowAiModal,
    aiDays, setAiDays,
    aiGoal, setAiGoal,
    aiEquipment, setAiEquipment,
    isGenerating, setIsGenerating,
    showAiChat, setShowAiChat,
    aiChatMessages, setAiChatMessages,
    aiChatInput, setAiChatInput,
    isAiChatLoading, setIsAiChatLoading,
    activeWorkout, setActiveWorkout,
    currentExerciseIndex, setCurrentExerciseIndex,
    completedSets, setCompletedSets,
    restTimer, setRestTimer,
    isResting, setIsResting,
    showWorkoutComplete, setShowWorkoutComplete,
    showMyChallenges, setShowMyChallenges,
    showEvents, setShowEvents,
    showMyWorkoutsOverlay, setShowMyWorkoutsOverlay,
    showCreateWorkout, setShowCreateWorkout,
    createWorkoutDisciplineId, setCreateWorkoutDisciplineId,
    showAddExerciseModal, setShowAddExerciseModal,
    exerciseSearchQuery, setExerciseSearchQuery,
    newWorkoutExercises, setNewWorkoutExercises,
    showMyHabits, setShowMyHabits,
    showMyNutritionOverlay, setShowMyNutritionOverlay,
    nutritionSelectedDay, setNutritionSelectedDay,
    nutritionPlan, setNutritionPlan,
    showGroceryList, setShowGroceryList,
    showWeekOverview, setShowWeekOverview,
    showSwapMeal, setShowSwapMeal,
    showAddCustomFood, setShowAddCustomFood,
    customFoodForm, setCustomFoodForm,
    foodSearchQuery, setFoodSearchQuery,
    foodSearchResults, setFoodSearchResults,
    isSearchingFood, setIsSearchingFood,
    selectedNutritionRecipe, setSelectedNutritionRecipe,
    recipeServings, setRecipeServings,
    showNutritionSettings, setShowNutritionSettings,
    nutritionGoal, setNutritionGoal,
    nutritionKcalTarget, setNutritionKcalTarget,
    nutritionMacros, setNutritionMacros,
    showPersonalizedPlan, setShowPersonalizedPlan,
    planGenerating, setPlanGenerating,
    personalizedPlan, setPersonalizedPlan,
    showQuickMenu, setShowQuickMenu,
    showDataUploadModal, setShowDataUploadModal,
    dataUploadType, setDataUploadType,
    dataUploadAction, setDataUploadAction,
    dataUploadFile, setDataUploadFile,
    dataUploadSuccess, setDataUploadSuccess,
    showFeedbackModal, setShowFeedbackModal,
    feedbackRating, setFeedbackRating,
    feedbackUsability, setFeedbackUsability,
    feedbackPrimaryUse, setFeedbackPrimaryUse,
    feedbackText, setFeedbackText,
    hasSubmittedFeedback, setHasSubmittedFeedback,
    showFeedbackSuccess, setShowFeedbackSuccess,
    selectedDiscipline, setSelectedDiscipline,
    selectedExercise, setSelectedExercise,
    selectedRecipe, setSelectedRecipe,
    selectedMeditation, setSelectedMeditation,
    discSubTab, setDiscSubTab,
    athleteSubTab, setAthleteSubTab,
    selectedMuscleGroup, setSelectedMuscleGroup,
    selectedMindCategory, setSelectedMindCategory,
    selectedSignatureMethod, setSelectedSignatureMethod,
    isPlayingSignatureMethod, setIsPlayingSignatureMethod,
    selectedEvent, setSelectedEvent,
    selectedChallenge, setSelectedChallenge,
    selectedCreator, setSelectedCreator,
    creatorSubTab, setCreatorSubTab,
    activeChallenges, setActiveChallenges,
    followedCreators, setFollowedCreators,
    activeHomeCreatorId, setActiveHomeCreatorId,
    workoutHistory, setWorkoutHistory,
    toggleFollowCreator, selectHomeCreator,
    language, setLanguage,
    showLanguageSelector, setShowLanguageSelector,
    accountConfigView, setAccountConfigView,
    selectedVoice, setSelectedVoice,
    showFuelingFilters, setShowFuelingFilters,
    activeFilterTab, setActiveFilterTab,
    selectedFilters, setSelectedFilters,
    daelyPoints, setDaelyPoints,
    streak, setStreak,
    userTier, setUserTier,
    homeCarouselRef,
    handleStartLongPress,
    handleEndLongPress,
    longPressProgress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
