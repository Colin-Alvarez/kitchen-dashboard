// DashboardWithScreensaver.tsx
import { useEffect, useRef } from 'react';
import MainDashboard from './MainDashboard';
import { useAppContext } from './context/AppContext';
import SlideShowOverlay from './screensaver/SlideShowOverlay';
import Clouds from './Components/Clouds';
import CloudEasterEggs from './Components/CloudEasterEggs';

const INACTIVITY_TIMEOUT = 180000; // 3 minutes

const DashboardWithScreensaver = () => {
  const { isIdle, setIsIdle } = useAppContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsIdle(false);
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, INACTIVITY_TIMEOUT);
  };

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
    <div className="w-screen h-screen overflow-hidden fixed top-0 left-0 bg-black">
      <div
        className="absolute top-0 left-0 w-[1080px] h-[1920px] overflow-hidden"
        style={{
          transform: `scale(${window.innerWidth / 1080})`,
          transformOrigin: 'top left',
        }}
      >
        {/* 🌥️ Animated background clouds */}
        <div className="cloud" style={{ '--top': '10%', '--delay': '0s', '--duration': '60s' } as React.CSSProperties} />
        <div className="cloud" style={{ '--top': '30%', '--delay': '5s', '--duration': '80s' } as React.CSSProperties} />
        <div className="cloud" style={{ '--top': '50%', '--delay': '10s', '--duration': '100s' } as React.CSSProperties} />

        <Clouds />
        <CloudEasterEggs />
        <MainDashboard />
        {isIdle && !window.__modalOpen && <SlideShowOverlay />}
      </div>
    </div>
  );
};

export default DashboardWithScreensaver;
