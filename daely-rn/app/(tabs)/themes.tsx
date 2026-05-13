import { StyleSheet, View, Text, Pressable, Image, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;

export default function ThemasScreen() {
  const router = useRouter();
  const { activeThemeId, setActiveThemeId } = useAppContext();
  const theme = useTheme();
  const isClassicActive = activeThemeId === 'classic';
  const isZenInkActive = activeThemeId === 'zen-ink';
  const isForestBreathActive = activeThemeId === 'forest-breath';
  const isForceActive = activeThemeId === 'force';
  const isPureLuxuryActive = activeThemeId === 'pure-luxury';
  const isInnovationActive = activeThemeId === 'innovation';
  const isPastelCalmActive = activeThemeId === 'pastel-calm';
  const isRetroSportActive = activeThemeId === 'retro-sport';
  const isPulseActive = activeThemeId === 'pulse';
  const isDuneActive = activeThemeId === 'dune';
  const isEmberActive = activeThemeId === 'ember';

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.titleColor} />
          <Text style={[styles.backLabel, { color: theme.titleColor }]}>Instellingen</Text>
        </Pressable>

        <Text style={[styles.pageTitle, { color: theme.titleColor }]}>Thema&apos;s</Text>
        <Text style={[styles.pageSubtitle, { color: theme.subtitleColor }]}>KIES JE STIJL</Text>
        <View style={[styles.infoBanner, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <MaterialCommunityIcons name="palette-outline" size={16} color={theme.subtitleColor} />
          <Text style={[styles.infoBannerText, { color: theme.subtitleColor }]}>Logo op inlogpagina verandert direct. Telefoon-appicoon volgt bij een nieuwe app-build.</Text>
        </View>

        {/* AURA CLASSIC card */}
        <Pressable
          style={[styles.themeCard, isClassicActive && styles.themeCardActive]}
          onPress={() => setActiveThemeId('classic')}
        >
          {isClassicActive && (
            <View style={styles.checkBadge}>
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-classic.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <Text style={[styles.themeLabel, { color: isClassicActive ? '#FFFFFF' : theme.titleColor }]}>AURA CLASSIC</Text>
        </Pressable>

        {/* ZEN INK card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardDark, styles.themeCardZenInk, isZenInkActive && styles.themeCardActiveZenInk]}
          onPress={() => setActiveThemeId('zen-ink')}
        >
          {isZenInkActive && (
            <View style={styles.checkBadgeZenInk}>
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-zen.ink.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
          {/* Inky overlay for Zen Ink */}
          <View style={styles.zenInkOverlay} pointerEvents="none" />
          <Text style={styles.zenInkLabel}>ZEN INK</Text>
        </Pressable>

        {/* PURE LUXURY card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardLuxury, isPureLuxuryActive && styles.themeCardActiveLuxury]}
          onPress={() => setActiveThemeId('pure-luxury')}
        >
          {isPureLuxuryActive && (
            <View style={styles.checkBadgeLuxury}>
              <MaterialCommunityIcons name="check" size={14} color="#0D0D0D" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-pure-luxury.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
        </Pressable>

        {/* INNOVATION card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardInnovation, isInnovationActive && styles.themeCardActiveInnovation]}
          onPress={() => setActiveThemeId('innovation')}
        >
          {isInnovationActive && (
            <View style={styles.checkBadgeInnovation}>
              <MaterialCommunityIcons name="check" size={14} color="#0A0F1E" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-innovation.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
          {/* Mask over SPORT LAB text */}
          <View style={styles.innovationWordMask} />
          <Text style={styles.innovationWord}>INNOVATION</Text>
        </Pressable>

        {/* PASTEL CALM card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardPastel, isPastelCalmActive && styles.themeCardActivePastel]}
          onPress={() => setActiveThemeId('pastel-calm')}
        >
          {isPastelCalmActive && (
            <View style={styles.checkBadgePastel}>
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-pastel-calm.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
        </Pressable>

        {/* RETRO SPORT card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardRetro, isRetroSportActive && styles.themeCardActiveRetro]}
          onPress={() => setActiveThemeId('retro-sport')}
        >
          {isRetroSportActive && (
            <View style={styles.checkBadgeRetro}>
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-retro-sport.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
        </Pressable>

        {/* PULSE card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardPulse, isPulseActive && styles.themeCardActivePulse]}
          onPress={() => setActiveThemeId('pulse')}
        >
          {isPulseActive && (
            <View style={styles.checkBadgePulse}>
              <MaterialCommunityIcons name="check" size={14} color="#0A1A00" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-pulse.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
        </Pressable>

        {/* EMBER card (was ROGUE) */}
        <Pressable
          style={[styles.themeCard, styles.themeCardEmber, isEmberActive && styles.themeCardActiveEmber]}
          onPress={() => setActiveThemeId('ember')}
        >
          {isEmberActive && (
            <View style={styles.checkBadgeEmber}>
              <MaterialCommunityIcons name="check" size={14} color="#0A0500" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-ember.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <Text style={styles.rogueWord}>EMBER</Text>
        </Pressable>

        {/* SAHARA DUNE card */}
        <Pressable
          style={[styles.themeCard, styles.themeCardDune, isDuneActive && styles.themeCardActiveDune]}
          onPress={() => setActiveThemeId('dune')}
        >
          {isDuneActive && (
            <View style={styles.checkBadgeDune}>
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
          <Image
            source={require('@/assets/images/theme-dune.png')}
            style={styles.themeImage}
            resizeMode="cover"
          />
        </Pressable>

        {/* EMBER card verwijderd */}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EBF0F6',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 16,
  },
  backLabel: {
    fontSize: 16,
    color: '#0D0F1A',
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0D0F1A',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  pageSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6B7280',
  },
  infoBanner: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },

  /* ── Card ── */
  themeCard: {
    width: CARD_WIDTH,
    height: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#7BB8D4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  themeCardDark: {
    shadowColor: '#000000',
    shadowOpacity: 0.6,
  },
  themeCardForest: {
    shadowColor: '#4DAF70',
    shadowOpacity: 0.35,
  },
  themeCardForce: {
    shadowColor: '#DC2626',
    shadowOpacity: 0.42,
  },
  themeCardLuxury: {
    shadowColor: '#C9A84C',
    shadowOpacity: 0.55,
  },
  themeCardInnovation: {
    shadowColor: '#00F5A0',
    shadowOpacity: 0.45,
  },
  themeCardPastel: {
    shadowColor: '#9B8FD4',
    shadowOpacity: 0.40,
  },
  themeCardRetro: {
    shadowColor: '#1B2E6B',
    shadowOpacity: 0.30,
  },
  themeCardPulse: {
    shadowColor: '#7FFF00',
    shadowOpacity: 0.55,
  },
  themeCardRogue: {
    shadowColor: '#FF6A00',
    shadowOpacity: 0.60,
  },
  themeCardZenInk: {
    shadowColor: '#22223B',
    shadowOpacity: 0.55,
  },
  themeCardActiveZenInk: {
    borderColor: '#22223B',
  },
  themeCardActive: {
    borderColor: '#2563EB',
  },
  themeCardActiveLuxury: {
    borderColor: '#C9A84C',
  },
  themeCardActiveInnovation: {
    borderColor: '#00F5A0',
  },
  themeCardActivePastel: {
    borderColor: '#7B6CC8',
  },
  themeCardActiveRetro: {
    borderColor: '#1B2E6B',
  },
  themeCardActivePulse: {
    borderColor: '#7FFF00',
  },
  themeCardActiveRogue: {
    borderColor: '#FF6A00',
  },
  themeCardDune: {
    shadowColor: '#C89B72',
    shadowOpacity: 0.45,
  },
  themeCardActiveDune: {
    borderColor: '#C89B72',
  },
  checkBadgeDune: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C89B72',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  themeCardEmber: {
    shadowColor: '#FF6A00',
    shadowOpacity: 0.65,
  },
  themeCardActiveEmber: {
    borderColor: '#FF8C00',
  },
  checkBadgeEmber: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkBadgeRogue: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  rogueWordMask: {
    position: 'absolute',
    top: 44,
    left: 200,
    width: 340,
    height: 46,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 6, 0, 0.96)',
  },
  rogueWord: {
    position: 'absolute',
    top: 47,
    left: 205,
    fontSize: 26,
    fontWeight: '900',
    color: '#FFB347',
    letterSpacing: 2,
  },
  checkBadgePulse: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7FFF00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkBadgeRetro: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1B2E6B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkBadgeZenInk: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22223B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  zenInkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34,34,59,0.18)',
    borderRadius: 24,
    zIndex: 2,
  },
  zenInkLabel: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
    color: '#22223B',
    zIndex: 3,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  checkBadgePastel: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7B6CC8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkBadgeInnovation: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00F5A0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  innovationWordMask: {
    position: 'absolute',
    top: 52,
    left: 200,
    width: 280,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 25, 50, 0.92)',
  },
  innovationWord: {
    position: 'absolute',
    top: 53,
    left: 205,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  checkBadgeLuxury: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  themeImage: {
    width: '100%',
    height: '100%',
  },
  themeLabel: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  forceWordMask: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 165,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(236, 38, 55, 0.93)',
  },
  forceWord: {
    position: 'absolute',
    top: 53,
    left: 38,
    fontSize: 50,
    fontWeight: '900',
    color: '#FFD7C6',
    letterSpacing: 0.8,
  },
  blob1: {
    position: 'absolute',
    width: CARD_WIDTH * 0.65,
    height: 80,
    left: -20,
    top: 55,
    borderRadius: 999,
    backgroundColor: 'rgba(186, 220, 248, 0.35)',
  },
  blob2: {
    position: 'absolute',
    width: CARD_WIDTH * 0.55,
    height: 65,
    right: -10,
    top: 62,
    borderRadius: 999,
    backgroundColor: 'rgba(147, 198, 238, 0.28)',
  },
  blob3: {
    position: 'absolute',
    width: CARD_WIDTH + 40,
    height: 55,
    left: -20,
    bottom: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(210, 232, 250, 0.30)',
  },
  decoLines: {
    position: 'absolute',
    top: 18,
    left: 18,
    gap: 7,
  },
  decoLineLong: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFCFDA',
  },
  decoLineShort: {
    width: 26,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFCFDA',
  },
  themeLogo: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 72,
    height: 72,
  },
  themeName: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2E4A',
    letterSpacing: 0.2,
  },
  progressBg: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    right: 18,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#DDE6EE',
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    borderRadius: 3,
  },

  bottomSpacer: {
    height: 120,
  },
});
