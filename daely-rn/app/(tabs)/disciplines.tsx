
import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import GlobalSearchModal from '../components/GlobalSearchModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { COMMUNITY_CREATORS } from '@/constants/community-creators';

export const DISCIPLINES = [
  {
    id: '1',
    title: 'Fitness',
    subtitle: 'Kracht & Conditie',
    slug: 'fitness',
    images: {
      man: 'https://media.istockphoto.com/id/1937164504/nl/foto/man-dumbbell-and-weightlifting-in-fitness-workout-or-arm-exercise-on-bench-at-indoor.jpg',
      vrouw: 'https://blogscdn.thehut.net/app/uploads/sites/467/2020/12/Blog-Squattingwithbarbell-Female_700x385_1608714645.jpg',
    },
  },
  {
    id: '2',
    title: 'CrossFit',
    subtitle: 'Functioneel & High Intensity',
    slug: 'crossfit',
    images: {
      man: 'https://cdn.crossfit.com/image/upload/v1704403262/crossfit.com/2026/May/250106/header.jpg',
      vrouw: 'https://cdn.crossfit.com/image/upload/v1704403262/crossfit.com/2026/May/250106/header.jpg',
    },
  },
  {
    id: '3',
    title: 'Zwaargewicht',
    subtitle: 'Powerlifting & Gewichtheffen',
    slug: 'zwaargewicht',
    images: {
      man: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/1049/images/pT0gFEswRDiexf79ODkQ_why-lift-heavy-sprint-fat-loss-weights-strength-training-Alex-Fergus-deadlift.jpg',
      vrouw: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/1049/images/pT0gFEswRDiexf79ODkQ_why-lift-heavy-sprint-fat-loss-weights-strength-training-Alex-Fergus-deadlift.jpg',
    },
  },
  {
    id: '4',
    title: 'Hyrox',
    subtitle: 'Functionele Fitness & Racing',
    slug: 'hyrox',
    images: {
      man: 'https://www.angelsgym.nl/wp-content/uploads/2026/02/hyrox-training-gym-sportschool.png',
      vrouw: 'https://www.angelsgym.nl/wp-content/uploads/2026/02/hyrox-training-gym-sportschool.png',
    },
  },
  {
    id: '5',
    title: 'Yoga',
    subtitle: 'Flexibiliteit & Mindfulness',
    slug: 'yoga',
    images: {
      man: 'https://liforme.com/cdn/shop/articles/Navasana_Mission_Jonny_01.png?v=1770914202&width=1920',
      vrouw: 'https://liforme.com/cdn/shop/articles/Navasana_Mission_Jonny_01.png?v=1770914202&width=1920',
    },
  },
  {
    id: '6',
    title: 'Pilates',
    subtitle: 'Core Kracht & Stabiliteit',
    slug: 'pilates',
    images: {
      man: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      vrouw: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    id: '7',
    title: 'Calisthenics',
    subtitle: 'Lichaamsgewicht Training',
    slug: 'calisthenics',
    images: {
      man: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      vrouw: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    id: '8',
    title: 'Mobiliteit',
    subtitle: 'Gewrichtsgezondheid & Beweging',
    slug: 'mobiliteit',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '9',
    title: 'Vechttraining',
    subtitle: 'Boksen, MMA & Vechtsporten',
    slug: 'vechttraining',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '10',
    title: 'Zwangerschap',
    subtitle: 'Beweging & welzijn tijdens zwangerschap',
    slug: 'zwangerschap',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '11',
    title: 'Kegel oefeningen',
    subtitle: 'Bekkenbodem & core training',
    slug: 'kegel-oefeningen',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '12',
    title: 'Wielrennen / Mountainbiken',
    subtitle: 'Fietsen, snelheid & uithoudingsvermogen',
    slug: 'wielrennen-mountainbiken',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '13',
    title: 'Zwemmen',
    subtitle: 'Techniek, kracht & conditie',
    slug: 'zwemmen',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '14',
    title: 'Roeien',
    subtitle: 'Kracht, coördinatie & teamwork',
    slug: 'roeien',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '15',
    title: 'Schaatsen',
    subtitle: 'Snelheid, techniek & uithoudingsvermogen',
    slug: 'schaatsen',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '16',
    title: 'Voetbal',
    subtitle: 'Techniek, teamwork & conditie',
    slug: 'voetbal',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '17',
    title: 'Basketbal',
    subtitle: 'Snelheid, sprongkracht & teamwork',
    slug: 'basketbal',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '18',
    title: 'Volleybal',
    subtitle: 'Teamwork, sprongkracht & techniek',
    slug: 'volleybal',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '19',
    title: 'Handbal',
    subtitle: 'Snelheid, kracht & teamwork',
    slug: 'handbal',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '20',
    title: 'Hockey',
    subtitle: 'Techniek, snelheid & teamwork',
    slug: 'hockey',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '21',
    title: 'Rugby / American football',
    subtitle: 'Kracht, strategie & teamwork',
    slug: 'rugby-american-football',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '22',
    title: 'Racketsporten',
    subtitle: 'Tennis, padel, badminton, squash & tafeltennis',
    slug: 'racketsporten',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '23',
    title: 'Judo / Worstelen / BJJ / Karate / Taekwondo',
    subtitle: 'Kracht, techniek & discipline',
    slug: 'judo-worstelen-bjj-karate-taekwondo',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '24',
    title: 'Turnen',
    subtitle: 'Kracht, lenigheid & controle',
    slug: 'turnen',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '25',
    title: 'Parkour / Freerunning',
    subtitle: 'Behendigheid & explosiviteit',
    slug: 'parkour-freerunning',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '26',
    title: 'Klimmen / Boulderen',
    subtitle: 'Kracht, techniek & coördinatie',
    slug: 'klimmen-boulderen',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '27',
    title: 'Skiën / Snowboarden',
    subtitle: 'Balans, techniek & uithoudingsvermogen',
    slug: 'skien-snowboarden',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '28',
    title: 'Surfen / Kitesurfen / Windsurfen',
    subtitle: 'Balans, kracht & techniek',
    slug: 'surfen-kitesurfen-windsurfen',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '29',
    title: 'Golf',
    subtitle: 'Techniek, precisie & focus',
    slug: 'golf',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '30',
    title: 'Paardensport',
    subtitle: 'Samenwerking & balans',
    slug: 'paardensport',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  },
];

const DISCIPLINE_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80';

function getDisciplineImage(item: { image?: string; images?: { man?: string; vrouw?: string } }): string {
  const directImage = typeof item.image === 'string' ? item.image.trim() : '';
  if (directImage) return directImage;

  const manImage = typeof item.images?.man === 'string' ? item.images.man.trim() : '';
  if (manImage) return manImage;

  const vrouwImage = typeof item.images?.vrouw === 'string' ? item.images.vrouw.trim() : '';
  if (vrouwImage) return vrouwImage;

  return DISCIPLINE_FALLBACK_IMAGE;
}

export default function DisciplinesScreen() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; label: string; meta?: string; onSelect: () => void }>>([]);
  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }

    const results: Array<{ id: string; label: string; meta?: string; onSelect: () => void }> = [];
    const seen = new Set<string>();
    const addResult = (item: { id: string; label: string; meta?: string; onSelect: () => void }) => {
      if (results.length >= 24) return;
      if (seen.has(item.id)) return;
      seen.add(item.id);
      results.push(item);
    };

    DISCIPLINES.forEach((discipline) => {
      const haystack = `${discipline.title} ${discipline.subtitle}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `discipline-${discipline.id}`,
        label: discipline.title,
        meta: 'Discipline',
        onSelect: () => {
          setSearchVisible(false);
          router.push({ pathname: '/discipline/[slug]', params: { slug: discipline.slug } });
        },
      });
    });

    NUTRITION_MEALS.forEach((meal) => {
      const haystack = `${meal.title} ${meal.mealType} ${meal.description}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `meal-${meal.id}`,
        label: meal.title,
        meta: `Gerecht · ${meal.mealType}`,
        onSelect: () => {
          setSearchVisible(false);
          router.push({ pathname: '/nutrition/[id]', params: { id: meal.id } });
        },
      });
    });

    COMMUNITY_CREATORS.forEach((creator) => {
      const haystack = `${creator.name} ${creator.specialty || ''}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `creator-${creator.id}`,
        label: creator.name,
        meta: 'Persoon · Community',
        onSelect: () => {
          setSearchVisible(false);
          router.push({ pathname: '/community/creator/[id]', params: { id: creator.id } });
        },
      });
    });

    setSearchResults(results);
  };
  const theme = useTheme();
  const router = useRouter();
  const visibleDisciplines = DISCIPLINES;
  const handleOpen = (slug: string) => {
    router.push({ pathname: '/discipline/[slug]', params: { slug } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 68, lineHeight: 72, fontWeight: '900', letterSpacing: -2, color: theme.titleColor }}>Bibliotheek</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.card, borderColor: theme.border }} onPress={() => setSearchVisible(true)}>
            <MaterialCommunityIcons name="magnify" size={22} color={theme.titleColor} />
          </Pressable>
          <Pressable style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.card, borderColor: theme.border }} onPress={() => router.push('/(tabs)/athlete')}>
            <MaterialCommunityIcons name="cog-outline" size={22} color={theme.titleColor} />
          </Pressable>
          <Pressable style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.card, borderColor: theme.border }} onPress={() => router.push('/(tabs)/cart')}>
            <MaterialCommunityIcons name="shopping-outline" size={22} color={theme.titleColor} />
          </Pressable>
        </View>
      </View>
      <GlobalSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        results={searchResults}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {visibleDisciplines.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => handleOpen(item.slug)}
            >
              <ImageBackground
                source={{ uri: getDisciplineImage(item) }}
                style={styles.cardImage}
                imageStyle={styles.cardImageStyle}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.78)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardOverlay}
                >
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
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
  settingsPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  card: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  cardImage: { flex: 1 },
  cardImageStyle: { borderRadius: 20 },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
    fontWeight: '500',
  },
  bottomSpacer: { height: 120 },
});
