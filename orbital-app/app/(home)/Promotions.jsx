import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function PromotionPage() {
    const [menuItems, setMenuItems] = useState([]);
    const isFocused = useIsFocused();
    const router = useRouter();

    useEffect(() => {
        fetchMenuItems();
    }, [isFocused]);

    const handlePromotionPress = (promotion) => {
        router.push({ pathname: '/view_promotion', params: { id: promotion } });
    }

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase.from('promotion').select('*');
            if (error) {
                console.error('Error fetching promotion details:', error.message);
                return;
            }
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching promotion details:', error.message);
        }
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
            <Text style={styles.heading}>Recent Promotions & Deals:</Text>
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
        marginHorizontal: 10,
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
    },
    promotionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    promotionDescription: {
        marginBottom: 5,
    },
});