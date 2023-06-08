import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    useEffect(() => {
        const fetchProfileSetupStatus = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('is_set_up_complete')
                .single();

            if (error) {
                console.error(error);
                return 
            }

            setIsSetupComplete(data.is_set_up_complete);
        };

        fetchProfileSetupStatus();
    }, []);

    return (
        <ProfileContext.Provider value={{ isSetupComplete }}>
            {children}
        </ProfileContext.Provider>
    );
};