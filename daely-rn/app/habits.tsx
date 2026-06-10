import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

type HabitItem = {
  id: string;
  name: string;
  description: string;
};

const HABITS: HabitItem[] = [
  {
    id: 'water',
    name: 'Water drinken',
    description: 'Hydratatie ondersteunt focus, herstel en prestaties.',
  },
  {
    id: 'move-10',
    name: '10 minuten bewegen',
    description: 'Korte beweging houdt je lichaam actief gedurende de dag.',
  },
  {
    id: 'protein-meal',
    name: 'Eiwitrijke maaltijd',
    description: 'Helpt spierherstel en behoud van spiermassa.',
  },
  {
    id: 'mobility',
    name: 'Stretching / mobiliteit',
    description: 'Ondersteunt soepel bewegen en blessurepreventie.',
  },
  {
    id: 'sleep-on-time',
    name: 'Slaap op tijd',
    description: 'Voldoende slaap verbetert herstel en energieniveau.',
  },
  {
    id: 'mindset-checkin',
    name: 'Mindset check-in',
    description: 'Sta kort stil bij focus, motivatie en mentale rust.',
  },
];

export default function HabitsScreen() {
  const theme = useTheme();
  const [doneHabitIds, setDoneHabitIds] = useState<string[]>([]);

  const doneCount = doneHabitIds.length;
  const totalCount = HABITS.length;

  const doneSet = useMemo(() => new Set(doneHabitIds), [doneHabitIds]);

  const markDone = (habitId: string) => {
    setDoneHabitIds((prev) => {
      if (prev.includes(habitId)) {
        return prev;
      }

      return [...prev, habitId];
    });
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <PageHeader title="Habit tracker" showSettings={false} showSearch={false} showCart={false} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Dagelijkse basis</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>Bouw dagelijkse gewoontes die je sport, herstel en focus versterken.</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.summaryValue, { color: theme.titleColor }]}>{doneCount} / {totalCount}</Text>
          <Text style={[styles.summaryLabel, { color: theme.subtitleColor }]}>Habits gedaan vandaag</Text>
        </View>

        <View style={styles.habitsList}>
          {HABITS.map((habit) => {
            const isDone = doneSet.has(habit.id);

            return (
              <View
                key={habit.id}
                style={[
                  styles.habitCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isDone ? styles.habitCardDone : null,
                ]}
              >
                <View style={styles.habitHeader}>
                  <Text style={[styles.habitName, { color: theme.titleColor }]}>{habit.name}</Text>
                  <View style={[styles.statusBadge, isDone ? styles.statusDone : styles.statusPending]}>
                    <Text style={styles.statusBadgeText}>{isDone ? 'Gedaan' : 'Nog niet gedaan'}</Text>
                  </View>
                </View>

                <Text style={[styles.habitDescription, { color: theme.subtitleColor }]}>{habit.description}</Text>

                <Pressable
                  onPress={() => markDone(habit.id)}
                  disabled={isDone}
                  style={[styles.actionButton, isDone ? styles.actionButtonDone : styles.actionButtonPending]}
                >
                  <Text style={styles.actionButtonText}>{isDone ? 'Gedaan' : 'Afvinken'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <SharedBottomNav activeTab="mijn" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  introCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  habitsList: {
    gap: 10,
  },
  habitCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  habitCardDone: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  habitName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPending: {
    backgroundColor: '#E5E7EB',
  },
  statusDone: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    color: '#1F2937',
    fontSize: 11,
    fontWeight: '700',
  },
  habitDescription: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  actionButton: {
    marginTop: 12,
    minHeight: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPending: {
    backgroundColor: '#1D4ED8',
  },
  actionButtonDone: {
    backgroundColor: '#16A34A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
