import { useState } from 'react';
import { View, Text, Switch, StyleSheet, TextInput } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';

export default function FilterPage({ locations, cuisines }) {
  const [budget, setBudget] = useState('');
  const [hasAirCon, setHasAirCon] = useState(false);
  const [hasHalal, setHasHalal] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationMenuVisible, setLocationMenuVisible] = useState(false);
  const [cuisineMenuVisible, setCuisineMenuVisible] = useState(false);

  const handleLocationMenu = () => setLocationMenuVisible(!locationMenuVisible);
  const handleCuisineMenu = () => setCuisineMenuVisible(!cuisineMenuVisible);

  const handleLocationSelection = (location) => {
    setSelectedLocation(location.name);
    setLocationMenuVisible(false);
  };

  const handleCuisineSelection = (cuisine) => {
    setSelectedCuisine(cuisine.name);
    setCuisineMenuVisible(false);
  };

  const resetFilters = () => {
    setSelectedLocation(null);
    setSelectedCuisine(null);
    setBudget('');
    setHasAirCon(false);
    setHasHalal(false);
    setIsVegetarian(false);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.heading}>Select your preferences:</Text>

        <Text style={styles.label}>Dietary Restrictions Retrieved:</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Select Air Conditioning:</Text>
          <Switch
            value={hasAirCon}
            onValueChange={(value) => setHasAirCon(value)}
            testID="has-air-con-switch"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Select Halal:</Text>
          <Switch
            value={hasHalal}
            onValueChange={(value) => setHasHalal(value)}
            testID="has-halal-switch"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Select Vegetarian:</Text>
          <Switch
            value={isVegetarian}
            onValueChange={(value) => setIsVegetarian(value)}
            testID="is-vegetarian-switch"
          />
        </View>

        <Text style={styles.label}>Input Budget:</Text>
        <TextInput
          style={styles.input}
          placeholder="Budget"
          placeholderTextColor="#2C0080"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          testID="budget-input"
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
              onPress={handleLocationMenu}
              testID="location-menu-button"
            >
              {selectedLocation || 'Select Location'}
            </Button>
          }
          testID="location-menu"
        >
          {locations.map((location) => (
            <Menu.Item
              key={location.id}
              title={location.name}
              onPress={() => handleLocationSelection(location)}
              testID={`location-item-${location.id}`}
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
              onPress={handleCuisineMenu}
              testID="cuisine-menu-button"
            >
              {selectedCuisine || 'Select Cuisine'}
            </Button>
          }
          testID="cuisine-menu"
        >
          {cuisines.map((cuisine) => (
            <Menu.Item
              key={cuisine.id}
              title={cuisine.name}
              onPress={() => handleCuisineSelection(cuisine)}
              testID={`cuisine-item-${cuisine.id}`}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          style={styles.resetButton}
          labelStyle={styles.buttonText}
          onPress={resetFilters}
          testID="reset-button"
        >
          Reset Filter
        </Button>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
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
    color: '#2C0080',
  },
  input: {
    height: 40,
    fontSize: 15,
    color: 'black',
    marginBottom: 5,
    backgroundColor: '#FFECF6',
    paddingLeft: 10,
  },
  switch: {
    marginLeft: 'auto',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  switchText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
});
