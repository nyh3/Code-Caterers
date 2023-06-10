import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { GroupProvider } from "../contexts/group";
import { StallProvider } from "../contexts/stallid";
import { MenuProvider } from "../contexts/menuid";

export default function Root() {
    return (
        <GroupProvider>
            <AuthProvider>
                <StallProvider>
                    <MenuProvider>
                        <Slot />
                    </MenuProvider>
                </StallProvider>
            </AuthProvider>
        </GroupProvider>
    );
}