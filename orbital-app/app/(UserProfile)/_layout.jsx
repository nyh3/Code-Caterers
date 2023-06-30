import { Stack } from "expo-router";
import { BackHandler, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UserProfileLayout() {
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
          // Define your custom navigation logic here
          // For example, navigate to a different screen
          router.replace('profile');
    
          // Return 'true' to prevent the default back action
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        // Cleanup the event listener
        return () => backHandler.remove();
      }, []);

      const handleProfile = () => {
        router.push('profile');
      }

      const handlePromotion = () => {
        router.push('(home)/Promotions');
      }

    return (
        <Stack>
            <Stack.Screen
            name="editReview" 
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
            name="reviews" 
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
                    <TouchableOpacity onPress={handleProfile}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="restrictions" 
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
                    <TouchableOpacity onPress={handleProfile}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="updateProfile" 
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
                    <TouchableOpacity onPress={handleProfile}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="saved" 
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
                    <TouchableOpacity onPress={handleProfile}>
                        <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backButton}
                        />
                    </TouchableOpacity>
                  )}} />

            <Stack.Screen
            name="view_promotion" 
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
                    <TouchableOpacity onPress={handlePromotion}>
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