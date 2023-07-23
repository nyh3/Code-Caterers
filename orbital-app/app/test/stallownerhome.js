import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

/**
 * Home component displays the home screen for the stall owner.
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the stall owner.
 * @param {string} props.stallImage - URL of the stall owner's image.
 * @param {Function} props.onStallProfile - Event handler for navigating to the stall profile screen.
 * @param {Function} props.onMenu - Event handler for navigating to the menu screen.
 * @param {Function} props.onPromotions - Event handler for navigating to the promotions screen.
 * @param {Function} props.onReviews - Event handler for navigating to the reviews screen.
 * @param {Function} props.onLogout - Event handler for logging out.
 * @returns JSX element representing the home screen.
 */
export default function Home(props) {
  const {
    name,
    stallImage,
    onStallProfile,
    onMenu,
    onPromotions,
    onReviews,
    onLogout,
  } = props;

  return (
    <View style={styles.container}>
      <Image source={{ uri: stallImage }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={onStallProfile} style={styles.buttons}>
        <Text>Update Stall Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenu} style={styles.buttons}>
        <Text>Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPromotions} style={styles.buttons}>
        <Text>Promotions</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReviews} style={styles.buttons}>
        <Text>Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout} style={styles.buttons}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5FA",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 100,
  },
  name: {
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 25,
    marginBottom: 10,
  },
  buttons: {
    marginTop: 5,
    color: "#2C0080",
  },
});
