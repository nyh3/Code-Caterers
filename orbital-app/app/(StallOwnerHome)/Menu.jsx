import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { Text as PaperText, Button } from 'react-native-paper';
import { Link } from 'expo-router';
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
            const { data, error } = await supabase.from('menu').select('*');
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
            <Text></Text>
            <Link href="../(StallOwnerHiddenTabs)/Add_Menu">
                <Button mode="contained" style={styles.buttonContainer}>
                    <PaperText style={styles.buttons}>Add Menu Item</PaperText>
                </Button>
            </Link>
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
        marginHorizontal: 15,
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
        alignSelf: 'center',
        marginHorizontal: 10,
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
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        marginTop: 5,
    },
    buttons: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
});

