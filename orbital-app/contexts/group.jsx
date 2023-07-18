import { createContext, useState } from "react";

// Create the GroupContext
export const GroupContext = createContext();

// GroupProvider component
export const GroupProvider = ({ children }) => {
    const [group, setGroup] = useState('');

    // Provide the group state and setGroup function to children components
    return (
        <GroupContext.Provider value={{ group, setGroup }}>
            {children}
        </GroupContext.Provider>
    );
};
