import React, { useState, useEffect } from 'react';
import CalendarPanel from './Components/CalendarPanel';
import NotesPanel from './Components/NotesPanel';
import PhotoUploadQR from './Components/PhotoUploadQR';
import QuotesPanel from './Components/QuotesPanel';
import { useAppContext } from './context/AppContext';
import Control4Launcher from './Components/Control4Launcher';
import GroceryModal from './Components/GroceryModal';
import ChoreModal from './Components/ChoreModal';
import { ShoppingCart, ClipboardList } from 'lucide-react';

const DebugTrigger = () => {
  const { setIsIdle } = useAppContext();

  return (
    <button
      onClick={() => setIsIdle(true)}
      className="fixed top-4 right-4 bg-red-600 text-white px-3 py-1 rounded z-50"
    >
      Trigger Screensaver
    </button>
  );
};

const panelStyle = {
  backgroundImage: 'url("/maple-wood-texture.jpg")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  border: '8px solid #654321',
  borderRadius: '30px',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const MainDashboard = () => {
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [showChoreModal, setShowChoreModal] = useState(false);
  const [pulse, setPulse] = useState(false);
  const { setIsIdle } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => setPulse(true), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pulse) {
      const timeout = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [pulse]);

  useEffect(() => {
    if (showGroceryModal || showChoreModal) {
      setIsIdle(false);
    }
  }, [showGroceryModal, showChoreModal, setIsIdle]);

  return (
    <>
      <main className="w-[1080px] h-[1920px] mx-auto p-4 bg-dashboard-bg text-white font-handwriting relative">
        <div style={{ height: '20px' }} />

        <section
          style={{
            width: '82.5%',
            height: '200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '200px 800px 400px',
            gap: '65px',
          }}
        >
          <div style={{ ...panelStyle, width: '200px', height: '200px' }}>
            <PhotoUploadQR />
          </div>

          <div style={{ ...panelStyle, width: '800px', height: '200px' }}>
            <h1
              className="text-9xl font-bold text-center animate-pulse hover:scale-90 transition-transform duration-300 ease-in-out"
              style={{
                fontFamily: '"Cinzel Decorative", cursive',
                background: 'linear-gradient(to right, #a855f7, #000000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 12px rgba(168, 85, 247, 0.8), 0 0 24px rgba(168, 85, 247, 0.6), 0 0 36px rgba(0, 0, 0, 0.9)`,
                letterSpacing: '3px',
              }}
            >
              Alvarez Mischief
              Managed
            </h1>
          </div>

          <div style={{ ...panelStyle, width: '200px', height: '200px' }}>
            <Control4Launcher onClose={() => {}} />
          </div>
        </section>

        <div style={{ height: '40px' }} />

        <section
          style={{
            width: '82.5%',
            height: '1000px',
            margin: '0 auto',
            ...panelStyle,
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <CalendarPanel />
        </section>

        <div style={{ height: '40px' }} />

        <section
          style={{
            width: '82.5%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            margin: '0 auto',
          }}
        >
          <div
            style={{ ...panelStyle, height: '200px', padding: '20px', flexDirection: 'column' }}
            onClick={() => {
              setShowChoreModal(true);
              window.__modalOpen = true;
              new Audio('/boop.mp3').play();
            }}
          >
            <h3 className="text-xl font-semibold text-black text-center">Chore List</h3>
            <ClipboardList className="mx-auto text-black mt-3 w-10 h-10" />
            <span className="text-sm text-black text-center">Click to manage chores</span>
          </div>

          <div
            style={{
              ...panelStyle,
              height: '200px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              className="text-3xl text-black font-extrabold uppercase tracking-wider"
              style={{
                fontFamily: '"Cinzel Decorative", cursive',
                textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
              }}
            >
              Grocery Command Center
            </h2>

            <div className="text-4xl mb-[-8px] animate-bounce-slow">🥦 🧄 🥕 🛒 🧃</div>

            <button
              onClick={() => {
                window.__modalOpen = true;
                setShowGroceryModal(true);
                new Audio('/boop.mp3').play();
              }}
              className={`text-2xl font-bold px-8 py-4 rounded-[20px] shadow-xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-black transition-transform duration-200 ${
                pulse ? 'ring ring-yellow-400 ring-offset-4 ring-offset-yellow-100 animate-pulse' : ''
              }`}
              style={{
                fontFamily: '"Cinzel Decorative", cursive',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              <ShoppingCart className="inline mr-3 w-7 h-7" />
              Click here to add groceries!
            </button>
          </div>
        </section>

        <div style={{ height: '40px' }} />

        <section
          style={{
            width: '82.5%',
            height: '100px',
            margin: '0 auto',
            ...panelStyle,
            fontStyle: 'italic',
            fontSize: '1.25rem',
          }}
        >
          <QuotesPanel />
        </section>

        <div style={{ height: '40px' }} />

        <section
          style={{
            width: '80%',
            height: '1000px',
            margin: '0 auto',
            ...panelStyle,
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <NotesPanel />
        </section>

        <div style={{ height: '40px' }} />
      </main>

      {showGroceryModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999999] flex items-center justify-center">
          <GroceryModal onClose={() => setShowGroceryModal(false)} />
        </div>
      )}

      {showChoreModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999999] flex items-center justify-center">
          <ChoreModal onClose={() => setShowChoreModal(false)} />
        </div>
      )}
    </>
  );
};

export default MainDashboard;
