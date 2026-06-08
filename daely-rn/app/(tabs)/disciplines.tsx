
import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { resolveContentAudience, getGenderedDisciplineImage, type DisciplineMedia } from '@/lib/content-audience';
import PageHeader from '../components/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LIBRARY_ACTIONS = [
  {
    key: 'search',
    title: 'Oefening zoeken',
    subtitle: 'Zoek in alle oefeningen',
    icon: 'text-search' as const,
    style: 'quickActionSearch' as const,
    route: '/exercises/search' as const,
  },
  {
    key: 'workout',
    title: 'Workout maken',
    subtitle: 'Maak je eigen workout',
    icon: 'plus-circle-outline' as const,
    style: 'quickActionPrimary' as const,
    route: '/workout/create' as const,
  },
  {
    key: 'goal',
    title: 'Doel trainen',
    subtitle: 'Train op je doel',
    icon: 'target' as const,
    style: 'quickActionTertiary' as const,
    route: '/goals' as const,
  },
  {
    key: 'recommended',
    title: 'Aanbevolen',
    subtitle: 'Persoonlijke suggesties',
    icon: 'star' as const,
    style: 'quickActionSecondary' as const,
    route: '/recommended' as const,
  },
];

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
      man: require('../../assets/disciplines/calisthenics-male.png'),
      vrouw: require('../../assets/disciplines/calisthenics-female.png'),
    },
    image: require('../../assets/disciplines/calisthenics-neutral.png'),
  },
  {
    id: '8',
    title: 'Mobiliteit',
    subtitle: 'Gewrichtsgezondheid & Beweging',
    slug: 'mobiliteit',
    images: {
      man: require('../../assets/disciplines/mobiliteit-male.png'),
      vrouw: require('../../assets/disciplines/mobiliteit-female.png'),
    },
    image: require('../../assets/disciplines/mobiliteit-neutral.png'),
  },
  {
    id: '9',
    title: 'Vechttraining',
    subtitle: 'Boksen, MMA & Vechtsporten',
    slug: 'vechttraining',
    images: {
      man: require('../../assets/disciplines/vechttraining-male.png'),
      vrouw: require('../../assets/disciplines/vechttraining-female.png'),
    },
    image: require('../../assets/disciplines/vechttraining-neutral.png'),
  },
  {
    id: '10',
    title: 'Zwangerschap',
    subtitle: 'Beweging & welzijn tijdens zwangerschap',
    slug: 'zwangerschap',
    images: {
      man: require('../../assets/disciplines/zwangerschap-neutral.png'),
      vrouw: require('../../assets/disciplines/zwangerschap-female.png'),
    },
    image: require('../../assets/disciplines/zwangerschap-neutral.png'),
  },
  {
    id: '11',
    title: 'Kegel oefeningen',
    subtitle: 'Bekkenbodem & core training',
    slug: 'kegel-oefeningen',
    images: {
      man: require('../../assets/disciplines/kegel-oefeningen-male.png'),
      vrouw: require('../../assets/disciplines/kegel-oefeningen-female.png'),
    },
    image: require('../../assets/disciplines/kegel-oefeningen-neutral.png'),
  },
  {
    id: '12',
    title: 'Wielrennen / Mountainbiken',
    subtitle: 'Fietsen, snelheid & uithoudingsvermogen',
    slug: 'wielrennen-mountainbiken',
    images: {
      man: require('../../assets/disciplines/wielrennen-male.png'),
      vrouw: require('../../assets/disciplines/wielrennen-female.png'),
    },
    image: require('../../assets/disciplines/wielrennen-neutral.png'),
  },
  {
    id: '13',
    title: 'Zwemmen',
    subtitle: 'Techniek, kracht & conditie',
    slug: 'zwemmen',
    images: {
      man: require('../../assets/disciplines/zwemmen-male.png'),
      vrouw: require('../../assets/disciplines/zwemmen-female.png'),
    },
    image: require('../../assets/disciplines/zwemmen-neutral.png'),
  },
  {
    id: '14',
    title: 'Roeien',
    subtitle: 'Kracht, coördinatie & teamwork',
    slug: 'roeien',
    images: {
      man: require('../../assets/disciplines/roeien-male.png'),
      vrouw: require('../../assets/disciplines/roeien-female.png'),
    },
    image: require('../../assets/disciplines/roeien-neutral.png'),
  },
  {
    id: '15',
    title: 'Schaatsen',
    subtitle: 'Snelheid, techniek & uithoudingsvermogen',
    slug: 'schaatsen',
    images: {
      man: require('../../assets/disciplines/schaatsen-male.png'),
      vrouw: require('../../assets/disciplines/schaatsen-female.png'),
    },
    image: require('../../assets/disciplines/schaatsen-neutral.png'),
  },
  {
    id: '16',
    title: 'Voetbal',
    subtitle: 'Techniek, teamwork & conditie',
    slug: 'voetbal',
    images: {
      man: require('../../assets/disciplines/voetbal-male.png'),
      vrouw: require('../../assets/disciplines/voetbal-female.png'),
    },
    image: require('../../assets/disciplines/voetbal-neutral.png'),
  },
  {
    id: '17',
    title: 'Basketbal',
    subtitle: 'Snelheid, sprongkracht & teamwork',
    slug: 'basketbal',
    images: {
      man: require('../../assets/disciplines/basketbal-male.png'),
      vrouw: require('../../assets/disciplines/basketbal-female.png'),
    },
    image: require('../../assets/disciplines/basketbal-neutral.png'),
  },
  {
    id: '18',
    title: 'Volleybal',
    subtitle: 'Teamwork, sprongkracht & techniek',
    slug: 'volleybal',
    images: {
      man: require('../../assets/disciplines/volleybal-male.png'),
      vrouw: require('../../assets/disciplines/volleybal-female.png'),
    },
    image: require('../../assets/disciplines/volleybal-neutral.png'),
  },
  {
    id: '19',
    title: 'Handbal',
    subtitle: 'Snelheid, kracht & teamwork',
    slug: 'handbal',
    images: {
      man: require('../../assets/disciplines/handbal-male.png'),
      vrouw: require('../../assets/disciplines/handbal-female.png'),
    },
    image: require('../../assets/disciplines/handbal-neutral.png'),
  },
  {
    id: '20',
    title: 'Hockey',
    subtitle: 'Techniek, snelheid & teamwork',
    slug: 'hockey',
    images: {
      man: require('../../assets/disciplines/hockey-male.png'),
      vrouw: require('../../assets/disciplines/hockey-female.png'),
    },
    image: require('../../assets/disciplines/hockey-neutral.png'),
  },
  {
    id: '21',
    title: 'Rugby / American football',
    subtitle: 'Kracht, strategie & teamwork',
    slug: 'rugby-american-football',
    images: {
      man: require('../../assets/disciplines/rugby-american-football-male.png'),
      vrouw: require('../../assets/disciplines/rugby-american-football-female.png'),
    },
    image: require('../../assets/disciplines/rugby-american-football-neutral.png'),
  },
  {
    id: '22',
    title: 'Racketsporten',
    subtitle: 'Tennis, padel, badminton, squash & tafeltennis',
    slug: 'racketsporten',
    images: {
      man: require('../../assets/disciplines/racketsporten-male.png'),
      vrouw: require('../../assets/disciplines/racketsporten-female.png'),
    },
    image: require('../../assets/disciplines/racketsporten-neutral.png'),
  },
  {
    id: '23',
    title: 'Judo / Worstelen / BJJ / Karate / Taekwondo',
    subtitle: 'Kracht, techniek & discipline',
    slug: 'judo-worstelen-bjj-karate-taekwondo',
    images: {
      man: require('../../assets/disciplines/judo-worstelen-bjj-karate-taekwondo-male.png'),
      vrouw: require('../../assets/disciplines/judo-worstelen-bjj-karate-taekwondo-female.png'),
    },
    image: require('../../assets/disciplines/judo-worstelen-bjj-karate-taekwondo-neutral.png'),
  },
  {
    id: '24',
    title: 'Turnen',
    subtitle: 'Kracht, lenigheid & controle',
    slug: 'turnen',
    images: {
      man: require('../../assets/disciplines/turnen-male.png'),
      vrouw: require('../../assets/disciplines/turnen-female.png'),
    },
    image: require('../../assets/disciplines/turnen-neutral.png'),
  },
  {
    id: '25',
    title: 'Parkour / Freerunning',
    subtitle: 'Behendigheid & explosiviteit',
    slug: 'parkour-freerunning',
    images: {
      man: require('../../assets/disciplines/parkour-freerunning-male.png'),
      vrouw: require('../../assets/disciplines/parkour-freerunning-female.png'),
    },
    image: require('../../assets/disciplines/parkour-freerunning-neutral.png'),
  },
  {
    id: '26',
    title: 'Klimmen / Boulderen',
    subtitle: 'Kracht, techniek & coördinatie',
    slug: 'klimmen-boulderen',
    images: {
      man: require('../../assets/disciplines/klimmen-boulderen-male.png'),
      vrouw: require('../../assets/disciplines/klimmen-boulderen-female.png'),
    },
    image: require('../../assets/disciplines/klimmen-boulderen-neutral.png'),
  },
  {
    id: '27',
    title: 'Skiën / Snowboarden',
    subtitle: 'Balans, techniek & uithoudingsvermogen',
    slug: 'skien-snowboarden',
    images: {
      man: require('../../assets/disciplines/skien-snowboarden-male.png'),
      vrouw: require('../../assets/disciplines/skien-snowboarden-female.png'),
    },
    image: require('../../assets/disciplines/skien-snowboarden-neutral.png'),
  },
  {
    id: '28',
    title: 'Surfen / Kitesurfen / Windsurfen',
    subtitle: 'Balans, kracht & techniek',
    slug: 'surfen-kitesurfen-windsurfen',
    images: {
      man: require('../../assets/disciplines/surfen-kitesurfen-windsurfen-male.png'),
      vrouw: require('../../assets/disciplines/surfen-kitesurfen-windsurfen-female.png'),
    },
    image: require('../../assets/disciplines/surfen-kitesurfen-windsurfen-neutral.png'),
  },
  {
    id: '29',
    title: 'Golf',
    subtitle: 'Techniek, precisie & focus',
    slug: 'golf',
    images: {
      man: require('../../assets/disciplines/golf-male.png'),
      vrouw: require('../../assets/disciplines/golf-female.png'),
    },
    image: require('../../assets/disciplines/golf-neutral.png'),
  },
  {
    id: '30',
    title: 'Paardensport',
    subtitle: 'Samenwerking & balans',
    slug: 'paardensport',
    images: {
      man: require('../../assets/disciplines/paardensport-male.png'),
      vrouw: require('../../assets/disciplines/paardensport-female.png'),
    },
    image: require('../../assets/disciplines/paardensport-neutral.png'),
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
        title="Bibliotheek."
        subtitle="Verbeter je oefeningen."
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActionsBlock}>
            <View style={styles.quickActionsRow}>
              {LIBRARY_ACTIONS.map((action) => (
                <Pressable
                  key={action.key}
                  style={[styles.quickActionButton, styles[action.style]]}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={styles.quickActionIconBubble}>
                    <MaterialCommunityIcons name={action.icon} size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.quickActionTextWrap}>
                    <Text style={styles.quickActionText}>{action.title}</Text>
                    <Text style={styles.quickActionSubText}>{action.subtitle}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

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
  quickActionsBlock: {
    marginBottom: 8,
    gap: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  quickActionButton: {
    width: '48.5%',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  quickActionIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  quickActionTextWrap: {
    flex: 1,
    gap: 2,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickActionSubText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  quickActionPrimary: {
    backgroundColor: '#2563EB',
  },
  quickActionSecondary: {
    backgroundColor: '#059669',
  },
  quickActionTertiary: {
    backgroundColor: '#DC2626',
  },
  quickActionSearch: {
    backgroundColor: '#7C3AED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
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
