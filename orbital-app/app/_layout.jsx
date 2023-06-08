import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { GroupProvider } from "../contexts/group";
import { ProfileContextProvider } from "../contexts/setup";
import { StallProvider } from "../contexts/stallid";
import { MenuProvider } from "../contexts/menuid";

export default function Root() {
    return (
        <GroupProvider>
            <ProfileContextProvider>
                <AuthProvider>
                    <StallProvider>
                        <MenuProvider>
                            <Slot />
                        </MenuProvider>
                    </StallProvider>
                </AuthProvider>
            </ProfileContextProvider>
        </GroupProvider>
    );
}