import { ScrollView, View, Text, Switch , Pressable } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { DISCIPLINES } from './disciplines';

export default function DisciplineVisibilitySettingsScreen() {
  const { appSettings, updateAppSetting } = useAppContext();
  const theme = useTheme();
  const router = useRouter();

  const visibility = appSettings.disciplineVisibility || {};

  const handleToggle = (slug: string) => {
    updateAppSetting('disciplineVisibility', {
      ...visibility,
      [slug]: !visibility[slug],
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: 20 }}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="chevron-left" size={28} color={theme.titleColor} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.titleColor }}>Terug</Text>
      </Pressable>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: theme.titleColor }}>Discipline-knoppen</Text>
      <Text style={{ color: theme.subtitleColor, marginBottom: 18 }}>Zet de knoppen van disciplines aan of uit in de bibliotheek.</Text>
      {DISCIPLINES.map((d) => (
        <View key={d.slug} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <MaterialCommunityIcons name="eye-outline" size={22} color={theme.titleColor} style={{ marginRight: 12 }} />
          <Text style={{ flex: 1, fontSize: 16, color: theme.titleColor }}>{d.title}</Text>
          <Switch
            value={visibility[d.slug] !== false}
            onValueChange={() => handleToggle(d.slug)}
            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      ))}
    </ScrollView>
  );
}