import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from "react";

export default function UserProfile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .single();
            
            if (error) {
                console.error(error);
                return;
            }
            setUserData(data);
        };

        fetchProfileData();
    }, []);

    const renderProfile = useMemo(() => {
        if (!userData) {
            return null;
        }

        const { username, profileImageUrl } = userData;

        return (
            <View>
                {profileImageUrl && (
                    <Image source={{ uri: profileImageUrl }} style={{ width: 200, height: 200 }} />
                )}
                <Text> Username: {username}</Text>
            </View>
        );
    }, [userData]);

    return (
        <View>
            {renderProfile}
            <Link href="../(UserProfile)/updateProfile">
                <Button>update Profile</Button>
            </Link> 
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
    );
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