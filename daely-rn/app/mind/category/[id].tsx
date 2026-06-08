import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../../components/PageHeader';

export default function MindCategoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getCategoryName = (id: string | undefined): string => {
    if (!id) return 'Mind';
    const categoryNames: Record<string, string> = {
      breathing: 'Ademhaling',
      focus: 'Focus',
      recovery: 'Herstel',
      meditation: 'Meditatie',
      mindset: 'Mindset',
    };
    return categoryNames[id] || 'Mind';
  };

  const categoryName = getCategoryName(categoryId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title={categoryName}
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onSearchPress={() => router.push('/nutrition/search')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.content}>
        {categoryId === 'mindset' ? (
          <>
            <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.introTitle, { color: theme.titleColor }]}>Over Mindset</Text>
              <Text style={[styles.introText, { color: theme.subtitleColor }]}>
                Jouw mindset is de basis voor alles wat je doet. Het bepaalt hoe je omgaat met uitdagingen, hoe je jouw doelen nastreeft en hoe je terugkomt na tegenslagen.
              </Text>
            </View>

            <View style={[styles.themesCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.themesTitle, { color: theme.titleColor }]}>Themas</Text>
              <View style={styles.themeItem}>
                <View style={[styles.themeDot, { backgroundColor: '#2563EB' }]} />
                <Text style={[styles.themeText, { color: theme.subtitleColor }]}>Focus</Text>
              </View>
              <View style={styles.themeItem}>
                <View style={[styles.themeDot, { backgroundColor: '#059669' }]} />
                <Text style={[styles.themeText, { color: theme.subtitleColor }]}>Discipline</Text>
              </View>
              <View style={styles.themeItem}>
                <View style={[styles.themeDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[styles.themeText, { color: theme.subtitleColor }]}>Zelfvertrouwen</Text>
              </View>
              <View style={styles.themeItem}>
                <View style={[styles.themeDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={[styles.themeText, { color: theme.subtitleColor }]}>Rust</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="meditation" size={48} color="#8B5CF6" />
              </View>
              <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Binnenkort beschikbaar</Text>
              <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
                Oefeningen in deze categorie worden later toegevoegd.
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Binnenkort</Text>
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Wat kun je verwachten?</Text>
              <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
                In deze categorie vind je straks oefeningen en routines die je helpen om je mentale gezondheid te verbeteren.
              </Text>
            </View>
          </>
        )}

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/mind')}>
            <Text style={styles.primaryButtonText}>Terug naar Mind</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => router.push('/feedback')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.titleColor }]}>Feedback geven</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
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
  introCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
  },
  themesCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  themesTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  themeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
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
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 80,
  },
});