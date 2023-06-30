import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
            name="choose" 
            options={{ 
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
            <Stack.Screen
            name="loginOwner" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
            <Stack.Screen
            name="loginUser" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
            <Stack.Screen
            name="password-reset" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
            <Stack.Screen
            name="registerOwner" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
            <Stack.Screen
            name="registerUser" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
            <Stack.Screen
            name="reset" 
            options={{ 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
        </Stack>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 40,
    },
    logo: {
      width: 200,
      height: 80,
    },
  });