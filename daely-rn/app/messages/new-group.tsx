import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import AppHeader from '../components/AppHeader';
import SharedBottomNav from '@/components/SharedBottomNav';
import { createGroup, type GroupType } from '@/services/messages-storage';

const GROUP_TYPES: { value: GroupType; label: string }[] = [
  { value: 'community', label: 'Community' },
  { value: 'coach', label: 'Coach' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'support', label: 'Support' },
  { value: 'discipline', label: 'Discipline' },
];

export default function NewGroupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState<GroupType>('community');
  const [description, setDescription] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateGroup() {
    if (!groupName.trim()) {
      return;
    }

    setIsLoading(true);
    const newGroup = await createGroup(
      groupName.trim(),
      selectedGroupType,
      description.trim() || undefined,
      discipline.trim() || undefined
    );

    setIsLoading(false);

    if (newGroup) {
      router.push(`/messages/${newGroup.id}` as Href);
    }
  }

  return (
    <AppScreen style={{ backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader
          title="Nieuwe groep"
          subtitle="Maak een nieuwe groepschat"
          onSettingsPress={() => router.push('/(tabs)/athlete')}
          onCartPress={() => router.push('/(tabs)/cart')}
        />

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.titleColor }]}>Groepsnaam *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Voer een groepsnaam in"
            placeholderTextColor={theme.subtitleColor}
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={[styles.label, { color: theme.titleColor }]}>Groepstype *</Text>
          <View style={styles.groupTypeGrid}>
            {GROUP_TYPES.map((type) => (
              <Pressable
                key={type.value}
                style={[
                  styles.groupTypeCard,
                  selectedGroupType === type.value && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                onPress={() => setSelectedGroupType(type.value)}
              >
                <Text
                  style={[
                    styles.groupTypeText,
                    selectedGroupType === type.value ? { color: '#FFFFFF' } : { color: theme.titleColor },
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.titleColor }]}>Beschrijving (optioneel)</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Voer een beschrijving in"
            placeholderTextColor={theme.subtitleColor}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: theme.titleColor }]}>Discipline (optioneel)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.titleColor }]}
            placeholder="Bijv. hardlopen, fitness, mind"
            placeholderTextColor={theme.subtitleColor}
            value={discipline}
            onChangeText={setDiscipline}
          />

          <Pressable
            style={[styles.createButton, { backgroundColor: '#2563EB' }, (!groupName.trim() || isLoading) && { opacity: 0.5 }]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Aanmaken...' : 'Groep aanmaken'}
            </Text>
          </Pressable>
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
  form: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  groupTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupTypeCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  groupTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 100,
  },
});