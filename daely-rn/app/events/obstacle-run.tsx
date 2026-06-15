import React from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import { AppScreen } from '@/components/AppScreen';
import SharedBottomNav from '@/components/SharedBottomNav';

export default function EventObstacleRunScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <View style={styles.outerContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <PageHeader
            title="Obstacle Run"
            onSettingsPress={() => router.push('/(tabs)/athlete')}
            onSearchPress={() => router.push('/nutrition/search')}
            onCartPress={() => router.push('/(tabs)/cart')}
          />

        <View style={styles.content}>
          <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="run" size={48} color="#F59E0B" />
            </View>
            <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Binnenkort beschikbaar</Text>
            <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
              DAELY Events komt binnenkort beschikbaar.
            </Text>
            <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
              Hier vind je straks events, challenges, voorbereiding en deelname-informatie.
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Binnenkort</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat is Obstacle Run?</Text>
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Obstacle Run is een avontuurlijke race met modder, water en uitdagende hindernissen. DAELY helpt je straks met obstacle techniek, krachttraining en uithoudingsschema&apos;s.
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat komt eraan?</Text>
            <View style={styles.bulletRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
              <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Obstacle techniek workshops</Text>
            </View>
            <View style={styles.bulletRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
              <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Kracht- en uithoudingstraining</Text>
            </View>
            <View style={styles.bulletRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
              <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Trainingsschema&apos;s per obstakel</Text>
            </View>
            <View style={styles.bulletRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
              <Text style={[styles.bulletText, { color: theme.subtitleColor }]}>Event deelname-informatie</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Voor wie?</Text>
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              Voor beginners en gevorderden die willen deelnemen aan obstacle races. DAELY biedt training op elk niveau.
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Hoe helpt DAELY?</Text>
            <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
              DAELY biedt specifieke obstacle training, voeding voor uithouding, hersteladvies en community support om je voor te bereiden op je obstacle run.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/tracker')}>
              <Text style={styles.secondaryButtonText}>Start training</Text>
            </Pressable>
            <Pressable
              style={[styles.tertiaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={() => router.push('/feedback')}
            >
              <Text style={[styles.tertiaryButtonText, { color: theme.titleColor }]}>Feedback geven</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="today" />
    </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  tertiaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 80,
  },
});