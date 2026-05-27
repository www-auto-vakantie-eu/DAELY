import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import { SPORT_DISCIPLINES } from '../../constants/sport-disciplines';

const SESSION_STATUS = {
  NOT_STARTED: 'Nog niet gestart',
  ACTIVE: 'Actief',
  PAUSED: 'Gepauzeerd',
  FINISHED: 'Afgerond',
} as const;

type SessionStatus = keyof typeof SESSION_STATUS;

export default function StartActivityScreen() {
  const { disciplineId } = useLocalSearchParams<{ disciplineId: string }>();
  const router = useRouter();
  const discipline = SPORT_DISCIPLINES.find(d => d.id === disciplineId);

  const [status, setStatus] = useState<SessionStatus>('NOT_STARTED');
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000) as unknown as number;
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = () => {
    setStatus('ACTIVE');
    startTimer();
  };
  const handlePause = () => {
    setStatus('PAUSED');
    stopTimer();
  };
  const handleResume = () => {
    setStatus('ACTIVE');
    startTimer();
  };
  const handleStop = () => {
    setStatus('FINISHED');
    stopTimer();
  };

  React.useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (!discipline) {
    return (
      <View style={styles.container}>
        <PageHeader title="Discipline niet gevonden" />
        <Text style={styles.fallback}>Deze discipline bestaat niet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title={`Start ${discipline.name}`} />
      <Text style={styles.meta}>{discipline.category} · {discipline.trackingType}</Text>
      <Text style={styles.status}>Status: {SESSION_STATUS[status]}</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <View style={styles.buttonRow}>
        {status === 'NOT_STARTED' && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        {status === 'ACTIVE' && (
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>Pauze</Text>
          </TouchableOpacity>
        )}
        {status === 'PAUSED' && (
          <TouchableOpacity style={styles.button} onPress={handleResume}>
            <Text style={styles.buttonText}>Hervatten</Text>
          </TouchableOpacity>
        )}
        {(status === 'ACTIVE' || status === 'PAUSED') && (
          <TouchableOpacity style={styles.button} onPress={handleStop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={[styles.button, styles.disabledButton]} disabled>
        <Text style={styles.buttonText}>Activiteit opslaan (binnenkort)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  fallback: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 32,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    marginTop: 12,
  },
});
