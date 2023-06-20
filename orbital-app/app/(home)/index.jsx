import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';

export default function StallPage() {
  const [stalls, setStalls] = useState([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStalls();
  }, [isFocused]);

  useEffect(() => {
    fetchStalls();
  }, [searchQuery]);

  const fetchStalls = async () => {
    try {
      const { data, error } = await supabase
        .from('Stall')
        .select('*, location ( name )')
        .ilike('name', `%${searchQuery}%`);
      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }
      setStalls(data);
    } catch (error) {
      console.error('Error fetching stall details:', error.message);
    }
  };

  const handleStallPress = (stall) => {
    router.push({ pathname: '/stallDetails', params: { id: stall } });
  };

  const renderStall = ({ item }) => (
    <TouchableOpacity onPress={() => handleStallPress(item.id)}>
      <View style={styles.stall}>
        <Image source={{ uri: item.stallImage }} style={styles.stallImage} />
        <View style={styles.stallDetails}>
          <Text style={styles.stallTitle}>{item.name} @ {item.location.name}</Text>
          <AirbnbRating
            defaultRating={parseFloat(item.rating) || 0}
            size={20}
            isDisabled
            showRating={false}
            minRating={0}
            maxRating={5}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stalls:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={stalls}
        renderItem={renderStall}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.stallList}
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
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  stallList: {
    paddingBottom: 20,
  },
  stall: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stallImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  stallDetails: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  stallTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  stallDescription: {
    marginBottom: 5,
  },
  searchInput: {
    marginBottom: 10,
    fontSize: 15,
  }
});
