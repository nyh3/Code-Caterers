import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}