import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, useSegments } from "expo-router";
import { GroupContext } from "./group";
import { ProfileContext } from "./setup";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();
    const { group } = useContext(GroupContext);
    const { setupComplete } = useContext(ProfileContext);

    useEffect(() => {
        console.log('useProtectedRoute useeffect called');
        const inAuthGroup = segments[0] === "(auth)";
        if (user == null && !inAuthGroup) {
            router.replace("/choose");
        } else if (user && inAuthGroup && group === 'Owner') {
            router.replace('(StallOwnerHome)/Home');
        } else if (user && inAuthGroup && group === 'User' && !setupComplete ) {
            router.replace('(UserProfile)/profileSetUp');
        } else if (user && inAuthGroup && group === 'User' && setupComplete ) {
            router.replace('/');
        }
        console.log('setupComplete:', setupComplete);
    }, [router, segments, user, group, setupComplete]);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const { group } = useContext(GroupContext);

    useProtectedRoute(user);

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('authState: ${event}');
            if (event === "SIGNED_IN") {
                setUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        })
        return () => data.subscription.unsubscribe();
    }, [])

    return <AuthContext.Provider value={{ user, group }}>{children}</AuthContext.Provider>
}