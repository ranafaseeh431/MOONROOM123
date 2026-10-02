import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { FeedbackResponse, SessionHistoryItem, UserPreferences } from '../types';
import { getCurrentUser } from './auth';
import { db, handleFirestoreError, OperationType } from './firebase';

const BASE_STORAGE_KEY = 'moonroom_user_preferences_v1';

function getStorageKey(userId?: string): string {
  const activeId = userId || getCurrentUser()?.id;
  return activeId ? `${BASE_STORAGE_KEY}_${activeId}` : BASE_STORAGE_KEY;
}

const defaultPreferences: UserPreferences = {
  favorites: [
    'mind-cognitive-shuffle',
    'breathe-extended-exhale',
    'escape-starry-field',
    'relax-full-pmr',
  ],
  history: [],
  feedbackMap: {},
};

export function loadPreferences(userId?: string): UserPreferences {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw);
    return {
      ...defaultPreferences,
      ...parsed,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : defaultPreferences.favorites,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      feedbackMap: parsed.feedbackMap || {},
    };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(prefs: UserPreferences, userId?: string): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(prefs));
  } catch {
    // Gracefully handle storage quota or incognito restrictions
  }
}

export async function syncPreferencesWithFirestore(userId?: string): Promise<UserPreferences> {
  const targetId = userId || getCurrentUser()?.id;
  const current = loadPreferences(targetId);
  if (!targetId) return current;

  try {
    // 1. Fetch remote favorites
    const favCol = collection(db, 'users', targetId, 'favorites');
    const favSnap = await getDocs(favCol);
    const remoteFavs: string[] = [];
    favSnap.forEach((d) => {
      const data = d.data();
      if (data.exerciseId) remoteFavs.push(data.exerciseId);
    });

    // Merge favorites uniquely
    const mergedFavs = Array.from(new Set([...current.favorites, ...remoteFavs]));

    // 2. Fetch remote recent sessions
    const recentCol = collection(db, 'users', targetId, 'recent');
    const recentSnap = await getDocs(recentCol);
    const remoteSessions: SessionHistoryItem[] = [];
    recentSnap.forEach((d) => {
      const data = d.data();
      if (data.id && data.exerciseId) {
        remoteSessions.push({
          id: data.id,
          exerciseId: data.exerciseId,
          exerciseTitle: data.exerciseTitle || 'Session',
          category: data.category || 'relax',
          timestamp: data.timestamp || Date.now(),
          completed: data.completed ?? true,
          feedback: data.feedback as FeedbackResponse,
        });
      }
    });

    // Merge sessions by ID
    const sessionMap = new Map<string, SessionHistoryItem>();
    [...current.history, ...remoteSessions].forEach((s) => {
      sessionMap.set(s.id, s);
    });
    const mergedHistory = Array.from(sessionMap.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);

    const updated: UserPreferences = {
      ...current,
      favorites: mergedFavs,
      history: mergedHistory,
    };

    savePreferences(updated, targetId);
    return updated;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${targetId}`);
    return current;
  }
}

export function toggleFavorite(exerciseId: string, userId?: string): boolean {
  const targetId = userId || getCurrentUser()?.id;
  const prefs = loadPreferences(targetId);
  const index = prefs.favorites.indexOf(exerciseId);
  let isFav = false;
  if (index > -1) {
    prefs.favorites.splice(index, 1);
    isFav = false;
  } else {
    prefs.favorites.unshift(exerciseId);
    isFav = true;
  }
  savePreferences(prefs, targetId);

  // Firestore sync in background
  if (targetId) {
    const favDocRef = doc(db, 'users', targetId, 'favorites', exerciseId);
    if (isFav) {
      setDoc(favDocRef, {
        exerciseId,
        addedAt: Date.now(),
      }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${targetId}/favorites/${exerciseId}`);
      });
    } else {
      deleteDoc(favDocRef).catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `users/${targetId}/favorites/${exerciseId}`);
      });
    }
  }

  return isFav;
}

export function isFavorite(exerciseId: string, userId?: string): boolean {
  const prefs = loadPreferences(userId);
  return prefs.favorites.includes(exerciseId);
}

export function recordSession(session: Omit<SessionHistoryItem, 'id' | 'timestamp'>, userId?: string): void {
  const targetId = userId || getCurrentUser()?.id;
  const prefs = loadPreferences(targetId);
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const item: SessionHistoryItem = {
    ...session,
    id: sessionId,
    timestamp: Date.now(),
  };
  // Keep last 100 sessions
  prefs.history = [item, ...prefs.history.slice(0, 99)];
  savePreferences(prefs, targetId);

  // Firestore sync in background
  if (targetId) {
    const sessionDocRef = doc(db, 'users', targetId, 'recent', sessionId);
    setDoc(sessionDocRef, {
      id: sessionId,
      exerciseId: item.exerciseId,
      exerciseTitle: item.exerciseTitle,
      category: item.category,
      timestamp: item.timestamp,
      completed: item.completed,
      ...(item.feedback ? { feedback: item.feedback } : {}),
    }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetId}/recent/${sessionId}`);
    });
  }
}

export function recordFeedback(exerciseId: string, feedback: FeedbackResponse, userId?: string): void {
  const targetId = userId || getCurrentUser()?.id;
  const prefs = loadPreferences(targetId);
  prefs.feedbackMap[exerciseId] = feedback;
  const recent = prefs.history.find((h) => h.exerciseId === exerciseId);
  if (recent) {
    recent.feedback = feedback;
  }
  savePreferences(prefs, targetId);

  // Firestore sync in background
  if (targetId) {
    const feedbackDocRef = doc(db, 'users', targetId, 'feedback', exerciseId);
    setDoc(feedbackDocRef, {
      exerciseId,
      feedback,
      updatedAt: Date.now(),
    }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetId}/feedback/${exerciseId}`);
    });
  }
}

export function isNightlySuggestionDismissed(userId?: string): boolean {
  const prefs = loadPreferences(userId);
  if (!prefs.dismissedNightlySuggestionDate) return false;
  const today = new Date().toDateString();
  return prefs.dismissedNightlySuggestionDate === today;
}

export function dismissNightlySuggestion(userId?: string): void {
  const targetId = userId || getCurrentUser()?.id;
  const prefs = loadPreferences(targetId);
  const today = new Date().toDateString();
  prefs.dismissedNightlySuggestionDate = today;
  savePreferences(prefs, targetId);

  // Firestore sync in background
  if (targetId) {
    const prefDocRef = doc(db, 'users', targetId, 'preferences', 'general');
    setDoc(prefDocRef, {
      dismissedNightlySuggestionDate: today,
      updatedAt: Date.now(),
    }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetId}/preferences/general`);
    });
  }
}
