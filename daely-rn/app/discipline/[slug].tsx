import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';

const { width: screenWidth } = Dimensions.get('window');

type DisciplineDetail = {
  title: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  uitleg?: string;
  exercises?: unknown[];
  workouts?: unknown[];
};

const DISCIPLINE_DATA: Record<string, DisciplineDetail> = {
    // Toegevoegd: nieuwe sporten
    'wielrennen-mountainbiken': {
      title: 'Wielrennen / Mountainbiken',
      subtitle: 'Fietsen, snelheid & uithoudingsvermogen',
      icon: 'bike',
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    },
    zwemmen: {
      title: 'Zwemmen',
      subtitle: 'Techniek, kracht & conditie',
      icon: 'swim',
      heroImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    },
    roeien: {
      title: 'Roeien',
      subtitle: 'Kracht, coördinatie & teamwork',
      icon: 'rowing',
      heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    },
    triatlon: {
      title: 'Triatlon',
      subtitle: 'Combinatie van zwemmen, fietsen en hardlopen',
      icon: 'run-fast',
      heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    },
    schaatsen: {
      title: 'Schaatsen',
      subtitle: 'Snelheid, techniek & uithoudingsvermogen',
      icon: 'skate',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    voetbal: {
      title: 'Voetbal',
      subtitle: 'Techniek, teamwork & conditie',
      icon: 'soccer',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    basketbal: {
      title: 'Basketbal',
      subtitle: 'Snelheid, sprongkracht & teamwork',
      icon: 'basketball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    volleybal: {
      title: 'Volleybal',
      subtitle: 'Teamwork, sprongkracht & techniek',
      icon: 'volleyball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    handbal: {
      title: 'Handbal',
      subtitle: 'Snelheid, kracht & teamwork',
      icon: 'handball',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    hockey: {
      title: 'Hockey',
      subtitle: 'Techniek, snelheid & teamwork',
      icon: 'hockey-sticks',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'rugby-american-football': {
      title: 'Rugby / American football',
      subtitle: 'Kracht, strategie & teamwork',
      icon: 'football',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    racketsporten: {
      title: 'Racketsporten',
      subtitle: 'Tennis, padel, badminton, squash & tafeltennis',
      icon: 'tennis',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
      uitleg: 'Racketsporten zijn dynamische sporten waarbij techniek, snelheid en reactievermogen centraal staan. Voorbeelden zijn tennis, padel, badminton, squash en tafeltennis.',
    },
    'judo-worstelen-bjj-karate-taekwondo': {
      title: 'Judo / Worstelen / BJJ / Karate / Taekwondo',
      subtitle: 'Kracht, techniek & discipline',
      icon: 'karate',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    turnen: {
      title: 'Turnen',
      subtitle: 'Kracht, lenigheid & controle',
      icon: 'human-female-gymnastics',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'parkour-freerunning': {
      title: 'Parkour / Freerunning',
      subtitle: 'Behendigheid & explosiviteit',
      icon: 'run-fast',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'klimmen-boulderen': {
      title: 'Klimmen / Boulderen',
      subtitle: 'Kracht, techniek & coördinatie',
      icon: 'mountain',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'skien-snowboarden': {
      title: 'Skiën / Snowboarden',
      subtitle: 'Balans, techniek & uithoudingsvermogen',
      icon: 'ski',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    'surfen-kitesurfen-windsurfen': {
      title: 'Surfen / Kitesurfen / Windsurfen',
      subtitle: 'Balans, kracht & techniek',
      icon: 'waves',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    golf: {
      title: 'Golf',
      subtitle: 'Techniek, precisie & focus',
      icon: 'golf',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    paardensport: {
      title: 'Paardensport',
      subtitle: 'Samenwerking & balans',
      icon: 'horse-variant',
      heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
  fitness: {
    title: 'Fitness',
    subtitle: 'Kracht & Conditie',
    icon: 'dumbbell',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  },
  hardlopen: {
    title: 'Hardlopen (Endurance)',
    subtitle: 'Lange afstanden & uithoudingsvermogen',
    icon: 'run',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
  },
  'hardlopen-agility': {
    title: 'Hardlopen (Agility)',
    subtitle: 'Snelheid, wendbaarheid & interval',
    icon: 'run-fast',
    heroImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  },
  zwaargewicht: {
    title: 'Zwaargewicht',
    subtitle: 'Powerlifting & Gewichtheffen',
    icon: 'weight-lifter',
    heroImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  },
  hyrox: {
    title: 'Hyrox',
    subtitle: 'Functionele Fitness & Racing',
    icon: 'timer-outline',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  },
  yoga: {
    title: 'Yoga',
    subtitle: 'Flexibiliteit & Mindfulness',
    icon: 'meditation',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  },
  pilates: {
    title: 'Pilates',
    subtitle: 'Core Kracht & Stabiliteit',
    icon: 'yoga',
    heroImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  },
  calisthenics: {
    title: 'Calisthenics',
    subtitle: 'Lichaamsgewicht Training',
    icon: 'human-handsup',
    heroImage: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=1200&q=80',
  },
  mobiliteit: {
    title: 'Mobiliteit',
    subtitle: 'Gewrichtsgezondheid & Beweging',
    icon: 'human-female-dance',
    heroImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80',
    exercises: [],
  },
  vechttraining: {
    title: 'Vechttraining',
    subtitle: 'Boksen, MMA & Vechtsporten',
    icon: 'boxing-glove',
    heroImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
    exercises: [],
  },
  zwangerschap: {
    title: 'Zwangerschap',
    subtitle: 'Beweging & welzijn tijdens zwangerschap',
    icon: 'baby-face-outline',
    heroImage: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80',
    uitleg: 'Blijf actief tijdens je zwangerschap met veilige, aangepaste oefeningen. Raadpleeg altijd je arts bij twijfel.',
    workouts: [
      {
        id: 'zw1',
        name: 'Zwangerschaps Yoga',
        muscle: 'Hele lichaam',
        duration: '30 min',
        level: 'Beginner',
        icon: 'meditation',
        color: '#F59E42',
        exercises: [
          { naam: 'Cat-Cow', uitleg: 'Wissel tussen holle en bolle rug op handen en knieën.' },
          { naam: 'Child’s Pose', uitleg: 'Rustige stretch voor rug en heupen.' },
          { naam: 'Side-Lying Leg Lifts', uitleg: 'Versterk je heupen en benen.' },
          { naam: 'Wall Squat', uitleg: 'Zachte squat met steun van de muur.' },
          { naam: 'Pelvic Tilts', uitleg: 'Bekken kantelen voor core-activatie.' },
          { naam: 'Breathing Practice', uitleg: 'Diepe ademhalingsoefeningen.' },
        ],
      },
      {
        id: 'zw2',
        name: 'Lichte Krachttraining',
        muscle: 'Benen · Billen · Core',
        duration: '25 min',
        level: 'Gemiddeld',
        icon: 'weight-lifter',
        color: '#2563EB',
        exercises: [
          { naam: 'Bodyweight Squats', uitleg: 'Squats zonder extra gewicht.' },
          { naam: 'Glute Bridge', uitleg: 'Heupen omhoog duwen voor bilspieren.' },
          { naam: 'Standing Calf Raises', uitleg: 'Versterk je kuiten.' },
          { naam: 'Seated Row met weerstandsband', uitleg: 'Rugspieren activeren.' },
          { naam: 'Wall Push-ups', uitleg: 'Lichte push-up tegen de muur.' },
        ],
      },
    ],
  },
  'kegel-oefeningen': {
    title: 'Kegel oefeningen',
    subtitle: 'Bekkenbodem & core training',
    icon: 'alpha-k-circle-outline',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    uitleg: 'Kegel oefeningen versterken de bekkenbodemspieren. Ideaal voor herstel na zwangerschap en voor core stabiliteit.',
    workouts: [
      {
        id: 'k1',
        name: 'Klassieke Kegels',
        muscle: 'Bekkenbodem',
        duration: '10 min',
        level: 'Beginner',
        icon: 'alpha-k-circle-outline',
        color: '#7C3AED',
        exercises: [
          { naam: 'Basis Kegel', uitleg: 'Span je bekkenbodemspieren 5 seconden aan, ontspan 5 seconden. Herhaal 10x.' },
          { naam: 'Snelle Kegels', uitleg: 'Span en ontspan je bekkenbodemspieren zo snel mogelijk, 10x.' },
          { naam: 'Lange Kegels', uitleg: 'Span je bekkenbodemspieren 10 seconden aan, ontspan 10 seconden. Herhaal 5x.' },
        ],
      },
      {
        id: 'k2',
        name: 'Geavanceerde Kegels',
        muscle: 'Bekkenbodem · Core',
        duration: '15 min',
        level: 'Gevorderd',
        icon: 'alpha-k-circle',
        color: '#2563EB',
        exercises: [
          { naam: 'Kegel met brug', uitleg: 'Voer een glute bridge uit en span je bekkenbodemspieren aan.' },
          { naam: 'Staande Kegels', uitleg: 'Doe kegels staand voor extra uitdaging.' },
          { naam: 'Kegels met ademhaling', uitleg: 'Focus op diepe ademhaling tijdens de oefening.' },
          { naam: 'Kegels op één been', uitleg: 'Span je bekkenbodemspieren aan terwijl je op één been staat.' },
        ],
      },
    ],
  },
};

export default function DisciplineScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'workouts' | 'oefeningen' | 'programmas'>('workouts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Alles');
  const discipline = DISCIPLINE_DATA[slug ?? ''];

  if (!discipline) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <PageHeader title="Discipline" onSettingsPress={() => router.push('/(tabs)/athlete')} onSearchPress={() => router.push('/nutrition/search')} onCartPress={() => router.push('/(tabs)/cart')} />
        <View style={[styles.fallbackCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="help-circle-outline" size={48} color={theme.subtitleColor} />
          <Text style={[styles.fallbackTitle, { color: theme.titleColor }]}>Discipline niet gevonden</Text>
          <Text style={[styles.fallbackText, { color: theme.subtitleColor }]}>Deze discipline bestaat niet of is niet beschikbaar.</Text>
          <Pressable style={[styles.fallbackButton, { backgroundColor: '#2563EB' }]} onPress={() => router.push('/(tabs)/disciplines')}>
            <Text style={styles.fallbackButtonText}>Bekijk disciplines</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Use DISCIPLINE_CONTENT for workouts
  const disciplineContent = DISCIPLINE_CONTENT[slug ?? ''];
  const workoutsForDiscipline = disciplineContent?.workouts ?? [];
  const exercisesForDiscipline = disciplineContent?.exercises ?? [];
  const programsForDiscipline = disciplineContent?.programs ?? [];
  const filterOptions =
    slug === 'kegel-oefeningen'
      ? ['Alles', 'Man', 'Vrouw']
      : ['Alles', 'Borst', 'Biceps', 'Triceps', 'Schouders', 'Bovenrug', 'Onderrug', 'Buik', 'Billen', 'Benen'];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── HERO HEADER ── */}
        <ImageBackground source={{ uri: discipline.heroImage }} style={styles.hero}>
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.80)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroGradient}
          >
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
              <Text style={styles.backLabel}>Bibliotheek</Text>
            </Pressable>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>{discipline.title.toUpperCase()}</Text>
              <Text style={styles.heroSubtitle}>{discipline.subtitle}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* ── TAB KNOPPEN ── */}
        <View style={[styles.tabRow, { backgroundColor: theme.background }]}>
          {(['workouts', 'oefeningen', 'programmas'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'programmas' ? 'Programma\'s' : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <Pressable
                key={tab}
                style={[
                  styles.tabButton,
                  { borderColor: theme.border },
                  isActive && { backgroundColor: theme.tabBarActive, borderColor: theme.tabBarActive },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabLabel, { color: isActive ? '#FFFFFF' : theme.subtitleColor }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── ZOEKBALK + SPIERGROEP FILTER ── */}
        <View style={[styles.searchSection, { backgroundColor: theme.background }]}> 
          <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
            <TextInput
              style={[styles.searchInput, { color: theme.titleColor }]}
              placeholder="Zoek oefeningen..."
              placeholderTextColor={theme.subtitleColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.subtitleColor} />
              </Pressable>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    { borderColor: theme.border, backgroundColor: theme.card },
                    isActive && { backgroundColor: theme.tabBarActive, borderColor: theme.tabBarActive },
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : theme.subtitleColor }]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── CONTENT ── */}
        <View style={styles.contentArea}>
          {activeTab === 'workouts' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Kant-en-klare Workouts</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
                {workoutsForDiscipline.length} workout{workoutsForDiscipline.length === 1 ? '' : 's'} beschikbaar
              </Text>
              {workoutsForDiscipline.map((workout) => (
                <Pressable
                  key={workout.id}
                  style={({ pressed }) => [
                    styles.workoutCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => router.push({
                    pathname: '/discipline/[slug]/workout/[id]',
                    params: { slug, id: workout.id },
                  })}
                >
                  <View style={[styles.workoutIconBox, { backgroundColor: workout.color + '22' }]}>
                    <MaterialCommunityIcons name={workout.icon as any} size={26} color={workout.color} />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={[styles.workoutName, { color: theme.titleColor }]}>{workout.name}</Text>
                    <Text style={[styles.workoutMuscle, { color: theme.subtitleColor }]}>{workout.muscle}</Text>
                    <View style={styles.workoutMeta}>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="clock-outline" size={12} color={theme.subtitleColor} />
                        <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{workout.duration}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="lightning-bolt" size={12} color={'#F59E0B'} />
                        <Text style={[styles.metaText, { color: '#F59E0B' }]}>{workout.level}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons name="dumbbell" size={12} color={theme.subtitleColor} />
                        <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{workout.exercises} oefeningen</Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} />
                </Pressable>
              ))}
            </>
          )}
          {activeTab === 'oefeningen' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Oefeningen</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
                {exercisesForDiscipline.length} oefening{exercisesForDiscipline.length === 1 ? '' : 'en'} beschikbaar
              </Text>
              {exercisesForDiscipline.length > 0 ? (
                exercisesForDiscipline.map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    style={({ pressed }) => [
                      styles.exerciseCard,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() => router.push({
                      pathname: '/exercises/[id]',
                      params: { id: exercise.id, disciplineSlug: slug },
                    })}
                  >
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: theme.titleColor }]}>{exercise.name}</Text>
                      <View style={styles.exerciseMeta}>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="human" size={12} color={theme.subtitleColor} />
                          <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{exercise.spiergroep}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="tag" size={12} color={theme.subtitleColor} />
                          <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{exercise.categorie}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="lightning-bolt" size={12} color={'#F59E0B'} />
                          <Text style={[styles.metaText, { color: '#F59E0B' }]}>{exercise.moeilijkheid}</Text>
                        </View>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} />
                  </Pressable>
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: theme.border }]}>
                  <MaterialCommunityIcons name="dumbbell" size={48} color={theme.subtitleColor} />
                  <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Oefeningen voor {discipline.title}</Text>
                  <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>
                    Oefeningen voor {discipline.title} komen binnenkort beschikbaar.
                  </Text>
                  <View style={styles.emptyActionsRow}>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: '#2563EB' }]}
                      onPress={() => router.push('/tracker')}
                    >
                      <Text style={styles.emptyCtaText}>Start activiteit</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => router.push('/exercises' as any)}
                    >
                      <Text style={[styles.emptyCtaTextSecondary, { color: theme.titleColor }]}>Alle oefeningen</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          )}
          {activeTab === 'programmas' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Programma&apos;s</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtitleColor }]}>
                {programsForDiscipline.length} programma{programsForDiscipline.length === 1 ? '' : '&apos;s'} beschikbaar
              </Text>
              {programsForDiscipline.length > 0 ? (
                programsForDiscipline.map((program) => (
                  <Pressable
                    key={program.id}
                    style={({ pressed }) => [
                      styles.exerciseCard,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() => router.push({
                      pathname: '/discipline/[slug]/program/[id]',
                      params: { slug, id: program.id },
                    })}
                  >
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: theme.titleColor }]}>{program.name}</Text>
                      <View style={styles.exerciseMeta}>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="clock-outline" size={12} color={theme.subtitleColor} />
                          <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{program.duration}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="lightning-bolt" size={12} color={'#F59E0B'} />
                          <Text style={[styles.metaText, { color: '#F59E0B' }]}>{program.level}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="calendar-week" size={12} color={theme.subtitleColor} />
                          <Text style={[styles.metaText, { color: theme.subtitleColor }]}>{program.weeks} weken</Text>
                        </View>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} />
                  </Pressable>
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: theme.border }]}>
                  <MaterialCommunityIcons name="clipboard-list-outline" size={48} color={theme.subtitleColor} />
                  <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Programma&apos;s voor {discipline.title}</Text>
                  <Text style={[styles.emptySubtitle, { color: theme.subtitleColor }]}>
                    Programma&apos;s voor {discipline.title} komen binnenkort beschikbaar.
                  </Text>
                  <View style={styles.emptyActionsRow}>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: '#F59E0B' }]}
                      onPress={() => router.push('/tracker')}
                    >
                      <Text style={styles.emptyCtaText}>Start activiteit</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.emptyCtaButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => router.push('/workouts')}
                    >
                      <Text style={[styles.emptyCtaTextSecondary, { color: theme.titleColor }]}>Bekijk workouts</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  hero: { width: screenWidth, height: 280 },
  heroGradient: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start' },
  backLabel: { fontSize: 16, fontWeight: '500', color: '#FFFFFF' },
  heroTextBlock: { gap: 4 },
  heroTitle: { fontSize: 48, fontWeight: '900', letterSpacing: -1.5, lineHeight: 50, color: '#FFFFFF' },
  heroSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', letterSpacing: 1, color: 'rgba(255,255,255,0.80)' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, gap: 10 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  tabLabel: { fontSize: 13, fontWeight: '700' },
  searchSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { gap: 8, paddingBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  contentArea: { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 3 },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginBottom: 14 },
  workoutCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12, gap: 14 },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  workoutIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  workoutMuscle: { fontSize: 12, marginBottom: 8 },
  workoutMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '600' },
  emptyState: { marginTop: 24, alignItems: 'center', paddingVertical: 56, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyActionsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  emptyCtaButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, flex: 1 },
  emptyCtaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  emptyCtaTextSecondary: { fontWeight: '700', fontSize: 15 },
  fallbackCard: { marginHorizontal: 16, marginTop: 24, padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 12 },
  fallbackTitle: { fontSize: 20, fontWeight: '700' },
  fallbackText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  fallbackButton: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  fallbackButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  exerciseMuscle: { fontSize: 12 },
  exerciseSets: { fontSize: 13, fontWeight: '700' },
  exerciseMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  errorText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  bottomSpacer: { height: 120 },
});
