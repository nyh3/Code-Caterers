import { View, Image, StyleSheet, Text } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

export default function Home() {
    const { userId } = useAuth();
    const [stallData, setStallData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchStallData = async () => {
            const { data, error } = await supabase
                .from('Stall')
                .select('stallImage, name')
                .eq('owner_id', userId);

            if (error) {
                console.error('Error fetching stall data:', error);
                return;
            }

            if (data && data.length > 0) {
                setStallData(data[0]);
            }
        };

        if (userId) {
            fetchStallData();
        }
    }, [userId, router]);

    if (!stallData) {
        return <ActivityIndicator />;
    }

    const handleUpdateStall = () => {
        router.push('(StallOwnerHome)/Update_Stall');
    }
    const handleStallProfile = () => {
        router.push('(StallOwnerHome)/Stall_Profile');
    }
    const handleMenu = () => {
        router.push('(StallOwnerHome)/Menu');
    }
    const handlePromotions = () => {
        router.push('(StallOwnerHome)/Promotions');
    }
    const handleReviews = () => {
        router.push('(StallOwnerHome)/Reviews');
    }

    const { stallImage, name } = stallData;

    return (
        <View style={styles.container}>
            <Image source={{ uri: stallImage }} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
            <Button onPress={handleUpdateStall} style={styles.buttons}>Update Stall</Button>
            <Button onPress={handleStallProfile} style={styles.buttons}>Stall Profile</Button>
            <Button onPress={handleMenu} style={styles.buttons}>Menu</Button>
            <Button onPress={handlePromotions} style={styles.buttons}>Promotions</Button>
            <Button onPress={handleReviews} style={styles.buttons}>Reviews</Button>
            <Button style={styles.buttons} onPress={() => supabase.auth.signOut()}>Log out</Button>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    },
    image: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 100,
    },
    name: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 25,
        marginBottom: 15,
    },
    buttons: {
        marginTop: 5,
        color: '#2C0080',
    }
});