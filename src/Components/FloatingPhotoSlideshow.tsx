import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { supabase } from '../lib/supabase';

interface Photo {
  id: string;
  url: string;
}

interface WeatherDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  pop: number;
}

interface Trivia {
  text: string;
}

interface FloatingPhotoSlideshowProps {
  isScreensaverActive: boolean;
}

const FloatingPhotoSlideshow = ({ isScreensaverActive }: FloatingPhotoSlideshowProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isShowing, setIsShowing] = useState(false);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [triviaFact, setTriviaFact] = useState<Trivia | null>(null);

  const API_KEY = 'd4431a2e3c07dcf5ffd42934daf4e602';
  const LAT = 40.2904;
  const LON = -76.9369;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&exclude=hourly,minutely,current,alerts&units=imperial&appid=${API_KEY}`
        );

        const days = res.data.daily.slice(0, 7).map((d: any) => {
          const date = new Date(d.dt * 1000);
          const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
          return {
            day: date.toLocaleDateString(undefined, options),
            icon: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`,
            high: Math.round(d.temp.max),
            low: Math.round(d.temp.min),
            pop: Math.round(d.pop * 100),
          };
        });

        setForecast(days);
      } catch (err) {
        console.error('❌ Error fetching weather:', err);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchTriviaFact = async () => {
      try {
        const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        setTriviaFact({ text: res.data.text });
      } catch (err) {
        console.error('❌ Error fetching trivia fact:', err);
      }
    };

    fetchTriviaFact();
    const interval = setInterval(fetchTriviaFact, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase.storage.from('photos').list('', { limit: 100 });
      if (error) {
        console.error('❌ Error fetching photos:', error);
        return;
      }

      const urls = data
        .filter(item => item.name)
        .map(item => ({
          id: `${item.name}-${Date.now()}`,
          url: supabase.storage.from('photos').getPublicUrl(item.name).data.publicUrl,
        }));

      setPhotos(urls);
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!photos.length) return;
    setCurrentPhoto(photos[0]);
    setPhotoIndex(0);
    setIsShowing(true);
  }, [photos]);

  useEffect(() => {
    if (!isShowing) return;
    const timer = setTimeout(() => setIsShowing(false), 30000);
    return () => clearTimeout(timer);
  }, [isShowing]);

  const handleExitComplete = () => {
    const nextIndex = (photoIndex + 1) % photos.length;
    setCurrentPhoto(photos[nextIndex]);
    setPhotoIndex(nextIndex);
    setIsShowing(true);
  };

  const getWeatherAnimation = (iconCode: string) => {
    if (iconCode.startsWith('01')) return 'sunPulse 4s ease-in-out infinite';
    if (iconCode.startsWith('02') || iconCode.startsWith('03')) return 'cloudDrift 6s ease-in-out infinite';
    if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rainBounce 1.5s ease-in-out infinite';
    if (iconCode.startsWith('11')) return 'stormFlash 2s ease-in-out infinite';
    if (iconCode.startsWith('13')) return 'snowFall 3s ease-in-out infinite';
    return '';
  };

  const getTempColor = (high: number) => {
    if (high >= 90) return '#f97316';
    if (high <= 60) return '#60a5fa';
    return '#e5e7eb';
  };

  return (
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 99999,
      }}
    >

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isShowing && currentPhoto && (
         <motion.div
         key={currentPhoto.id}
         className="absolute bg-white border-[14px] border-neutral-200 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
         style={{
           top: '100px',
           left: '-200px',
           width: '100%',
           height: '1080px',
           overflow: 'hidden',
         }}
         initial={{ x: '-900px', opacity: 0 }}
         animate={{ x: 0, opacity: 1, scale: [1, 1.02, 1] }}
         exit={{ x: '120vw', opacity: 0 }}
         transition={{
           x: { duration: 1.5, ease: 'easeInOut' },
           opacity: { duration: 1.5 },
           scale: { duration: 30, ease: 'easeInOut' }
         }}
       >
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10 pointer-events-none backdrop-blur-sm" />
         <img
           src={currentPhoto.url}
           alt="floating memory"
           style={{
             width: '100%',
             height: '100%',
             objectFit: 'cover',
             objectPosition: 'center',
             zIndex: 0,
           }}
         />
       </motion.div>
       
        )}
      </AnimatePresence>

      {isScreensaverActive && triviaFact && (
        <motion.div
          key={triviaFact.text}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            top: '1250px',
            left: '10%',
            transform: 'translateX(-50%)',
            maxWidth: '90%',
            width: '1000px',
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#f1f5f9',
            padding: '20px 30px',
            borderRadius: '18px',
            fontSize: '50px',
            fontWeight: 500,
            fontFamily: 'handwriting',
            textAlign: 'center',
            justifyItems: 'center',
            lineHeight: 2,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            zIndex: 100002,
          }}
        >
          {triviaFact.text}
        </motion.div>
      )}

      {isScreensaverActive && forecast.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '350px',
            background: 'linear-gradient(to top, #1e293b, #334155)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            zIndex: 100000,
            padding: '0 10px',
            borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {forecast.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center', flex: 1, fontFamily: 'Raleway, sans-serif' }}
            >
              <div style={{ fontSize: 45, fontWeight: 600 }}>{day.day}</div>
              <img src={day.icon} alt={day.day} style={{ width: 150, height: 150, margin: '0 auto', display: 'block', animation: getWeatherAnimation(day.icon) }} />
              <div style={{ fontSize: 45, fontWeight: 500, color: getTempColor(day.high) }}>{day.high}° / {day.low}°</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingPhotoSlideshow;
