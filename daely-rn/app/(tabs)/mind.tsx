import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MIND_CATEGORIES } from '@/constants/mind-categories';
import PageHeader from '../components/PageHeader';
// ...existing code...

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function PulsingBadge({ accent, icon }: { accent: string; icon: string }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const opacity = pulse.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.55, 0.2, 0] });

  return (
    <View style={styles.badgeWrap}>
      <Animated.View
        style={[
          styles.pulseRing,
          { borderColor: hexToRgba(accent, 0.85), transform: [{ scale }], opacity },
        ]}
      />
      <View style={[styles.iconBadge, { backgroundColor: hexToRgba(accent, 0.28), borderColor: hexToRgba(accent, 0.9) }]}>
        <MaterialCommunityIcons name={icon as never} size={18} color="#FFFFFF" />
      </View>
    </View>
  );
}

export default function MindScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PageHeader
          title="Mind"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onSearchPress={() => router.push('/nutrition/search')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        {/* Tapping als categoriekaart */}
        <Pressable
          style={styles.cardWrap}
          onPress={() => router.push('/mind/tapping')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80' }}
            style={styles.card}
            imageStyle={styles.cardImage}
          >
            <View style={[styles.decorCircle1, { backgroundColor: hexToRgba('#F4A259', 0.22) }]} />
            <View style={[styles.decorCircle2, { backgroundColor: hexToRgba('#F4A259', 0.10), borderColor: hexToRgba('#F4A259', 0.28), borderWidth: 1.5 }]} />
            <View style={[styles.decorCircle3, { borderColor: hexToRgba('#F4A259', 0.18), borderWidth: 1 }]} />
            <LinearGradient
              colors={[hexToRgba('#F4A259', 0.12), hexToRgba('#F4A259', 0.48), 'rgba(0,0,0,0.82)']}
              style={styles.cardOverlay}
            >
              <PulsingBadge accent={'#F4A259'} icon={'hand-okay'} />
              <Text style={styles.cardTitle}>Tapping</Text>
              <Text style={styles.cardMeta}>Snelle stressreductie en emotionele balans via EFT.</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        {MIND_CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={styles.cardWrap}
            onPress={() => router.push({ pathname: '/mind/category/[id]', params: { id: category.id } })}
          >
            <ImageBackground source={{ uri: category.image }} style={styles.card} imageStyle={styles.cardImage}>
              <View style={[styles.decorCircle1, { backgroundColor: hexToRgba(category.accent, 0.22) }]} />
              <View style={[styles.decorCircle2, { backgroundColor: hexToRgba(category.accent, 0.10), borderColor: hexToRgba(category.accent, 0.28), borderWidth: 1.5 }]} />
              <View style={[styles.decorCircle3, { borderColor: hexToRgba(category.accent, 0.18), borderWidth: 1 }]} />
              <LinearGradient
                colors={[hexToRgba(category.accent, 0.12), hexToRgba(category.accent, 0.48), 'rgba(0,0,0,0.82)']}
                style={styles.cardOverlay}
              >
                <PulsingBadge accent={category.accent} icon={category.icon} />
                <Text style={styles.cardTitle}>{category.name}</Text>
                <Text style={styles.cardMeta}>{category.description}</Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 68,
    lineHeight: 72,
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  settingsPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  settingsPillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  cardWrap: {
    marginBottom: 16,
  },
  card: {
    height: 290,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 40,
  },
  cardOverlay: {
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 70,
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  decorCircle2: {
    position: 'absolute',
    top: 30,
    right: 50,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  decorCircle3: {
    position: 'absolute',
    bottom: 60,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
  },
  iconBadge: {
    borderWidth: 1,
    borderRadius: 999,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    letterSpacing: -1.2,
    fontWeight: '900',
    fontSize: 40,
    lineHeight: 42,
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    letterSpacing: 0.2,
    fontWeight: '600',
    marginTop: 10,
  },
  bottomSpacer: { height: 120 },
});
