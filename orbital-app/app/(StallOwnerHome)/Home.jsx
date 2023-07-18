import { View, Image, StyleSheet, Text } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

/**
 * Home component displays the home screen for the stall owner.
 * @returns JSX element representing the home screen.
 */
export default function Home() {
  const { userId } = useAuth();
  const [stallData, setStallData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetches stall data from the database based on the user ID
    const fetchStallData = async () => {
      const { data, error } = await supabase
        .from('stall')
        .select('stallImage, name')
        .eq('owner_id', userId);

      if (error) {
        console.error('Error fetching stall data:', error);
        return;
      }

      if (data && data.length > 0) {
        setStallData(data[0]);
      } else {
        router.push('(StallOwnerHome)/Stall_Profile');
      }
    };

    if (userId) {
      fetchStallData();
    }
  }, [userId, router]);

  if (!stallData) {
    return <ActivityIndicator />;
  }

  // Event handler for navigating to the stall profile screen
  const handleStallProfile = () => {
    router.push('(StallOwnerHome)/Stall_Profile');
  }

  // Event handler for navigating to the menu screen
  const handleMenu = () => {
    router.push('(StallOwnerHome)/Menu');
  }

  // Event handler for navigating to the promotions screen
  const handlePromotions = () => {
    router.push('(StallOwnerHome)/Promotions');
  }

  // Event handler for navigating to the reviews screen
  const handleReviews = () => {
    router.push('(StallOwnerHome)/Reviews');
  }

  const { stallImage, name } = stallData;

  return (
    <View style={styles.container}>
      <Image source={{ uri: stallImage }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Button onPress={handleStallProfile} style={styles.buttons}>Update Stall Profile</Button>
      <Button onPress={handleMenu} style={styles.buttons}>Menu</Button>
      <Button onPress={handlePromotions} style={styles.buttons}>Promotions</Button>
      <Button onPress={handleReviews} style={styles.buttons}>Reviews</Button>
      <Button style={styles.buttons} onPress={() => supabase.auth.signOut()}>Log Out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 100,
  },
  name: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 25,
    marginBottom: 10,
  },
  buttons: {
    marginTop: 5,
    color: '#2C0080',
  }
});
