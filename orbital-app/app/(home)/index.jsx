import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';
import { Picker } from '@react-native-picker/picker';
import PromotionPopup from "../(StallOwnerHiddenTabs)/PromotionPopup"

export default function StallPage() {
  const [stalls, setStalls] = useState([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from('promotion')
          .select('*')
          .lte('start_date', new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }))
          .gte('end_date', new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }))
          .order('start_date', { ascending: true })
          .order('end_date', { ascending: true });
        if (error) {
          console.error('Error fetching promotion details:', error.message);
          return;
        }
        setPromotions(data);
        setShowPromotionPopup(true);
      } catch (error) {
        console.error('Error fetching promotion details:', error.message);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchStalls();
  }, [isFocused, sortBy]);

  useEffect(() => {
    fetchStalls();
  }, [searchQuery]);

  const fetchStalls = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('*, location ( name ), cuisine (name)')
        .ilike('name', `%${searchQuery}%`);
      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }

      if (sortBy) {
        let sortedData = [...data]; // Create a copy of the array
        switch (sortBy) {
          case 'rating':
            sortedData = sortedData.sort((a, b) => {
              const ratingA = a.rating || 0; // Treat null as 0
              const ratingB = b.rating || 0; // Treat null as 0
              return parseFloat(ratingB) - parseFloat(ratingA);
            });
            break;
          case 'name':
            sortedData = sortedData.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default:
            break;
        }
        setStalls(sortedData);
      } else {
        setStalls(data);
      }
    } catch (error) {
      console.error('Error fetching stall details:', error.message);
    }
  };

  const handleStallPress = (stall) => {
    router.push({ pathname: '/stallDetails', params: { id: stall } });
  };

  const getCuisineTagColor = (cuisineName) => {
    switch (cuisineName) {
      case 'Chinese':
        return '#FFD700'; // Gold color for Chinese cuisine
      case 'Western':
        return '#6495ED'; // Cornflower blue color for Western cuisine
      case 'Malay':
        return '#228B22'; // Forest green color for Malay cuisine
      case 'Indian':
        return '#FF4500'; // Orange-red color for Indian cuisine
      case 'Japanese':
        return '#FF69B4'; // Hot pink color for Japanese cuisine
      case 'Korean':
        return '#CD5C5C'; // Indian red color for Korean cuisine
      case 'Thai':
        return '#FFA500'; // Orange color for Thai cuisine
      default:
        return '#CCCCCC'; // Default color if cuisine name doesn't match any specific case
    }
  };

  const renderStall = ({ item }) => (
    <TouchableOpacity onPress={() => handleStallPress(item.id)}>
      <View style={styles.stallContainer}>
        <Image source={{ uri: item.stallImage }} style={styles.stallImage} />
        <View style={styles.stallDetails}>
          <Text style={styles.stallTitle}>{item.name} @ {item.location.name}</Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              defaultRating={parseFloat(item.rating) || 0}
              size={20}
              isDisabled
              showRating={false}
              minRating={0}
              maxRating={5}
            />
            <Text style={styles.ratingText}>{parseFloat(item.rating) || 0} / 5.0</Text>
          </View>
          <View style={styles.cuisineTagsContainer}>
            <Text style={[styles.cuisineTag, { backgroundColor: getCuisineTagColor(item.cuisine.name) }]}>
              {item.cuisine.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.heading}>Stalls found:</Text>

      <View style={styles.sortContainer}>
        <Text style={styles.heading}>Sort By:</Text>
        <Picker
          selectedValue={sortBy}
          onValueChange={(itemValue) => setSortBy(itemValue)}
          style={styles.sortDropdown}
        >
          <Picker.Item label="None" value="" />
          <Picker.Item label="Rating" value="rating" />
          <Picker.Item label="Stall Name" value="name" />
          {/* Add additional sorting options here */}
        </Picker>
      </View>

      <FlatList
        data={stalls}
        renderItem={renderStall}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.stallList}
        showsVerticalScrollIndicator={false}
      />

      {showPromotionPopup && (
        <PromotionPopup promotions={promotions} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  stallList: {
    paddingBottom: 20,
  },
  stallContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stallImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  stallDetails: {
    padding: 10,
  },
  stallTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  cuisineTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  cuisineTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
    marginRight: 5,
    backgroundColor: '#CCCCCC',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  searchInput: {
    marginBottom: 10,
    fontSize: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});
