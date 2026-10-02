import { FeedbackResponse, SessionHistoryItem, UserPreferences } from '../types';
import { getCurrentUser } from './auth';

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

export function toggleFavorite(exerciseId: string, userId?: string): boolean {
  const prefs = loadPreferences(userId);
  const index = prefs.favorites.indexOf(exerciseId);
  let isFav = false;
  if (index > -1) {
    prefs.favorites.splice(index, 1);
    isFav = false;
  } else {
    prefs.favorites.unshift(exerciseId);
    isFav = true;
  }
  savePreferences(prefs, userId);
  return isFav;
}

export function isFavorite(exerciseId: string, userId?: string): boolean {
  const prefs = loadPreferences(userId);
  return prefs.favorites.includes(exerciseId);
}

export function recordSession(session: Omit<SessionHistoryItem, 'id' | 'timestamp'>, userId?: string): void {
  const prefs = loadPreferences(userId);
  const item: SessionHistoryItem = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
  };
  // Keep last 100 sessions
  prefs.history = [item, ...prefs.history.slice(0, 99)];
  savePreferences(prefs, userId);
}

export function recordFeedback(exerciseId: string, feedback: FeedbackResponse, userId?: string): void {
  const prefs = loadPreferences(userId);
  prefs.feedbackMap[exerciseId] = feedback;
  const recent = prefs.history.find(h => h.exerciseId === exerciseId);
  if (recent) {
    recent.feedback = feedback;
  }
  savePreferences(prefs, userId);
}

export function isNightlySuggestionDismissed(userId?: string): boolean {
  const prefs = loadPreferences(userId);
  if (!prefs.dismissedNightlySuggestionDate) return false;
  const today = new Date().toDateString();
  return prefs.dismissedNightlySuggestionDate === today;
}

export function dismissNightlySuggestion(userId?: string): void {
  const prefs = loadPreferences(userId);
  prefs.dismissedNightlySuggestionDate = new Date().toDateString();
  savePreferences(prefs, userId);
}
