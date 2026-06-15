import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';
import { MIND_PROGRAMS } from '@/constants/mind-programs';

export default function MindCategoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getCategoryName = (id: string | undefined): string => {
    if (!id) return 'Mind';
    const categoryNames: Record<string, string> = {
      prime: 'Prime',
      breathing: 'Ademhaling',
      focus: 'Focus',
      recovery: 'Herstel',
      sleep: 'Slaap',
      mindset: 'Mindset',
      'sport-performance': 'Sport Performance',
      meditations: 'Bekende meditaties',
      moments: 'DAELY Moments',
    };
    return categoryNames[id] || 'Mind';
  };

  const categoryName = getCategoryName(categoryId);

  // Get display-only mock meditation cards with safe program IDs where applicable
  const getMockMeditations = (id: string | undefined) => {
    const mockData: Record<string, { title: string; subtitle: string; duration: string; type: string; programId?: string }[]> = {
      prime: [
        { title: 'DAELY Prime Reset', subtitle: 'Start je dag met energie en focus', duration: '10 min', type: 'Prime', programId: 'tony-robbins-priming' },
        { title: 'Morning Activation', subtitle: 'Start je dag met rustige focus', duration: '5 min', type: 'Prime' },
        { title: 'Start Your Day Calm', subtitle: 'Begin de dag kalm en gefocust', duration: '5 min', type: 'Prime' },
        { title: 'Energy Breath Start', subtitle: 'Activeer je energie', duration: '5 min', type: 'Prime' },
        { title: 'Intentie van de Dag', subtitle: 'Zet je intentie voor vandaag', duration: '10 min', type: 'Prime' },
        { title: 'Mentale Reset Ochtend', subtitle: 'Reset je geest voor de dag', duration: '5 min', type: 'Prime' },
        { title: 'Ready for Today', subtitle: 'Kom klaar voor de dag', duration: '5 min', type: 'Prime' },
      ],
      breathing: [
        { title: 'Wim Hof Methode', subtitle: 'Gecontroleerde ademhaling', duration: '14 min', type: 'Ademhaling', programId: 'wim-hof-method' },
        { title: 'Box Breathing', subtitle: 'Gestructureerde ademhaling', duration: '5 min', type: 'Ademhaling' },
        { title: 'Stress Reset Ademhaling', subtitle: 'Verlaag spanning met ademhaling', duration: '12 min', type: 'Ademhaling', programId: 'stress-reset-breathing' },
        { title: 'Ademruimte na inspanning', subtitle: 'Herstelademhaling', duration: '5 min', type: 'Ademhaling' },
        { title: 'Rustige buikademhaling', subtitle: 'Kalmeer je zenuwstelsel', duration: '10 min', type: 'Ademhaling' },
        { title: '4-7-8 Ademhaling', subtitle: 'Ontspanningstechniek', duration: '5 min', type: 'Ademhaling' },
        { title: 'Pre-training Breath Control', subtitle: 'Focus voor training', duration: '5 min', type: 'Ademhaling' },
      ],
      focus: [
        { title: 'Laser Focus Flow', subtitle: 'Mentale activatie voor concentratie', duration: '10 min', type: 'Focus', programId: 'laser-focus-flow' },
        { title: 'Tony Robbins - Priming', subtitle: 'Energieke visualisatie en focus', duration: '11 min', type: 'Focus', programId: 'tony-robbins-priming' },
        { title: 'Deep Work Entry', subtitle: 'Diepe focus voor werk', duration: '10 min', type: 'Focus' },
        { title: 'Focus voor training', subtitle: 'Mentale voorbereiding', duration: '5 min', type: 'Focus' },
        { title: 'Concentratie Reset', subtitle: 'Herstel van focus', duration: '5 min', type: 'Focus' },
        { title: 'Mind Clear Start', subtitle: 'Maak je hoofd leeg', duration: '5 min', type: 'Focus' },
        { title: 'Afleiding Loslaten', subtitle: 'Elimineer afleidingen', duration: '10 min', type: 'Focus' },
      ],
      recovery: [
        { title: 'Calm Recovery Bodyscan', subtitle: 'Herstelgerichte bodyscan', duration: '15 min', type: 'Herstel', programId: 'calm-recovery-bodyscan' },
        { title: 'Post-Workout Body Scan', subtitle: 'Ontspan na training', duration: '10 min', type: 'Herstel' },
        { title: 'Spierontspanning', subtitle: 'Laat spanning los', duration: '10 min', type: 'Herstel' },
        { title: 'Rustige Herstel Reset', subtitle: 'Reset na inspanning', duration: '10 min', type: 'Herstel' },
        { title: 'Ademhaling na inspanning', subtitle: 'Herstelademhaling', duration: '5 min', type: 'Herstel' },
        { title: 'Recovery Mind Reset', subtitle: 'Mentale herstel', duration: '5 min', type: 'Herstel' },
        { title: 'Body Scan Deep Reset', subtitle: 'Diepe lichaamsherstel', duration: '15 min', type: 'Herstel' },
      ],
      sleep: [
        { title: 'Deep Sleep Winddown', subtitle: 'Avondroutine voor betere slaap', duration: '20 min', type: 'Slaap', programId: 'deep-sleep-winddown' },
        { title: 'Vishen Lakhiani - 6 Phase', subtitle: 'Gestructureerde meditatie', duration: '21 min', type: 'Slaap', programId: 'vishen-lakhiani-6-phase' },
        { title: 'Slaapvoorbereiding', subtitle: 'Voorbereiding op slaap', duration: '10 min', type: 'Slaap' },
        { title: 'Rustige Nacht Reset', subtitle: 'Avondreset', duration: '10 min', type: 'Slaap' },
        { title: 'Body Relax Sleep', subtitle: 'Lichaamsontspanning', duration: '15 min', type: 'Slaap' },
        { title: 'Ademhaling voor slaap', subtitle: 'Slaapademhaling', duration: '10 min', type: 'Slaap' },
        { title: 'Deep Rest Meditation', subtitle: 'Diepe rust', duration: '15 min', type: 'Slaap' },
      ],
      mindset: [
        { title: 'Over Mindset', subtitle: 'Basis voor discipline en doelen', duration: '', type: 'Mindset', isIntro: true },
        { title: 'Calm Confidence', subtitle: 'Mentale voorbereiding met rust', duration: '10 min', type: 'Mindset', programId: 'confidence-primer' },
        { title: 'Discipline Check-In', subtitle: 'Train je focus en wilskracht', duration: '10 min', type: 'Mindset' },
        { title: 'Mentale Kracht', subtitle: 'Versterk je mentale kracht', duration: '10 min', type: 'Mindset' },
        { title: 'Zelfvertrouwen Reset', subtitle: 'Veranker zelfvertrouwen', duration: '10 min', type: 'Mindset' },
        { title: 'Winnaarsfocus', subtitle: 'Focus op resultaat', duration: '10 min', type: 'Mindset' },
        { title: 'Motivatie Herpakken', subtitle: 'Herstel je motivatie', duration: '10 min', type: 'Mindset' },
      ],
      'sport-performance': [
        { title: 'Confidence Primer', subtitle: 'Korte mentale activatie', duration: '8 min', type: 'Sport', programId: 'confidence-primer' },
        { title: 'Pre-Game Calm', subtitle: 'Kalm voor de wedstrijd', duration: '5 min', type: 'Sport' },
        { title: 'Competition Focus', subtitle: 'Focus op de wedstrijd', duration: '10 min', type: 'Sport' },
        { title: 'Pressure Reset', subtitle: 'Blijf kalm onder druk', duration: '5 min', type: 'Sport' },
        { title: 'Visualisatie voor prestatie', subtitle: 'Visualiseer je prestatie', duration: '10 min', type: 'Sport' },
        { title: 'Race Day Mindset', subtitle: 'Mentale voorbereiding', duration: '10 min', type: 'Sport' },
        { title: 'Training Readiness', subtitle: 'Klaar voor training', duration: '5 min', type: 'Sport' },
      ],
      meditations: [
        { title: 'Vishen Lakhiani - 6 Phase', subtitle: 'Gestructureerde meditatie', duration: '21 min', type: 'Meditatie', programId: 'vishen-lakhiani-6-phase' },
        { title: 'Classic Mindfulness', subtitle: 'Traditionele aandachttraining', duration: '10 min', type: 'Meditatie' },
        { title: 'Body Scan Meditation', subtitle: 'Systeematische lichaamsbewustzijn', duration: '15 min', type: 'Meditatie' },
        { title: 'Loving Kindness', subtitle: 'Compassie meditatie', duration: '10 min', type: 'Meditatie' },
        { title: 'Open Awareness', subtitle: 'Open aandacht', duration: '10 min', type: 'Meditatie' },
        { title: 'Walking Meditation', subtitle: 'Bewustzijn in beweging', duration: '15 min', type: 'Meditatie' },
        { title: 'Breath Awareness', subtitle: 'Ademhalingsbewustzijn', duration: '10 min', type: 'Meditatie' },
      ],
      moments: [
        { title: '1 Minute Reset', subtitle: 'Snelle reset', duration: '1 min', type: 'Moment' },
        { title: '3 Minute Calm', subtitle: 'Korte rust', duration: '3 min', type: 'Moment' },
        { title: 'Snelle Ademruimte', subtitle: 'Ademreset', duration: '2 min', type: 'Moment' },
        { title: 'Voor een Meeting', subtitle: 'Voorbereiding', duration: '3 min', type: 'Moment' },
        { title: 'Na je Training', subtitle: 'Herstelreset', duration: '3 min', type: 'Moment' },
        { title: 'Tussen Twee Taken', subtitle: 'Overgang', duration: '2 min', type: 'Moment' },
        { title: 'Mini Mind Reset', subtitle: 'Korte reset', duration: '5 min', type: 'Moment' },
      ],
    };
    return mockData[id] || [];
  };

  const mockMeditations = getMockMeditations(categoryId);

  // Handle card press - navigate to detail page if program exists
  const handleCardPress = (programId?: string) => {
    if (programId) {
      const programExists = MIND_PROGRAMS.find(p => p.id === programId);
      if (programExists) {
        router.push(`/mind/${programId}`);
      }
    }
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Category Hero Card */}
          <View style={[styles.categoryHeroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.categoryIconBadge}>
              <MaterialCommunityIcons name="meditation" size={32} color="#8B5CF6" />
            </View>
            <Text style={[styles.categoryTitle, { color: theme.titleColor }]}>{categoryName}</Text>
            <Text style={[styles.categorySubtitle, { color: theme.subtitleColor }]}>
              {categoryId === 'prime' && 'Start je dag met energie, focus en intentie'}
              {categoryId === 'breathing' && 'Ademhalingsoefeningen voor rust, controle en focus'}
              {categoryId === 'focus' && 'Train je concentratie voor werk, studie en sport'}
              {categoryId === 'recovery' && 'Ontspan bewust na training of een drukke dag'}
              {categoryId === 'sleep' && 'Rustige routines om je avond af te bouwen'}
              {categoryId === 'mindset' && 'Werk aan discipline, vertrouwen en consistentie'}
              {categoryId === 'sport-performance' && 'Mentale voorbereiding voor training en wedstrijd'}
              {categoryId === 'meditations' && 'Klassieke meditatievormen voor structuur en rust'}
              {categoryId === 'moments' && 'Korte resets van 1, 3 of 5 minuten'}
              {!categoryId && 'Ontspan je geest en verbeter je welzijn'}
            </Text>
          </View>

          {/* Mindset intro card */}
          {categoryId === 'mindset' && (
            <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.introTitle, { color: theme.titleColor }]}>Over Mindset</Text>
              <Text style={[styles.introText, { color: theme.subtitleColor }]}>
                Jouw mindset is de basis voor alles wat je doet. Het bepaalt hoe je omgaat met uitdagingen, hoe je jouw doelen nastreeft en hoe je terugkomt na tegenslagen.
              </Text>
            </View>
          )}

          {/* Meditation Cards */}
          {mockMeditations.map((meditation, index) => {
            if (meditation.isIntro) {
              return (
                <View key={index} style={[styles.meditationCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.meditationIconBadge}>
                    <MaterialCommunityIcons name="information" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.meditationInfo}>
                    <Text style={[styles.meditationTitle, { color: theme.titleColor }]}>{meditation.title}</Text>
                    <Text style={[styles.meditationSubtitle, { color: theme.subtitleColor }]}>{meditation.subtitle}</Text>
                  </View>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.meditationCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleCardPress(meditation.programId)}
              >
                <View style={styles.meditationIconBadge}>
                  <MaterialCommunityIcons name="play-circle" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.meditationInfo}>
                  <Text style={[styles.meditationTitle, { color: theme.titleColor }]}>{meditation.title}</Text>
                  <Text style={[styles.meditationSubtitle, { color: theme.subtitleColor }]}>{meditation.subtitle}</Text>
                  {meditation.duration && (
                    <View style={styles.meditationMeta}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color={theme.subtitleColor} />
                      <Text style={[styles.meditationDuration, { color: theme.subtitleColor }]}>{meditation.duration}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.meditationRightSection}>
                  <View style={[styles.meditationTypeBadge, { backgroundColor: '#F1F5F9' }]}>
                    <Text style={[styles.meditationTypeText, { color: theme.subtitleColor }]}>{meditation.type}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="mind" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  categoryHeroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  categoryIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  categorySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  introCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
  },
  meditationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meditationSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meditationDuration: {
    fontSize: 13,
  },
  meditationRightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  meditationTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  meditationTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});