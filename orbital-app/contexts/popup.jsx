import { createContext, useState } from "react";

// Create the PopupContext
export const PopupContext = createContext();

// PopupProvider component
export const PopupProvider = ({ children }) => {
    const [popupCount, setPopupCount] = useState(0); // Initialize to 0 initially

    // Provide the popupCount state and setPopupCount function to children components
    return (
        <PopupContext.Provider value={{ popupCount, setPopupCount }}>
            {children}
        </PopupContext.Provider>
    );
};
