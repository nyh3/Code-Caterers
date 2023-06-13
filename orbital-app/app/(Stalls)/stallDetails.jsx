import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'expo-router';

export default function StallDetailScreen() {
  const [menu, setMenu] = useState(null);
  const [stall, setStall] = useState(null);
  const stallId = useSearchParams();

  useEffect(() => {
      fetchMenuDetails();
      fetchStallDetails();
  }, []);

  const fetchMenuDetails = async () => {
    console.log(stallId);
    try {
      const { data, error } = await supabase
        .from('Menu')
        .select('name, image, price')
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
        .eq('id', stallId.id);

      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }
      setStall(data[0]);
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: stall.stallImage }} style={styles.image} />
      <Text style={styles.name}>{stall.name}</Text>
      <Text>Helooo</Text>
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
});