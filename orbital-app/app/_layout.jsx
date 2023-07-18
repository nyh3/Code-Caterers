import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { GroupProvider } from "../contexts/group";
import { PopupProvider } from "../contexts/popup";

/**
 * Root component that wraps the app with necessary context providers.
 * @returns {JSX.Element} The Root component.
 */
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
