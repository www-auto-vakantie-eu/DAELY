import { create } from 'zustand';

interface UIState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeHomeSlide: number;
  setActiveHomeSlide: (slide: number) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  activeThemeId: string;
  setActiveThemeId: (id: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  activeSettingsPage: string | null;
  setActiveSettingsPage: (page: string | null) => void;
  showProgressDashboard: boolean;
  setShowProgressDashboard: (show: boolean) => void;
  showScheduleCalendar: boolean;
  setShowScheduleCalendar: (show: boolean) => void;
  showAiModal: boolean;
  setShowAiModal: (show: boolean) => void;
  showAiChat: boolean;
  setShowAiChat: (show: boolean) => void;
  showMyChallenges: boolean;
  setShowMyChallenges: (show: boolean) => void;
  showEvents: boolean;
  setShowEvents: (show: boolean) => void;
  showQuickMenu: boolean;
  setShowQuickMenu: (show: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  showLanguageSelector: boolean;
  setShowLanguageSelector: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'Home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  activeHomeSlide: 0,
  setActiveHomeSlide: (slide) => set({ activeHomeSlide: slide }),
  showWelcome: true,
  setShowWelcome: (show) => set({ showWelcome: show }),
  activeThemeId: 'classic',
  setActiveThemeId: (id) => set({ activeThemeId: id }),
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  activeSettingsPage: null,
  setActiveSettingsPage: (page) => set({ activeSettingsPage: page }),
  showProgressDashboard: false,
  setShowProgressDashboard: (show) => set({ showProgressDashboard: show }),
  showScheduleCalendar: false,
  setShowScheduleCalendar: (show) => set({ showScheduleCalendar: show }),
  showAiModal: false,
  setShowAiModal: (show) => set({ showAiModal: show }),
  showAiChat: false,
  setShowAiChat: (show) => set({ showAiChat: show }),
  showMyChallenges: false,
  setShowMyChallenges: (show) => set({ showMyChallenges: show }),
  showEvents: false,
  setShowEvents: (show) => set({ showEvents: show }),
  showQuickMenu: false,
  setShowQuickMenu: (show) => set({ showQuickMenu: show }),
  language: 'English',
  setLanguage: (lang) => set({ language: lang }),
  showLanguageSelector: false,
  setShowLanguageSelector: (show) => set({ showLanguageSelector: show }),
}));
