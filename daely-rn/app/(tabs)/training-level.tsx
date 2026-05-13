import { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Platform } from 'react-native';
let Picker: typeof import('@react-native-picker/picker').Picker | undefined;
if (Platform.OS !== 'web') {
  Picker = require('@react-native-picker/picker').Picker;
}
import { useAppContext } from '@/contexts/AppContext';

const LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Gevorderd', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
];

export default function TrainingLevelScreen() {
  const { user, updateUser } = useAppContext();
  const [level, setLevel] = useState(user?.trainingLevel || 'beginner');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({ ...user, trainingLevel: level });
      Alert.alert('Opgeslagen', 'Je trainingsniveau is opgeslagen.');
    } catch (e) {
      Alert.alert('Fout', 'Er ging iets mis bij het opslaan.');
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wat is je trainingsniveau?</Text>
      {Platform.OS === 'web' ? (
        <Text style={{ color: 'gray', marginBottom: 20 }}>
          Trainingsniveau kiezen is alleen beschikbaar op mobiel. Gebruik de app op je telefoon om dit aan te passen.
        </Text>
      ) : (
        Picker && (
          <Picker
            selectedValue={level}
            onValueChange={setLevel}
            style={styles.picker}
          >
            {LEVELS.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        )
      )}
      <Button title={saving ? 'Opslaan...' : 'Opslaan'} onPress={handleSave} disabled={saving || Platform.OS === 'web'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  picker: {
    marginBottom: 20,
  },
});
