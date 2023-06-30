import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { Text as PaperText, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';

export default function AddPromotionPage() {
    const [menuItems, setMenuItems] = useState([]);
    const isFocused = useIsFocused();
    const router = useRouter();
    const { userId } = useAuth();

    useEffect(() => {
        fetchMenuItems();
    }, [isFocused]);

    const fetchMenuItems = async () => {
        const { data: stallId, error } = await supabase
            .from('stall')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (error) {
            console.error('Error fetching stall id:', error.message);
            return;
        }
        try {
            const { data, error } = await supabase.from('promotion').select('*').eq('stall_id', stallId.id);
            if (error) {
                console.error('Error fetching promotion details:', error.message);
                return;
            }
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching promotion details:', error.message);
        }
    };

    const handlePromotionPress = (promotion) => {
        router.push({ pathname: '/Edit_Promotion', params: { id: promotion } });
      };

    const renderMenuItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePromotionPress(item.id)}>
            <View style={styles.promotion}>
            <Image source={{ uri: item.image }} style={styles.promotionImage} />
            <View style={styles.promotionDetails}>
                <Text style={styles.promotionTitle}>{item.title}</Text>
                <Text style={styles.promotionDescription}>{item.description}</Text>
            </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text></Text>
            <Link href="../(StallOwnerHiddenTabs)/Promotion_Form">
                <Button mode="contained" style={styles.buttonContainer}>
                    <PaperText style={styles.buttons}>Add Promotions</PaperText>
                </Button>
            </Link>
            <Text style={styles.heading}>Previously added promotions:</Text>
            <FlatList
                data={menuItems} 
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.promotionList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    promotionList: {
        paddingBottom: 20,
    },
    promotion: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    promotionImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    promotionDetails: {
        flex: 1,
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    promotionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    promotionDescription: {
        marginBottom: 5,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
      },
      buttons: {
        color: '#2C0080',
        fontWeight: 'bold',
      },
      
});
