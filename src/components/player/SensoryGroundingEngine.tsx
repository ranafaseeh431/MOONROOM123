import React, { useState } from 'react';
import { Eye, Hand, Volume2, Sparkles, Wind, Check, ChevronRight } from 'lucide-react';
import { Exercise } from '../../types';

interface SensoryGroundingEngineProps {
  exercise: Exercise;
  onComplete: () => void;
}

export const SensoryGroundingEngine: React.FC<SensoryGroundingEngineProps> = ({
  exercise,
  onComplete,
}) => {
  const steps = [
    {
      count: 5,
      title: 'Things You Can See',
      icon: Eye,
      prompt: 'Look around your dark room. Name 5 shadows, objects, or faint outlines of furniture.',
      cue: 'Notice the geometry of the window, the outline of a picture frame, the shape of a pillow...',
    },
    {
      count: 4,
      title: 'Things You Can Feel',
      icon: Hand,
      prompt: 'Bring awareness to 4 distinct physical sensations on your skin.',
      cue: 'The weight of the duvet, the cool fabric on your cheek, your feet touching the sheet, your pulse...',
    },
    {
      count: 3,
      title: 'Things You Can Hear',
      icon: Volume2,
      prompt: 'Listen closely for 3 subtle ambient sounds.',
      cue: 'Distant wind outside, the gentle hum of the refrigerator, your own quiet breath...',
    },
    {
      count: 2,
      title: 'Things You Can Smell',
      icon: Sparkles,
      prompt: 'Notice 2 faint scents in the night air.',
      cue: 'The smell of clean linen, the cool outdoor night air, or neutral calmness...',
    },
    {
      count: 1,
      title: 'One Thing to Taste / Breathe',
      icon: Wind,
      prompt: 'Notice the sensation of air touching your lips and throat.',
      cue: 'A slow, cool inhalation through the nose, resting on the tongue...',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto min-h-[440px] px-4 py-2 text-center">
      {/* Step Tracker */}
      <div className="text-xs text-[#b3aed8] uppercase tracking-wider font-mono">
        Step {activeStep + 1} of {steps.length}
      </div>

      {/* Main Sensory Visual Card */}
      <div className="w-full my-auto py-8 px-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#1e2738] border border-white/[0.1] flex items-center justify-center mb-4 text-[#c4b5fd]">
          <Icon className="w-6 h-6" />
        </div>

        <span className="font-mono text-3xl font-light text-[#f2f1ed] mb-1">
          {current.count}
        </span>

        <h3 className="font-serif text-xl sm:text-2xl text-[#f2f1ed] mb-3">
          {current.title}
        </h3>

        <p className="text-sm text-[#e2ded4] mb-3 leading-relaxed">
          {current.prompt}
        </p>

        <p className="text-xs text-[#9aa2b5] italic max-w-xs leading-relaxed">
          {current.cue}
        </p>
      </div>

      {/* Stepper Footer */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeStep
                  ? 'w-6 bg-[#c4b5fd]'
                  : i < activeStep
                  ? 'w-2 bg-emerald-400/50'
                  : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
        >
          <span>{activeStep < steps.length - 1 ? 'I Noticed These' : 'Grounding Complete'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
