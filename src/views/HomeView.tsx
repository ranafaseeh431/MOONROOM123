import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, ChevronRight, Moon, RefreshCw } from 'lucide-react';
import { Exercise, NeedOption, UserFeeling } from '../types';
import { USER_NEEDS, NIGHTLY_SUGGESTIONS, NightlySuggestion } from '../data/needs';
import { EXERCISES } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { isNightlySuggestionDismissed, dismissNightlySuggestion } from '../services/storage';

interface HomeViewProps {
  onSelectExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  recentExercises: Exercise[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectExercise,
  favorites,
  onToggleFavorite,
  recentExercises,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<UserFeeling | null>(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState<boolean>(() => isNightlySuggestionDismissed());

  // Determine tonight's suggestion
  const todaySuggestion: NightlySuggestion = NIGHTLY_SUGGESTIONS[0];
  const suggestedExercise = EXERCISES.find((e) => e.id === todaySuggestion.exerciseId) || EXERCISES[0];

  const handleDismissSuggestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissNightlySuggestion();
    setSuggestionDismissed(true);
  };

  const activeNeedOption = USER_NEEDS.find((n) => n.id === selectedFeeling);
  const recommendedExercises = activeNeedOption
    ? activeNeedOption.recommendedIds
        .map((id) => EXERCISES.find((e) => e.id === id))
        .filter((e): e is Exercise => !!e)
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* ====================================================
          HERO SECTION: Quiet Nighttime Scene
          ==================================================== */}
      <section className="text-center pt-8 sm:pt-14 pb-4 space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#f2f1ed] tracking-tight font-normal">
          Moonroom
        </h1>
        <p className="font-serif text-lg sm:text-xl text-[#9aa2b5] italic max-w-md mx-auto">
          “A quiet place for a restless mind.”
        </p>
      </section>

      {/* ====================================================
          TONIGHT'S OPTIONAL SUGGESTION (No streaks! Dismissible)
          ==================================================== */}
      {!suggestionDismissed && suggestedExercise && !selectedFeeling && (
        <section aria-label="Tonight's suggestion" className="max-w-xl mx-auto">
          <div className="relative p-5 rounded-2xl bg-[#0f1523]/80 border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1 pr-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#b3aed8] block">
                  Tonight’s suggestion
                </span>
                <h3 className="font-serif text-xl text-[#f2f1ed]">
                  “{todaySuggestion.cue}”
                </h3>
                <p className="text-xs sm:text-sm text-[#9aa2b5]">
                  {todaySuggestion.reason}
                </p>
              </div>

              <button
                onClick={handleDismissSuggestion}
                aria-label="Dismiss suggestion"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center -mr-2 -mt-2 text-[#626b80] hover:text-[#f2f1ed] transition-colors rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-xs text-[#626b80]">
                {suggestedExercise.title} · {suggestedExercise.durationMinutes} min
              </span>

              <button
                onClick={() => onSelectExercise(suggestedExercise)}
                className="text-xs font-medium text-[#c4b5fd] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Try this now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================
          WHAT DO YOU NEED RIGHT NOW? (The 7 Choices)
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f2f1ed]">
            {selectedFeeling ? 'Gentle suggestions for tonight' : 'What do you need right now?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9aa2b5]">
            {selectedFeeling
              ? activeNeedOption?.id === 'unknown'
                ? 'That’s okay. Let’s try something gentle.'
                : activeNeedOption?.subtitle
              : 'Choose whatever resonates, or choose not to know.'}
          </p>
        </div>

        {selectedFeeling ? (
          /* Recommended Exercises for Selected Need */
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs text-[#9aa2b5]">
                Showing exercises for <strong className="text-[#f2f1ed] font-medium">“{activeNeedOption?.label}”</strong>
              </span>

              <button
                onClick={() => setSelectedFeeling(null)}
                className="text-xs text-[#c4b5fd] hover:text-white underline underline-offset-4 transition-colors"
              >
                Choose something else
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isFavorited={favorites.includes(exercise.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectExercise}
                />
              ))}
            </div>
          </div>
        ) : (
          /* The Seven Choices Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {USER_NEEDS.map((need) => (
              <button
                key={need.id}
                onClick={() => setSelectedFeeling(need.id)}
                className={`w-full min-h-[56px] p-4 text-left rounded-xl transition-all duration-200 border flex items-center justify-between group ${
                  need.id === 'unknown'
                    ? 'sm:col-span-2 bg-[#0e1422]/90 border-[#c4b5fd]/20 hover:border-[#c4b5fd]/50 hover:bg-[#131c30]'
                    : 'bg-[#0e131d]/80 border-white/[0.06] hover:border-white/[0.16] hover:bg-[#131a27]'
                }`}
              >
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-[#f2f1ed] group-hover:text-white transition-colors">
                    {need.label}
                  </h3>
                  <p className="text-xs text-[#9aa2b5] line-clamp-1 mt-0.5">
                    {need.subtitle}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-[#626b80] group-hover:text-[#c4b5fd] group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ====================================================
          RECENT QUIET SESSIONS (If available)
          ==================================================== */}
      {recentExercises.length > 0 && !selectedFeeling && (
        <section className="pt-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <h3 className="text-xs font-medium uppercase tracking-wider text-[#9aa2b5]">
              Recently visited
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentExercises.slice(0, 3).map((exercise) => (
              <ExerciseCard
                key={`recent-${exercise.id}`}
                exercise={exercise}
                variant="compact"
                isFavorited={favorites.includes(exercise.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectExercise}
              />
            ))}
          </div>
        </section>
      )}

      {/* Subtle signature line */}
      <div className="pt-8 pb-2 text-center pointer-events-none">
        <p className="text-[11px] text-[#626b80]/60 font-sans tracking-wide select-none">
          Made with care, by Faseeh.
        </p>
      </div>
    </div>
  );
};
