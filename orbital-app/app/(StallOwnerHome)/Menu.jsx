import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { Text as PaperText, Button } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../contexts/auth';

/**
 * MenuPage component displays the menu items for the stall owner.
 * @returns {JSX.Element} JSX element representing the menu page.
 */
export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const isFocused = useIsFocused();
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
  }, [isFocused]);

  /**
   * Fetches the menu items from the database.
   */
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
      const { data, error } = await supabase.from('menu').select('*').eq('stall_id', stallId.id);
      if (error) {
        console.error('Error fetching menu items:', error.message);
        return;
      }
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error.message);
    }
  };

  /**
   * Renders a single menu item.
   * @param {Object} item - The menu item to render.
   */
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMenuItemPress(item)}>
      <View style={styles.menuItem}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>Price: ${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Event handler for selecting a menu item.
   * @param {Object} item - The selected menu item.
   */
  const handleMenuItemPress = (item) => {
    router.push({ pathname: '/Edit_Menu', params: { id: item.id } });
  };

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
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECF6',
    padding: 15,
    borderColor: '#FFF5FA',
    borderWidth: 5,
    borderRadius: 10,
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
