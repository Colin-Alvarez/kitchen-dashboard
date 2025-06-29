import { useEffect, useState } from 'react';

const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const heightScale = window.innerHeight / 1920;
      const widthScale = window.innerWidth / 1080;
      setScale(Math.min(heightScale, widthScale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: '1080px',
        height: '1920px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default ScaleWrapper;
