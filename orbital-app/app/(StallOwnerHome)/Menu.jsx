import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchMenuItems();
    }, [isFocused]);

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase.from('Menu').select('*');
            if (error) {
                console.error('Error fetching menu items:', error.message);
                return;
            }
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error.message);
        }
    };

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <View style={styles.menuItemDetails}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>Price: ${item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Menu:</Text>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.menuList}
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
    menuList: {
        paddingBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    menuItemImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    menuItemDetails: {
        flex: 1,
    },
    menuItemName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    menuItemDescription: {
        marginBottom: 5,
    },
    menuItemPrice: {
        fontWeight: 'bold',
    },
});

