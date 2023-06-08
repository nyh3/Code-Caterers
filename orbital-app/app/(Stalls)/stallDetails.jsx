import { View, Text, Image } from 'react-native';
import { useContext } from 'react';
import { StallContext } from '../../contexts/stallid';

export default function StallDetailScreen() {
    const { selectedStallId } = useContext(StallContext);
    
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: stall.image }} style={{ width: 200, height: 200, marginBottom: 16 }} />
      <Text>{stall.name}</Text>
      {/* Add more details here */}
    </View>
  );
}