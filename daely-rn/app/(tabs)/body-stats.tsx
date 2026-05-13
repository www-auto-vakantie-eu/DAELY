import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';

export default function BodyStatsScreen() {
  const { user, updateUser } = useAppContext();
  const [bodyStats, setBodyStats] = useState(user?.bodyStats || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({ ...user, bodyStats });
      Alert.alert('Opgeslagen', 'Je lichaamsgegevens zijn opgeslagen.');
    } catch (e) {
      Alert.alert('Fout', 'Er ging iets mis bij het opslaan.');
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lichaamsgegevens & progressie</Text>
      <TextInput
        style={styles.input}
        value={bodyStats}
        onChangeText={setBodyStats}
        placeholder="Bijvoorbeeld: lengte, gewicht, vetpercentage, progressie..."
        multiline
      />
      <Button title={saving ? 'Opslaan...' : 'Opslaan'} onPress={handleSave} disabled={saving} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
});
