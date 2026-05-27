

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    kpiValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#18181B',
      marginTop: 2,
      marginBottom: 0,
    },
    kpiLabel: {
      fontSize: 14,
      color: '#52525B',
      fontWeight: '600',
      marginBottom: 0,
    },
    kpiDesc: {
      fontSize: 12,
      color: '#A1A1AA',
      marginTop: 2,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 18,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 14,
      shadowColor: '#000',
      shadowOpacity: 0.02,
      shadowRadius: 2,
      elevation: 1,
    },
  container: {
    padding: 0,
    paddingBottom: 32,
    backgroundColor: '#F6F7F9',
  },
  header: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#F6F7F9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 8,
  },
  intro: {
    fontSize: 15,
    color: '#52525B',
    marginBottom: 0,
  },
  kpiScroll: {
    marginBottom: 18,
    paddingLeft: 12,
    paddingRight: 0,
  },
  kpiCard: {
    minWidth: 160,
    maxWidth: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginRight: 0,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    gap: 2,
    marginBottom: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 8,
  },
  statLabel: {
    fontWeight: '600',
    color: '#18181B',
    minWidth: 110,
    fontSize: 15,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2563EB',
    fontSize: 15,
  },
  statTrend: {
    fontSize: 13,
    color: '#52525B',
    fontStyle: 'italic',
  },
  photoLabel: {
    fontSize: 13,
    color: '#52525B',
    marginTop: 6,
    marginBottom: 2,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  insightText: {
    fontSize: 14,
    color: '#18181B',
    flex: 1,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  goalText: {
    fontSize: 14,
    color: '#059669',
    flex: 1,
    fontWeight: '600',
  },
  goalRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 2,
  },
  cta: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  motivation: {
    marginTop: 28,
    marginBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});


type KpiCardProps = {
  icon: string;
  label: string;
  value: string;
  accent: string;
  desc: string;
};
function KpiCard({ icon, label, value, accent, desc }: KpiCardProps) {
  return (
    <View style={[styles.kpiCard, { borderColor: accent }]}> 
      <MaterialCommunityIcons name={icon as any} size={28} color={accent} style={{marginBottom: 2}} />
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiDesc}>{desc}</Text>
    </View>
  );
}



type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};
function Section({ title, subtitle, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}


type StatProps = {
  label: string;
  value: string;
  trend?: string;
};
function Stat({ label, value, trend }: StatProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {trend && <Text style={styles.statTrend}>{trend}</Text>}
    </View>
  );
}


type InsightProps = {
  text: string;
};
function Insight({ text }: InsightProps) {
  return (
    <View style={styles.insightCard}>
      <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#2563EB" style={{marginRight: 8}} />
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );
}


type GoalProps = {
  text: string;
};
function Goal({ text }: GoalProps) {
  return (
    <View style={styles.goalCard}>
      <MaterialCommunityIcons name="flag-checkered" size={18} color="#059669" style={{marginRight: 8}} />
      <Text style={styles.goalText}>{text}</Text>
    </View>
  );
}


function MyProgressScreen() {
  return (
    <ScrollView style={{ backgroundColor: '#F6F7F9' }} contentContainerStyle={styles.container}>
      {/* 1. Header / Intro */}
      <View style={styles.header}>
        <Text style={styles.title}>Mijn Progressie</Text>
        <Text style={styles.subtitle}>Jouw vooruitgang in één overzicht</Text>
        <Text style={styles.intro}>Bekijk je statistieken, inzichten en doelen om gemotiveerd te blijven!</Text>
      </View>
      {/* 2. KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll} contentContainerStyle={{gap: 12}}>
        <KpiCard icon="run-fast" label="Workouts" value="24" accent="#2563EB" desc="Deze maand" />
        <KpiCard icon="fire" label="Calorieën" value="12.300" accent="#F59E42" desc="Verbrand" />
        <KpiCard icon="weight-lifter" label="Gewicht" value="-2.1kg" accent="#059669" desc="Sinds start" />
      </ScrollView>
      {/* 3. Statistieken */}
      <Section title="Statistieken" subtitle="Belangrijkste metrics">
        <Stat label="Totale workouts" value="124" trend="+8% t.o.v. vorige maand" />
        <Stat label="Gem. per week" value="3.2" trend="+0.4" />
        <Stat label="Langste streak" value="12 dagen" />
      </Section>
      {/* 4. Inzichten */}
      <Section title="Inzichten" subtitle="Jouw vooruitgang">
        <Insight text="Je bent 3 weken op rij actief geweest!" />
        <Insight text="Je calorieverbranding is 12% hoger dan vorige maand." />
      </Section>
      {/* 5. Doelen */}
      <Section title="Doelen" subtitle="Blijf gemotiveerd">
        <Goal text="5 workouts per week volhouden" />
        <Goal text="10.000 calorieën per maand verbranden" />
      </Section>
      {/* 6. Motivatie */}
      <View style={styles.motivation}>
        <Text style={styles.motivationText}>
          &quot;Progressie is het resultaat van kleine stappen, elke dag weer.&quot;
        </Text>
      </View>
      {/* 7. CTA */}
      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>Bekijk alle statistieken</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default MyProgressScreen;

