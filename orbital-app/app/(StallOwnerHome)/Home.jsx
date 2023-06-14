import { View, Image, StyleSheet, Text } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function Home() {
    const { userId } = useAuth();
    const [stallData, setStallData] = useState(null);

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
    }, [userId]);

    if (!stallData) {
        return <ActivityIndicator />;
    }

    const { stallImage, name } = stallData;

    return (
        <View style={styles.container}>
            <Image source={{ uri: stallImage }} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
            <Link href="(StallOwnerHome)/Update_Stall">
                <Button style={styles.buttons}>Update Stall</Button>
            </Link>
            <Link href="(StallOwnerHome)/Stall_Profile">
                <Button style={styles.buttons}>Stall Profile</Button>
            </Link>
            <Link href="(StallOwnerHome)/Menu">
                <Button style={styles.buttons}>Menu</Button>
            </Link>
            <Link href="(StallOwnerHome)/Promotions">
                <Button style={styles.buttons}>Promotions</Button>
            </Link>
            <Link href="(StallOwnerHome)/Reviews">
                <Button style={styles.buttons}>Reviews</Button>
            </Link>
            <Button style={styles.buttons} onPress={() => supabase.auth.signOut()}>Log out</Button>
        </View>
    )
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
        marginHorizontal: 5,
        marginVertical: 5,
        color: '#2C0080',
    }
});