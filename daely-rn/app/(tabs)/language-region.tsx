import { StyleSheet, ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';

type Option = 'nl' | 'en' | 'metric' | 'imperial' | 'maandag' | 'zondag' | 'NL' | 'FR' | 'BE' | 'DE' | 'ES' | 'GB' | 'US';

const COUNTRY_OPTIONS: { code: 'NL' | 'FR' | 'BE' | 'DE' | 'ES' | 'GB' | 'US'; label: string; flag: string }[] = [
  { code: 'NL', label: 'Nederland', flag: 'NL' },
  { code: 'FR', label: 'Frankrijk', flag: 'FR' },
  { code: 'BE', label: 'Belgie', flag: 'BE' },
  { code: 'DE', label: 'Duitsland', flag: 'DE' },
  { code: 'ES', label: 'Spanje', flag: 'ES' },
  { code: 'GB', label: 'Verenigd Koninkrijk', flag: 'GB' },
  { code: 'US', label: 'Verenigde Staten', flag: 'US' },
];

export default function LanguageRegionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSetting } = useAppContext();
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [regionQuery, setRegionQuery] = useState('');

  const selectedCountry = COUNTRY_OPTIONS.find((country) => country.code === appSettings.accountCountry);
  const filteredCountries = useMemo(() => {
    const query = regionQuery.trim().toLowerCase();
    if (!query) return COUNTRY_OPTIONS;
    return COUNTRY_OPTIONS.filter(
      (country) =>
        country.label.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [regionQuery]);

  const renderChoice = (value: Option, selected: Option, onSelect: (v: Option) => void, label: string) => (
    <Pressable style={styles.row} onPress={() => onSelect(value)}>
      <Text style={styles.label}>{label}</Text>
      {selected === value ? <MaterialCommunityIcons name="check-circle" size={20} color="#2563EB" /> : <MaterialCommunityIcons name="circle-outline" size={20} color="#9CA3AF" />}
    </Pressable>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color="#0D0F1A" />
            <Text style={styles.backLabel}>Taal & Regio</Text>
          </Pressable>
          <Text style={styles.pageSubtitle}>Bepaal taal, land, meeteenheden en de start van je week.</Text>
        </View>

        <Text style={styles.sectionLabel}>APP-TAAL</Text>
        <View style={styles.section}>
          {renderChoice('nl', appSettings.appLanguage, (v) => updateAppSetting('appLanguage', v as 'nl' | 'en'), 'Nederlands')}
          <View style={styles.separator} />
          {renderChoice('en', appSettings.appLanguage, (v) => updateAppSetting('appLanguage', v as 'nl' | 'en'), 'English')}
        </View>

        <Text style={styles.sectionLabel}>ACCOUNTLAND</Text>
        <View style={styles.countrySection}>
          <Pressable
            style={styles.regionButton}
            onPress={() => setIsRegionMenuOpen((prev) => !prev)}
          >
            <View style={styles.regionButtonLeft}>
              <Text style={styles.regionButtonLabel}>Regio</Text>
              <Text style={styles.regionButtonValue}>
                {selectedCountry ? `${selectedCountry.label} (${selectedCountry.code})` : 'Selecteer land'}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={isRegionMenuOpen ? 'chevron-up' : 'chevron-down'}
              size={22}
              color="#6B7280"
            />
          </Pressable>

          {isRegionMenuOpen ? (
            <View style={styles.regionDropdown}>
              <View style={styles.searchWrap}>
                <MaterialCommunityIcons name="magnify" size={18} color="#9CA3AF" />
                <TextInput
                  value={regionQuery}
                  onChangeText={setRegionQuery}
                  placeholder="Zoek land..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.searchInput}
                />
              </View>

              {filteredCountries.map((country, index) => {
                const selected = appSettings.accountCountry === country.code;
                return (
                  <Pressable
                    key={country.code}
                    style={styles.regionRow}
                    onPress={() => {
                      updateAppSetting('accountCountry', country.code);
                      setIsRegionMenuOpen(false);
                      setRegionQuery('');
                    }}
                  >
                    <View style={styles.regionRowLeft}>
                      <Text style={styles.regionFlag}>{country.flag}</Text>
                      <Text style={styles.regionName}>{country.label}</Text>
                    </View>
                    {selected ? <MaterialCommunityIcons name="check-circle" size={18} color="#2563EB" /> : null}
                    {index < filteredCountries.length - 1 ? <View style={styles.regionSeparator} /> : null}
                  </Pressable>
                );
              })}
              {filteredCountries.length === 0 ? (
                <Text style={styles.noResultsText}>Geen landen gevonden.</Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>EENHEDEN</Text>
        <View style={styles.section}>
          {renderChoice('metric', appSettings.units, (v) => updateAppSetting('units', v as 'metric' | 'imperial'), 'Metrisch (kg, km)')}
          <View style={styles.separator} />
          {renderChoice('imperial', appSettings.units, (v) => updateAppSetting('units', v as 'metric' | 'imperial'), 'Imperiaal (lbs, miles)')}
        </View>

        <Text style={styles.sectionLabel}>EERSTE DAG VAN DE WEEK</Text>
        <View style={styles.section}>
          {renderChoice('maandag', appSettings.weekStart, (v) => updateAppSetting('weekStart', v as 'maandag' | 'zondag'), 'Maandag')}
          <View style={styles.separator} />
          {renderChoice('zondag', appSettings.weekStart, (v) => updateAppSetting('weekStart', v as 'maandag' | 'zondag'), 'Zondag')}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F2F4' },
  content: { padding: 16 },
  headerRow: { marginBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  backLabel: { fontSize: 18, fontWeight: '700', color: '#0D0F1A' },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#6B7280', paddingLeft: 4, lineHeight: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: '#9CA3AF', marginBottom: 10, marginLeft: 4 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: 20 },
  countrySection: {
    marginBottom: 20,
  },
  regionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionButtonLeft: {
    flex: 1,
  },
  regionButtonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  regionButtonValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  regionDropdown: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  searchWrap: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  regionRow: {
    paddingHorizontal: 12,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regionFlag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    width: 26,
  },
  regionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  regionSeparator: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  noResultsText: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  label: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 16 },
  bottomSpacer: { height: 120 },
});