import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Exercise } from '../../types';

interface RelaxationEngineProps {
  exercise: Exercise;
  isPaused: boolean;
  onComplete: () => void;
}

type PMRPhase = 'ready' | 'tense' | 'release' | 'notice';

export const RelaxationEngine: React.FC<RelaxationEngineProps> = ({
  exercise,
  isPaused,
  onComplete,
}) => {
  const groups = exercise.muscleGroups || [
    { name: 'Hands & Arms', action: 'Gently curl your hands into loose fists and squeeze lightly.', release: 'Open your fingers, let them uncurl, and feel the warm blood flow into your palms.' },
    { name: 'Shoulders & Neck', action: 'Gently shrug your shoulders up toward your ears.', release: 'Drop your shoulders down, creating space around your neck.' },
    { name: 'Face & Jaw', action: 'Lightly press your teeth together and furrow your brow.', release: 'Drop your lower jaw, leaving your lips softly parted.' },
    { name: 'Stomach & Belly', action: 'Gently tighten your stomach muscles.', release: 'Let your belly become soft, loose, and completely unrestricted.' },
    { name: 'Feet & Legs', action: 'Flex your toes toward your shins gently.', release: 'Let your ankles fall limp and toes rest loosely.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<PMRPhase>('ready');
  const [countdown, setCountdown] = useState(3);
  const currentGroup = groups[currentIndex];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (phase === 'tense') {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPhase('release');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'release') {
      // 5-second gentle release pause
      const releaseTimeout = setTimeout(() => {
        setPhase('notice');
      }, 5000);
      return () => clearTimeout(releaseTimeout);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused]);

  const handleStartTense = () => {
    setPhase('tense');
  };

  const handleNextGroup = () => {
    if (currentIndex < groups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('ready');
      setCountdown(3);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 py-2">
      {/* Group Tracker Indicator */}
      <div className="text-xs text-[#b3aed8] uppercase tracking-wider font-medium mb-3">
        Muscle Group {currentIndex + 1} of {groups.length}
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#f2f1ed] mb-6">
        {currentGroup.name}
      </h2>

      {/* Interactive Phase Visualizer */}
      <div className="relative w-56 h-56 flex items-center justify-center my-4">
        {/* Glow halo */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-700 ${
            phase === 'tense' 
              ? 'scale-110 opacity-70 bg-[#c4b5fd]/15 blur-xl' 
              : phase === 'release' 
              ? 'scale-125 opacity-40 bg-[#93c5fd]/15 blur-2xl'
              : 'opacity-20 bg-white/5 blur-lg'
          }`}
          aria-hidden="true"
        />

        {/* Central Card Ring */}
        <div className={`w-44 h-44 rounded-full border flex flex-col items-center justify-center p-4 transition-all duration-500 ${
          phase === 'tense' 
            ? 'border-[#c4b5fd] bg-[#1a233b]/60 scale-105' 
            : phase === 'release'
            ? 'border-emerald-400/40 bg-[#0e1f24]/50 scale-100'
            : 'border-white/[0.08] bg-[#0e131d]/60'
        }`}>
          {phase === 'ready' && (
            <div className="space-y-1">
              <span className="text-xs text-[#9aa2b5]">Ready</span>
              <p className="text-[13px] text-[#f2f1ed] font-medium leading-tight">Prepare to tense gently</p>
            </div>
          )}

          {phase === 'tense' && (
            <div className="space-y-1">
              <span className="font-mono text-4xl text-[#f2f1ed] font-light tabular-nums">{countdown}</span>
              <p className="text-xs text-[#c4b5fd] uppercase tracking-wider font-medium">Tense gently</p>
            </div>
          )}

          {phase === 'release' && (
            <div className="space-y-1 animate-fadeIn">
              <span className="text-base text-emerald-300 font-serif">Let go...</span>
              <p className="text-xs text-[#9aa2b5] leading-snug">Letting the muscle dissolve</p>
            </div>
          )}

          {phase === 'notice' && (
            <div className="space-y-1">
              <span className="text-sm text-[#e0e6f5] font-serif">Notice</span>
              <p className="text-xs text-[#9aa2b5]">Feel the lightness</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompts and Instructions */}
      <div className="min-h-[90px] max-w-sm mt-3 flex flex-col justify-center">
        {phase === 'ready' && (
          <p className="text-sm text-[#9aa2b5] leading-relaxed">
            {currentGroup.action}
          </p>
        )}

        {phase === 'tense' && (
          <p className="text-sm text-[#e2ded4] leading-relaxed">
            Hold gentle tension without straining or locking your joints.
          </p>
        )}

        {phase === 'release' && (
          <p className="text-sm text-[#e2ded4] leading-relaxed animate-fadeIn">
            {currentGroup.release}
          </p>
        )}

        {phase === 'notice' && (
          <p className="text-sm text-[#9aa2b5] leading-relaxed">
            Notice the pleasant difference between the earlier tension and this current stillness.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {phase === 'ready' && (
          <button
            onClick={handleStartTense}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-sm font-medium transition-colors border border-white/[0.1]"
          >
            Tense for 3 Seconds
          </button>
        )}

        {(phase === 'release' || phase === 'notice') && (
          <button
            onClick={handleNextGroup}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-sm font-medium transition-colors border border-white/[0.1] inline-flex items-center gap-2"
          >
            <span>{currentIndex < groups.length - 1 ? 'Next Muscle Group' : 'Finish Exercise'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
