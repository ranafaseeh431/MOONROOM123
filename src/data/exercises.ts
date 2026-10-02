import { Exercise } from '../types';
import { BREATHE_EXERCISES } from './exercises/breathe';
import { RELAX_EXERCISES } from './exercises/relax';
import { MIND_EXERCISES } from './exercises/mind';
import { ESCAPE_EXERCISES } from './exercises/escape';
import { SLEEP_EXERCISES } from './exercises/sleep';
import { RESET_EXERCISES } from './exercises/reset';
import { DISTRACT_EXERCISES } from './exercises/distract';

export const EXERCISES: Exercise[] = [
  ...BREATHE_EXERCISES,
  ...RELAX_EXERCISES,
  ...MIND_EXERCISES,
  ...ESCAPE_EXERCISES,
  ...SLEEP_EXERCISES,
  ...RESET_EXERCISES,
  ...DISTRACT_EXERCISES,
];
