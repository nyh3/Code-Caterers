import { useState, useEffect } from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'expo-router';

export default function FilterPage() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [budget, setBudget] = useState('');
  const [hasAirCon, setHasAirCon] = useState(false);
  const [hasHalal, setHasHalal] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [filteredFoodOptions, setFilteredFoodOptions] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationMenuVisible, setLocationMenuVisible] = useState(false);
  const [cuisineMenuVisible, setCuisineMenuVisible] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const [cuisineId, setCuisineId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDietaryRestrictions = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('dietary_restrictions')
          .eq('id', userId);
        if (error) {
          console.error('Error retrieving dietary restrictions:', error.message);
          return;
        }
        const restrictions = data[0]?.dietary_restrictions || [];
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error('Error retrieving dietary restrictions:', error.message);
      }
    };

    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('location').select();
        if (error) {
          console.error('Error retrieving locations:', error.message);
          return;
        }
        setLocations(data);
      } catch (error) {
        console.error('Error retrieving locations:', error.message);
      }
    };

    const fetchCuisines = async () => {
      try {
        const { data, error } = await supabase.from('cuisine').select();
        if (error) {
          console.error('Error retrieving cuisines:', error.message);
          return;
        }
        setCuisines(data);
      } catch (error) {
        console.error('Error retrieving cuisines:', error.message);
      }
    };

    const fetchFoodOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('menu')
          .select('*, stall(*, cuisine(*), location(*))');
        if (error) {
          console.error('Error retrieving food options:', error.message);
          return;
        }
        setFoodOptions(data);
      } catch (error) {
        console.error('Error retrieving food options:', error.message);
      }
    };

    fetchDietaryRestrictions();
    fetchLocations();
    fetchCuisines();
    fetchFoodOptions();
  }, [userId]);

  useEffect(() => {
    const filterFoodOptions = () => {
      let filteredOptions = foodOptions;

      // Filter by dietary restrictions
      filteredOptions = filteredOptions.filter((option) => {
        if (!option.dietary_restrictions) {
          return true; // Include the option if dietary_restrictions is null or undefined
        }
        return option.dietary_restrictions.every((restriction) => !dietaryRestrictions.includes(restriction));
      });

      // Filter by budget
      filteredOptions = filteredOptions.filter((option) => {
        // Apply budget filter
        if (budget && option.price > parseInt(budget)) {
          return false;
        }
        return true;
      });

      // Filter by air conditioning
      if (hasAirCon) {
        filteredOptions = filteredOptions.filter((option) => option.stall.has_air_con);
      }

      // Filter by halal
      if (hasHalal) {
        filteredOptions = filteredOptions.filter((option) => option.stall.is_halal);
      }

      // Filter by vegetarian
      if (isVegetarian) {
        filteredOptions = filteredOptions.filter((option) => option.stall.is_vegetarian);
      }

      // Filter by cuisine
      if (cuisineId) {
        filteredOptions = filteredOptions.filter((option) => option.stall.cuisine.id === cuisineId);
      }

      // Filter by location
      if (locationId) {
        filteredOptions = filteredOptions.filter((option) => option.stall.location.id === locationId);
      }

      // Sort by rating (descending order)
      filteredOptions.sort((a, b) => b.rating - a.rating);

      // Get the top 3 options with the highest rating
      const topThreeOptions = filteredOptions.slice(0, 3);

      // If there are ties in the rating, sort by stall rating (descending order)
      if (topThreeOptions.length < 3) {
        filteredOptions.sort((a, b) => b.stall.rating - a.stall.rating);
        const additionalOptions = filteredOptions.slice(0, 3 - topThreeOptions.length);
        setFilteredFoodOptions([...topThreeOptions, ...additionalOptions]);
      } else {
        setFilteredFoodOptions(topThreeOptions);
      }
    };

    filterFoodOptions();
  }, [dietaryRestrictions, budget, hasAirCon, hasHalal, isVegetarian, cuisineId, locationId, foodOptions]);

  const handleLocationMenu = () => setLocationMenuVisible(!locationMenuVisible);

  const handleCuisineMenu = () => setCuisineMenuVisible(!cuisineMenuVisible);

  const handleLocationSelection = (location) => {
    setSelectedLocation(location.name);
    setLocationId(location.id);
    setLocationMenuVisible(false);
  };

  const handleCuisineSelection = (cuisine) => {
    setSelectedCuisine(cuisine.name);
    setCuisineId(cuisine.id);
    setCuisineMenuVisible(false);
  };

  const resetFilters = () => {
    setSelectedLocation(null);
    setSelectedCuisine(null);
    setLocationId(null);
    setCuisineId(null);
    setBudget(0);
    setHasAirCon(false);
    setHasHalal(false);
    setIsVegetarian(false);
  };

  const handleMenuPress = (menu) => {
    router.push({ pathname: '/menuDetails', params: { id: menu } });
  };

  return (
    < Provider>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Select your preferences:</Text>
          <Text style={styles.dietaryRestrictions}>Dietary Restrictions Retrieved:</Text>
          {dietaryRestrictions.map((restriction, index) => (
            <View key={index} style={styles.restrictionContainer}>
              <Text style={styles.restrictionText}>{restriction}</Text>
            </View>
          ))}
          <Text style={styles.dietaryRestrictions}>Input Budget:</Text>
          <TextInput
            style={styles.input}
            placeholder="Budget"
            placeholderTextColor="#2C0080"
            value={budget.toString()}
            onChangeText={setBudget}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Select Location:</Text>
          <Menu
            visible={locationMenuVisible}
            onDismiss={handleLocationMenu}
            anchor={
              <Button
                style={styles.buttons}
                mode="contained"
                labelStyle={styles.buttonText}
                onPress={handleLocationMenu}>
                {selectedLocation || 'Select Location'}
              </Button>
            }
          >
            {locations.map((location) => (
              <Menu.Item
                key={location.id}
                onPress={() => handleLocationSelection(location)}
                title={location.name}
              />
            ))}
          </Menu>

          <Text style={styles.label}>Select Cuisine:</Text>
          <Menu
            visible={cuisineMenuVisible}
            onDismiss={handleCuisineMenu}
            anchor={
              <Button
                style={styles.buttons}
                mode="contained"
                labelStyle={styles.buttonText}
                onPress={handleCuisineMenu}>
                {selectedCuisine || 'Select Cuisine'}
              </Button>
            }
          >
            {cuisines.map((cuisine) => (
              <Menu.Item key={cuisine.id} onPress={() => handleCuisineSelection(cuisine)} title={cuisine.name} />
            ))}
          </Menu>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Select Air Conditioning:</Text>
            <Switch
              value={hasAirCon}
              onValueChange={(value) => setHasAirCon(value)}
              style={styles.switch}
              trackColor={{ false: '#FFECF6', true: '#FFBBDF' }}
              thumbColor={hasAirCon ? '#FFECF6' : '#FFBBDF'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Select Halal:</Text>
            <Switch
              value={hasHalal}
              onValueChange={(value) => setHasHalal(value)}
              style={styles.switch}
              trackColor={{ false: '#FFECF6', true: '#FFBBDF' }}
              thumbColor={hasHalal ? '#FFECF6' : '#FFBBDF'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Select Vegetarian:</Text>
            <Switch
              value={isVegetarian}
              onValueChange={(value) => setIsVegetarian(value)}
              style={styles.switch}
              trackColor={{ false: '#FFECF6', true: '#FFBBDF' }}
              thumbColor={isVegetarian ? '#FFECF6' : '#FFBBDF'}
            />
          </View>

          <Button
            style={styles.resetButton}
            mode="contained"
            onPress={resetFilters}
          >
            <Text style={styles.buttonText}>Reset Filter</Text>
          </Button>

          <Text style={styles.heading}>Here are your 3 Recommendations:</Text>
          {filteredFoodOptions.length > 0 ? (
            filteredFoodOptions.map((option) => (
              <TouchableOpacity style={styles.option} key={option.id} onPress={() => { handleMenuPress(option.id) }}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionDetails}>Price: ${option.price}</Text>
                <Text style={styles.optionDetails}>Dietary Restrictions: {option.dietaryRestrictions}</Text>
                <Text style={styles.optionDetails}>Cuisine: {option.cuisine}</Text>
                <Text style={styles.optionDetails}>Location: {option.location}</Text>
                <Text style={styles.optionDetails}>Air Conditioning: {option.hasAirCon ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.label}>No options match your criteria.</Text>
          )}
        </View>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  dietaryRestrictions: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginBottom: 15,
  },
  restriction: {
    height: 40,
    fontSize: 15,
    color: 'black',
    marginBottom: 15,
    backgroundColor: '#FFECF6',
    paddingLeft: 10,
    paddingTop: 10,
  },
  input: {
    height: 40,
    fontSize: 15,
    color: 'black',
    marginBottom: 5,
    backgroundColor: '#FFECF6',
    paddingLeft: 10,
  },
  label: {
    marginLeft: 5,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  buttons: {
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    color: '#2C0080'
  },
  row: {
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switch: {
    marginLeft: 'auto',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  buttonText: {
    color: '#2C0080',
    fontWeight: '500',
    fontSize: 15,
  },
  resetButton: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    padding: 3,
    flex: 1,
    marginBottom: 10,
  },
  option: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#FFECF6',
  },
  optionName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  restrictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#FFECF6',
    height: 40,
  },
  restrictionText: {
    fontSize: 15,
    color: 'black',
  },
});