import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../ui/Icons';
import { Button } from '../ui/SharedUI';
import { THEMES } from '../../data/appData';
import {
  createUserWithEmailAndPassword,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { UserRole } from '../../../types';

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return fallback;
  }

  switch ((error as { code?: string }).code) {
    case 'auth/invalid-email':
      return 'Vul een geldig e-mailadres in.';
    case 'auth/missing-password':
      return 'Vul een wachtwoord in.';
    case 'auth/weak-password':
      return 'Gebruik een sterker wachtwoord van minimaal 6 tekens.';
    case 'auth/email-already-in-use':
      return 'Er bestaat al een account met dit e-mailadres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'De combinatie van e-mail en wachtwoord klopt niet.';
    case 'auth/too-many-requests':
      return 'Te veel pogingen. Probeer het later opnieuw.';
    case 'auth/popup-closed-by-user':
      return 'De login-popup is gesloten voordat het inloggen was afgerond.';
    default:
      return fallback;
  }
};

export const ForgotPasswordScreen: React.FC = () => {
  const { setIsForgotPassword } = useAppContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess('Resetlink verzonden. Controleer je inbox en spamfolder.');
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(getAuthErrorMessage(err, 'Het versturen van de resetlink is mislukt.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col px-8 py-12 overflow-y-auto animate-in slide-in-from-right-full duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setIsForgotPassword(false)} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
          <ICONS.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">WACHTWOORD VERGETEN</h2>
      </div>

      <div className="mb-8">
        <p className="text-sm text-zinc-600 font-medium leading-relaxed">
          Vul hieronder je e-mailadres in. We sturen je een link om een nieuw wachtwoord aan te maken.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium">
          {success}
        </div>
      )}

      <form className="space-y-6" onSubmit={handlePasswordReset}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">E-mailadres *</label>
            <input 
              type="email" 
              placeholder="jouw@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="logo" className="w-full py-5 text-base mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'VERZENDEN...' : 'STUUR RESET LINK'}
        </Button>
        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="w-full text-[10px] font-black text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
        >
          TERUG NAAR INLOGGEN
        </button>
      </form>
    </div>
  );
};

