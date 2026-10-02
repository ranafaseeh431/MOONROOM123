import { UserProfile } from '../types';

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

export async function loginWithGoogle(overrideEmail?: string): Promise<UserProfile> {
  const users = getRegisteredUsers();
  const targetEmail = (overrideEmail || 'ranafaseeh431@gmail.com').toLowerCase().trim();
  
  let existing = users.find(u => u.email.toLowerCase() === targetEmail);
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
  return profile;
}

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const users = getRegisteredUsers();
  const cleanEmail = email.toLowerCase().trim();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

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

export async function createAccount(
  email: string,
  password: string,
  username: string
): Promise<UserProfile> {
  const users = getRegisteredUsers();
  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = username.trim() || 'Night Traveler';

  if (!cleanEmail.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters.');
  }

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
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
  return profile;
}

export async function resetPassword(email: string): Promise<string> {
  const cleanEmail = email.toLowerCase().trim();
  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!existing) {
    throw new Error('We could not find an account with that email.');
  }

  return `A reset link has been prepared for ${cleanEmail}. Check your inbox quietly.`;
}

export function logout(): void {
  setCurrentUser(null);
}
