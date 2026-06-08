import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import PageHeader from '../components/PageHeader';

const MIND_ACTIONS = [
  { key: 'start', title: 'Sessie starten', subtitle: 'Kies een meditatie', route: '/(tabs)/mind' as any },
  { key: 'routine', title: 'Routine maken', subtitle: 'Bouw je schema', route: '/(tabs)/mijn' as any },
  { key: 'search', title: 'Mind zoeken', subtitle: 'Vind oefeningen', route: '/(tabs)/mind' as any },
  { key: 'sessions', title: 'Mijn sessies', subtitle: 'Geschiedenis', route: '/(tabs)/mijn' as any },
];

export default function MindScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Mind."
        subtitle="Sterke geest, sterk lichaam."
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.quickActionsBlock}>
        <View style={styles.quickActionsRow}>
          {MIND_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={[styles.quickActionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push(action.route)}
            >
              <View style={styles.quickActionTextWrap}>
                <Text style={[styles.quickActionText, { color: theme.titleColor }]}>{action.title}</Text>
                <Text style={[styles.quickActionSubText, { color: theme.subtitleColor }]}>{action.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/breathing')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Ademhaling</Text>
              <Text style={styles.cardDescription}>Ademhalingsoefeningen voor focus en ontspanning</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/focus')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Focus</Text>
              <Text style={styles.cardDescription}>Focusoefeningen voor mentale scherpte</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/tapping')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Tapping</Text>
              <Text style={styles.cardDescription}>Tapping-sessies voor stressreductie en emotionele balans</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/recovery')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Herstel</Text>
              <Text style={styles.cardDescription}>Herstelroutines voor beter slapen en regeneratie</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/mindset')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Mindset</Text>
              <Text style={styles.cardDescription}>Focus, discipline, zelfvertrouwen en rust</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/meditations')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Bekende meditaties</Text>
              <Text style={styles.cardDescription}>Ademfocus, visualisatie, dankbaarheid en meer</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/sleep')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1511296923631-18b8bbcebe34?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Slaap</Text>
              <Text style={styles.cardDescription}>Avondrust, ademhaling en nachtreset</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/mijn')}>
            <Text style={styles.primaryButtonText}>Terug naar Mijn</Text>
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
  card: {
    height: 210,
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.6,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
    fontWeight: '500',
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
  quickActionsBlock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  quickActionButton: {
    width: '48.5%',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  quickActionTextWrap: {
    flex: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickActionSubText: {
    fontSize: 11,
    fontWeight: '500',
  },
});