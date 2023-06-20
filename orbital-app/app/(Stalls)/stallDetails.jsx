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
        .from('Menu')
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
        .from('Stall')
        .select('*')
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

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
      <View style={styles.menuItem}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemTitle}>{item.name}</Text>
          <AirbnbRating
            defaultRating={parseFloat(item.rating) || 0} // Use a default value of 0 if stall.rating is null
            size={15}
            isDisabled
            showRating={false} // Set showRating prop to false
            minRating={0} // Set the minimum selectable value to 0
            maxRating={5} // Set the maximum selectable value to 5
          />
          <Text style={styles.menuItemPrice}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: stall.stallImage }} style={styles.image} />
      <Text style={styles.name}>{stall.name}</Text>
      <AirbnbRating
        defaultRating={parseFloat(stall.rating) || 0} // Use a default value of 0 if stall.rating is null
        size={30}
        isDisabled
        minRating={0} // Set the minimum selectable value to 0
        maxRating={5} // Set the maximum selectable value to 5
      />
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
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  menuList: {
    paddingTop: 20,
  },
  menuItemDetails: {
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  menuItemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  menuItemTitle: {
    fontWeight: 'bold',
    fontSize: 15
  },
  menuItemPrice: {
    color: '#2C0080',
  },
});