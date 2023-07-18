import { View, StyleSheet, Text, Image } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState, useContext } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { PopupContext } from '../../contexts/popup';

/**
 * Displays the user's profile information and provides options for profile management.
 * @returns {JSX.Element} The UserProfile component.
 */
export default function UserProfile() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { popupCount, setPopupCount } = useContext(PopupContext); // Accessing the popup context

  useEffect(() => {
    /**
     * Fetches the user's data from the database.
     */
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('image, username')
        .eq('id', userId);

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      if (data && data.length > 0) {
        setUserData(data[0]);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!userData) {
    return <ActivityIndicator />;
  }

  /**
   * Handles the update profile button press event.
   */
  const handleUpdateProfile = () => {
    router.push('/updateProfile');
  };

  /**
   * Handles the dietary restrictions button press event.
   */
  const handleRestrictions = () => {
    router.push('/restrictions');
  };

  /**
   * Handles the reviews button press event.
   */
  const handleReview = () => {
    router.push('/reviews');
  };

  /**
   * Handles the saved button press event.
   */
  const handleSaved = () => {
    router.push('/saved');
  };

  /**
   * Handles the sign out button press event.
   */
  const handleSignOut = async () => {
    setPopupCount(0); // Set popupCount to 0
    await supabase.auth.signOut();
  };

  const { image, username } = userData;

  return (
    <View style={styles.wholeThing}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.username}>{username}</Text>

      <Button onPress={handleUpdateProfile}>Update Profile</Button>

      <Button onPress={handleRestrictions}>Dietary Restrictions</Button>

      <Button onPress={handleReview}>Reviews</Button>

      <Button onPress={handleSaved}>Saved</Button>

      <Button onPress={handleSignOut}>Log Out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wholeThing: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 30,
    marginBottom: 15,
    borderRadius: 100,
  },
  username: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 25,
    marginBottom: 15,
  },
});
