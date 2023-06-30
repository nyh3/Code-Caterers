import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout() {
    const router = useRouter();

    const handleMenu = () => {
      router.push('Menu');
    }

    const handlePromotion = () => {
      router.push('Promotions');
    }
    
    const handleReview = () => {
      router.push('Reviews');
    }

    return (
        <Stack>
            <Stack.Screen
            name="Add_Menu" 
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
                    <TouchableOpacity onPress={handleMenu}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="Edit_Menu" 
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
                    <TouchableOpacity onPress={handleMenu}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="Edit_Profile" 
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
            name="Edit_Promotion" 
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
                    <TouchableOpacity onPress={handlePromotion}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="Promotion_Form" 
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
                    <TouchableOpacity onPress={handlePromotion}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="View_Review" 
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
                    <TouchableOpacity onPress={handleReview}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />
                  
            <Stack.Screen
            name="Update_Stall" 
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