import { View, StyleSheet, Text, Image, } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

export default function UserProfile() {
    const { userId } = useAuth();
    const [userData, setUserData] = useState(null);
    const router = useRouter();

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

    const handleUpdateProfile =() => {
        router.push('/updateProfile');
    }

    const handleRestrictions =() => {
        router.push('/restrictions');
    }

    const handleReview =() => {
        router.push('/reviews');
    }

    const handleSaved =() => {
        router.push('/saved');
    }

    const { image, username } = userData;

    return (
        <View style={styles.wholeThing}>
            <Image source={{ uri: image }} style={styles.logo} />
            <Text style={styles.username}>{username}</Text>
                <Button onPress={handleUpdateProfile}>Update Profile</Button>

                <Button onPress={handleRestrictions}>Dietary Restrictions</Button>
    
                <Button onPress={handleReview}>Reviews</Button>
                
                <Button onPress={handleSaved}>Saved</Button>

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