import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useEffect } from 'react';
import React from 'react';
import { getUnreadMessageCount } from '@/services/messages-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEMES } from '@/constants/themes';

const MIND_ACTIONS = [
  { key: 'start', title: 'Sessie', subtitle: 'Meditatie', icon: 'play-circle-outline' as const, route: '/(tabs)/mind' as any },
  { key: 'routine', title: 'Routine', subtitle: 'Schema maken', icon: 'calendar-clock' as const, route: '/(tabs)/mijn' as any },
  { key: 'search', title: 'Zoeken', subtitle: 'Vind sessies', icon: 'text-search' as const, route: '/(tabs)/mind' as any },
  { key: 'sessions', title: 'Sessies', subtitle: 'Historie', icon: 'history' as const, route: '/(tabs)/mijn' as any },
];

// Helper to get theme-aware quick action tokens
function getQuickActionTokens(activeThemeId: string) {
  const currentTheme = THEMES[activeThemeId as keyof typeof THEMES] || THEMES.classic;
  const isClassic = currentTheme.id === 'classic';
  const isForce = currentTheme.id === 'force';
  const isSahara = currentTheme.id === 'saharaDune';
  const isRetro = currentTheme.id === 'retroSport';
  const isZen = currentTheme.id === 'zenInk';
  const isSapphire = currentTheme.id === 'sapphire';
  const isRuby = currentTheme.id === 'ruby';
  const isCoral = currentTheme.id === 'coralBloom';
  const isMarble = currentTheme.id === 'marble';
  const isBordeauxVelvet = currentTheme.id === 'bordeauxVelvet';
  const isChampagneRose = currentTheme.id === 'champagneRose';
  const isIvoryGold = currentTheme.id === 'ivoryGold';
  const isMineralGreen = currentTheme.id === 'mineralGreen';
  const isObsidianGold = currentTheme.id === 'obsidianGold';

  // DAELY Classic Glow gradient for quick action cards
  const classicGlowGradient = isClassic
    ? ['#FFFFFF', '#F8FBFF', '#EFF6FF']
    : isForce
      ? currentTheme.gradients.aurora || ['#FFFFFF', '#FFF1F2', '#FFE4E6']
      : isSahara ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FDF8EF', '#F3E4CF'])
      : isRetro ? (currentTheme.gradients.aurora || ['#FFFDF7', '#F7F0E6', '#FBE3D0'])
      : isZen ? (currentTheme.gradients.aurora || ['#3D3D3D', '#4A4A4A', '#5A5A5A'])
      : isSapphire ? (currentTheme.gradients.aurora || ['#07111F', '#0C1220', '#162B4F'])
      : isRuby ? (currentTheme.gradients.aurora || ['#140607', '#240A10', '#3A1420'])
      : isCoral ? (currentTheme.gradients.aurora || ['#FFF7F3', '#FFEDE7', '#FFD6C9'])
      : isMarble ? (currentTheme.gradients.aurora || ['#FFFFFF', '#F7F7F5', '#ECEDEA'])
      : isBordeauxVelvet ? (currentTheme.gradients.aurora || ['#2A0D16', '#3A1220', '#4A1A2A'])
      : isChampagneRose ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FAF0EA', '#F5E7D8'])
      : isIvoryGold ? (currentTheme.gradients.aurora || ['#FFFFFF', '#FFF8E6', '#F5E7D0'])
      : isMineralGreen ? (currentTheme.gradients.aurora || ['#FFFFFF', '#EEF6F1', '#E0EDE4'])
      : isObsidianGold ? (currentTheme.gradients.aurora || ['#111111', '#181818', '#252525'])
      : ['#E8E6FF', '#D0CCFF', '#B8B4FF'];

  // Sapphire-specific shape tokens for quick actions
  const quickActionRadius = isSapphire ? (currentTheme.colors.shortcutRadius || 12) : 16;
  const quickActionIconRadius = isSapphire ? (currentTheme.colors.iconBubbleRadius || 12) : 14;
  const quickActionShadowOpacity = isSapphire ? 0.32 : 0.08;
  const quickActionShadowRadius = isSapphire ? 12 : 8;
  const quickActionShadowOffset = isSapphire ? { width: 0, height: 4 } : { width: 0, height: 2 };

  return {
    gradientColors: classicGlowGradient,
    iconColor: isClassic ? '#2563EB' : isForce ? '#DC2626' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? '#E5E7EB' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#4B5563' : '#4A3A8C',
    iconBubbleBg: isClassic ? 'rgba(219, 234, 254, 0.8)' : isForce ? 'rgba(254, 202, 202, 0.75)' : isSahara ? 'rgba(245, 230, 211, 0.75)' : isRetro ? 'rgba(255, 253, 247, 0.88)' : isZen ? 'rgba(255, 255, 255, 0.08)' : isSapphire ? 'rgba(59, 130, 246, 0.14)' : isRuby ? (currentTheme.colors.rubyIconBg || 'rgba(184, 50, 90, 0.14)') : isCoral ? (currentTheme.colors.coralIconBg || 'rgba(255, 177, 153, 0.24)') : isMarble ? (currentTheme.colors.marbleIconBg || 'rgba(255, 255, 255, 0.92)') : 'rgba(255, 255, 255, 0.7)',
    iconBubbleBorder: isClassic ? '#DBEAFE' : isForce ? '#FCA5A5' : isSahara ? '#E8D0B0' : isRetro ? '#E7C0A3' : isZen ? 'rgba(255, 255, 255, 0.14)' : isSapphire ? 'rgba(147, 197, 253, 0.24)' : isRuby ? (currentTheme.colors.rubyIconBorder || 'rgba(244, 167, 185, 0.24)') : isCoral ? (currentTheme.colors.coralIconBorder || 'rgba(249, 115, 107, 0.26)') : isMarble ? (currentTheme.colors.marbleIconBorder || 'rgba(107, 114, 128, 0.26)') : 'rgba(255, 255, 255, 0.9)',
    titleColor: isClassic ? '#0F172A' : isForce ? '#7F1D1D' : isSahara ? '#7A4E24' : isRetro ? '#1B2E6B' : isZen ? '#E5E7EB' : isSapphire ? '#EAF2FF' : isRuby ? '#FFE4EC' : isCoral ? '#7A2E2E' : isMarble ? '#111827' : '#1E1B4B',
    subtitleColor: isClassic ? '#475569' : isForce ? '#B91C1C' : isSahara ? '#9A6B3A' : isRetro ? '#B42318' : isZen ? '#B0B0B0' : isSapphire ? '#BFDBFE' : isRuby ? '#F4A7B9' : isCoral ? '#A95B5B' : isMarble ? '#4B5563' : '#4A3A8C',
    shadowColor: isClassic ? '#0EA5E9' : isForce ? '#EF4444' : isSahara ? '#C89B72' : isRetro ? '#1B2E6B' : isZen ? 'rgba(0, 0, 0, 0.45)' : isSapphire ? 'rgba(59, 130, 246, 0.24)' : isRuby ? (currentTheme.colors.rubyGlowShadow || 'rgba(184, 50, 90, 0.24)') : isCoral ? (currentTheme.colors.coralGlowShadow || 'rgba(249, 115, 107, 0.20)') : isMarble ? (currentTheme.colors.marbleGlowShadow || 'rgba(75, 85, 99, 0.18)') : '#6B5B95',
    // Sapphire shape tokens
    quickActionRadius,
    quickActionIconRadius,
    quickActionShadowOpacity,
    quickActionShadowRadius,
    quickActionShadowOffset,
  };
}

