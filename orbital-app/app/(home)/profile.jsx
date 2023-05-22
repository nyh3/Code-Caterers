import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';

export default function UserProfile() {
    return (
        <View>
           <Link href="../(UserProfile)/restrictions">
                <Button>Dietary Restrictions</Button>
            </Link>   
            <Link href="../(UserProfile)/promotions">
                <Button>Promotions</Button>
            </Link>
            <Link href="../(UserProfile)/reviews">
                <Button>Reviews</Button>
            </Link>
            <Link href="../(UserProfile)/saved">
                <Button>Saved</Button>
            </Link> 
            <Button onPress={() => supabase.auth.signOut()}>Log out</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 200,
      height: 200,
    },
  });