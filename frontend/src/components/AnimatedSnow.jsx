import { useMemo } from 'react';

export default function AnimatedSnow() {
  const flakeCount = 60;

  const flakes = useMemo(() => {
    return Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: `${(i * 137.508) % 100}%`,
      size: 4 + Math.random() * 8,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
      opacity: 0.4 + Math.random() * 0.5,
      drift: 20 + Math.random() * 40,
      driftDuration: 2 + Math.random() * 3,
    }));
  }, [flakeCount]);

  return (
    <>
      <style>{`
        .snowflake {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 230, 255, 0.4) 100%);
          border-radius: 50%;
          animation: snowFall var(--duration) linear infinite, snowDrift var(--driftDuration) ease-in-out infinite alternate;
          animation-delay: var(--delay);
          opacity: var(--opacity);
          will-change: transform;
        }
        .snow-accumulation {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.15), transparent);
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          filter: blur(5px);
        }
      `}</style>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            top: `-${flake.size}px`,
            '--size': `${flake.size}px`,
            '--duration': `${flake.duration}s`,
            '--delay': `${flake.delay}s`,
            '--opacity': flake.opacity,
            '--drift': `${flake.drift}px`,
            '--driftDuration': `${flake.driftDuration}s`,
          }}
        />
      ))}
      <div className="snow-accumulation" />
    </>
  );
}