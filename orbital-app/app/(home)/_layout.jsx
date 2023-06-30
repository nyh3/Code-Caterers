import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet } from "react-native";

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
                headerStyle: {
                  height: 80, // Customize the header height
                  backgroundColor: "#FFF5FA", // Customize the header background color
                },
                headerTitleStyle: {
                  alignSelf: "center", // Align the header title to the center
                },
                headerTitle: () => (
                  <View style={styles.headerContainer}>
                    <Image
                      source={require('../../assets/headerlogo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  )}} />
        <Tabs.Screen 
            name="filter" 
            options={{ 
                tabBarLabel: "Filter",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="filter" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                headerStyle: {
                  height: 80, // Customize the header height
                  backgroundColor: "#FFF5FA", // Customize the header background color
                },
                headerTitleStyle: {
                  alignSelf: "center", // Align the header title to the center
                },
                headerTitle: () => (
                  <View style={styles.headerContainer}>
                    <Image
                      source={require('../../assets/headerlogo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  )}} />
        <Tabs.Screen 
            name="profile" 
            options={{ 
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                headerStyle: {
                  height: 80, // Customize the header height
                  backgroundColor: "#FFF5FA", // Customize the header background color
                },
                headerTitleStyle: {
                  alignSelf: "center", // Align the header title to the center
                },
                headerTitle: () => (
                  <View style={styles.headerContainer}>
                    <Image
                      source={require('../../assets/headerlogo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  )}} />
        <Tabs.Screen 
            name="Promotions" 
            options={{ 
                tabBarLabel: "Promotions",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="megaphone" size={size} color={color} />
                  ),
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'blue', 
                headerStyle: {
                  height: 80, // Customize the header height
                  backgroundColor: "#FFF5FA", // Customize the header background color
                },
                headerTitleStyle: {
                  alignSelf: "center", // Align the header title to the center
                },
                headerTitle: () => (
                  <View style={styles.headerContainer}>
                    <Image
                      source={require('../../assets/headerlogo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  )}} />
    </Tabs>
    )
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
});