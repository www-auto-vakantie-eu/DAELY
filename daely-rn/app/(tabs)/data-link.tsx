import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import PageHeader from '../components/PageHeader';
import {
  CONNECTED_DEVICES,
  CONNECTED_DEVICE_STATUS_LABELS,
  type ConnectedDevice,
  type ConnectedDeviceStatus,
} from '../constants/connected-devices';

const SECTION_ORDER: ConnectedDeviceStatus[] = ['available', 'soon', 'optional_later'];

const SECTION_TITLE: Record<ConnectedDeviceStatus, string> = {
  available: 'Beschikbaar',
  soon: 'Binnenkort',
  optional_later: 'Later optioneel',
};

const BUTTON_LABEL: Record<ConnectedDeviceStatus, string> = {
  available: 'Voorbereid',
  soon: 'Binnenkort',
  optional_later: 'Later',
};

const SECTION_COPY: Record<ConnectedDeviceStatus, string | null> = {
  available: 'Koppel straks direct en verrijk je dagdata automatisch.',
  soon: 'Deze koppelingen komen binnenkort beschikbaar.',
  optional_later: 'Optioneel later voor import van bestaande activiteiten en routes.',
};

const DEVICE_BENEFITS: Record<string, string> = {
  whoop: 'Ideaal voor herstel, strain en slaapinzicht.',
  fitbit: 'Voor dagelijkse activiteit, slaap en hartslagtrends.',
  'apple-health': 'Voor iPhone dagdata en gezondheidsmetingen.',
  garmin: 'Voor training, belasting en sportprofielen.',
  'google-fit-health-connect': 'Voor Android activiteit en gezondheidsdata.',
  strava: 'Voor import van historische sessies en routes.',
  polar: 'Voor trainingsbelasting en herstelmetingen.',
  suunto: 'Voor outdoor activiteiten en routegegevens.',
  oura: 'Voor slaapkwaliteit, readiness en herstel.',
  coros: 'Voor running metrics en trainingsprogressie.',
};

export default function DataLinkScreen() {
  const theme = useTheme();

  const handleConnect = async (device: ConnectedDevice) => {
    if (device.id === 'whoop') {
      Alert.alert('WHOOP demo', 'Dit is een demo-koppeling. Echte WHOOP integratie komt binnenkort beschikbaar.');
    }

    if (device.id === 'fitbit') {
      Alert.alert('Fitbit demo', 'Dit is een demo-koppeling. Echte Fitbit integratie komt binnenkort beschikbaar.');
    }
  };

  const groupedDevices = useMemo(() => {
    const grouped: Record<ConnectedDeviceStatus, ConnectedDevice[]> = {
      available: [],
      soon: [],
      optional_later: [],
    };

    for (const device of CONNECTED_DEVICES) {
      grouped[device.status].push(device);
    }

    return grouped;
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PageHeader
        title="Data koppelen"
        showSettings={false}
        showSearch={false}
        showCart={false}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.introTitle, { color: theme.titleColor }]}>Data koppelen</Text>
          <Text style={[styles.introText, { color: theme.subtitleColor }]}>
            Koppel straks je wearables en sportapps om je activiteiten, herstel en dagelijkse data automatisch te verrijken.
          </Text>
          <Text style={[styles.introHint, { color: theme.subtitleColor }]}>Je data verschijnt daarna op Vandaag en Data.</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.titleColor }]}>Demo-modus</Text>
          <Text style={[styles.infoText, { color: theme.subtitleColor }]}>
            Echte koppelingen worden pas actief zodra de officiële integraties klaar zijn. WHOOP en Fitbit zijn voorbereid als demo-koppelingen.
          </Text>
        </View>

        {SECTION_ORDER.map((status) => (
          <View key={status} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{SECTION_TITLE[status]}</Text>
            {SECTION_COPY[status] ? (
              <Text style={[styles.sectionDescription, { color: theme.subtitleColor }]}>{SECTION_COPY[status]}</Text>
            ) : null}
            <View style={styles.cardList}>
              {groupedDevices[status].map((device) => {
                const isAvailable = device.status === 'available';
                const isSoon = device.status === 'soon';
                const cardVariant = isAvailable
                  ? styles.deviceCardAvailable
                  : isSoon
                    ? styles.deviceCardSoon
                    : styles.deviceCardOptional;

                return (
                  <View key={device.id} style={[styles.deviceCard, cardVariant, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.deviceHeaderRow}>
                      <Text style={[styles.deviceName, { color: theme.titleColor }]}>{device.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isAvailable ? styles.statusAvailable : styles.statusUpcoming,
                          status === 'optional_later' ? styles.statusOptional : null,
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>{CONNECTED_DEVICE_STATUS_LABELS[device.status]}</Text>
                      </View>
                    </View>
                    <Text style={[styles.deviceBenefit, { color: theme.subtitleColor }]}>
                      {DEVICE_BENEFITS[device.id] ?? 'Koppel dit apparaat om extra context aan je data toe te voegen.'}
                    </Text>
                    <View style={styles.chipRow}>
                      {device.dataPoints.map((point) => (
                        <View key={`${device.id}-${point}`} style={[styles.dataChip, { borderColor: theme.border }]}>
                          <Text style={[styles.dataChipText, { color: theme.subtitleColor }]}>{point}</Text>
                        </View>
                      ))}
                    </View>

                    <Pressable
                      style={[
                        styles.actionButton,
                        isAvailable ? styles.actionButtonPrimary : styles.actionButtonDisabled,
                      ]}
                      onPress={isAvailable ? () => void handleConnect(device) : undefined}
                      disabled={!isAvailable}
                    >
                      <Text style={styles.actionButtonText}>{BUTTON_LABEL[device.status]}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={[styles.usageCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.usageTitle, { color: theme.titleColor }]}>Waar wordt je data gebruikt?</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Vandaag: dagdata en herstel</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Data: voortgang en trends</Text>
          <Text style={[styles.usageItem, { color: theme.subtitleColor }]}>Activiteiten: verrijkte sessies</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  introCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
  },
  introHint: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  cardList: {
    gap: 12,
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 16,
  },
  deviceCardAvailable: {
    padding: 16,
    borderColor: '#BFDBFE',
  },
  deviceCardSoon: {
    padding: 12,
    opacity: 0.95,
  },
  deviceCardOptional: {
    padding: 14,
    opacity: 0.9,
  },
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusAvailable: {
    backgroundColor: '#DBEAFE',
  },
  statusUpcoming: {
    backgroundColor: '#E5E7EB',
  },
  statusOptional: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: '700',
  },
  deviceBenefit: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  chipRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F8FAFC',
  },
  dataChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  connectionHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 12,
    borderRadius: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#1D4ED8',
  },
  actionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  usageCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  usageItem: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
});
