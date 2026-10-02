import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Exercise } from '../../types';

interface GuidedImageryEngineProps {
  exercise: Exercise;
  isPaused: boolean;
  onComplete: () => void;
}

export const GuidedImageryEngine: React.FC<GuidedImageryEngineProps> = ({
  exercise,
  isPaused,
  onComplete,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(10); // 5, 10, 15
  const [cardIndex, setCardIndex] = useState(0);

  const narrative = exercise.imageryScenes?.narrative || [
    'You are somewhere completely quiet.',
    'There is nowhere in the world you need to be right now.',
    'Notice the cool, still air resting on your skin.',
    'With each slow breath, let the day become a little farther away.',
    'The noise and demands of the world cannot reach you here.',
    'Everything is still, dark, and restful.',
    'Allow your thoughts to soften like shadows in the moonlight.',
    'Rest here as long as you need.',
  ];

  const theme = exercise.imageryScenes?.theme || 'stars';

  // Calculate advance interval based on selected duration and narrative length
  const intervalSeconds = Math.max(12, Math.floor((selectedDuration * 60) / narrative.length));

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCardIndex((prev) => {
        if (prev < narrative.length - 1) {
          return prev + 1;
        } else {
          // Stay on final card peacefully
          return prev;
        }
      });
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [isPaused, selectedDuration, narrative.length, intervalSeconds]);

  const handleNext = () => {
    if (cardIndex < narrative.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex((i) => i - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto min-h-[460px] px-4 py-2 text-center">
      {/* Duration Selector Tabs (Interactive Filter Tab styling per Constitution) */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06] mb-4">
        {[5, 10, 15].map((mins) => (
          <button
            key={mins}
            onClick={() => {
              setSelectedDuration(mins);
              setCardIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
              selectedDuration === mins
                ? 'bg-white/[0.12] text-[#f2f1ed] shadow-sm'
                : 'text-[#9aa2b5] hover:text-[#f2f1ed]'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Atmospheric Scenic Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c1018] flex items-center justify-center p-6 shadow-inner">
        {/* Scenic Theme Visuals */}
        {theme === 'stars' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#090e1a] to-[#04060a]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-white/[0.08] animate-spin duration-[60000ms] pointer-events-none opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-4 left-10 shadow-[0_0_6px_#fff]" />
                <div className="w-1 h-1 rounded-full bg-white absolute top-20 right-6 shadow-[0_0_4px_#fff]" />
                <div className="w-2 h-2 rounded-full bg-[#c4b5fd] absolute bottom-12 left-16 shadow-[0_0_8px_#c4b5fd]" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#07090e] to-transparent opacity-80" />
          </div>
        )}

        {theme === 'rain' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1420] to-[#070b12] overflow-hidden">
            {/* Rain Streaks */}
            {[15, 30, 48, 65, 82].map((x, i) => (
              <div
                key={i}
                className="absolute top-0 w-[1px] h-12 bg-gradient-to-b from-white/0 via-blue-200/25 to-white/0"
                style={{
                  left: `${x}%`,
                  animation: `rainDrop 2.${i}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#070b12]/40 to-[#070b12]" />
          </div>
        )}

        {theme === 'ocean' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#08121f] to-[#040910] flex items-end justify-center pb-8 overflow-hidden">
            {/* Wave arcs */}
            <div className="w-96 h-28 border-t border-white/[0.12] rounded-[100%] scale-x-125 animate-pulse duration-[7000ms]" />
            <div className="absolute bottom-4 w-80 h-20 border-t border-cyan-200/10 rounded-[100%] scale-x-150 animate-pulse duration-[9000ms]" />
          </div>
        )}

        {theme === 'cabin' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#140f0c] to-[#090706] flex items-center justify-center">
            {/* Warm fire ember halo */}
            <div className="w-36 h-36 rounded-full bg-amber-500/10 blur-2xl animate-pulse duration-[3000ms]" />
            <div className="w-16 h-16 rounded-full bg-amber-600/15 blur-lg" />
          </div>
        )}

        {theme === 'snow' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f18] to-[#05080e] overflow-hidden">
            {[10, 25, 45, 60, 75, 90].map((x, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px]"
                style={{
                  left: `${x}%`,
                  top: `${(i * 20) % 90}%`,
                  animation: `snowFall ${4 + i}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Fallback serene night landscape */}
        {!['stars', 'rain', 'ocean', 'cabin', 'snow'].includes(theme) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#101726] to-[#07090e] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#c4b5fd]/10 blur-md" />
            </div>
          </div>
        )}

        {/* Foreground Scene Subtitle */}
        <div className="relative z-10 text-xs text-[#9aa2b5] font-serif italic tracking-wide">
          {exercise.title}
        </div>
      </div>

      {/* Atmospheric Narrative Card */}
      <div className="w-full my-6 min-h-[110px] flex flex-col items-center justify-center px-4">
        <p className="font-serif text-xl sm:text-2xl text-[#f2f1ed] leading-relaxed transition-opacity duration-700 max-w-md">
          “{narrative[cardIndex]}”
        </p>
      </div>

      {/* Narrative Progress & Stepper Controls */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <button
          onClick={handlePrev}
          disabled={cardIndex === 0}
          aria-label="Previous imagery passage"
          className="min-h-[44px] min-w-[44px] px-3 rounded-lg text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {narrative.length <= 8 ? (
          <div className="flex items-center gap-1.5">
            {narrative.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === cardIndex
                    ? 'w-6 bg-[#c4b5fd]'
                    : i < cardIndex
                    ? 'w-2 bg-white/30'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 w-28 sm:w-36">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c4b5fd] rounded-full transition-all duration-300"
                style={{ width: `${((cardIndex + 1) / narrative.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[#9aa2b5] font-mono tabular-nums">
              {cardIndex + 1} of {narrative.length}
            </span>
          </div>
        )}

        <button
          onClick={handleNext}
          aria-label="Next imagery passage"
          className="min-h-[44px] min-w-[44px] px-3 rounded-lg text-xs font-medium text-[#f2f1ed] hover:bg-white/[0.06] flex items-center gap-1 transition-colors"
        >
          <span className="hidden sm:inline">{cardIndex < narrative.length - 1 ? 'Next' : 'Finish'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
