import { create } from 'zustand';

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  
  activeThemeId: string;
  setActiveThemeId: (id: string) => void;
  
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  language: string;
  setLanguage: (lang: string) => void;
  
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  
  daelyPoints: number;
  setDaelyPoints: (points: number) => void;
  
  streak: number;
  setStreak: (streak: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'Home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  showWelcome: true,
  setShowWelcome: (show) => set({ showWelcome: show }),
  
  activeThemeId: 'classic',
  setActiveThemeId: (id) => set({ activeThemeId: id }),
  
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
  
  showSearch: false,
  setShowSearch: (show) => set({ showSearch: show }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  language: 'English',
  setLanguage: (lang) => set({ language: lang }),
  
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  
  daelyPoints: 1250,
  setDaelyPoints: (points) => set({ daelyPoints: points }),
  
  streak: 12,
  setStreak: (streak) => set({ streak }),
}));
