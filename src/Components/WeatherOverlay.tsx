import React from 'react';
import { motion } from 'framer-motion';

interface WeatherOverlayProps {
  iconCode: string;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ iconCode }) => {
  const renderOverlay = () => {
    if (iconCode.startsWith('01')) {
      // ☀️ Sunny
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,200,0.1) 0%, transparent 70%)' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      );
    }

    if (iconCode.startsWith('02') || iconCode.startsWith('03')) {
      // 🌤️ Cloudy
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-white/10 backdrop-blur-sm"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      );
    }

    if (iconCode.startsWith('09') || iconCode.startsWith('10')) {
      // 🌧️ Rain
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.05) 0px, transparent 2px, transparent 6px)',
            backgroundSize: '2px 100%',
          }}
          animate={{ backgroundPositionY: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      );
    }

    if (iconCode.startsWith('11')) {
      // ⛈️ Storm
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-white"
          animate={{ opacity: [0, 0.3, 0, 0.1, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      );
    }

    if (iconCode.startsWith('13')) {
      // ❄️ Snow
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ backgroundImage: 'url(/snowflakes.png)', backgroundSize: 'cover', opacity: 0.15 }}
          animate={{ backgroundPositionY: ['0%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      );
    }

    if (iconCode.startsWith('50')) {
      // 🌫️ Fog
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-gray-300/10 backdrop-blur-sm"
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      );
    }

    return null;
  };

  return <>{renderOverlay()}</>;
};

export default WeatherOverlay;
