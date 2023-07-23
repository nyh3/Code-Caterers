import { useState, useEffect } from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

/**
 * FilterPage component represents the page for filtering food options based on preferences.
 *
 * @returns {JSX.Element} The rendered FilterPage component.
 */
export default function FilterPage() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState(['Vegetarian', 'Gluten-free']);
    const [budget, setBudget] = useState('');
    const [hasAirCon, setHasAirCon] = useState(false);
    const [hasHalal, setHasHalal] = useState(true);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [filteredFoodOptions, setFilteredFoodOptions] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationMenuVisible, setLocationMenuVisible] = useState(false);
    const [cuisineMenuVisible, setCuisineMenuVisible] = useState(false);
    const [locationId, setLocationId] = useState(null);
    const [cuisineId, setCuisineId] = useState(null);
    const [locations, setLocations] = useState([
        { id: 1, name: 'Location A' },
        { id: 2, name: 'Location B' },
        { id: 3, name: 'Location C' },
    ]);
    const [cuisines, setCuisines] = useState([
        { id: 1, name: 'Cuisine X' },
        { id: 2, name: 'Cuisine Y' },
        { id: 3, name: 'Cuisine Z' },
    ]);
    const [foodOptions, setFoodOptions] = useState([
        {
            id: 1,
            name: 'Menu 1',
            image: 'https://example.com/menu1.jpg',
            rating: '4.5',
            stall: {
                name: 'Stall A',
                cuisine: { id: 1, name: 'Cuisine X' },
                location: { id: 1, name: 'Location A' },
                has_air_con: true,
                is_halal: false,
                is_vegetarian: false,
                rating: '4.0',
            },
            dietary_restrictions: ['Gluten-free'],
        },
        {
            id: 2,
            name: 'Menu 2',
            image: 'https://example.com/menu2.jpg',
            rating: '3.8',
            stall: {
                name: 'Stall B',
                cuisine: { id: 2, name: 'Cuisine Y' },
                location: { id: 2, name: 'Location B' },
                has_air_con: true,
                is_halal: true,
                is_vegetarian: false,
                rating: '4.2',
            },
            dietary_restrictions: [],
        },
        {
            id: 3,
            name: 'Menu 3',
            image: 'https://example.com/menu3.jpg',
            rating: '4.7',
            stall: {
                name: 'Stall C',
                cuisine: { id: 1, name: 'Cuisine X' },
                location: { id: 3, name: 'Location C' },
                has_air_con: false,
                is_halal: true,
                is_vegetarian: true,
                rating: '4.8',
            },
            dietary_restrictions: ['Vegetarian'],
        },
    ]);

    useEffect(() => {
        let filteredOptions = foodOptions;

        filteredOptions = filteredOptions.filter((option) => {
            if (!option.dietary_restrictions || option.dietary_restrictions.length === 0) {
                return true;
            }
            return option.dietary_restrictions.every((restriction) => !dietaryRestrictions.includes(restriction));
        });

        filteredOptions = filteredOptions.filter((option) => {
            if (budget && option.price > parseFloat(budget)) {
                return false;
            }
            return true;
        });

        if (hasAirCon) {
            filteredOptions = filteredOptions.filter((option) => option.stall.has_air_con);
        }

        if (hasHalal) {
            filteredOptions = filteredOptions.filter((option) => option.stall.is_halal);
        }

        if (isVegetarian) {
            filteredOptions = filteredOptions.filter((option) => option.stall.is_vegetarian);
        }

        if (cuisineId) {
            filteredOptions = filteredOptions.filter((option) => option.stall.cuisine.id === cuisineId);
        }

        if (locationId) {
            filteredOptions = filteredOptions.filter((option) => option.stall.location.id === locationId);
        }

        filteredOptions.sort((a, b) => {
            const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
            if (ratingDiff !== 0) {
                return ratingDiff;
            }
            return (parseFloat(b.stall.rating) || 0) - (parseFloat(a.stall.rating) || 0);
        });

        const topThreeOptions = filteredOptions.slice(0, 3);
        setFilteredFoodOptions(topThreeOptions);
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
        setBudget('');
        setHasAirCon(false);
        setHasHalal(false);
        setIsVegetarian(false);
    };

    const roundedRating = (value) => {
        const floatValue = parseFloat(value);
        const roundedValue = isNaN(floatValue) ? 0 : floatValue.toFixed(1);
        return roundedValue;
    };

    return (
        <Provider>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.heading}>Select your preferences:</Text>
                    <Text style={styles.dietaryRestrictions}>Dietary Restrictions Retrieved:</Text>
                    {dietaryRestrictions.length > 0 ? (
                        dietaryRestrictions.map((restriction, index) => (
                            <View key={index} style={styles.restrictionContainer}>
                                <Text style={styles.restrictionText}>{restriction}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.restrictionContainer}>
                            <Text style={styles.restrictionText}>No dietary restrictions found</Text>
                        </View>
                    )}
                    <Text style={styles.dietaryRestrictions}>Input Budget:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Budget"
                        placeholderTextColor="#2C0080"
                        value={budget === '' ? '' : `${budget}`}
                        onChangeText={(text) => {
                            const budgetValue = text.replace('$', '');
                            setBudget(budgetValue === '' || isNaN(budgetValue) ? '' : parseFloat(budgetValue));
                        }}
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
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Here are your 3 Recommendations:</Text>
                    {filteredFoodOptions.length > 0 ? (
                        filteredFoodOptions.map((option) => (
                            <TouchableOpacity style={styles.option} key={option.id} onPress={() => { }}>
                                <View style={styles.optionContainer}>
                                    <Image source={{ uri: option.image }} style={styles.menuImage} />
                                    <View style={styles.optionDetailsContainer}>
                                        <Text style={styles.optionName}>{option.name}, {option.stall.name}</Text>
                                        <View style={styles.ratingContainer}>
                                            <Text style={styles.optionDetails}>Menu rating:</Text>
                                            <AirbnbRating
                                                defaultRating={parseFloat(option.rating) || 0}
                                                size={10}
                                                isDisabled
                                                showRating={false}
                                                minRating={0}
                                                maxRating={5}
                                            />
                                            <Text style={styles.ratingText}>{roundedRating(option.rating)} / 5.0</Text>
                                        </View>

                                        <View style={styles.ratingContainer}>
                                            <Text style={styles.optionDetails}>Stall rating:</Text>
                                            <AirbnbRating
                                                defaultRating={parseFloat(option.stall.rating) || 0}
                                                size={10}
                                                isDisabled
                                                showRating={false}
                                                minRating={0}
                                                maxRating={5}
                                            />
                                            <Text style={styles.ratingText}>{roundedRating(option.stall.rating)} / 5.0</Text>
                                        </View>

                                        {option.dietary_restrictions && option.dietary_restrictions.length > 0 && (
                                            <Text style={styles.optionDetails}>
                                                Dietary Restrictions: {option.dietary_restrictions.join(', ')}
                                            </Text>
                                        )}
                                        <Text style={styles.optionDetails}>Cuisine: {option.stall.cuisine.name}</Text>
                                        <Text style={styles.optionDetails}>Location: {option.stall.location.name}</Text>
                                        <Text style={styles.optionDetails}>Air Conditioning: {option.stall.has_air_con ? 'Yes' : 'No'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.label}>No options match your criteria.</Text>
                    )}
                    {filteredFoodOptions.length > 0 && filteredFoodOptions.length < 3 && (
                        <Text style={styles.label2}>No other options match your criteria.</Text>
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
        paddingHorizontal: 15,
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
        marginBottom: 10,
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
    label2: {
        marginLeft: 5,
        marginBottom: 15,
        fontSize: 14,
        fontWeight: 'bold',
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
    optionContainer: {
        flexDirection: 'row',
    },
    menuImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    optionDetailsContainer: {
        flex: 1,
        marginLeft: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#888',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        marginTop: 10,
    },
});
