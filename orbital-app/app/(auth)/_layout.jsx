import { Stack } from "expo-router";
import { Image, View, StyleSheet } from "react-native";

/**
 * AuthLayout component renders the authentication layout with different screens.
 * @returns {JSX.Element} The rendered AuthLayout component.
 */
export default function AuthLayout() {
  return (
    <Stack>
      {/* Screen: choose */}
      <Stack.Screen
        name="choose"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: "#FFF5FA",
          },
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Screen: loginOwner */}
      <Stack.Screen
        name="loginOwner"
        options={{
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
          ),
        }}
      />

      {/* Screen: loginUser */}
      <Stack.Screen
        name="loginUser"
        options={{
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
          ),
        }}
      />

      {/* Screen: registerOwner */}
      <Stack.Screen
        name="registerOwner"
        options={{
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
          ),
        }}
      />

      {/* Screen: registerUser */}
      <Stack.Screen
        name="registerUser"
        options={{
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
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  /**
   * Styles for the header container.
   */
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 150,
  },
  /**
   * Styles for the main header container.
   */
  headerContainerMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 40,
  },
  /**
   * Styles for the logo.
   */
  logo: {
    width: 200,
    height: 80,
  },
});
