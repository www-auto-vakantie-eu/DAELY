import { StyleSheet, ScrollView, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getThemeLoginLogo } from '@/constants/theme-branding';
import { validateInfluencerInviteCode } from '@/services/invite-only-auth';

WebBrowser.maybeCompleteAuthSession();

function resolveRoleFromEmail(email: string): 'standard' | 'admin' {
  const normalized = email.trim().toLowerCase();
  const raw = process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '';
  const adminEmails = raw
    .split(',')
    .map((item: string) => item.trim().toLowerCase())
    .filter(Boolean);

  if (normalized && adminEmails.includes(normalized)) {
    return 'admin';
  }

  return 'standard';
}

export default function LoginScreen() {
  const router = useRouter();
  const { setIsLoggedIn, setAccountType, activeThemeId, updateUser, updateAppSettings } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAccountType, setSignupAccountType] = useState<'standard' | 'influencer'>('standard');
  const [inviteCode, setInviteCode] = useState('');
  const [fontsLoaded] = useFonts({ Inter_900Black });
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  const googleAndroidClientId =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? googleWebClientId;
  const isDevelopmentBuild = __DEV__ || process.env.NODE_ENV !== 'production';
  const isDevTestLoginEnabled =
    isDevelopmentBuild && process.env.EXPO_PUBLIC_ENABLE_DEV_TEST_LOGIN === 'true';
  const [, response, promptAsync] = Google.useAuthRequest({
    // expo-auth-session requires an Android client id on Android.
    // Use a non-empty fallback to avoid startup crashes when env vars are missing.
    webClientId: googleWebClientId || 'missing-google-web-client-id',
    androidClientId: googleAndroidClientId || 'missing-google-android-client-id',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    const setupGoogle = async () => {
      if (Platform.OS === 'web') return;
      const { configureGoogleSignIn } = await import('@/services/googleAuth');
      configureGoogleSignIn();
    };

    setupGoogle();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      setAccountType('standard');
      setIsLoggedIn(true);
      router.replace('/(tabs)/today');
    }
  }, [response, router, setAccountType, setIsLoggedIn]);

  const handleLogin = () => {
    if (email && password) {
      setAccountType(resolveRoleFromEmail(email));
      setIsLoggedIn(true);
      router.replace('/(tabs)/today');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (Platform.OS === 'web') {
        if (!googleWebClientId) {
          Alert.alert(
            'Google Login niet geconfigureerd',
            'Voeg EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID toe in je .env bestand.'
          );
          return;
        }

        await promptAsync();
        return;
      }

      if (!googleAndroidClientId) {
        Alert.alert(
          'Google Login niet geconfigureerd',
          'Voeg EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID toe in je .env bestand.'
        );
        return;
      }

      const { signInWithGoogle } = await import('@/services/googleAuth');
      const result = await signInWithGoogle();
      if (result.success) {
        setAccountType('standard');
        setIsLoggedIn(true);
        router.replace('/(tabs)/today');
      } else {
        Alert.alert('Login Failed', result.error || 'Could not sign in with Google');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const loginLogoSource = getThemeLoginLogo(activeThemeId);

  const handleAppleLogin = () => {
    setAccountType('standard');
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  const handleAndroidLogin = () => {
    setAccountType('standard');
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  const handleSignup = () => {
    if (!signupEmail || !signupUsername || !signupPassword) {
      Alert.alert('Ontbrekende velden', 'Vul e-mail, gebruikersnaam en wachtwoord in.');
      return;
    }

    if (signupAccountType === 'influencer' && !validateInfluencerInviteCode(inviteCode)) {
      Alert.alert(
        'Ongeldige uitnodiging',
        'Voor een influencer-account heb je een geldige invite-code nodig.'
      );
      return;
    }

    setAccountType(signupAccountType);
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  const handleCreateAccount = () => {
    setActiveTab('signup');
  };

  const handleForgotPassword = () => {
    setActiveTab('forgot');
  };

  const handleDevTestLoginMan = async () => {
    await updateUser({
      gender: 'man',
      name: 'Test Sporter Man',
    });
    await updateAppSettings({
      photoPreference: 'man',
    });
    setAccountType('standard');
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  const handleDevTestLoginVrouw = async () => {
    await updateUser({
      gender: 'vrouw',
      name: 'Test Sporter Vrouw',
    });
    await updateAppSettings({
      photoPreference: 'woman',
    });
    setAccountType('standard');
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  const handleDevTestLoginCreator = async () => {
    await updateUser({
      gender: 'man',
      name: 'Test Creator',
      username: 'daely_creator',
      role: 'DAELY Creator',
      sportFocus: 'Fitness, padel & lifestyle',
      bio: 'DAELY creator en sportieve ambassador die challenges, trainingen en motivatie deelt.',
      creatorCode: 'DAELY-CREATOR-TEST',
      referralCode: 'DAELY-CREATOR-TEST',
      followers: 12840,
      activeCreatorSubscribers: 342,
      estimatedMonthlyEarnings: 338.58,
      createdChallenges: 6,
      sharedWorkouts: 18,
      communityEngagement: 'Hoog',
      creatorBadge: 'DAELY Creator',
      creatorType: 'influencer-athlete',
    });
    await updateAppSettings({
      photoPreference: 'man',
    });
    setAccountType('influencer');
    setIsLoggedIn(true);
    router.replace('/(tabs)/today');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={loginLogoSource}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoName}>DAELY.</Text>
            <Text style={styles.logoSubtitle}>Strenght Health Performance</Text>
          </View>

          {/* Login Tab */}
          {activeTab === 'login' && (
            <View style={styles.formContainer}>
              {/* Social Login Buttons */}
              <Text style={styles.socialLabel}>Inloggen met</Text>

              {/* Google Button */}
              <Pressable
                style={styles.socialButton}
                onPress={handleGoogleLogin}
              >
                <FontAwesome name="google" size={20} color="#EA4335" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Doorgaan met Google</Text>
              </Pressable>

              {/* Apple Button */}
              <Pressable
                style={styles.socialButtonApple}
                onPress={handleAppleLogin}
              >
                <FontAwesome name="apple" size={20} color="#FFFFFF" style={styles.socialIcon} />
                <Text style={styles.socialButtonTextWhite}>Doorgaan met Apple</Text>
              </Pressable>

              {/* Android Button */}
              <Pressable
                style={styles.socialButtonAndroid}
                onPress={handleAndroidLogin}
              >
                <FontAwesome name="android" size={20} color="#FFFFFF" style={styles.socialIcon} />
                <Text style={styles.socialButtonTextWhite}>Doorgaan met Android</Text>
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>of</Text>
                <View style={styles.divider} />
              </View>

              {/* Email/Username Input */}
              <TextInput
                style={styles.input}
                placeholder="Atleet ID / E-Mail"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                selectionColor="#2563EB"
              />

              {/* Password Input */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Wachtwoord"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  selectionColor="#2563EB"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={['#00D4FF', '#0052CC']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Inloggen</Text>
                </LinearGradient>
              </Pressable>

              {/* Local smoke-test helper: only render in development when explicitly enabled via public env flag. */}
              {isDevTestLoginEnabled ? (
                <>
                  <Text style={styles.devTestLoginLabel}>Test Login (Dev Only)</Text>
                  <Pressable style={styles.devTestLoginButton} onPress={handleDevTestLoginMan}>
                    <Text style={styles.devTestLoginButtonText}>Test Login Man</Text>
                  </Pressable>
                  <Pressable style={styles.devTestLoginButton} onPress={handleDevTestLoginVrouw}>
                    <Text style={styles.devTestLoginButtonText}>Test Login Vrouw</Text>
                  </Pressable>
                  <Pressable style={styles.devTestLoginButton} onPress={handleDevTestLoginCreator}>
                    <Text style={styles.devTestLoginButtonText}>Test Creator</Text>
                  </Pressable>
                </>
              ) : null}

              {/* Create Account */}
              <Pressable
                style={styles.linkButton}
                onPress={handleCreateAccount}
              >
                <Text style={styles.linkText}>
                  Nog geen account? <Text style={styles.linkBold}>Account aanmaken</Text>
                </Text>
              </Pressable>

              {/* Forgot Password */}
              <Pressable
                style={styles.linkButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.linkText}>Wachtwoord vergeten?</Text>
              </Pressable>
            </View>
          )}

          {/* Create Account Tab */}
          {activeTab === 'signup' && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Account aanmaken</Text>

              <Text style={styles.inputLabel}>Accounttype</Text>
              <View style={styles.accountTypeRow}>
                <Pressable
                  style={[
                    styles.accountTypePill,
                    signupAccountType === 'standard' ? styles.accountTypePillActive : null,
                  ]}
                  onPress={() => setSignupAccountType('standard')}
                >
                  <Text
                    style={[
                      styles.accountTypeText,
                      signupAccountType === 'standard' ? styles.accountTypeTextActive : null,
                    ]}
                  >
                    Standaard
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.accountTypePill,
                    signupAccountType === 'influencer' ? styles.accountTypePillActive : null,
                  ]}
                  onPress={() => setSignupAccountType('influencer')}
                >
                  <Text
                    style={[
                      styles.accountTypeText,
                      signupAccountType === 'influencer' ? styles.accountTypeTextActive : null,
                    ]}
                  >
                    Influencer
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.accountTypeHint}>
                Influencer-accounts zijn invite-only en vereisen een geldige code.
              </Text>
              
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Voer je e-mail in"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                selectionColor="#2563EB"
                value={signupEmail}
                onChangeText={setSignupEmail}
              />

              <Text style={styles.inputLabel}>Gebruikersnaam</Text>
              <TextInput
                style={styles.input}
                placeholder="Kies een gebruikersnaam"
                placeholderTextColor="#999999"
                selectionColor="#2563EB"
                value={signupUsername}
                onChangeText={setSignupUsername}
              />

              <Text style={styles.inputLabel}>Wachtwoord</Text>
              <TextInput
                style={styles.input}
                placeholder="Kies een sterk wachtwoord"
                placeholderTextColor="#999999"
                secureTextEntry
                selectionColor="#2563EB"
                value={signupPassword}
                onChangeText={setSignupPassword}
              />

              {signupAccountType === 'influencer' ? (
                <>
                  <Text style={styles.inputLabel}>Invite-code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Bijv. DAELY-CREATOR-2026"
                    placeholderTextColor="#999999"
                    autoCapitalize="characters"
                    selectionColor="#2563EB"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                  />
                </>
              ) : null}

              <Pressable style={styles.loginButton} onPress={handleSignup}>
                <Text style={styles.loginButtonText}>Account aanmaken</Text>
              </Pressable>

              <Pressable
                style={styles.linkButton}
                onPress={() => setActiveTab('login')}
              >
                <Text style={styles.linkText}>Terug naar inloggen</Text>
              </Pressable>
            </View>
          )}

          {/* Forgot Password Tab */}
          {activeTab === 'forgot' && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Wachtwoord herstellen</Text>
              
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Voer je e-mail adres in"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                selectionColor="#2563EB"
              />

              <Pressable style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Verstuur reset link</Text>
              </Pressable>

              <Pressable
                style={styles.linkButton}
                onPress={() => setActiveTab('login')}
              >
                <Text style={styles.linkText}>Terug naar inloggen</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
  },
  logoName: {
    fontSize: 36,
    fontFamily: 'Inter_900Black',
    color: '#1F2937',
    letterSpacing: -2,
    marginBottom: 4,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: 24,
    // Removed invalid backdropFilter property for React Native
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  socialLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 10,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtonApple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  socialButtonAndroid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#3DDC84',
    borderWidth: 1,
    borderColor: '#3DDC84',
    marginBottom: 10,
  },
  socialButtonTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999999',
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  inputLabel: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loginButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 16,
  },
  loginButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  devTestLoginButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 6,
  },
  devTestLoginButtonText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '700',
  },
  devTestLoginLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  linkButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '500',
  },
  linkBold: {
    color: '#2563EB',
    fontWeight: '700',
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  accountTypePill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  accountTypePillActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  accountTypeText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  accountTypeTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  accountTypeHint: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 16,
  },
});
