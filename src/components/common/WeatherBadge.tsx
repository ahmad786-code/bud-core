import React from 'react';
import { Sun, Cloud, CloudRain, Wind, CloudSnow } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = 'w-4 h-4' }) => {
  switch (condition) {
    case 'Słonecznie':
      return <Sun className={`${className} text-amber-500`} />;
    case 'Pochmurno':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'Deszcz':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'Wiatr':
      return <Wind className={`${className} text-cyan-600`} />;
    case 'Śnieg':
      return <CloudSnow className={`${className} text-sky-400`} />;
    default:
      return <Sun className={`${className} text-amber-500`} />;
  }
};
