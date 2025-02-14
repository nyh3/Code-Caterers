import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();

  // Navigation handlers for each screen
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
      {/* Stack screen for "Add_Menu" */}
      <Stack.Screen
        name="Add_Menu"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleMenu}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Stack screen for "Edit_Menu" */}
      <Stack.Screen
        name="Edit_Menu"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleMenu}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Stack screen for "Edit_Promotion" */}
      <Stack.Screen
        name="Edit_Promotion"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handlePromotion}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Stack screen for "Promotion_Form" */}
      <Stack.Screen
        name="Promotion_Form"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handlePromotion}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Stack screen for "View_Review" */}
      <Stack.Screen
        name="View_Review"
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleReview}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 60,
  },
  logo: {
    width: 200,
    height: 80,
  },
});
