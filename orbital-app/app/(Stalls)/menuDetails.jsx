import { View, Text, Image } from 'react-native';
import { useContext } from 'react';
import { MenuContext } from '../../contexts/menuid';

export default function StallDetailScreen() {
    const { selectedMenuId } = useContext(MenuContext);
    
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: menu.image }} style={{ width: 200, height: 200, marginBottom: 16 }} />
      <Text>{menu.name}</Text>
      {/* Add more details here */}
    </View>
  );
}