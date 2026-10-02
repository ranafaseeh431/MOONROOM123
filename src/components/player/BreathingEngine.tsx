import React, { useState, useEffect, useRef } from 'react';
import { Exercise, BreathingVisualMode } from '../../types';

interface BreathingEngineProps {
  exercise: Exercise;
  isPaused: boolean;
  onTogglePause: () => void;
  onComplete: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'postHold';

export const BreathingEngine: React.FC<BreathingEngineProps> = ({
  exercise,
  isPaused,
  onComplete,
}) => {
  const config = exercise.breathingConfig || {
    inhaleSeconds: 4,
    holdSeconds: 1,
    exhaleSeconds: 5,
    postHoldSeconds: 1,
    cycles: 20,
    visualMode: 'circle',
  };

  // Determine visual mode from config or exercise id
  const visualMode: BreathingVisualMode = config.visualMode || (
    exercise.id === 'breathe-box' ? 'box' :
    exercise.id === 'breathe-belly' ? 'belly' :
    exercise.id === 'breathe-diaphragmatic' ? 'belly' :
    exercise.id === 'breathe-extended-exhale' ? 'extended' :
    exercise.id === 'breathe-coherent' ? 'coherent' :
    exercise.id === 'breathe-three-slow' ? 'three_breaths' :
    exercise.id === 'breathe-counting' ? 'counting' :
    exercise.id === 'breathe-ocean' ? 'ocean' :
    exercise.id === 'breathe-cooling-lunar' ? 'cooling' :
    exercise.id === 'breathe-whispering' ? 'whisper' :
    'circle'
  );

  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(config.inhaleSeconds);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const totalCycles = config.cycles || (visualMode === 'three_breaths' ? 3 : 20);

  // For Breath Counting exercise: tracks count 1, 2, 3, 4... up to 10
  const [breathCountNumber, setBreathCountNumber] = useState<number>(1);

  // For Three Slow Breaths: intermission pause state between the 3 deliberate breaths
  const [threeBreathsIntermission, setThreeBreathsIntermission] = useState<boolean>(false);
  const [intermissionCountdown, setIntermissionCountdown] = useState<number>(3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Specific prompts for Three Slow Breaths
  const threeBreathsSteps = [
    {
      title: 'First Breath',
      instruction: 'Acknowledge that your waking day is completely closed. Nothing more to achieve.',
    },
    {
      title: 'Second Breath',
      instruction: 'Release all tension in your shoulders, jaw, and brow.',
    },
    {
      title: 'Third Breath',
      instruction: 'Surrender all your physical weight to the bed or chair beneath you.',
    },
  ];

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Intermission between the three deliberate breaths
    if (threeBreathsIntermission) {
      timerRef.current = setInterval(() => {
        setIntermissionCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setThreeBreathsIntermission(false);
            setPhase('inhale');
            return config.inhaleSeconds;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase Transitions
        if (phase === 'inhale') {
          if (visualMode === 'counting') {
            setBreathCountNumber((c) => (c % 10) + 1);
          }

          if (config.holdSeconds && config.holdSeconds > 0) {
            setPhase('hold');
            return config.holdSeconds;
          } else {
            setPhase('exhale');
            return config.exhaleSeconds;
          }
        } else if (phase === 'hold') {
          setPhase('exhale');
          return config.exhaleSeconds;
        } else if (phase === 'exhale') {
          if (visualMode === 'counting') {
            setBreathCountNumber((c) => (c % 10) + 1);
          }

          if (config.postHoldSeconds && config.postHoldSeconds > 0) {
            setPhase('postHold');
            return config.postHoldSeconds;
          } else {
            return handleCycleAdvance();
          }
        } else {
          // postHold finished
          return handleCycleAdvance();
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, phase, config, visualMode, threeBreathsIntermission]);

  const handleCycleAdvance = (): number => {
    if (visualMode === 'three_breaths') {
      if (currentCycle >= 3) {
        // Automatically complete the three slow breaths without looping
        setTimeout(() => onComplete(), 500);
        return 0;
      } else {
        setCurrentCycle((c) => c + 1);
        setThreeBreathsIntermission(true);
        setIntermissionCountdown(3);
        return 3;
      }
    }

    setCurrentCycle((c) => {
      if (c >= totalCycles) {
        onComplete();
        return c;
      }
      return c + 1;
    });

    setPhase('inhale');
    return config.inhaleSeconds;
  };

  const getPhasePrompt = () => {
    if (visualMode === 'three_breaths' && threeBreathsIntermission) {
      return 'Rest and let go...';
    }

    switch (phase) {
      case 'inhale':
        if (visualMode === 'belly') return 'Expand your lower belly';
        if (visualMode === 'ocean') return 'Tide rolls in';
        if (visualMode === 'cooling') return 'Draw in cool air';
        if (visualMode === 'whisper') return 'Soft inhale through nose';
        return 'Breathe in slowly';
      case 'hold':
        if (visualMode === 'box') return 'Hold with stillness';
        return 'Rest softly';
      case 'exhale':
        if (visualMode === 'extended') return 'Long, continuous exhale';
        if (visualMode === 'belly') return 'Belly softens gently';
        if (visualMode === 'whisper') return 'Whisper out through lips';
        if (visualMode === 'ocean') return 'Wave recedes into deep ocean';
        return 'Release gently';
      case 'postHold':
        return 'Quiet stillness';
    }
  };

  const getPhaseInstruction = () => {
    if (visualMode === 'three_breaths') {
      if (threeBreathsIntermission) {
        return 'Notice the stillness before the next breath begins.';
      }
      return threeBreathsSteps[currentCycle - 1]?.instruction || 'Breathe deliberately and slowly.';
    }

    if (visualMode === 'box') {
      if (phase === 'inhale') return 'Follow the top edge of the box smoothly.';
      if (phase === 'hold') return 'Hold without tightening your throat along the right edge.';
      if (phase === 'exhale') return 'Let all air out along the bottom edge.';
      return 'Rest in the quiet vacuum along the left edge.';
    }

    if (visualMode === 'belly') {
      if (phase === 'inhale') return 'Place your awareness right below your navel. Feel it expand outward like a gentle balloon.';
      return 'Let your abdomen sink back naturally. Zero force or pulling.';
    }

    if (visualMode === 'extended') {
      if (phase === 'inhale') return 'Inhale softly for 4 seconds.';
      return 'Allow the exhale to gently stretch out for 8 seconds. This naturally downregulates your heart rate.';
    }

    if (visualMode === 'counting') {
      if (phase === 'inhale') return `Silently anchor your attention on count ${breathCountNumber}.`;
      return `Release the breath and anchor on count ${breathCountNumber}.`;
    }

    if (visualMode === 'coherent') {
      return '5 seconds in, 5 seconds out. A rhythmic balance between body and breath.';
    }

    return exercise.instructions[0] || 'Allow your chest and belly to expand naturally without strain.';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 py-2">
      {/* Exercise Subtitle / Visual Mode Marker */}
      <div className="text-[11px] font-mono uppercase tracking-widest text-[#b3aed8] mb-2">
        {visualMode === 'box' && 'Four-Phase Square Rhythm'}
        {visualMode === 'belly' && 'Lower Abdomen Focus'}
        {visualMode === 'extended' && 'Extended 1:2 Cadence'}
        {visualMode === 'coherent' && 'Heart Rate Coherence (5s : 5s)'}
        {visualMode === 'three_breaths' && 'Deliberate Three Breaths'}
        {visualMode === 'counting' && 'Sequential Breath Counting'}
        {visualMode === 'ocean' && 'Nocturnal Tide Cadence'}
        {visualMode === 'cooling' && 'Lunar Temperature Breath'}
        {visualMode === 'whisper' && 'Parted Lips Whispering'}
        {visualMode === 'circle' && 'Gentle 4–6 Harmony'}
      </div>

      {/* ====================================================
          VISUAL ENGINE 1: BOX BREATHING (Square Perimeter)
          ==================================================== */}
      {visualMode === 'box' && (
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
          {/* Square outline */}
          <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-2xl border border-white/[0.12] bg-[#0c1018]/60 flex items-center justify-center">
            {/* Glowing borders for active phase */}
            <div
              className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl transition-all duration-500 ${
                phase === 'inhale' ? 'bg-[#c4b5fd] shadow-[0_0_12px_#c4b5fd]' : 'bg-transparent'
              }`}
            />
            <div
              className={`absolute right-0 inset-y-0 w-1 rounded-r-2xl transition-all duration-500 ${
                phase === 'hold' ? 'bg-[#93c5fd] shadow-[0_0_12px_#93c5fd]' : 'bg-transparent'
              }`}
            />
            <div
              className={`absolute bottom-0 inset-x-0 h-1 rounded-b-2xl transition-all duration-500 ${
                phase === 'exhale' ? 'bg-emerald-300 shadow-[0_0_12px_#6ee7b7]' : 'bg-transparent'
              }`}
            />
            <div
              className={`absolute left-0 inset-y-0 w-1 rounded-l-2xl transition-all duration-500 ${
                phase === 'postHold' ? 'bg-amber-200 shadow-[0_0_12px_#fde68a]' : 'bg-transparent'
              }`}
            />

            {/* Edge labels */}
            <span className={`absolute -top-5 text-[10px] font-mono tracking-wider transition-colors ${phase === 'inhale' ? 'text-[#c4b5fd] font-semibold' : 'text-[#626b80]'}`}>
              1. INHALE (4s)
            </span>
            <span className={`absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono tracking-wider transition-colors ${phase === 'hold' ? 'text-[#93c5fd] font-semibold' : 'text-[#626b80]'}`}>
              2. HOLD (4s)
            </span>
            <span className={`absolute -bottom-5 text-[10px] font-mono tracking-wider transition-colors ${phase === 'exhale' ? 'text-emerald-300 font-semibold' : 'text-[#626b80]'}`}>
              3. EXHALE (4s)
            </span>
            <span className={`absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono tracking-wider transition-colors ${phase === 'postHold' ? 'text-amber-200 font-semibold' : 'text-[#626b80]'}`}>
              4. HOLD (4s)
            </span>

            {/* Center counter */}
            <div className="text-center space-y-1">
              <span className="font-mono text-4xl sm:text-5xl font-light text-[#f2f1ed] tabular-nums">
                {secondsRemaining}
              </span>
              <p className="text-xs uppercase font-medium tracking-wider text-[#9aa2b5]">
                {phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : phase === 'exhale' ? 'Exhale' : 'Hold'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 2: BELLY & DIAPHRAGMATIC BREATHING
          ==================================================== */}
      {visualMode === 'belly' && (
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
          {/* Layered anatomical/organic abdomen expansion */}
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-[40%] transition-all ease-in-out flex flex-col items-center justify-center shadow-2xl ${
              phase === 'inhale'
                ? 'scale-125 duration-[4000ms] rounded-[48%] border-2 border-amber-200/40'
                : 'scale-90 duration-[5000ms] rounded-[36%] border border-white/[0.08]'
            }`}
            style={{
              background: phase === 'inhale'
                ? 'radial-gradient(circle at 45% 45%, #2a2c3d 0%, #161a29 55%, #0e121e 100%)'
                : 'radial-gradient(circle at 50% 50%, #131722 0%, #0b0e17 70%, #07090e 100%)',
            }}
          >
            <div
              className={`w-28 h-28 rounded-[45%] transition-all ease-in-out flex items-center justify-center ${
                phase === 'inhale' ? 'scale-115 duration-[4000ms] bg-amber-400/10' : 'scale-90 duration-[5000ms] bg-white/[0.02]'
              }`}
            >
              <span className="font-mono text-3xl font-light text-[#f2f1ed] tabular-nums">
                {secondsRemaining}
              </span>
            </div>
          </div>

          {/* Abdominal expansion ripple indicators */}
          <div
            className={`absolute inset-4 rounded-full border border-amber-200/20 transition-all pointer-events-none ${
              phase === 'inhale' ? 'scale-110 opacity-70 duration-[4000ms]' : 'scale-75 opacity-10 duration-[5000ms]'
            }`}
          />
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 3: EXTENDED EXHALE (Visible 1:2 Rhythm)
          ==================================================== */}
      {visualMode === 'extended' && (
        <div className="w-full max-w-sm my-6 space-y-6">
          {/* Main gauge display */}
          <div className="p-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] text-center space-y-3">
            <span className="font-mono text-5xl font-light text-[#f2f1ed] tabular-nums">
              {secondsRemaining}
            </span>
            <p className="text-xs font-medium uppercase tracking-wider text-[#9aa2b5]">
              {phase === 'inhale' ? 'Inhale (4 seconds)' : 'Extended Exhale (8 seconds)'}
            </p>

            {/* Asymmetrical Progress Wave Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all ease-linear ${
                    phase === 'inhale' ? 'bg-[#c4b5fd]' : 'bg-emerald-400'
                  }`}
                  style={{
                    width: phase === 'inhale'
                      ? `${((4 - secondsRemaining) / 4) * 100}%`
                      : `${((8 - secondsRemaining) / 8) * 100}%`,
                    transitionDuration: '1000ms',
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#626b80] font-mono">
                <span>Inhale: 4s</span>
                <span className="text-emerald-300">Exhale: 8s (Longer)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 4: COHERENT BREATHING (Continuous Harmonic Wave)
          ==================================================== */}
      {visualMode === 'coherent' && (
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex flex-col items-center justify-center">
          {/* Harmonic Sine Wave SVG */}
          <svg className="w-60 h-28 overflow-visible" viewBox="0 0 200 80">
            <path
              d="M 10 40 Q 55 5, 100 40 T 190 40"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
            {/* Glowing bead traversing the wave smoothly */}
            <circle
              cx={phase === 'inhale' ? 10 + ((5 - secondsRemaining) / 5) * 90 : 100 + ((5 - secondsRemaining) / 5) * 90}
              cy={phase === 'inhale' ? 40 - Math.sin(((5 - secondsRemaining) / 5) * Math.PI) * 32 : 40 + Math.sin(((5 - secondsRemaining) / 5) * Math.PI) * 32}
              r="6"
              fill="#c4b5fd"
              className="drop-shadow-[0_0_8px_#c4b5fd]"
            />
          </svg>

          <div className="text-center mt-4 space-y-1">
            <span className="font-mono text-3xl font-light text-[#f2f1ed] tabular-nums">
              {secondsRemaining}s
            </span>
            <p className="text-xs text-[#9aa2b5] uppercase tracking-wider">
              {phase === 'inhale' ? '5s Inflow' : '5s Outflow'}
            </p>
          </div>
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 5: THREE SLOW BREATHS (Non-Looping, 3 Steps)
          ==================================================== */}
      {visualMode === 'three_breaths' && (
        <div className="w-full max-w-sm my-6 space-y-6">
          {threeBreathsIntermission ? (
            <div className="p-8 rounded-2xl bg-[#0e131d]/90 border border-emerald-400/20 text-center space-y-3 animate-fadeIn">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-300">
                Pause between breaths
              </span>
              <p className="font-serif text-2xl text-[#f2f1ed]">
                Rest in this stillness
              </p>
              <span className="font-mono text-xl text-[#9aa2b5] tabular-nums">
                Next breath in {intermissionCountdown}s...
              </span>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                      step === currentCycle
                        ? 'bg-[#c4b5fd] text-slate-900 font-bold'
                        : step < currentCycle
                        ? 'bg-emerald-400/30 text-emerald-300'
                        : 'bg-white/[0.05] text-[#626b80]'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              <h3 className="font-serif text-2xl text-[#f2f1ed]">
                {threeBreathsSteps[currentCycle - 1]?.title}
              </h3>

              <div className="py-2">
                <span className="font-mono text-4xl font-light text-[#f2f1ed] tabular-nums">
                  {secondsRemaining}
                </span>
                <p className="text-xs uppercase tracking-wider text-[#9aa2b5] mt-1">
                  {phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 6: BREATH COUNTING (Inhale - 1, Exhale - 2...)
          ==================================================== */}
      {visualMode === 'counting' && (
        <div className="w-full max-w-sm my-6 p-8 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] text-center space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#b3aed8]">
            Sequential Breath Count
          </span>

          <div className="py-2">
            <span className="font-serif text-6xl sm:text-7xl font-light text-[#f2f1ed] tabular-nums">
              {breathCountNumber}
            </span>
            <p className="text-sm font-medium text-[#c4b5fd] mt-2">
              {phase === 'inhale' ? `Inhale — ${breathCountNumber}` : `Exhale — ${breathCountNumber}`}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className={`w-2 h-2 rounded-full transition-all ${
                  num === breathCountNumber ? 'w-5 bg-[#c4b5fd]' : num < breathCountNumber ? 'bg-white/40' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ====================================================
          VISUAL ENGINE 7: GENTLE 4-6, OCEAN, COOLING, WHISPER & CIRCLE
          ==================================================== */}
      {!['box', 'belly', 'extended', 'coherent', 'three_breaths', 'counting'].includes(visualMode) && (
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
          {/* Dual concentric expanding halo */}
          <div
            className={`absolute inset-0 rounded-full transition-all ease-in-out ${
              phase === 'inhale'
                ? visualMode === 'ocean' ? 'scale-125 duration-[4000ms] bg-cyan-400/15' : 'scale-125 duration-[4000ms] bg-[#c4b5fd]/15'
                : visualMode === 'ocean' ? 'scale-90 duration-[6000ms] bg-blue-900/10' : 'scale-90 duration-[6000ms] bg-slate-900/10'
            }`}
            style={{ filter: 'blur(20px)' }}
            aria-hidden="true"
          />

          {/* Synchronized expansion ring */}
          <div
            className={`absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-white/[0.15] transition-all ease-in-out ${
              phase === 'inhale' ? 'scale-120 duration-[4000ms]' : 'scale-90 duration-[6000ms]'
            }`}
          />

          {/* Core disc */}
          <div
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all ease-in-out ${
              phase === 'inhale' ? 'scale-115 duration-[4000ms]' : 'scale-90 duration-[6000ms]'
            }`}
            style={{
              background: visualMode === 'cooling'
                ? 'radial-gradient(circle at 40% 35%, #f0f8ff 0%, #d8ecf8 35%, #8cb9d8 85%, #466e8c 100%)'
                : 'radial-gradient(circle at 40% 35%, #f5f4ef 0%, #dbe2ef 40%, #8ea0c2 85%, #586989 100%)',
            }}
          >
            <span className="font-mono text-3xl font-light text-[#0f172a] tabular-nums">
              {secondsRemaining}
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#334155]/80 mt-0.5">
              {phase}
            </span>
          </div>
        </div>
      )}

      {/* Narrative Instruction Below Visual */}
      <div className="space-y-1.5 mt-2 min-h-[70px] max-w-md mx-auto">
        <h2 className="font-serif text-2xl text-[#f2f1ed] tracking-tight">
          {getPhasePrompt()}
        </h2>
        <p className="text-xs sm:text-sm text-[#9aa2b5] leading-relaxed">
          {getPhaseInstruction()}
        </p>
      </div>

      {/* Bottom Cycle / Progress Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[#626b80] font-mono tabular-nums">
        {visualMode === 'three_breaths' ? (
          <span>Breath {currentCycle} of 3 (will conclude after 3rd breath)</span>
        ) : (
          <span>Cycle {currentCycle} of {totalCycles}</span>
        )}
      </div>
    </div>
  );
};
