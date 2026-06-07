
import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground, ImageSourcePropType } from 'react-native';
import GlobalSearchModal from '../components/GlobalSearchModal';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { NUTRITION_MEALS } from '@/constants/nutrition-meals';
import { COMMUNITY_CREATORS } from '@/constants/community-creators';
import { resolveContentAudience, getGenderedDisciplineImage, type DisciplineMedia } from '@/lib/content-audience';
import PageHeader from '../components/PageHeader';

export const DISCIPLINES = [
  {
    id: '1',
    title: 'Fitness',
    subtitle: 'Kracht & Conditie',
    slug: 'fitness',
    images: {
      man: require('../../assets/disciplines/fitness-male.png'),
      vrouw: 'https://blogscdn.thehut.net/app/uploads/sites/467/2020/12/Blog-Squattingwithbarbell-Female_700x385_1608714645.jpg',
    },
    image: require('../../assets/disciplines/fitness-neutral.png'),
  },
  {
    id: '2',
    title: 'CrossFit',
    subtitle: 'Functioneel & High Intensity',
    slug: 'crossfit',
    images: {
      man: require('../../assets/disciplines/crossfit-male.png'),
      vrouw: require('../../assets/disciplines/crossfit-female.png'),
    },
    image: require('../../assets/disciplines/crossfit-neutral.png'),
  },
  {
    id: '3',
    title: 'Zwaargewicht',
    subtitle: 'Powerlifting & Gewichtheffen',
    slug: 'zwaargewicht',
    images: {
      man: require('../../assets/disciplines/zwaargewicht-male.png'),
      vrouw: require('../../assets/disciplines/zwaargewicht-female.png'),
    },
    image: require('../../assets/disciplines/zwaargewicht-neutral.png'),
  },
  {
    id: '4',
    title: 'Hyrox',
    subtitle: 'Functionele Fitness & Racing',
    slug: 'hyrox',
    images: {
      man: require('../../assets/disciplines/hyrox-male.png'),
      vrouw: require('../../assets/disciplines/hyrox-female.png'),
    },
    image: require('../../assets/disciplines/hyrox-neutral.png'),
  },
  {
    id: '5',
    title: 'Yoga',
    subtitle: 'Flexibiliteit & Mindfulness',
    slug: 'yoga',
    images: {
      man: require('../../assets/disciplines/yoga-male.png'),
      vrouw: require('../../assets/disciplines/yoga-female.png'),
    },
    image: require('../../assets/disciplines/yoga-neutral.png'),
  },
  {
    id: '6',
    title: 'Pilates',
    subtitle: 'Core Kracht & Stabiliteit',
    slug: 'pilates',
    images: {
      man: require('../../assets/disciplines/pilates-male.png'),
      vrouw: require('../../assets/disciplines/pilates-female.png'),
    },
    image: require('../../assets/disciplines/pilates-neutral.png'),
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

function getDisciplineImage(item: DisciplineMedia, audience: 'male' | 'female' | 'neutral'): string | ImageSourcePropType {
  return getGenderedDisciplineImage(item, audience, DISCIPLINE_FALLBACK_IMAGE);
}

function getImageSource(image: string | ImageSourcePropType): ImageSourcePropType {
  if (typeof image === 'string') {
    return { uri: image };
  }
  return image;
}

export default function DisciplinesScreen() {
  const { user, appSettings } = useAppContext();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: string; label: string; meta?: string; onSelect: () => void }[]>([]);
  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }

    const results: { id: string; label: string; meta?: string; onSelect: () => void }[] = [];
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

  // Bepaal content audience op basis van user profile en app settings
  const audience = resolveContentAudience(user, appSettings);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Bibliotheek"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => setSearchVisible(true)}
        onCartPress={() => router.push('/(tabs)/cart')}
      />
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
                source={getImageSource(getDisciplineImage(item, audience))}
                resizeMode="cover"
                style={styles.cardImage}
                imageStyle={styles.cardImageStyle}
              >
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
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
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageStyle: { borderRadius: 20 },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,6,23,0.55)',
    padding: 16,
    paddingTop: 20,
    justifyContent: 'flex-end',
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
