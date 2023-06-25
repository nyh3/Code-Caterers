import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeLayout() {
    return (
    <Tabs>
        <Tabs.Screen 
            name="index" 
            options={{ 
                tabBarLabel: "Home Page",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                title: "Home",
                }} />
        <Tabs.Screen 
            name="filter" 
            options={{ 
                tabBarLabel: "Filter",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="filter" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                title: "Filter",
                }} />
        <Tabs.Screen 
            name="profile" 
            options={{ 
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                title: "Profile",
                }} />
        <Tabs.Screen 
            name="Promotions" 
            options={{ 
                tabBarLabel: "Promotions",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="megaphone" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                title: "Promotions",
                }} />
    </Tabs>
    )
}