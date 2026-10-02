import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { Exercise } from '../../types';

interface CognitiveGameEngineProps {
  exercise: Exercise;
  onComplete: () => void;
}

const ALPHABET_CATEGORIES = [
  { name: 'Quiet Places', samples: { A: 'Alpine meadow', B: 'Bedside nook', C: 'Cabin porch', D: 'Dune at dusk', E: 'Evergreen trail', F: 'Forest glade', G: 'Garden bench', H: 'Harbor at night', I: 'Island cove', J: 'Japanese garden', K: 'Kelpshore', L: 'Lighthouse lookout', M: 'Moonlit lake', N: 'Nocturnal clearing', O: 'Old bookstore', P: 'Pine grove', Q: 'Quiet cove', R: 'Rain-soaked courtyard', S: 'Starlit ridge', T: 'Timber lodge', U: 'Underground cave', V: 'Valley mist', W: 'Willow stream', X: 'Xeriscape garden', Y: 'Yacht harbor', Z: 'Zen garden' } },
  { name: 'Comforting Objects', samples: { A: 'Amber lamp', B: 'Blanket', C: 'Ceramic mug', D: 'Down pillow', E: 'Earmuffs', F: 'Fireplace hearth', G: 'Glass lantern', H: 'Hot tea kettle', I: 'Ink bottle', J: 'Journal notebook', K: 'Knit sweater', L: 'Linen quilt', M: 'Moss garden', N: 'Nightstand candle', O: 'Old clock', P: 'Pocket watch', Q: 'Quilted throw', R: 'Rocking chair', S: 'Silk scarf', T: 'Teacup saucer', U: 'Umbrella stand', V: 'Velvet cushion', W: 'Wool socks', X: 'Xylophone chime', Y: 'Yarn ball', Z: 'Zinc lantern' } },
  { name: 'Night Creatures', samples: { A: 'Arctic fox', B: 'Barn owl', C: 'Crickets', D: 'Deer', E: 'Emperor moth', F: 'Fireflies', G: 'Gecko', H: 'Hedgehog', I: 'Inchworm', J: 'Jaguarundi', K: 'Kinkajou', L: 'Leopard', M: 'Moth', N: 'Nightingale', O: 'Ocelot', P: 'Pangolin', Q: 'Quail', R: 'Raccoon', S: 'Snow leopard', T: 'Tawny owl', U: 'Urchin', V: 'Vesper bat', W: 'Wombat', X: 'Xerus', Y: 'Yellow-bellied glider', Z: 'Zorilla' } },
];

