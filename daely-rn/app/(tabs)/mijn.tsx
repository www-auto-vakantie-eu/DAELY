import {
  Alert,
  Dimensions,
  ImageBackground,
  return (
    <ScrollView style={styles.container}>
      <PageHeader title="Mijn" />
      <View style={styles.cardsContainer}>
        {MY_DOMAIN_CARDS.map((card) => (
          <Pressable
            key={card.id}
            style={[styles.card, card.disabled && styles.cardDisabled]}
            onPress={() => card.route && handleCardPress(card.route)}
            disabled={card.disabled}
          >
            <ImageBackground source={{ uri: card.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12 }}>
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)']}
                style={styles.cardGradient}
              />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: card.accent }]}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
                <Text style={styles.cardCategory}>{card.category}</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
        <Pressable
          style={[styles.card, { backgroundColor: '#2563EB' }]}
          onPress={() => handleCardPress('/activities')}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: '#fff' }]}>Activiteiten</Text>
            <Text style={[styles.cardDescription, { color: '#E0E7EF' }]}>Bekijk je opgeslagen activiteiten en details.</Text>
            <Text style={[styles.cardCategory, { color: '#93C5FD' }]}>TRACKER</Text>
          </View>
        </Pressable>
      </View>
  category: string;
  accent: string;
  image: string;
  route?: string;
  disabled?: boolean;
};

const MY_DOMAIN_CARDS: MyDomainCard[] = [
  {
    id: 'progress',
    title: 'Progressie',
    description: 'Statistieken en resultaten van al je sporten en disciplines.',
    category: 'PROGRESSIE',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    route: '/my-progress',
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Schema\'s, volume, progressie en volgende sessies.',
    category: 'TRAINING',
    accent: '#2563EB',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    route: '/workouts',
  },
  {
    id: 'nutrition',
    title: 'Voeding',
    description: 'Weekgemiddelden, macro\'s en adherence op doel.',
    category: 'VOEDING',
    accent: '#059669',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    route: '/my-nutrition',
  },
  {
    id: 'mind',
    title: 'Mind',
    description: 'Binnenkort beschikbaar op jouw Mijn-pagina.',
    category: 'MINDSET',
    accent: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    disabled: true,
  },
  {
    id: 'stats',
    title: 'Data',
    description: 'Overzicht van al je statistieken op een plek.',
    category: 'DATA',
    accent: '#10B981',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    route: '/my-stats',
  },
  {
    id: 'orders',
    title: 'My Orders',
    description: 'Bekijk je bestellingen, pakketten en aankopen.',
    category: 'ORDERS',
    accent: '#22C55E',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1200&q=80',
    route: '/my-orders',
  },
];

type FeedbackFormState = {
  overallSatisfaction: number;
  categoryRatings: {
    usability: number;
    navigation: number;
    speed: number;
    design: number;
  };
  mostUsedParts: string[];
  workoutLevel: '' | 'Te makkelijk' | 'Goed niveau' | 'Te zwaar';
  workoutFrustrations: string[];
  workoutFrustrationOther: string;
  helpsGoals: '' | 'Ja, veel' | 'Een beetje' | 'Nog niet' | 'Nee';
  motivationRating: number;
  missingFeatures: string[];
  firstImprove: string;
  bestThing: string;
};

const MOST_USED_PARTS_OPTIONS = [
  'Fitness',
  'Hardlopen',
  'Yoga / Mobiliteit',
  'Calisthenics / Hyrox',
  'Voeding',
  'Meditatie',
  'Challenges',
];

const WORKOUT_FRUSTRATION_OPTIONS = [
  'Onduidelijke uitleg',
  'Te weinig variatie',
  'Verkeerd niveau',
  'Mist oefeningen',
  'Onlogische opbouw',
  'Anders',
];

const MISSING_FEATURE_OPTIONS = [
  'Meer workouts',
  "Meer programma's",
  'Meer sporten',
  'Voeding',
  'Community',
  'Integraties (bijv. smartwatch)',
];

