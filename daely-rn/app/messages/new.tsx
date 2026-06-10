import React from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import SharedBottomNav from '@/components/SharedBottomNav';
import {
  createDirectThread,
  createSupportThread,
  createCoachThread,
  type MessageThread,
} from '@/services/messages-storage';

type ContactType = 'support' | 'coach' | 'sporter' | 'group';

interface ContactOption {
  id: string;
  type: ContactType;
  name: string;
  role?: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}

const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: 'support',
    type: 'support',
    name: 'DAELY Klantenmanager',
    role: 'Support Team',
    icon: 'headset',
    color: '#F59E0B',
  },
  {
    id: 'coach-strength',
    type: 'coach',
    name: 'Coach: Krachttraining',
    role: 'Personal Coach',
    icon: 'dumbbell',
    color: '#2563EB',
  },
  {
    id: 'coach-mobility',
    type: 'coach',
    name: 'Coach: Mobiliteit',
    role: 'Personal Coach',
    icon: 'human-handsdown',
    color: '#2563EB',
  },
  {
    id: 'sporter-1',
    type: 'sporter',
    name: 'Sarah',
    role: 'Sporter',
    icon: 'account',
    color: '#10B981',
  },
  {
    id: 'sporter-2',
    type: 'sporter',
    name: 'Mark',
    role: 'Sporter',
    icon: 'account',
    color: '#10B981',
  },
];

export default function NewMessageScreen() {
  const theme = useTheme();
  const router = useRouter();

  async function handleContactPress(contact: ContactOption) {
    let thread: MessageThread | null = null;

    switch (contact.type) {
      case 'support':
        thread = await createSupportThread();
        break;
      case 'coach':
        thread = await createCoachThread(contact.name, contact.role);
        break;
      case 'sporter':
        thread = await createDirectThread(contact.name, contact.role);
        break;
      case 'group':
        router.push('/messages/new-group' as Href);
        return;
    }

    if (thread) {
      router.push(`/messages/${thread.id}` as Href);
    }
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Nieuw bericht"
          subtitle="Kies een contact om mee te chatten"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Support</Text>
          <View style={styles.sectionContent}>
            {CONTACT_OPTIONS.filter((c) => c.type === 'support').map((contact) => (
              <Pressable
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleContactPress(contact)}
              >
                <View style={[styles.iconContainer, { backgroundColor: contact.color + '20' }]}>
                  <MaterialCommunityIcons name={contact.icon} size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.titleColor }]}>{contact.name}</Text>
                  {contact.role && <Text style={[styles.contactRole, { color: theme.subtitleColor }]}>{contact.role}</Text>}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Coaches</Text>
          <View style={styles.sectionContent}>
            {CONTACT_OPTIONS.filter((c) => c.type === 'coach').map((contact) => (
              <Pressable
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleContactPress(contact)}
              >
                <View style={[styles.iconContainer, { backgroundColor: contact.color + '20' }]}>
                  <MaterialCommunityIcons name={contact.icon} size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.titleColor }]}>{contact.name}</Text>
                  {contact.role && <Text style={[styles.contactRole, { color: theme.subtitleColor }]}>{contact.role}</Text>}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Sporters & Community</Text>
          <View style={styles.sectionContent}>
            {CONTACT_OPTIONS.filter((c) => c.type === 'sporter').map((contact) => (
              <Pressable
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleContactPress(contact)}
              >
                <View style={[styles.iconContainer, { backgroundColor: contact.color + '20' }]}>
                  <MaterialCommunityIcons name={contact.icon} size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.titleColor }]}>{contact.name}</Text>
                  {contact.role && <Text style={[styles.contactRole, { color: theme.subtitleColor }]}>{contact.role}</Text>}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Groepen</Text>
          <View style={styles.sectionContent}>
            <Pressable
              style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/messages/new-group' as Href)}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' + '20' }]}>
                <MaterialCommunityIcons name="account-group" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.titleColor }]}>Nieuwe groep maken</Text>
                <Text style={[styles.contactRole, { color: theme.subtitleColor }]}>Maak een groepschat</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <SharedBottomNav activeTab="mijn" />
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactRole: {
    fontSize: 14,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});