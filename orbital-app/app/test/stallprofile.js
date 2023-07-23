import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider, ActivityIndicator } from 'react-native-paper';

export default function StallProfilePage({ mockSupabaseData }) {
    const [stallImage, setStallImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [stallId, setStallId] = useState(null);
    const [stallName, setStallName] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationMenuVisible, setLocationMenuVisible] = useState(false);
    const [cuisineMenuVisible, setCuisineMenuVisible] = useState(false);
    const [hasAirCon, setHasAirCon] = useState(false);
    const [isHalal, setIsHalal] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [locationId, setLocationId] = useState(null);
    const [cuisineId, setCuisineId] = useState(null);
    const [locations, setLocations] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Mock fetchStallDetails function with mock data
        const fetchStallDetails = async () => {
            const stall = mockSupabaseData; // Make sure mockSupabaseData is correctly defined
            setStallId(stall?.id || null); // Use optional chaining (?.) to handle null or undefined stall
            setStallName(stall?.name || '');
            setSelectedLocation(stall?.location?.name || null);
            setSelectedCuisine(stall?.cuisine?.name || null);
            setHasAirCon(stall?.has_air_con || false);
            setIsHalal(stall?.is_halal || false);
            setIsVegetarian(stall?.is_vegetarian || false);
            setDescription(stall?.description || '');
            setStallImage(stall?.stallImage || null);
            setLocationId(stall?.location_ID || null);
            setCuisineId(stall?.cuisine_ID || null);
        };

        fetchStallDetails();
        fetchLocations();
        fetchCuisines();
    }, [mockSupabaseData]);

    /**
     * Fetches the list of locations (Mocked function with mock data)
     */
    const fetchLocations = async () => {
        // Mocked data for locations (replace with actual data if needed)
        const mockLocations = [
            { id: 1, name: 'Location 1' },
            { id: 2, name: 'Location 2' },
            // Add more mock locations as needed
        ];
        setLocations(mockLocations);
    };

    /**
     * Fetches the list of cuisines (Mocked function with mock data)
     */
    const fetchCuisines = async () => {
        // Mocked data for cuisines (replace with actual data if needed)
        const mockCuisines = [
            { id: 1, name: 'Cuisine 1' },
            { id: 2, name: 'Cuisine 2' },
            // Add more mock cuisines as needed
        ];
        setCuisines(mockCuisines);
    };

    /**
     * Handles the selection of a location (Mocked function with mock data)
     */
    const handleLocationSelection = async (locationId) => {
        const selectedLocationData = locations.find((loc) => loc.id === locationId);
        setLocationId(selectedLocationData.id);
        setSelectedLocation(selectedLocationData.name);
        setLocationMenuVisible(false);
    };

    /**
     * Handles the selection of a cuisine (Mocked function with mock data)
     */
    const handleCuisineSelection = async (cuisineId) => {
        const selectedCuisineData = cuisines.find((cuisine) => cuisine.id === cuisineId);
        setCuisineId(selectedCuisineData.id);
        setSelectedCuisine(selectedCuisineData.name);
        setCuisineMenuVisible(false);
    };

    const handleInsertStallImage = () => {
        setStallImage('Mocked Stall Image'); // Update to the desired image URI or mock data
    };

    /**
     * Handles the submission of the stall details (Mocked function with console.log)
     */
    const handleSubmit = async () => {
        setLoading(true);
        console.log('Submitting stall details...');
        console.log('Stall details submitted:', {
            stallName,
            stallImage,
            selectedLocation,
            selectedCuisine,
            hasAirCon,
            isHalal,
            isVegetarian,
            locationId,
            cuisineId,
            description,
        });
        setLoading(false);
    };

    // Function to handle the "Discard & Return" button press
    const handleDiscardAndReturn = () => {
        console.log('Discard & Return button pressed');
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                <Button style={styles.buttonContainer} onPress={handleInsertStallImage}>
                    <Text style={styles.buttonText}>Insert Stall Image</Text>
                </Button>
                {stallImage !== '' ? <View style={styles.stallImage} /> : null}
                <TextInput
                    label="Stall Name"
                    value={stallName}
                    onChangeText={setStallName}
                    style={styles.input}
                    accessibilityLabel="Stall Name"
                    placeholder='Stall Name'
                    testID='Stall Name' />
                <TextInput
                    label="Description"
                    autoCapitalize="none"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={styles.input}
                    accessibilityLabel="Description"
                    testID='Description'
                />
                <Text style={styles.label}>What is the location of the stall?</Text>
                <Menu
                    visible={locationMenuVisible}
                    onDismiss={() => setLocationMenuVisible(false)}
                    anchor={
                        <Button testID="location-menu-button" mode="contained" onPress={() => setLocationMenuVisible(true)} style={styles.button}>
                            {selectedLocation ? selectedLocation : 'Select Location'}
                        </Button>
                    }
                >
                    {locations.map((location) => (
                        <Menu.Item key={location.id} onPress={() => handleLocationSelection(location.id)} title={location.name} />
                    ))}
                </Menu>

                <Text style={styles.label}>What is the cuisine?</Text>
                <Menu
                    visible={cuisineMenuVisible}
                    onDismiss={() => setCuisineMenuVisible(false)}
                    anchor={
                        <Button testID="cuisine-menu-button" mode="contained" onPress={() => setCuisineMenuVisible(true)} style={styles.button}>
                            {selectedCuisine ? selectedCuisine : 'Select Cuisine'}
                        </Button>
                    }
                >
                    {cuisines.map((cuisine) => (
                        <Menu.Item key={cuisine.id} onPress={() => handleCuisineSelection(cuisine.id)} title={cuisine.name} />
                    ))}
                </Menu>

                <Text style={styles.label}>Does the stall have air conditioning?</Text>
                <Button testID="has-air-con-button" mode="contained" onPress={() => setHasAirCon(!hasAirCon)} style={styles.button}>
                    {hasAirCon ? 'Yes' : 'No'}
                </Button>
                <Text style={styles.label}>Is the stall halal-certified?</Text>
                <Button testID="is-halal-button" mode="contained" onPress={() => setIsHalal(!isHalal)} style={styles.button}>
                    {isHalal ? 'Yes' : 'No'}
                </Button>
                <Text style={styles.label}>Is the stall vegetarian?</Text>
                <Button testID="is-vegetarian-button" mode="contained" onPress={() => setIsVegetarian(!isVegetarian)} style={styles.button}>
                    {isVegetarian ? 'Yes' : 'No'}
                </Button>
                <Button testID='submit button' onPress={handleSubmit} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Submit / Update Stall Details</Text>
                </Button>
                {loading && <ActivityIndicator style={styles.activityIndicator} />}
                <View style={styles.marginLeftContainer}>
                    <Button testID="discard-return-button" onPress={handleDiscardAndReturn}>
                        <Text style={styles.buttonText}>Discard & Return</Text>
                    </Button>

                </View>
            </ScrollView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginHorizontal: 5,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#FFECF6',
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
    },
    button: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
    },
    buttonText: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginHorizontal: 5,
        marginVertical: 15,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
        fontWeight: 'bold',
    },
    stallImage: {
        width: 200,
        height: 200,
        marginBottom: 15,
        backgroundColor: 'lightgray', // Use a mock background color for the image
    },
    discardContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
        fontWeight: 'bold',
    },
    marginLeftContainer: {
        marginTop: 5,
        marginLeft: 10,
    },
    activityIndicator: {
        marginVertical: 10,
    },
});
