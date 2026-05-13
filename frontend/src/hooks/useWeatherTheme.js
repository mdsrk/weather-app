import { useMemo } from 'react';

export function useWeatherTheme(conditions) {
  return useMemo(() => {
    const c = (conditions || '').toLowerCase();
    
    if (c.includes('thunder') || c.includes('lightning') || c.includes('storm')) {
      return {
        type: 'storm',
        gradient: 'from-gray-900 via-purple-900 to-gray-900',
        gradientLight: 'from-gray-700 via-gray-800 to-gray-900',
        accent: '#6366F1',
        accentLight: '#818CF8',
        bgDark: 'bg-gray-900',
        bgLight: 'bg-gray-800',
        cardBg: 'bg-white/10',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-300',
        icon: '⛈️',
      };
    }
    
    if (c.includes('rain') || c.includes('drizzle') || c.includes('sleet')) {
      return {
        type: 'rain',
        gradient: 'from-blue-700 via-blue-800 to-indigo-900',
        gradientLight: 'from-blue-600 via-blue-700 to-indigo-800',
        accent: '#3B82F6',
        accentLight: '#60A5FA',
        bgDark: 'bg-blue-900',
        bgLight: 'bg-blue-800',
        cardBg: 'bg-white/10',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-200',
        icon: '🌧️',
      };
    }
    
    if (c.includes('snow') || c.includes('hail')) {
      return {
        type: 'snow',
        gradient: 'from-cyan-100 via-blue-50 to-white',
        gradientLight: 'from-cyan-200 via-blue-100 to-white',
        accent: '#06B6D4',
        accentLight: '#22D3EE',
        bgDark: 'bg-cyan-50',
        bgLight: 'bg-cyan-100',
        cardBg: 'bg-white/60',
        textPrimary: 'text-gray-800',
        textSecondary: 'text-gray-600',
        icon: '🌨️',
      };
    }
    
    if (c.includes('clear') || c.includes('sunny') || c.includes('sun')) {
      return {
        type: 'clear',
        gradient: 'from-amber-400 via-orange-400 to-blue-400',
        gradientLight: 'from-amber-300 via-orange-300 to-sky-300',
        accent: '#F59E0B',
        accentLight: '#FBBF24',
        bgDark: 'bg-amber-500',
        bgLight: 'bg-orange-400',
        cardBg: 'bg-white/20',
        textPrimary: 'text-white',
        textSecondary: 'text-amber-100',
        icon: '☀️',
      };
    }
    
    if (c.includes('partly')) {
      return {
        type: 'partly-cloudy',
        gradient: 'from-sky-400 via-blue-500 to-indigo-600',
        gradientLight: 'from-sky-300 via-blue-400 to-indigo-500',
        accent: '#3B82F6',
        accentLight: '#60A5FA',
        bgDark: 'bg-blue-600',
        bgLight: 'bg-blue-500',
        cardBg: 'bg-white/15',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-100',
        icon: '⛅',
      };
    }
    
    // Default cloudy/overcast/fog
    return {
      type: 'cloudy',
      gradient: 'from-slate-400 via-gray-500 to-slate-600',
      gradientLight: 'from-slate-300 via-gray-400 to-slate-500',
      accent: '#64748B',
      accentLight: '#94A3B8',
      bgDark: 'bg-gray-600',
      bgLight: 'bg-gray-500',
      cardBg: 'bg-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-200',
      icon: '☁️',
    };
  }, [conditions]);
}

export default useWeatherTheme;