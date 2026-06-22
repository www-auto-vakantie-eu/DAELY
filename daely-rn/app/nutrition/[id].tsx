import { StyleSheet, View, Text, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { getPublicCreatorMeals } from '@/services/creator-content';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { THEMES } from '@/constants/themes';

function pickProtein(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('zalm') || lower.includes('salmon')) return '150 g zalmfilet';
  if (lower.includes('kip') || lower.includes('chicken')) return '180 g kipfilet';
  if (lower.includes('steak') || lower.includes('beef')) return '180 g mager rundvlees';
  if (lower.includes('tofu')) return '200 g stevige tofu';
  if (lower.includes('tuna') || lower.includes('tonijn')) return '1 blik tonijn op water';
  if (lower.includes('egg') || lower.includes('omelet')) return '3 eieren + 150 g eiwit';
  if (lower.includes('yogurt') || lower.includes('quark') || lower.includes('skyr')) return '250 g (Griekse) yoghurt of skyr';
  return '30 g eiwitpoeder (whey/plantaardig)';
}

function pickCarb(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('rice') || lower.includes('rijst')) return '120 g (gekookte) rijst';
  if (lower.includes('oats') || lower.includes('haver')) return '60 g havermout';
  if (lower.includes('pasta') || lower.includes('noodle')) return '75 g (droge) pasta/noodles';
  if (lower.includes('potato') || lower.includes('aardappel')) return '250 g aardappel of zoete aardappel';
  if (lower.includes('smoothie') || lower.includes('shake')) return '1 banaan of 100 g bessen';
  return '100 g quinoa of volkoren granen';
}

function buildIngredients(title: string): string[] {
  const lower = title.toLowerCase();
  const base = [
    pickProtein(title),
    pickCarb(title),
    '200 g gemengde groenten',
    '1 el olijfolie',
    '1 teen knoflook',
    'Zout en peper naar smaak',
  ];

  if (lower.includes('smoothie') || lower.includes('shake')) {
    return [
      pickProtein(title),
      pickCarb(title),
      '250 ml water/melk(alternatief)',
      '1 el chia- of lijnzaad',
      'IJsblokjes (optioneel)',
      'Kaneel of cacao naar smaak',
    ];
  }

  if (lower.includes('soup') || lower.includes('soep')) {
    return [
      pickProtein(title),
      '400 ml bouillon (zoutarm)',
      '150 g wortel, prei en selderij',
      '100 g aardappel of noedels',
      '1 el olijfolie',
      'Kruiden naar keuze',
    ];
  }

  return base;
}

function buildSteps(title: string): string[] {
  const lower = title.toLowerCase();

  if (lower.includes('smoothie') || lower.includes('shake')) {
    return [
      'Voeg alle ingredienten toe aan de blender.',
      'Blend 30-60 seconden tot een gladde textuur.',
      'Pas dikte aan met extra water of ijs en serveer direct.',
    ];
  }

  if (lower.includes('salad') || lower.includes('bowl')) {
    return [
      'Bereid de eiwitbron (bakken/grillen) en kook de koolhydraatbron indien nodig.',
      'Snijd groenten fijn en maak een snelle dressing met olie, citroen en kruiden.',
      'Stel de bowl/salade samen en werk af met kruiden of zaden.',
    ];
  }

  if (lower.includes('soup') || lower.includes('soep')) {
    return [
      'Fruit knoflook en groenten 2-3 minuten in een pan.',
      'Voeg bouillon en eiwitbron toe en laat 15-20 minuten zacht koken.',
      'Breng op smaak en serveer warm.',
    ];
  }

  return [
    'Snijd alle ingredienten en weeg porties af voor consistente macros.',
    'Verhit pan of oven en bereid eiwitbron tot gaar.',
    'Voeg groenten en koolhydraatbron toe, kruid naar smaak en serveer.',
  ];
}

function prepTimeFromTags(tags: string[]): string {
  if (tags.includes('Onder 10 min')) return '5-10 min';
  if (tags.includes('10 tot 20 min')) return '10-20 min';
  if (tags.includes('20 tot 40 min')) return '20-40 min';
  return 'Meal prep (40+ min)';
}

