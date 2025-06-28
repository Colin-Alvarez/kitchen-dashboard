import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EASTER_EGGS = [
  '🦄', // Unicorn
  '🐑', // Sheep
  '🍩', // Donut
  '🛸', // UFO
  '👻'  // Ghost
];

const getRandomPosition = () => ({
  top: `${Math.random() * 80 + 10}%`,
  duration: Math.random() * 60 + 40, // number, not string
  delay: Math.random() * 30,
});

const CloudEasterEggs = () => {
  const [egg, setEgg] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: '50%', duration: 60, delay: 0 });

  useEffect(() => {
    const trySpawnEgg = () => {
      if (egg) return; // one at a time

      const roll = Math.random();
      if (roll < 0.40) { // 15% chance
        const newEgg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
        const newPosition = getRandomPosition();
        setEgg(newEgg);
        setPosition(newPosition);

        // Despawn after it's gone across the screen
        setTimeout(() => {
          setEgg(null);
        }, (newPosition.duration + newPosition.delay) * 1000);
      }
    };

    const interval = setInterval(trySpawnEgg, 15000); // roll every 15s

    return () => clearInterval(interval);
  }, [egg]);

  if (!egg) return null;

  return (
    <motion.div
      className="absolute text-5xl pointer-events-none"
      style={{ top: position.top, left: '-100px', zIndex: 1 }}
      animate={{ x: '120vw' }}
      transition={{
        duration: position.duration,
        delay: position.delay,
        ease: 'linear',
      }}
    >
      {egg}
    </motion.div>
  );
};

export default CloudEasterEggs;
