import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase.from('menu_items').select('*');
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
            <Text style={styles.menuItemTitle}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
            <Text style={styles.menuItemPrice}>Price: ${item.price}</Text>
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
        flex: 1,
        backgroundColor: '#FFF5FA',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },
    menuList: {
        paddingBottom: 10,
    },
    menuItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#FFECF6',
        paddingBottom: 10,
    },
    menuItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuItemDescription: {
        fontSize: 15,
        color: '#2C0080',
    },
    menuItemPrice: {
        fontSize: 15,
        color: '#2C0080',
    },
});