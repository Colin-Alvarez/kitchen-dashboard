// ...same imports

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { XCircle } from "lucide-react";

type TodayModalProps = {
  events: any[];
  calendarColors: Record<string, string>;
  onDismiss: () => void;
  onSnooze: () => void;
};

const TodayModal = ({ events, calendarColors, onDismiss, onSnooze }: TodayModalProps) => {
  const [chores, setChores] = useState<any[]>([]);
  const [weather, setWeather] = useState<string>('Loading weather...');

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const fetchChores = async () => {
      const { data, error } = await supabase
        .from('chores')
        .select('*')
        .or(`and(completed_by.lte.${todayStr},done.eq.false)`)
        .order('completed_by', { ascending: true });

      if (!error && data) setChores(data);
    };

    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/?format=3');
        const text = await res.text();
        setWeather(text);
      } catch (err) {
        setWeather('Unable to fetch weather');
      }
    };

    fetchChores();
    fetchWeather();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const todayEvents = events.filter(
    (e) => typeof e.start === 'string' && e.start.startsWith(today)
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[90vw] max-w-5xl text-black relative overflow-y-auto max-h-[85vh]" style={{ fontFamily: 'Gloria Hallelujah, cursive' }}>
        <button onClick={onDismiss} className="absolute top-6 right-6 text-yellow-700 hover:text-red-500">
          <XCircle size={40} />
        </button>

        <h2 className="text-5xl font-bold text-center mb-6">Today at a Glance</h2>

        <div className="mb-6 text-3xl text-center">🌤️ {weather}</div>

        <div className="mb-10">
          <h3 className="text-3xl font-bold mb-2">📅 Events:</h3>
          {todayEvents.length ? (
            <ul className="space-y-2">
              {todayEvents.map((e, i) => (
                <li key={i} className="text-2xl font-semibold" style={{ color: calendarColors[e.extendedProps?.calendarSource] || '#000' }}>
                  {e.title} — {new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </li>
              ))}
            </ul>
          ) : <p className="text-xl italic">No events scheduled.</p>}
        </div>

        <div className="mb-10">
          <h3 className="text-3xl font-bold mb-2">🧹 Chores:</h3>
          {chores.length ? (
            <ul className="space-y-2">
              {chores.map(chore => (
                <li key={chore.id} className="text-2xl">
                  {chore.task} — due {new Date(chore.completed_by).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : <p className="text-xl italic">No chores for today.</p>}
        </div>

        <div className="flex justify-center gap-8 mt-4">
          <button onClick={onDismiss} className="text-2xl bg-green-400 hover:bg-green-500 px-6 py-3 rounded-xl font-bold">
            Got it!
          </button>
          <button onClick={onSnooze} className="text-2xl bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-bold">
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayModal;
