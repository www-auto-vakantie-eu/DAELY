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

  // Theme-aware gradient for card backgrounds
  const themeGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
      : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  return {
    auroraGradient: themeGradient,
    auroraTitle: currentTheme.colors.auroraTitle || (isZen ? '#FFFFFF' : isRetro ? '#1B2E6B' : isSahara ? '#7A4E24' : isForce ? '#7F1D1D' : '#1E1B4B'),
    auroraSubtitle: currentTheme.colors.auroraSubtitle || (isZen ? '#B0B0B0' : isRetro ? '#B42318' : isSahara ? '#9A6B3A' : isForce ? '#B91C1C' : '#4A3A8C'),
    // Theme-aware ribbon colors
    ribbonTop: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)'],
    ribbonMid: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)'],
    ribbonBlue: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)']
      : isForce
        ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)'])
        : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)'])
        : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)'])
        : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)'])
        : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)'],
    ribbonRose: isClassic
      ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)']
      : isForce
        ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)'])
        : isSahara ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)'])
        : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)'])
        : isZen ? (currentTheme.gradients.auroraRose || ['rgba(156, 163, 175, 0.14)', 'rgba(156, 163, 175, 0.05)'])
        : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)'],
    ribbonRight: isClassic
      ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)']
      : isForce
        ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)']
        : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)']
        : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)']
        : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
        : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)'],
    ribbonHighlight: isClassic
      ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)']
      : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)'],
    // Theme-aware shortcut card styling
    shortcutBorderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.12)' : undefined,
    shortcutShadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : undefined,
    shortcutIconBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)',
    shortcutIconBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : undefined,
  };
}

// Helper component for gradient cards with Soft Aurora Ribbon style
function GradientCard({ children, style }: { children: React.ReactNode, style?: any }) {
  const theme = useTheme();
  const { auroraGradient, ribbonTop, ribbonMid, ribbonBlue, ribbonRose, ribbonRight, ribbonHighlight } = getAuroraTokens(theme.id);

  return (
    <View style={[styles.sectionCard, style]}>
      {/* Background gradient layer - absolute full-cover */}
      <LinearGradient
        colors={auroraGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionCardGradient}
        pointerEvents="none"
      >
        {/* Top-left ribbon */}
        <LinearGradient
          colors={ribbonTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonTop}
          pointerEvents="none"
        />
        {/* Mid-card ribbon */}
        <LinearGradient
          colors={ribbonMid}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonMid}
          pointerEvents="none"
        />
        {/* Diagonal top-right ribbon */}
        <LinearGradient
          colors={ribbonBlue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonBlue}
          pointerEvents="none"
        />
        {/* Diagonal bottom-left ribbon */}
        <LinearGradient
          colors={ribbonRose}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.ribbonRose}
          pointerEvents="none"
        />
        {/* Right-side accent ribbon */}
        <LinearGradient
          colors={ribbonRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonRight}
          pointerEvents="none"
        />
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
  const { auroraGradient, auroraTitle, auroraSubtitle, shortcutBorderColor, shortcutShadowColor, shortcutIconBg, shortcutIconBorder } = getAuroraTokens(theme.id);
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

            <GradientCard>
              <Text style={[styles.blockTitle, { color: theme.titleColor }]}>Ingredienten</Text>
              {ingredients.map((item) => (
                <Text key={item} style={[styles.listText, { color: theme.subtitleColor }]}>• {item}</Text>
              ))}
            </GradientCard>

            <GradientCard>
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
  cardContent: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
});
