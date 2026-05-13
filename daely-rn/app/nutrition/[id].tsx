import { StyleSheet, View, Text, ScrollView, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { getPublicCreatorMeals } from '@/services/creator-content';

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

export default function NutritionMealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [creatorMeals, setCreatorMeals] = useState<typeof NUTRITION_MEALS>([]);

  useEffect(() => {
    getPublicCreatorMeals().then(setCreatorMeals).catch(() => setCreatorMeals([]));
  }, []);

  const allMeals = useMemo(() => [...creatorMeals, ...NUTRITION_MEALS], [creatorMeals]);
  const meal = allMeals.find((item) => item.id === id);

  if (!meal) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}> 
        <Pressable style={styles.backButtonPlain} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={theme.titleColor} />
          <Text style={[styles.backPlainLabel, { color: theme.titleColor }]}>Terug</Text>
        </Pressable>
        <Text style={[styles.notFoundTitle, { color: theme.titleColor }]}>Gerecht niet gevonden</Text>
      </View>
    );
  }

  const ingredients = buildIngredients(meal.title);
  const steps = buildSteps(meal.title);
  const prepTime = prepTimeFromTags(meal.timeTags);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topArea}>
          <Pressable style={[styles.backButtonPlain, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={22} color={theme.titleColor} />
            <Text style={[styles.backPlainLabel, { color: theme.titleColor }]}>Voeding</Text>
          </Pressable>

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
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{meal.kcal}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>KCAL</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{meal.protein}g</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Eiwit</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValueSmall, { color: theme.titleColor }]}>{prepTime}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>BEREIDTIJD</Text>
            </View>
          </View>

          <View style={[styles.recipeBlock, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.blockTitle, { color: theme.titleColor }]}>Ingredienten</Text>
            {ingredients.map((item) => (
              <Text key={item} style={[styles.listText, { color: theme.subtitleColor }]}>• {item}</Text>
            ))}
          </View>

          <View style={[styles.recipeBlock, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.blockTitle, { color: theme.titleColor }]}>Bereidingswijze</Text>
            {steps.map((step, index) => (
              <Text key={step} style={[styles.listText, { color: theme.subtitleColor }]}>{index + 1}. {step}</Text>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topArea: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  hero: {
    height: 290,
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  heroImage: {
    borderRadius: 40,
  },
  heroOverlay: {
    borderRadius: 40,
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
  recipeBlock: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  backButtonPlain: {
    width: 110,
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backPlainLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  notFoundTitle: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 120,
  },
});
