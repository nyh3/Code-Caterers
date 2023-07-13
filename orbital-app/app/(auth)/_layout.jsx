import { Stack } from "expo-router";
import { Image, View, StyleSheet } from "react-native";

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
            <View style={styles.headerContainerMain}>
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
      paddingRight: 150,
    },
    headerContainerMain: {
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