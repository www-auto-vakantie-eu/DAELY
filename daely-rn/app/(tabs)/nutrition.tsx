import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUnreadMessageCount } from '@/services/messages-storage';
import { useAppContext } from '@/contexts/AppContext';
import { THEMES } from '@/constants/themes';

const FILTER_CATEGORIES = [
  { key: 'mealType', label: 'Maaltijd', options: ['Ontbijt', 'Lunch', 'Diner', 'Snack', 'Pre Workout', 'Post Workout', 'Herstel', 'Smoothies', 'Shakes'] },
  { key: 'diets', label: 'Dieet', options: ['Eiwitrijk', 'Koolhydraatarm', 'Keto', 'Veganistisch', 'Vegetarisch', 'Glutenvrij', 'Lactosevrij'] },
  { key: 'goals', label: 'Doel', options: ['Spieropbouw', 'Vetverlies', 'Prestatie', 'Uithoudingsvermogen', 'Herstel focus', 'Lean Bulk', 'Levensduur'] },
  { key: 'macroProfiles', label: 'Macro', options: ['Eiwitrijk', 'Koolhydraatrijk', 'Vetarm', 'Gebalanceerd', 'Onder 500 KCAL', '500 & 800 KCAL', '800 +'] },
  { key: 'timeTags', label: 'Tijd', options: ['Onder 10 min', '10 tot 20 min', '20 tot 40 min', 'Meal prep'] },
  { key: 'budget', label: 'Budget', options: ['€', '€€', '€€€'] },
  { key: 'exclusions', label: 'Uitsluiten', options: ['Geen noten', 'Geen Zuivel', 'Geen Gluten', 'Geen Soja', 'Zout Arm'] },
];

type FilterCategory = (typeof FILTER_CATEGORIES)[number];
type FilterKey = FilterCategory['key'];
type FilterChip = { key: FilterKey; value: string };

const NUTRITION_ACTIONS = [
  {
    key: 'scan',
    title: 'Barcode',
    subtitle: 'Scan product',
    icon: 'barcode-scan' as const,
    route: '/nutrition/scan' as const,
  },
  {
    key: 'search',
    title: 'Zoeken',
    subtitle: 'Zoek product',
    icon: 'text-search' as const,
    route: '/nutrition/search' as const,
  },
  {
    key: 'add',
    title: 'Toevoegen',
    subtitle: 'Nieuw item',
    icon: 'plus-circle-outline' as const,
    route: '/nutrition/add' as const,
  },
  {
    key: 'logbook',
    title: 'Mijn voeding',
    subtitle: 'Bekijk totaal',
    icon: 'notebook-outline' as const,
    route: '/my-nutrition' as const,
  },
];

