import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';

export default function FilterPage() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [budget, setBudget] = useState('');
  const [hasAirCon, setHasAirCon] = useState(false);
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

  useEffect(() => {
    const fetchDietaryRestrictions = async () => {
      try {
        const { data, error } = await supabase.from('profile').select('dietary_restrictions').eq('id', userId);
        if (error) {
          console.error('Error retrieving dietary restrictions:', error.message);
          return;
        }
        const restrictions = data.map((item) => item.dietary_restrictions);
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
          console.log('Location data:', data);
          console.log('Location error:', error);
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
        const { data, error } = await supabase.from('foodOptions').select();
        if (error) {
          console.error('Error retrieving food options:', error.message);
          return;
        }
        setFoodOptions(data);
      } catch (error) {
        console.error('Error retrieving food options:', error.message);
      }
    };

    fetchFoodOptions();
    fetchDietaryRestrictions();
    fetchLocations();
    fetchCuisines();
  }, []);

  const handleLocationSelection = async (locationId) => {
    try {
      const { data } = await supabase
        .from('location')
        .select()
        .eq('id', locationId)
        .single();

      if (data) {
        setLocationId(data.id);
        setSelectedLocation(data.name);
      } else {
        console.error('Location not found');
      }

      setLocationMenuVisible(false);
    } catch (error) {
      console.error('Error retrieving location:', error.message);
    }
  };

  const handleCuisineSelection = async (cuisineId) => {
    try {
      const { data } = await supabase
        .from('cuisine')
        .select()
        .eq('id', cuisineId)
        .single();
      if (data) {
        setCuisineId(data.id);
        setSelectedCuisine(data.name);
      }
      setCuisineMenuVisible(false);
    } catch (error) {
      console.error('Error retrieving cuisine:', error.message);
    }
  };

  const handleFilter = () => {
    const filteredOptions = foodOptions.filter((option) => {
      // Filter by dietary restrictions. if user has no dietary restrictions, will show all options.
      // If user has dietary restrictions, willl only show menu with that dietary restriction. 
      if (dietaryRestrictions.length > 0) {
        for (const restriction of dietaryRestrictions) {
          if (!option.dietaryRestrictions.includes(restriction)) {
            return false;
          }
        }
      }

      // Filter by budget. Shows menu with budget > price.
      if (budget && option.price > parseInt(budget, 10)) {
        return false;
      }

      // Filter by cuisine (still working on this)
      if (cuisineId && option.cuisineId !== cuisineId) {
        return false;
      }

      // Filter by location (still working on this)
      if (locationId && option.locationId !== locationId) {
        return false;
      }

      // Filter by air conditioning. If choose air-conditioning, will only give air-conditioned results. 
      // If choose no air-conditioning, will give both no air-conditioned & air-conditioned results.
      if (hasAirCon && !option.hasAirCon) {
        return false;
      }
      return true;
    });

    // Fetch cuisine and location details (still working on this)
    const filteredOptionsWithDetails = filteredOptions.map((option) => {
      const cuisine = cuisines.find((cuisine) => cuisine.id === option.cuisineId);
      const location = locations.find((location) => location.id === option.locationId);
      return {
        ...option,
        cuisine: cuisine ? cuisine.name : '',
        location: location ? location.name : '',
      };
    });
    setFilteredFoodOptions(filteredOptionsWithDetails);
  };

  const resetFilter = () => {
    setBudget('');
    setHasAirCon(false);
    setSelectedCuisine(null);
    setSelectedLocation(null);
    setLocationId(null);
    setCuisineId(null);
    setFilteredFoodOptions([]);
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Select your preferences:</Text>
        <Text style={styles.dietaryRestrictions}>Dietary Restrictions:</Text>
        <Text style={styles.restriction}>{dietaryRestrictions}</Text>
        <TextInput
          style={styles.input}
          placeholder="Budget"
          placeholderTextColor="#2C0080"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Select Cuisine:</Text>
        <Menu
          visible={cuisineMenuVisible}
          onDismiss={() => setCuisineMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setCuisineMenuVisible(true)}
              style={styles.buttons}
              labelStyle={styles.buttonText}
            >
              {selectedCuisine ? selectedCuisine : 'Select Cuisine'}
            </Button>
          }
        >
          {cuisines.map((cuisine) => (
            <Menu.Item
              key={cuisine.id}
              onPress={() => handleCuisineSelection(cuisine.id)}
              title={cuisine.name}
            />
          ))}
        </Menu>
        <Text style={styles.label}>Select Location:</Text>
        <Menu
          visible={locationMenuVisible}
          onDismiss={() => setLocationMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setLocationMenuVisible(true)}
              style={styles.buttons}
              labelStyle={styles.buttonText}
            >
              {selectedLocation ? selectedLocation : 'Select Location'}
            </Button>
          }
        >
          {locations.map((location) => (
            <Menu.Item
              key={location.id}
              onPress={() => handleLocationSelection(location.id)}
              title={location.name}
            />
          ))}

        </Menu>
        <View style={styles.row}>
          <Text style={styles.label}>Air Conditioning</Text>
          <Switch
            value={hasAirCon}
            onValueChange={(value) => { setHasAirCon(value); }}
            style={styles.switch}
            trackColor={{ false: '#FFECF6', true: '#FFBBDF' }}
            thumbColor={hasAirCon ? '#FFECF6' : '#FFBBDF'}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFilter}>
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilter}>
          <Text style={styles.buttonText}>Reset Filter</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Here your 3 Recommendations:</Text>
        {filteredFoodOptions.length > 0 ? (
          filteredFoodOptions.map((option) => (
            <View key={option.id} style={styles.option}>
              <Text style={styles.optionName}>{option.name}</Text>
              <Text style={styles.optionDetails}>Price: ${option.price}</Text>
              <Text style={styles.optionDetails}>Dietary Restrictions: {option.dietaryRestrictions}</Text>
              <Text style={styles.optionDetails}>Cuisine: {option.cuisine}</Text>
              <Text style={styles.optionDetails}>Location: {option.location}</Text>
              <Text style={styles.optionDetails}>Air Conditioning: {option.hasAirCon ? 'Yes' : 'No'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.label}>No options match your criteria.</Text>
        )}
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5FA',
    flex: 1,
    marginHorizontal: 10,
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
    padding: 10,
    marginRight: 280,
    marginVertical: 10,
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
});