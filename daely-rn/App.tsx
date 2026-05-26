import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import OnboardingModal from './components/OnboardingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('onboardingSeen');
      if (!seen) setShowOnboarding(true);
    })();
  }, []);

  const handleClose = async () => {
    setShowOnboarding(false);
    await AsyncStorage.setItem('onboardingSeen', 'true');
  };

  return (
    <>
      <Stack />
      <OnboardingModal visible={showOnboarding} onClose={handleClose} />
    </>
  );
}
