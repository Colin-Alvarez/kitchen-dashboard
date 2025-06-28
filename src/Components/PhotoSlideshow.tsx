// src/components/PhotoSlideshow.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const SLIDE_DURATION = 8000;

const PhotoSlideshow = () => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase.storage.from('photos').list('', { limit: 100 });
      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      const urls = await Promise.all(
        data
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map(file => supabase.storage.from('photos').getPublicUrl(file.name).data.publicUrl)
      );

      setPhotoUrls(urls);
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        photoUrls.length ? (prevIndex + 1) % photoUrls.length : 0
      );
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [photoUrls]);

  if (!photoUrls.length) return <div className="text-white">Loading photos...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence>
        <motion.img
          key={photoUrls[currentIndex]}
          src={photoUrls[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="max-w-full max-h-full object-contain"
        />
      </AnimatePresence>
    </div>
  );
};

export default PhotoSlideshow;
