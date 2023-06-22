import { View, Text, Image, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';

export default function StallDetailScreen() {
  const [menu, setMenu] = useState([]);
  const [stall, setStall] = useState(null);
  const stallId = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchMenuDetails();
    fetchStallDetails();
  }, []);

  const fetchMenuDetails = async () => {
    console.log(stallId);
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

  const fetchStallDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('*, location ( name ), cuisine (name)')
        .eq('id', stallId.id)
        .single();

      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }
      setStall(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  if (!stall) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleMenuPress = (menu) => {
    router.push({ pathname: '/menuDetails', params: { id: menu } });
    console.log('Menu item pressed:', menu);
  };

  const getCuisineTagColor = (cuisineName) => {
    switch (cuisineName) {
      case 'Chinese':
        return '#FFD700'; // Gold color for Chinese cuisine
      case 'Western':
        return '#6495ED'; // Cornflower blue color for Western cuisine
      case 'Malay':
        return '#228B22'; // Forest green color for Malay cuisine
      case 'Indian':
        return '#FF4500'; // Orange-red color for Indian cuisine
      case 'Japanese':
        return '#FF69B4'; // Hot pink color for Japanese cuisine
      case 'Korean':
        return '#CD5C5C'; // Indian red color for Korean cuisine
      case 'Thai':
        return '#FFA500'; // Orange color for Thai cuisine
      default:
        return '#CCCCCC'; // Default color if cuisine name doesn't match any specific case
    }
  };

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
          <Text style={styles.menuItemPrice}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: stall.stallImage }} style={styles.image} />
      <View style={styles.stallNameContainer}>
        <Text style={styles.name}>{stall.name} @ {stall.location.name}</Text>
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
        <View style={[styles.cuisineTag, { backgroundColor: getCuisineTagColor(stall.cuisine.name)}]}>
          <Text style={styles.cuisineTagText}>{stall.cuisine.name}</Text>
        </View>
      </View>
      <Text>{stall.description}</Text>
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
    paddingVertical: 35,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
  },
  stallNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    marginBottom: 10,
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
  cuisineTagText: {
    color: 'white',
    fontSize: 12,
  },
  location: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  menuList: {
    paddingTop: 20,
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
    marginBottom: 5,
  },
  menuItemTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  menuItemPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FF6363',
    marginTop: 5,
  },
  starStyle: {
    marginRight: 2,
  },
  menuItemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
});
