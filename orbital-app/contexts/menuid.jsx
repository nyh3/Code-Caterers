import { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  return (
    <MenuContext.Provider value={{ selectedMenuId, setSelectedMenuId }}>
      {children}
    </MenuContext.Provider>
  );
};