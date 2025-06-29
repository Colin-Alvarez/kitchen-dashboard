import React from 'react';
import { useAppContext } from '../context/AppContext';
import FloatingPhotoSlideshow from '../Components/FloatingPhotoSlideshow';

const SlideShowOverlay = () => {
  const { isIdle } = useAppContext();

  if (!isIdle) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      pointerEvents: 'none',
    }}>
      {/* 🔲 Same blur backdrop used in PopoverModal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // lighter gray tone
          zIndex: 9999,
        }}
      />

      {/* 🖼️ Slideshow and other overlay content */}
      <FloatingPhotoSlideshow isScreensaverActive={isIdle} />
    </div>
  );
};

export default SlideShowOverlay;
