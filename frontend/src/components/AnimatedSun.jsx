export default function AnimatedSun() {
  return (
    <>
      <style>{`
        .sun-container {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          z-index: 0;
        }
        .sun-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #FBBF24 0%, #F59E0B 40%, rgba(245, 158, 11, 0.3) 70%, transparent 100%);
          border-radius: 50%;
          animation: sunPulse 4s ease-in-out infinite;
          filter: blur(2px);
        }
        .sun-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 120px;
          background: linear-gradient(to top, rgba(251, 191, 36, 0.4), transparent);
          border-radius: 2px;
          transform-origin: center bottom;
          animation: sunRotate 20s linear infinite;
        }
        .sun-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: sunPulse 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .heat-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(251, 191, 36, 0.4);
          border-radius: 50%;
          animation: riseUp var(--duration) ease-in infinite;
          animation-delay: var(--delay);
        }
        @keyframes sunPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.85; }
        }
        @keyframes sunRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes riseUp {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
      `}</style>
      <div className="sun-container">
        <div className="sun-glow" />
        <div className="sun-core" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <div
            key={angle}
            className="sun-ray"
            style={{
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="heat-particle"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${60 + Math.random() * 20}%`,
              '--duration': `${4 + Math.random() * 3}s`,
              '--delay': `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}