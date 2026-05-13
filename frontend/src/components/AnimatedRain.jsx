import { useMemo } from 'react';

export default function AnimatedRain({ intensity = 'medium' }) {
  const dropCount = useMemo(() => {
    switch (intensity) {
      case 'heavy': return 100;
      case 'light': return 40;
      default: return 70;
    }
  }, [intensity]);

  const drops = useMemo(() => {
    return Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: `${(i * 137.508) % 100}%`,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.4,
      height: 15 + Math.random() * 10,
    }));
  }, [dropCount]);

  return (
    <>
      <style>{`
        .rain-drop {
          position: absolute;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.6));
          border-radius: 0 0 2px 2px;
          animation: rainFall var(--duration) linear infinite;
          animation-delay: var(--delay);
          opacity: var(--opacity);
          will-change: transform;
        }
        .rain-splash {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 20px;
          background: radial-gradient(ellipse at center, rgba(174, 194, 224, 0.2) 0%, transparent 70%);
        }
        .rain-splash::before,
        .rain-splash::after {
          content: '';
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: rgba(174, 194, 224, 0.15);
          animation: splash 1.5s ease-out infinite;
        }
        .rain-splash::before {
          left: 20%;
          width: 4px;
          height: 2px;
          animation-delay: 0.3s;
        }
        .rain-splash::after {
          left: 60%;
          width: 6px;
          height: 3px;
          animation-delay: 0.8s;
        }
      `}</style>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: drop.left,
            top: `-${Math.random() * 20}px`,
            height: `${drop.height}px`,
            '--duration': `${drop.duration}s`,
            '--delay': `${drop.delay}s`,
            '--opacity': drop.opacity,
          }}
        />
      ))}
      <div className="rain-splash" />
    </>
  );
}