import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, getActivities } from 'services/activity-storage';
import { useAppContext } from '@/contexts/AppContext';
import { getNextProgramWorkout, NextProgramWorkout } from '@/services/user-programs-storage';
import { getActiveWorkoutDraft, type WorkoutDraft } from '@/services/workout-draft-storage';
import { CONNECTED_DEVICES, WHOOP_TOKEN_STORAGE_KEY } from '../constants/connected-devices';
import {
  HERO_BACKGROUND_STORAGE_KEY,
  HERO_BACKGROUND_OPTIONS,
  HeroBackgroundOptionId,
} from '@/constants/hero-background';
import { TODAY_QUOTES } from '@/constants/today-quotes';
import { getUnreadMessageCount } from '@/services/messages-storage';
import { THEMES } from '@/constants/themes';

const SHORTCUTS_STORAGE_KEY = 'daely.today.shortcuts.v1';

type ShortcutId = 'nutrition' | 'habits' | 'stats' | 'tracker' | 'activities' | 'shop' | 'feedback' | 'find-coach';

type ShortcutOption = {
  id: ShortcutId;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route: string;
};

const SHORTCUT_OPTIONS: ShortcutOption[] = [
  { id: 'nutrition', label: 'Voeding', icon: 'food-apple-outline', route: '/nutrition/add' },
  { id: 'habits', label: 'Habit tracker', icon: 'calendar-check-outline', route: '/habits' },
  { id: 'stats', label: 'Data', icon: 'chart-bar', route: '/my-stats' },
  { id: 'tracker', label: 'Start activiteit', icon: 'run-fast', route: '/tracker' },
  { id: 'activities', label: 'Activiteiten', icon: 'history', route: '/activities' },
  { id: 'shop', label: 'Shop', icon: 'shopping-outline', route: '/shop' },
  { id: 'feedback', label: 'Feedback', icon: 'chat-outline', route: '/feedback' },
  { id: 'find-coach', label: 'Vind Coach', icon: 'account-tie', route: '/find-coach' },
];

const DEFAULT_SHORTCUTS: ShortcutId[] = ['nutrition', 'habits', 'stats'];

// Helper to get theme-aware Aurora tokens
function getAuroraTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';
  const isZen = currentTheme.id === 'zenInk';
  const isSapphire = currentTheme.id === 'sapphire';
  const isRuby = currentTheme.id === 'ruby';

  // Theme-aware gradient for card backgrounds
  const themeGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara
        ? currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF']
        : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
        : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
        : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
        : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
        : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  // Sapphire-specific shape tokens
  const cardRadius = isSapphire ? (currentTheme.colors.cardRadius || 14) : isRetro ? 16 : isSahara ? 16 : isForce ? 16 : isZen ? 14 : 16;
  const cardBorderWidth = isSapphire ? (currentTheme.colors.cardBorderWidth || 1.5) : isRetro ? 1 : isSahara ? 1 : isForce ? 1 : isZen ? 1 : 1;
  const iconBubbleRadius = isSapphire ? (currentTheme.colors.iconBubbleRadius || 12) : isRetro ? 14 : isSahara ? 14 : isForce ? 14 : isZen ? 10 : 14;
  const shortcutRadius = isSapphire ? (currentTheme.colors.shortcutRadius || 12) : 16;

  return {
    auroraGradient: themeGradient,
    auroraTitle: currentTheme.colors.auroraTitle || (isZen ? '#FFFFFF' : isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : '#1E1B4B'),
    auroraSubtitle: currentTheme.colors.auroraSubtitle || (isZen ? '#B0B0B0' : isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : '#4A3A8C'),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
          : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
          : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
          : isSapphire ? (currentTheme.colors.glassLine1 || ['rgba(147, 197, 253, 0.04)', 'rgba(147, 197, 253, 0.01)'])
          : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
          : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara
          ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
          : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
          : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
          : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
          : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
          : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara
          ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
          : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
          : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
          : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
          : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
          : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara
          ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
          : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)'])
          : isZen ? (currentTheme.gradients.auroraRose || ['rgba(156, 163, 175, 0.14)', 'rgba(156, 163, 175, 0.05)'])
          : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
          : isRuby ? (currentTheme.gradients.auroraRose || ['rgba(184, 50, 90, 0.26)', 'rgba(228, 90, 122, 0.08)'])
          : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara
          ? ['rgba(232, 208, 176, 0.38)', 'rgba(255, 255, 255, 0.05)']
          : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
          : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
          : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
          : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
          : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : isSapphire ? (currentTheme.colors.glassGlow ? [currentTheme.colors.glassGlow, 'rgba(59, 130, 246, 0.005)'] : ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
      : isRuby ? (currentTheme.colors.rubyGlowBorder ? [currentTheme.colors.rubyGlowBorder, 'rgba(184, 50, 90, 0.08)'] : ['rgba(228, 90, 122, 0.24)', 'rgba(255, 228, 236, 0.08)'])
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Theme-aware icon colors
    recoveryIconColor: isClassic ? '#0EA5E9' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? '#FFFFFF' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : '#8B5CF6',
    // Theme-aware recommendation icon backgrounds
    mobilityIconBg: isClassic ? '#DBEAFE' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? 'rgba(184, 50, 90, 0.14)' : '#DBEAFE',
    mobilityIconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#8B5A2B' : isZen ? '#FFFFFF' : isSapphire ? '#BFDBFE' : isRuby ? '#FFE4EC' : '#2563EB',
    trainingIconBg: isClassic ? '#DBEAFE' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? 'rgba(184, 50, 90, 0.14)' : '#D1FAE5',
    trainingIconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#8B5A2B' : isZen ? '#FFFFFF' : isSapphire ? '#BFDBFE' : isRuby ? '#FFE4EC' : '#059669',
    nutritionIconBg: isClassic ? '#DBEAFE' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? 'rgba(184, 50, 90, 0.14)' : '#FEF3C7',
    nutritionIconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#8B5A2B' : isZen ? '#FFFFFF' : isSapphire ? '#BFDBFE' : isRuby ? '#FFE4EC' : '#F59E0B',
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.12)' : isSapphire ? (currentTheme.colors.glassBorder || 'rgba(147, 197, 253, 0.25)') : isRuby ? (currentTheme.colors.rubyGlowBorder || 'rgba(244, 167, 185, 0.22)') : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : isSapphire ? (currentTheme.colors.glassShadow || 'rgba(59, 130, 246, 0.28)') : isRuby ? (currentTheme.colors.rubyGlowShadow || 'rgba(184, 50, 90, 0.24)') : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? (currentTheme.colors.rubyIconBg || 'rgba(184, 50, 90, 0.14)') : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : isSapphire ? 'rgba(147, 197, 253, 0.24)' : isRuby ? (currentTheme.colors.rubyIconBorder || 'rgba(244, 167, 185, 0.24)') : undefined,
    // Sapphire glass line flags
    useThinLines: isSapphire,
    // Sapphire shape tokens
    cardRadius,
    cardBorderWidth,
    iconBubbleRadius,
    shortcutRadius,
    // New calm gemstone tokens for Sapphire
    facetLarge: isSapphire ? (currentTheme.colors.facetLarge || 'rgba(147, 197, 253, 0.08)') : undefined,
    facetMedium: isSapphire ? (currentTheme.colors.facetMedium || 'rgba(96, 165, 250, 0.06)') : undefined,
    facetSmall: isSapphire ? (currentTheme.colors.facetSmall || 'rgba(191, 219, 254, 0.05)') : undefined,
    sapphireGlow: isSapphire ? (currentTheme.colors.sapphireGlow || 'rgba(59, 130, 246, 0.16)') : undefined,
  };
}

