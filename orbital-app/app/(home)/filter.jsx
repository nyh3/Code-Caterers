import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

export default function FilterPage() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
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

  useEffect(() => {
    const fetchDietaryRestrictions = async () => {
      try {
        const { data, error } = await supabase.from('profile').select('dietary_restrictions');
        if (error) {
          console.error('Error retrieving dietary restrictions:', error.message);
          return;
        }
        const restrictions = data.map(item => item.dietary_restrictions).filter(Boolean);
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
    }

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
    // filter algorithm 
  };
  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.heading}>Select your preferences:</Text>
        <Text style={styles.dietaryRestrictions}>Dietary Restrictions:</Text>
        {dietaryRestrictions.map((restriction, index) => (
          <Text key={index} style={styles.restriction}>
            {restriction}
          </Text>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Budget"
          placeholderTextColor="#2C0080"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Cuisine:</Text>
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
        <Text style={styles.label}>Location:</Text>
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
            style={styles.switch}
            value={hasAirCon}
            onValueChange={setHasAirCon}
          />
        </View>
        <TouchableOpacity onPress={handleFilter} style={styles.buttonContainer}><Text style={styles.button}>Filter</Text></TouchableOpacity>
        <Text style={styles.heading}>Here are 3 Recommendations:</Text>
        {
          filteredFoodOptions.map((option) => (
            <Text key={option.id} style={styles.filteredOption}>{option.name}</Text>
          ))
        }
      </View>
    </Provider>
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
  dietaryRestrictions: {
    fontSize: 15,
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
    marginBottom: 15,
    backgroundColor: '#FFECF6',
    paddingLeft: 10,
  },
  row: {
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    marginLeft: 5,
    marginBottom: 15,
    fontSize: 15,
    paddingTop: 10,
  },
  switch: {
    marginLeft: 'auto',
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttons: {
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    color: '#2C0080'
  },
  buttonText: {
    color: '#2C0080'
  },
  filteredOption: {
    fontSize: 15,
    marginBottom: 5,
  },
});
