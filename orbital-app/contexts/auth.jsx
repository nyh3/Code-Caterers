import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, useSegments } from "expo-router";
import { GroupContext } from "./group";

// Create the AuthContext
const AuthContext = createContext({});

// Custom hook to access the user authentication data
export function useAuth() {
    const { user } = useContext(AuthContext);
    return { userId: user?.id };
}

// Custom hook to handle protected routes based on authentication status
function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();
    const { group } = useContext(GroupContext);

    useEffect(() => {
        console.log('useProtectedRoute useEffect called');
        const inAuthGroup = segments[0] === "(auth)";
        if (user == null && !inAuthGroup) {
            router.replace("/choose");
        } else if (user && inAuthGroup && group === 'Owner') {
            router.replace('(StallOwnerHome)/Home');
        } else if (user && inAuthGroup && group === 'User') {
            router.replace('/');
        }
    }, [router, segments, user, group]);
}

// AuthProvider component that manages user authentication state
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Invoke the useProtectedRoute hook
    useProtectedRoute(user);

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('authState', event);
            if (event === "SIGNED_IN") {
                setUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        // Unsubscribe from the auth state change listener when component unmounts
        return () => data.subscription.unsubscribe();
    }, []);

    // Provide the user authentication data to child components through the AuthContext
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
