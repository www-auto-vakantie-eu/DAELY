import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image , Platform } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import {
  addCreatorPost,
  addPublicCreatorMeal,
  addPublicCreatorWorkout,
  approveCreatorMeal,
  approveCreatorPost,
  approveCreatorWorkout,
  getCreatorMealEntries,
  getCreatorPosts,
  getCreatorWorkoutEntries,
  type CreatorMealEntry,
  type CreatorPost,
  type CreatorWorkoutEntry,
  type ModerationStatus,
} from '@/services/creator-content';
import { setCreatorHeaderImage } from '@/services/creator-profiles';
import { ACTIVITY_TYPE_COLORS, type ActivityType } from '@/constants/workout-activities';

const MEAL_TYPES = ['Ontbijt', 'Lunch', 'Diner', 'Snack', 'Pre Workout', 'Post Workout', 'Herstel', 'Smoothies', 'Shakes'] as const;
const DIET_TYPES = ['Eiwitrijk', 'Koolhydraatarm', 'Keto', 'Veganistisch', 'Vegetarisch', 'Glutenvrij', 'Lactosevrij'] as const;
const GOAL_TYPES = ['Spieropbouw', 'Vetverlies', 'Prestatie', 'Uithoudingsvermogen', 'Herstel focus', 'Lean Bulk', 'Levensduur'] as const;
const BUDGET_TYPES = ['€', '€€', '€€€'] as const;

type MealType = (typeof MEAL_TYPES)[number];
type DietType = (typeof DIET_TYPES)[number];
type GoalType = (typeof GOAL_TYPES)[number];
type BudgetType = (typeof BUDGET_TYPES)[number];

function statusLabel(status: ModerationStatus): string {
  if (status === 'approved') return 'Approved';
  if (status === 'pending') return 'Pending';
  return 'Draft';
}

