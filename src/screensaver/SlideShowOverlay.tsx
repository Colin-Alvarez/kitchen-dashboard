import React from 'react';
import { useAppContext } from '../context/AppContext';
import FloatingPhotoSlideshow from '../Components/FloatingPhotoSlideshow';

const SlideShowOverlay = () => {
  const { isIdle } = useAppContext();

  if (!isIdle) return null;

  return (
    <div className="fixed inset-0 z-[9999] screensaver-overlay">
      <FloatingPhotoSlideshow isScreensaverActive={isIdle} />
    </div>
  );
};

export default SlideShowOverlay;
