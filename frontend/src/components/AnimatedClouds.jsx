import { useMemo } from 'react';

export default function AnimatedClouds({ density = 'medium' }) {
  const layerConfig = useMemo(() => {
    switch (density) {
      case 'heavy': return [
        { count: 6, speed: 30, opacity: 0.3, top: '10%', scale: 1.2 },
        { count: 5, speed: 25, opacity: 0.4, top: '30%', scale: 1 },
        { count: 4, speed: 20, opacity: 0.5, top: '50%', scale: 0.8 },
      ];
      case 'light': return [
        { count: 3, speed: 35, opacity: 0.2, top: '20%', scale: 1 },
      ];
      default: return [
        { count: 4, speed: 30, opacity: 0.3, top: '15%', scale: 1.1 },
        { count: 3, speed: 25, opacity: 0.4, top: '40%', scale: 1 },
      ];
    }
  }, [density]);

  const cloudShapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${(i * 137.508) % 100}%`,
    }));
  }, []);

  return (
    <>
      <style>{`
        .cloud-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .cloud {
          position: absolute;
          background: radial-gradient(ellipse, rgba(255, 255, 255, var(--cloud-opacity)) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          animation: cloudDrift var(--speed) linear infinite;
          will-change: transform;
        }
        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: inherit;
          border-radius: 50%;
        }
        .cloud::before {
          width: 60%;
          height: 80%;
          top: -40%;
          left: 20%;
        }
        .cloud::after {
          width: 50%;
          height: 70%;
          top: -30%;
          right: 20%;
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(calc(100vw + 150px)); }
        }
      `}</style>
      {layerConfig.map((layer, layerIdx) => (
        <div key={layerIdx} className="cloud-layer" style={{ top: layer.top }}>
          {cloudShapes.slice(0, layer.count).map((cloud) => (
            <div
              key={cloud.id}
              className="cloud"
              style={{
                left: cloud.left,
                width: `${80 * layer.scale}px`,
                height: `${40 * layer.scale}px`,
                '--speed': `${layer.speed + Math.random() * 10}s`,
                '--cloud-opacity': layer.opacity,
                animationDelay: `${-Math.random() * layer.speed}s`,
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
}