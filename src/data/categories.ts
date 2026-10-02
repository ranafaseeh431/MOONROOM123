import { CategoryId } from '../types';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortDesc: string;
  description: string;
  iconName: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'breathe',
    name: 'Breathe',
    shortDesc: 'Cadenced respiration to settle autonomic arousal',
    description: 'Gentle, pacing breathwork designed to lower physical tension without forceful holds.',
    iconName: 'Wind',
  },
  {
    id: 'relax',
    name: 'Relax',
    shortDesc: 'Systematic release of physical holding patterns',
    description: 'Gentle progressive releases and body scans to dissolve the unconscious tension in jaw, shoulders, and hands.',
    iconName: 'Sparkles',
  },
  {
    id: 'mind',
    name: 'Quiet the Mind',
    shortDesc: 'Gentle cognitive unhooking for looping thoughts',
    description: 'Unclutter repetitive nighttime worries and create healthy emotional distance without analyzing them.',
    iconName: 'Moon',
  },
  {
    id: 'escape',
    name: 'Escape',
    shortDesc: 'Immersive guided visual environments',
    description: 'Subtle atmospheric landscapes with quiet narrative guidance to let the room fade softly away.',
    iconName: 'Compass',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    shortDesc: 'Gradual multi-step wind down routines',
    description: 'Paced bedtime transitions to transition from active wakefulness into restful surrender.',
    iconName: 'BedDouble',
  },
  {
    id: 'reset',
    name: 'Reset',
    shortDesc: 'Quick grounding for moments of overwhelm',
    description: 'Practical, sensory orienting exercises for sudden nighttime spikes of anxious adrenaline.',
    iconName: 'Compass',
  },
  {
    id: 'distract',
    name: 'Distract',
    shortDesc: 'Non-competitive, neutral mental tasks',
    description: 'Calm cognitive puzzles that occupy the language center of the brain so sleep can take over.',
    iconName: 'Layers',
  },
];
