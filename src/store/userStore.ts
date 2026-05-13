import { create } from 'zustand';
import type { SubscriptionTier } from '../../types';

interface UserState {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isCreatingAccount: boolean;
  setIsCreatingAccount: (isCreating: boolean) => void;
  isForgotPassword: boolean;
  setIsForgotPassword: (isForgot: boolean) => void;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  daelyPoints: number;
  setDaelyPoints: (points: number) => void;
  streak: number;
  setStreak: (streak: number) => void;
  userTier: SubscriptionTier;
  setUserTier: (tier: SubscriptionTier) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  isCreatingAccount: false,
  setIsCreatingAccount: (isCreating) => set({ isCreatingAccount: isCreating }),
  isForgotPassword: false,
  setIsForgotPassword: (isForgot) => set({ isForgotPassword: isForgot }),
  profileImage: null,
  setProfileImage: (image) => set({ profileImage: image }),
  daelyPoints: 1250,
  setDaelyPoints: (points) => set({ daelyPoints: points }),
  streak: 12,
  setStreak: (streak) => set({ streak }),
  userTier: 'Elite',
  setUserTier: (tier) => set({ userTier: tier }),
}));
