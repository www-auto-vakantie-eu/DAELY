// Redesigned Mijn Statistieken page scaffold
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image, SectionList, FlatList, Modal, Switch } from 'react-native';
// TODO: import Victory Native or other chart lib when installed
// import { VictoryLine, VictoryBar, VictoryPie, VictoryArea, VictoryChart, VictoryTheme } from 'victory-native';

// Placeholder chart component
const ChartPlaceholder = ({ title }: { title: string }) => (
  <View style={styles.chartCardEmpty}>
    <Text style={styles.chartTitle}>{title}</Text>
    <View style={styles.chartPlaceholder}><Text style={styles.chartPlaceholderText}>[Chart]</Text></View>
    <Text style={styles.chartValue}>--</Text>
    <Text style={styles.chartDelta}>--</Text>
  </View>
);

export default function MijnStatistiekenScreen() {
  // State for loading, privacy, and settings
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [privacy, setPrivacy] = useState({
    lock: false,
    showWeight: true,
    showCalories: true,
    showPhotos: true,
    showPRs: true,
    showAchievements: true,
  });
  // TODO: fetch user/profile/data
  const isEmpty = true;

  // Privacy lock overlay
  if (privacy.lock) {
    return (
      <View style={styles.lockedOverlay}>
        <Text style={styles.lockedText}>Pagina vergrendeld</Text>
        <TouchableOpacity style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Ontgrendel</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileRow}>
        <TouchableOpacity>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.displayName}>Jan Jansen</Text>
          <Text style={styles.memberSince}>Lid sinds jan 2024</Text>
          <View style={styles.goalPill}><Text style={styles.goalPillText}>Doel: 78 kg</Text></View>
        </View>
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Text style={styles.gearIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#1e293b' }]}> {/* Workouts */}
          <Text style={styles.summaryIcon}>🏋️‍♂️</Text>
          <Text style={styles.summaryValue}>12</Text>
          <Text style={styles.summaryLabel}>Workouts</Text>
          <Text style={styles.summarySub}>deze maand</Text>
          <Text style={styles.summaryDeltaUp}>↑ 8%</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#0ea5e9' }]}> {/* Calorieën */}
          <Text style={styles.summaryIcon}>🔥</Text>
          <Text style={styles.summaryValue}>18.200</Text>
          <Text style={styles.summaryLabel}>Calorieën</Text>
          <Text style={styles.summarySub}>deze maand</Text>
          <Text style={styles.summaryDeltaDown}>↓ 2%</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#334155' }]}> {/* Gewicht */}
          <Text style={styles.summaryIcon}>⚖️</Text>
          <Text style={styles.summaryValue}>81.2</Text>
          <Text style={styles.summaryLabel}>Gewicht</Text>
          <Text style={styles.summarySub}>laatste meting</Text>
          <Text style={styles.summaryDeltaUp}>↑ 0.3 kg</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#f59e42' }]}> {/* Streak */}
          <Text style={styles.summaryIcon}>📅</Text>
          <Text style={styles.summaryValue}>7</Text>
          <Text style={styles.summaryLabel}>Actieve dagen</Text>
          <Text style={styles.summarySub}>streak</Text>
          <Text style={styles.summaryDeltaUp}>↑ 1</Text>
        </View>
      </ScrollView>

      {/* Charts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <ChartPlaceholder title="Gewicht over tijd" />
        <ChartPlaceholder title="Workouts per week" />
        <ChartPlaceholder title="Calorieën verbrand" />
        <ChartPlaceholder title="Body measurements" />
      </View>

      {/* Progress Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voortgang foto&apos;s</Text>
        <View style={styles.emptyState}><Text style={styles.emptyText}>Nog geen foto&apos;s. Voeg je eerste foto toe!</Text></View>
        <TouchableOpacity style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Foto toevoegen</Text></TouchableOpacity>
      </View>

      {/* Persoonlijke Records Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Persoonlijke Records (PR&apos;s)</Text>
        <View style={styles.emptyState}><Text style={styles.emptyText}>Nog geen records. Log je eerste workout om te beginnen.</Text></View>
      </View>

      {/* Achievements / Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.badgeCard}><Text>🏅</Text><Text style={styles.badgeLabel}>Eerste workout</Text></View>
          <View style={styles.badgeCardLocked}><Text>🔒</Text><Text style={styles.badgeLabel}>7 dagen streak</Text></View>
        </ScrollView>
      </View>

      {/* Insights Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inzichten</Text>
        <View style={styles.insightCard}><Text style={styles.insightIcon}>💡</Text><Text style={styles.insightText}>Je beste week was week 12</Text></View>
        <TouchableOpacity style={styles.ctaBtnOutline}><Text style={styles.ctaBtnOutlineText}>Bekijk alle inzichten</Text></TouchableOpacity>
      </View>

      {/* Goals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doelen</Text>
        <View style={styles.goalCard}><Text style={styles.goalTitle}>Afvallen naar 78 kg</Text><View style={styles.goalBar}><View style={styles.goalBarFill} /></View><Text style={styles.goalSub}>60% voltooid · 12 dagen resterend</Text></View>
        <TouchableOpacity style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Doel toevoegen</Text></TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal visible={settingsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Pagina-instellingen</Text>
            <View style={styles.modalRow}><Text>Pagina vergrendelen</Text><Switch value={privacy.lock} onValueChange={v => setPrivacy(p => ({ ...p, lock: v }))} /></View>
            <View style={styles.modalRow}><Text>Toon gewicht</Text><Switch value={privacy.showWeight} onValueChange={v => setPrivacy(p => ({ ...p, showWeight: v }))} /></View>
            <View style={styles.modalRow}><Text>Toon calorieën</Text><Switch value={privacy.showCalories} onValueChange={v => setPrivacy(p => ({ ...p, showCalories: v }))} /></View>
            <View style={styles.modalRow}><Text>Toon voortgang foto&apos;s</Text><Switch value={privacy.showPhotos} onValueChange={v => setPrivacy(p => ({ ...p, showPhotos: v }))} /></View>
            <View style={styles.modalRow}><Text>Toon PR&apos;s</Text><Switch value={privacy.showPRs} onValueChange={v => setPrivacy(p => ({ ...p, showPRs: v }))} /></View>
            <View style={styles.modalRow}><Text>Toon achievements</Text><Switch value={privacy.showAchievements} onValueChange={v => setPrivacy(p => ({ ...p, showAchievements: v }))} /></View>
            <TouchableOpacity style={styles.ctaBtnOutline}><Text style={styles.ctaBtnOutlineText}>Exporteer data</Text></TouchableOpacity>
            <TouchableOpacity style={styles.ctaBtnOutline}><Text style={[styles.ctaBtnOutlineText, { color: '#EF4444' }]}>Verwijder alle data</Text></TouchableOpacity>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => setSettingsVisible(false)}><Text style={styles.ctaBtnText}>Sluiten</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles: modern, dark cards, blue accent, rounded, shadow
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
  displayName: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  memberSince: { color: '#64748B', fontSize: 13 },
  goalPill: { backgroundColor: '#E0E7FF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 4 },
  goalPillText: { color: '#2563EB', fontWeight: '600', fontSize: 12 },
  gearIcon: { fontSize: 24, color: '#64748B', marginLeft: 12 },
  summaryRow: { flexDirection: 'row', paddingVertical: 16, paddingLeft: 12, backgroundColor: 'transparent' },
  summaryCard: { width: 140, height: 120, borderRadius: 18, marginRight: 14, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  summaryIcon: { fontSize: 32, marginBottom: 6 },
  summaryValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  summaryLabel: { color: '#F1F5F9', fontWeight: '600', fontSize: 13 },
  summarySub: { color: '#CBD5E1', fontSize: 11 },
  summaryDeltaUp: { color: '#22C55E', fontWeight: 'bold', fontSize: 13 },
  summaryDeltaDown: { color: '#EF4444', fontWeight: 'bold', fontSize: 13 },
  section: { marginTop: 18, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 10 },
  chartCardEmpty: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, padding: 14, borderWidth: 0, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, alignItems: 'center', justifyContent: 'center' },
  chartTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  chartPlaceholder: { width: '100%', height: 100, backgroundColor: '#F1F5F9', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  chartPlaceholderText: { color: '#94A3B8' },
  chartValue: { fontSize: 18, fontWeight: 'bold', color: '#2563EB', marginBottom: 2 },
  chartDelta: { fontSize: 13, color: '#64748B' },
  emptyState: { alignItems: 'center', marginTop: 16, padding: 12 },
  emptyText: { color: '#64748B', textAlign: 'center', marginBottom: 8 },
  ctaBtn: { backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 28, marginTop: 8 },
  ctaBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  ctaBtnOutline: { borderWidth: 1, borderColor: '#2563EB', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 28, marginTop: 8 },
  ctaBtnOutlineText: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 },
  badgeCard: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginRight: 10, alignItems: 'center', minWidth: 80 },
  badgeCardLocked: { backgroundColor: '#F1F5F9', borderRadius: 14, padding: 12, marginRight: 10, alignItems: 'center', minWidth: 80, opacity: 0.5 },
  badgeLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  insightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  insightIcon: { fontSize: 20, marginRight: 10 },
  insightText: { color: '#0F172A', fontWeight: '600' },
  goalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  goalTitle: { fontWeight: 'bold', color: '#2563EB', fontSize: 15, marginBottom: 6 },
  goalBar: { height: 10, backgroundColor: '#E0E7FF', borderRadius: 5, marginVertical: 8, overflow: 'hidden' },
  goalBarFill: { width: '60%', height: '100%', backgroundColor: '#2563EB', borderRadius: 5 },
  goalSub: { color: '#64748B', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 18 },
  modalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  lockedOverlay: { flex: 1, backgroundColor: '#111827CC', alignItems: 'center', justifyContent: 'center' },
  lockedText: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 18 },
});