// Helper to get theme-aware Quick Action button tokens
function getQuickActionTokens(activeThemeId: string) {
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

  // DAELY Classic Glow gradient for buttons
  const classicGlowGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#3D3D3D', '#4A4A4A', '#5A5A5A'])
      : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
      : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
      : isCoral ? (currentTheme.gradients.aurora || ['#FFF7F3', '#FFEDE7', '#FFD6C9'])
      : isMarble ? (currentTheme.gradients.aurora || ['#FFFFFF', '#F7F7F5', '#ECEDEA'])
      : isBordeauxVelvet ? (currentTheme.gradients.aurora || ['#2A0D16', '#3A1220', '#4A1A2A'])
      : isChampagneRose ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FAF0EA', '#F5E7D8'])
      : isIvoryGold ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF8E6', '#F5E7D0'])
      : isMineralGreen ? (currentTheme.gradients.aurora || ['#FFFFFF', '#EEF6F1', '#E0EDE4'])
      : isObsidianGold ? (currentTheme.gradients.aurora || ['#111111', '#181818', '#252525'])
      : ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  // Sapphire-specific shape tokens for quick actions
  const quickActionRadius = isSapphire ? (currentTheme.colors.shortcutRadius || 12) : 16;
  const quickActionIconRadius = isSapphire ? (currentTheme.colors.iconBubbleRadius || 12) : 14;
  const quickActionShadowOpacity = isSapphire ? 0.32 : 0.08;
  const quickActionShadowRadius = isSapphire ? 12 : 8;
  const quickActionShadowOffset = isSapphire ? { width: 0, height: 4 } : { width: 0, height: 2 };

  return {
    gradient: classicGlowGradient,
    iconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? '#F9FAFB' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#4B5563' : '#4A3A8C',
    iconBg: isClassic ? 'rgba(219, 234, 254, 0.7)' : isForce ? 'rgba(254, 202, 202, 0.7)' : isSahara ? 'rgba(245, 230, 211, 0.7)' : isRetro ? 'rgba(255, 253, 247, 0.7)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? (currentTheme.colors.rubyIconBg || 'rgba(184, 50, 90, 0.14)') : isCoral ? (currentTheme.colors.coralIconBg || 'rgba(255, 177, 153, 0.24)') : isMarble ? (currentTheme.colors.marbleIconBg || 'rgba(255, 255, 255, 0.92)') : 'rgba(255, 255, 255, 0.7)',
    iconBorder: isClassic ? 'rgba(255, 255, 255, 0.9)' : isForce ? 'rgba(255, 255, 255, 0.9)' : isSahara ? 'rgba(255, 255, 255, 0.9)' : isRetro ? 'rgba(255, 255, 255, 0.9)' : isZen ? 'rgba(255, 255, 255, 0.16)' : isSapphire ? 'rgba(147, 197, 253, 0.24)' : isRuby ? (currentTheme.colors.rubyIconBorder || 'rgba(244, 167, 185, 0.24)') : isCoral ? (currentTheme.colors.coralIconBorder || 'rgba(249, 115, 107, 0.26)') : isMarble ? (currentTheme.colors.marbleIconBorder || 'rgba(107, 114, 128, 0.26)') : 'rgba(255, 255, 255, 0.9)',
    titleColor: isClassic ? '#0F172A' : isForce ? '#7F1D1D' : isSahara ? '#7A4E24' : isRetro ? '#1B2E6B' : isZen ? '#F9FAFB' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#111827' : '#1E1B4B',
    subtitleColor: isClassic ? '#475569' : isForce ? '#B91C1C' : isSahara ? '#9A6B3A' : isRetro ? '#B42318' : isZen ? '#D1D5DB' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : isCoral ? '#A95B5B' : isMarble ? '#4B5563' : '#4A3A8C',
    shadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? '#000000' : isSapphire ? 'rgba(59, 130, 246, 0.24)' : isRuby ? (currentTheme.colors.rubyGlowShadow || 'rgba(184, 50, 90, 0.24)') : isCoral ? (currentTheme.colors.coralGlowShadow || 'rgba(249, 115, 107, 0.20)') : isMarble ? (currentTheme.colors.marbleGlowShadow || 'rgba(75, 85, 99, 0.18)') : '#6B5B95',
    // Sapphire shape tokens
    quickActionRadius,
    quickActionIconRadius,
    quickActionShadowOpacity,
    quickActionShadowRadius,
    quickActionShadowOffset,
  };
}

