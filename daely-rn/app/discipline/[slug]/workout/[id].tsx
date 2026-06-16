import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { DISCIPLINE_CONTENT } from '@/constants/discipline-content';
import { SPORT_DISCIPLINES } from '../../../constants/sport-disciplines';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function DisciplineWorkoutDetailScreen() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const router = useRouter();
  const theme = useTheme();

  const workout = React.useMemo(() => {
    if (!id || !slug) return null;
    const disciplineContent = DISCIPLINE_CONTENT[slug as keyof typeof DISCIPLINE_CONTENT];
    if (disciplineContent?.workouts) {
      return disciplineContent.workouts.find((w: any) => w.id === id);
    }
    return null;
  }, [id, slug]);

  const discipline = React.useMemo(() => {
    if (!slug) return null;
    return SPORT_DISCIPLINES.find(d => d.id === slug);
  }, [slug]);

  if (!workout) {
    return (
      <AppScreen style={{ backgroundColor: theme.background }}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.titleColor }]}>Workout niet gevonden</Text>
          <Text style={[styles.message, { color: theme.subtitleColor }]}>
            Deze workout kon niet worden geladen.
          </Text>
        </View>
      </AppScreen>
    );
  }

  const handleStartWorkout = () => {
    router.push({
      pathname: '/tracker/[disciplineId]/start',
      params: {
        disciplineId: slug,
        workoutId: id,
      },
    });
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Workout Summary Card */}
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#E8E6FF', '#D0CCFF', '#B8B4FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCardGradient}
            >
              {/* Top-left purple-blue ribbon */}
              <LinearGradient
                colors={['rgba(168, 162, 255, 0.55)', 'rgba(200, 195, 255, 0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonTop}
              />
              {/* Mid-card purple-pink ribbon */}
              <LinearGradient
                colors={['rgba(220, 180, 255, 0.42)', 'rgba(200, 195, 255, 0.20)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonMid}
              />
              {/* Periwinkle ribbon */}
              <LinearGradient
                colors={['rgba(168, 162, 255, 0.75)', 'rgba(200, 195, 255, 0.38)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonBlue}
              />
              {/* Purple-pink ribbon */}
              <LinearGradient
                colors={['rgba(220, 180, 255, 0.65)', 'rgba(230, 200, 255, 0.30)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.ribbonRose}
              />
              {/* Right-side accent ribbon */}
              <LinearGradient
                colors={['rgba(180, 170, 255, 0.38)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ribbonRight}
              />
              {/* Soft white highlight */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.06)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.ribbonHighlight}
              />
              {/* Content layer */}
              <View style={styles.summaryCardContent}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }]}>
                  <MaterialCommunityIcons name={workout.icon as any} size={40} color="#4A3A8C" />
                </View>

                <Text style={styles.workoutName}>
                  {workout.name}
                </Text>

                <Text style={styles.muscle}>
                  {workout.muscle}
                </Text>

                <View style={styles.metaContainer}>
                  <View style={styles.metaChip}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#4A3A8C" />
                    <Text style={styles.metaText}>
                      {workout.duration}
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialCommunityIcons name="dumbbell" size={16} color="#4A3A8C" />
                    <Text style={styles.metaText}>
                      {workout.exercises} oefeningen
                    </Text>
                  </View>
                </View>

                {discipline && (
                  <View style={styles.disciplineContainer}>
                    <Text style={styles.label}>Discipline</Text>
                    <Text style={styles.disciplineName}>
                      {discipline.name}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          {/* Start Workout CTA */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6B5B95', '#8B7CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start workout</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.card, borderColor: '#E8E6FF' }]}
            onPress={() => router.push({
              pathname: '/messages/share',
              params: {
                linkedItemType: 'workout',
                linkedItemId: id,
                linkedItemTitle: workout.name,
              },
            })}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="share-outline" size={20} color="#6B5B95" />
            <Text style={[styles.shareButtonText, { color: '#6B5B95' }]}>Deel via berichten</Text>
          </TouchableOpacity>

          {/* Exercise List Placeholder */}
          <View style={[styles.placeholderContainer, { backgroundColor: theme.card, borderColor: '#E8E6FF' }]}>
            <View style={[styles.placeholderIcon, { backgroundColor: '#E8E6FF' }]}>
              <MaterialCommunityIcons name="information-outline" size={32} color="#6B5B95" />
            </View>
            <Text style={[styles.placeholderTitle, { color: theme.titleColor }]}>
              De exacte oefenlijst
            </Text>
            <Text style={[styles.placeholderText, { color: theme.subtitleColor }]}>
              De exacte oefenlijst wordt binnenkort gekoppeld aan deze workout.
            </Text>
          </View>
        </View>
        <SharedBottomNav activeTab="disciplines" />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardGradient: {
    position: 'relative',
    overflow: 'hidden',
    padding: 20,
  },
  summaryCardContent: {
    position: 'relative',
    zIndex: 1,
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
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  workoutName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    color: '#1E1B4B',
  },
  muscle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4A3A8C',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A3A8C',
  },
  disciplineContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    color: '#6B5B95',
  },
  disciplineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  startButton: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
    borderWidth: 1.5,
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#6B5B95',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});