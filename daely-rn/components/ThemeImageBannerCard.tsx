import { StyleSheet, View, Pressable, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '@/constants/themes';

interface ThemeImageBannerCardProps {
  theme: AppTheme;
  isActive: boolean;
  onPress: () => void;
}

// Static asset mappings for themes that have image banners
const THEME_BANNER_IMAGES: Record<string, any> = {
  'force': require('@/assets/Thema\'s/force.png'),
  'pastelCalm': require('@/assets/Thema\'s/pastel_calm.png'),
  'retroSport': require('@/assets/Thema\'s/retro_sport.png'),
  'saharaDune': require('@/assets/Thema\'s/sahara_dune.png'),
  'zenInk': require('@/assets/Thema\'s/zen_ink.png'),
  'aurora': require('@/assets/Thema\'s/aurora.png'),
  'ruby': require('@/assets/Thema\'s/ruby.png'),
  'coralBloom': require('@/assets/Thema\'s/coral_bloom.png'),
  'marble': require('@/assets/Thema\'s/marble.png'),
  'sapphire': require('@/assets/Thema\'s/sapphire.png'),
  'purpleStorm': require('@/assets/Thema\'s/purple_storm.png'),
  'volcanicAsh': require('@/assets/Thema\'s/volcanic_ash.png'),
  'venom': require('@/assets/Thema\'s/venom.png'),
  'wave': require('@/assets/Thema\'s/wave.png'),
};

export function ThemeImageBannerCard({ theme, isActive, onPress }: ThemeImageBannerCardProps) {
  const bannerImage = THEME_BANNER_IMAGES[theme.id];

  // If no image exists for this theme, don't render anything
  // The caller should fall back to ThemePremiumBannerCard
  if (!bannerImage) {
    return null;
  }

  return (
    <Pressable
      style={[
        styles.card,
        isActive && styles.cardActive,
      ]}
      onPress={onPress}
    >
      <ImageBackground
        source={bannerImage}
        style={styles.imageBackground}
        resizeMode="stretch"
        imageStyle={styles.imageStyle}
      >
        {/* Selected state - check only, no large glow */}
        {isActive && (
          <View style={styles.selectedOverlay}>
            <View style={[styles.checkRing, { borderColor: theme.tabBarActive }]}>
              <View style={[styles.checkCircle, { backgroundColor: theme.tabBarActive }]}>
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1600 / 560,
    borderRadius: 32,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    transform: [{ scale: 1.01 }],
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 32,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 16,
  },
  checkRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});