const INITIAL_FEEDBACK_FORM: FeedbackFormState = {
  overallSatisfaction: 0,
  categoryRatings: {
    usability: 0,
    navigation: 0,
    speed: 0,
    design: 0,
  },
  mostUsedParts: [],
  workoutLevel: '',
  workoutFrustrations: [],
  workoutFrustrationOther: '',
  helpsGoals: '',
  motivationRating: 0,
  missingFeatures: [],
  firstImprove: '',
  bestThing: '',
};

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { appSettings, updateAppSettings } = useAppContext();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormState>(INITIAL_FEEDBACK_FORM);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const canShowFeedbackButton = appSettings.feedbackSubmittedCount <= appSettings.referralYearSubscriptions;

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={8}>
          <MaterialCommunityIcons
            name={star <= value ? 'star' : 'star-outline'}
            size={24}
            color={star <= value ? '#F59E0B' : '#9CA3AF'}
          />
        </Pressable>
      ))}
    </View>
  );

  const handleFeedbackSubmit = async () => {
    if (feedbackForm.overallSatisfaction === 0) {
      Alert.alert('Nog niet compleet', 'Geef een score bij Hoe tevreden ben je over DAELY?.');
      return;
    }

    if (feedbackForm.firstImprove.trim().length === 0 || feedbackForm.bestThing.trim().length === 0) {
      Alert.alert('Nog niet compleet', 'Vul de twee open vragen bij Verbeteringen in.');
      return;
    }

    const payload = {
      formVersion: 'daely-feedback-v2',
      submittedAt: new Date().toISOString(),
      overallSatisfaction: feedbackForm.overallSatisfaction,
      usabilityRating: feedbackForm.categoryRatings.usability,
      navigationRating: feedbackForm.categoryRatings.navigation,
      speedRating: feedbackForm.categoryRatings.speed,
      designRating: feedbackForm.categoryRatings.design,
      mostUsedParts: feedbackForm.mostUsedParts.join(' | '),
      workoutLevel: feedbackForm.workoutLevel || 'Niet ingevuld',
      workoutFrustrations: feedbackForm.workoutFrustrations.join(' | '),
      workoutFrustrationOther: feedbackForm.workoutFrustrationOther.trim(),
      helpsGoals: feedbackForm.helpsGoals || 'Niet ingevuld',
      motivationRating: feedbackForm.motivationRating,
      missingFeatures: feedbackForm.missingFeatures.join(' | '),
      firstImprove: feedbackForm.firstImprove.trim(),
      bestThing: feedbackForm.bestThing.trim(),
      rawForm: JSON.stringify(feedbackForm),
    };

    try {
      setIsSubmittingFeedback(true);
      await submitSettingsRequest('feedback-form', payload);

      updateAppSettings({
        feedbackSubmittedCount: appSettings.feedbackSubmittedCount + 1,
      });

      setFeedbackForm(INITIAL_FEEDBACK_FORM);
      setFeedbackModalVisible(false);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch {
      Alert.alert('Verzenden mislukt', 'Er ging iets mis bij het opslaan van je feedback. Probeer opnieuw.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mijn"
          onSettingsPress={() => handleCardPress('/(tabs)/athlete')}
          onSearchPress={() => handleCardPress('/nutrition/search')}
          onCartPress={() => handleCardPress('/(tabs)/cart')}
        />
        <Pressable
          style={styles.startActivityButton}
          onPress={() => router.push('/tracker')}
        >
          <Text style={styles.startActivityText}>Start activiteit</Text>
        </Pressable>

        {/* Weekoverzicht Sterke week verwijderd */}

        {/* <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>MIJN DOMEINEN</Text> */}
        <View style={styles.cardsWrap}>
          {MY_DOMAIN_CARDS.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [
                styles.verticalCard,
                card.disabled ? { opacity: 0.74 } : null,
                pressed && !card.disabled ? styles.slideCardPressed : null,
              ]}
              disabled={card.disabled}
              onPress={() => {
                if (!card.route || card.disabled) {
                  return;
                }
                handleCardPress(card.route);
              }}
            >
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.78)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.heroOverlay}
                >
                  <View style={styles.heroTextBlock}>
                    {card.disabled ? <Text style={[styles.heroCategory, { color: card.accent }]}>Binnenkort</Text> : null}
                    <Text style={[
                      styles.heroTitle,
                      card.id === 'progress' && { color: card.accent },
                      card.id === 'workouts' && { color: '#2563EB' },
                      card.id === 'nutrition' && { color: '#EF4444' },
                      card.id === 'mind' && { color: '#8B5CF6' },
                      card.id === 'stats' && { color: '#10B981' },
                      card.id === 'orders' && { color: '#22C55E' },
                    ]}>{card.title}</Text>
                    <Text style={styles.domainSubtitleOnImage}>{card.description}</Text>
                  </View>
                  <View
                    style={[
                      styles.heroArrow,
                      appSettings.highContrast ? styles.heroArrowHighContrast : null,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={card.disabled ? 'clock-outline' : 'arrow-right'}
                      size={isSmallScreen ? 18 : 20}
                      color={appSettings.highContrast ? '#0F172A' : '#FFFFFF'}
                    />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>INZICHTEN</Text>
        <View style={styles.insightRow}>
          <View style={[styles.insightChip, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.insightChipTitle, { color: theme.titleColor }]}>Consistentie 7 dagen</Text>
          </View>
          <View style={[styles.insightChip, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Text style={[styles.insightChipTitle, { color: theme.titleColor }]}>Top focusmoment: ochtend</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.subtitleColor }]}>SNELLE TOEGANG</Text>
        <View style={styles.quickActionWrap}>
          {canShowFeedbackButton ? (
            <Pressable
              style={({ pressed }) => [
                styles.quickActionButton,
                styles.quickActionButtonFeedback,
                pressed ? styles.quickActionButtonPressed : null,
              ]}
              onPress={() => setFeedbackModalVisible(true)}
            >
              <MaterialCommunityIcons name="chat-outline" size={18} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Geef Feedback</Text>
              <MaterialCommunityIcons name="gift" size={18} color="#FFFFFF" />
            </Pressable>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.quickActionButton, pressed ? styles.quickActionButtonPressed : null]}
            onPress={() => handleCardPress('/find-coach')}
          >
            <MaterialCommunityIcons name="account-search-outline" size={18} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Vind Coach</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}> 
            <Text style={[styles.modalTitle, { color: theme.titleColor }]}>DAELY Feedback Formulier</Text>
            <Text style={[styles.modalSubtitle, { color: theme.subtitleColor }]}>Help ons DAELY te verbeteren met deze vragenlijst.</Text>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.formSectionTitle, { color: theme.titleColor }]}>1. Algemene ervaring</Text>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>1. Hoe tevreden ben je over DAELY?</Text>
                {renderStarRating(feedbackForm.overallSatisfaction, (rating) =>
                  setFeedbackForm((prev) => ({ ...prev, overallSatisfaction: rating }))
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>2. Wat vind je van de app op deze punten?</Text>
                <Text style={[styles.formHint, { color: theme.subtitleColor }]}>Score 1-5 per onderdeel</Text>

                <Text style={[styles.subLabel, { color: theme.titleColor }]}>Gebruiksvriendelijkheid</Text>
                {renderStarRating(feedbackForm.categoryRatings.usability, (rating) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    categoryRatings: { ...prev.categoryRatings, usability: rating },
                  }))
                )}

                <Text style={[styles.subLabel, { color: theme.titleColor }]}>Overzicht / navigatie</Text>
                {renderStarRating(feedbackForm.categoryRatings.navigation, (rating) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    categoryRatings: { ...prev.categoryRatings, navigation: rating },
                  }))
                )}

                <Text style={[styles.subLabel, { color: theme.titleColor }]}>Snelheid</Text>
                {renderStarRating(feedbackForm.categoryRatings.speed, (rating) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    categoryRatings: { ...prev.categoryRatings, speed: rating },
                  }))
                )}

                <Text style={[styles.subLabel, { color: theme.titleColor }]}>Design</Text>
                {renderStarRating(feedbackForm.categoryRatings.design, (rating) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    categoryRatings: { ...prev.categoryRatings, design: rating },
                  }))
                )}
              </View>

              <Text style={[styles.formSectionTitle, { color: theme.titleColor }]}>2. Jouw gebruik</Text>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>3. Welke onderdelen gebruik je het meest?</Text>
                <Text style={[styles.formHint, { color: theme.subtitleColor }]}>Meerdere antwoorden mogelijk</Text>
                <View style={styles.chipsWrap}>
                  {MOST_USED_PARTS_OPTIONS.map((option) => {
                    const selected = feedbackForm.mostUsedParts.includes(option);
                    return (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            mostUsedParts: toggleValue(prev.mostUsedParts, option),
                          }))
                        }
                        style={[
                          styles.choiceChip,
                          {
                            borderColor: selected ? '#10B981' : theme.border,
                            backgroundColor: selected ? 'rgba(16,185,129,0.14)' : theme.card,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceChipText, { color: theme.titleColor }]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Text style={[styles.formSectionTitle, { color: theme.titleColor }]}>3. Sport & content</Text>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>4. Hoe goed sluiten de workouts die je doet aan op jouw niveau?</Text>
                <View style={styles.choiceColumn}>
                  {['Te makkelijk', 'Goed niveau', 'Te zwaar'].map((option) => {
                    const selected = feedbackForm.workoutLevel === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setFeedbackForm((prev) => ({ ...prev, workoutLevel: option as FeedbackFormState['workoutLevel'] }))}
                        style={[
                          styles.choiceRow,
                          {
                            borderColor: selected ? '#0EA5E9' : theme.border,
                            backgroundColor: selected ? 'rgba(14,165,233,0.14)' : theme.card,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceRowText, { color: theme.titleColor }]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>5. Wat is voor jou de grootste frustratie binnen de workouts of trainingen?</Text>
                <View style={styles.chipsWrap}>
                  {WORKOUT_FRUSTRATION_OPTIONS.map((option) => {
                    const selected = feedbackForm.workoutFrustrations.includes(option);
                    return (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            workoutFrustrations: toggleValue(prev.workoutFrustrations, option),
                          }))
                        }
                        style={[
                          styles.choiceChip,
                          {
                            borderColor: selected ? '#F97316' : theme.border,
                            backgroundColor: selected ? 'rgba(249,115,22,0.14)' : theme.card,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceChipText, { color: theme.titleColor }]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                {feedbackForm.workoutFrustrations.includes('Anders') ? (
                  <TextInput
                    style={[styles.feedbackInput, styles.feedbackInputCompact, { borderColor: theme.subtitleColor, color: theme.titleColor }]}
                    placeholder="Anders: beschrijf kort"
                    placeholderTextColor="#9CA3AF"
                    value={feedbackForm.workoutFrustrationOther}
                    onChangeText={(text) => setFeedbackForm((prev) => ({ ...prev, workoutFrustrationOther: text }))}
                  />
                ) : null}
              </View>

              <Text style={[styles.formSectionTitle, { color: theme.titleColor }]}>4. Resultaat & motivatie</Text>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>6. Helpt DAELY je om je doelen te bereiken?</Text>
                <View style={styles.choiceColumn}>
                  {['Ja, veel', 'Een beetje', 'Nog niet', 'Nee'].map((option) => {
                    const selected = feedbackForm.helpsGoals === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setFeedbackForm((prev) => ({ ...prev, helpsGoals: option as FeedbackFormState['helpsGoals'] }))}
                        style={[
                          styles.choiceRow,
                          {
                            borderColor: selected ? '#8B5CF6' : theme.border,
                            backgroundColor: selected ? 'rgba(139,92,246,0.14)' : theme.card,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceRowText, { color: theme.titleColor }]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>7. Motiveert DAELY je om te blijven sporten?</Text>
                {renderStarRating(feedbackForm.motivationRating, (rating) =>
                  setFeedbackForm((prev) => ({ ...prev, motivationRating: rating }))
                )}
              </View>

              <Text style={[styles.formSectionTitle, { color: theme.titleColor }]}>5. Verbeteringen</Text>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>8. Wat mis je in de app?</Text>
                <Text style={[styles.formHint, { color: theme.subtitleColor }]}>Meerdere antwoorden mogelijk</Text>
                <View style={styles.chipsWrap}>
                  {MISSING_FEATURE_OPTIONS.map((option) => {
                    const selected = feedbackForm.missingFeatures.includes(option);
                    return (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            missingFeatures: toggleValue(prev.missingFeatures, option),
                          }))
                        }
                        style={[
                          styles.choiceChip,
                          {
                            borderColor: selected ? '#14B8A6' : theme.border,
                            backgroundColor: selected ? 'rgba(20,184,166,0.14)' : theme.card,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceChipText, { color: theme.titleColor }]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>9. Wat moeten we als eerste verbeteren?</Text>
                <TextInput
                  style={[styles.feedbackInput, { borderColor: theme.subtitleColor, color: theme.titleColor }]}
                  placeholder="Typ je antwoord..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={feedbackForm.firstImprove}
                  onChangeText={(text) => setFeedbackForm((prev) => ({ ...prev, firstImprove: text }))}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.titleColor }]}>10. Wat vind je het beste aan DAELY?</Text>
                <TextInput
                  style={[styles.feedbackInput, { borderColor: theme.subtitleColor, color: theme.titleColor }]}
                  placeholder="Typ je antwoord..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={feedbackForm.bestThing}
                  onChangeText={(text) => setFeedbackForm((prev) => ({ ...prev, bestThing: text }))}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setFeedbackModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuleer</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                disabled={isSubmittingFeedback}
                onPress={handleFeedbackSubmit}
              >
                <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>{isSubmittingFeedback ? 'Verzenden...' : 'Verzenden'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
      >
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContent}>
            <FontAwesome5 name="gift" size={48} color="#FBBF24" />
            <Text style={styles.celebrationTitle}>Bedankt!</Text>
            <Text style={styles.celebrationSubtitle}>Je feedback is verzonden.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F2F4',
  },
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: isSmallScreen ? 2 : 4,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionTitle: {
    fontSize: isSmallScreen ? 44 : 50,
    lineHeight: isSmallScreen ? 46 : 52,
    fontWeight: '900',
    color: '#0D0F1A',
    letterSpacing: -1.6,
  },
  sessionSubtitle: {
    marginTop: 1,
    fontSize: isSmallScreen ? 9 : 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#6B7280',
  },
  settingsPill: {
    marginTop: 6,
    borderRadius: 999,
    borderWidth: 1,
    width: 38,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  settingsPillPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  overviewCard: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  overviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  overviewTitle: {
    marginTop: 6,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  overviewMetrics: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(148,163,184,0.10)',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  metricValue: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: 18,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  cardsWrap: {
    marginTop: isSmallScreen ? 8 : 12,
    paddingHorizontal: 16,
    gap: isSmallScreen ? 8 : 10,
  },
  domainCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  domainLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  domainIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainTextWrap: {
    flex: 1,
  },
  domainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  domainSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  verticalCard: {
    width: '100%',
  },
  slideCardPressed: {
    transform: [{ scale: 0.992 }],
    opacity: 0.96,
  },
  heroImage: {
    height: CARD_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    flex: 1,
  },
  heroCategory: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2.1,
    color: '#93C5FD',
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: isSmallScreen ? 14 : 17,
    lineHeight: isSmallScreen ? 16 : 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  domainSubtitleOnImage: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.86)',
    fontWeight: '600',
    maxWidth: '95%',
  },
  heroArrow: {
    width: isSmallScreen ? 28 : 32,
    height: isSmallScreen ? 28 : 32,
    borderRadius: isSmallScreen ? 14 : 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: isSmallScreen ? 8 : 12,
  },
  heroArrowHighContrast: {
    backgroundColor: '#FFFFFF',
  },
  insightRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  insightChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  insightChipTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionWrap: {
    marginTop: isSmallScreen ? 10 : 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  quickActionButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  quickActionButtonSecondary: {
    shadowOpacity: 0.16,
  },
  quickActionButtonFeedback: {
    backgroundColor: '#059669',
    shadowOpacity: 0.2,
  },
  quickActionButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.94,
  },
  quickActionGradient: {
    minHeight: 52,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bottomSpacer: {
    height: isSmallScreen ? 60 : 92,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    borderRadius: 20,
    padding: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackInput: {
    marginTop: 14,
    minHeight: 94,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  feedbackInputCompact: {
    minHeight: 44,
  },
  formScroll: {
    marginTop: 14,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  formHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  subLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '700',
  },
  starRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chipsWrap: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choiceChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  choiceColumn: {
    marginTop: 8,
    gap: 8,
  },
  choiceRow: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choiceRowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  celebrationContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 8,
  },
  celebrationTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  celebrationSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  startActivityButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startActivityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