export const CognitiveGameEngine: React.FC<CognitiveGameEngineProps> = ({
  exercise,
  onComplete,
}) => {
  const type = exercise.type;

  // Alphabet game state
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [currentLetterCode, setCurrentLetterCode] = useState(65); // 'A'

  // Word association state
  const [wordChain, setWordChain] = useState<string[]>([
    'Moonlight',
    'Silver river',
    'Weeping willow',
    'Cool water',
    'Polished stone',
    'Deep stillness',
  ]);

  // Slow reverse counter state
  const [counterValue, setCounterValue] = useState(50);

  const alphabetCategory = ALPHABET_CATEGORIES[selectedCategoryIndex];
  const currentLetter = String.fromCharCode(currentLetterCode);
  const currentSample = (alphabetCategory.samples as Record<string, string>)[currentLetter] || 'A quiet thought';

  const handleNextLetter = () => {
    if (currentLetterCode >= 90) {
      onComplete();
    } else {
      setCurrentLetterCode((prev) => prev + 1);
    }
  };

  const handleNextCount = () => {
    if (counterValue <= 1) {
      onComplete();
    } else {
      const step = exercise.id.includes('by-3s') ? 3 : 1;
      setCounterValue((v) => Math.max(0, v - step));
    }
  };

  const handleNextWordChain = () => {
    const soothingPool = [
      'Soft mist',
      'Pine needles',
      'Hearth embers',
      'Old library',
      'Velvet shadows',
      'Rain on slate',
      'Distant chime',
      'Gentle breathing',
      'Warm quilts',
      'Starlit meadow',
      'Cedar branch',
      'Safe sanctuary',
    ];
    const pick = soothingPool[Math.floor(Math.random() * soothingPool.length)];
    setWordChain((chain) => [pick, ...chain.slice(0, 5)]);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto min-h-[440px] px-4 py-2 text-center">
      {/* ================= ALPHABET CATEGORIES ================= */}
      {type === 'alphabet_game' && (
        <>
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06] mb-4">
            {ALPHABET_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategoryIndex(i);
                  setCurrentLetterCode(65);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategoryIndex === i
                    ? 'bg-white/[0.12] text-[#f2f1ed]'
                    : 'text-[#9aa2b5] hover:text-[#f2f1ed]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="w-full my-auto py-8 px-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center">
            <span className="text-xs text-[#b3aed8] uppercase tracking-widest font-mono mb-2">
              Letter
            </span>

            <span className="font-serif text-6xl text-[#f2f1ed] mb-4">
              {currentLetter}
            </span>

            <p className="text-sm text-[#e2ded4] mb-2">
              Think of something for <strong className="text-[#c4b5fd]">{alphabetCategory.name}</strong> starting with {currentLetter}.
            </p>

            <p className="text-xs text-[#626b80] italic mt-2">
              Example idea: “{currentSample}”
            </p>
          </div>

          <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-[#626b80]">No scoring · Skip anytime</span>

            <button
              onClick={handleNextLetter}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
            >
              <span>{currentLetterCode < 90 ? `Next Letter (${String.fromCharCode(currentLetterCode + 1)})` : 'Finished'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* ================= WORD ASSOCIATION ================= */}
      {type === 'word_association' && (
        <>
          <div className="text-xs text-[#9aa2b5] mb-2">
            Let each word suggest a calm, tranquil image to quiet your mind.
          </div>

          <div className="w-full my-auto py-6 px-4 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg space-y-3">
            {wordChain.map((word, index) => (
              <div
                key={`${word}-${index}`}
                className={`py-2 px-4 rounded-xl transition-all ${
                  index === 0
                    ? 'bg-white/[0.08] border border-white/[0.12] text-[#f2f1ed] font-serif text-2xl'
                    : 'text-[#626b80] text-sm'
                }`}
                style={{ opacity: 1 - index * 0.16 }}
              >
                {word}
              </div>
            ))}
          </div>

          <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-[#626b80]">Associative drift</span>

            <button
              onClick={handleNextWordChain}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
            >
              <span>Drift to Next Word</span>
              <Sparkles className="w-3.5 h-3.5 text-[#c4b5fd]" />
            </button>
          </div>
        </>
      )}

      {/* ================= SLOW COUNTER ================= */}
      {type === 'slow_counter' && (
        <>
          <div className="text-xs text-[#9aa2b5] mb-2">
            Breathe out as each number falls away.
          </div>

          <div className="w-full my-auto py-10 px-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center">
            <span className="font-mono text-6xl sm:text-7xl font-light text-[#f2f1ed] mb-3 tabular-nums">
              {counterValue}
            </span>

            <p className="text-xs text-[#9aa2b5] leading-relaxed">
              Exhale slowly and let go of this number.
            </p>
          </div>

          <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setCounterValue(50)}
              className="text-xs text-[#626b80] hover:text-[#9aa2b5] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleNextCount}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors flex items-center gap-2 border border-white/[0.08]"
            >
              <span>Next Number</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* ================= MENTAL WALK ================= */}
      {type === 'mental_walk' && (
        <>
          <div className="w-full my-auto py-8 px-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-lg flex flex-col items-center">
            <h3 className="font-serif text-2xl text-[#f2f1ed] mb-3">
              A Familiar Route
            </h3>
            <p className="text-sm text-[#9aa2b5] leading-relaxed mb-4">
              Close your eyes. Step out your front door in your memory. Walk slowly down the familiar sidewalk.
            </p>
            <p className="text-xs text-[#626b80] italic leading-relaxed max-w-xs">
              Notice the quiet streetlamps, the quiet trees, the color of front doors. You know every step. You are completely safe.
            </p>
          </div>

          <div className="w-full flex items-center justify-end pt-4 border-t border-white/[0.06]">
            <button
              onClick={onComplete}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors border border-white/[0.08]"
            >
              Finish Mental Walk
            </button>
          </div>
        </>
      )}
    </div>
  );
};
