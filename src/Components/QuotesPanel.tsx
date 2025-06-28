import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // 👈 Adjust this if your supabase.ts path is different
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: number;
  quote: string;
  author: string;
}

const QuotesPanel = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, quote, author')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching quotes:', error);
      } else {
        const shuffled = shuffleArray((data || []) as Quote[]);
        setQuotes(shuffled);
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 60 * 60 * 1000); // every hour

    return () => clearInterval(interval);
  }, [quotes]);

  const handleManualRefresh = () => {
    if (quotes.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }
  };

  if (isLoading || quotes.length === 0 || !quotes[currentIndex]) {
    return (
      <div
        style={{
          width: '100%',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontStyle: 'italic',
          fontSize: '1.2rem',
          color: 'gray',
        }}
      >
        Loading quote...
      </div>
    );
  }

  const current = quotes[currentIndex];

  return (
    <div
      style={{
        width: '100%',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={handleManualRefresh}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          color: 'black',
          fontWeight: 'bold',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <RefreshCw className="w-4 h-4" />
        Next Quote
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: '1.5rem',
              fontStyle: 'italic',
              color: 'black',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            “{current.quote}” — <span style={{ fontWeight: 600 }}>{current.author}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuotesPanel;
