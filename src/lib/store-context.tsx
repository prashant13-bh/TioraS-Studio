'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoreVibe = 'gen-z' | 'luxury' | 'professional';

interface StoreContextType {
  vibe: StoreVibe;
  setVibe: (vibe: StoreVibe) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibe] = useState<StoreVibe>('gen-z');

  return (
    <StoreContext.Provider value={{ vibe, setVibe }}>
      <div data-vibe={vibe} className="contents">
        {children}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