// Helper to get theme-aware Aurora tokens (same as Today)
function getAuroraTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';
  const isZen = currentTheme.id === 'zenInk';
  const isSapphire = currentTheme.id === 'sapphire';
  const isRuby = currentTheme.id === 'ruby';
  const isCoral = currentTheme.id === 'coralBloom';
  const isMarble = currentTheme.id === 'marble';
  const isBordeauxVelvet = currentTheme.id === 'bordeauxVelvet';
  const isChampagneRose = currentTheme.id === 'champagneRose';
  const isIvoryGold = currentTheme.id === 'ivoryGold';
  const isMineralGreen = currentTheme.id === 'mineralGreen';
  const isObsidianGold = currentTheme.id === 'obsidianGold';

  // Theme-aware gradient for card backgrounds
  const themeGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
      : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
      : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
      : isCoral ? (currentTheme.gradients.aurora || ['#FFF7F3', '#FFEDE7', '#FFD6C9'])
      : isMarble ? (currentTheme.gradients.aurora || ['#FFFFFF', '#F7F7F5', '#ECEDEA'])
      : isBordeauxVelvet ? (currentTheme.gradients.aurora || ['#2A0D16', '#3A1220', '#4A1A2A'])
      : isChampagneRose ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FAF0EA', '#F5E7D8'])
      : isIvoryGold ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF8E6', '#F5E7D0'])
      : isMineralGreen ? (currentTheme.gradients.aurora || ['#FFFFFF', '#EEF6F1', '#E0EDE4'])
      : isObsidianGold ? (currentTheme.gradients.aurora || ['#111111', '#181818', '#252525'])
      : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  // Sapphire-specific shape tokens
  const cardRadius = isSapphire ? (currentTheme.colors.cardRadius || 14) : isRetro ? 16 : isSahara ? 16 : isForce ? 16 : isZen ? 14 : isBordeauxVelvet ? (currentTheme.colors.cardRadius || 26) : isChampagneRose ? (currentTheme.colors.cardRadius || 28) : isIvoryGold ? (currentTheme.colors.cardRadius || 22) : isMineralGreen ? (currentTheme.colors.cardRadius || 24) : isObsidianGold ? (currentTheme.colors.cardRadius || 18) : 16;
  const cardBorderWidth = isSapphire ? (currentTheme.colors.cardBorderWidth || 1.5) : isRetro ? 1 : isSahara ? 1 : isForce ? 1 : isZen ? 1 : isBordeauxVelvet ? (currentTheme.colors.cardBorderWidth || 1.2) : isChampagneRose ? (currentTheme.colors.cardBorderWidth || 1) : isIvoryGold ? (currentTheme.colors.cardBorderWidth || 0.8) : isMineralGreen ? (currentTheme.colors.cardBorderWidth || 1) : isObsidianGold ? (currentTheme.colors.cardBorderWidth || 1) : 1;
  const iconBubbleRadius = isSapphire ? (currentTheme.colors.iconBubbleRadius || 12) : isRetro ? 14 : isSahara ? 14 : isForce ? 14 : isZen ? 10 : isBordeauxVelvet ? (currentTheme.colors.iconBubbleRadius || 18) : isChampagneRose ? (currentTheme.colors.iconBubbleRadius || 20) : isIvoryGold ? (currentTheme.colors.iconBubbleRadius || 16) : isMineralGreen ? (currentTheme.colors.iconBubbleRadius || 16) : isObsidianGold ? (currentTheme.colors.iconBubbleRadius || 14) : 14;
  const shortcutRadius = isSapphire ? (currentTheme.colors.shortcutRadius || 12) : isBordeauxVelvet ? (currentTheme.colors.shortcutRadius || 18) : isChampagneRose ? (currentTheme.colors.shortcutRadius || 20) : isIvoryGold ? (currentTheme.colors.shortcutRadius || 16) : isMineralGreen ? (currentTheme.colors.shortcutRadius || 16) : isObsidianGold ? (currentTheme.colors.shortcutRadius || 14) : 16;

  return {
    auroraGradient: themeGradient,
    auroraTitle: currentTheme.colors.auroraTitle || (isZen ? '#FFFFFF' : isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#111827' : isBordeauxVelvet ? '#FFF1F4' : isChampagneRose ? '#2A1F23' : isIvoryGold ? '#2A261C' : isMineralGreen ? '#163227' : isObsidianGold ? '#FFF7D6' : '#1E1B4B'),
    auroraSubtitle: currentTheme.colors.auroraSubtitle || (isZen ? '#B0B0B0' : isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : isCoral ? '#A95B5B' : isMarble ? '#4B5563' : isBordeauxVelvet ? '#E8B8C2' : isChampagneRose ? '#7A5A62' : isIvoryGold ? '#6F6448' : isMineralGreen ? '#4D6B5C' : isObsidianGold ? '#C9B97A' : '#4A3A8C'),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : isSapphire ? (currentTheme.colors.glassLine1 || ['rgba(147, 197, 253, 0.04)', 'rgba(147, 197, 253, 0.01)'])
        : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
        : isCoral ? (currentTheme.gradients.auroraBlue || ['rgba(255, 177, 153, 0.32)', 'rgba(255, 214, 201, 0.16)'])
        : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
        : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
        : isCoral ? ['rgba(255, 214, 201, 0.20)', 'rgba(255, 214, 201, 0.08)']
        : isMarble ? ['#FFFFFF', '#F9EEF2']
        : isBordeauxVelvet ? ['#3A1220', '#4A1A2A']
        : isChampagneRose ? ['#FAF0EA', '#F5E7D8']
        : isIvoryGold ? ['#FFF8E6', '#F5E7D0']
        : isMineralGreen ? ['#EEF6F1', '#E0EDE4']
        : isObsidianGold ? ['#181818', '#252525']
        : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
        : isRuby ? (currentTheme.gradients.auroraBlue || ['rgba(95, 15, 42, 0.28)', 'rgba(95, 15, 42, 0.08)'])
        : isCoral ? (currentTheme.gradients.auroraBlue || ['rgba(255, 177, 153, 0.32)', 'rgba(255, 214, 201, 0.16)'])
        : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
        : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)'])
        : isZen ? (currentTheme.gradients.auroraRose || ['rgba(156, 163, 175, 0.14)', 'rgba(156, 163, 175, 0.05)'])
        : isSapphire ? (currentTheme.colors.glassLine2 || ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
        : isRuby ? (currentTheme.gradients.auroraRose || ['rgba(184, 50, 90, 0.26)', 'rgba(228, 90, 122, 0.08)'])
        : isCoral ? (currentTheme.gradients.auroraRose || ['rgba(249, 115, 107, 0.30)', 'rgba(232, 93, 117, 0.12)'])
        : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : isSapphire ? (currentTheme.colors.glassLine3 || ['rgba(147, 197, 253, 0.02)', 'rgba(147, 197, 253, 0.005)'])
        : isRuby ? ['rgba(255, 228, 236, 0.20)', 'rgba(255, 228, 236, 0.08)']
        : isCoral ? ['rgba(255, 214, 201, 0.20)', 'rgba(255, 214, 201, 0.08)']
        : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : isSapphire ? (currentTheme.colors.glassGlow ? [currentTheme.colors.glassGlow, 'rgba(59, 130, 246, 0.005)'] : ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.005)'])
      : isRuby ? (currentTheme.colors.rubyGlowBorder ? [currentTheme.colors.rubyGlowBorder, 'rgba(184, 50, 90, 0.08)'] : ['rgba(228, 90, 122, 0.24)', 'rgba(255, 228, 236, 0.08)'])
      : isCoral ? (currentTheme.colors.coralSoftGlow ? [currentTheme.colors.coralSoftGlow, 'rgba(249, 115, 107, 0.05)'] : ['rgba(255, 214, 201, 0.18)', 'rgba(255, 177, 153, 0.06)'])
      : isMarble ? (currentTheme.colors.marbleSoftHighlight ? [currentTheme.colors.marbleSoftHighlight, 'rgba(168, 162, 158, 0.04)'] : ['rgba(255, 255, 255, 0.78)', 'rgba(168, 162, 158, 0.04)'])
      : isBordeauxVelvet ? ['rgba(212, 175, 55, 0.24)', 'rgba(168, 50, 86, 0.10)']
      : isChampagneRose ? ['rgba(198, 161, 91, 0.24)', 'rgba(183, 110, 121, 0.10)']
      : isIvoryGold ? ['rgba(198, 161, 91, 0.24)', 'rgba(231, 211, 161, 0.10)']
      : isMineralGreen ? ['rgba(79, 124, 104, 0.24)', 'rgba(127, 166, 146, 0.10)']
      : isObsidianGold ? ['rgba(212, 175, 55, 0.24)', 'rgba(138, 106, 32, 0.10)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Coral Bloom soft glow flag
    useSoftCoralGlow: isCoral,
    // Marble soft vein flag
    useSoftMarbleVein: isMarble,
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.12)' : isSapphire ? (currentTheme.colors.glassBorder || 'rgba(147, 197, 253, 0.25)') : isRuby ? (currentTheme.colors.rubyGlowBorder || 'rgba(244, 167, 185, 0.22)') : isCoral ? (currentTheme.colors.coralGlowBorder || 'rgba(249, 115, 107, 0.22)') : isMarble ? (currentTheme.colors.marbleGlowBorder || 'rgba(107, 114, 128, 0.18)') : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : isSapphire ? (currentTheme.colors.glassShadow || 'rgba(59, 130, 246, 0.28)') : isRuby ? (currentTheme.colors.rubyGlowShadow || 'rgba(184, 50, 90, 0.24)') : isCoral ? (currentTheme.colors.coralGlowShadow || 'rgba(249, 115, 107, 0.20)') : isMarble ? (currentTheme.colors.marbleGlowShadow || 'rgba(107, 114, 128, 0.16)') : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? (currentTheme.colors.rubyIconBg || 'rgba(184, 50, 90, 0.14)') : isCoral ? (currentTheme.colors.coralIconBg || 'rgba(255, 177, 153, 0.24)') : isMarble ? (currentTheme.colors.marbleIconBg || 'rgba(245, 245, 244, 0.86)') : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : isSapphire ? 'rgba(147, 197, 253, 0.24)' : isRuby ? (currentTheme.colors.rubyIconBorder || 'rgba(244, 167, 185, 0.24)') : isCoral ? (currentTheme.colors.coralIconBorder || 'rgba(249, 115, 107, 0.26)') : isMarble ? (currentTheme.colors.marbleIconBorder || 'rgba(168, 162, 158, 0.24)') : undefined,
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
    sapphireGlow: isSapphire ? (currentTheme.colors.sapphireGlow || 'rgba(59, 130, 246, 0.16)') : undefined,
  };
}

