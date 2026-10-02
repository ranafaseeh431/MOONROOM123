import React from 'react';
import { Clock, Bookmark, Sparkles, Moon, Compass, Heart, Trash2 } from 'lucide-react';
import { SessionHistoryItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { EXERCISES } from '../data/exercises';
import { loadPreferences, savePreferences } from '../services/storage';

interface ProgressViewProps {
  history: SessionHistoryItem[];
  favoritesCount: number;
  onClearHistory: () => void;
  onSelectExerciseById: (id: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  history,
  favoritesCount,
  onClearHistory,
  onSelectExerciseById,
}) => {
  // Exercises tried count (unique exercises tried)
  const uniqueExercisesTried = new Set(history.map((h) => h.exerciseId)).size;

  // Category usage breakdown
  const categoryCounts = history.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return `Tonight at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Title & Philosophy */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#f2f1ed]">
          Quiet moments
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa2b5]">
          A gentle record of your quiet time. No streaks to maintain. Come whenever you need.
        </p>
      </div>

      {/* Gentle Reassurance Banner */}
      <div className="p-5 rounded-2xl bg-[#0e1422]/90 border border-white/[0.06] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#182033] flex items-center justify-center shrink-0 text-[#c4b5fd]">
          <Moon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-medium text-[#f2f1ed]">
            Rest is not a competition
          </h2>
          <p className="text-xs text-[#9aa2b5] leading-relaxed">
            There are no scores, daily streaks, or penalties here. Moonroom exists solely as a quiet shelter whenever your night is difficult.
          </p>
        </div>
      </div>

      {/* Non-Judgmental Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e131d]/90 border border-white/[0.06] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#626b80]">
            Exercises Explored
          </span>
          <div className="font-mono text-3xl text-[#f2f1ed] tabular-nums font-light">
            {uniqueExercisesTried}
          </div>
          <p className="text-xs text-[#9aa2b5]">
            out of {EXERCISES.length} quiet practices
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e131d]/90 border border-white/[0.06] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#626b80]">
            Saved Places
          </span>
          <div className="font-mono text-3xl text-[#c4b5fd] tabular-nums font-light">
            {favoritesCount}
          </div>
          <p className="text-xs text-[#9aa2b5]">
            saved to your quiet places
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e131d]/90 border border-white/[0.06] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#626b80]">
            Sessions Completed
          </span>
          <div className="font-mono text-3xl text-[#f2f1ed] tabular-nums font-light">
            {history.length}
          </div>
          <p className="text-xs text-[#9aa2b5]">
            moments of quiet pause
          </p>
        </div>
      </div>

      {/* Most-Used Categories */}
      {sortedCategories.length > 0 && (
        <section className="p-5 rounded-2xl bg-[#0e131d]/80 border border-white/[0.06] space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9aa2b5]">
            Most-Visited Themes
          </h2>

          <div className="space-y-2">
            {sortedCategories.slice(0, 4).map(([catId, count]) => {
              const cat = CATEGORIES.find((c) => c.id === catId);
              const percentage = Math.round((count / history.length) * 100);
              return (
                <div key={catId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#f2f1ed] font-medium">{cat?.name || catId}</span>
                    <span className="text-[#626b80] font-mono tabular-nums">{count} {count === 1 ? 'time' : 'times'} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full bg-[#c4b5fd]/60 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Sessions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9aa2b5]">
            Recent Sessions
          </h2>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              aria-label="Clear session history"
              className="text-xs text-[#626b80] hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear history</span>
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="space-y-2">
            {history.slice(0, 10).map((item) => {
              const cat = CATEGORIES.find((c) => c.id === item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectExerciseById(item.exerciseId)}
                  className="p-3.5 rounded-xl bg-[#0e131d]/60 hover:bg-[#131a27] border border-white/[0.04] hover:border-white/[0.08] transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-[#f2f1ed] group-hover:text-white">
                      {item.exerciseTitle}
                    </div>
                    <div className="text-xs text-[#9aa2b5] flex items-center gap-1.5">
                      <span>{cat?.name || item.category}</span>
                      <span aria-hidden="true" className="opacity-40">·</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>

                  {item.feedback && (
                    <div className="text-[11px] font-serif italic text-[#b3aed8] opacity-80">
                      {item.feedback === 'better'
                        ? 'Felt a little better'
                        : item.feedback === 'same'
                        ? 'About the same'
                        : 'Not for me'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-[#9aa2b5]">
            No completed sessions recorded yet. Start any exercise when you are ready.
          </div>
        )}
      </section>
    </div>
  );
};
