import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import PageHeader from '../components/PageHeader';

export default function MindScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Mind"
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="meditation" size={48} color="#8B5CF6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.titleColor }]}>Mind komt binnenkort naar DAELY.</Text>
          <Text style={[styles.heroText, { color: theme.subtitleColor }]}>
            Hier vind je straks ademhaling, focus, herstel en mentale routines.
          </Text>
        </View>

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
              <MaterialCommunityIcons name="weather-windy" size={32} color="#fff" />
              <Text style={styles.cardTitle}>Ademhaling</Text>
              <Text style={styles.cardDescription}>Ademhalingsoefeningen voor focus en ontspanning</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Binnenkort</Text>
              </View>
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
              <MaterialCommunityIcons name="brain" size={32} color="#fff" />
              <Text style={styles.cardTitle}>Focus</Text>
              <Text style={styles.cardDescription}>Focusoefeningen voor mentale scherpte</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Binnenkort</Text>
              </View>
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
              <MaterialCommunityIcons name="hand-okay" size={32} color="#fff" />
              <Text style={styles.cardTitle}>Tapping</Text>
              <Text style={styles.cardDescription}>Tapping-sessies voor stressreductie en emotionele balans</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Binnenkort</Text>
              </View>
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
              <MaterialCommunityIcons name="battery-charging" size={32} color="#fff" />
              <Text style={styles.cardTitle}>Herstel</Text>
              <Text style={styles.cardDescription}>Herstelroutines voor beter slapen en regeneratie</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Binnenkort</Text>
              </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
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