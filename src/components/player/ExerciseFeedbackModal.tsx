import React, { useState } from 'react';
import { Sparkles, Moon, RefreshCw, Check } from 'lucide-react';
import { FeedbackResponse } from '../../types';

interface ExerciseFeedbackModalProps {
  onFeedback: (response: FeedbackResponse) => void;
  onTryAnother: () => void;
  onDoneForTonight: () => void;
  exerciseTitle: string;
}

export const ExerciseFeedbackModal: React.FC<ExerciseFeedbackModalProps> = ({
  onFeedback,
  onTryAnother,
  onDoneForTonight,
  exerciseTitle,
}) => {
  const [selectedResponse, setSelectedResponse] = useState<FeedbackResponse | null>(null);

  const choices: { id: FeedbackResponse; label: string; desc: string }[] = [
    { id: 'better', label: 'A little better', desc: 'My body or mind feels slightly more at ease' },
    { id: 'same', label: 'About the same', desc: 'Neither better nor worse, simply quiet' },
    { id: 'not_for_me', label: 'Not for me', desc: 'This exercise didn’t fit what I needed tonight' },
  ];

  const handleSelect = (choice: FeedbackResponse) => {
    setSelectedResponse(choice);
    onFeedback(choice);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 text-center animate-fadeIn">
      {/* Gentle Moon Emblem */}
      <div className="w-12 h-12 rounded-full bg-[#161f30] border border-white/[0.1] flex items-center justify-center text-[#c4b5fd] mb-4">
        <Moon className="w-5 h-5" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-[#f2f1ed] mb-1">
        Session Complete
      </h2>
      <p className="text-xs text-[#9aa2b5] mb-6">
        {exerciseTitle}
      </p>

      {/* Question */}
      <div className="w-full space-y-2 mb-8">
        <p className="text-sm font-medium text-[#e2ded4] mb-3">
          How did that feel?
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {choices.map((c) => {
            const isSelected = selectedResponse === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white/[0.12] border-[#c4b5fd]/60 text-[#f2f1ed]'
                    : 'bg-[#0e131d]/90 border-white/[0.08] hover:border-white/[0.16] text-[#9aa2b5] hover:text-[#f2f1ed]'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-medium">{c.label}</div>
                  <div className="text-[11px] text-[#626b80] mt-0.5">{c.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#c4b5fd] shrink-0" />}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#626b80] pt-1">
          Private on your device. Used only to tailor gentle recommendations.
        </p>
      </div>

      {/* Post-Exercise Action Choices */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onTryAnother}
          className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium border border-white/[0.1] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try another</span>
        </button>

        <button
          onClick={onDoneForTonight}
          className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#c4b5fd]/15 hover:bg-[#c4b5fd]/25 text-[#f2f1ed] text-xs font-medium border border-[#c4b5fd]/30 transition-colors flex items-center justify-center gap-2"
        >
          <Moon className="w-3.5 h-3.5 text-[#c4b5fd]" />
          <span>Done for tonight</span>
        </button>
      </div>
    </div>
  );
};
