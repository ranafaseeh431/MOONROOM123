import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Exercise } from '../../types';

interface SteppedRoutineEngineProps {
  exercise: Exercise;
  onComplete: () => void;
}

export const SteppedRoutineEngine: React.FC<SteppedRoutineEngineProps> = ({
  exercise,
  onComplete,
}) => {
  const steps = exercise.steps || [
    { title: 'Step 1: Get comfortable', instruction: 'Adjust your position and let your body surrender to gravity.' },
    { title: 'Step 2: Let your shoulders drop', instruction: 'Release all holding in your neck and trapezius.' },
    { title: 'Step 3: Take a slow breath', instruction: 'Inhale gently and let the breath sigh out without resistance.' },
    { title: 'Step 4: Heavy body', instruction: 'Notice your body becoming heavier and sinking into the mattress.' },
    { title: 'Step 5: Nothing needs solving', instruction: 'Nothing needs to be solved right now. You are safe.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = steps[currentIndex];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto min-h-[440px] px-4 py-2 text-center">
      {/* Step Counter */}
      <div className="text-xs text-[#b3aed8] uppercase tracking-wider font-mono">
        Step {currentIndex + 1} of {steps.length}
      </div>

      {/* Main Routine Step Card */}
      <div className="w-full my-auto py-10 px-6 sm:px-8 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center justify-center">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#f2f1ed] mb-4 leading-snug">
          {currentStep.title}
        </h3>

        <p className="text-base sm:text-lg text-[#9aa2b5] leading-relaxed max-w-md">
          {currentStep.instruction}
        </p>

        {currentStep.subtext && (
          <p className="text-xs text-[#626b80] mt-4 italic max-w-xs">
            {currentStep.subtext}
          </p>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="min-h-[44px] px-3.5 rounded-lg text-xs font-medium text-[#9aa2b5] hover:text-[#f2f1ed] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-[#c4b5fd]'
                  : i < currentIndex
                  ? 'w-2 bg-white/40'
                  : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
        >
          <span>{currentIndex < steps.length - 1 ? 'Next Step' : 'Routine Complete'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
