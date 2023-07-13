import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { GroupProvider } from "../contexts/group";
import { PopupProvider } from "../contexts/popup";

export default function Root() {
    return (
        <GroupProvider>
            <AuthProvider>
                <PopupProvider>
                    <Slot />
                </PopupProvider>
            </AuthProvider>
        </GroupProvider>
    );
}