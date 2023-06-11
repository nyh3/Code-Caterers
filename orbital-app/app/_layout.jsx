import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { GroupProvider } from "../contexts/group";

export default function Root() {
    return (
        <GroupProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </GroupProvider>
    );
}