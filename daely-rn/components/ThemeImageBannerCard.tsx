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
  'force': require('@/assets/theme-banners/force-banner.png'),
  'forest-breath': require('@/assets/theme-banners/forest-breath-banner.png'),
  'innovation': require('@/assets/theme-banners/innovation-banner.png'),
  'pastel-calm': require('@/assets/theme-banners/pastel-calm-banner.png'),
  'pure-luxury': require('@/assets/theme-banners/pure-luxury-banner.png'),
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
        resizeMode="cover"
        imageStyle={styles.imageStyle}
      >
        {/* Selected state - check and glow */}
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

      {/* Selected ambient glow */}
      {isActive && (
        <View style={[styles.selectedGlow, { backgroundColor: theme.tabBarActive }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1600 / 560,
    borderRadius: 32,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    transform: [{ scale: 1.02 }],
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 34,
    opacity: 0.4,
  },
});