function formatTodayLabel() {
  const now = new Date();
  return now.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function getTodayQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const safeQuotes = TODAY_QUOTES.filter(q => q.status === 'safe');
  if (safeQuotes.length === 0) {
    return {
      id: 'fallback',
      text: 'Vandaag hoeft niet perfect te zijn. Wel bewust, actief en beter dan gisteren.',
      category: 'mindset',
      sourceType: 'daely_original',
      status: 'safe',
      author: undefined,
    };
  }
  
  const quoteIndex = dayOfYear % safeQuotes.length;
  return safeQuotes[quoteIndex];
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('nl-NL');
}

// Helper component for gradient cards with Soft Aurora Ribbon style
function GradientCard({ children, style, cardRadius }: { children: React.ReactNode, style?: any, cardRadius?: number }) {
  const { activeThemeId } = useAppContext();
  const { auroraGradient, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, useThinLines, facetLarge, facetMedium, sapphireGlow } = getAuroraTokens(activeThemeId);

  const ribbonStyleTop = useThinLines ? styles.thinRibbonTop : styles.ribbonTop;
  const ribbonStyleMid = useThinLines ? styles.thinRibbonMid : styles.ribbonMid;
  const ribbonStyleBlue = useThinLines ? styles.thinRibbonBlue : styles.ribbonBlue;
  const ribbonStyleRose = useThinLines ? styles.thinRibbonRose : styles.ribbonRose;
  const ribbonStyleRight = useThinLines ? styles.thinRibbonRight : styles.ribbonRight;

  return (
    <View style={[styles.sectionCard, style, { borderRadius: cardRadius || 16 }]}>
      {/* Background gradient layer - absolute full-cover */}
      <LinearGradient
        colors={auroraGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.sectionCardGradient, { borderRadius: cardRadius || 16 }]}
        pointerEvents="none"
      >
        {/* Top-left ribbon */}
        <LinearGradient
          colors={ribbonTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleTop}
          pointerEvents="none"
        />
        {/* Mid-card ribbon */}
        <LinearGradient
          colors={ribbonMid}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleMid}
          pointerEvents="none"
        />
        {/* Diagonal top-right ribbon */}
        <LinearGradient
          colors={ribbonBlue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleBlue}
          pointerEvents="none"
        />
        {/* Diagonal bottom-left ribbon */}
        <LinearGradient
          colors={ribbonRose}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={ribbonStyleRose}
          pointerEvents="none"
        />
        {/* Right-side accent ribbon */}
        <LinearGradient
          colors={ribbonRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleRight}
          pointerEvents="none"
        />
        {/* Calm gemstone effects for Sapphire theme - max 3 layers */}
        {useThinLines && sapphireGlow && (
          <View style={[styles.sapphireGlowOverlay, { backgroundColor: sapphireGlow }]} pointerEvents="none" />
        )}
        {useThinLines && facetLarge && (
          <View style={[styles.facetLarge, { backgroundColor: facetLarge }]} pointerEvents="none" />
        )}
        {useThinLines && facetMedium && (
          <View style={[styles.facetMedium, { backgroundColor: facetMedium }]} pointerEvents="none" />
        )}
        {/* Subtle glass border for Sapphire theme */}
        {useThinLines && (
          <View style={styles.glassBorderOverlay} pointerEvents="none" />
        )}
        {/* Soft white highlight overlay */}
        <LinearGradient
          colors={ribbonHighlight}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.ribbonHighlight}
          pointerEvents="none"
        />
      </LinearGradient>
      {/* Content layer - above background */}
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
}

