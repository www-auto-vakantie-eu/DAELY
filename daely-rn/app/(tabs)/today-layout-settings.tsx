import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import AppHeader from '../components/AppHeader';
import { AppScreen } from '@/components/AppScreen';
import { TODAY_LAYOUT_OPTIONS, DEFAULT_TODAY_LAYOUT_ID } from '@/constants/today-layouts';

export default function TodayLayoutSettingsScreen() {
  const { appSettings, updateAppSetting } = useAppContext();
  const router = useRouter();
  const theme = useTheme();

  const currentLayoutId = appSettings.todayLayoutId || DEFAULT_TODAY_LAYOUT_ID;

  const handleSelectLayout = (layoutId: string) => {
    updateAppSetting('todayLayoutId', layoutId);
  };

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          title="Vandaag layout"
          onSettingsPress={() => router.back()}
        />

        <Text style={[styles.description, { color: theme.subtitleColor }]}>
          Kies welke indeling je standaard op je Vandaag-pagina wilt zien.
        </Text>

        <View style={styles.optionsContainer}>
          {TODAY_LAYOUT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.optionCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                currentLayoutId === option.id && styles.optionCardActive,
                { borderColor: currentLayoutId === option.id ? theme.colors.primary : theme.border },
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => handleSelectLayout(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={24}
                    color={currentLayoutId === option.id ? theme.colors.primary : theme.titleColor}
                  />
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: theme.titleColor }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDescription, { color: theme.subtitleColor }]}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                {currentLayoutId === option.id && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  optionCardActive: {
    borderWidth: 2,
  },
  optionCardPressed: {
    opacity: 0.8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});