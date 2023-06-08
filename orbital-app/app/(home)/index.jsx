import { useState, useEffect, useContext } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { StallContext } from '../../contexts/stallid';

export default function HomePage() {
  const { setSelectedStallId } = useContext(StallContext);
  const [stalls, setStalls] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    const { data: stalls, error } = await supabase
      .from('Stall')
      .select('*');

    if (error) {
      console.error(error);
    } else {
      setStalls(stalls);
    }
  };

  const handleStallPress = (stall) => {
    setSelectedStallId(stall.id);
    router.replace('(Stalls)/stallDetails');
  }
  return (
    <ScrollView>
      {stalls.map((stall) => (
        <TouchableOpacity
          key={stall.id}
          style={{ flexDirection: 'row', alignItems: 'center, padding:16 '}}
          onPress={() => handleStallPress(stall)}
          >
            <Image
              source={{ uri: stall.image }}
              style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
              />
              <Text>{stall.name}</Text>
          </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});