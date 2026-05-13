import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  if (!webClientId && !androidClientId) {
    // Allow app startup without Google auth configured.
    return;
  }

  GoogleSignin.configure({
    webClientId,
  });
};

// Handle Google Sign-In
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    console.log('Google Sign-In successful:', userInfo);
    
    return {
      success: true,
      user: userInfo,
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
      return { success: false, error: 'Cancelled' };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Signing in...');
      return { success: false, error: 'In progress' };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available');
      return { success: false, error: 'Play services not available' };
    } else {
      console.error('Google Sign-In error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Sign out
export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Sign-out error:', error);
  }
};

// Get currently signed-in user
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
