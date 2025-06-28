// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import DashboardWithScreensaver from './DashboardWithScreensaver';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardWithScreensaver />} />
          
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
