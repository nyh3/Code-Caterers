import { Stack } from "expo-router";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function UserProfileLayout() {
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
          // Define your custom navigation logic here
          // For example, navigate to a different screen
          router.replace('profile');
    
          // Return 'true' to prevent the default back action
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        // Cleanup the event listener
        return () => backHandler.remove();
      }, []);

    return (
        <Stack>
            <Stack.Screen
                name="updateProfile"
                options={{
                title: "Update Profile",
                }}
            />
            <Stack.Screen
                name="reviews"
                options={{
                title: "Reviews",
                }}
            />
            <Stack.Screen
                name="restrictions"
                options={{
                title: "Restrictions",
                }}
            />
            <Stack.Screen
                name="editReview"
                options={{
                title: "Edit Reviews",
                }}
            />
            <Stack.Screen
                name="saved"
                options={{
                title: "Saved",
                }}
            />
        </Stack>
    )
}