function getMetricsSummary(activity: Activity) {
  if (activity.metrics?.workout) {
    return `${activity.metrics.workout.exercises?.length ?? 0} oefeningen${activity.metrics.workout.totalVolumeKg !== undefined ? ` · ${Math.round(activity.metrics.workout.totalVolumeKg)} kg volume` : ''}`;
  }
  if (activity.metrics?.session) {
    return `${activity.metrics.session.intensity ? `Intensiteit ${activity.metrics.session.intensity}` : 'Session'}${activity.metrics.session.focusAreas && activity.metrics.session.focusAreas.length > 0 ? ` · ${activity.metrics.session.focusAreas.join(', ')}` : ''}`;
  }
  if (activity.metrics?.match) {
    return `${activity.metrics.match.matchType ?? 'match'}${activity.metrics.match.scoreFor !== undefined && activity.metrics.match.scoreAgainst !== undefined ? ` · ${activity.metrics.match.scoreFor}-${activity.metrics.match.scoreAgainst}` : ''}`;
  }
  if (activity.metrics?.score) {
    if (activity.metrics.score.scoreType === 'racket') {
      return `${activity.metrics.score.result ?? 'score'}${activity.metrics.score.setsFor !== undefined && activity.metrics.score.setsAgainst !== undefined ? ` · ${activity.metrics.score.setsFor}-${activity.metrics.score.setsAgainst}` : ''}`;
    }
    if (activity.metrics.score.scoreType === 'golf') {
      return `Golf${activity.metrics.score.holesPlayed !== undefined ? ` · ${activity.metrics.score.holesPlayed} holes` : ''}${activity.metrics.score.strokes !== undefined ? ` · ${activity.metrics.score.strokes} slagen` : ''}`;
    }
    return 'Score activiteit';
  }
  if (activity.metrics?.skill) {
    return `${activity.metrics.skill.techniques && activity.metrics.skill.techniques.length > 0 ? activity.metrics.skill.techniques.join(', ') : 'Skill'}${activity.metrics.skill.grade ? ` · ${activity.metrics.skill.grade}` : ''}`;
  }
  if (activity.metrics?.laps) {
    return `${activity.metrics.laps.distanceMeters !== undefined ? `${Math.round(activity.metrics.laps.distanceMeters)} m` : 'Laps'}${activity.metrics.laps.laps !== undefined ? ` · ${Math.round(activity.metrics.laps.laps)} banen` : ''}`;
  }
  if (activity.metrics?.gps) {
    return `${activity.metrics.gps.distanceMeters !== undefined ? `${Math.round(activity.metrics.gps.distanceMeters)} m` : 'GPS activiteit'}${activity.metrics.gps.averageSpeedKmh !== undefined && activity.metrics.gps.averageSpeedKmh !== null ? ` · ${activity.metrics.gps.averageSpeedKmh.toFixed(1)} km/u` : ''}`;
  }
  return 'Geen metrics beschikbaar';
}

