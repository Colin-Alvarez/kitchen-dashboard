import { useState } from 'react';

const LOGO_URL = '/control4-logo.jpeg';

interface Control4LauncherProps {
  onClose: () => void;
}

const Control4Launcher = ({ onClose }: Control4LauncherProps) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await fetch('http://localhost:3001/launch-control4', { method: 'POST' });
      console.log('✅ Control4 launched');
    } catch (err) {
      console.error('❌ Launch error:', err);
    } finally {
      setIsLaunching(false);
      onClose();
    }
  };

  return (
    <div
      className="w-[180px] h-[180px] flex items-center justify-center"
      style={{ width: '140px', height: '140px', overflow: 'hidden' }}
    >
      <img
        src={LOGO_URL}
        alt="Control4 Logo"
        onClick={handleLaunch}
        className="cursor-pointer object-contain"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '180px',
          maxHeight: '180px',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

export default Control4Launcher;
