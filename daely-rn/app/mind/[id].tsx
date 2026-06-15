import { StyleSheet, View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { MIND_PROGRAMS, MindDurationOption } from '@/constants/mind-programs';
import SharedBottomNav from '@/components/SharedBottomNav';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MindProgramScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const program = MIND_PROGRAMS.find((item) => item.id === id);

  // Initialize selected duration option
  const getInitialDurationOption = (): MindDurationOption | null => {
    if (!program?.durationOptions || program.durationOptions.length === 0) {
      return null;
    }
    const defaultId = program.defaultDurationOptionId || 'standard';
    return program.durationOptions.find(opt => opt.id === defaultId) || program.durationOptions[0];
  };

  const [selectedDurationOption, setSelectedDurationOption] = useState<MindDurationOption | null>(getInitialDurationOption());

  // Get display minutes (from selected option or fallback to program.minutes)
  const displayMinutes = selectedDurationOption?.minutes || program?.minutes || 0;

  // Handle start meditation (placeholder for now - no audio player)
  const handleStartMeditation = () => {
    // Placeholder: duration is selected but no audio player yet
    console.log(`Start meditation: ${program.title} - ${displayMinutes} min`);
    // Future: Implement audio player with selectedDurationOption
  };

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
          <TouchableOpacity
            style={styles.heroContainer}
            onPress={handleStartMeditation}
            activeOpacity={0.9}
          >
            <ImageBackground source={{ uri: program.image }} style={styles.hero} imageStyle={styles.heroImage}>
              <LinearGradient colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.82)']} style={styles.heroOverlay}>
                <View style={styles.playButtonContainer}>
                  <View style={styles.playButton}>
                    <MaterialCommunityIcons name="play" size={48} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{program.title}</Text>
          <Text style={[styles.sectionText, { color: theme.subtitleColor }]}>{program.description}</Text>

          {/* Duration Selector */}
          {program.durationOptions && program.durationOptions.length > 0 && (
            <View style={styles.durationSelectorContainer}>
              <Text style={[styles.durationSelectorTitle, { color: theme.titleColor }]}>Kies duur</Text>
              <View style={styles.durationOptionsRow}>
                {program.durationOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.durationOptionCard,
                      selectedDurationOption?.id === option.id && styles.durationOptionCardSelected,
                      { backgroundColor: theme.card, borderColor: theme.border }
                    ]}
                    onPress={() => setSelectedDurationOption(option)}
                  >
                    <Text style={[
                      styles.durationOptionLabel,
                      selectedDurationOption?.id === option.id && styles.durationOptionLabelSelected,
                      { color: selectedDurationOption?.id === option.id ? '#8B5CF6' : theme.titleColor }
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.durationOptionDescription,
                      selectedDurationOption?.id === option.id && styles.durationOptionDescriptionSelected,
                      { color: theme.subtitleColor }
                    ]}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.titleColor }]}>{displayMinutes}</Text>
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
      </ScrollView>
      <SharedBottomNav activeTab="mind" />
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
  heroContainer: {
    marginTop: 14,
  },
  hero: {
    height: 290,
    justifyContent: 'center',
  },
  heroImage: {
    borderRadius: 40,
  },
  heroOverlay: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
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
  durationSelectorContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  durationSelectorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  durationOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationOptionCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    minHeight: 80,
  },
  durationOptionCardSelected: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  durationOptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  durationOptionLabelSelected: {
    color: '#8B5CF6',
  },
  durationOptionDescription: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  durationOptionDescriptionSelected: {
    fontWeight: '600',
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
