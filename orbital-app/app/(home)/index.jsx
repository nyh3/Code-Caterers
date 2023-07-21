import { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';
import { Picker } from '@react-native-picker/picker';
import PromotionPopup from "../(StallOwnerHiddenTabs)/PromotionPopup";
import { PopupContext } from '../../contexts/popup';

/**
 * Displays a page with stalls, allowing users to search and sort stalls.
 * @returns {JSX.Element} The StallPage component.
 */
export default function StallPage() {
  const [stalls, setStalls] = useState([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);

  const { popupCount, setPopupCount } = useContext(PopupContext);

  useEffect(() => {
    /**
     * Fetches promotions from the database and sets the state.
     */
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
        if (popupCount === 0) {
          setPopupCount(popupCount + 1); // Increment the popup count
          setShowPromotionPopup(true); // Set showPromotionPopup to true
        }
      } catch (error) {
        console.error('Error fetching promotion details:', error.message);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchStalls();
  }, [isFocused, searchQuery, sortBy]);

  /**
   * Fetches stalls from the database based on the search query and sorting option.
   */
  const fetchStalls = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('*, location ( name ), cuisine (name)')
        ;
      if (error) {
        console.error('Error fetching stall details:', error.message);
        return;
      }

      let filteredData = data; // Create a new variable to store the filtered data
      // Apply search query
      if (searchQuery) {
        filteredData = data.filter((stall) => {
          const stallName = stall.name.toLowerCase();
          const locationName = stall.location?.name.toLowerCase() || ''; // Handle null location
          const search = searchQuery.toLowerCase();
          return stallName.includes(search) || locationName.includes(search);
        });
      }

      if (sortBy) {
        switch (sortBy) {
          case 'rating':
            filteredData.sort((a, b) => {
              const ratingA = a.rating || 0; // Treat null as 0
              const ratingB = b.rating || 0; // Treat null as 0
              return parseFloat(ratingB) - parseFloat(ratingA);
            });
            break;
          case 'name':
            filteredData.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default:
            break;
        }
      }
      setStalls(filteredData);
    } catch (error) {
      console.error('Error fetching stall details:', error.message);
    }
  };

  /**
   * Handles the press event when a stall is selected.
   * @param {string} stall - The ID of the selected stall.
   */
  const handleStallPress = (stall) => {
    router.push({ pathname: '/stallDetails', params: { id: stall } });
  };

  /**
   * Returns the color code for the cuisine tag based on the cuisine name.
   * @param {string} cuisineName - The name of the cuisine.
   * @returns {string} The color code for the cuisine tag.
   */
  const getCuisineTagColor = (cuisineName) => {
    switch (cuisineName) {
      case 'Chinese':
        return '#FFD700';
      case 'Western':
        return '#6495ED';
      case 'Malay':
        return '#228B22';
      case 'Indian':
        return '#FF4500';
      case 'Japanese':
        return '#FF69B4';
      case 'Korean':
        return '#CD5C5C';
      case 'Thai':
        return '#FFA500';
      default:
        return '#CCCCCC';
    }
  };

  /**
   * Renders a stall item in the FlatList.
   * @param {object} item - The stall item.
   * @returns {JSX.Element} The rendered stall item.
   */
  const renderStall = ({ item }) => {
    // Convert item.rating to a number and handle the case when it's null or undefined
    const ratingValue = parseFloat(item.rating) || 0;

    // Round the rating to 1 decimal place
    const roundedRating = ratingValue.toFixed(1);

    return (
      <TouchableOpacity onPress={() => handleStallPress(item.id)}>
        <View style={styles.stallContainer}>
          <Image source={{ uri: item.stallImage }} style={styles.stallImage} />
          <View style={styles.stallDetails}>
            <Text style={styles.stallTitle}>{item.name} @ {item.location.name}</Text>
            <View style={styles.ratingContainer}>
              <AirbnbRating
                defaultRating={ratingValue}
                size={20}
                isDisabled
                showRating={false}
                minRating={0}
                maxRating={5}
              />
              <Text style={styles.ratingText}>{roundedRating} / 5.0</Text>
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
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for stalls..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.heading}>Stalls found:</Text>

      {searchQuery == '' && (
        <View>
          <Text style={styles.heading}>Sort By:</Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            style={styles.sortDropdown}
          >
            <Picker.Item label="None" value="" />
            <Picker.Item label="Ratings" value="rating" />
            <Picker.Item label="Stall Name" value="name" />
          </Picker>
        </View>
      )}

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
    marginBottom: 15,
    marginTop: 5,
    marginLeft: 5,
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
  sortDropdown: {
    backgroundColor: 'white',
    marginBottom: 10,
    fontSize: 15,
  },
});
