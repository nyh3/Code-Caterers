import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../contexts/menuid';
import { supabase } from '../../lib/supabase';

export default function StallDetailScreen() {
  const { selectedMenuId } = useContext(MenuContext);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    fetchMenuDetails();
  }, []);

  const fetchMenuDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('Menu')
        .select('*')
        .eq('id', selectedMenuId)
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
