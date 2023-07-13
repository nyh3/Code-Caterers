import { createContext, useState } from "react";

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popupCount, setPopupCount] = useState(0); // 4. Initialize to 0 initially
  
    return (
      <PopupContext.Provider value={{ popupCount, setPopupCount }}>
        {children}
      </PopupContext.Provider>
    );
  };