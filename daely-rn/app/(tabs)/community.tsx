import { ScrollView, StyleSheet, Text, View, Pressable, TextInput, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnreadMessageCount } from '@/services/messages-storage';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = 'feed' | 'creators' | 'partners' | 'events';

// AsyncStorage keys
const COMMUNITY_POSTS_KEY = 'daely.community.posts.v1';

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
    time: 'Straks zichtbaar',
    text: 'Vandaag mijn eerste 5 km gelopen. Kleine stap, groot gevoel.',
    icon: 'run-fast',
    color: '#2563EB',
  },
  {
    id: '2',
    name: 'Familie support',
    handle: '@support',
    time: 'Straks zichtbaar',
    text: 'Nieuwe mobility routine opgeslagen voor herstel na training.',
    icon: 'heart',
    color: '#EF4444',
  },
  {
    id: '3',
    name: 'Fitness creator',
    handle: '@fitness',
    time: 'Straks zichtbaar',
    text: 'Creator preview: deel straks workouts, tips en progressie met je volgers.',
    icon: 'dumbbell',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Running athlete',
    handle: '@runner',
    time: 'Straks zichtbaar',
    text: 'Marathon training gaat goed. Klaar voor de volgende challenge.',
    icon: 'run',
    color: '#059669',
  },
  {
    id: '5',
    name: 'DAELY Performance',
    handle: '@daely',
    time: 'Straks zichtbaar',
    text: 'DAELY Performance preview: straks vind je hier partnerupdates en sportvoordelen.',
    icon: 'lightning-bolt',
    color: '#8B5CF6',
  },
  {
    id: '6',
    name: 'DAELY team',
    handle: '@daely',
    time: 'Straks zichtbaar',
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
                    { width: (carouselWidth || Dimensions.get('window').width) - 32, backgroundColor: '#2563EB' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(37, 99, 235, 0.8)', 'rgba(37, 99, 235, 0.95)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>Community</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="newspaper" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Feed</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Updates uit de DAELY community</Text>
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
                    { width: (carouselWidth || Dimensions.get('window').width) - 32, backgroundColor: '#8B5CF6' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.95)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>Community</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="account" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Creators</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Volg sporters, creators en coaches</Text>
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
                    { width: (carouselWidth || Dimensions.get('window').width) - 32, backgroundColor: '#F59E0B' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.95)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>Community</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="office-building" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Partners</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Merken en voordelen voor sporters</Text>
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
                    { width: (carouselWidth || Dimensions.get('window').width) - 32, backgroundColor: '#059669' }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(5, 150, 105, 0.8)', 'rgba(5, 150, 105, 0.95)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerCardGradient}
                  >
                    <View style={styles.headerCardTextBlock}>
                      <Text style={styles.headerCardContext}>Community</Text>
                      <View style={styles.headerCardTitleRow}>
                        <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
                        <Text style={styles.headerCardTitle}>Events</Text>
                      </View>
                      <Text style={styles.headerCardSubtitle}>Challenges, events en sportdagen</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Pressable>
          </ScrollView>

          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            <View style={[styles.pageDot, activeTab === 'feed' && styles.pageDotActive]} />
            <View style={[styles.pageDot, activeTab === 'creators' && styles.pageDotActive]} />
            <View style={[styles.pageDot, activeTab === 'partners' && styles.pageDotActive]} />
            <View style={[styles.pageDot, activeTab === 'events' && styles.pageDotActive]} />
          </View>
        </View>

        {/* Feed Tab - X/Twitter-achtige berichtenfeed */}
        {activeTab === 'feed' && (
          <View style={styles.tabContent}>
            {/* Compact Composer Trigger */}
            {!composerExpanded && (
              <Pressable
                style={[styles.compactComposerCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setComposerExpanded(true)}
              >
                <View style={[styles.compactComposerAvatar, { backgroundColor: '#F59E0B20' }]}>
                  <MaterialCommunityIcons name="account" size={24} color="#F59E0B" />
                </View>
                <View style={styles.compactComposerContent}>
                  <Text style={[styles.compactComposerTitle, { color: theme.titleColor }]}>Deel een update</Text>
                  <Text style={[styles.compactComposerSubtitle, { color: theme.subtitleColor }]}>Plaats iets op je feed wanneer jij dat wilt.</Text>
                </View>
                <MaterialCommunityIcons name="pencil" size={20} color={theme.subtitleColor} />
              </Pressable>
            )}

            {/* Expanded Composer */}
            {composerExpanded && (
              <View style={[styles.expandedComposerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
            )}

            {/* Feed Posts */}
            {combinedFeed.map((item) => (
              <View key={item.id} style={[styles.feedPost, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.feedHeader}>
                  <View style={[styles.feedAvatar, { backgroundColor: `${item.color}20` }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.feedHeaderInfo}>
                    <Text style={[styles.feedName, { color: theme.titleColor }]}>{item.name}</Text>
                    <Text style={[styles.feedHandle, { color: theme.subtitleColor }]}>{item.handle}</Text>
                  </View>
                  <View style={styles.feedHeaderRight}>
                    <Text style={[styles.feedTime, { color: theme.subtitleColor }]}>{item.time}</Text>
                    {(item as any).isOwn && (
                      <View style={[styles.feedBadge, { backgroundColor: '#6B7280' }]}>
                        <Text style={styles.feedBadgeText}>Privé preview</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[styles.feedText, { color: theme.titleColor }]}>{item.text}</Text>
                <View style={styles.feedActions}>
                  <Pressable style={styles.feedAction}>
                    <MaterialCommunityIcons name="comment-outline" size={18} color={theme.subtitleColor} />
                    <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Reageren</Text>
                  </Pressable>
                  <Pressable style={styles.feedAction}>
                    <MaterialCommunityIcons name="heart-outline" size={18} color={theme.subtitleColor} />
                    <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Support</Text>
                  </Pressable>
                  <Pressable style={styles.feedAction}>
                    <MaterialCommunityIcons name="share-variant" size={18} color={theme.subtitleColor} />
                    <Text style={[styles.feedActionText, { color: theme.subtitleColor }]}>Delen</Text>
                  </Pressable>
                </View>
              </View>
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
                <Pressable
                  key={creator.id}
                  style={[styles.creatorCardCompact, { backgroundColor: theme.card, borderColor: theme.border }]}
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
                <Pressable
                  key={partner.id}
                  style={[styles.partnerCard, { backgroundColor: theme.card, borderColor: theme.border }]}
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
              ))}
            </View>
          </View>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <View style={styles.tabContent}>
            <View style={styles.eventsSection}>
              {EVENTS.map((event) => (
                <Pressable
                  key={event.id}
                  style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border }]}
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
              ))}
            </View>
          </View>
        )}

        {/* Bottom CTA - alleen op Feed tab */}
        {activeTab === 'feed' && (
          <View style={styles.ctaSection}>
            <Pressable
              style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/tracker')}
            >
              <MaterialCommunityIcons name="run-fast" size={24} color={theme.titleColor} />
              <Text style={[styles.ctaText, { color: theme.titleColor }]}>Start activiteit</Text>
            </Pressable>
            <Pressable
              style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/feedback')}
            >
              <MaterialCommunityIcons name="chat-outline" size={24} color={theme.titleColor} />
              <Text style={[styles.ctaText, { color: theme.titleColor }]}>Feedback geven</Text>
            </Pressable>
            <Pressable
              style={[styles.ctaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/today')}
            >
              <MaterialCommunityIcons name="calendar-today" size={24} color={theme.titleColor} />
              <Text style={[styles.ctaText, { color: theme.titleColor }]}>Naar Today</Text>
            </Pressable>
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  compactComposerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactComposerContent: {
    flex: 1,
  },
  compactComposerTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactComposerSubtitle: {
    fontSize: 13,
  },
  // Post Composer - Expanded
  expandedComposerCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
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
    marginBottom: 8,
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
  },
  headerCardGradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerCardTextBlock: {
    gap: 6,
    alignSelf: 'flex-start',
  },
  headerCardContext: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  headerCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: '#FFFFFF',
  },
  headerCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
  },
  pageDotActive: {
    backgroundColor: '#2563EB',
  },
  tabContent: {
    marginTop: 12,
  },
  // Feed - X/Twitter-achtige berichten
  feedPost: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  feedHeaderInfo: {
    flex: 1,
  },
  feedName: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedHandle: {
    fontSize: 12,
  },
  feedHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  feedTime: {
    fontSize: 11,
  },
  feedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  feedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  feedText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  feedActions: {
    flexDirection: 'row',
    gap: 24,
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedActionText: {
    fontSize: 12,
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  creatorIconCompact: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  partnerIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  eventIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 22,
  },
});