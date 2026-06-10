import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { getUserPrograms, UserProgramEnrollment } from '@/services/user-programs-storage';
import { DISCIPLINE_CONTENT, Program } from '@/constants/discipline-content';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

type TabType = 'active' | 'completed' | 'saved';

function getProgramDetails(enrollment: UserProgramEnrollment): Program | null {
  const disciplineContent = DISCIPLINE_CONTENT[enrollment.disciplineSlug];
  if (!disciplineContent) return null;

  return disciplineContent.programs.find((p) => p.id === enrollment.programId) || null;
}

function getDisciplineName(slug: string): string {
  const names: Record<string, string> = {
    fitness: 'Fitness',
    crossfit: 'CrossFit',
    running: 'Hardlopen',
    hardlopen: 'Hardlopen',
    cycling: 'Wielrennen',
    swimming: 'Zwemmen',
    yoga: 'Yoga',
    calisthenics: 'Calisthenics',
    boxing: 'Boksen',
    football: 'Voetbal',
    basketball: 'Basketbal',
    tennis: 'Tennis',
    zwaargewicht: 'Zwaargewicht',
    hyrox: 'Hyrox',
    pilates: 'Pilates',
    vechttraining: 'Vechttraining',
    mobiliteit: 'Mobiliteit',
    'kegel-oefeningen': 'Kegel-oefeningen',
    'hardlopen-agility': 'Hardlopen Agility',
    zwangerschap: 'Zwangerschap',
    triatlon: 'Triatlon',
  };
  return names[slug] || slug;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actief',
    paused: 'Gepauzeerd',
    completed: 'Voltooid',
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#10B981',
    paused: '#F59E0B',
    completed: '#64748B',
  };
  return colors[status] || '#64748B';
}

export default function MyProgramsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<UserProgramEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const loadEnrollments = useCallback(async () => {
    const items = await getUserPrograms();
    setEnrollments(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadEnrollments();
  }, [loadEnrollments]);

  useFocusEffect(
    useCallback(() => {
      void loadEnrollments();
    }, [loadEnrollments])
  );

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (activeTab === 'active') return enrollment.status === 'active' || enrollment.status === 'paused';
    if (activeTab === 'completed') return enrollment.status === 'completed';
    return false; // Saved tab - for future use
  });

  const handleProgramPress = (enrollment: UserProgramEnrollment) => {
    router.push(`/discipline/${enrollment.disciplineSlug}/program/${enrollment.programId}`);
  };

  const handleResumePress = (enrollment: UserProgramEnrollment) => {
    router.push(`/discipline/${enrollment.disciplineSlug}/program/${enrollment.programId}`);
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader
          title="Mijn Programma's"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

      <View style={styles.tabsContainer}>
        {(['active', 'completed', 'saved'] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: '#2563EB' },
              activeTab !== tab && { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && { color: '#FFFFFF' },
                activeTab !== tab && { color: theme.titleColor },
              ]}
            >
              {tab === 'active' ? 'Actief' : tab === 'completed' ? 'Voltooid' : 'Opgeslagen'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filteredEnrollments.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Je volgt nog geen programma&apos;s.</Text>
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
            {activeTab === 'active'
              ? 'Start een programma om je voortgang bij te houden.'
              : activeTab === 'completed'
              ? 'Je hebt nog geen programma\'s voltooid.'
              : 'Je hebt nog geen programma\'s opgeslagen.'}
          </Text>
        </View>
      ) : (
        <View style={styles.programsList}>
          {filteredEnrollments.map((enrollment) => {
            const program = getProgramDetails(enrollment);
            const disciplineName = getDisciplineName(enrollment.disciplineSlug);

            return (
              <View key={enrollment.id} style={[styles.programCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Pressable onPress={() => handleProgramPress(enrollment)} style={styles.programContent}>
                  <View style={styles.programHeader}>
                    <View style={styles.programTitleSection}>
                      <Text style={[styles.programName, { color: theme.titleColor }]}>
                        {program?.name || enrollment.programName || enrollment.programId}
                      </Text>
                      <Text style={[styles.programDiscipline, { color: theme.subtitleColor }]}>
                        {disciplineName}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(enrollment.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(enrollment.status) }]}>
                        {getStatusLabel(enrollment.status)}
                      </Text>
                    </View>
                  </View>

                  {enrollment.creatorName && (
                    <Text style={[styles.creatorText, { color: theme.subtitleColor }]}>
                      Door {enrollment.creatorName}
                    </Text>
                  )}

                  {enrollment.accessType === 'paid' && (
                    <Text style={[styles.priceText, { color: '#F59E0B' }]}>
                      {program?.priceLabel || enrollment.priceLabel || 'Betaald programma'}
                    </Text>
                  )}

                  <View style={styles.progressRow}>
                    <View style={styles.progressItem}>
                      <Text style={styles.progressLabel}>Week</Text>
                      <Text style={[styles.progressValue, { color: theme.titleColor }]}>{enrollment.currentWeek}</Text>
                    </View>
                    <View style={styles.progressDivider} />
                    <View style={styles.progressItem}>
                      <Text style={styles.progressLabel}>Dag</Text>
                      <Text style={[styles.progressValue, { color: theme.titleColor }]}>{enrollment.currentDay}</Text>
                    </View>
                    {program?.weeks && (
                      <>
                        <View style={styles.progressDivider} />
                        <View style={styles.progressItem}>
                          <Text style={styles.progressLabel}>Totaal</Text>
                          <Text style={[styles.progressValue, { color: theme.titleColor }]}>{program.weeks} weken</Text>
                        </View>
                      </>
                    )}
                    {enrollment.completedCount !== undefined && (
                      <>
                        <View style={styles.progressDivider} />
                        <View style={styles.progressItem}>
                          <Text style={styles.progressLabel}>Voltooid</Text>
                          <Text style={[styles.progressValue, { color: theme.titleColor }]}>{enrollment.completedCount}</Text>
                        </View>
                      </>
                    )}
                    {enrollment.progressPercentage !== undefined && (
                      <>
                        <View style={styles.progressDivider} />
                        <View style={styles.progressItem}>
                          <Text style={styles.progressLabel}>Voortgang</Text>
                          <Text style={[styles.progressValue, { color: theme.titleColor }]}>{enrollment.progressPercentage}%</Text>
                        </View>
                      </>
                    )}
                  </View>
                </Pressable>

                {enrollment.status === 'active' || enrollment.status === 'paused' ? (
                  <Pressable
                    style={styles.resumeButton}
                    onPress={() => handleResumePress(enrollment)}
                  >
                    <Text style={styles.resumeButtonText}>
                      {enrollment.status === 'paused' ? 'Hervatten' : 'Doorgaan'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      <SharedBottomNav activeTab="mijn" />
      <View style={styles.bottomSpacer} />
    </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCard: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  programsList: {
    gap: 12,
  },
  programCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  programContent: {
    gap: 12,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  programTitleSection: {
    flex: 1,
    gap: 4,
  },
  programName: {
    fontSize: 18,
    fontWeight: '800',
  },
  programDiscipline: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  creatorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressItem: {
    gap: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  resumeButton: {
    marginTop: 4,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 8,
  },
});