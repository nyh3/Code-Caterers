import { View, StyleSheet, Text, Image, } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function UserProfile() {
    const { userId } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
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

    const { image, username } = userData;

    return (
        <View style={styles.wholeThing}>
            <Image source={{ uri: image }} style={styles.logo} />
            <Text style={styles.username}>{username}</Text>
            <Link href="../(UserProfile)/updateProfile">
                <Button>Update Profile</Button>
            </Link> 
           <Link href="../(UserProfile)/restrictions">
                <Button>Dietary Restrictions</Button>
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
        alignSelf: 'center',
        width: 200,
        height: 200,
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#FFF5FA',
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 26,
    }
  });