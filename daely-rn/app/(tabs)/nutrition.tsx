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

  // DAELY Classic Glow gradient for buttons
  const classicGlowGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  return {
    gradient: classicGlowGradient,
    iconColor: isClassic ? '#2563EB' : '#4A3A8C',
    shadowColor: isClassic ? '#0EA5E9' : '#6B5B95',
  };
}

export default function NutritionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { activeThemeId } = useAppContext();
  const [activeFilterCategory, setActiveFilterCategory] = useState<FilterKey | null>(null);
  const [activeFilterChips, setActiveFilterChips] = useState<FilterChip[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { gradient, iconColor, shadowColor } = getQuickActionTokens(activeThemeId);

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
                { shadowColor },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => router.push(action.route)}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionButtonGradient}
              >
                <View style={styles.quickActionIconBubble}>
                  <MaterialCommunityIcons name={action.icon} size={20} color={iconColor} />
                </View>
                <View style={styles.quickActionTextWrap}>
                  <Text style={styles.quickActionText}>{action.title}</Text>
                  <Text style={styles.quickActionSubText}>{action.subtitle}</Text>
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
                { borderColor: isActive ? '#8B7CF6' : '#E8E6FF', backgroundColor: isActive ? '#E8E6FF' : '#FFFFFF' },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setActiveFilterCategory(prev => (prev === category.key ? null : category.key))}
            >
              <Text style={[styles.filterTabText, { color: isActive ? '#4A3A8C' : '#6B5B95' }]}>{category.label}</Text>
              {count > 0 && (
                <View style={[styles.filterTabBadge, { backgroundColor: '#FFFFFF' }]}>
                  <Text style={[styles.filterTabBadgeText, { color: '#8B7CF6' }]}>{count}</Text>
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
                    { borderColor: selected ? '#8B7CF6' : '#E8E6FF', backgroundColor: selected ? '#E8E6FF' : '#FFFFFF' },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => handleFilterPress(activeCategory.key, option)}
                >
                  <Text style={[styles.chipText, { color: selected ? '#4A3A8C' : '#6B5B95' }]}>{option}</Text>
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