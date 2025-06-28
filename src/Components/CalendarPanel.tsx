// CalendarPanel.tsx (with filters overlaid center-top on calendar header)
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchCalendarEvents } from '../utils/googleApi';
import PopoverModal from './PopoverModal';
import TodayModal from './TodayModal';

const sourceColors: Record<string, string> = {
  gigs: '#00bfa5',
  beanie: '#1e40af',
  connor: '#dc2626',
  family: '#16a34a',
  bills: '#7c3aed',
};

const CalendarPanel = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeCalendars, setActiveCalendars] = useState<string[]>(Object.keys(sourceColors));
  const [showTodayModal, setShowTodayModal] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchCalendarEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const fiveAM = new Date();
    fiveAM.setHours(5, 0, 0, 0);
    const key = `today_modal_shown_${now.toDateString()}`;
    if (now >= fiveAM && !localStorage.getItem(key)) {
      setShowTodayModal(true);
    }
  }, []);

  const handleDismissTodayModal = () => {
    const key = `today_modal_shown_${new Date().toDateString()}`;
    localStorage.setItem(key, 'true');
    setShowTodayModal(false);
  };

  const handleSnoozeTodayModal = () => {
    setTimeout(() => setShowTodayModal(true), 60 * 60 * 1000);
    setShowTodayModal(false);
  };

  const toggleCalendarSource = (source: string) => {
    setActiveCalendars(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const filteredEvents = events.filter(e =>
    activeCalendars.includes(e.extendedProps?.calendarSource)
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 🎛 Overlay Filter Buttons - Top Center */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: 'rgba(30,30,30,0.8)',
          padding: '0.5rem 1rem',
          borderRadius: '1rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        {Object.keys(sourceColors).map(source => (
          <button
            key={source}
            onClick={() => toggleCalendarSource(source)}
            style={{
              padding: '0.3rem 0.75rem',
              backgroundColor: activeCalendars.includes(source) ? sourceColors[source] : '#555',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {source.charAt(0).toUpperCase() + source.slice(1)}
          </button>
        ))}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        height="100%"
        aspectRatio={25.2}
        eventDisplay="block"
        eventClick={(info) => setSelectedEvent(info.event)}
        eventContent={(eventInfo) => {
          const source = eventInfo.event.extendedProps.calendarSource;
          const color = sourceColors[source] || '#333';
          return (
            <div
              style={{
                backgroundColor: color,
                borderRadius: '4px',
                padding: '2px',
                color: '#fff',
                fontSize: '0.8rem',
              }}
            >
              <b>{eventInfo.event.title}</b>
            </div>
          );
        }}
      />

      {selectedEvent && (
        <PopoverModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showTodayModal && (
        <TodayModal
          events={events}
          calendarColors={sourceColors}
          onDismiss={handleDismissTodayModal}
          onSnooze={handleSnoozeTodayModal}
        />
      )}
    </div>
  );
};

export default CalendarPanel;
