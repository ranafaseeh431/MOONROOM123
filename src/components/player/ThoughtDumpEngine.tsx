import React, { useState } from 'react';
import { Archive, Sparkles, Check, Lock } from 'lucide-react';
import { Exercise } from '../../types';

interface ThoughtDumpEngineProps {
  exercise: Exercise;
  onComplete: () => void;
}

export const ThoughtDumpEngine: React.FC<ThoughtDumpEngineProps> = ({
  exercise,
  onComplete,
}) => {
  const [text, setText] = useState('');
  const [actionCompleted, setActionCompleted] = useState<'parked' | 'dissolved' | null>(null);

  const handlePark = () => {
    setActionCompleted('parked');
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  const handleDissolve = () => {
    setActionCompleted('dissolved');
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto min-h-[440px] px-4 py-2">
      {/* Exercise Subtitle / Reassurance */}
      <div className="text-center mb-4">
        <h2 className="font-serif text-2xl text-[#f2f1ed] mb-1">
          {exercise.title}
        </h2>
        <p className="text-xs text-[#9aa2b5]">
          Completely private. Never analyzed, transmitted, or evaluated.
        </p>
      </div>

      {actionCompleted === null ? (
        <>
          {/* Private Text Area */}
          <div className="w-full flex-1 my-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is cycling through your head right now? Type it here so your mind can set it down..."
              rows={7}
              className="w-full p-4 rounded-xl bg-[#0e131d]/90 border border-white/[0.08] text-[#f2f1ed] placeholder-[#626b80] text-sm focus:outline-none focus:border-white/20 resize-none leading-relaxed transition-colors font-sans"
            />
          </div>

          {/* Action Choices */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              onClick={handlePark}
              disabled={!text.trim()}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] disabled:opacity-40 text-[#f2f1ed] text-xs font-medium border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
            >
              <Archive className="w-4 h-4 text-[#c4b5fd]" />
              <span>Lock in Tomorrow Box</span>
            </button>

            <button
              onClick={handleDissolve}
              disabled={!text.trim()}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] disabled:opacity-40 text-[#9aa2b5] hover:text-[#f2f1ed] text-xs font-medium border border-white/[0.06] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#93c5fd]" />
              <span>Release into the Night</span>
            </button>
          </div>
        </>
      ) : actionCompleted === 'parked' ? (
        <div className="my-auto text-center space-y-3 p-8 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-[#c4b5fd]/15 text-[#c4b5fd] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-[#f2f1ed]">Safely Locked Away</h3>
          <p className="text-xs text-[#9aa2b5] max-w-xs leading-relaxed">
            Your notes are held safely until daylight. Your mind doesn't need to carry them any longer tonight.
          </p>
        </div>
      ) : (
        <div className="my-auto text-center space-y-3 p-8 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-blue-400/15 text-blue-300 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-[#f2f1ed]">Released</h3>
          <p className="text-xs text-[#9aa2b5] max-w-xs leading-relaxed">
            Fading into the vast dark sky like mist over quiet water.
          </p>
        </div>
      )}
    </div>
  );
};
