import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// Placeholder components for visuals (replace with real chart/timeline libs)
const JourneyBar = () => <View style={styles.journeyBar}><Text style={styles.journeyBarText}>[Journey Bar]</Text></View>;
const ProgressBar = () => <View style={styles.progressBar}><View style={styles.progressFill} /></View>;
const CalendarHeatmap = () => <View style={styles.heatmap}><Text style={styles.heatmapText}>[Heatmap]</Text></View>;

export default function MyProgressScreen() {
  const [loading, setLoading] = useState(false);
  // TODO: fetch and display real data
  const isEmpty = true;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Mijn Progress</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nog geen voortgang</Text>
          <Text style={styles.emptyText}>Begin met het loggen van je doelen, mijlpalen of workouts om je reis te volgen!</Text>
          <TouchableOpacity style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Start met loggen</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={styles.sections}>
          {/* 1. Startpunt → Nu banner */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Startpunt → Nu</Text>
            <Text style={styles.sectionText}>Start: -- | Nu: --</Text>
            <JourneyBar />
          </View>
          {/* 2. Actief doel */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Actief doel</Text>
            <Text style={styles.sectionText}>Doel: --</Text>
            <ProgressBar />
            <Text style={styles.sectionText}>Nog -- dagen</Text>
          </View>
          {/* 3. Mijlpalen */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mijlpalen</Text>
            <Text style={styles.sectionText}>Nog geen mijlpalen</Text>
          </View>
          {/* 4. Consistentie streak */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Consistentie streak</Text>
            <Text style={styles.sectionText}>Huidige streak: -- dagen</Text>
            <Text style={styles.sectionText}>Beste streak: -- dagen</Text>
            <CalendarHeatmap />
          </View>
          {/* 5. Persoonlijke records */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Persoonlijke records</Text>
            <Text style={styles.sectionText}>Nog geen PR's</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerRow: { padding: 20, paddingBottom: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  sections: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2563EB', marginBottom: 6 },
  sectionText: { color: '#334155', marginBottom: 4 },
  journeyBar: { height: 24, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  journeyBarText: { color: '#64748B' },
  progressBar: { height: 12, backgroundColor: '#F1F5F9', borderRadius: 6, marginVertical: 8, overflow: 'hidden' },
  progressFill: { width: '40%', height: '100%', backgroundColor: '#10B981', borderRadius: 6 },
  heatmap: { height: 40, backgroundColor: '#F1F5F9', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  heatmapText: { color: '#64748B' },
  emptyState: { alignItems: 'center', marginTop: 60, padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  emptyText: { color: '#64748B', textAlign: 'center', marginBottom: 18 },
  ctaBtn: { backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 28 },
  ctaBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
