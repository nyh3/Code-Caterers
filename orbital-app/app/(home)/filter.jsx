import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function FilterPage() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [budget, setBudget] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [hasAirCon, setHasAirCon] = useState(false);
  const [location, setLocation] = useState('');
  const [filteredFoodOptions, setFilteredFoodOptions] = useState([]);

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

    fetchDietaryRestrictions();
  }, []);

  const handleFilter = () => {
    // filter algorithm 
  };
  return (
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
      <TextInput
        style={styles.input}
        placeholder="Cuisine"
        placeholderTextColor="#2C0080"
        value={selectedCuisine}
        onChangeText={setSelectedCuisine}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#2C0080"
        value={location}
        onChangeText={setLocation}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Air Conditioning</Text>
        <Switch
          style={styles.switch}
          value={hasAirCon}
          onValueChange={setHasAirCon}
        />
      </View>
      <TouchableOpacity onPress={handleFilter} style={styles.buttonContainer}><Text style={styles.button}>Filter</Text></TouchableOpacity>
      <Text style={styles.heading}>Here are 3 Reccomendations:</Text>
      {
        filteredFoodOptions.map((option) => (
          <Text key={option.id} style={styles.filteredOption}>{option.name}</Text>
        ))
      }
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
    paddingTop:10,
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
  filteredOption: {
    fontSize: 15,
    marginBottom: 5,
  },
});
