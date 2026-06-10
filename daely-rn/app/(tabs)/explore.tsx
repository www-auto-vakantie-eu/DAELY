import { StyleSheet, ScrollView, View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { COMMUNITY_CREATORS } from '@/constants/community-creators';
import { MIND_CATEGORIES } from '@/constants/mind-categories';

const EXPLORE_CATEGORIES = [
  { id: 'bibliotheek', label: 'Disciplines', icon: 'dumbbell', accent: '#2563EB', route: '/(tabs)/disciplines' as const },
  { id: 'voeding', label: 'Voeding', icon: 'silverware-fork-knife', accent: '#10B981', route: '/(tabs)/nutrition' as const },
  { id: 'geest', label: 'Geest', icon: 'meditation', accent: '#8B5CF6', route: '/(tabs)/mind' as const },
  { id: 'community', label: 'Community', icon: 'account-multiple', accent: '#F59E0B', route: '/(tabs)/community' as const },
];

export default function ExploreScreen() {
  const theme = useTheme();
  const router = useRouter();

  const featuredMeals = NUTRITION_MEALS.slice(0, 4);
  const featuredCreators = COMMUNITY_CREATORS.slice(0, 3);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.titleColor }]}>Verkennen.</Text>
          <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Ontdek alles op één plek.</Text>
        </View>

        {/* Search bar */}
        <Pressable style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
          <Text style={[styles.searchPlaceholder, { color: theme.subtitleColor }]}>Zoek oefeningen, recepten...</Text>
        </Pressable>

        {/* Category tiles */}
        <View style={styles.categoryGrid}>
          {EXPLORE_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.categoryTile, { backgroundColor: cat.accent }]}
              onPress={() => router.push(cat.route)}
            >
              <MaterialCommunityIcons name={cat.icon as any} size={28} color="#FFFFFF" />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Featured Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recepten</Text>
            <Pressable onPress={() => router.push('/(tabs)/nutrition')}>
              <Text style={styles.seeAll}>Alles →</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {featuredMeals.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.mealCard}
                onPress={() => router.push({ pathname: '/nutrition/[id]', params: { id: meal.id } })}
              >
                <ImageBackground
                  source={{ uri: meal.image }}
                  style={styles.mealImage}
                  imageStyle={styles.mealImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.82)']}
                    style={styles.mealOverlay}
                  >
                    <Text style={styles.mealTitle} numberOfLines={2}>{meal.title}</Text>
                    <Text style={styles.mealMeta}>{meal.kcal} kcal · {meal.protein}g eiwit</Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Mind categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Geest & Herstel</Text>
            <Pressable onPress={() => router.push('/(tabs)/mind')}>
              <Text style={styles.seeAll}>Alles →</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {MIND_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.mindTile, { backgroundColor: cat.accent }]}
                onPress={() => router.push({ pathname: '/mind/category/[id]', params: { id: cat.id } })}
              >
                <MaterialCommunityIcons name={cat.icon as any} size={30} color="rgba(255,255,255,0.95)" />
                <Text style={styles.mindTileLabel} numberOfLines={2}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Creators */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Creators</Text>
            <Pressable onPress={() => router.push('/(tabs)/community')}>
              <Text style={styles.seeAll}>Alles →</Text>
            </Pressable>
          </View>
          {featuredCreators.map((creator) => (
            <Pressable
              key={creator.id}
              style={[styles.creatorRow, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push({ pathname: '/community/[id]', params: { id: creator.id } })}
            >
              <Image source={{ uri: creator.image }} style={styles.creatorAvatar} />
              <View style={styles.creatorInfo}>
                <Text style={[styles.creatorName, { color: theme.titleColor }]}>{creator.name}</Text>
                <Text style={[styles.creatorSpecialty, { color: theme.subtitleColor }]}>{creator.specialty}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: { marginBottom: 22 },
  title: {
    fontSize: 68,
    lineHeight: 72,
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  categoryTile: {
    width: '47%',
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 10,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  hList: {
    paddingRight: 16,
    gap: 12,
  },
  mealCard: {
    width: 180,
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
  },
  mealImage: { flex: 1 },
  mealImageStyle: { borderRadius: 18 },
  mealOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  mealMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  mindTile: {
    width: 130,
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
  },
  mindTileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 16,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  creatorInfo: { flex: 1 },
  creatorName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  creatorSpecialty: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomSpacer: { height: 120 },
});
