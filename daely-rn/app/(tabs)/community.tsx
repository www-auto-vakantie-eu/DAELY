import { PARTNERS } from '@/constants/partners';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Linking, type ImageSourcePropType, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { BADGE_COLORS } from '@/constants/community-creators';
import { PARTNER_LOGO_ASSETS } from '@/constants/partner-logo-assets';
import {
  fetchCommunityCreators,
  fetchCommunityEvents,
  fetchCommunityPartners,
  type CommunityCreator,
  type CommunityEvent,
  type CountryCode,
  type PartnerBrand,
} from '@/services/content-api';
import { getCommunitFeed, formatFeedDate, type FeedItem, type FeedItemType } from '@/services/community-feed';
import { EngagementPanel } from '@/components/EngagementPanel';
import GlobalSearchModal from '../components/GlobalSearchModal';

const { width: screenWidth } = Dimensions.get('window');
const CREATOR_FILTERS = ['Taal', 'Discipline', 'Coach / PT'] as const;
const PARTNER_FILTERS = ['Alles', 'Kleding', 'Voeding', 'Supplementen', 'Lidmaatschappen'] as const;
const COMMUNITY_EVENT_FILTERS = ['Alles', 'Hyrox', 'Obstacle', 'Running'] as const;
const FEED_FILTER_OPTIONS: FeedItemType[] = ['post', 'meal', 'workout'];

function getSiteFaviconUrl(offerUrl: string): string {
  try {
    const domain = new URL(offerUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

// Herstel de volledige structuur van CreatorCard
function CreatorCard({ creator, onPress }: { creator: CommunityCreator; onPress: () => void }) {
  const theme = useTheme();
  const badgeStyle = BADGE_COLORS[creator.badge];

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.titleColor }]}
      onPress={onPress}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarRing}>
          <Image source={{ uri: creator.image }} style={styles.avatar} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.titleColor }]} numberOfLines={1}>{creator.name}</Text>
          <MaterialCommunityIcons name="check-decagram" size={18} color="#3B82F6" style={styles.checkIcon} />
        </View>
        <Text style={[styles.specialty, { color: theme.subtitleColor }]}>{creator.specialty}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subtitleColor} style={styles.chevron} />
    </Pressable>
  );
}

