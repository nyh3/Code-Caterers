import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet } from "react-native";

/**
 * HomeLayout component represents the layout for the home screen with tabs.
 *
 * @returns {JSX.Element} The rendered HomeLayout component.
 */
export default function HomeLayout() {
  return (
    <Tabs>
      {/* Screen: index */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#2C0080',
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />

      {/* Screen: filter */}
      <Tabs.Screen
        name="filter"
        options={{
          tabBarLabel: "Filter",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="filter" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#2C0080',
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />

      {/* Screen: profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#2C0080',
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />

      {/* Screen: Promotions */}
      <Tabs.Screen
        name="Promotions"
        options={{
          tabBarLabel: "Promotions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#2C0080',
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />

      {/* Screen: explore */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#2C0080',
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 80,
  },
  logo: {
    width: 200,
    height: 80,
  },
});
