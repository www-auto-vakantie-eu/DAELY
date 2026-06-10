import { StyleSheet, View, Text, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { MIND_PROGRAMS } from '@/constants/mind-programs';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function MindProgramScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const program = MIND_PROGRAMS.find((item) => item.id === id);

  if (!program) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <Text style={[styles.notFoundTitle, { color: theme.titleColor }]}>Programma niet gevonden</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topArea}>
          <ImageBackground source={{ uri: program.image }} style={styles.hero} imageStyle={styles.heroImage}>
            <LinearGradient colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']} style={styles.heroOverlay}>
              <View>
                <Text style={styles.heroTitle}>{program.title}</Text>
                <Text style={styles.heroMeta}>{program.minutes} MIN    {program.sessions} SESSIES</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Over dit programma</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{program.description}</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{program.minutes}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>MINUTEN</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{program.sessions}</Text>
              <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>SESSIES</Text>
            </View>
          </View>

          {program.steps && program.steps.length > 0 ? (
            <View style={styles.stepsSection}>
              <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Stappen</Text>
              {program.steps.map((step, index) => (
                <View
                  key={`${program.id}-step-${index}`}
                  style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={styles.stepIndexWrap}>
                    <Text style={styles.stepIndex}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: theme.subtitleColor }]}>{step}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.bottomSpacer} />
        <SharedBottomNav activeTab="mind" />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  topArea: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  hero: {
    height: 290,
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  heroImage: {
    borderRadius: 40,
  },
  heroOverlay: {
    borderRadius: 40,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 70,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 54,
    lineHeight: 56,
    letterSpacing: -1.8,
    fontWeight: '900',
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  stepsSection: {
    marginTop: 22,
    gap: 10,
  },
  stepCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepIndexWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepIndex: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  notFoundTitle: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 120,
  },
});
