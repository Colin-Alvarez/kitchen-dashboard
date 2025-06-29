import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { Droplets, Wind, Snowflake, CloudRain } from 'lucide-react';
import WeatherOverlay from './WeatherOverlay';

interface Photo {
  id: string;
  url: string;
}

interface WeatherDay {
  day: string;
  icon: string;
  iconCode: string;
  high: number;
  low: number;
  pop: number;
  rain: number;
  snow: number;
  wind: number;
  humidity: number;
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
          const iconCode = d.weather[0]?.icon || '01d';

          return {
            day: date.toLocaleDateString(undefined, options),
            icon: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
            iconCode,
            high: Math.round(d.temp.max),
            low: Math.round(d.temp.min),
            rain: d.rain || 0,
            snow: d.snow || 0,
            humidity: d.humidity,
            wind: Math.round(d.wind_speed),
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

      // 🎲 Shuffle the photo array randomly
      const shuffled = urls.sort(() => 0.5 - Math.random());

      setPhotos(shuffled);
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
    if (iconCode.startsWith('50')) return 'fogFade 5s ease-in-out infinite';
    return 'none';
  };

  const getTempColor = (high: number) => {
    if (high >= 90) return '#f97316';
    if (high <= 60) return '#60a5fa';
    return '#e5e7eb';
  };

  const getBackgroundClass = () => {
    const now = new Date();
    const hour = now.getHours();
    const currentIcon = forecast[0]?.iconCode || '';

    let base = '';

    if (hour >= 5 && hour < 11) base = 'from-white to-gray-200';
    else if (hour >= 11 && hour < 18) base = 'from-gray-100 to-gray-300';
    else if (hour >= 18 && hour < 21) base = 'from-slate-200 to-slate-700';
    else base = 'from-zinc-800 to-black';

    if (currentIcon.startsWith('09') || currentIcon.startsWith('10')) {
      base = 'from-blue-100 to-blue-300';
    } else if (currentIcon.startsWith('13')) {
      base = 'from-slate-100 to-white';
    } else if (currentIcon.startsWith('01')) {
      base = 'from-amber-50 to-amber-200';
    }

    return `bg-gradient-to-br ${base}`;
  };

  return (
    <div
      className={`pointer-events-none transition-all duration-700 ${
        isScreensaverActive ? 'brightness-75' : ''
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 99999,
      }}
    >
      {isScreensaverActive && forecast.length > 0 && (
        <>
          <div
            className={`fixed inset-0 z-[99998] ${getBackgroundClass()}`}
            style={{
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          />
          <WeatherOverlay iconCode={forecast[0].iconCode} />
        </>
      )}

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isShowing && currentPhoto && (
          <motion.div
            key={currentPhoto.id}
            className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[1080px] h-[800px] rounded-[28px] border-[12px] border-white/20 drop-shadow-2xl bg-black overflow-hidden flex items-center justify-center z-[100001]"
            initial={{ x: -1200, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: [1, 1.01, 1] }}
            exit={{ x: 1200, opacity: 0 }}
            transition={{
              x: { duration: 1.5, ease: 'easeInOut' },
              opacity: { duration: 1.5 },
              scale: { duration: 30, ease: 'easeInOut' },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10 pointer-events-none backdrop-blur-sm" />
            <div className="w-[1080px] h-[800px] relative z-20 flex items-center justify-center">
              <img
                src={currentPhoto.url}
                alt="floating memory"
                className="max-w-[1080px] max-h-[800px] object-contain"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
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
            left: '2%',
            transform: 'translateX(-50%)',
            maxWidth: '90%',
            width: '1000px',
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#f1f5f9',
            padding: '20px 30px',
            borderRadius: '18px',
            fontSize: '35px',
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
            left: 0,
            width: '100%',
            height: '200px',
            bottom: '2px',
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
              <div style={{ fontSize: 20, fontWeight: 600 }}>{day.day}</div>
              <img
                src={day.icon}
                alt={day.day}
                style={{
                  width: 90,
                  height: 90,
                  margin: '0 auto',
                  display: 'block',
                  animation: getWeatherAnimation(day.iconCode),
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/weather-icons/fallback.png';
                }}
              />
              <div style={{ fontSize: 15, fontWeight: 500, color: getTempColor(day.high) }}>
                {day.high}° / {day.low}°
              </div>
              <div style={{ fontSize: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Droplets size={15} /> {day.pop}%
                {day.rain > 0 && <><CloudRain size={18} /> {day.rain}mm</>}
                {day.snow > 0 && <><Snowflake size={18} /> {day.snow}mm</>}
              </div>
              <div style={{ fontSize: 15, opacity: 0.7, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Wind size={15} /> {day.wind} mph • <Droplets size={18} /> {day.humidity}%
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingPhotoSlideshow;
