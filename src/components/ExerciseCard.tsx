import React from 'react';
import { Bookmark, Clock, Play } from 'lucide-react';
import { Exercise } from '../types';
import { CATEGORIES } from '../data/categories';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorited: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (exercise: Exercise) => void;
  variant?: 'standard' | 'compact' | 'featured';
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorited,
  onToggleFavorite,
  onSelect,
  variant = 'standard',
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === exercise.category);

  return (
    <div
      onClick={() => onSelect(exercise)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(exercise);
        }
      }}
      className={`group relative text-left w-full rounded-2xl bg-[#0e131d]/85 hover:bg-[#131a27] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col justify-between ${
        variant === 'featured' ? 'md:col-span-2' : ''
      }`}
    >
      <div>
        {/* Unboxed Metadata Header (Zero-Pill Rule) */}
        <div className="flex items-center justify-between text-xs text-[#9aa2b5] mb-2.5">
          <div className="flex items-center gap-1.5 tracking-wide">
            <span className="uppercase text-[11px] font-medium tracking-wider text-[#b3aed8]">
              {categoryInfo?.name || exercise.category}
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
              <Clock className="w-3 h-3 text-[#626b80]" />
              {exercise.durationMinutes} min
            </span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(exercise.id, e);
            }}
            aria-label={isFavorited ? `Remove ${exercise.title} from favorites` : `Save ${exercise.title} to favorites`}
            className="min-w-[40px] min-h-[40px] -mr-2 -mt-2 flex items-center justify-center rounded-lg text-[#626b80] hover:text-[#f2f1ed] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <Bookmark
              className={`w-4 h-4 transition-transform duration-200 ${
                isFavorited
                  ? 'fill-[#c4b5fd] text-[#c4b5fd] scale-110'
                  : 'hover:scale-105'
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-[#f2f1ed] group-hover:text-white transition-colors leading-snug mb-1.5">
          {exercise.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#9aa2b5] line-clamp-2 leading-relaxed mb-4">
          {exercise.description}
        </p>
      </div>

      {/* Footer Info: Purpose & Quiet Launch Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs">
        <span className="text-[#626b80] truncate max-w-[200px] sm:max-w-xs">
          {exercise.purpose}
        </span>

        <span className="inline-flex items-center gap-1 text-[#b3aed8] group-hover:text-[#e0e6f5] font-medium transition-colors shrink-0 pl-2">
          <span>Begin</span>
          <Play className="w-3 h-3 fill-current" />
        </span>
      </div>
    </div>
  );
};