// Helper component for gradient cards with Soft Aurora Ribbon style
function GradientCard({ children, style, cardRadius }: { children: React.ReactNode, style?: any, cardRadius?: number }) {
  const theme = useTheme();
  const { auroraGradient, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight, useThinLines, facetLarge, facetMedium, sapphireGlow } = getAuroraTokens(theme.id);
  const isCoral = theme.id === 'coralBloom';
  const isMarble = theme.id === 'marble';

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
        {/* Top-left ribbon - reduced for Coral Bloom */}
        {!isCoral && <LinearGradient
          colors={ribbonTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleTop}
          pointerEvents="none"
        />}
        {/* Mid-card ribbon - reduced for Coral Bloom */}
        {!isCoral && <LinearGradient
          colors={ribbonMid}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleMid}
          pointerEvents="none"
        />}
        {/* Diagonal top-right ribbon - reduced for Coral Bloom */}
        {!isCoral && <LinearGradient
          colors={ribbonBlue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleBlue}
          pointerEvents="none"
        />}
        {/* Diagonal bottom-left ribbon - reduced for Coral Bloom */}
        {!isCoral && <LinearGradient
          colors={ribbonRose}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={ribbonStyleRose}
          pointerEvents="none"
        />}
        {/* Right-side accent ribbon - reduced for Coral Bloom */}
        {!isCoral && <LinearGradient
          colors={ribbonRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbonStyleRight}
          pointerEvents="none"
        />}
        {/* Marble premium stone texture - only for Marble theme */}
        {isMarble && (
          <>
            {/* Main diagonal vein */}
            <LinearGradient
              colors={['rgba(55, 65, 81, 0.22)', 'rgba(55, 65, 81, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: -20,
                left: -40,
                width: 200,
                height: 3,
                transform: [{ rotate: '-15deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Secondary vein */}
            <LinearGradient
              colors={['rgba(120, 113, 108, 0.18)', 'rgba(120, 113, 108, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 60,
                right: -30,
                width: 140,
                height: 2,
                transform: [{ rotate: '12deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Third soft vein */}
            <LinearGradient
              colors={['rgba(168, 162, 158, 0.16)', 'rgba(168, 162, 158, 0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                bottom: -15,
                left: 40,
                width: 120,
                height: 2,
                transform: [{ rotate: '8deg' }],
                pointerEvents: 'none',
              }}
              pointerEvents="none"
            />
            {/* Pearl highlight */}
            <View
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 180,
                height: 140,
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
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
        {/* Soft Coral Bloom petal glow - only for Coral theme */}
        {isCoral && (
          <>
            {/* Large soft bloom top-left */}
            <View
              style={{
                position: 'absolute',
                top: -80,
                left: -80,
                width: 280,
                height: 200,
                borderRadius: 999,
                backgroundColor: 'rgba(255, 177, 153, 0.15)',
                pointerEvents: 'none',
              }}
            />
            {/* Petal glow bottom-right */}
            <View
              style={{
                position: 'absolute',
                bottom: -70,
                right: -70,
                width: 240,
                height: 160,
                borderRadius: 999,
                backgroundColor: 'rgba(249, 115, 107, 0.10)',
                pointerEvents: 'none',
              }}
            />
          </>
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

export default function NutritionMealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { auroraGradient, auroraTitle, auroraSubtitle, shortcutBorderColor, shortcutShadowColor, shortcutIconBg, shortcutIconBorder, cardRadius } = getAuroraTokens(theme.id);
  const [creatorMeals, setCreatorMeals] = useState<typeof NUTRITION_MEALS>([]);

  useEffect(() => {
    getPublicCreatorMeals().then(setCreatorMeals).catch(() => setCreatorMeals([]));
  }, []);

  const allMeals = useMemo(() => [...creatorMeals, ...NUTRITION_MEALS], [creatorMeals]);
  const meal = allMeals.find((item) => item.id === id);

  if (!meal) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={Platform.OS === 'web' ? styles.webContainer : undefined}>
            <Text style={[styles.notFoundTitle, { color: theme.titleColor }]}>Gerecht niet gevonden</Text>
          </View>
        </ScrollView>
        <SharedBottomNav activeTab="nutrition" />
      </AppScreen>
    );
  }

  const ingredients = buildIngredients(meal.title);
  const steps = buildSteps(meal.title);
  const prepTime = prepTimeFromTags(meal.timeTags);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={Platform.OS === 'web' ? styles.webContainer : undefined}>
            <View style={styles.topArea}>
            <ImageBackground source={{ uri: meal.image }} style={styles.hero} imageStyle={styles.heroImage}>
              <LinearGradient colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']} style={styles.heroOverlay}>
                <View>
                  <Text style={styles.heroTitle}>{meal.title}</Text>
                  <Text style={styles.heroMeta}>{meal.kcal} KCAL    {meal.protein}G EIWIT</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Over dit gerecht</Text>
            <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{meal.description}</Text>

            <View style={styles.statsRow}>
              {auroraGradient ? (
                <>
                  <View style={[styles.statCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}>
                    <LinearGradient colors={auroraGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardGradient} pointerEvents="none">
                      {/* Ribbons for DAELY Classic Glow effect */}
                      <LinearGradient colors={['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonTop} pointerEvents="none" />
                      <LinearGradient colors={['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonMid} pointerEvents="none" />
                      <LinearGradient colors={['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.statCardRibbonHighlight} pointerEvents="none" />
                    </LinearGradient>
                    <View style={styles.statCardContent}>
                      <Text style={[styles.statValue, { color: auroraTitle }]}>{meal.kcal}</Text>
                      <Text style={[styles.statLabel, { color: auroraSubtitle }]}>KCAL</Text>
                    </View>
                  </View>
                  <View style={[styles.statCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}>
                    <LinearGradient colors={auroraGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardGradient} pointerEvents="none">
                      <LinearGradient colors={['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonTop} pointerEvents="none" />
                      <LinearGradient colors={['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonMid} pointerEvents="none" />
                      <LinearGradient colors={['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.statCardRibbonHighlight} pointerEvents="none" />
                    </LinearGradient>
                    <View style={styles.statCardContent}>
                      <Text style={[styles.statValue, { color: auroraTitle }]}>{meal.protein}g</Text>
                      <Text style={[styles.statLabel, { color: auroraSubtitle }]}>Eiwit</Text>
                    </View>
                  </View>
                  <View style={[styles.statCard, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}>
                    <LinearGradient colors={auroraGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardGradient} pointerEvents="none">
                      <LinearGradient colors={['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonTop} pointerEvents="none" />
                      <LinearGradient colors={['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCardRibbonMid} pointerEvents="none" />
                      <LinearGradient colors={['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.statCardRibbonHighlight} pointerEvents="none" />
                    </LinearGradient>
                    <View style={styles.statCardContent}>
                      <Text style={[styles.statValueSmall, { color: auroraTitle }]}>{prepTime}</Text>
                      <Text style={[styles.statLabel, { color: auroraSubtitle }]}>BEREIDTIJD</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.statCardSimple, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>{meal.kcal}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>KCAL</Text>
                  </View>
                  <View style={[styles.statCardSimple, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.statValue, { color: theme.titleColor }]}>{meal.protein}g</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Eiwit</Text>
                  </View>
                  <View style={[styles.statCardSimple, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.statValueSmall, { color: theme.titleColor }]}>{prepTime}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>BEREIDTIJD</Text>
                  </View>
                </>
              )}
            </View>

            {auroraGradient ? (
              <TouchableOpacity
                style={[styles.shareButton, { borderColor: shortcutBorderColor, shadowColor: shortcutShadowColor }]}
                onPress={() => router.push({
                  pathname: '/messages/share',
                  params: {
                    linkedItemType: 'recipe',
                    linkedItemId: meal.id,
                    linkedItemTitle: meal.title,
                  },
                })}
              >
                <LinearGradient colors={auroraGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shareButtonGradient} pointerEvents="none">
                  {/* Ribbons for DAELY Classic Glow effect */}
                  <LinearGradient colors={['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shareButtonRibbonTop} pointerEvents="none" />
                  <LinearGradient colors={['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shareButtonRibbonMid} pointerEvents="none" />
                  <LinearGradient colors={['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.shareButtonRibbonHighlight} pointerEvents="none" />
                </LinearGradient>
                <View style={styles.shareButtonContent}>
                  <View style={[styles.shareIconContainer, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                    <MaterialCommunityIcons name="share-outline" size={20} color={auroraSubtitle} />
                  </View>
                  <Text style={[styles.shareButtonText, { color: auroraTitle }]}>Deel via berichten</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.shareButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push({
                  pathname: '/messages/share',
                  params: {
                    linkedItemType: 'recipe',
                    linkedItemId: meal.id,
                    linkedItemTitle: meal.title,
                  },
                })}
              >
                <MaterialCommunityIcons name="share-outline" size={20} color={theme.titleColor} />
                <Text style={[styles.shareButtonText, { color: theme.titleColor }]}>Deel via berichten</Text>
              </TouchableOpacity>
            )}

            <GradientCard cardRadius={cardRadius}>
              <Text style={[styles.blockTitle, { color: theme.titleColor }]}>Ingredienten</Text>
              {ingredients.map((item) => (
                <Text key={item} style={[styles.listText, { color: theme.subtitleColor }]}>• {item}</Text>
              ))}
            </GradientCard>

            <GradientCard cardRadius={cardRadius}>
              <Text style={[styles.blockTitle, { color: theme.titleColor }]}>Bereidingswijze</Text>
              {steps.map((step, index) => (
                <Text key={step} style={[styles.listText, { color: theme.subtitleColor }]}>{index + 1}. {step}</Text>
              ))}
            </GradientCard>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <SharedBottomNav activeTab="nutrition" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  webContainer: {
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  topArea: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  hero: {
    height: 240,
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    borderRadius: 28,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 70,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 54,
    lineHeight: 56,
    letterSpacing: -1.8,
    fontWeight: '900',
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.88)',
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  statCardRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  statCardRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  statCardRibbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statCardContent: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  statCardSimple: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  statValueSmall: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 52,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  shareButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  shareButtonRibbonTop: {
    position: 'absolute',
    top: '-10%',
    left: '-15%',
    width: '170%',
    height: '60%',
    transform: [{ rotate: '15deg' }],
  },
  shareButtonRibbonMid: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '160%',
    height: '20%',
    transform: [{ rotate: '-10deg' }],
  },
  shareButtonRibbonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shareButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 1,
  },
  shareIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  listText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  notFoundTitle: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 140,
  },
  // Gradient Card styles
  sectionCard: {
    borderWidth: 0,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
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
});
