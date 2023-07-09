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
            const { data, error } = await supabase
                .from('promotion')
                .select('*')
                .lte('start_date', new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }))
                .gte('end_date', new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }))
                .order('start_date', { ascending: true })
                .order('end_date', { ascending: true });
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
                <View style={styles.text}>
                    <Text style={styles.promotionTitle}>{item.title}</Text>
                    <Text>
                        <Text style={styles.promotionLabel}>Valid from: </Text>
                        <Text style={styles.promotionValue}>
                            {item.start_date} to {item.end_date}
                        </Text>
                    </Text>
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
        alignItems: 'center',      
        backgroundColor: '#FFECF6',
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 5,
        borderColor: '#FFF5FA',
        borderWidth: 2,
        borderRadius: 10,
    },
    promotionImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginRight: 15,
    },
    promotionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    promotionDescription: {
        marginBottom: 5,
    },
    promotionLabel: {
        fontWeight: 'bold',
    },
    promotionValue: {
        marginLeft: 5,
        color: '#2C0080',
    },
    text: {
        flexDirection: 'column',
        flex: 1,
    },
});