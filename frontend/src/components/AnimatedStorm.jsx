export default function AnimatedStorm() {
  return (
    <>
      <style>{`
        .storm-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(30, 30, 50, 0.3), rgba(50, 50, 80, 0.2));
          pointer-events: none;
          z-index: 1;
        }
        .lightning-flash {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0);
          pointer-events: none;
          animation: lightning 4s infinite;
          z-index: 2;
        }
        .heavy-rain-drop {
          position: absolute;
          width: 3px;
          background: linear-gradient(to bottom, transparent, rgba(150, 170, 200, 0.5));
          border-radius: 0 0 3px 3px;
          animation: heavyRainFall 0.4s linear infinite;
          will-change: transform;
        }
        .storm-cloud {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          background: linear-gradient(to bottom, rgba(40, 40, 60, 0.6), rgba(60, 60, 80, 0.2), transparent);
          filter: blur(10px);
          z-index: 0;
        }
        @keyframes lightning {
          0%, 94%, 100% { background: rgba(255, 255, 255, 0); }
          95% { background: rgba(255, 255, 255, 0.3); }
          96% { background: rgba(255, 255, 255, 0); }
          97% { background: rgba(200, 200, 255, 0.2); }
          98% { background: rgba(255, 255, 255, 0); }
        }
        @keyframes heavyRainFall {
          0% { transform: translateY(-20px) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(-30px); opacity: 0; }
        }
      `}</style>
      <div className="storm-cloud" />
      <div className="storm-overlay" />
      <div className="lightning-flash" />
      {Array.from({ length: 80 }, (_, i) => (
        <div
          key={i}
          className="heavy-rain-drop"
          style={{
            left: `${(i * 137.508) % 100}%`,
            top: `-${Math.random() * 30}px`,
            height: `${20 + Math.random() * 15}px`,
            animationDelay: `${Math.random() * 0.5}s`,
            opacity: 0.4 + Math.random() * 0.3,
          }}
        />
      ))}
    </>
  );
}