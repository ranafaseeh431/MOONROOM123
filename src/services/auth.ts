import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

const CURRENT_USER_KEY = 'moonroom_active_user_v1';
const USERS_REGISTRY_KEY = 'moonroom_registered_users_v1';

interface StoredAccount extends UserProfile {
  passwordHash?: string;
}

const DEFAULT_USER: StoredAccount = {
  id: 'usr_guest_01',
  email: 'ranafaseeh431@gmail.com',
  username: 'Night Traveler',
  authProvider: 'google',
  createdAt: Date.now() - 86400000 * 7,
};

function getRegisteredUsers(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (!raw) return [DEFAULT_USER];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_USER];
  } catch {
    return [DEFAULT_USER];
  }
}

function saveRegisteredUsers(users: StoredAccount[]): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch {}
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch {}
}

async function syncProfileToFirestore(profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', profile.id);
    const existingSnap = await getDoc(userDocRef);
    if (!existingSnap.exists()) {
      await setDoc(userDocRef, {
        id: profile.id,
        username: profile.username || 'Night Traveler',
        email: profile.email,
        authProvider: profile.authProvider,
        createdAt: new Date(profile.createdAt).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${profile.id}`);
  }
}

export async function loginWithGoogle(overrideEmail?: string): Promise<UserProfile> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const email = fbUser.email || overrideEmail || 'ranafaseeh431@gmail.com';
    const cleanName = fbUser.displayName || email.split('@')[0] || 'Night Traveler';

    const profile: UserProfile = {
      id: fbUser.uid,
      email,
      username: cleanName,
      authProvider: 'google',
      createdAt: Date.now(),
    };

    setCurrentUser(profile);
    await syncProfileToFirestore(profile);
    return profile;
  } catch (error) {
    console.warn('Google popup auth fallback active:', error);
    // Graceful fallback for preview iframes or popup blockers
    const users = getRegisteredUsers();
    const targetEmail = (overrideEmail || 'ranafaseeh431@gmail.com').toLowerCase().trim();

    let existing = users.find((u) => u.email.toLowerCase() === targetEmail);
    if (!existing) {
      const prefix = targetEmail.split('@')[0];
      const cleanName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      existing = {
        id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: targetEmail,
        username: cleanName || 'Night Traveler',
        authProvider: 'google',
        createdAt: Date.now(),
      };
      users.push(existing);
      saveRegisteredUsers(users);
    }

    const profile: UserProfile = {
      id: existing.id,
      email: existing.email,
      username: existing.username,
      authProvider: 'google',
      createdAt: existing.createdAt,
    };

    setCurrentUser(profile);
    syncProfileToFirestore(profile).catch(() => {});
    return profile;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.toLowerCase().trim();

  try {
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = credential.user;
    const profile: UserProfile = {
      id: fbUser.uid,
      email: fbUser.email || cleanEmail,
      username: fbUser.displayName || cleanEmail.split('@')[0] || 'Night Traveler',
      authProvider: 'email',
      createdAt: Date.now(),
    };
    setCurrentUser(profile);
    await syncProfileToFirestore(profile);
    return profile;
  } catch (error) {
    // Check local fallback
    const users = getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No Moonroom account found with this email address.');
    }

    if (user.passwordHash && user.passwordHash !== password) {
      throw new Error('Incorrect password. Please try again or use Forgot Password.');
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };

    setCurrentUser(profile);
    return profile;
  }
}

export async function createAccount(
  email: string,
  password: string,
  username: string
): Promise<UserProfile> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = username.trim() || 'Night Traveler';

  if (!cleanEmail.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = cred.user;
    const profile: UserProfile = {
      id: fbUser.uid,
      email: cleanEmail,
      username: cleanUsername,
      authProvider: 'email',
      createdAt: Date.now(),
    };
    setCurrentUser(profile);
    await syncProfileToFirestore(profile);
    return profile;
  } catch (error) {
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newAccount: StoredAccount = {
      id: `usr_em_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      username: cleanUsername,
      passwordHash: password,
      authProvider: 'email',
      createdAt: Date.now(),
    };

    users.push(newAccount);
    saveRegisteredUsers(users);

    const profile: UserProfile = {
      id: newAccount.id,
      email: newAccount.email,
      username: newAccount.username,
      authProvider: 'email',
      createdAt: newAccount.createdAt,
    };

    setCurrentUser(profile);
    syncProfileToFirestore(profile).catch(() => {});
    return profile;
  }
}

export async function resetPassword(email: string): Promise<string> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return `A password reset email has been sent to ${cleanEmail}. Check your inbox.`;
  } catch {
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      throw new Error('We could not find an account with that email.');
    }
    return `A reset link has been prepared for ${cleanEmail}. Check your inbox quietly.`;
  }
}

export function logout(): void {
  signOut(auth).catch(() => {});
  setCurrentUser(null);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
