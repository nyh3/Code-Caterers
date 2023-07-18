import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for displaying the details of a stall.
 */
export default function StallDetailScreen() {
  const [menu, setMenu] = useState([]);
  const [stall, setStall] = useState(null);
  const stallId = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchMenuDetails();
    fetchStallDetails();
  }, []);

  /**
   * Fetches the menu details for the stall from the database.
   */
  const fetchMenuDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('menu')
        .select('name, image, price, id, rating')
        .eq('stall_id', stallId.id);

      if (error) {
        console.error('Error fetching menu details:', error.message);
        return;
      }
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  /**
   * Fetches the stall details from the database.
   */
  const fetchStallDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('*, location (name), cuisine (name)')
        .eq('id', stallId.id)
        .single();

      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }
      setStall(data);
    } catch (error) {
      console.error('Error fetching stall details:', error.message);
    }
  };

  /**
   * Handles the press event of a menu item.
   * @param {string} menuId - The ID of the menu item.
   */
  const handleMenuPress = (menuId) => {
    router.push({ pathname: '/menuDetails', params: { id: menuId } });
    console.log('Menu item pressed:', menuId);
  };

  /**
   * Returns the color for the cuisine tag based on the cuisine name.
   * @param {string} cuisineName - The name of the cuisine.
   * @returns {string} The color for the cuisine tag.
   */
  const getCuisineTagColor = (cuisineName) => {
    switch (cuisineName) {
      case 'Chinese':
        return '#FFD700';
      case 'Western':
        return '#6495ED';
      case 'Malay':
        return '#228B22';
      case 'Indian':
        return '#FF4500';
      case 'Japanese':
        return '#FF69B4';
      case 'Korean':
        return '#CD5C5C';
      case 'Thai':
        return '#FFA500';
      default:
        return '#CCCCCC';
    }
  };

  /**
   * Renders a menu item.
   * @param {object} item - The menu item object.
   */
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
      <View style={styles.menuItemContainer}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemTitle}>{item.name}</Text>
          <View style={styles.menuItemRatingAndCuisine}>
            <AirbnbRating
              defaultRating={parseFloat(item.rating) || 0}
              size={15}
              isDisabled
              showRating={false}
              minRating={0}
              maxRating={5}
            />
          </View>
          <Text style={styles.menuItemPrice}>Price: ${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: stall.stallImage }} style={styles.image} />
      <View style={styles.stallNameContainer}>
        <Text style={styles.name}>{stall.name}, {stall.location.name}</Text>
      </View>
      <View style={styles.stallRating}>
        <AirbnbRating
          defaultRating={parseFloat(stall.rating) || 0}
          size={30}
          isDisabled
          showRating={false}
          minRating={0}
          maxRating={5}
        />
      </View>
      <View style={styles.stallTags}>
        {stall.is_vegetarian && (
          <View style={[styles.tagContainer, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.tagText}>Vegetarian</Text>
          </View>
        )}
        {stall.is_halal && (
          <View style={[styles.tagContainer, { backgroundColor: '#F44336' }]}>
            <Text style={styles.tagText}>Halal</Text>
          </View>
        )}
        <View style={[styles.cuisineTag, { backgroundColor: getCuisineTagColor(stall.cuisine.name) }]}>
          <Text style={styles.tagText}>{stall.cuisine.name}</Text>
        </View>
      </View>
      <Text style={styles.description}>{stall.description}</Text>
      <FlatList
        data={menu}
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
    paddingTop: 35,
    paddingBottom: 15,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 100,
  },
  stallNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 5,
    textAlign: 'center',
  },
  stallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stallTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tagContainer: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
  cuisineTag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  location: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  menuList: {
    paddingTop: 10,
  },
  menuItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuItemDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  menuItemTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  menuItemPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FF6699',
    marginTop: 5,
  },
  starStyle: {
    marginRight: 2,
  },
  menuItemImage: {
    width: 70,
    height: 70,
    marginHorizontal: 10,
    marginTop: 10,
  },
  description: {
    marginHorizontal: 10,
    marginTop: 10,
  }
});
