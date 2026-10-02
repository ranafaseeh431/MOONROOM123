export type CategoryId = 'breathe' | 'relax' | 'mind' | 'escape' | 'sleep' | 'reset' | 'distract';

export type ExerciseType = 
  | 'breathing' 
  | 'progressive_relaxation' 
  | 'body_scan'
  | 'guided_imagery' 
  | 'stepped_routine' 
  | 'thought_dump' 
  | 'worry_parking' 
  | 'tomorrow_box'
  | 'cognitive_shuffle' 
  | 'sensory_grounding' 
  | 'alphabet_game' 
  | 'word_association' 
  | 'mental_walk' 
  | 'slow_counter' 
  | 'quick_reset';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  authProvider: 'google' | 'email';
  createdAt: number;
}

export type BreathingVisualMode = 
  | 'circle' 
  | 'box' 
  | 'belly' 
  | 'extended' 
  | 'coherent' 
  | 'three_breaths' 
  | 'counting' 
  | 'ocean' 
  | 'cooling' 
  | 'whisper';

export interface Exercise {
  id: string;
  title: string;
  category: CategoryId;
  durationMinutes: number;
  purpose: string;
  description: string;
  type: ExerciseType;
  instructions: string[];
  breathingConfig?: {
    inhaleSeconds: number;
    holdSeconds?: number;
    exhaleSeconds: number;
    postHoldSeconds?: number;
    cycles?: number;
    visualMode?: BreathingVisualMode;
  };
  muscleGroups?: {
    name: string;
    action: string;
    release: string;
  }[];
  imageryScenes?: {
    theme: string;
    narrative: string[];
  };
  steps?: {
    title: string;
    instruction: string;
    subtext?: string;
  }[];
}

export type UserFeeling = 
  | 'sleep'
  | 'racing_mind'
  | 'restless_body'
  | 'overwhelmed'
  | 'relax'
  | 'distraction'
  | 'unknown';

export interface NeedOption {
  id: UserFeeling;
  label: string;
  subtitle: string;
  recommendedIds: string[];
}

export type FeedbackResponse = 'better' | 'same' | 'not_for_me';

export interface SessionHistoryItem {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  category: CategoryId;
  timestamp: number;
  completed: boolean;
  feedback?: FeedbackResponse;
}

export interface UserPreferences {
  favorites: string[];
  history: SessionHistoryItem[];
  dismissedNightlySuggestionDate?: string;
  feedbackMap: Record<string, FeedbackResponse>;
}