export const CreateAccountScreen: React.FC = () => {
  const { setIsCreatingAccount, setIsLoggedIn } = useAppContext();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' as UserRole, code: '' });

  const handleFormChange = (field: 'email' | 'password' | 'role' | 'code', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
      setIsCreatingAccount(false);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Inloggen met Google mislukt');
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError('');
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
      setIsLoggedIn(true);
      setIsCreatingAccount(false);
    } catch (err: any) {
      console.error("Apple login error:", err);
      setError(err.message || 'Inloggen met Apple mislukt');
    }
  };

  const handleAndroidLogin = async () => {
    try {
      setError('');
      // Android login typically uses Google Play Games or just Google
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
      setIsCreatingAccount(false);
    } catch (err: any) {
      console.error("Android login error:", err);
      setError(err.message || 'Inloggen met Android mislukt');
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simpele validatie voor code bij speciale rollen
    if (formData.role !== 'user' && !formData.code.trim()) {
      setError('Vul een geldige inlogcode in voor dit accounttype.');
      setIsSubmitting(false);
      return;
    }

    // Voorbeeld: check of de code geldig is (dummy check, vervang door echte validatie)
    if (formData.role !== 'user') {
      // Stel: codes staan in een Firestore-collectie 'accessCodes' met veld 'valid: true/false'
      const codeDoc = await getDoc(doc(db, 'accessCodes', formData.code.trim()));
      if (!codeDoc.exists() || !codeDoc.data().valid) {
        setError('Deze inlogcode is ongeldig of al gebruikt.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      const user = userCredential.user;
      // Sla de rol en extra info op in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: formData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // (Optioneel) markeer de code als gebruikt
      if (formData.role !== 'user') {
        await setDoc(doc(db, 'accessCodes', formData.code.trim()), { valid: false }, { merge: true });
      }
      setIsLoggedIn(true);
      setIsCreatingAccount(false);
    } catch (err) {
      console.error('Create account error:', err);
      setError(getAuthErrorMessage(err, 'Account aanmaken is mislukt.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col px-8 py-12 overflow-y-auto animate-in slide-in-from-right-full duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setIsCreatingAccount(false)} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
          <ICONS.ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">ACCOUNT AANMAKEN</h2>
      </div>
      
      <div className="mb-10 text-center">
        <div className="w-24 h-24 bg-white rounded-[2.2rem] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-zinc-200/70">
          <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="daelyGradCreate" x1="0" y1="8" x2="0" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            <path d="M10,8 L64,8 L64,20 L50,74 L38,74 L52,20 L10,20 Z" fill="url(#daelyGradCreate)" />
            <path d="M26,22 L80,22 L80,34 L66,88 L54,88 L68,34 L26,34 Z" fill="url(#daelyGradCreate)" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-1">DAELY.</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-8">
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm hover:bg-zinc-50 transition-all shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Doorgaan met Google
        </button>
        <button onClick={handleAppleLogin} className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-2xl px-5 py-4 font-bold text-sm hover:bg-zinc-900 transition-all shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.79 2.45 0 4.36 1.17 5.51 3.12-4.79 2.67-3.85 8.96 1.07 10.86-1.03 2.6-2.68 5.12-5.25 5.12-.01 0-.01 0 0 0z"/>
            <path d="M12.03 7.25c-.15-3.22 2.61-5.91 5.83-6.12.33 3.44-2.82 6.36-5.83 6.12z"/>
          </svg>
          Doorgaan met Apple
        </button>
        <button onClick={handleAndroidLogin} className="w-full flex items-center justify-center gap-3 bg-[#3DDC84] text-black rounded-2xl px-5 py-4 font-bold text-sm hover:bg-[#35c273] transition-all shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.415.415 0 0 0-.1521-.5676.4162.4162 0 0 0-.5676.1521l-2.022 3.503C15.5902 8.244 13.8533 7.8512 12 7.8512s-3.5902.3928-5.1371 1.0995l-2.022-3.503a.4162.4162 0 0 0-.5676-.1521.415.415 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
          </svg>
          Doorgaan met Android
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-1 bg-zinc-200" />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">OF GEBRUIK E-MAIL</span>
        <div className="h-[1px] flex-1 bg-zinc-200" />
      </div>

      <form className="space-y-6" onSubmit={handleCreateAccount}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Accounttype *</label>
            <select
              value={formData.role}
              onChange={e => handleFormChange('role', e.target.value as UserRole)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              required
            >
              <option value="user">Sporter / Gebruiker</option>
              <option value="influencer">Influencer</option>
              <option value="partner">Partner</option>
              <option value="event_manager">Event Manager</option>
            </select>
          </div>
          {formData.role !== 'user' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Inlogcode *</label>
              <input
                type="text"
                placeholder="Code van DAELY"
                value={formData.code}
                onChange={e => handleFormChange('code', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                required={formData.role !== 'user'}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">E-mailadres *</label>
            <input 
              type="email"
              placeholder="jouw@email.com"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Wachtwoord *</label>
            <input 
              type="password" 
              placeholder="Wachtwoord" 
              value={formData.password}
              onChange={(e) => handleFormChange('password', e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
        </div>
        <Button type="submit" variant="logo" className="w-full py-5 text-base mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'ACCOUNT MAKEN...' : 'ACCOUNT AANMAKEN'}
        </Button>
      </form>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
  const { 
    activeThemeId, 
    setIsLoggedIn, 
    setIsCreatingAccount, 
    setIsForgotPassword 
  } = useAppContext();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const currentTheme = THEMES.find((theme) => theme.id === activeThemeId) || THEMES[0];

  const handleCredentialChange = (field: 'email' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Inloggen met Google mislukt');
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError('');
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Apple login error:", err);
      setError(err.message || 'Inloggen met Apple mislukt');
    }
  };

  const handleAndroidLogin = async () => {
    try {
      setError('');
      // Android login typically uses Google Play Games or just Google
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Android login error:", err);
      setError(err.message || 'Inloggen met Android mislukt');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, credentials.email.trim(), credentials.password);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Email login error:', err);
      setError(getAuthErrorMessage(err, 'Inloggen met e-mail is mislukt.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto animate-in fade-in duration-700 bg-[radial-gradient(90%_60%_at_20%_-10%,rgba(14,165,233,0.18)_0%,rgba(255,255,255,0)_60%),radial-gradient(80%_60%_at_90%_120%,rgba(37,99,235,0.15)_0%,rgba(255,255,255,0)_60%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl p-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto mb-5 flex items-center justify-center shadow-xl shadow-blue-100/70 border border-blue-50">
              <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="daelyGradLogin" x1="0" y1="8" x2="0" y2="88" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
                <path d="M10,8 L64,8 L64,20 L50,74 L38,74 L52,20 L10,20 Z" fill="url(#daelyGradLogin)" />
                <path d="M26,22 L80,22 L80,34 L66,88 L54,88 L68,34 L26,34 Z" fill="url(#daelyGradLogin)" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-1">DAELY.</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-zinc-400">Gezondheid · Kracht · Prestatie</p>
            <p className="mt-2 text-xs font-semibold" style={{ color: currentTheme.primary }}>
              Inloggen in je performance dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 font-bold text-sm hover:bg-zinc-50 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Doorgaan met Google
              </button>
              <button
                type="button"
                onClick={handleAppleLogin}
                className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-2xl px-5 py-4 font-bold text-sm hover:bg-zinc-900 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.79 2.45 0 4.36 1.17 5.51 3.12-4.79 2.67-3.85 8.96 1.07 10.86-1.03 2.6-2.68 5.12-5.25 5.12-.01 0-.01 0 0 0z"/>
                  <path d="M12.03 7.25c-.15-3.22 2.61-5.91 5.83-6.12.33 3.44-2.82 6.36-5.83 6.12z"/>
                </svg>
                Doorgaan met Apple
              </button>
              <button
                type="button"
                onClick={handleAndroidLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#3DDC84] text-black rounded-2xl px-5 py-4 font-bold text-sm hover:bg-[#35c273] transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.415.415 0 0 0-.1521-.5676.4162.4162 0 0 0-.5676.1521l-2.022 3.503C15.5902 8.244 13.8533 7.8512 12 7.8512s-3.5902.3928-5.1371 1.0995l-2.022-3.503a.4162.4162 0 0 0-.5676-.1521.415.415 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
                </svg>
                Doorgaan met Android
              </button>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-zinc-200" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">OF GEBRUIK E-MAIL</span>
              <div className="h-[1px] flex-1 bg-zinc-200" />
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="E-MAIL"
                value={credentials.email}
                onChange={(e) => handleCredentialChange('email', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                autoComplete="email"
                required
              />
              <input
                type="password"
                placeholder="WACHTWOORD"
                value={credentials.password}
                onChange={(e) => handleCredentialChange('password', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" variant="logo" className="w-full py-5 text-base mt-6" disabled={isSubmitting}>
              {isSubmitting ? 'INLOGGEN...' : 'INLOGGEN'}
            </Button>

            <div className="text-center pt-4 flex flex-col gap-3 items-center">
              <button
                type="button"
                onClick={() => setIsCreatingAccount(true)}
                className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                ACCOUNT AANMAKEN
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                WACHTWOORD VERGETEN
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-300 text-[8px] font-black uppercase tracking-[0.4em] mb-3">BEVEILIGDE TERMINAL ALPHA-1</p>
            <div className="flex gap-3 items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