export default function CreatorStudioScreen() {
  // Header image state
  const [headerImage, setHeaderImage] = useState<string>('');
  const [headerImageUrl, setHeaderImageUrl] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
    // Simuleer ophalen gallery (vervang door echte fetch indien nodig)
    useEffect(() => {
      setGalleryImages([
        'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      ]);
    }, []);

    // Image picker
    const pickHeaderImage = async () => {
      if (Platform.OS === 'web') return;
      const ImagePicker = require('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setHeaderImage(result.assets[0].uri);
      }
    };
  const router = useRouter();
  const theme = useTheme();
  const { accountType, isLoggedIn } = useAppContext();
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [mealEntries, setMealEntries] = useState<CreatorMealEntry[]>([]);
  const [workoutEntries, setWorkoutEntries] = useState<CreatorWorkoutEntry[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postStatus, setPostStatus] = useState<ModerationStatus>('pending');
  const [mealTitle, setMealTitle] = useState('');
  const [mealKcal, setMealKcal] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealImage, setMealImage] = useState('');
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [mealDiet, setMealDiet] = useState<DietType>('Eiwitrijk');
  const [mealGoal, setMealGoal] = useState<GoalType>('Spieropbouw');
  const [mealBudget, setMealBudget] = useState<BudgetType>('€€');
  const [mealStatus, setMealStatus] = useState<ModerationStatus>('pending');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutType, setWorkoutType] = useState<ActivityType>('kracht');
  const [workoutStatus, setWorkoutStatus] = useState<ModerationStatus>('pending');
  const recentPosts = posts.slice(0, 5);
  const recentMeals = mealEntries.slice(0, 5);
  const recentWorkouts = workoutEntries.slice(0, 5);

  const canModerate = accountType === 'influencer' || accountType === 'admin';
  const canUpload = isLoggedIn;

  const reloadCreatorContent = async () => {
    const [postItems, mealItems, workoutItems] = await Promise.all([
      getCreatorPosts(),
      getCreatorMealEntries(),
      getCreatorWorkoutEntries(),
    ]);
    setPosts(postItems);
    setMealEntries(mealItems);
    setWorkoutEntries(workoutItems);
  };

  useEffect(() => {
    if (!canUpload) return;
    reloadCreatorContent().catch(() => {
      setPosts([]);
      setMealEntries([]);
      setWorkoutEntries([]);
    });
  }, [canUpload]);

  const submitPost = async () => {
    if (!postTitle.trim() || !postCaption.trim()) {
      Alert.alert('Ontbrekende velden', 'Vul een titel en caption in voor je post.');
      return;
    }

    const targetStatus: ModerationStatus = canModerate ? postStatus : 'pending';
    await addCreatorPost({ title: postTitle, caption: postCaption }, targetStatus);
    await reloadCreatorContent();
    setPostTitle('');
    setPostCaption('');
    Alert.alert('Opgeslagen', `Je post staat nu op status: ${statusLabel(targetStatus)}.`);
  };

  const submitMeal = async () => {
    const kcal = Number.parseInt(mealKcal, 10);
    const protein = Number.parseInt(mealProtein, 10);

    if (!mealTitle.trim() || !Number.isFinite(kcal) || !Number.isFinite(protein)) {
      Alert.alert('Ontbrekende velden', 'Vul minimaal titel, kcal en eiwit in.');
      return;
    }

    const targetStatus: ModerationStatus = canModerate ? mealStatus : 'pending';

    await addPublicCreatorMeal({
      title: mealTitle.trim(),
      kcal,
      protein,
      image: mealImage.trim() || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1600&q=80',
      description: 'Toegevoegd door creator via Creator Studio.',
      mealType,
      diets: [mealDiet],
      goals: [mealGoal],
      macroProfiles: ['Eiwitrijk', '500 & 800 KCAL'],
      timeTags: ['10 tot 20 min'],
      budget: mealBudget,
      exclusions: ['Zout Arm'],
    }, targetStatus);

    await reloadCreatorContent();

    setMealTitle('');
    setMealKcal('');
    setMealProtein('');
    setMealImage('');
    Alert.alert('Opgeslagen', `Je gerecht staat nu op status: ${statusLabel(targetStatus)}.`);
  };

  const submitWorkout = async () => {
    const duration = Number.parseInt(workoutDuration, 10);
    if (!workoutTitle.trim() || !Number.isFinite(duration)) {
      Alert.alert('Ontbrekende velden', 'Vul minimaal titel en duur in minuten in.');
      return;
    }

    const now = new Date();
    const iso = now.toISOString();
    const timeLabel = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const targetStatus: ModerationStatus = canModerate ? workoutStatus : 'pending';

    await addPublicCreatorWorkout({
      type: workoutType,
      title: workoutTitle.trim(),
      date: `Vandaag · ${timeLabel}`,
      dateIso: iso,
      icon: workoutType === 'running' ? 'run-fast' : workoutType === 'hyrox' ? 'lightning-bolt' : workoutType === 'mobility' ? 'human-handsup' : workoutType === 'herstel' ? 'heart-pulse' : 'dumbbell',
      accentColor: ACTIVITY_TYPE_COLORS[workoutType],
      metrics: [{ label: 'Duur', value: `${duration} min` }],
      splits: [{ label: 'Main set', meta: `${duration} min creator workout` }],
      heartRateData: [120, 128, 134, 139, 144, 136, 130],
      description: 'Openbare workout toegevoegd via Creator Studio.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    }, targetStatus);

    await reloadCreatorContent();

    setWorkoutTitle('');
    setWorkoutDuration('');
    Alert.alert('Opgeslagen', `Je workout staat nu op status: ${statusLabel(targetStatus)}.`);
  };

  const approvePost = async (id: string) => {
    await approveCreatorPost(id);
    await reloadCreatorContent();
  };

  const approveMeal = async (id: string) => {
    await approveCreatorMeal(id);
    await reloadCreatorContent();
  };

  const approveWorkout = async (id: string) => {
    await approveCreatorWorkout(id);
    await reloadCreatorContent();
  };

  const renderStatusPill = (status: ModerationStatus) => {
    const isApproved = status === 'approved';
    const isPending = status === 'pending';

    const backgroundColor = isApproved ? '#ECFDF5' : isPending ? '#FEF3C7' : '#F3F4F6';
    const borderColor = isApproved ? '#34D399' : isPending ? '#F59E0B' : '#D1D5DB';
    const textColor = isApproved ? '#047857' : isPending ? '#92400E' : '#4B5563';

    return (
      <View style={[styles.statusPill, { backgroundColor, borderColor }]}>
        <Text style={[styles.statusPillText, { color: textColor }]}>{statusLabel(status)}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
            <Text style={[styles.backLabel, { color: theme.titleColor }]}>Terug</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.titleColor }]}>Creator Studio.</Text>

        {/* Headerafbeelding kiezen/uploaden */}
        <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.featureTitle, { color: theme.titleColor }]}>Headerafbeelding instellen</Text>
          <Text style={[styles.featureText, { color: theme.subtitleColor }]}>Kies een afbeelding voor je profielheader.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {galleryImages.map((img, idx) => (
              <Pressable key={idx} onPress={() => setHeaderImage(img)} style={{ marginRight: 12 }}>
                <Image source={{ uri: img }} style={{ width: 80, height: 80, borderRadius: 12, borderWidth: headerImage === img ? 3 : 0, borderColor: '#2563EB' }} />
              </Pressable>
            ))}
          </ScrollView>
          {Platform.OS === 'web' ? (
            <View style={{ marginVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: theme.subtitleColor, fontSize: 13 }}>
                Uploaden vanaf device is niet beschikbaar op web. Gebruik een afbeelding-URL of kies uit de gallery.
              </Text>
            </View>
          ) : (
            <Pressable style={styles.actionButton} onPress={pickHeaderImage}>
              <Text style={styles.actionButtonText}>Upload vanaf device</Text>
            </Pressable>
          )}
          <TextInput
            style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background, marginTop: 8 }]}
            placeholder="Of plak een afbeelding-URL..."
            placeholderTextColor={theme.subtitleColor}
            value={headerImageUrl}
            onChangeText={setHeaderImageUrl}
            onSubmitEditing={() => setHeaderImage(headerImageUrl)}
          />
          {headerImage ? (
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Image source={{ uri: headerImage }} style={{ width: 120, height: 80, borderRadius: 14 }} />
              <Text style={{ color: theme.subtitleColor, fontSize: 12, marginTop: 4 }}>Gekozen headerafbeelding</Text>
              <Pressable
                style={[styles.actionButton, { marginTop: 8, backgroundColor: '#2563EB' }]}
                onPress={() => {
                  // Simuleer huidige gebruiker als 'tim-hofman' (vervang door echte userId indien beschikbaar)
                  setCreatorHeaderImage('tim-hofman', headerImage);
                  Alert.alert('Opgeslagen', 'Headerafbeelding is opgeslagen!');
                }}
              >
                <Text style={styles.actionButtonText}>Opslaan als header</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Upload zelf content. Alles gaat eerst door moderatie.</Text>

        {!canUpload ? (
          <View style={[styles.lockedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="lock-outline" size={28} color="#6B7280" />
            <Text style={[styles.lockedTitle, { color: theme.titleColor }]}>Log eerst in</Text>
            <Text style={[styles.lockedText, { color: theme.subtitleColor }]}>Je moet ingelogd zijn om content te uploaden.</Text>
          </View>
        ) : (
          <>
            {!canModerate ? (
              <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
                <MaterialCommunityIcons name="information-outline" size={18} color={theme.subtitleColor} />
                <Text style={[styles.noticeText, { color: theme.subtitleColor }]}>Jouw uploads worden als Pending opgeslagen en zichtbaar na goedkeuring.</Text>
              </View>
            ) : null}

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.featureTitle, { color: theme.titleColor }]}>1. Nieuwe Post Maken</Text>
              <TextInput
                style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Posttitel"
                placeholderTextColor={theme.subtitleColor}
                value={postTitle}
                onChangeText={setPostTitle}
              />
              <TextInput
                style={[styles.input, styles.inputMultiline, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Caption"
                placeholderTextColor={theme.subtitleColor}
                value={postCaption}
                onChangeText={setPostCaption}
                multiline
              />
              {canModerate ? (
                <View style={styles.inlineRow}>
                  {(['draft', 'pending'] as ModerationStatus[]).map((status) => (
                    <Pressable
                      key={`post-${status}`}
                      style={[styles.typeChip, postStatus === status ? styles.typeChipActive : null]}
                      onPress={() => setPostStatus(status)}
                    >
                      <Text style={[styles.typeChipText, postStatus === status ? styles.typeChipTextActive : null]}>{statusLabel(status)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <Pressable style={styles.actionButton} onPress={submitPost}>
                <Text style={styles.actionButtonText}>Post publiceren</Text>
              </Pressable>
              {posts.length > 0 ? (
                <>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Laatste post: {posts[0].title} ({statusLabel(posts[0].status)})</Text>
                  {canModerate && posts[0].status !== 'approved' ? (
                    <Pressable style={styles.approveButton} onPress={() => approvePost(posts[0].id)}>
                      <Text style={styles.approveButtonText}>Approve laatste post</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : null}
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.featureTitle, { color: theme.titleColor }]}>2. Gerechten Toevoegen</Text>
              <TextInput
                style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Gerecht titel"
                placeholderTextColor={theme.subtitleColor}
                value={mealTitle}
                onChangeText={setMealTitle}
              />
              <View style={styles.inlineRow}>
                <TextInput
                  style={[styles.input, styles.inlineInput, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                  placeholder="KCAL"
                  placeholderTextColor={theme.subtitleColor}
                  keyboardType="number-pad"
                  value={mealKcal}
                  onChangeText={setMealKcal}
                />
                <TextInput
                  style={[styles.input, styles.inlineInput, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                  placeholder="Eiwit g"
                  placeholderTextColor={theme.subtitleColor}
                  keyboardType="number-pad"
                  value={mealProtein}
                  onChangeText={setMealProtein}
                />
              </View>
              <View style={styles.inlineRowWrap}>
                {MEAL_TYPES.map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.typeChip, mealType === option ? styles.typeChipActive : null]}
                    onPress={() => setMealType(option)}
                  >
                    <Text style={[styles.typeChipText, mealType === option ? styles.typeChipTextActive : null]}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.inlineRowWrap}>
                {DIET_TYPES.map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.typeChip, mealDiet === option ? styles.typeChipActive : null]}
                    onPress={() => setMealDiet(option)}
                  >
                    <Text style={[styles.typeChipText, mealDiet === option ? styles.typeChipTextActive : null]}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.inlineRowWrap}>
                {GOAL_TYPES.map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.typeChip, mealGoal === option ? styles.typeChipActive : null]}
                    onPress={() => setMealGoal(option)}
                  >
                    <Text style={[styles.typeChipText, mealGoal === option ? styles.typeChipTextActive : null]}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.inlineRow}>
                {BUDGET_TYPES.map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.typeChip, mealBudget === option ? styles.typeChipActive : null]}
                    onPress={() => setMealBudget(option)}
                  >
                    <Text style={[styles.typeChipText, mealBudget === option ? styles.typeChipTextActive : null]}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              {canModerate ? (
                <View style={styles.inlineRow}>
                  {(['draft', 'pending'] as ModerationStatus[]).map((status) => (
                    <Pressable
                      key={`meal-${status}`}
                      style={[styles.typeChip, mealStatus === status ? styles.typeChipActive : null]}
                      onPress={() => setMealStatus(status)}
                    >
                      <Text style={[styles.typeChipText, mealStatus === status ? styles.typeChipTextActive : null]}>{statusLabel(status)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <TextInput
                style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Afbeelding URL (optioneel)"
                placeholderTextColor={theme.subtitleColor}
                value={mealImage}
                onChangeText={setMealImage}
              />
              <Pressable style={styles.actionButton} onPress={submitMeal}>
                <Text style={styles.actionButtonText}>Gerecht toevoegen</Text>
              </Pressable>
              {mealEntries[0] ? (
                <>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Laatste gerecht: {mealEntries[0].meal.title} ({statusLabel(mealEntries[0].status)})</Text>
                  {canModerate && mealEntries[0].status !== 'approved' ? (
                    <Pressable style={styles.approveButton} onPress={() => approveMeal(mealEntries[0].id)}>
                      <Text style={styles.approveButtonText}>Approve laatste gerecht</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : null}
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.featureTitle, { color: theme.titleColor }]}>3. Openbare Workouts Toevoegen</Text>
              <TextInput
                style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Workout titel"
                placeholderTextColor={theme.subtitleColor}
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
              />
              <View style={styles.inlineRow}>
                {(['kracht', 'running', 'hyrox'] as ActivityType[]).map((type) => (
                  <Pressable
                    key={type}
                    style={[styles.typeChip, workoutType === type ? styles.typeChipActive : null]}
                    onPress={() => setWorkoutType(type)}
                  >
                    <Text style={[styles.typeChipText, workoutType === type ? styles.typeChipTextActive : null]}>{type.toUpperCase()}</Text>
                  </Pressable>
                ))}
              </View>
              {canModerate ? (
                <View style={styles.inlineRow}>
                  {(['draft', 'pending'] as ModerationStatus[]).map((status) => (
                    <Pressable
                      key={`workout-${status}`}
                      style={[styles.typeChip, workoutStatus === status ? styles.typeChipActive : null]}
                      onPress={() => setWorkoutStatus(status)}
                    >
                      <Text style={[styles.typeChipText, workoutStatus === status ? styles.typeChipTextActive : null]}>{statusLabel(status)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <TextInput
                style={[styles.input, { color: theme.titleColor, borderColor: theme.border, backgroundColor: theme.background }]}
                placeholder="Duur in minuten"
                placeholderTextColor={theme.subtitleColor}
                keyboardType="number-pad"
                value={workoutDuration}
                onChangeText={setWorkoutDuration}
              />
              <Pressable style={styles.actionButton} onPress={submitWorkout}>
                <Text style={styles.actionButtonText}>Openbare workout publiceren</Text>
              </Pressable>
              {workoutEntries[0] ? (
                <>
                  <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Laatste workout: {workoutEntries[0].workout.title} ({statusLabel(workoutEntries[0].status)})</Text>
                  {canModerate && workoutEntries[0].status !== 'approved' ? (
                    <Pressable style={styles.approveButton} onPress={() => approveWorkout(workoutEntries[0].id)}>
                      <Text style={styles.approveButtonText}>Approve laatste workout</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : null}
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.featureTitle, { color: theme.titleColor }]}>4. Mijn Uploads</Text>
              <Text style={[styles.featureText, { color: theme.subtitleColor }]}>Hier zie je de status van je meest recente uploads.</Text>

              <Text style={[styles.subSectionTitle, { color: theme.titleColor }]}>Posts</Text>
              {recentPosts.length === 0 ? (
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Nog geen posts geupload.</Text>
              ) : (
                recentPosts.map((item) => (
                  <View key={item.id} style={[styles.uploadRow, { borderColor: theme.border }]}>
                    <Text style={[styles.uploadRowTitle, { color: theme.titleColor }]} numberOfLines={1}>{item.title}</Text>
                    {renderStatusPill(item.status)}
                  </View>
                ))
              )}

              <Text style={[styles.subSectionTitle, { color: theme.titleColor }]}>Gerechten</Text>
              {recentMeals.length === 0 ? (
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Nog geen gerechten geupload.</Text>
              ) : (
                recentMeals.map((item) => (
                  <View key={item.id} style={[styles.uploadRow, { borderColor: theme.border }]}>
                    <Text style={[styles.uploadRowTitle, { color: theme.titleColor }]} numberOfLines={1}>{item.meal.title}</Text>
                    {renderStatusPill(item.status)}
                  </View>
                ))
              )}

              <Text style={[styles.subSectionTitle, { color: theme.titleColor }]}>Workouts</Text>
              {recentWorkouts.length === 0 ? (
                <Text style={[styles.metaText, { color: theme.subtitleColor }]}>Nog geen workouts geupload.</Text>
              ) : (
                recentWorkouts.map((item) => (
                  <View key={item.id} style={[styles.uploadRow, { borderColor: theme.border }]}>
                    <Text style={[styles.uploadRowTitle, { color: theme.titleColor }]} numberOfLines={1}>{item.workout.title}</Text>
                    {renderStatusPill(item.status)}
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 96,
  },
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  lockedCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  lockedText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  noticeCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  featureCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  subSectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  inputMultiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  actionButton: {
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    marginTop: 2,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  metaText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  inlineRowWrap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  inlineInput: {
    flex: 1,
    marginBottom: 0,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  typeChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  typeChipTextActive: {
    color: '#1D4ED8',
  },
  approveButton: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  approveButtonText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  uploadRow: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  uploadRowTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
