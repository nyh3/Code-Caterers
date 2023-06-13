import { View, Text, Image, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, useRouter } from 'expo-router';

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
        .select('name, image, price, id')
        .eq('stall_id', stallId.id);

      if (error) {
        console.error('Error fetching menu details:', error.message);
        return;
      }
      console.log(data);
      setMenu(data);
      console.log(menu);
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
    router.push({ pathname: '/menuDetails', params: { id: menu} });
    console.log('Menu item pressed:', menu);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
      <View style={styles.menuItem}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemTitle}>{item.name}</Text>
          <Text style={styles.menuItemPrice}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: stall.stallImage }} style={styles.image} />
      <Text style={styles.name}>{stall.name}</Text>
      <Text>Helooo</Text>

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
      marginHorizontal: 10,
      alignItems: 'center', 
  },
  image: {
    width: 200, 
    height: 200, 
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  menuList: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  menuItemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  menuItemTitle: {
    fontWeight: 'bold',
  },
  menuItemPrice: {
    color: '#888',
  },
});