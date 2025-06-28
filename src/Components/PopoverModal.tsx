import React, { useEffect, useState } from 'react';

const PopoverModal = ({ event, onClose }: { event: any; onClose: () => void }) => {
  const [visible, setVisible] = useState(false);

  const start = new Date(event.start).toLocaleString();
  const end = event.end ? new Date(event.end).toLocaleString() : null;
  const { calendarSource, location, description } = event.extendedProps;

  const sourceColors: Record<string, string> = {
    gigs: '#00bfa5',
    beanie: '#1e40af',
    connor: '#dc2626',
    family: '#16a34a',
    bills: '#7c3aed',
  };

  const headerColor = sourceColors[calendarSource] || '#444';

  useEffect(() => {
    // Trigger slide-in animation
    setVisible(true);
  }, []);

  return (
    <>
      {/* 🔲 Blurred Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />

      {/* 📦 Modal Panel */}
      <div
        style={{
          position: 'fixed',
          top: visible ? '10%' : '-100%',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.4s ease',
          background: '#1e1e1e',
          border: `3px solid ${headerColor}`,
          borderRadius: '1rem',
          boxShadow: '0 0 20px rgba(0,0,0,0.6)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '500px',
          padding: '1.5rem',
          color: '#f0f0f0',
          fontFamily: 'sans-serif',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: headerColor,
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          {event.title}
        </h2>

        <p><strong>📅 Start:</strong> {start}</p>
        {end && <p><strong>⏰ End:</strong> {end}</p>}
        <p><strong>📂 Calendar:</strong> {calendarSource}</p>

        {location && (
            <div style={{ marginTop: '1rem' }}>
                <strong>📍 Location:</strong>
                <div
                style={{
                    backgroundColor: '#2c2c2c',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    whiteSpace: 'pre-wrap',
                    marginTop: '0.5rem',
                    color: '#ccc',
                }}
                >
                {location}
                </div>
            </div>
        )}


        {description && (
          <div style={{ marginTop: '1rem' }}>
            <strong>📝 Description:</strong>
            <div
              style={{
                backgroundColor: '#2c2c2c',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
                marginTop: '0.5rem',
                color: '#ccc',
              }}
            >
              {description}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '1rem',
            fontSize: '1.2rem',
            backgroundColor: headerColor,
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default PopoverModal;
