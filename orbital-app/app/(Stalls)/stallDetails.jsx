import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLocalSearchParams } from 'expo-router';

export default function StallDetailScreen() {
  const [menu, setMenu] = useState(null);
  const { stall } = useLocalSearchParams();

  useEffect(() => {
    fetchMenuDetails();
  }, []);

  const fetchMenuDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('Menu')
        .select('*')
        .eq('id', stall.id)
        .single();

      if (error) {
        console.error('Error fetching menu details:', error.message);
        return;
      }

      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  if (!menu) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: menu.image }} style={{ width: 200, height: 200, marginBottom: 16 }} />
      <Text>{menu.name}</Text>
      {/* Add more details here */}
    </View>
  );
}
