import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Exercise } from '../../types';

interface CognitiveShuffleProps {
  exercise: Exercise;
  isPaused: boolean;
  onComplete: () => void;
}

const SERENE_WORDS = [
  { word: 'Feather', cue: 'A soft white goose feather floating in still air.' },
  { word: 'Lantern', cue: 'A quiet brass lantern casting amber light on flagstones.' },
  { word: 'Moss', cue: 'Deep green velvet moss clinging to cool damp stone.' },
  { word: 'Pebble', cue: 'A smooth grey river stone resting underwater.' },
  { word: 'Willow', cue: 'Long silver branches dipping gently toward a quiet pond.' },
  { word: 'Teacup', cue: 'A warm ceramic cup with faint steam curling upward.' },
  { word: 'Cedar', cue: 'The rich fragrance of dry cedar wood in a mountain lodge.' },
  { word: 'Linen', cue: 'Crisp, cool linen sheets freshly dried in the breeze.' },
  { word: 'Seashell', cue: 'A spiral shell half-buried in cool, damp sand at twilight.' },
  { word: 'Candle', cue: 'A single steady flame without a single flicker.' },
  { word: 'Meadow', cue: 'Tumble of tall clover and grasses asleep under the night sky.' },
  { word: 'Compass', cue: 'A polished brass needle settling gently toward true north.' },
  { word: 'Driftwood', cue: 'Sun-bleached wood smoothed by a hundred ocean tides.' },
  { word: 'Book', cue: 'An old leather-bound volume resting open on a desk.' },
  { word: 'Snowflake', cue: 'A six-sided crystal landing soundlessly on a dark coat.' },
  { word: 'Blanket', cue: 'Heavy woven wool pulling around your shoulders.' },
  { word: 'Acorn', cue: 'A smooth nut nestled among dry autumn leaves.' },
  { word: 'Telescope', cue: 'Focusing on a quiet, distant ring of Saturn.' },
  { word: 'Pinecone', cue: 'The geometrical spiral of dry scales in the woods.' },
  { word: 'Raindrop', cue: 'A single drop sliding slowly down a window pane.' },
];

export const CognitiveShuffleEngine: React.FC<CognitiveShuffleProps> = ({
  isPaused,
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(6);

  const current = SERENE_WORDS[index % SERENE_WORDS.length];

  useEffect(() => {
    if (isPaused || !autoAdvance) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIndex((i) => i + 1);
          return 6;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, autoAdvance, index]);

  const handleNextWord = () => {
    setIndex((i) => i + 1);
    setTimerSeconds(6);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto min-h-[420px] px-4 py-4 text-center">
      {/* Introduction note */}
      <div className="text-xs text-[#9aa2b5] leading-relaxed max-w-xs">
        Neutral, non-emotional words simulate hypnagogic dream onset and dissolve cognitive loops.
      </div>

      {/* Main Word Card */}
      <div className="w-full my-auto py-10 px-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center justify-center">
        <span className="text-xs font-mono text-[#b3aed8] tracking-widest uppercase mb-3">
          Word {index + 1}
        </span>

        <h2 className="font-serif text-4xl sm:text-5xl text-[#f2f1ed] tracking-tight mb-4 animate-fadeIn">
          {current.word}
        </h2>

        <p className="text-sm text-[#9aa2b5] max-w-xs leading-relaxed italic">
          “{current.cue}”
        </p>

        {autoAdvance && (
          <div className="w-32 h-1 bg-white/[0.08] rounded-full mt-8 overflow-hidden">
            <div
              className="h-full bg-[#c4b5fd] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${((6 - timerSeconds) / 6) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => setAutoAdvance(!autoAdvance)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            autoAdvance ? 'bg-white/[0.1] text-[#f2f1ed]' : 'text-[#626b80] hover:text-[#9aa2b5]'
          }`}
        >
          {autoAdvance ? 'Paced Auto' : 'Manual Tap'}
        </button>

        <button
          onClick={handleNextWord}
          className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
        >
          <span>Next Word</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
