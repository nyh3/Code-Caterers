import { createContext, useState } from 'react';

export const StallContext = createContext();

export const StallProvider = ({ children }) => {
  const [selectedStallId, setSelectedStallId] = useState(null);

  return (
    <StallContext.Provider value={{ selectedStallId, setSelectedStallId }}>
      {children}
    </StallContext.Provider>
  );
};