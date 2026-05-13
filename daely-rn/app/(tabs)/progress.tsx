

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';


const DISCIPLINES = [
  { key: 'Fitness', icon: 'dumbbell', color: '#2563EB' },
  { key: 'Hardlopen', icon: 'run', color: '#22c55e' },
  { key: 'Yoga', icon: 'yoga', color: '#f59e42' },
  { key: 'Mobiliteit', icon: 'human-handsup', color: '#a855f7' },
  { key: 'Calisthenics', icon: 'arm-flex', color: '#f43f5e' },
  { key: 'Hyrox', icon: 'weight-lifter', color: '#0ea5e9' },
  { key: 'Wandelen', icon: 'walk', color: '#10b981' },
  { key: 'Fietsen', icon: 'bike', color: '#fbbf24' },
  { key: 'Zwemmen', icon: 'swim', color: '#38bdf8' },
  { key: 'Teamsport', icon: 'account-group', color: '#f472b6' },
  { key: 'Overig', icon: 'dots-horizontal', color: '#64748b' },
] as const;


type DisciplineKey = (typeof DISCIPLINES)[number]['key'];

type DisciplineStats = {
  sessions: number;
  minutes: number;
  calories: number;
  best: string;
  trend: number[];
};

const STATS: Record<DisciplineKey, DisciplineStats> = {
  Fitness: {
    sessions: 18,
    minutes: 820,
    calories: 4800,
    best: 'Bench Press 90kg',
    trend: [2, 3, 2, 4, 3, 2, 2],
  },
  Hardlopen: {
    sessions: 12,
    minutes: 500,
    calories: 3200,
    best: '10km in 46:30',
    trend: [1, 2, 2, 1, 3, 2, 1],
  },
  Yoga: {
    sessions: 7,
    minutes: 240,
    calories: 800,
    best: '45 min flow',
    trend: [0, 1, 1, 2, 1, 1, 1],
  },
  Mobiliteit: {
    sessions: 5,
    minutes: 150,
    calories: 350,
    best: 'Splits',
    trend: [0, 1, 0, 1, 1, 1, 1],
  },
  Calisthenics: {
    sessions: 6,
    minutes: 180,
    calories: 600,
    best: '15 pull-ups',
    trend: [1, 1, 1, 1, 1, 1, 0],
  },
  Hyrox: {
    sessions: 3,
    minutes: 120,
    calories: 900,
    best: 'Hyrox event',
    trend: [0, 0, 1, 0, 1, 1, 0],
  },
  Wandelen: {
    sessions: 14,
    minutes: 800,
    calories: 2200,
    best: '20km hike',
    trend: [2, 2, 1, 3, 2, 2, 2],
  },
  Fietsen: {
    sessions: 8,
    minutes: 400,
    calories: 2000,
    best: '80km tocht',
    trend: [1, 1, 2, 1, 1, 1, 1],
  },
  Zwemmen: {
    sessions: 3,
    minutes: 90,
    calories: 600,
    best: '2000m',
    trend: [0, 0, 1, 0, 1, 1, 0],
  },
  Teamsport: {
    sessions: 9,
    minutes: 540,
    calories: 2800,
    best: 'Finale gewonnen',
    trend: [1, 2, 1, 1, 2, 1, 1],
  },
  Overig: {
    sessions: 2,
    minutes: 60,
    calories: 200,
    best: '-',
    trend: [0, 0, 0, 1, 0, 1, 0],
  },
};

export default function ProgressScreen() {
  const theme = useTheme();
  const hexBg = theme.background.replace('#', '');
  const r = parseInt(hexBg.slice(0, 2), 16);
  const isDark = r < 100;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={isDark ? ['#10203D', '#0B1220', '#08101C'] : ['#E0F2FE', '#FFFFFF', '#EEF2FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { borderColor: theme.border }]}
        >
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTextBlock}>
              <Text style={[styles.eyebrow, { color: theme.subtitleColor }]}>MIJN PROGRESSIE</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Groei.</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Analyseer.</Text>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Verbeter.</Text>
            </View>
            <View style={styles.heroRightCol}>
              <View style={[styles.heroOrbit, { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.18)' }]}>
                <MaterialCommunityIcons name="chart-line" size={28} color="#2563EB" />
              </View>
              <Text style={[styles.heroSubtext, { color: theme.subtitleColor }]}>Inzicht in je prestaties en records.</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.cardsWrap}>
          {DISCIPLINES.map((discipline) => {
            const stats = STATS[discipline.key];
            const trend = stats.trend.map((v) => '▇'.repeat(v)).join(' ');
            return (
              <View key={discipline.key} style={[styles.card, { backgroundColor: theme.card, borderLeftColor: discipline.color }]}> 
                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrap, { backgroundColor: discipline.color + '22' }]}> 
                    <MaterialCommunityIcons name={discipline.icon as any} size={28} color={discipline.color} />
                  </View>
                  <Text style={[styles.cardTitle, { color: theme.titleColor }]}>{discipline.key}</Text>
                </View>
                <Text style={[styles.stat, { color: theme.titleColor }]}><Text style={styles.statLabel}>Sessies:</Text> {stats.sessions}</Text>
                <Text style={[styles.stat, { color: theme.titleColor }]}><Text style={styles.statLabel}>Minuten:</Text> {stats.minutes}</Text>
                <Text style={[styles.stat, { color: theme.titleColor }]}><Text style={styles.statLabel}>Calorieën:</Text> {stats.calories}</Text>
                <Text style={[styles.stat, { color: theme.titleColor }]}><Text style={styles.statLabel}>Beste prestatie:</Text> {stats.best}</Text>
                {trend && (
                  <Text style={[styles.trend, { color: theme.subtitleColor }]}>Trend (laatste 7 weken):{"\n"}{trend}</Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 96,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextBlock: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: -2,
  },
  heroRightCol: {
    alignItems: 'center',
    marginLeft: 18,
  },
  heroOrbit: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroSubtext: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
  cardsWrap: {
    gap: 18,
    marginBottom: 18,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    padding: 20,
    marginBottom: 0,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
  },
  stat: {
    fontSize: 15,
    marginBottom: 2,
  },
  statLabel: {
    fontWeight: '600',
    opacity: 0.8,
  },
  trend: {
    fontSize: 13,
    marginTop: 6,
    fontFamily: 'monospace',
    color: '#888',
  },
  footerSpacer: {
    height: 60,
  },
});