export default function MindScreen() {
  const theme = useTheme();
  const isCoral = theme.id === 'coralBloom';
  const router = useRouter();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const quickActionTokens = getQuickActionTokens(theme.id);
  const { shadowColor, quickActionRadius, quickActionIconRadius, quickActionShadowOpacity, quickActionShadowRadius, quickActionShadowOffset } = quickActionTokens;

  useEffect(() => {
    getUnreadMessageCount().then(setUnreadMessageCount);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUnreadMessageCount().then(setUnreadMessageCount);
    }, [])
  );

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <AppHeader
        title="Mind."
        subtitle="Sterke geest, sterk lichaam."
        onSettingsPress={() => router.push('/(tabs)/athlete')}
        showMessages
        unreadMessagesCount={unreadMessageCount}
        onMessagesPress={() => router.push('/messages')}
      />

      <View style={styles.quickActionsBlock}>
        <View style={styles.quickActionsRow}>
          {MIND_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [
                styles.quickActionButton,
                { shadowColor, borderRadius: quickActionRadius, shadowOpacity: quickActionShadowOpacity, shadowRadius: quickActionShadowRadius, shadowOffset: quickActionShadowOffset },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => router.push(action.route)}
            >
              <LinearGradient
                colors={quickActionTokens.gradientColors}
                start={isCoral ? { x: 0.2, y: 0 } : { x: 0, y: 0 }}
                end={isCoral ? { x: 0.8, y: 1 } : { x: 1, y: 1 }}
                style={[styles.quickActionButtonGradient, { borderRadius: quickActionRadius }]}
              >
                <View style={[styles.quickActionIconBubble, { backgroundColor: quickActionTokens.iconBubbleBg, borderColor: quickActionTokens.iconBubbleBorder, borderRadius: quickActionIconRadius }]}>
                  <MaterialCommunityIcons name={action.icon} size={20} color={quickActionTokens.iconColor} />
                </View>
                <View style={styles.quickActionTextWrap}>
                  <Text style={[styles.quickActionText, { color: quickActionTokens.titleColor }]}>{action.title}</Text>
                  <Text style={[styles.quickActionSubText, { color: quickActionTokens.subtitleColor }]}>{action.subtitle}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.quickActionsBlock}>
        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/prime')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Prime</Text>
              <Text style={styles.cardDescription}>Morning Activation</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

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
              <Text style={styles.cardDescription}>Focus en ontspanning</Text>
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
              <Text style={styles.cardDescription}>Mentale scherpte</Text>
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
              <Text style={styles.cardDescription}>Slapen en regeneratie</Text>
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
              <Text style={styles.cardDescription}>Focus, discipline en rust</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/sport-performance')}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardTitle}>Sport Performance</Text>
              <Text style={styles.cardDescription}>Training en wedstrijd</Text>
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
              <Text style={styles.cardDescription}>Stressreductie en balans</Text>
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
              <Text style={styles.cardDescription}>Ademfocus, visualisatie en meer</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/mind/category/moments')}
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
              <Text style={styles.cardTitle}>DAELY Moments</Text>
              <Text style={styles.cardDescription}>Korte resets van 1-5 min</Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
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
    marginBottom: 8,
    gap: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  quickActionButton: {
    width: '48.5%',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 64,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    minHeight: 64,
  },
  quickActionIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActionTextWrap: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  quickActionSubText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
