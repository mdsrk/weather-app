import { useState } from 'react';

export default function MaterialCard({ 
  children, 
  className = '', 
  elevation = 1,
  hover = true,
  onClick,
  style 
}) {
  const [ripples, setRipples] = useState([]);

  const elevations = {
    0: 'shadow-none',
    1: 'shadow-sm hover:shadow-md',
    2: 'shadow-md hover:shadow-lg',
    3: 'shadow-lg hover:shadow-xl',
    4: 'shadow-lg hover:shadow-xl',
  };

  function handleClick(e) {
    if (onClick) return onClick(e);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }

  return (
    <div
      className={`
        bg-white rounded-3xl ${elevations[elevation]}
        ${hover ? 'transition-all duration-300 ease-out' : ''}
        ${hover ? 'hover:scale-[1.02]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleClick}
      style={style}
    >
      {/* Material Ripple */}
      <div className="relative overflow-hidden">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-gray-400/20 rounded-full animate-ripple"
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
              width: 200,
              height: 200,
            }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}