import { useEffect, useRef, useState } from 'react';
import MainDashboard from './MainDashboard';
import { useAppContext } from './context/AppContext';
import SlideShowOverlay from './screensaver/SlideShowOverlay';
import Clouds from './Components/Clouds';
import CloudEasterEggs from './Components/CloudEasterEggs';

const INACTIVITY_TIMEOUT = 1000; // Set to 3 minutes later

const DashboardWithScreensaver = () => {
  const { isIdle, setIsIdle } = useAppContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scale, setScale] = useState(() =>
    Math.min(window.innerWidth / 1080, window.innerHeight / 1920)
  );

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsIdle(false);
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / 1080;
      const heightScale = window.innerHeight / 1900;
      setScale(Math.min(widthScale, heightScale));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsIdle(true);
      }
    };

    resetTimer();
    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    window.addEventListener('keydown', handleKey);

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 overflow-hidden bg-black"
      style={{
        width: `${1080 * scale}px`,
        height: `${1920 * scale}px`,
      }}
    >
      <div
        className="absolute top-0 left-0 w-[1080px] h-[1920px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Cloud layers stay behind everything */}
        <Clouds />
        <CloudEasterEggs />

        {/* Main dashboard with blur if idle */}
        <div className={`relative z-0 ${isIdle ? 'blur-3xl brightness-75' : ''}`}>
          <MainDashboard />
        </div>

        {/* Screensaver overlay floats above it all */}
        {isIdle && !window.__modalOpen && <SlideShowOverlay />}
      </div>
    </div>
  );
};

export default DashboardWithScreensaver;
