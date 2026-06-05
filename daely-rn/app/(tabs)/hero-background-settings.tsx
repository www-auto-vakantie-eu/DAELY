import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import {
  HERO_BACKGROUND_STORAGE_KEY,
  HERO_BACKGROUND_OPTIONS,
  HeroBackgroundOptionId,
} from '@/constants/hero-background';

export default function HeroBackgroundSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [heroBackground, setHeroBackground] = useState<HeroBackgroundOptionId>('daelyClassic');

  useEffect(() => {
    AsyncStorage.getItem(HERO_BACKGROUND_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      const exists = HERO_BACKGROUND_OPTIONS.some((option) => option.id === stored);
      if (exists) {
        setHeroBackground(stored as HeroBackgroundOptionId);
      }
    });
  }, []);

  const handleSelect = (optionId: HeroBackgroundOptionId) => {
    setHeroBackground(optionId);
    AsyncStorage.setItem(HERO_BACKGROUND_STORAGE_KEY, optionId);
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Header met back button */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#0D0F1A" />
            <Text style={styles.backLabel}>Welkom terug achtergrond</Text>
          </Pressable>
        </View>
        <Text style={styles.pageSubtitle}>Kies je Today hero theme</Text>

        {/* Hero Background Picker */}
        <View style={styles.heroPickerCard}>
          <Text style={[styles.heroPickerTitle, { color: theme.titleColor }]}>Kies je thema</Text>
          <View style={styles.heroPickerGrid}>
            {HERO_BACKGROUND_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.heroPickerCardItem,
                  option.id === heroBackground ? styles.heroPickerCardItemActive : null,
                  option.disabled || option.locked ? styles.heroPickerCardItemDisabled : null,
                ]}
                disabled={option.disabled || option.locked}
                onPress={() => handleSelect(option.id)}
              >
                {option.source ? (
                  <ImageBackground source={option.source} resizeMode="cover" style={styles.heroPickerCardImage} imageStyle={styles.heroPickerCardImageStyle}>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.heroPickerCardOverlay}
                    >
                      {option.id === heroBackground && (
                        <View style={styles.heroPickerCardCheckmark}>
                          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
                        </View>
                      )}
                      <Text style={styles.heroPickerCardLabel}>{option.label}</Text>
                      {option.locked && option.unlockLabel && (
                        <Text style={styles.heroPickerCardUnlockLabel}>{option.unlockLabel}</Text>
                      )}
                    </LinearGradient>
                  </ImageBackground>
                ) : (
                  <View style={[styles.heroPickerCardFallback, { backgroundColor: theme.card }]}>
                    <LinearGradient
                      colors={['#1E293B', '#334155']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroPickerCardFallbackGradient}
                    >
                      {option.id === heroBackground && (
                        <View style={styles.heroPickerCardCheckmark}>
                          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
                        </View>
                      )}
                      <Text style={styles.heroPickerCardLabel}>{option.label}</Text>
                    </LinearGradient>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D0F1A',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  heroPickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroPickerCardItem: {
    width: '48%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  heroPickerCardItemActive: {
    borderColor: '#2563EB',
  },
  heroPickerCardItemDisabled: {
    opacity: 0.5,
  },
  heroPickerCardImage: {
    width: '100%',
    height: '100%',
  },
  heroPickerCardImageStyle: {
    borderRadius: 10,
  },
  heroPickerCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  heroPickerCardCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  heroPickerCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroPickerCardUnlockLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroPickerCardFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroPickerCardFallbackGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
});