function BrandLogo({
  partnerId,
  uri,
  name,
  offerUrl,
}: {
  partnerId: PartnerBrand['id'];
  uri: string;
  name: string;
  offerUrl: string;
}) {
  const fallbackLogo = getSiteFaviconUrl(offerUrl);
  const localLogo = PARTNER_LOGO_ASSETS[partnerId];
  const logoSources: ImageSourcePropType[] = [
    ...(localLogo ? [localLogo] : []),
    ...(uri ? [{ uri }] : []),
    ...(fallbackLogo ? [{ uri: fallbackLogo }] : []),
  ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (sourceIndex >= logoSources.length) {
    return (
      <View style={styles.logoFallback}>
        <Text style={styles.logoFallbackText}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      source={logoSources[sourceIndex]}
      style={styles.logoImage}
      resizeMode="contain"
      onError={() => setSourceIndex((prev) => prev + 1)}
    />
  );
}

function PartnerCard({
  partner,
}: {
  partner: PartnerBrand;
}) {
  const theme = useTheme();

  const router = useRouter();
  // Automatisch alle [id]-nl varianten mappen naar [id]
  const idMap: Record<string, string> = Object.fromEntries(PARTNERS.map(p => [`${p.id}-nl`, p.id]));
  const openPartnerOffer = () => {
    const realId = idMap[partner.id] || partner.id;
    router.push({ pathname: '/partners/[id]', params: { id: realId } });
  };

  return (
    <Pressable
      style={[styles.partnerCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={openPartnerOffer}
    >
      <View style={[styles.logoWrap, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <BrandLogo
          partnerId={partner.id}
          uri={partner.image}
          name={partner.name}
          offerUrl={partner.offerUrl}
        />
      </View>
      <View style={styles.partnerBody}>
        <Text style={[styles.partnerName, { color: theme.titleColor }]}>{partner.name}</Text>
        <View style={styles.discountLine}>
          <View style={styles.discountPill}>
            <Text style={styles.discountPillText}>{partner.discountLabel}</Text>
          </View>
          <Text style={[styles.automaticText, { color: theme.subtitleColor }]}>AUTOMATISCH</Text>
        </View>
      </View>
      <View style={[styles.chevronCircle, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="chevron-right" size={28} color={theme.subtitleColor} />
      </View>
    </Pressable>
  );
}

function EventCard({
  event,
}: {
  event: CommunityEvent;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.eventIconWrap, { backgroundColor: `${event.accent}12`, borderColor: `${event.accent}30` }]}>
        <EventLogo event={event} />
      </View>
      <View style={styles.eventBody}>
        <View style={styles.eventHeaderRow}>
          <Text style={[styles.eventTitle, { color: theme.titleColor }]}>{event.title}</Text>
          <View style={[styles.eventTypePill, { backgroundColor: event.accent }]}>
            <Text style={styles.eventTypeText}>{event.type}</Text>
          </View>
        </View>
        <Text style={[styles.eventMeta, { color: theme.subtitleColor }]}>{event.date} • {event.location}</Text>
      </View>
    </View>
  );
}

function EventLogo({
  event,
}: {
  event: CommunityEvent;
}) {
  const [hasError, setHasError] = useState(false);
  const initials = event.title
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (hasError || !event.logoUrl) {
    return (
      <View style={[styles.eventLogoFallback, { backgroundColor: `${event.accent}20` }]}>
        <Text style={[styles.eventLogoFallbackText, { color: event.accent }]}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: event.logoUrl }}
      style={styles.eventLogoImage}
      resizeMode="contain"
      onError={() => setHasError(true)}
    />
  );
}

export default function CommunityScreen() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; label: string; meta?: string; onSelect: () => void }>>([]);
  // Filter states for Creators
  const [activeDiscipline, setActiveDiscipline] = useState<string>('Alles');
  const [activeType, setActiveType] = useState<string>('Alles');
  const [activeLanguage, setActiveLanguage] = useState<string>('Alles');
  const [filterModal, setFilterModal] = useState<{ type: 'Taal' | 'Discipline' | 'Coach / PT' | null, visible: boolean }>({ type: null, visible: false });

  // ...andere state...


  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }

    const partnerIdMap: Record<string, string> = Object.fromEntries(PARTNERS.map((p) => [`${p.id}-nl`, p.id]));
    const results: Array<{ id: string; label: string; meta?: string; onSelect: () => void }> = [];
    const seen = new Set<string>();
    const addResult = (item: { id: string; label: string; meta?: string; onSelect: () => void }) => {
      if (results.length >= 24) return;
      if (seen.has(item.id)) return;
      seen.add(item.id);
      results.push(item);
    };

    allCreators.forEach((creator) => {
      const haystack = `${creator.name} ${creator.specialty}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `creator-${creator.id}`,
        label: creator.name,
        meta: `Persoon · ${creator.specialty}`,
        onSelect: () => {
          setSearchVisible(false);
          switchTab(0);
          router.push({ pathname: '/community/creator/[id]', params: { id: creator.id } });
        },
      });
    });

    availablePartners.forEach((partner) => {
      const haystack = `${partner.name} ${partner.group} ${partner.discountLabel}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `partner-${partner.id}`,
        label: partner.name,
        meta: `Partner · ${partner.group}`,
        onSelect: () => {
          const realId = partnerIdMap[partner.id] || partner.id;
          setSearchVisible(false);
          switchTab(2);
          router.push({ pathname: '/partners/[id]', params: { id: realId } });
        },
      });
    });

    countryEvents.forEach((event) => {
      const haystack = `${event.title} ${event.type} ${event.location}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return;
      addResult({
        id: `event-${event.id}`,
        label: event.title,
        meta: `Event · ${event.type} · ${event.location}`,
        onSelect: () => {
          setSearchVisible(false);
          switchTab(3);
        },
      });
    });

    feedItems.forEach((item) => {
      if (item.type === 'meal') {
        const haystack = `${item.title} ${item.mealType}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return;
        addResult({
          id: `meal-${item.id}`,
          label: item.title,
          meta: `Gerecht · ${item.mealType}`,
          onSelect: () => {
            setSearchVisible(false);
            switchTab(1);
            setSelectedFeedFilter('meal');
          },
        });
      }

      if (item.type === 'workout') {
        const haystack = `${item.title} ${item.workoutType} ${item.duration}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return;
        addResult({
          id: `workout-${item.id}`,
          label: item.title,
          meta: `Workout · ${item.workoutType}`,
          onSelect: () => {
            setSearchVisible(false);
            switchTab(1);
            setSelectedFeedFilter('workout');
          },
        });
      }
    });

    Array.from(new Set(allCreators.map((creator) => creator.specialty).filter(Boolean))).forEach((discipline) => {
      if (!discipline.toLowerCase().includes(normalizedQuery)) return;
      addResult({
        id: `discipline-${discipline}`,
        label: discipline,
        meta: 'Discipline',
        onSelect: () => {
          setSearchVisible(false);
          switchTab(0);
          setActiveDiscipline(discipline);
        },
      });
    });

    setSearchResults(results);
  };
  const theme = useTheme();
  const router = useRouter();
  const { appSettings, accountType } = useAppContext();
  const [regionFilter, setRegionFilter] = useState<'MY_COUNTRY' | 'ALL'>('MY_COUNTRY');
  const selectedCountry = regionFilter === 'MY_COUNTRY' ? appSettings.accountCountry : 'ALL';
    // Regiofilter UI
    const handleRegionChange = (filter: 'MY_COUNTRY' | 'ALL') => {
      setRegionFilter(filter);
    };
  const pagerRef = useRef<ScrollView | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activePartnerFilter, setActivePartnerFilter] = useState<(typeof PARTNER_FILTERS)[number]>('Alles');
  const [activeEventFilter, setActiveEventFilter] = useState<(typeof COMMUNITY_EVENT_FILTERS)[number]>('Alles');
  const [allCreators, setAllCreators] = useState<CommunityCreator[]>([]);
  const [visibleCreators, setVisibleCreators] = useState<CommunityCreator[]>([]);
  const [availablePartners, setAvailablePartners] = useState<PartnerBrand[]>([]);
  const [countryEvents, setCountryEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  // Filteropties moeten ná state ivm allCreators
  // Landen waar we actief zijn (uit COUNTRY_OPTIONS)
  const COUNTRY_OPTIONS = [
    { code: 'NL', label: 'Nederland', flag: 'NL' },
    { code: 'FR', label: 'Frankrijk', flag: 'FR' },
    { code: 'BE', label: 'Belgie', flag: 'BE' },
    { code: 'DE', label: 'Duitsland', flag: 'DE' },
    { code: 'ES', label: 'Spanje', flag: 'ES' },
    { code: 'GB', label: 'Verenigd Koninkrijk', flag: 'GB' },
    { code: 'US', label: 'Verenigde Staten', flag: 'US' },
  ];
  const languageOptions = ['Alles', ...COUNTRY_OPTIONS.map(c => c.label)];

  // Disciplines uit DISCIPLINES constant
  const DISCIPLINES = [
    { id: '1', title: 'Fitness' },
    { id: '2', title: 'CrossFit' },
    { id: '3', title: 'Zwaargewicht' },
    { id: '4', title: 'Hyrox' },
    { id: '5', title: 'Yoga' },
    // Voeg hier alle andere disciplines toe zoals in de DISCIPLINES constant
  ];
  const disciplineOptions = ['Alles', ...DISCIPLINES.map(d => d.title)];
  const typeOptions = ['Alles', 'Coach/Personal Trainer', 'Geen Coach/PT'];

  // Feed states
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredFeedItems, setFilteredFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedRefreshing, setFeedRefreshing] = useState(false);
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<FeedItemType | 'all'>('all');
  const [feedSortBy, setFeedSortBy] = useState<'recent' | 'popular'>('recent');
  const [engagementPanelVisible, setEngagementPanelVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoadError('');
        setIsLoading(true);
        const [creators, partners, events] = await Promise.all([
          fetchCommunityCreators(selectedCountry as CountryCode),
          fetchCommunityPartners(selectedCountry as CountryCode),
          fetchCommunityEvents(selectedCountry as CountryCode),
        ]);

        if (isMounted) {
          setAllCreators(creators);
          setVisibleCreators(creators);
          setAvailablePartners(partners);
          setCountryEvents(events);
        }
      } catch (error) {
        console.error('Failed to load community content:', error);
        if (isMounted) {
          setLoadError('Community content kon niet worden geladen.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [selectedCountry]);

  // Filter logic for Creators
  useEffect(() => {
    let filtered = allCreators;
    if (activeDiscipline !== 'Alles') {
      filtered = filtered.filter(c => c.specialty === activeDiscipline);
    }
    if (activeType !== 'Alles') {
      filtered = filtered.filter(c => {
        if (activeType === 'Coach/Personal Trainer') {
          return c.specialty?.toLowerCase().includes('coach') || c.specialty?.toLowerCase().includes('personal trainer');
        }
        if (activeType === 'Geen Coach/PT') {
          return !c.specialty?.toLowerCase().includes('coach') && !c.specialty?.toLowerCase().includes('personal trainer');
        }
        return true;
      });
    }
    // Geen filtering op taal/land mogelijk, alleen UI
    setVisibleCreators(filtered);
  }, [allCreators, activeDiscipline, activeType, activeLanguage]);


  const loadFeed = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setFeedRefreshing(true);
      else setFeedLoading(true);

      const items = await getCommunitFeed({
        includeUnapproved: false,
        limit: 100,
        sortBy: feedSortBy,
      });
      setFeedItems(items);

      // Apply filter
      if (selectedFeedFilter === 'all') {
        setFilteredFeedItems(items);
      } else {
        setFilteredFeedItems(items.filter((item) => item.type === selectedFeedFilter));
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setFeedLoading(false);
      setFeedRefreshing(false);
    }
  }, [feedSortBy, selectedFeedFilter]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (selectedFeedFilter === 'all') {
      setFilteredFeedItems(feedItems);
    } else {
      setFilteredFeedItems(feedItems.filter((item) => item.type === selectedFeedFilter));
    }
  }, [selectedFeedFilter, feedItems]);

  const filteredPartners = availablePartners.filter((partner) => {
    if (activePartnerFilter === 'Alles') return true;
    return partner.group === activePartnerFilter;
  });
  const sectionLabel = activePartnerFilter === 'Alles'
    ? 'ALLE PARTNERS'
    : `${activePartnerFilter.toUpperCase()} PARTNERS`;
  const filteredEvents = countryEvents.filter((event) => {
    if (activeEventFilter === 'Alles') return true;
    return event.type === activeEventFilter;
  });

  const onPagerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / screenWidth);
    if (nextIndex !== activeTab) {
      setActiveTab(nextIndex);
    }
  };

  const switchTab = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * screenWidth, y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
      </View>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.title, { color: theme.titleColor }]}>Community</Text>
            <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Swipe tussen influencers, partners en events.</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={({ pressed }) => [
                styles.settingsPill,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed ? styles.settingsPillPressed : null,
              ]}
              onPress={() => setSearchVisible(true)}
            >
              <MaterialCommunityIcons name="magnify" size={20} color={theme.titleColor} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.settingsPill,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed ? styles.settingsPillPressed : null,
              ]}
              onPress={() => router.push('/(tabs)/athlete')}
            >
              <MaterialCommunityIcons name="cog-outline" size={20} color={theme.titleColor} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.settingsPill,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed ? styles.settingsPillPressed : null,
              ]}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <MaterialCommunityIcons name="shopping-outline" size={20} color={theme.titleColor} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.segmentedWrap, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Pressable
            style={[styles.segmentButton, activeTab === 1 ? styles.segmentButtonActive : null]}
            onPress={() => switchTab(1)}
          >
            <Text style={[styles.segmentText, { color: activeTab === 1 ? '#FFFFFF' : theme.subtitleColor }]}>Feed</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, activeTab === 0 ? styles.segmentButtonActive : null]}
            onPress={() => switchTab(0)}
          >
            <Text style={[styles.segmentText, { color: activeTab === 0 ? '#FFFFFF' : theme.subtitleColor }]}>Creators</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, activeTab === 2 ? styles.segmentButtonActive : null]}
            onPress={() => switchTab(2)}
          >
            <Text style={[styles.segmentText, { color: activeTab === 2 ? '#FFFFFF' : theme.subtitleColor }]}>Partners</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, activeTab === 3 ? styles.segmentButtonActive : null]}
            onPress={() => switchTab(3)}
          >
            <Text style={[styles.segmentText, { color: activeTab === 3 ? '#FFFFFF' : theme.subtitleColor }]}>Events</Text>
          </Pressable>
        </View>

        {/* Creator Studio-balk verwijderd */}

        {isLoading ? (
          <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Community wordt geladen...</Text>
          </View>
        ) : null}

        {!isLoading && loadError ? (
          <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>{loadError}</Text>
          </View>
        ) : null}
      </View>

      <GlobalSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        results={searchResults}
      />
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={onPagerScrollEnd}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >

        {/* Creators Tab: Filterbalk (zonder filter functionaliteit) + lijst */}
        <ScrollView
          style={styles.page}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
          >
            {CREATOR_FILTERS.map((filter) => {
              let activeValue = '';
              if (filter === 'Taal') activeValue = activeLanguage;
              if (filter === 'Discipline') activeValue = activeDiscipline;
              if (filter === 'Coach / PT') activeValue = activeType;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setFilterModal({ type: filter, visible: true })}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: theme.subtitleColor },
                    ]}
                  >
                    {filter.toUpperCase()} {activeValue !== 'Alles' ? `: ${activeValue}` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Filter Modal */}
          <Modal
            visible={filterModal.visible}
            transparent
            animationType="fade"
            onRequestClose={() => setFilterModal({ type: null, visible: false })}
          >
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPressOut={() => setFilterModal({ type: null, visible: false })}>
              <View style={{ minWidth: 220, backgroundColor: theme.card, borderRadius: 18, padding: 18, elevation: 8 }}>
                <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 12, color: theme.titleColor }}>Kies een optie</Text>
                {filterModal.type === 'Taal' && languageOptions.map(opt => (
                  <Pressable key={opt} style={{ paddingVertical: 8 }} onPress={() => { setActiveLanguage(opt); setFilterModal({ type: null, visible: false }); }}>
                    <Text style={{ color: opt === activeLanguage ? theme.tabBarActive : theme.subtitleColor, fontWeight: opt === activeLanguage ? '700' : '400' }}>{opt}</Text>
                  </Pressable>
                ))}
                {filterModal.type === 'Discipline' && disciplineOptions.map(opt => (
                  <Pressable key={opt} style={{ paddingVertical: 8 }} onPress={() => { setActiveDiscipline(opt); setFilterModal({ type: null, visible: false }); }}>
                    <Text style={{ color: opt === activeDiscipline ? theme.tabBarActive : theme.subtitleColor, fontWeight: opt === activeDiscipline ? '700' : '400' }}>{opt}</Text>
                  </Pressable>
                ))}
                {filterModal.type === 'Coach / PT' && typeOptions.map(opt => (
                  <Pressable key={opt} style={{ paddingVertical: 8 }} onPress={() => { setActiveType(opt); setFilterModal({ type: null, visible: false }); }}>
                    <Text style={{ color: opt === activeType ? theme.tabBarActive : theme.subtitleColor, fontWeight: opt === activeType ? '700' : '400' }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {visibleCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onPress={() => router.push({ pathname: '/community/creator/[id]', params: { id: creator.id } })}
            />
          ))}
          {visibleCreators.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Nog geen influencers voor dit land.</Text>
            </View>
          ) : null}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <ScrollView
          style={styles.page}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
          refreshControl={<RefreshControl refreshing={feedRefreshing} onRefresh={() => loadFeed(true)} />}
        >
          {/* Filterknoppen verwijderd zoals gevraagd */}

          {/* FEED label en symbool verwijderd zoals gevraagd */}

          {feedLoading && filteredFeedItems.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Feed wordt geladen...</Text>
            </View>
          ) : null}

          {filteredFeedItems.map((item) => (
            <View key={item.id} style={[styles.feedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <View style={styles.authorInfo}>
                  <Image source={{ uri: item.authorImage }} style={styles.authorAvatar} />
                  <View style={styles.authorDetails}>
                    <Text style={[styles.authorName, { color: theme.titleColor }]}>{item.authorName}</Text>
                    <Text style={[styles.timestamp, { color: theme.subtitleColor }]}>{formatFeedDate(item.createdAt)}</Text>
                  </View>
                </View>
                <View style={[styles.authorBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.authorBadgeText}>Creator</Text>
                </View>
              </View>

              {item.type === 'post' && (
                <View style={styles.cardContent}>
                  <Text style={[styles.postTitle, { color: theme.titleColor }]}>{item.title}</Text>
                  <Text style={[styles.postCaption, { color: theme.subtitleColor }]} numberOfLines={3}>
                    {item.caption}
                  </Text>
                </View>
              )}

              {item.type === 'meal' && (
                <View style={styles.cardContent}>
                  <Text style={[styles.postTitle, { color: theme.titleColor }]}>{item.title}</Text>
                  <Text style={[styles.postCaption, { color: theme.subtitleColor }]} numberOfLines={3}>
                    {`${item.mealType} · ${item.kcal} kcal · ${item.protein}g eiwit`}
                  </Text>
                </View>
              )}

              {item.type === 'workout' && (
                <View style={styles.cardContent}>
                  <Text style={[styles.postTitle, { color: theme.titleColor }]}>{item.title}</Text>
                  <Text style={[styles.postCaption, { color: theme.subtitleColor }]} numberOfLines={3}>
                    {`${item.workoutType} · ${item.duration}`}
                  </Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Pressable
                  style={styles.engagement}
                  onPress={() => {
                    setSelectedItemId(item.id);
                    setEngagementPanelVisible(true);
                  }}
                >
                  <MaterialCommunityIcons name="heart-outline" size={16} color={theme.subtitleColor} />
                  <Text style={[styles.engagementText, { color: theme.subtitleColor }]}>{Math.floor(Math.random() * 100)}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedItemId(item.id);
                    setEngagementPanelVisible(true);
                  }}
                >
                  <MaterialCommunityIcons name="comment-outline" size={16} color={theme.subtitleColor} />
                </Pressable>
                <Pressable style={styles.moreButton}>
                  <MaterialCommunityIcons name="dots-horizontal" size={16} color={theme.subtitleColor} />
                </Pressable>
              </View>
            </View>
          ))}

          {filteredFeedItems.length === 0 && !feedLoading ? (
            <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen feed items gevonden.</Text>
            </View>
          ) : null}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <ScrollView
          style={styles.page}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
          >
            {PARTNER_FILTERS.map((filter) => {
              const selected = activePartnerFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    selected
                      ? styles.filterChipActive
                      : { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setActivePartnerFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selected ? '#FFFFFF' : theme.subtitleColor },
                    ]}
                  >
                    {filter.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>



          {filteredPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
          {filteredPartners.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Nog geen partners in deze categorie.</Text>
            </View>
          ) : null}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <ScrollView
          style={styles.page}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
          >
            {COMMUNITY_EVENT_FILTERS.map((filter) => {
              const selected = activeEventFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterChip,
                    selected
                      ? styles.filterChipActive
                      : { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setActiveEventFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selected ? '#FFFFFF' : theme.subtitleColor },
                    ]}
                  >
                    {filter.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>



          {filteredEvents.map((event) => {
            let eventPage: '/events/hyrox' | '/events/obstacle-run' | '/events/running-day' | null = null;
            if (event.type?.toLowerCase().includes('hyrox') || event.title?.toLowerCase().includes('hyrox')) {
              eventPage = '/events/hyrox';
            } else if (event.type?.toLowerCase().includes('obstacle') || event.title?.toLowerCase().includes('obstacle')) {
              eventPage = '/events/obstacle-run';
            } else if (event.type?.toLowerCase().includes('running') || event.title?.toLowerCase().includes('running')) {
              eventPage = '/events/running-day';
            }
            return (
              <Pressable key={event.id} onPress={() => { if (eventPage) router.push(eventPage); }} style={{ marginBottom: 16 }}>
                <EventCard event={event} />
              </Pressable>
            );
          })}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </ScrollView>

      <EngagementPanel
        visible={engagementPanelVisible}
        onClose={() => setEngagementPanelVisible(false)}
        feedItemId={selectedItemId || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
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
    marginTop: 8,
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  segmentedWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  creatorPanel: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorPanelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  creatorPanelIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorPanelTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  creatorPanelTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  creatorPanelSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#2563EB',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pager: { flex: 1 },
  page: {
    width: screenWidth,
  },
  pageContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterRow: {
    gap: 10,
    paddingRight: 20,
  },
  filterChip: {
    minWidth: 124,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#0F111A',
    borderColor: '#0F111A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  partnerSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 14,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
  },
  eventIconWrap: {
    width: 82,
    height: 82,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  eventLogoImage: {
    width: 58,
    height: 58,
  },
  eventLogoFallback: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventLogoFallbackText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  eventBody: {
    flex: 1,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  eventTypePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eventTypeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  eventMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  avatarWrap: {
    marginRight: 14,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#3B82F6',
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  cardBody: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  checkIcon: {
    marginTop: 1,
  },
  specialty: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  followers: {
    fontSize: 13,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 4,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 122,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoImage: {
    width: 54,
    height: 54,
  },
  logoFallback: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  partnerBody: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  discountLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  discountPill: {
    backgroundColor: '#2D67E7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  discountPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  automaticText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  chevronCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  feedCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  authorBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  authorBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  cardContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  postCaption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  engagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  engagementText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moreButton: {
    marginLeft: 'auto',
  },
  bottomSpacer: { height: 120 },
});
