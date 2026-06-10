import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';
import PageHeader from './components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

const FOCUS_TIPS = [
  {
    title: 'Eiwitten bij elke maaltijd',
    description: 'Helpt met spierherstel en verzadiging.',
    icon: 'dumbbell' as const,
  },
  {
    title: 'Genoeg drinken',
    description: 'Minstens 2-3 liter water per dag.',
    icon: 'water' as const,
  },
  {
    title: 'Herstelmaaltijd na training',
    description: 'Eiwitten en koolhydraten binnen 2 uur.',
    icon: 'chef-hat' as const,
  },
];

const POPULAR_GOALS = ['Spieropbouw', 'Vetverlies', 'Energie', 'Herstel', 'Gezonde routine'] as const;

export default function MyNutritionScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [selectedGoal, setSelectedGoal] = useState<(typeof POPULAR_GOALS)[number] | null>(null);
  const [placeholderMessage, setPlaceholderMessage] = useState<string | null>(null);

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mijn Voeding"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Voeding</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Houd grip op je energie, herstel en dagelijkse keuzes.
          </Text>
        </View>

        {placeholderMessage ? (
          <View style={[styles.placeholderNotice, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.placeholderNoticeText, { color: theme.titleColor }]}>{placeholderMessage}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Snelle acties</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/nutrition/add')}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Voeding toevoegen</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Log je maaltijd</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/nutrition/compare')}
          >
            <MaterialCommunityIcons name="scale-balance" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Voeding vergelijken</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Vergelijk voedingwaarden</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/nutrition/search')}
          >
            <MaterialCommunityIcons name="magnify" size={22} color={theme.titleColor} />
            <Text style={[styles.actionTitle, { color: theme.titleColor }]}>Voeding zoeken</Text>
            <Text style={[styles.actionSubtitle, { color: theme.subtitleColor }]}>Vind voedingsitems</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Vandaag overzicht</Text>
        </View>
        <View style={styles.todayGrid}>
          <View style={[styles.todayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.todayValue, { color: theme.titleColor }]}>—</Text>
            <Text style={[styles.todayLabel, { color: theme.subtitleColor }]}>Kcal</Text>
          </View>
          <View style={[styles.todayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.todayValue, { color: theme.titleColor }]}>—</Text>
            <Text style={[styles.todayLabel, { color: theme.subtitleColor }]}>Eiwitten</Text>
          </View>
          <View style={[styles.todayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.todayValue, { color: theme.titleColor }]}>—</Text>
            <Text style={[styles.todayLabel, { color: theme.subtitleColor }]}>Koolhydraten</Text>
          </View>
          <View style={[styles.todayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.todayValue, { color: theme.titleColor }]}>—</Text>
            <Text style={[styles.todayLabel, { color: theme.subtitleColor }]}>Vetten</Text>
          </View>
          <View style={[styles.todayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.todayValue, { color: theme.titleColor }]}>—</Text>
            <Text style={[styles.todayLabel, { color: theme.subtitleColor }]}>Water</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Focus vandaag</Text>
        </View>
        <View style={styles.tipsWrap}>
          {FOCUS_TIPS.map((tip) => (
            <View
              key={tip.title}
              style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <MaterialCommunityIcons name={tip.icon} size={18} color={theme.titleColor} />
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: theme.titleColor }]}>{tip.title}</Text>
                <Text style={[styles.tipDescription, { color: theme.subtitleColor }]}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Populaire doelen</Text>
        </View>
        <View style={styles.goalsWrap}>
          {POPULAR_GOALS.map((goal) => {
            const active = selectedGoal === goal;
            return (
              <Pressable
                key={goal}
                style={[
                  styles.goalChip,
                  {
                    backgroundColor: active ? theme.titleColor : theme.card,
                    borderColor: active ? theme.titleColor : theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedGoal(goal);
                  setPlaceholderMessage(`Doelvoeding voor ${goal} komt binnenkort.`);
                }}
              >
                <Text style={[styles.goalLabel, { color: active ? theme.background : theme.titleColor }]}>
                  {goal}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Recente voedingsacties</Text>
        </View>
        <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyTitle, { color: theme.titleColor }]}>Nog geen voedingsmomenten opgeslagen.</Text>
          <Text style={[styles.emptyText, { color: theme.subtitleColor }]}>
            Gebruik Voeding toevoegen om straks je dag bij te houden.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="nutrition" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  placeholderNotice: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  placeholderNoticeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  quickActionsGrid: {
    gap: 10,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 5,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  todayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  todayCard: {
    width: '30%',
    aspectRatio: 0.85,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  todayValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsWrap: {
    gap: 10,
  },
  tipCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    gap: 3,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  goalsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 24,
  },
});
