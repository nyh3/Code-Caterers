import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PageLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'blue',
          title: "Home"
        }}
      />
      <Tabs.Screen
        name="Menu"
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'blue',
          title: "Menu"
        }}
      />
      <Tabs.Screen
        name="Promotions"
        options={{
          tabBarLabel: "Promotions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'blue',
          title: "Promotions"
        }}
      />
      <Tabs.Screen
        name="Reviews"
        options={{
          tabBarLabel: "Reviews",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'blue',
          title: "Reviews"
        }}
      />
      <Tabs.Screen
        name="Stall_Profile"
        options={{
          tabBarLabel: "Stall Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'blue',
          title: "Stall Profile",
        }}
      />
    </Tabs>
  );
}
