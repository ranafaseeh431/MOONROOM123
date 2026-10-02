import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { Exercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';

interface FavoritesViewProps {
  favoriteIds: string[];
  onSelectExercise: (exercise: Exercise) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBrowseLibrary: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  onSelectExercise,
  onToggleFavorite,
  onBrowseLibrary,
}) => {
  const favoriteExercises = EXERCISES.filter((ex) => favoriteIds.includes(ex.id));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Title & Description */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#f2f1ed]">
          Your quiet places
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa2b5]">
          A personal collection of exercises to return to when sleep is elusive.
        </p>
      </div>

      {favoriteExercises.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs text-[#626b80] font-mono tabular-nums pb-2 border-b border-white/[0.04]">
            {favoriteExercises.length} {favoriteExercises.length === 1 ? 'saved place' : 'saved places'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorited={true}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectExercise}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0e131d]/60 border border-white/[0.04] space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-[#9aa2b5]">
            <Bookmark className="w-5 h-5 text-[#c4b5fd]" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-xl text-[#f2f1ed]">
              No quiet places saved yet
            </h2>
            <p className="text-xs text-[#9aa2b5] leading-relaxed">
              When you find an exercise that brings ease to your mind or body, tap the bookmark icon to keep it here.
            </p>
          </div>

          <button
            onClick={onBrowseLibrary}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium border border-white/[0.08] transition-colors"
          >
            Explore the Library
          </button>
        </div>
      )}
    </div>
  );
};
