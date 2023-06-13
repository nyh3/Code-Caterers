import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function MenuDetailScreen() {
  const menuId = useSearchParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    fetchMenuDetails();
  }, []);

  const fetchMenuDetails = async () => {
    console.log(menuId);
    try {
      const { data, error } = await supabase
        .from('Menu')
        .select('*')
        .eq('id', menuId.id)
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
        <Text>Error</Text>
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