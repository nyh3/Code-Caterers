import { Stack } from "expo-router";

export default function UserProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="menuDetails"
                options={{
                title: "Menu",
                }}
            />
            <Stack.Screen
                name="stallDetails"
                options={{
                title: "Stall",
                }}
            />
            <Stack.Screen
                name="newReview"
                options={{
                title: "New Review",
                }}
            />
        </Stack>
    )
}