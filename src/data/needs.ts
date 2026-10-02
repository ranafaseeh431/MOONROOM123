import { NeedOption, UserFeeling } from '../types';

export const USER_NEEDS: NeedOption[] = [
  {
    id: 'sleep',
    label: 'I want to sleep',
    subtitle: 'Routines and deep physical releases to help drift off',
    recommendedIds: [
      'relax-full-pmr',
      'breathe-extended-exhale',
      'sleep-10-min-wind-down',
      'escape-moonlit-lake',
      'relax-full-body-scan',
    ],
  },
  {
    id: 'racing_mind',
    label: 'My mind won’t stop',
    subtitle: 'Unhooking obsessive loops and midnight planning',
    recommendedIds: [
      'mind-cognitive-shuffle',
      'mind-thought-dump',
      'mind-worry-parking',
      'escape-starry-field',
      'breathe-diaphragmatic',
    ],
  },
  {
    id: 'restless_body',
    label: 'My body feels restless',
    subtitle: 'Releasing physical tension, heavy limbs, and tight muscles',
    recommendedIds: [
      'relax-shoulders-neck',
      'relax-full-pmr',
      'breathe-cooling-lunar',
      'relax-heavy-body',
      'reset-ground-feet',
    ],
  },
  {
    id: 'overwhelmed',
    label: 'I feel overwhelmed',
    subtitle: 'Gentle somatic grounding for racing sensations',
    recommendedIds: [
      'reset-60-sec',
      'mind-five-sense-grounding',
      'breathe-three-slow',
      'relax-full-body-scan',
      'escape-rainy-window',
    ],
  },
  {
    id: 'relax',
    label: 'I want to relax',
    subtitle: 'Subtle decompression with no rush or expectation',
    recommendedIds: [
      'breathe-gentle-4-6',
      'relax-face-jaw',
      'escape-warm-bedroom',
      'relax-hands-arms',
      'relax-warm-body',
    ],
  },
  {
    id: 'distraction',
    label: 'I need a distraction',
    subtitle: 'Gentle, non-competitive mental tasks that occupy verbal loops',
    recommendedIds: [
      'distract-alphabet-categories',
      'distract-word-association',
      'distract-mental-walk',
      'mind-cognitive-shuffle',
      'escape-empty-train',
    ],
  },
  {
    id: 'unknown',
    label: 'I don’t know',
    subtitle: 'That’s okay. Let’s try something gentle.',
    recommendedIds: [
      'breathe-three-slow',
      'relax-shoulder-drop',
      'escape-starry-field',
      'relax-warm-body',
    ],
  },
];

export interface NightlySuggestion {
  cue: string;
  exerciseId: string;
  duration: string;
  reason: string;
}

export const NIGHTLY_SUGGESTIONS: NightlySuggestion[] = [
  {
    cue: 'Your mind sounds busy.',
    exerciseId: 'mind-cognitive-shuffle',
    duration: '6 min',
    reason: 'Drift across calm, random words to break looping logic.',
  },
  {
    cue: 'Night carries too much weight.',
    exerciseId: 'relax-shoulders-neck',
    duration: '6 min',
    reason: 'Drop the unconscious holding pattern in your neck and trapezius.',
  },
  {
    cue: 'Seeking a calm horizon.',
    exerciseId: 'escape-starry-field',
    duration: '10 min',
    reason: 'Lie back in quiet open grass under steady stars.',
  },
  {
    cue: 'Just three deep breaths.',
    exerciseId: 'breathe-three-slow',
    duration: '2 min',
    reason: 'Mark a clean, gentle boundary between today and the quiet night.',
  },
  {
    cue: 'Nothing needs solving tonight.',
    exerciseId: 'sleep-nothing-needs-solving',
    duration: '5 min',
    reason: 'Allow your analytical problem-solver to safely go to sleep.',
  },
];