export default function TodayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ open?: string }>();
  const theme = useTheme();
  const { user, activeThemeId } = useAppContext();
  const { auroraGradient, auroraTitle, auroraSubtitle, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, recoveryIconColor, mobilityIconBg, mobilityIconColor, trainingIconBg, trainingIconColor, nutritionIconBg, nutritionIconColor, shortcutBorderColor, shortcutShadowColor, shortcutIconBg, shortcutIconBorder, cardRadius, cardBorderWidth, iconBubbleRadius, shortcutRadius, useThinLines } = getAuroraTokens(activeThemeId);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [heroBackground, setHeroBackground] = useState<HeroBackgroundOptionId>('pureMinimal');
  const [isWhoopConnected, setIsWhoopConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);
  const [shortcuts, setShortcuts] = useState<ShortcutId[]>(DEFAULT_SHORTCUTS);
  const [showShortcutPicker, setShowShortcutPicker] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [nextWorkout, setNextWorkout] = useState<NextProgramWorkout | null>(null);
  const [activeDraft, setActiveDraft] = useState<WorkoutDraft | null>(null);

  const todayQuote = useMemo(() => getTodayQuote(), []);

  const loadNextWorkout = useCallback(() => {
    getNextProgramWorkout().then(setNextWorkout);
  }, []);

  const loadActiveDraft = useCallback(() => {
    getActiveWorkoutDraft().then(setActiveDraft);
  }, []);

  useEffect(() => {
    loadNextWorkout();
    loadActiveDraft();
  }, [loadNextWorkout, loadActiveDraft]);

  useEffect(() => {
    getUnreadMessageCount().then(setUnreadMessageCount);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNextWorkout();
      loadActiveDraft();
      getUnreadMessageCount().then(setUnreadMessageCount);
    }, [loadNextWorkout, loadActiveDraft])
  );

  useEffect(() => {
    if (params.open === 'shortcuts') {
      setShowShortcutPicker(true);
      router.setParams({ open: undefined });
    }
  }, [params.open, router]);

  useEffect(() => {
    getActivities().then((items) => {
      const sorted = [...items].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      setActivities(sorted);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(HERO_BACKGROUND_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      const exists = HERO_BACKGROUND_OPTIONS.some((option) => option.id === stored);
      if (exists) {
        setHeroBackground(stored as HeroBackgroundOptionId);
      }
    });
  }, []);

useEffect(() => {
    AsyncStorage.getItem(SHORTCUTS_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 3 && parsed.every((id: string) => SHORTCUT_OPTIONS.some((opt) => opt.id === id))) {
          setShortcuts(parsed as ShortcutId[]);
        }
      } catch {
        // Fallback to defaults
      }
    });
  }, []);

  useEffect(() => {
    const restoreConnectedStatus = async () => {
      try {
        const values = await AsyncStorage.multiGet([WHOOP_TOKEN_STORAGE_KEY, 'fitbit_oauth_token', 'fitbit_connected']);
        const valueMap = new Map(values);
        setIsWhoopConnected(!!valueMap.get(WHOOP_TOKEN_STORAGE_KEY));
        const fitbitConnected = !!valueMap.get('fitbit_oauth_token') || valueMap.get('fitbit_connected') === 'true';
        setIsFitbitConnected(fitbitConnected);
      } catch {
        setIsWhoopConnected(false);
        setIsFitbitConnected(false);
      }
    };

    void restoreConnectedStatus();
  }, []);

  const selectedHeroBackground = HERO_BACKGROUND_OPTIONS.find((option) => option.id === heroBackground) ?? HERO_BACKGROUND_OPTIONS[1];
  const userName = typeof user.name === 'string' && user.name.trim().length > 0
    ? user.name.trim()
    : typeof user.username === 'string' && user.username.trim().length > 0
      ? user.username.trim()
      : undefined;
  const heroGreeting = userName ? `Welkom terug, ${userName}` : 'Welkom terug';

  const todayLabel = useMemo(() => formatTodayLabel(), []);
  const todayKey = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, '0');
    const d = `${now.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const todayActivities = useMemo(
    () => activities.filter((activity) => activity.endedAt.startsWith(todayKey)),
    [activities, todayKey]
  );
  const mostRecentTodayActivity = todayActivities[0];
  const whoopDevice = CONNECTED_DEVICES.find((device) => device.id === 'whoop');
  const fitbitDevice = CONNECTED_DEVICES.find((device) => device.id === 'fitbit');
  const hasConnectedDevice = isWhoopConnected || isFitbitConnected;

const handleShortcutPress = (shortcutId: ShortcutId) => {
  const option = SHORTCUT_OPTIONS.find((opt) => opt.id === shortcutId);
  if (option) {
    router.push(option.route as any);
  }
};

const handleSaveShortcuts = async (newShortcuts: ShortcutId[]) => {
  setShortcuts(newShortcuts);
  setShowShortcutPicker(false);
  try {
    await AsyncStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(newShortcuts));
  } catch {
    // Silent fail, shortcuts remain in state
  }
};

const selectedShortcuts = shortcuts.map((id) => SHORTCUT_OPTIONS.find((opt) => opt.id === id)).filter(Boolean) as ShortcutOption[];

  // Determine ribbon styles based on theme
  const ribbonStyleTop = useThinLines ? styles.thinRibbonTop : styles.ribbonTop;
  const ribbonStyleMid = useThinLines ? styles.thinRibbonMid : styles.ribbonMid;
  const ribbonStyleBlue = useThinLines ? styles.thinRibbonBlue : styles.ribbonBlue;
  const ribbonStyleRose = useThinLines ? styles.thinRibbonRose : styles.ribbonRose;
  const ribbonStyleRight = useThinLines ? styles.thinRibbonRight : styles.ribbonRight;

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        title="Vandaag."
        subtitle="Jouw dag begint hier."
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        showMessages
        unreadMessagesCount={unreadMessageCount}
        onMessagesPress={() => router.push('/messages')}
      />

      <View style={styles.heroWrap}>
        {selectedHeroBackground.source ? (
          <Pressable onPress={() => router.push('/(tabs)/hero-background-settings')}>
            <View style={styles.heroCard}>
              <ImageBackground source={selectedHeroBackground.source} resizeMode="cover" imageStyle={styles.heroImage} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} />
              <View style={styles.heroOverlay}>
                <View style={styles.heroTopRow}>
                  <Text style={styles.heroDateLabel}>{todayLabel}</Text>
                </View>
                <View style={styles.heroContent}>
                  <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
                  <Text style={styles.welcomeSubtitle} numberOfLines={2}>{todayQuote.text}</Text>
                  {todayQuote.author && <Text style={styles.welcomeAuthor}>— {todayQuote.author}</Text>}
                </View>
              </View>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push('/(tabs)/hero-background-settings')}>
            <View style={[styles.heroCard, styles.heroCardFallback]}>
              <View style={styles.heroOverlayFallback}>
                <View style={styles.heroTopRow}>
                  <Text style={styles.heroDateLabel}>{todayLabel}</Text>
                </View>
                <View style={styles.heroContent}>
                  <Text style={styles.welcomeTitle}>{heroGreeting}</Text>
                  <Text style={styles.welcomeSubtitle} numberOfLines={2}>{todayQuote.text}</Text>
                  {todayQuote.author && <Text style={styles.welcomeAuthor}>— {todayQuote.author}</Text>}
                </View>
              </View>
            </View>
          </Pressable>
        )}
      </View>

      <View style={styles.shortcutsRow}>
        {selectedShortcuts.map((shortcut) => (
            <Pressable
              key={shortcut.id}
              style={({ pressed }) => [
                styles.shortcutCard,
                { borderColor: shortcutBorderColor || theme.border, shadowColor: shortcutShadowColor, borderRadius: shortcutRadius, borderWidth: cardBorderWidth },
                pressed && styles.shortcutCardPressed,
              ]}
              onPress={() => handleShortcutPress(shortcut.id)}
            >
              <LinearGradient
                colors={auroraGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.shortcutCardGradient, { borderRadius: shortcutRadius }]}
                pointerEvents="none"
              >
                {/* Top-left ribbon */}
                <LinearGradient
                  colors={ribbonTop}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={ribbonStyleTop}
                  pointerEvents="none"
                />
                {/* Mid-card ribbon */}
                <LinearGradient
                  colors={ribbonMid}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={ribbonStyleMid}
                  pointerEvents="none"
                />
                {/* Diagonal top-right ribbon */}
                <LinearGradient
                  colors={ribbonBlue}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={ribbonStyleBlue}
                  pointerEvents="none"
                />
                {/* Diagonal bottom-left ribbon */}
                <LinearGradient
                  colors={ribbonRose}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={ribbonStyleRose}
                  pointerEvents="none"
                />
                {/* Right-side accent ribbon */}
                <LinearGradient
                  colors={ribbonRight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={ribbonStyleRight}
                  pointerEvents="none"
                />
                {/* Soft white highlight overlay */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.ribbonHighlight}
                  pointerEvents="none"
                />
                <View style={styles.shortcutCardContent}>
                  <View style={[styles.shortcutIconContainer, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder, borderRadius: iconBubbleRadius }]}>
                    <MaterialCommunityIcons name={shortcut.icon} size={24} color={auroraSubtitle} />
                  </View>
                  <Text style={[styles.shortcutLabel, { color: auroraTitle }]}>{shortcut.label}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

      {/* Workout openstaand */}
      {activeDraft && activeDraft.status === 'active' && (
        <GradientCard style={styles.nextWorkoutCard} cardRadius={cardRadius}>
          <View style={styles.nextWorkoutHeader}>
            <Text style={[styles.nextWorkoutLabel, { color: theme.subtitleColor }]}>WORKOUT OPENSTAAND</Text>
            <Text style={[styles.nextWorkoutProgram, { color: theme.titleColor }]}>{activeDraft.workoutName || 'Workout'}</Text>
            {activeDraft.programWeek && activeDraft.programDay && (
              <Text style={[styles.nextWorkoutWeekDay, { color: theme.subtitleColor }]}>
                Week {activeDraft.programWeek} · Dag {activeDraft.programDay}
              </Text>
            )}
            <Text style={[styles.nextWorkoutMeta, { color: theme.subtitleColor }]}>
              Laatst bijgewerkt: {new Date(activeDraft.updatedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Pressable
            style={[styles.nextWorkoutButton, { backgroundColor: '#F59E0B' }]}
            onPress={() => router.push({
              pathname: '/tracker/[disciplineId]/start',
              params: {
                disciplineId: activeDraft.disciplineId,
                workoutId: activeDraft.workoutId,
                programId: activeDraft.programId,
                week: activeDraft.programWeek ? String(activeDraft.programWeek) : undefined,
                day: activeDraft.programDay ? String(activeDraft.programDay) : undefined,
              },
            })}
          >
            <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.nextWorkoutButtonText}>Hervat workout</Text>
          </Pressable>
      </GradientCard>
      )}

      {/* Volgende training */}
      {nextWorkout ? (
        <GradientCard style={styles.nextWorkoutCard} cardRadius={cardRadius}>
          <View style={styles.nextWorkoutHeader}>
            <Text style={[styles.nextWorkoutLabel, { color: theme.subtitleColor }]}>VOLGENDE TRAINING</Text>
            <Text style={[styles.nextWorkoutProgram, { color: theme.titleColor }]}>{nextWorkout.program.name}</Text>
            <Text style={[styles.nextWorkoutWeekDay, { color: theme.subtitleColor }]}>Week {nextWorkout.week} · Dag {nextWorkout.day}</Text>
          </View>
          <View style={styles.nextWorkoutBody}>
            <Text style={[styles.nextWorkoutWorkoutName, { color: theme.titleColor }]}>{nextWorkout.workout?.name || 'Volgende training'}</Text>
            {nextWorkout.workout?.duration && (
              <Text style={[styles.nextWorkoutMeta, { color: theme.subtitleColor }]}>
                {nextWorkout.workout.duration} · {nextWorkout.workout.level}
              </Text>
            )}
            <Text style={[styles.nextWorkoutProgress, { color: theme.subtitleColor }]}>
              {nextWorkout.completedCount} van {nextWorkout.totalPlannedWorkouts} trainingen voltooid
            </Text>
          </View>
          <Pressable
            style={[styles.nextWorkoutButton, { backgroundColor: '#2563EB' }]}
            onPress={() => router.push({
              pathname: '/tracker/[disciplineId]/start',
              params: {
                disciplineId: nextWorkout.disciplineSlug,
                workoutId: nextWorkout.workout?.id,
                programId: nextWorkout.program.id,
                week: String(nextWorkout.week),
                day: String(nextWorkout.day),
              },
            })}
          >
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            <Text style={styles.nextWorkoutButtonText}>Start training</Text>
          </Pressable>
      </GradientCard>
      ) : (
        <GradientCard style={styles.nextWorkoutCard} cardRadius={cardRadius}>
          <View style={styles.dailyStatusRow}>
            <View style={[styles.dailyStatusItem, { backgroundColor: theme.background }]}>
              <MaterialCommunityIcons name="dumbbell" size={20} color="#2563EB" />
              <View style={styles.dailyStatusContent}>
                <Text style={[styles.dailyStatusLabel, { color: theme.titleColor }]}>Training</Text>
                <Text style={[styles.dailyStatusValue, { color: theme.subtitleColor }]}>Nog niet gepland</Text>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.startTrainingButton,
                { backgroundColor: theme.card },
                pressed && styles.startTrainingButtonPressed,
              ]}
              onPress={() => router.push('/my-programs')}
            >
              <MaterialCommunityIcons name="calendar-multiselect" size={18} color={theme.colors.primary} />
              <Text style={[styles.startTrainingButtonText, { color: theme.colors.primary }]}>Bekijk programma&apos;s</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.primary} />
            </Pressable>
          </View>
        </GradientCard>
      )}

      {/* Jouw dag vandaag - andere items */}
      <GradientCard cardRadius={cardRadius}>
        <View style={styles.dailyStatusRow}>
          <View style={[styles.dailyStatusItem, { backgroundColor: theme.background }]}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#059669" />
            <View style={styles.dailyStatusContent}>
              <Text style={[styles.dailyStatusLabel, { color: theme.titleColor }]}>Voeding</Text>
              <Text style={[styles.dailyStatusValue, { color: theme.subtitleColor }]}>Log je eerste maaltijd</Text>
            </View>
          </View>
          <View style={[styles.dailyStatusItem, { backgroundColor: theme.background }]}>
            <MaterialCommunityIcons name="meditation" size={20} color={recoveryIconColor} />
            <View style={styles.dailyStatusContent}>
              <Text style={[styles.dailyStatusLabel, { color: theme.titleColor }]}>Herstel</Text>
              <Text style={[styles.dailyStatusValue, { color: theme.subtitleColor }]}>Check hoe je je voelt</Text>
            </View>
          </View>
        </View>
      </GradientCard>

      {/* Nieuw blok: Vandaag afronden */}
      <GradientCard cardRadius={cardRadius}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Vandaag afronden</Text>
        <View style={styles.dailyProgressRow}>
          <View style={styles.dailyProgressContent}>
            <Text style={[styles.dailyProgressLabel, { color: theme.titleColor }]}>0 van 3 acties voltooid</Text>
            <View style={[styles.dailyProgressBar, { backgroundColor: theme.border }]}>
              <View style={[styles.dailyProgressFill, { width: '0%', backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
          <View style={styles.dailyProgressDots}>
            <View style={[styles.dailyProgressDot, { backgroundColor: theme.border }]} />
            <View style={[styles.dailyProgressDot, { backgroundColor: theme.border }]} />
            <View style={[styles.dailyProgressDot, { backgroundColor: theme.border }]} />
          </View>
        </View>
      </GradientCard>

      {/* Nieuw blok: Aanbevolen voor vandaag */}
      <GradientCard cardRadius={cardRadius}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Aanbevolen voor vandaag</Text>
        <View style={styles.recommendationGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.recommendationCard,
              { backgroundColor: theme.background },
              pressed && styles.recommendationCardPressed,
            ]}
            onPress={() => router.push('/tracker')}
          >
            <View style={[styles.recommendationIconContainer, { backgroundColor: mobilityIconBg }]}>
              <MaterialCommunityIcons name="run-fast" size={22} color={mobilityIconColor} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={[styles.recommendationTitle, { color: theme.titleColor }]}>Start een korte mobility sessie</Text>
              <Text style={[styles.recommendationSubtitle, { color: theme.subtitleColor }]}>Verbeter je flexibiliteit</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.recommendationCard,
              { backgroundColor: theme.background },
              pressed && styles.recommendationCardPressed,
            ]}
            onPress={() => router.push('/tracker')}
          >
            <View style={[styles.recommendationIconContainer, { backgroundColor: trainingIconBg }]}>
              <MaterialCommunityIcons name="calendar-check" size={22} color={trainingIconColor} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={[styles.recommendationTitle, { color: theme.titleColor }]}>Plan je training</Text>
              <Text style={[styles.recommendationSubtitle, { color: theme.subtitleColor }]}>Bekijk je schema</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.recommendationCard,
              { backgroundColor: theme.background },
              pressed && styles.recommendationCardPressed,
            ]}
            onPress={() => router.push('/nutrition/add')}
          >
            <View style={[styles.recommendationIconContainer, { backgroundColor: nutritionIconBg }]}>
              <MaterialCommunityIcons name="food-apple" size={22} color={nutritionIconColor} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={[styles.recommendationTitle, { color: theme.titleColor }]}>Bekijk je voedingsdoel</Text>
              <Text style={[styles.recommendationSubtitle, { color: theme.subtitleColor }]}>Log je maaltijden</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
          </Pressable>
        </View>
      </GradientCard>

        {showShortcutPicker ? (
          <View style={[styles.shortcutsPickerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.shortcutsPickerTitle, { color: theme.titleColor }]}>Kies 3 sneltoetsen</Text>
            <Text style={[styles.shortcutsPickerHint, { color: theme.subtitleColor }]}>Tap op een optie om te selecteren. Selecteer precies 3 opties.</Text>
            <View style={styles.shortcutsPickerOptions}>
              {SHORTCUT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.shortcutsPickerOption,
                    shortcuts.includes(option.id) ? styles.shortcutsPickerOptionSelected : null,
                    { backgroundColor: theme.background, borderColor: theme.border },
                  ]}
                  onPress={() => {
                    if (shortcuts.includes(option.id)) {
                      if (shortcuts.length > 1) {
                        handleSaveShortcuts(shortcuts.filter((id) => id !== option.id));
                      }
                    } else if (shortcuts.length < 3) {
                      handleSaveShortcuts([...shortcuts, option.id]);
                    }
                  }}
                >
                  <MaterialCommunityIcons name={option.icon} size={18} color={shortcuts.includes(option.id) ? '#2563EB' : '#94A3B8'} />
                  <Text style={[styles.shortcutsPickerOptionText, { color: shortcuts.includes(option.id) ? '#2563EB' : theme.titleColor }]}>{option.label}</Text>
                  {shortcuts.includes(option.id) && (
                    <MaterialCommunityIcons name="check-circle" size={16} color="#2563EB" />
                  )}
                </Pressable>
              ))}
            </View>
            <View style={styles.shortcutsPickerActions}>
              <Pressable
                style={[styles.shortcutsPickerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => setShowShortcutPicker(false)}
              >
                <Text style={[styles.shortcutsPickerButtonText, { color: theme.titleColor }]}>Annuleren</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

      <GradientCard cardRadius={cardRadius}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Vandaag actief</Text>
        {todayActivities.length > 0 ? (
          <>
            <Text style={[styles.activityStatus, { color: theme.subtitleColor }]}>{todayActivities.length} activiteit{todayActivities.length > 1 ? 'en' : ''} vandaag</Text>
            {mostRecentTodayActivity ? (
              <Pressable
                style={styles.recentActivityCard}
                onPress={() => router.push({ pathname: '/activities/[id]', params: { id: mostRecentTodayActivity.id } })}
              >
                <Text style={styles.recentDiscipline}>{mostRecentTodayActivity.disciplineName}</Text>
                <Text style={styles.recentMeta}>{formatDuration(mostRecentTodayActivity.durationSeconds)} · {formatDateTime(mostRecentTodayActivity.endedAt)}</Text>
                <Text style={styles.recentSummary}>{getMetricsSummary(mostRecentTodayActivity)}</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <View>
            <Text style={[styles.activityStatus, { color: theme.subtitleColor }]}>Nog geen activiteit</Text>
            <Pressable onPress={() => router.push('/tracker')}>
              <Text style={styles.inlineLink}>Start activiteit</Text>
            </Pressable>
          </View>
        )}
      </GradientCard>

      <GradientCard cardRadius={cardRadius}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Gekoppelde data</Text>
        <Text style={[styles.sectionHint, { color: theme.subtitleColor }]}>Overzicht van je huidige device-koppelingen.</Text>
        {!hasConnectedDevice ? (
          <>
            <Text style={[styles.dataFallback, { color: theme.subtitleColor }]}>Nog geen apparaat gekoppeld.</Text>
            <Text style={[styles.connectedSubtext, { color: theme.subtitleColor }]}>Koppel WHOOP of Fitbit om je dagdata automatisch te verrijken.</Text>
          </>
        ) : (
          <View style={styles.connectedList}>
            <View style={[styles.connectedItem, isWhoopConnected ? styles.connectedItemActive : null]}>
              <Text style={styles.connectedItemTitle}>WHOOP · {isWhoopConnected ? 'Verbonden' : 'Koppelbaar'}</Text>
              <Text style={styles.connectedItemText}>Data: {whoopDevice ? whoopDevice.dataPoints.join(', ') : 'Recovery, Sleep, Strain, Heart rate'}</Text>
            </View>
            <View style={[styles.connectedItem, isFitbitConnected ? styles.connectedItemActive : null]}>
              <Text style={styles.connectedItemTitle}>Fitbit · {isFitbitConnected ? 'Verbonden' : 'Koppelbaar'}</Text>
              <Text style={styles.connectedItemText}>Data: {fitbitDevice ? fitbitDevice.dataPoints.join(', ') : 'Steps, Sleep, Heart rate, HRV'}</Text>
            </View>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            pressed && styles.linkButtonPressed,
          ]}
          onPress={() => router.push('/data-link')}
        >
          <MaterialCommunityIcons name="link-variant" size={16} color="#1E3A8A" />
          <Text style={styles.linkButtonText}>Data koppelen</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#1E3A8A" />
        </Pressable>
      </GradientCard>

      <View style={styles.bottomSpacer} />
    </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  dateLabel: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  heroWrap: {
    marginBottom: 12,
  },
  heroCard: {
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  heroCardFallback: {
    backgroundColor: '#111827',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,6,23,0.55)',
    padding: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  heroOverlayFallback: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.55)',
    padding: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroContent: {
    marginTop: 'auto',
  },
  heroSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroSettingsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroPickerCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  heroPickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  heroPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroPickerCardItem: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  heroPickerCardItemActive: {
    borderColor: '#2563EB',
  },
  heroPickerCardItemDisabled: {
    opacity: 0.5,
  },
  heroPickerCardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heroPickerCardImageStyle: {
    borderRadius: 10,
  },
  heroPickerCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  heroPickerCardCheckmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  heroPickerCardLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroPickerCardUnlockLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  heroPickerCardFallback: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroPickerCardFallbackGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  welcomeAuthor: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontStyle: 'italic',
  },
  heroDateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  shortcutsSection: {
    marginBottom: 12,
  },
  shortcutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortcutsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  customizeButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  shortcutCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    minHeight: 80,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  shortcutCardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  shortcutCardContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  shortcutCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  shortcutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
  },
  shortcutLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  shortcutsPickerCard: {
    marginTop: 8,
    borderRadius: 12,
    padding: 14,
  },
  shortcutsPickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  shortcutsPickerHint: {
    fontSize: 12,
    marginBottom: 12,
  },
  shortcutsPickerOptions: {
    gap: 6,
  },
  shortcutsPickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  shortcutsPickerOptionSelected: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  shortcutsPickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  shortcutsPickerActions: {
    marginTop: 8,
  },
  shortcutsPickerButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  shortcutsPickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryCard: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.26,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  primaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryTextWrap: {
    flex: 1,
  },
  primaryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  primarySubtitle: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  sectionCard: {
    borderWidth: 0,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  sectionCardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  ribbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  ribbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  ribbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '25deg' }],
  },
  ribbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '150%',
    height: '80%',
    transform: [{ rotate: '-20deg' }],
  },
  ribbonRight: {
    position: 'absolute',
    top: '-6%',
    right: '-12%',
    width: '140%',
    height: '60%',
    transform: [{ rotate: '-5deg' }],
  },
  ribbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Thin ribbon styles for Sapphire theme
  thinRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '15deg' }],
  },
  thinRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '180%',
    height: '1px',
    transform: [{ rotate: '-10deg' }],
  },
  thinRibbonBlue: {
    position: 'absolute',
    top: '-8%',
    left: '-8%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '25deg' }],
  },
  thinRibbonRose: {
    position: 'absolute',
    bottom: '-8%',
    right: '-8%',
    width: '200%',
    height: '2px',
    transform: [{ rotate: '-20deg' }],
  },
  thinRibbonRight: {
    position: 'absolute',
    top: '-6%',
    right: '-12%',
    width: '180%',
    height: '1px',
    transform: [{ rotate: '-5deg' }],
  },
  // Calm gemstone styles for Sapphire theme
  sapphireGlowOverlay: {
    position: 'absolute',
    top: '0%',
    right: '0%',
    width: '30%',
    height: '30%',
    borderRadius: 20,
    opacity: 1,
  },
  facetLarge: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '50%',
    height: '40%',
    borderTopLeftRadius: 20,
    opacity: 1,
  },
  facetMedium: {
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '40%',
    height: '35%',
    borderBottomRightRadius: 18,
    opacity: 1,
  },
  glassBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.20)',
    opacity: 1,
  },
  cardContent: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  dataFallback: {
    fontSize: 13,
    marginBottom: 8,
  },
  connectedSubtext: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  connectedList: {
    gap: 8,
  },
  connectedItem: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  connectedItemActive: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  connectedItemTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  connectedItemText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 17,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataTile: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  dataTileLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  dataTileValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  linkButtonText: {
    color: '#1E3A8A',
    fontWeight: '700',
    fontSize: 13,
  },
  activityStatus: {
    fontSize: 14,
    marginBottom: 10,
  },
  recentActivityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
  },
  recentDiscipline: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentMeta: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 4,
  },
  recentSummary: {
    color: '#1F2937',
    fontSize: 13,
    lineHeight: 18,
  },
  inlineLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 22,
  },
  dailyStatusRow: {
    marginTop: 12,
    gap: 12,
  },
  dailyStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dailyStatusContent: {
    flex: 1,
  },
  dailyStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  dailyStatusValue: {
    fontSize: 13,
    lineHeight: 18,
  },
  dailyProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dailyProgressContent: {
    flex: 1,
  },
  dailyProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dailyProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  dailyProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  dailyProgressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dailyProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recommendationGrid: {
    marginTop: 12,
    gap: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recommendationCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  recommendationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  recommendationSubtitle: {
    fontSize: 13,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  dailyStatusSub: {
    fontSize: 12,
    marginTop: 2,
  },
  dailyStatusProgress: {
    fontSize: 11,
    marginTop: 2,
    color: '#10B981',
  },
  startTrainingButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startTrainingButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  startTrainingButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  nextWorkoutCard: {
    padding: 16,
  },
  nextWorkoutHeader: {
    marginBottom: 12,
  },
  nextWorkoutLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nextWorkoutProgram: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  nextWorkoutWeekDay: {
    fontSize: 13,
  },
  nextWorkoutBody: {
    marginBottom: 16,
  },
  nextWorkoutWorkoutName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  nextWorkoutMeta: {
    fontSize: 13,
    marginBottom: 8,
  },
  nextWorkoutProgress: {
    fontSize: 13,
    color: '#10B981',
  },
  nextWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  nextWorkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
