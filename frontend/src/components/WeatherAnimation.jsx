import { useMemo } from 'react';
import AnimatedRain from './AnimatedRain';
import AnimatedSnow from './AnimatedSnow';
import AnimatedSun from './AnimatedSun';
import AnimatedClouds from './AnimatedClouds';
import AnimatedStorm from './AnimatedStorm';

export default function WeatherAnimation({ conditions, className = '' }) {
  const conditionType = useMemo(() => {
    const c = (conditions || '').toLowerCase();
    if (c.includes('thunder') || c.includes('lightning') || c.includes('storm')) return 'storm';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('sleet')) return 'rain';
    if (c.includes('snow') || c.includes('hail')) return 'snow';
    if (c.includes('clear') || c.includes('sunny') || c.includes('sun')) return 'clear';
    if (c.includes('cloud') || c.includes('fog') || c.includes('mist') || c.includes('overcast')) return 'cloudy';
    if (c.includes('partly')) return 'partly-cloudy';
    return 'clear';
  }, [conditions]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {conditionType === 'storm' && <AnimatedStorm />}
      {conditionType === 'rain' && <AnimatedRain intensity="heavy" />}
      {conditionType === 'partly-cloudy' && (
        <>
          <AnimatedSun />
          <AnimatedClouds density="medium" />
        </>
      )}
      {conditionType === 'clear' && <AnimatedSun />}
      {conditionType === 'snow' && <AnimatedSnow />}
      {conditionType === 'cloudy' && <AnimatedClouds density="heavy" />}
    </div>
  );
}