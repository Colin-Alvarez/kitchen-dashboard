import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  isIdle: boolean;
  setIsIdle: (idle: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isIdle, setIsIdle] = useState(false);

  return (
    <AppContext.Provider value={{ isIdle, setIsIdle }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
