import React, { useMemo } from 'react';

interface NightSkyBackgroundProps {
  showLargeMoon?: boolean;
}

export const NightSkyBackground: React.FC<NightSkyBackgroundProps> = ({ showLargeMoon = true }) => {
  // Generate a deterministic constellation of subtle stars
  const stars = useMemo(() => {
    const list = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const top = ((i * 37) % 97) + 1;
      const left = ((i * 59) % 99) + 0.5;
      const size = (i % 3 === 0 ? 2 : 1.2);
      const opacity = 0.2 + ((i % 5) * 0.12);
      const delay = (i % 7) * 1.2;
      list.push({ id: i, top, left, size, opacity, delay });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#07090e]">
      {/* Deep atmospheric gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, #161e30 0%, #0c111a 50%, #07090e 100%)',
        }}
      />

      {/* Gentle moonlight glow reservoir in upper portion */}
      {showLargeMoon && (
        <div 
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[340px] md:w-[540px] h-[340px] md:h-[540px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200, 215, 245, 0.08) 0%, rgba(140, 165, 210, 0.03) 45%, transparent 70%)',
            filter: 'blur(35px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* The Moon */}
      {showLargeMoon && (
        <div 
          className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-85 transition-opacity duration-1000"
          aria-hidden="true"
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full">
            {/* Outer soft moonlight haze */}
            <div 
              className="absolute -inset-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(225, 235, 255, 0.14) 0%, rgba(180, 200, 240, 0.04) 60%, transparent 80%)',
                filter: 'blur(12px)',
              }}
            />
            {/* Moon disc */}
            <div 
              className="w-full h-full rounded-full shadow-[inset_-8px_-8px_20px_rgba(10,14,24,0.7),0_0_35px_rgba(200,220,255,0.12)]"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #f4f3ee 0%, #d8deeb 35%, #9aa9c4 75%, #5a6b8c 100%)',
              }}
            >
              {/* Subtle lunar maria / craters */}
              <div 
                className="absolute inset-0 rounded-full opacity-30 mix-blend-multiply"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 45% 40%, rgba(60, 75, 105, 0.4) 0%, transparent 28%),
                    radial-gradient(circle at 65% 55%, rgba(50, 65, 95, 0.35) 0%, transparent 25%),
                    radial-gradient(circle at 30% 65%, rgba(65, 80, 110, 0.3) 0%, transparent 20%)
                  `,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Subtle Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#f3f2ee]"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: star.size > 1.5 ? '0 0 3px rgba(255, 255, 255, 0.6)' : 'none',
            animation: `pulse 7s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Very subtle grain */}
      <div className="absolute inset-0 night-grain opacity-40 mix-blend-soft-light" aria-hidden="true" />
    </div>
  );
};
