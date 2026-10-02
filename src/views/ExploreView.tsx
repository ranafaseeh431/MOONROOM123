import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CategoryId, Exercise } from '../types';
import { CATEGORIES } from '../data/categories';
import { EXERCISES } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';

type DurationFilter = 'all' | 'under5' | '5to10' | '10to20' | 'over20';

interface ExploreViewProps {
  onSelectExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  initialCategory?: CategoryId;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectExercise,
  favorites,
  onToggleFavorite,
  initialCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory || 'all');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      // Category filter
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
        return false;
      }

      // Duration filter
      if (durationFilter === 'under5' && ex.durationMinutes >= 5) return false;
      if (durationFilter === '5to10' && (ex.durationMinutes < 5 || ex.durationMinutes > 10)) return false;
      if (durationFilter === '10to20' && (ex.durationMinutes < 10 || ex.durationMinutes > 20)) return false;
      if (durationFilter === 'over20' && ex.durationMinutes < 20) return false;

      // Text search (name, purpose, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = ex.title.toLowerCase().includes(query);
        const matchesPurpose = ex.purpose.toLowerCase().includes(query);
        const matchesDesc = ex.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPurpose && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, durationFilter, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Title & Description */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#f2f1ed]">
          The Library
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa2b5]">
          A collection of gentle practices for body, breath, mind, and sleep.
        </p>
      </div>

      {/* ====================================================
          SEARCH & FILTER BAR
          ==================================================== */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#626b80] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, purposes, or thoughts (e.g. 'racing thoughts', 'jaw', 'breath')..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#0e131d]/90 border border-white/[0.08] text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-white/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626b80] hover:text-[#f2f1ed] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Segmented Tabs (Constitutional Interactive Button Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
              selectedCategory === 'all'
                ? 'bg-white/[0.14] text-[#f2f1ed]'
                : 'bg-white/[0.03] text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.06]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
                selectedCategory === cat.id
                  ? 'bg-white/[0.14] text-[#f2f1ed]'
                  : 'bg-white/[0.03] text-[#9aa2b5] hover:text-[#f2f1ed] hover:bg-white/[0.06]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Duration Filters */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-[#626b80] text-[11px] uppercase tracking-wider font-mono">
            Duration:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as DurationFilter, label: 'Any' },
              { id: 'under5' as DurationFilter, label: '< 5 min' },
              { id: '5to10' as DurationFilter, label: '5–10 min' },
              { id: '10to20' as DurationFilter, label: '10–20 min' },
              { id: 'over20' as DurationFilter, label: '20+ min' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDurationFilter(d.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  durationFilter === d.id
                    ? 'bg-white/[0.1] text-[#f2f1ed] font-medium'
                    : 'text-[#626b80] hover:text-[#9aa2b5]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================
          EXERCISE RESULTS GRID
          ==================================================== */}
      <div className="space-y-4">
        {/* Count Indicator */}
        <div className="flex items-center justify-between text-xs text-[#626b80] font-mono tabular-nums pb-2 border-b border-white/[0.04]">
          <span>
            {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
          </span>
          {(selectedCategory !== 'all' || durationFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDurationFilter('all');
                setSearchQuery('');
              }}
              className="text-[#c4b5fd] hover:underline font-sans"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorited={favorites.includes(exercise.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectExercise}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#0e131d]/50 border border-white/[0.04] space-y-3">
            <p className="font-serif text-lg text-[#f2f1ed]">
              No quiet places match your search.
            </p>
            <p className="text-xs text-[#9aa2b5] max-w-sm mx-auto">
              Try adjusting your duration filter or searching for broader terms like "breath" or "release".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
