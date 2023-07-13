import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function UserProfileLayout() {
  const router = useRouter();

  const handleStall = () => {
    router.push('/');
  }

  const handleFilter = () => {
    router.push('filter');
  }
  
  return (
    <Stack>
      <Stack.Screen
      name="menuDetails" 
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
      name="stallDetails" 
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
          ),
          headerLeft: () => (
              <TouchableOpacity onPress={handleStall}>
                  <Ionicons
                  name="arrow-back"
                  size={24}
                  color="black"
                  style={styles.backButton}
                  />
              </TouchableOpacity>
            )}} />

      <Stack.Screen
      name="newReview" 
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
      name="reviewDetails" 
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
            name="Menu_Details_Filter" 
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
                ),
                headerLeft: () => (
                    <TouchableOpacity onPress={handleFilter}>
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
    headerContainerMain: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 40,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 140,
    },
    logo: {
      width: 200,
      height: 80,
    },
  });