import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import { getActivities, updateActivity, Activity } from 'services/activity-storage';

export default function EditActivityScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getActivities().then((activities) => {
      const found = activities.find((item) => item.id === id) || null;
      setActivity(found);
      setNotes(found?.notes ?? '');
      setLoading(false);
    });
  }, [id]);

  const handleCancel = () => {
    if (!id) return;
    router.replace({ pathname: '/activities/[id]', params: { id } });
  };

  const handleSave = async () => {
    if (!activity) return;
    setSaving(true);
    const normalizedNotes = notes.trim();
    await updateActivity(activity.id, { notes: normalizedNotes.length > 0 ? normalizedNotes : undefined });
    setSaving(false);
    router.replace({ pathname: '/activities/[id]', params: { id: activity.id } });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <PageHeader title="Activiteit bewerken" />
        <ActivityIndicator size="small" color="#2563EB" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.centeredContainer}>
        <PageHeader title="Activiteit bewerken" />
        <Text style={styles.fallback}>Activiteit niet gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Activiteit bewerken" />

      <View style={styles.box}>
        <Text style={styles.label}>Discipline</Text>
        <Text style={styles.value}>{activity.disciplineName}</Text>

        <Text style={styles.label}>Tracking type</Text>
        <Text style={styles.value}>{activity.trackingType}</Text>

        <Text style={styles.label}>Duur</Text>
        <Text style={styles.value}>{formatDuration(activity.durationSeconds)}</Text>

        <Text style={styles.label}>Datum</Text>
        <Text style={styles.value}>{formatDate(activity.endedAt)}</Text>

        <Text style={styles.label}>Notities</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Voeg notities toe"
          multiline
          textAlignVertical="top"
          style={styles.notesInput}
        />
      </View>

      <TouchableOpacity style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Opslaan...' : 'Opslaan'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={saving}>
        <Text style={styles.cancelText}>Annuleren</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    justifyContent: 'center',
  },
  fallback: {
    marginTop: 20,
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  box: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  notesInput: {
    marginTop: 8,
    minHeight: 110,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  button: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },
});
