import { useEffect, useRef } from 'react';

/**
 * useInactivityTimer
 * Triggers a callback after X milliseconds of no user interaction (mouse, key, touch).
 */
const useInactivityTimer = (onIdle: () => void, timeout: number = 120000) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onIdle, timeout);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer initially

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onIdle, timeout]);
};

export default useInactivityTimer;
