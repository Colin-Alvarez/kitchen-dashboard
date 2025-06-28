// NotesPanel.tsx — Fixed infinite render loop by restructuring useEffect
import React, { useRef, useEffect, useState } from 'react';

const penColors = ['#1e40af', '#000000', '#374151', '#6d28d9']; // dark blue, black, dark gray, purple

const NotesPanel = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [penColor, setPenColor] = useState(penColors[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);

  // Initialize first page once
  useEffect(() => {
    if (pages.length === 0 && canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = canvasRef.current.clientWidth;
      canvas.height = canvasRef.current.clientHeight;
      setPages([canvas]);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pages[currentPage]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pages[currentPage], 0, 0);

    const handleResize = () => {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = canvas.clientWidth;
      newCanvas.height = canvas.clientHeight;
      const newCtx = newCanvas.getContext('2d');
      if (newCtx && pages[currentPage]) {
        newCtx.drawImage(pages[currentPage], 0, 0);
        const updated = [...pages];
        updated[currentPage] = newCanvas;
        setPages(updated);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, pages, penColor]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawing.current = true;
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.stroke();

    const pageCanvas = pages[currentPage];
    const pageCtx = pageCanvas?.getContext('2d');
    if (pageCtx) {
      pageCtx.beginPath();
      pageCtx.moveTo(lastPoint.current.x, lastPoint.current.y);
      pageCtx.lineTo(x, y);
      pageCtx.strokeStyle = penColor;
      pageCtx.stroke();
    }

    lastPoint.current = { x, y };
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pageCanvas = pages[currentPage];
    const pageCtx = pageCanvas?.getContext('2d');
    if (canvas && ctx && pageCtx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
    }
  };

  const addPage = () => {
    const newPage = document.createElement('canvas');
    if (canvasRef.current) {
      newPage.width = canvasRef.current.clientWidth;
      newPage.height = canvasRef.current.clientHeight;
    } else {
      newPage.width = 960;
      newPage.height = 590;
    }
    setPages(prev => [...prev, newPage]);
    setCurrentPage(pages.length);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundImage: './maple-wood-texture.jpg")', backgroundSize: 'cover', borderRadius: '1rem' }}>
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {penColors.map((color) => (
          <button
            key={color}
            onClick={() => setPenColor(color)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: color,
              border: penColor === color ? '2px solid #fff' : '1px solid #666',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', zIndex: 2 }}>
        <button onClick={prevPage} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>⟵</button>
        <span style={{ color: '#fff', alignSelf: 'center' }}>Page {currentPage + 1}</span>
        <button onClick={nextPage} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>⟶</button>
        <button onClick={addPage} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>➕</button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none', display: 'block', width: '100%', height: '100%' }}
      />

      <button
        onClick={clearCanvas}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          zIndex: 2
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default NotesPanel;
