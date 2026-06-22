import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { ThemeImageBannerCard } from '@/components/ThemeImageBannerCard';
import { THEMES } from '@/constants/themes';

export default function ThemasScreen() {
  const router = useRouter();
  const { activeThemeId, setActiveThemeId } = useAppContext();
  const theme = useTheme();

  const visibleThemes = [
    'classic',
    'force',
    'pastelCalm',
    'retroSport',
    'saharaDune',
    'zenInk',
    'aurora',
    'ruby',
    'coralBloom',
    'marble',
    'bordeauxVelvet',
    'champagneRose',
    'ivoryGold',
    'mineralGreen',
    'obsidianGold',
    'sapphire',
    'purpleStorm',
    'volcanicAsh',
    'venom',
    'wave',
  ] as const;

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

        {visibleThemes.map((themeId) => {
          const themeData = THEMES[themeId];
          if (!themeData) return null;

          return (
            <ThemeImageBannerCard
              key={themeId}
              theme={themeData}
              isActive={activeThemeId === themeId}
              onPress={() => setActiveThemeId(themeId)}
            />
          );
        })}

        <View style={styles.bottomSpacer} />
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
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  pageSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
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
  bottomSpacer: {
    height: 120,
  },
});
