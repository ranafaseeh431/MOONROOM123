import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Bookmark, Moon } from 'lucide-react';
import { Exercise, FeedbackResponse } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { BreathingEngine } from './BreathingEngine';
import { RelaxationEngine } from './RelaxationEngine';
import { GuidedImageryEngine } from './GuidedImageryEngine';
import { CognitiveShuffleEngine } from './CognitiveShuffleEngine';
import { ThoughtDumpEngine } from './ThoughtDumpEngine';
import { SensoryGroundingEngine } from './SensoryGroundingEngine';
import { SteppedRoutineEngine } from './SteppedRoutineEngine';
import { CognitiveGameEngine } from './CognitiveGameEngine';
import { ExerciseFeedbackModal } from './ExerciseFeedbackModal';

interface ExercisePlayerProps {
  exercise: Exercise;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSessionComplete: (exercise: Exercise, feedback?: FeedbackResponse) => void;
  onTryAnother: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  exercise,
  isFavorited,
  onToggleFavorite,
  onClose,
  onSessionComplete,
  onTryAnother,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const category = CATEGORIES.find((c) => c.id === exercise.category);

  // Track session duration gently
  useEffect(() => {
    if (isPaused || isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isCompleted]);

  const handleFinishExercise = () => {
    setIsCompleted(true);
  };

  const handleFeedback = (response: FeedbackResponse) => {
    onSessionComplete(exercise, response);
  };

  const handleDoneForTonight = () => {
    onClose();
  };

  // Subtle lunar progress representation: gentle crescent to full moon arc
  const totalEstimatedSeconds = exercise.durationMinutes * 60;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalEstimatedSeconds) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Player: ${exercise.title}`}
      className="fixed inset-0 z-50 bg-[#07090e]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto no-scrollbar"
    >
      {/* ====================================================
          TOP BAR: Category, Exercise title, Estimated duration
          ==================================================== */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between border-b border-white/[0.06] shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9aa2b5]">
            <span className="uppercase tracking-wider text-[11px] font-medium text-[#b3aed8]">
              {category?.name || exercise.category}
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="font-mono text-[11px] tabular-nums">
              {exercise.durationMinutes} min
            </span>
          </div>
          <h1 className="font-serif text-base sm:text-lg text-[#f2f1ed] truncate max-w-[220px] sm:max-w-md">
            {exercise.title}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(exercise.id)}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isFavorited ? 'fill-[#c4b5fd] text-[#c4b5fd]' : ''
              }`}
            />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Exit exercise"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ====================================================
          CENTER: The actual interactive exercise
          ==================================================== */}
      <main className="flex-1 flex items-center justify-center py-6 px-4">
        {isCompleted ? (
          <ExerciseFeedbackModal
            exerciseTitle={exercise.title}
            onFeedback={handleFeedback}
            onTryAnother={onTryAnother}
            onDoneForTonight={handleDoneForTonight}
          />
        ) : (
          <>
            {exercise.type === 'breathing' && (
              <BreathingEngine
                exercise={exercise}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(!isPaused)}
                onComplete={handleFinishExercise}
              />
            )}

            {(exercise.type === 'progressive_relaxation' || exercise.type === 'body_scan') && (
              <RelaxationEngine
                exercise={exercise}
                isPaused={isPaused}
                onComplete={handleFinishExercise}
              />
            )}

            {exercise.type === 'guided_imagery' && (
              <GuidedImageryEngine
                exercise={exercise}
                isPaused={isPaused}
                onComplete={handleFinishExercise}
              />
            )}

            {exercise.type === 'cognitive_shuffle' && (
              <CognitiveShuffleEngine
                exercise={exercise}
                isPaused={isPaused}
                onComplete={handleFinishExercise}
              />
            )}

            {(exercise.type === 'thought_dump' || exercise.type === 'worry_parking' || exercise.type === 'tomorrow_box') && (
              <ThoughtDumpEngine
                exercise={exercise}
                onComplete={handleFinishExercise}
              />
            )}

            {exercise.type === 'sensory_grounding' && (
              <SensoryGroundingEngine
                exercise={exercise}
                onComplete={handleFinishExercise}
              />
            )}

            {(exercise.type === 'stepped_routine' || exercise.type === 'quick_reset') && (
              <SteppedRoutineEngine
                exercise={exercise}
                onComplete={handleFinishExercise}
              />
            )}

            {(exercise.type === 'alphabet_game' || exercise.type === 'word_association' || exercise.type === 'slow_counter' || exercise.type === 'mental_walk') && (
              <CognitiveGameEngine
                exercise={exercise}
                onComplete={handleFinishExercise}
              />
            )}
          </>
        )}
      </main>

      {/* ====================================================
          BOTTOM: Pause, Exit, Subtle Moon-Phase Progress
          (Hidden on completed feedback screen)
          ==================================================== */}
      {!isCompleted && (
        <footer className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between border-t border-white/[0.06] pb-safe shrink-0">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume exercise' : 'Pause exercise'}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] transition-colors flex items-center gap-2 border border-white/[0.06]"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Subtle Moon-Phase Progress Indicator (No aggressive bars!) */}
          <div className="flex items-center gap-2 text-xs text-[#9aa2b5]" title={`Session progress: ${progressPercent}%`}>
            {/* Subtle lunar phase circle */}
            <div className="relative w-4 h-4 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 bg-[#c4b5fd]/60 rounded-full transition-all duration-1000"
                style={{
                  clipPath: `polygon(0% 0%, ${progressPercent}% 0%, ${progressPercent}% 100%, 0% 100%)`,
                }}
              />
              <Moon className="w-2.5 h-2.5 text-white/80 relative z-10" />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-[#626b80]">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Exit Button */}
          <button
            onClick={onClose}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium text-[#626b80] hover:text-[#9aa2b5] transition-colors"
          >
            Exit
          </button>
        </footer>
      )}
    </div>
  );
};
