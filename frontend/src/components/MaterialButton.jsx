import { useState } from 'react';

export default function MaterialButton({ 
  children, 
  className = '', 
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style 
}) {
  const [ripples, setRipples] = useState([]);

  const variants = {
    filled: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white',
      secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
      weather: 'bg-weather-rain hover:bg-weather-rainLight text-white',
    },
    outlined: {
      primary: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
      secondary: 'border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-50',
      weather: 'border-2 border-weather-rain text-weather-rain hover:bg-weather-rain/10',
    },
    text: {
      primary: 'text-primary-500 hover:bg-primary-50',
      secondary: 'text-secondary-500 hover:bg-secondary-50',
      weather: 'text-weather-rain hover:bg-weather-rain/10',
    },
  };

  const sizes = {
    small: 'px-4 py-2 text-sm rounded-2xl',
    medium: 'px-6 py-3 text-base rounded-2xl',
    large: 'px-8 py-4 text-lg rounded-3xl',
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
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`
        font-semibold
        transition-all duration-200 ease-out
        transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]?.[color] || variants.filled.primary}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={style}
    >
      <span className="relative overflow-hidden inline-flex items-center justify-center gap-2">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-current/10 rounded-full animate-ripple"
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
              width: 200,
              height: 200,
            }}
          />
        ))}
        {children}
      </span>
    </button>
  );
}