// Helper to get theme-aware Filter button tokens
function getFilterTokens(activeThemeId: string) {
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

  // Sapphire-specific filter tokens
  const filterRadius = isSapphire ? (currentTheme.colors.filterRadius || 16) : 18;
  const filterBorderWidth = isSapphire ? 1.5 : 1;
  const badgeRadius = isSapphire ? (currentTheme.colors.badgeRadius || 9999) : 9999;

  if (isClassic) {
    return {
      selectedBorderColor: '#2563EB',
      selectedBackgroundColor: '#EFF6FF',
      selectedTextColor: '#0F172A',
      unselectedBorderColor: '#DCEBFF',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#475569',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#2563EB',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isForce) {
    return {
      selectedBorderColor: '#DC2626',
      selectedBackgroundColor: '#FFF1F2',
      selectedTextColor: '#7F1D1D',
      unselectedBorderColor: '#FECACA',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#B91C1C',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#DC2626',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isSahara) {
    return {
      selectedBorderColor: '#C89B72',
      selectedBackgroundColor: '#FDF8EF',
      selectedTextColor: '#7A4E24',
      unselectedBorderColor: '#E8D0B0',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#9A6B3A',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#C89B72',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isRetro) {
    return {
      selectedBorderColor: '#1B2E6B',
      selectedBackgroundColor: '#FFFDF7',
      selectedTextColor: '#1B2E6B',
      unselectedBorderColor: '#E7C0A3',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#B42318',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#1B2E6B',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isZen) {
    return {
      selectedBorderColor: '#FFFFFF',
      selectedBackgroundColor: '#2D2D2D',
      selectedTextColor: '#FFFFFF',
      unselectedBorderColor: 'rgba(255, 255, 255, 0.12)',
      unselectedBackgroundColor: '#1A1A1A',
      unselectedTextColor: '#B0B0B0',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#FFFFFF',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isSapphire) {
    return {
      selectedBorderColor: '#3B82F6',
      selectedBackgroundColor: '#0C1220',
      selectedTextColor: '#EAF2FF',
      unselectedBorderColor: 'rgba(147, 197, 253, 0.24)',
      unselectedBackgroundColor: '#07111F',
      unselectedTextColor: '#BFDBFE',
      badgeBackgroundColor: '#0C1220',
      badgeTextColor: '#EAF2FF',
      filterRadius,
      filterBorderWidth,
      badgeRadius,
    };
  } else if (isRuby) {
    return {
      selectedBorderColor: '#B8325A',
      selectedBackgroundColor: '#240A10',
      selectedTextColor: '#FFE4EC',
      unselectedBorderColor: 'rgba(244, 167, 185, 0.24)',
      unselectedBackgroundColor: '#140607',
      unselectedTextColor: '#F4A7B9',
      badgeBackgroundColor: '#240A10',
      badgeTextColor: '#FFE4EC',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isCoral) {
    return {
      selectedBorderColor: '#E85D75',
      selectedBackgroundColor: '#FFEDE7',
      selectedTextColor: '#7A2E2E',
      unselectedBorderColor: 'rgba(249, 115, 107, 0.24)',
      unselectedBackgroundColor: '#FFF7F3',
      unselectedTextColor: '#A95B5B',
      badgeBackgroundColor: '#FFEDE7',
      badgeTextColor: '#7A2E2E',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isMarble) {
    return {
      selectedBorderColor: '#6B7280',
      selectedBackgroundColor: '#F7F7F5',
      selectedTextColor: '#1F2937',
      unselectedBorderColor: 'rgba(75, 85, 99, 0.20)',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#6B7280',
      badgeBackgroundColor: '#F7F7F5',
      badgeTextColor: '#1F2937',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isBordeauxVelvet) {
    return {
      selectedBorderColor: '#D4AF37',
      selectedBackgroundColor: '#3A1220',
      selectedTextColor: '#FFF1F4',
      unselectedBorderColor: 'rgba(212, 175, 55, 0.24)',
      unselectedBackgroundColor: '#2A0D16',
      unselectedTextColor: '#E8B8C2',
      badgeBackgroundColor: '#3A1220',
      badgeTextColor: '#D4AF37',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isChampagneRose) {
    return {
      selectedBorderColor: '#C6A15B',
      selectedBackgroundColor: '#F5E7D8',
      selectedTextColor: '#2A1F23',
      unselectedBorderColor: 'rgba(198, 161, 91, 0.24)',
      unselectedBackgroundColor: '#FAF0EA',
      unselectedTextColor: '#7A5A62',
      badgeBackgroundColor: '#F5E7D8',
      badgeTextColor: '#C6A15B',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isIvoryGold) {
    return {
      selectedBorderColor: '#C6A15B',
      selectedBackgroundColor: '#F5E7D0',
      selectedTextColor: '#2A261C',
      unselectedBorderColor: 'rgba(198, 161, 91, 0.24)',
      unselectedBackgroundColor: '#FFF8E6',
      unselectedTextColor: '#6F6448',
      badgeBackgroundColor: '#F5E7D0',
      badgeTextColor: '#C6A15B',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isMineralGreen) {
    return {
      selectedBorderColor: '#4F7C68',
      selectedBackgroundColor: '#E0EDE4',
      selectedTextColor: '#163227',
      unselectedBorderColor: 'rgba(79, 124, 104, 0.24)',
      unselectedBackgroundColor: '#EEF6F1',
      unselectedTextColor: '#4D6B5C',
      badgeBackgroundColor: '#E0EDE4',
      badgeTextColor: '#4F7C68',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else if (isObsidianGold) {
    return {
      selectedBorderColor: '#D4AF37',
      selectedBackgroundColor: '#252525',
      selectedTextColor: '#FFF7D6',
      unselectedBorderColor: 'rgba(212, 175, 55, 0.24)',
      unselectedBackgroundColor: '#181818',
      unselectedTextColor: '#C9B97A',
      badgeBackgroundColor: '#252525',
      badgeTextColor: '#D4AF37',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  } else {
    return {
      selectedBorderColor: '#8B7CF6',
      selectedBackgroundColor: '#E8E6FF',
      selectedTextColor: '#4A3A8C',
      unselectedBorderColor: '#E8E6FF',
      unselectedBackgroundColor: '#FFFFFF',
      unselectedTextColor: '#6B5B95',
      badgeBackgroundColor: '#FFFFFF',
      badgeTextColor: '#8B7CF6',
      filterRadius: 18,
      filterBorderWidth: 1,
      badgeRadius: 9999,
    };
  }
}

export default function NutritionScreen() {
  const theme = useTheme();
  const { activeThemeId } = useAppContext();
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isCoral = theme.id === 'coralBloom';
  const isMarble = currentTheme.id === 'marble';
  const router = useRouter();
  const [activeFilterCategory, setActiveFilterCategory] = useState<FilterKey | null>(null);
  const [activeFilterChips, setActiveFilterChips] = useState<FilterChip[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { gradient, iconColor, iconBg, iconBorder, titleColor, subtitleColor, shadowColor, quickActionRadius, quickActionIconRadius, quickActionShadowOpacity, quickActionShadowRadius, quickActionShadowOffset } = getQuickActionTokens(activeThemeId);
  const { selectedBorderColor, selectedBackgroundColor, selectedTextColor, unselectedBorderColor, unselectedBackgroundColor, unselectedTextColor, badgeBackgroundColor, badgeTextColor, filterRadius, filterBorderWidth, badgeRadius } = getFilterTokens(activeThemeId);

  useEffect(() => {
    getUnreadMessageCount().then(setUnreadMessageCount);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUnreadMessageCount().then(setUnreadMessageCount);
    }, [])
  );

  // Filtered meals
  const filteredMeals = useMemo(() => {
    if (activeFilterChips.length === 0) return NUTRITION_MEALS;
    return NUTRITION_MEALS.filter(meal =>
      activeFilterChips.every(chip => {
        const mealValue = (meal as unknown as Record<string, unknown>)[chip.key];
        if (chip.key === 'budget') return meal.budget === chip.value;
        if (Array.isArray(mealValue)) return mealValue.includes(chip.value);
        return mealValue === chip.value;
      })
    );
  }, [activeFilterChips]);

  const handleFilterPress = (categoryKey: FilterKey, value: string) => {
    const exists = activeFilterChips.find(chip => chip.key === categoryKey && chip.value === value);
    if (exists) {
      setActiveFilterChips(chips => chips.filter(chip => !(chip.key === categoryKey && chip.value === value)));
    } else {
      setActiveFilterChips(chips => [...chips, { key: categoryKey, value }]);
    }
  };

  const clearAllFilters = () => setActiveFilterChips([]);
  const activeCategory = activeFilterCategory
    ? FILTER_CATEGORIES.find(cat => cat.key === activeFilterCategory) ?? null
    : null;

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader
        title="Voeding."
        subtitle="Beter eten, gezonder leven."
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        showMessages
        unreadMessagesCount={unreadMessageCount}
        onMessagesPress={() => router.push('/messages')}
      />

      <View style={styles.quickActionsBlock}>
        <View style={styles.quickActionsRow}>
          {NUTRITION_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [
                styles.quickActionButton,
                { shadowColor, borderRadius: quickActionRadius, shadowOpacity: quickActionShadowOpacity, shadowRadius: quickActionShadowRadius, shadowOffset: quickActionShadowOffset },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => router.push(action.route)}
            >
              <LinearGradient
                colors={gradient}
                start={isCoral ? { x: 0.2, y: 0 } : { x: 0, y: 0 }}
                end={isCoral ? { x: 0.8, y: 1 } : { x: 1, y: 1 }}
                style={[styles.quickActionButtonGradient, { borderRadius: quickActionRadius }]}
              >
                {/* Marble premium stone texture - only for Marble theme */}
                {isMarble && (
                  <>
                    {/* Subtle diagonal vein */}
                    <LinearGradient
                      colors={['rgba(55, 65, 81, 0.18)', 'rgba(55, 65, 81, 0.06)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -15,
                        width: 80,
                        height: 2,
                        transform: [{ rotate: '-12deg' }],
                        pointerEvents: 'none',
                      }}
                      pointerEvents="none"
                    />
                  </>
                )}
                <View style={[styles.quickActionIconBubble, { backgroundColor: iconBg, borderColor: iconBorder, borderRadius: quickActionIconRadius }]}>
                  <MaterialCommunityIcons name={action.icon} size={20} color={iconColor} />
                </View>
                <View style={styles.quickActionTextWrap}>
                  <Text style={[styles.quickActionText, { color: titleColor }]}>{action.title}</Text>
                  <Text style={[styles.quickActionSubText, { color: subtitleColor }]}>{action.subtitle}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Filterbalk */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {FILTER_CATEGORIES.map(category => {
          const isActive = activeFilterCategory === category.key;
          // Count how many filters are active for this category
          const count = activeFilterChips.filter(chip => chip.key === category.key).length;
          return (
            <Pressable
              key={category.key}
              style={({ pressed }) => [
                styles.filterTab,
                { borderColor: isActive ? selectedBorderColor : unselectedBorderColor, backgroundColor: isActive ? selectedBackgroundColor : unselectedBackgroundColor, borderRadius: filterRadius, borderWidth: filterBorderWidth },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setActiveFilterCategory(prev => (prev === category.key ? null : category.key))}
            >
              <Text style={[styles.filterTabText, { color: isActive ? selectedTextColor : unselectedTextColor }]}>{category.label}</Text>
              {count > 0 && (
                <View style={[styles.filterTabBadge, { backgroundColor: badgeBackgroundColor, borderRadius: badgeRadius }]}>
                  <Text style={[styles.filterTabBadgeText, { color: badgeTextColor }]}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Subfilters */}
      {activeCategory && (
        <View style={[styles.subFilterPanel, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <View style={styles.subFilterHeader}>
            <Text style={[styles.subFilterTitle, { color: theme.titleColor }]}>Subfilters</Text>
            {activeFilterChips.length > 0 && (
              <Pressable style={[styles.resetButton, { borderColor: theme.border }]} onPress={clearAllFilters}>
                <Text style={[styles.resetButtonText, { color: theme.subtitleColor }]}>Reset</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.chipRow}>
            {activeCategory.options.map(option => {
              const selected = activeFilterChips.some(chip => chip.key === activeCategory.key && chip.value === option);
              return (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.chip,
                    { borderColor: selected ? selectedBorderColor : unselectedBorderColor, backgroundColor: selected ? selectedBackgroundColor : unselectedBackgroundColor },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => handleFilterPress(activeCategory.key, option)}
                >
                  <Text style={[styles.chipText, { color: selected ? selectedTextColor : unselectedTextColor }]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Actieve filters chips */}
      {activeFilterChips.length > 0 && (
        <View style={styles.activeFiltersBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersRow}>
            {activeFilterChips.map(chip => (
              <Pressable
                key={chip.key + chip.value}
                style={({ pressed }) => [
                  styles.activeFilterChip,
                  { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleFilterPress(chip.key, chip.value)}
              >
                <Text style={[styles.activeFilterText, { color: '#2563EB' }]}>{chip.value}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Meal cards */}
      {filteredMeals.map(meal => (
        <Pressable
          key={meal.id}
          style={styles.mealCardWrap}
          onPress={() => router.push({ pathname: '/nutrition/[id]', params: { id: meal.id } })}
        >
          <ImageBackground source={{ uri: meal.image }} style={styles.mealCard} imageStyle={styles.mealImage}>
            <LinearGradient
              colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']}
              style={styles.mealOverlay}
            >
              <Text
                style={[styles.mealTitle, { fontSize: 26 }]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {meal.title}
              </Text>
              <Text style={styles.mealMeta}>{meal.kcal} KCAL    {meal.protein}G EIWIT</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
      ))}

      {filteredMeals.length === 0 && (
        <View style={[styles.emptyState, { borderColor: theme.border }]}>
          <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Geen gerechten gevonden</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>Pas je filters aan om meer resultaten te zien.</Text>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
    </AppScreen>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  settingsPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  quickActionsBlock: {
    marginBottom: 8,
    gap: 4,
  },
  quickActionButton: {
    width: '48.5%',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 64,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    minHeight: 64,
  },
  quickActionIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActionTextWrap: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  quickActionSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4A3A8C',
  },
  filterBarSection: {
    marginBottom: 14,
  },
  filterBarRow: {
    gap: 8,
    paddingRight: 8,
    paddingBottom: 10,
  },
  filterTab: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterTabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterTabBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  subFilterPanel: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  subFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subFilterTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeFiltersBlock: {
    marginBottom: 12,
  },
  activeFiltersRow: {
    gap: 8,
  },
  activeFilterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mealCardWrap: {
    marginBottom: 14,
  },
  mealCard: {
    height: 210,
    justifyContent: 'flex-end',
  },
  mealImage: {
    borderRadius: 20,
  },
  mealOverlay: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 50,
  },
  mealTitle: {
    color: '#FFFFFF',
    letterSpacing: -1.8,
    fontWeight: '900',
  },
  mealMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyState: {
    marginTop: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: { height: 120 },
});
