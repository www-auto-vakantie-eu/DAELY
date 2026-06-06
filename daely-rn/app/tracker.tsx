
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { SPORT_DISCIPLINES, SportDiscipline } from './constants/sport-disciplines';
import { useTheme } from '@/hooks/use-theme';

type FilterChip = 'Alles' | 'Kracht' | 'Mind & Mobility' | 'Duur & afstand' | 'Teamsport' | 'Score' | 'Skill' | 'Wellness';

const FILTER_CHIPS: FilterChip[] = ['Alles', 'Kracht', 'Mind & Mobility', 'Duur & afstand', 'Teamsport', 'Score', 'Skill', 'Wellness'];

const POPULAR_DISCIPLINE_IDS = ['fitness', 'hyrox', 'yoga', 'fietssporten', 'voetbal', 'zwemmen'];

export default function TrackerScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('Alles');

  const popularDisciplines = useMemo(
    () => SPORT_DISCIPLINES.filter((discipline) => POPULAR_DISCIPLINE_IDS.includes(discipline.id)),
    []
  );

  const filteredDisciplines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return SPORT_DISCIPLINES.filter((discipline) => {
      const chipLabel = getFilterLabel(discipline);
      const matchesFilter = activeFilter === 'Alles' || chipLabel === activeFilter;
      if (!matchesFilter) return false;

      if (normalizedQuery.length === 0) return true;

      const searchable = `${discipline.name} ${discipline.category} ${chipLabel}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [activeFilter, query]);

  const clearFilters = () => {
    setQuery('');
    setActiveFilter('Alles');
  };

  const openDiscipline = (disciplineId: string) => {
    router.push({ pathname: '/tracker/[disciplineId]', params: { disciplineId } });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="DAELY Tracker"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="timer" size={32} color="#2563EB" />
        </View>
        <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Start activiteit</Text>
        <Text style={[styles.heroSubtitle, { color: theme.subtitleColor }]}>
          Kies je discipline en begin met meten.
        </Text>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.subtitleColor} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Zoek discipline"
          placeholderTextColor={theme.subtitleColor}
          style={[styles.searchInput, { color: theme.titleColor }]}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
        {FILTER_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            style={[
              styles.filterChip,
              { backgroundColor: theme.background, borderColor: theme.border },
              activeFilter === chip && styles.filterChipActive,
              activeFilter === chip && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
            ]}
            onPress={() => setActiveFilter(chip)}
          >
            <Text style={[styles.filterChipText, { color: theme.subtitleColor }, activeFilter === chip && styles.filterChipTextActive]}>{chip}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Populaire disciplines</Text>
      </View>
      <View style={styles.popularWrap}>
        {popularDisciplines.map((discipline) => (
          <Pressable
            key={discipline.id}
            style={[styles.popularPill, { backgroundColor: '#DBEAFE' }]}
            onPress={() => openDiscipline(discipline.id)}
          >
            <Text style={styles.popularPillText}>{discipline.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Alle disciplines</Text>
      </View>

      {filteredDisciplines.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Geen disciplines gevonden</Text>
          <Pressable style={[styles.clearBtn, { backgroundColor: '#2563EB' }]} onPress={clearFilters}>
            <Text style={styles.clearBtnText}>Filters wissen</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredDisciplines.map((discipline) => (
            <Pressable
              key={discipline.id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => openDiscipline(discipline.id)}
            >
              <Text style={[styles.cardTitle, { color: theme.titleColor }]}>{discipline.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.categoryBadgeText}>{getFilterLabel(discipline)}</Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: theme.subtitleColor }]}>Tracking: {discipline.trackingType}</Text>
              <Text style={[styles.previewText, { color: theme.subtitleColor }]}>{getTrackingPreview(discipline.trackingType)}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardCategory, { color: theme.subtitleColor }]}>{discipline.category}</Text>
                <Text style={styles.startCta}>Start</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function getFilterLabel(discipline: SportDiscipline): FilterChip {
  if (discipline.trackingType === 'workout') return 'Kracht';
  if (discipline.trackingType === 'laps' || discipline.trackingType === 'gps') return 'Duur & afstand';
  if (discipline.trackingType === 'match') return 'Teamsport';
  if (discipline.trackingType === 'score') return 'Score';
  if (discipline.trackingType === 'skill') return 'Skill';
  if (discipline.category.toLowerCase() === 'wellness') return 'Wellness';
  return 'Mind & Mobility';
}

function getTrackingPreview(trackingType: SportDiscipline['trackingType']) {
  switch (trackingType) {
    case 'workout':
      return 'Workout: sets, reps, gewicht';
    case 'session':
      return 'Session: duur, gevoel, focus';
    case 'match':
      return 'Match: score, positie, stats';
    case 'score':
      return 'Score: sets, holes, resultaat';
    case 'skill':
      return 'Skill: technieken, pogingen, grade';
    case 'laps':
      return 'Laps: banen, afstand, tempo';
    case 'gps':
      return 'GPS: afstand, snelheid, route';
    default:
      return 'Track op discipline-specifieke metrics';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 8,
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterChipActive: {
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  popularWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  popularPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  popularPillText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  clearBtn: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 12,
    lineHeight: 17,
    minHeight: 34,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    fontSize: 12,
  },
  startCta: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
});