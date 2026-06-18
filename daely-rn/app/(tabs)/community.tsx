import { ScrollView, StyleSheet, Text, View, Pressable, TextInput, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnreadMessageCount } from '@/services/messages-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES } from '@/constants/themes';

type Tab = 'feed' | 'creators' | 'partners' | 'events';

// AsyncStorage keys
const COMMUNITY_POSTS_KEY = 'daely.community.posts.v1';

// Helper component for gradient cards with Soft Aurora Ribbon style (same as Today/Nutrition/Discipline)
function GradientCard({ children, style }: { children: React.ReactNode, style?: any }) {
  const { activeThemeId } = useAppContext();
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';
  const isZen = currentTheme.id === 'zenInk';

  // Theme-aware gradient for card backgrounds
  const classicGlowGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#111111', '#1A1A1A', '#2D2D2D'])
      : currentTheme.gradients.aurora || ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  return (
    <View style={[styles.sectionCard, style, { borderColor: isClassic ? '#DCEBFF' : isForce ? '#FECACA' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.12)' : undefined, shadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : undefined }]}>
      {/* Background gradient layer - absolute full-cover */}
      <LinearGradient
        colors={classicGlowGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionCardGradient}
        pointerEvents="none"
      >
        {/* Top-left ribbon */}
        <LinearGradient
          colors={isClassic ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)'] : isForce ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.55)', 'rgba(254, 202, 202, 0.12)']) : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)']) : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)']) : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)']) : ['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonTop}
          pointerEvents="none"
        />
        {/* Mid-card ribbon */}
        <LinearGradient
          colors={isClassic ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)'] : isForce ? ['rgba(254, 226, 226, 0.42)', 'rgba(254, 226, 226, 0.20)'] : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)'] : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)'] : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'] : ['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonMid}
          pointerEvents="none"
        />
        {/* Diagonal top-right ribbon */}
        <LinearGradient
          colors={isClassic ? ['rgba(37, 99, 235, 0.08)', 'rgba(14, 165, 233, 0.10)'] : isForce ? (currentTheme.gradients.auroraBlue || ['rgba(254, 202, 202, 0.75)', 'rgba(254, 202, 202, 0.38)']) : isSahara ? (currentTheme.gradients.auroraBlue || ['rgba(232, 208, 176, 0.32)', 'rgba(232, 208, 176, 0.10)']) : isRetro ? (currentTheme.gradients.auroraBlue || ['rgba(27, 46, 107, 0.16)', 'rgba(27, 46, 107, 0.04)']) : isZen ? (currentTheme.gradients.auroraBlue || ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.03)']) : ['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonBlue}
          pointerEvents="none"
        />
        {/* Diagonal bottom-left ribbon */}
        <LinearGradient
          colors={isClassic ? ['rgba(219, 234, 254, 0.55)', 'rgba(240, 249, 255, 0.75)'] : isForce ? (currentTheme.gradients.auroraRose || ['rgba(239, 68, 68, 0.65)', 'rgba(239, 68, 68, 0.30)']) : isSahara ? (currentTheme.gradients.auroraRose || ['rgba(212, 165, 116, 0.35)', 'rgba(212, 165, 116, 0.12)']) : isRetro ? (currentTheme.gradients.auroraRose || ['rgba(192, 57, 43, 0.22)', 'rgba(232, 98, 42, 0.06)']) : isZen ? (currentTheme.gradients.auroraRose || ['rgba(156, 163, 175, 0.14)', 'rgba(156, 163, 175, 0.05)']) : ['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.ribbonRose}
          pointerEvents="none"
        />
        {/* Right-side accent ribbon */}
        <LinearGradient
          colors={isClassic ? ['rgba(37, 99, 235, 0.08)', 'rgba(255, 255, 255, 0.05)'] : isForce ? ['rgba(254, 202, 202, 0.38)', 'rgba(255, 255, 255, 0.05)'] : isSahara ? ['rgba(245, 230, 211, 0.42)', 'rgba(245, 230, 211, 0.20)'] : isRetro ? ['rgba(255, 253, 247, 0.42)', 'rgba(255, 253, 247, 0.20)'] : isZen ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'] : ['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbonRight}
          pointerEvents="none"
        />
        {/* Soft white highlight overlay */}
        <LinearGradient
          colors={isClassic ? ['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.30)'] : isZen ? ['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.05)'] : ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)']}
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

// Local post type
type LocalPost = {
  id: string;
  name: string;
  handle: string;
  time: string;
  text: string;
  icon: string;
  color: string;
  isOwn: boolean;
};

// Safe preview data - Feed items (X/Twitter-achtige berichten)
const FEED_ITEMS = [
  {
    id: '1',
    name: 'Vriend/vriendin',
    handle: '@vriend',
    time: 'Community update',
    text: 'Vandaag mijn eerste 5 km gelopen. Kleine stap, groot gevoel.',
    icon: 'run-fast',
    color: '#2563EB',
  },
  {
    id: '2',
    name: 'Familie support',
    handle: '@support',
    time: 'Community update',
    text: 'Nieuwe mobility routine opgeslagen voor herstel na training.',
    icon: 'heart',
    color: '#EF4444',
  },
  {
    id: '3',
    name: 'Fitness creator',
    handle: '@fitness',
    time: 'Preview',
    text: 'Creator preview: deel straks workouts, tips en progressie met je volgers.',
    icon: 'dumbbell',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Running athlete',
    handle: '@runner',
    time: 'Community update',
    text: 'Marathon training gaat goed. Klaar voor de volgende challenge.',
    icon: 'run',
    color: '#059669',
  },
  {
    id: '5',
    name: 'DAELY Performance',
    handle: '@daely',
    time: 'Preview',
    text: 'DAELY Performance preview: straks vind je hier partnerupdates en sportvoordelen.',
    icon: 'lightning-bolt',
    color: '#8B5CF6',
  },
  {
    id: '6',
    name: 'DAELY team',
    handle: '@daely',
    time: 'Preview',
    text: 'DAELY update: community, challenges en creators worden voorbereid.',
    icon: 'lightning-bolt',
    color: '#2563EB',
  },
];

// Creators with categories - slug-based IDs
const CREATORS = [
  {
    id: 'fitness-creator',
    name: 'Fitness creator',
    type: 'Fitness',
    specialty: 'Strength & Hypertrofie',
    description: 'Krachttraining en spieropbouw',
    icon: 'arm-flex',
    color: '#2563EB',
  },
  {
    id: 'running-athlete',
    name: 'Running athlete',
    type: 'Running',
    specialty: 'Endurance Training',
    description: 'Marathon loper en running coach',
    icon: 'run-fast',
    color: '#059669',
  },
  {
    id: 'mobility-coach',
    name: 'Mobility coach',
    type: 'Mobility',
    specialty: 'Flexibility & Recovery',
    description: 'Yoga en mobiliteit specialist',
    icon: 'yoga',
    color: '#8B5CF6',
  },
  {
    id: 'team-captain',
    name: 'Team captain',
    type: 'Team',
    specialty: 'Team Coaching',
    description: 'Gepassioneerde teamcoach',
    icon: 'account-group',
    color: '#EF4444',
  },
  {
    id: 'strength-coach',
    name: 'Strength coach',
    type: 'Coach',
    specialty: 'Personal Training',
    description: 'Personal trainer en coach',
    icon: 'dumbbell',
    color: '#F59E0B',
  },
  {
    id: 'nutrition-creator',
    name: 'Nutrition creator',
    type: 'Coach',
    specialty: 'Voedingsadvies',
    description: 'Voedingscoach en meal planner',
    icon: 'food',
    color: '#10B981',
  },
];

// Partners with categories - slug-based IDs
const PARTNERS = [
  {
    id: 'daely-performance',
    name: 'DAELY Performance',
    category: 'Equipment',
    description: 'Premium sportvoeding en supplementen',
    offer: 'Partner voordeel preview',
    icon: 'lightning-bolt',
    color: '#F59E0B',
  },
  {
    id: 'daely-recovery',
    name: 'DAELY Recovery',
    category: 'Overig',
    description: 'Recovery tools en fysiotherapie',
    offer: 'Samenwerking voorbereid',
    icon: 'heart-pulse',
    color: '#EF4444',
  },
  {
    id: 'daely-essentials',
    name: 'DAELY Essentials',
    category: 'Kleding',
    description: 'Basis uitrusting en accessoires',
    offer: 'Lidmaatschap preview',
    icon: 'star',
    color: '#8B5CF6',
  },
  {
    id: 'daely-nutrition',
    name: 'DAELY Nutrition',
    category: 'Nutrition',
    description: 'Voedingsadvies en maaltijdplannen',
    offer: 'Samenwerking voorbereid',
    icon: 'food',
    color: '#059669',
  },
  {
    id: 'daely-supplements',
    name: 'DAELY Supplements',
    category: 'Supplementen',
    description: 'Premium supplementen en shakes',
    offer: 'Partner voordeel preview',
    icon: 'bottle-tonic',
    color: '#10B981',
  },
  {
    id: 'daely-gear',
    name: 'DAELY Gear',
    category: 'Equipment',
    description: 'Sportuitrusting en accessoires',
    offer: 'Samenwerking voorbereid',
    icon: 'weight-lifter',
    color: '#6366F1',
  },
];

const EVENTS = [
  {
    id: '1',
    name: 'HYROX',
    type: 'Obstacle Race',
    description: 'De ultieme fitness challenge',
    route: '/events/hyrox',
    accent: '#F59E0B',
  },
  {
    id: '2',
    name: 'Obstacle Run',
    type: 'Trail Run',
    description: 'Trail run met natuurlijke obstakels',
    route: '/events/obstacle-run',
    accent: '#2563EB',
  },
  {
    id: '3',
    name: 'Running Day',
    type: 'Event',
    description: 'Community running evenement',
    route: '/events/running-day',
    accent: '#059669',
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeThemeId } = useAppContext();
  const isClassic = THEMES[activeThemeId as keyof typeof THEMES]?.id === 'classic';
  const isForce = THEMES[activeThemeId as keyof typeof THEMES]?.id === 'force';
  const isSahara = THEMES[activeThemeId as keyof typeof THEMES]?.id === 'saharaDune';
  const isRetro = THEMES[activeThemeId as keyof typeof THEMES]?.id === 'retroSport';
  const isZen = THEMES[activeThemeId as keyof typeof THEMES]?.id === 'zenInk';

  const shortcutIconBg = isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)';
  const shortcutIconBorder = isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : undefined;
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const headerCarouselRef = useRef<ScrollView>(null);

  const scrollToHeaderCarousel = (tab: Tab) => {
    if (carouselWidth === 0) return;
    const tabIndex = tab === 'feed' ? 0 : tab === 'creators' ? 1 : tab === 'partners' ? 2 : 3;
    headerCarouselRef.current?.scrollTo({ x: tabIndex * carouselWidth, animated: true });
  };

  const handleHeaderCarouselScroll = (event: any) => {
    if (carouselWidth === 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / carouselWidth);
    const clampedIndex = Math.max(0, Math.min(3, pageIndex));
    const tabs: Tab[] = ['feed', 'creators', 'partners', 'events'];
    const tab = tabs[clampedIndex] || 'feed';
    setActiveTab(tab);
  };

  // Feed state
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);
  const [postText, setPostText] = useState('');
  const [composerExpanded, setComposerExpanded] = useState(false);

  useEffect(() => {
    getUnreadMessageCount().then(setUnreadMessageCount);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUnreadMessageCount().then(setUnreadMessageCount);
    }, [])
  );

  // Load local posts on mount
  useEffect(() => {
    AsyncStorage.getItem(COMMUNITY_POSTS_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalPosts(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    });
  }, []);

  // Creators filters
  const [creatorSearch, setCreatorSearch] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('Alles');
  const CREATOR_FILTERS = ['Alles', 'Fitness', 'Running', 'Mobility', 'Team', 'Coach'];

  const filteredCreators = useMemo(() => {
    return CREATORS.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(creatorSearch.toLowerCase()) ||
                           creator.specialty.toLowerCase().includes(creatorSearch.toLowerCase());
      const matchesFilter = creatorFilter === 'Alles' || creator.type === creatorFilter;
      return matchesSearch && matchesFilter;
    });
  }, [creatorSearch, creatorFilter]);

  // Partners filters
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('Alles');
  const PARTNER_FILTERS = ['Alles', 'Kleding', 'Nutrition', 'Supplementen', 'Equipment', 'Overig'];

  const filteredPartners = useMemo(() => {
    return PARTNERS.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                           partner.description.toLowerCase().includes(partnerSearch.toLowerCase());
      const matchesFilter = partnerFilter === 'Alles' || partner.category === partnerFilter;
      return matchesSearch && matchesFilter;
    });
  }, [partnerSearch, partnerFilter]);

  // Handle post submission
  const handlePost = () => {
    if (!postText.trim()) return;

    const newPost: LocalPost = {
      id: Date.now().toString(),
      name: 'Jij',
      handle: '@ik',
      time: 'Zojuist',
      text: postText.trim(),
      icon: 'account',
      color: '#F59E0B',
      isOwn: true,
    };

    const updatedPosts = [newPost, ...localPosts];
    setLocalPosts(updatedPosts);
    setPostText('');
    setComposerExpanded(false);

    AsyncStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(updatedPosts));
  };

  // Handle cancel
  const handleCancel = () => {
    setPostText('');
    setComposerExpanded(false);
  };

  // Combined feed: local posts first, then preview posts
  const combinedFeed = useMemo(() => {
    const localFeedItems = localPosts.map(post => ({
      id: post.id,
      name: post.name,
      handle: post.handle,
      time: post.time,
      text: post.text,
      icon: post.icon,
      color: post.color,
      isOwn: post.isOwn,
    }));
    return [...localFeedItems, ...FEED_ITEMS];
  }, [localPosts]);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Community."
          subtitle="Atleet tot atleet."
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          showMessages
          unreadMessagesCount={unreadMessageCount}
          onMessagesPress={() => router.push('/messages')}
        />

        {/* ── HEADER CAROUSEL ── */}
        <View
          style={styles.headerCarouselViewport}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            if (width > 0) {
              setCarouselWidth(width);
            }
          }}
        >
          <ScrollView
            ref={headerCarouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleHeaderCarouselScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.headerCarouselContent}
          >
            {/* Feed Header Card */}
            <Pressable
              onPress={() => { setActiveTab('feed'); scrollToHeaderCarousel('feed'); }}
              style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
            >
              <View style={styles.headerPage}>
                <View
                  style={[
                    styles.headerCard,
                    { width: carouselWidth || Dimensions.get('window').width, backgroundColor: '#1E3A8A' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(30, 58, 138, 0.6)', 'rgba(37, 99, 235, 0.9)', 'rgba(30, 58, 138, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>COMMUNITY</Text>
                      <View style={styles.headerCardIconContainer}>
                        <MaterialCommunityIcons name="newspaper-variant" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.headerCardTitleRow}>
                        <Text style={styles.headerCardTitle}>Feed</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Updates · Progressie · Sporters</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Pressable>

            {/* Creators Header Card */}
            <Pressable
              onPress={() => { setActiveTab('creators'); scrollToHeaderCarousel('creators'); }}
              style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
            >
              <View style={styles.headerPage}>
                <View
                  style={[
                    styles.headerCard,
                    { width: carouselWidth || Dimensions.get('window').width, backgroundColor: '#5B21B6' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(91, 33, 182, 0.6)', 'rgba(139, 92, 246, 0.9)', 'rgba(91, 33, 182, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>COMMUNITY</Text>
                      <View style={styles.headerCardIconContainer}>
                        <MaterialCommunityIcons name="account-star" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.headerCardTitleRow}>
                        <Text style={styles.headerCardTitle}>Creators</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Athletes · Coaches · Inspiratie</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Pressable>

            {/* Partners Header Card */}
            <Pressable
              onPress={() => { setActiveTab('partners'); scrollToHeaderCarousel('partners'); }}
              style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
            >
              <View style={styles.headerPage}>
                <View
                  style={[
                    styles.headerCard,
                    { width: carouselWidth || Dimensions.get('window').width, backgroundColor: '#B45309' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(180, 83, 9, 0.6)', 'rgba(245, 158, 11, 0.9)', 'rgba(180, 83, 9, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>COMMUNITY</Text>
                      <View style={styles.headerCardIconContainer}>
                        <MaterialCommunityIcons name="storefront" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.headerCardTitleRow}>
                        <Text style={styles.headerCardTitle}>Partners</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Merken · Gear · Samenwerkingen</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Pressable>

            {/* Events Header Card */}
            <Pressable
              onPress={() => { setActiveTab('events'); scrollToHeaderCarousel('events'); }}
              style={{ width: carouselWidth || Dimensions.get('window').width, minWidth: carouselWidth || Dimensions.get('window').width }}
            >
              <View style={styles.headerPage}>
                <View
                  style={[
                    styles.headerCard,
                    { width: carouselWidth || Dimensions.get('window').width, backgroundColor: '#065F46' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(6, 95, 70, 0.6)', 'rgba(5, 150, 105, 0.9)', 'rgba(6, 95, 70, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>COMMUNITY</Text>
                      <View style={styles.headerCardIconContainer}>
                        <MaterialCommunityIcons name="medal" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.headerCardTitleRow}>
                        <Text style={styles.headerCardTitle}>Events</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Challenges · HYROX · Sportevents</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        {/* Feed Tab - X/Twitter-achtige berichtenfeed */}
        {activeTab === 'feed' && (
          <View style={styles.tabContent}>
            {/* Compact Composer Trigger */}
            {!composerExpanded && (
              <Pressable
                style={({ pressed }) => pressed && { opacity: 0.9 }}
                onPress={() => setComposerExpanded(true)}
              >
                <GradientCard>
                  <View style={styles.compactComposerCard}>
                    <View style={[styles.compactComposerAvatar, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name="account" size={24} color={isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#C0392B' : '#F59E0B'} />
                    </View>
                    <View style={styles.compactComposerContent}>
                      <Text style={[styles.compactComposerTitle, { color: theme.titleColor }]}>Deel een update</Text>
                      <Text style={[styles.compactComposerSubtitle, { color: theme.subtitleColor }]}>Deel je workout, progressie of moment.</Text>
                    </View>
                    <View style={[styles.compactComposerButton, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name="pencil" size={18} color={isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#C0392B' : '#2563EB'} />
                    </View>
                  </View>
                </GradientCard>
              </Pressable>
            )}

            {/* Expanded Composer */}
            {composerExpanded && (
              <GradientCard>
                <View style={styles.expandedComposerCard}>
                  <View style={styles.expandedComposerHeader}>
                    <View style={[styles.expandedComposerAvatar, { backgroundColor: '#F59E0B20' }]}>
                      <MaterialCommunityIcons name="account" size={28} color="#F59E0B" />
                    </View>
                    <Text style={[styles.expandedComposerLabel, { color: theme.subtitleColor }]}>Nieuw bericht</Text>
                    <Pressable onPress={handleCancel}>
                      <MaterialCommunityIcons name="close" size={24} color={theme.subtitleColor} />
                    </Pressable>
                  </View>
                  <TextInput
                    style={[styles.expandedComposerInput, { color: theme.titleColor, borderColor: theme.border }]}
                    placeholder="Wat wil je delen?"
                    placeholderTextColor={theme.subtitleColor}
                    value={postText}
                    onChangeText={setPostText}
                    multiline
                    maxLength={280}
                    textAlignVertical="top"
                  />
                  <Text style={[styles.expandedComposerHint, { color: theme.subtitleColor }]}>
                    Je deelt dit bewust op je feed.
                  </Text>
                  <View style={styles.expandedComposerActions}>
                    <Pressable
                      style={[styles.expandedComposerButton, styles.expandedComposerButtonCancel, { borderColor: theme.border }]}
                      onPress={handleCancel}
                    >
                      <Text style={[styles.expandedComposerButtonText, { color: theme.subtitleColor }]}>Annuleren</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.expandedComposerButton, { backgroundColor: postText.trim() ? theme.tabBarActive : `${theme.tabBarActive}50` }]}
                      onPress={handlePost}
                      disabled={!postText.trim()}
                    >
                      <Text style={styles.expandedComposerButtonText}>Plaatsen</Text>
                    </Pressable>
                  </View>
                </View>
              </GradientCard>
            )}

            {/* Feed Posts */}
            {combinedFeed.map((item) => (
              <GradientCard key={item.id}>
                <View style={styles.feedPost}>
                  <View style={styles.feedHeader}>
                    <View style={[styles.feedAvatar, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View style={styles.feedHeaderInfo}>
                      <Text style={[styles.feedName, { color: theme.titleColor }]}>{item.name}</Text>
                      <Text style={[styles.feedHandle, { color: theme.subtitleColor }]}>{item.handle}</Text>
                    </View>
                    <View style={styles.feedHeaderRight}>
                      <Text style={[styles.feedTime, { color: theme.subtitleColor }]}>{item.time}</Text>
                      {(item as any).isOwn && (
                        <View style={[styles.feedBadge, { backgroundColor: isClassic ? '#94A3B8' : isForce ? '#B91C1C' : isSahara ? '#9A6B3A' : isRetro ? '#8A3A22' : '#6B7280' }]}>
                          <Text style={styles.feedBadgeText}>Privé preview</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.feedText, { color: theme.titleColor }]}>{item.text}</Text>
                  <View style={styles.feedActions}>
                    <Pressable style={[styles.feedAction, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name="comment-outline" size={18} color={theme.subtitleColor} />
                      <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Reageren</Text>
                    </Pressable>
                    <Pressable style={[styles.feedAction, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name="heart-outline" size={18} color={theme.subtitleColor} />
                      <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Support</Text>
                    </Pressable>
                    <Pressable style={[styles.feedAction, { backgroundColor: shortcutIconBg, borderColor: shortcutIconBorder }]}>
                      <MaterialCommunityIcons name="share-variant" size={18} color={theme.subtitleColor} />
                      <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Delen</Text>
                    </Pressable>
                  </View>
                </View>
              </GradientCard>
            ))}
          </View>
        )}

        {/* Creators Tab - Compact + Zoekbalk + Filters */}
        {activeTab === 'creators' && (
          <View style={styles.tabContent}>
            {/* Search bar */}
            <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
              <TextInput
                style={[styles.searchInput, { color: theme.titleColor }]}
                placeholder="Zoek creators, sporters of coaches"
                placeholderTextColor={theme.subtitleColor}
                value={creatorSearch}
                onChangeText={setCreatorSearch}
              />
              {creatorSearch.length > 0 && (
                <Pressable onPress={() => setCreatorSearch('')}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={theme.subtitleColor} />
                </Pressable>
              )}
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {CREATOR_FILTERS.map((filter) => {
                const isActive = creatorFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={({ pressed }) => [
                      styles.filterChip,
                      { borderColor: isActive ? '#2563EB' : '#DBEAFE', backgroundColor: isActive ? '#2563EB' : '#FFFFFF' },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => setCreatorFilter(filter)}
                  >
                    <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : '#1D4ED8' }]}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Compact creators - Events card formaat */}
            <View style={styles.creatorsSection}>
              {filteredCreators.map((creator) => (
                <GradientCard key={creator.id}>
                  <Pressable
                    style={styles.creatorCardCompact}
                    onPress={() => router.push(`/community/creator/${creator.id}` as any)}
                >
                  <View style={[styles.creatorIconCompact, { backgroundColor: `${creator.color}15`, borderColor: `${creator.color}30` }]}>
                    <MaterialCommunityIcons name={creator.icon as any} size={32} color={creator.color} />
                  </View>
                  <View style={styles.creatorInfoCompact}>
                    <Text style={[styles.creatorNameCompact, { color: theme.titleColor }]}>{creator.name}</Text>
                    <Text style={[styles.creatorTypeCompact, { color: creator.color }]}>{creator.specialty}</Text>
                    <View style={styles.creatorMetaCompact}>
                      <View style={[styles.creatorBadgeCompact, { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.creatorBadgeTextCompact}>Preview</Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={theme.subtitleColor} />
                </Pressable>
                </GradientCard>
              ))}
            </View>
          </View>
        )}

        {/* Partners Tab - Direct merken + Zoekbalk + Filters */}
        {activeTab === 'partners' && (
          <View style={styles.tabContent}>
            {/* Search bar */}
            <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
              <TextInput
                style={[styles.searchInput, { color: theme.titleColor }]}
                placeholder="Zoek partners of merken"
                placeholderTextColor={theme.subtitleColor}
                value={partnerSearch}
                onChangeText={setPartnerSearch}
              />
              {partnerSearch.length > 0 && (
                <Pressable onPress={() => setPartnerSearch('')}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={theme.subtitleColor} />
                </Pressable>
              )}
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {PARTNER_FILTERS.map((filter) => {
                const isActive = partnerFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={({ pressed }) => [
                      styles.filterChip,
                      { borderColor: isActive ? '#2563EB' : '#DBEAFE', backgroundColor: isActive ? '#2563EB' : '#FFFFFF' },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => setPartnerFilter(filter)}
                  >
                    <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : '#1D4ED8' }]}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Partners - Events card formaat */}
            <View style={styles.partnersSection}>
              {filteredPartners.map((partner) => (
                <GradientCard key={partner.id}>
                  <Pressable
                    style={styles.partnerCard}
                    onPress={() => router.push(`/community/partner/${partner.id}` as any)}
                >
                  <View style={[styles.partnerIcon, { backgroundColor: `${partner.color}15`, borderColor: `${partner.color}30` }]}>
                    <MaterialCommunityIcons name={partner.icon as any} size={32} color={partner.color} />
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={[styles.partnerName, { color: theme.titleColor }]}>{partner.name}</Text>
                    <Text style={[styles.partnerDescription, { color: theme.subtitleColor }]}>{partner.description}</Text>
                    <View style={styles.partnerMeta}>
                      <View style={[styles.partnerTypePill, { backgroundColor: partner.color }]}>
                        <Text style={styles.partnerTypeText}>{partner.category}</Text>
                      </View>
                      <View style={[styles.partnerBadge, { backgroundColor: '#6B7280' }]}>
                        <Text style={styles.partnerBadgeText}>Voorbereid</Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={theme.subtitleColor} />
                </Pressable>
                </GradientCard>
              ))}
            </View>
          </View>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <View style={styles.tabContent}>
            <View style={styles.eventsSection}>
              {EVENTS.map((event) => (
                <GradientCard key={event.id}>
                  <Pressable
                    style={styles.eventCard}
                    onPress={() => router.push(event.route as any)}
                >
                  <View style={[styles.eventIcon, { backgroundColor: `${event.accent}15`, borderColor: `${event.accent}30` }]}>
                    <MaterialCommunityIcons name="trophy" size={32} color={event.accent} />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: theme.titleColor }]}>{event.name}</Text>
                    <Text style={[styles.eventDescription, { color: theme.subtitleColor }]}>{event.description}</Text>
                    <View style={styles.eventMeta}>
                      <View style={[styles.eventTypePill, { backgroundColor: event.accent }]}>
                        <Text style={styles.eventTypeText}>{event.type}</Text>
                      </View>
                      <View style={[styles.eventBadge, { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.eventBadgeText}>Binnenkort</Text>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={theme.subtitleColor} />
                </Pressable>
                </GradientCard>
              ))}
            </View>
          </View>
        )}

        {/* Bottom CTA - alleen op Feed tab */}
        {activeTab === 'feed' && (
          <View style={styles.ctaSection}>
            <GradientCard>
                <Pressable
                  style={styles.ctaCard}
                  onPress={() => router.push('/tracker')}
                >
                  <MaterialCommunityIcons name="run-fast" size={24} color={theme.titleColor} />
                  <Text style={[styles.ctaText, { color: theme.titleColor }]}>Start activiteit</Text>
                </Pressable>
              </GradientCard>
              <GradientCard>
                <Pressable
                  style={styles.ctaCard}
                  onPress={() => router.push('/feedback')}
                >
                  <MaterialCommunityIcons name="chat-outline" size={24} color={theme.titleColor} />
                  <Text style={[styles.ctaText, { color: theme.titleColor }]}>Feedback geven</Text>
                </Pressable>
              </GradientCard>
              <GradientCard>
                <Pressable
                  style={styles.ctaCard}
                  onPress={() => router.push('/(tabs)/today')}
                >
                  <MaterialCommunityIcons name="calendar-today" size={24} color={theme.titleColor} />
                  <Text style={[styles.ctaText, { color: theme.titleColor }]}>Naar Today</Text>
                </Pressable>
              </GradientCard>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  // Post Composer - Compact Trigger
  compactComposerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0,
    borderRadius: 20,
  },
  compactComposerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactComposerContent: {
    flex: 1,
  },
  compactComposerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  compactComposerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  compactComposerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Post Composer - Expanded
  expandedComposerCard: {
    padding: 0,
    borderRadius: 14,
  },
  expandedComposerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  expandedComposerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedComposerLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  expandedComposerInput: {
    minHeight: 100,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  expandedComposerHint: {
    fontSize: 12,
    marginBottom: 12,
  },
  expandedComposerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  expandedComposerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  expandedComposerButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  expandedComposerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Header Carousel
  headerCarouselViewport: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 12,
  },
  headerCarouselContent: {
    gap: 0,
  },
  headerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  headerCardGradient: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerCardTextBlock: {
    gap: 8,
    alignSelf: 'flex-start',
  },
  headerCardContext: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  headerCardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCardTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
    color: '#FFFFFF',
  },
  headerCardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  tabContent: {
    marginTop: 12,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionCardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
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
  // Feed - X/Twitter-achtige berichten
  feedPost: {
    padding: 18,
    borderRadius: 24,
    marginBottom: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  feedHeaderInfo: {
    flex: 1,
  },
  feedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  feedHandle: {
    fontSize: 12,
    color: '#64748B',
  },
  feedHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  feedTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  feedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  feedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  feedText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    color: '#334155',
  },
  feedActions: {
    flexDirection: 'row',
    gap: 20,
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  feedActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  // Filter chips
  filterRow: {
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    minHeight: 44,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Compact creators - Events card formaat
  creatorsSection: {
    gap: 12,
  },
  creatorCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0,
    borderRadius: 14,
  },
  creatorIconCompact: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  creatorInfoCompact: {
    flex: 1,
  },
  creatorNameCompact: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  creatorTypeCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  creatorMetaCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorBadgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  creatorBadgeTextCompact: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // Partners - Events card formaat
  partnersSection: {
    gap: 12,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0,
    borderRadius: 14,
  },
  partnerIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  partnerDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  partnerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partnerTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  partnerTypeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  partnerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  partnerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // Events
  eventsSection: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0,
    borderRadius: 14,
  },
  eventIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  eventTypeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  eventBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // Bottom CTA
  ctaSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  ctaCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0,
    borderRadius: 14,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 22,
  },
});