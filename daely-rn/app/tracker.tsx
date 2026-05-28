
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PageHeader from './components/PageHeader';
import { SPORT_DISCIPLINES, SportDiscipline } from './constants/sport-disciplines';

type FilterChip = 'Alles' | 'Kracht' | 'Mind & Mobility' | 'Duur & afstand' | 'Teamsport' | 'Score' | 'Skill' | 'Wellness';

const FILTER_CHIPS: FilterChip[] = ['Alles', 'Kracht', 'Mind & Mobility', 'Duur & afstand', 'Teamsport', 'Score', 'Skill', 'Wellness'];

const POPULAR_DISCIPLINE_IDS = ['fitness', 'hyrox', 'yoga', 'fietssporten', 'voetbal', 'zwemmen'];

export default function TrackerScreen() {
  const router = useRouter();
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
    <ScrollView style={styles.container}>
      <PageHeader title="DAELY Tracker" />
      <Text style={styles.description}>
        Kies je discipline en track je activiteit op jouw manier.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Start je activiteit</Text>
        <Text style={styles.heroSubtitle}>
          Van krachttraining tot teamsport en herstel: DAELY past de tracking aan op jouw discipline.
        </Text>
        <Text style={styles.heroHint}>Kies hieronder je sport.</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Zoek discipline"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
        {FILTER_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            style={[styles.filterChip, activeFilter === chip ? styles.filterChipActive : null]}
            onPress={() => setActiveFilter(chip)}
          >
            <Text style={[styles.filterChipText, activeFilter === chip ? styles.filterChipTextActive : null]}>{chip}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Populaire disciplines</Text>
      </View>
      <View style={styles.popularWrap}>
        {popularDisciplines.map((discipline) => (
          <Pressable
            key={discipline.id}
            style={styles.popularPill}
            onPress={() => openDiscipline(discipline.id)}
          >
            <Text style={styles.popularPillText}>{discipline.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Alle disciplines</Text>
      </View>

      {filteredDisciplines.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Geen disciplines gevonden.</Text>
          <Pressable style={styles.clearBtn} onPress={clearFilters}>
            <Text style={styles.clearBtnText}>Filters wissen</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredDisciplines.map((discipline) => (
            <Pressable
              key={discipline.id}
              style={styles.card}
              onPress={() => openDiscipline(discipline.id)}
            >
              <Text style={styles.cardTitle}>{discipline.name}</Text>
              <Text style={styles.categoryBadge}>{getFilterLabel(discipline)}</Text>
              <Text style={styles.cardSubtitle}>Tracking: {discipline.trackingType}</Text>
              <Text style={styles.previewText}>{getTrackingPreview(discipline.trackingType)}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardCategory}>{discipline.category}</Text>
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
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  heroCard: {
    marginBottom: 16,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  heroHint: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#0F172A',
  },
  filtersRow: {
    paddingBottom: 8,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
  },
  popularWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  popularPill: {
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  popularPillText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#475569',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '700',
  },
  clearBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    minHeight: 34,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    fontSize: 11,
    color: '#64748B',
  },
  startCta: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
  },
});