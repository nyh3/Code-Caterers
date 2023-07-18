import { Stack } from "expo-router";
import { BackHandler, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * Layout component for the user profile screens.
 * @returns {JSX.Element} The UserProfileLayout component.
 */
export default function UserProfileLayout() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace('profile');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  /**
   * Handles the profile button press event.
   */
  const handleProfile = () => {
    router.push('profile');
  };

  /**
   * Handles the promotion button press event.
   */
  const handlePromotion = () => {
    router.push('(home)/Promotions');
  };

  return (
    <Stack>
      {/* editReview Screen */}
      <Stack.Screen
        name="editReview"
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
          )
        }}
      />

      {/* reviews Screen */}
      <Stack.Screen
        name="reviews"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfile}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          )
        }}
      />

      {/* restrictions Screen */}
      <Stack.Screen
        name="restrictions"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfile}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          )
        }}
      />

      {/* updateProfile Screen */}
      <Stack.Screen
        name="updateProfile"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfile}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          )
        }}
      />

      {/* saved Screen */}
      <Stack.Screen
        name="saved"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfile}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          )
        }}
      />

      {/* view_promotion Screen */}
      <Stack.Screen
        name="view_promotion"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handlePromotion}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          )
        }}
      />

    </Stack>
  );
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
