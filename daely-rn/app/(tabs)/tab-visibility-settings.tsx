import { StyleSheet, ScrollView, View, Text, Switch, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

type TabOption = {
  key: 'today' | 'profile' | 'disciplines' | 'nutrition' | 'mind' | 'community' | 'feed' | 'progress';
  label: string;
  icon: string;
  description: string;
  locked?: boolean;
};

export default function TabVisibilitySettings() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();

  const tabs: TabOption[] = [
    { key: 'today', label: 'Vandaag', icon: 'calendar-today', description: 'Toon Vandaag tab' },
    { key: 'profile', label: 'Mijn', icon: 'account', description: 'Toon Mijn profiel tab' },
    { key: 'disciplines', label: 'Bibliotheek', icon: 'dumbbell', description: 'Toon Bibliotheek tab' },
    { key: 'nutrition', label: 'Voeding', icon: 'silverware-fork-knife', description: 'Toon Voeding tab' },
    { key: 'mind', label: 'Geest', icon: 'meditation', description: 'Toon Geest tab' },
    { key: 'progress', label: 'Mijn Progress', icon: 'chart-bar', description: 'Toon Mijn Progress tab' },
    { key: 'community', label: 'Community', icon: 'account-multiple', description: 'Altijd zichtbaar als hoofdtab', locked: true },
  ];

  const communityOptions: TabOption[] = [
    { key: 'feed', label: 'Feed', icon: 'newspaper', description: 'Extra feed binnen Community' },
  ];

  const handleTabToggle = (tabKey: string, value: boolean) => {
    if (tabKey === 'community') {
      return;
    }

    updateAppSetting('tabVisibility', {
      ...appSettings.tabVisibility,
      [tabKey]: value,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={theme.titleColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.titleColor }]}>Tab Zichtbaarheid</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={[styles.pageSubtitle, { color: theme.subtitleColor }]}>
          Kies welke tabs onderin de menubalk zichtbaar zijn.
        </Text>

        {/* Tab Toggles */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {tabs.map((tab, index) => (
            <View key={tab.key}>
              <View
                style={[
                  styles.tabRow,
                  tab.locked ? styles.tabRowLocked : null,
                ]}
              >
                <View
                  style={[
                    styles.tabIcon,
                    tab.locked ? styles.tabIconLocked : null,
                  ]}
                >
                  <MaterialCommunityIcons name={tab.icon as any} size={22} color={theme.titleColor} />
                </View>
                <View style={styles.tabContent}>
                  <View style={styles.tabLabelRow}>
                    <Text style={[styles.tabLabel, { color: theme.titleColor }]}>{tab.label}</Text>
                    {tab.locked ? (
                      <View style={styles.lockBadge}>
                        <MaterialCommunityIcons name="lock-outline" size={12} color="#374151" />
                        <Text style={styles.lockBadgeText}>Vast</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.tabDescription, { color: theme.subtitleColor }]}>
                    {tab.description}
                  </Text>
                </View>
                <Switch
                  value={appSettings.tabVisibility?.[tab.key as keyof typeof appSettings.tabVisibility] ?? true}
                  onValueChange={(value) => handleTabToggle(tab.key, value)}
                  disabled={tab.locked === true}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              {index < tabs.length - 1 && <View style={[styles.separator, { borderColor: theme.border }]} />}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.subtitleColor }]}>BINNEN COMMUNITY</Text>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {communityOptions.map((tab, index) => (
            <View key={tab.key}>
              <View style={[styles.tabRow, styles.tabRowNested]}>
                <View style={[styles.tabIcon, styles.tabIconNested]}>
                  <MaterialCommunityIcons name={tab.icon as any} size={22} color={theme.titleColor} />
                </View>
                <View style={styles.tabContent}>
                  <Text style={[styles.tabLabel, { color: theme.titleColor }]}>{tab.label}</Text>
                  <Text style={[styles.tabDescription, { color: theme.subtitleColor }]}>
                    {tab.description}
                  </Text>
                </View>
                <Switch
                  value={appSettings.tabVisibility?.[tab.key as keyof typeof appSettings.tabVisibility] ?? true}
                  onValueChange={(value) => handleTabToggle(tab.key, value)}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              {index < communityOptions.length - 1 && <View style={[styles.separator, { borderColor: theme.border }]} />}
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: `${theme.titleColor}08`, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={theme.titleColor} />
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
            Community blijft altijd zichtbaar. Feed is een extra onderdeel binnen Community en staat los van de hoofdtab.
          </Text>
        </View>

        {/* Reset Button */}
        <Pressable
          style={[styles.resetButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {
            const allTabsVisible = {
              today: true,
              profile: true,
              disciplines: true,
              nutrition: true,
              mind: true,
              community: true,
              feed: true,
            };
            updateAppSetting('tabVisibility', allTabsVisible);
          }}
        >
          <MaterialCommunityIcons name="refresh" size={18} color={theme.titleColor} />
          <Text style={[styles.resetButtonText, { color: theme.titleColor }]}>Alles terugzetten naar standaard</Text>
        </Pressable>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  section: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  tabRowLocked: {
    opacity: 0.7,
  },
  tabRowNested: {
    paddingLeft: 30,
  },
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconLocked: {
    backgroundColor: '#E5E7EB',
  },
  tabIconNested: {
    backgroundColor: '#EDE9FE',
  },
  tabContent: {
    flex: 1,
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  tabDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
