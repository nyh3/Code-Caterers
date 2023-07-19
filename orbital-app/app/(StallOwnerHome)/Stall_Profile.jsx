import { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../contexts/auth";
import { useRouter } from 'expo-router';

export default function StallProfilePage() {
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
    const { userId } = useAuth();
    const router = useRouter();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchStallDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('stall')
                    .select('*, location(name), cuisine(name)')
                    .eq('owner_id', userId)
                    .single();

                if (error) {
                    console.error('Error retrieving stall details:', error.message);
                    return;
                }

                const stall = data;
                setStallId(stall.id);
                setStallName(stall.name);
                setSelectedLocation(stall.location.name);
                setSelectedCuisine(stall.cuisine.name);
                setHasAirCon(stall.has_air_con);
                setIsHalal(stall.is_halal);
                setIsVegetarian(stall.is_vegetarian);
                setDescription(stall.description);
                setStallImage(stall.stallImage);
                setLocationId(stall.location_ID);
                setCuisineId(stall.cuisine_ID);
            } catch (error) {
                console.error('Error retrieving stall details:', error.message);
            }
        };

        fetchStallDetails();
        fetchLocations();
        fetchCuisines();
        setRefresh(false);
    }, [refresh]);

    /**
     * Fetches the list of locations
     */
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

    /**
     * Fetches the list of cuisines
     */
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

    /**
     * Handles the selection of an image from the gallery
     */
    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
        if (!result.canceled) {
            setStallImage(result.assets[0].uri);
        }
    };

    /**
     * Handles the selection of a location
     * 
     * @param {string} locationId - The ID of the selected location
     */
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

    /**
     * Handles the selection of a cuisine
     * 
     * @param {string} cuisineId - The ID of the selected cuisine
     */
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

    /**
     * Handles the submission of the stall details
     */
    const handleSubmit = async () => {
        setLoading(true);
        let uploadedImage = null;
        if (stallImage !== null) {
            const { data, error } = await supabase.storage
                .from('StallImage')
                .upload(`${new Date().getTime()}`, { uri: stallImage, type: 'jpg', name: 'name.jpg' });
            if (error !== null) {
                console.log(error);
                setErrMsg(error.message);
                setLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('StallImage').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }

        try {
            // Check if record already exists
            const { data: existingStall, error: selectError } = await supabase
                .from('stall')
                .select()
                .eq('owner_id', userId)
                .single();

            if (existingStall) {
                // Update existing record
                const { data: updatedStall, error: updateError } = await supabase
                    .from('stall')
                    .update({
                        stallImage: uploadedImage,
                        name: stallName,
                        has_air_con: hasAirCon,
                        is_halal: isHalal,
                        is_vegetarian: isVegetarian,
                        description: description,
                        location_ID: locationId,
                        cuisine_ID: cuisineId,
                    })
                    .eq('id', existingStall.id)
                    .single();

                if (updateError) {
                    console.error('Error updating stall:', updateError.message);
                    setLoading(false);
                    return;
                }

                console.log('Stall updated successfully:', updatedStall);
            } else {
                // Insert new record
                const { data: insertedStall, error: insertError } = await supabase
                    .from('stall')
                    .insert({
                        owner_id: userId,
                        stallImage: uploadedImage,
                        name: stallName,
                        has_air_con: hasAirCon,
                        is_halal: isHalal,
                        is_vegetarian: isVegetarian,
                        description: description,
                        location_ID: locationId,
                        cuisine_ID: cuisineId,
                    })
                    .single();

                if (insertError) {
                    console.error('Error inserting stall:', insertError.message);
                    setLoading(false);
                    return;
                }

                console.log('Stall inserted successfully:', insertedStall);
            }

            router.push('../(StallOwnerHome)/Home');
            setLoading(false);
        } catch (error) {
            console.error('Error upserting stall:', error.message);
            setLoading(false);
        }
    };

    // Function to handle the "Discard & Return" button press
    const handleDiscardAndReturn = () => {
        setRefresh(true);
        router.push({ pathname: '../(StallOwnerHome)/Home' });
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                <Button style={styles.buttonContainer} onPress={handleAddImage}>
                    <Text style={styles.buttonText}>Insert Stall Image</Text>
                </Button>
                {stallImage !== '' ? (
                    <Image source={{ uri: stallImage }} style={styles.stallImage} />
                ) : (
                    null
                )}
                <TextInput
                    label="Stall Name"
                    value={stallName}
                    onChangeText={setStallName}
                    style={styles.input}
                />
                <TextInput
                    label="Description"
                    autoCapitalize='none'
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={styles.input}
                />
                <Text style={styles.label}>What is the location of the stall?</Text>
                <Menu
                    visible={locationMenuVisible}
                    onDismiss={() => setLocationMenuVisible(false)}
                    anchor={
                        <Button
                            mode="contained"
                            onPress={() => setLocationMenuVisible(true)}
                            style={styles.button}
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

                <Text style={styles.label}>What is the cuisine?</Text>
                <Menu
                    visible={cuisineMenuVisible}
                    onDismiss={() => setCuisineMenuVisible(false)}
                    anchor={
                        <Button
                            mode="contained"
                            onPress={() => setCuisineMenuVisible(true)}
                            style={styles.button}
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

                <Text style={styles.label}>Does the stall have air conditioning?</Text>
                <Button
                    mode="contained"
                    onPress={() => setHasAirCon(!hasAirCon)}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    {hasAirCon ? 'Yes' : 'No'}
                </Button>
                <Text style={styles.label}>Is the stall halal-certified?</Text>
                <Button
                    mode="contained"
                    onPress={() => setIsHalal(!isHalal)}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    {isHalal ? 'Yes' : 'No'}
                </Button>
                <Text style={styles.label}>Is the stall vegetarian?</Text>
                <Button
                    mode="contained"
                    onPress={() => setIsVegetarian(!isVegetarian)}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    {isVegetarian ? 'Yes' : 'No'}
                </Button>
                <Button onPress={handleSubmit} style={styles.buttonContainer}><Text style={styles.buttonText}>Submit / Update Stall Details</Text></Button>
                {loading && <ActivityIndicator style={styles.ActivityIndicator} />}
                <View style={styles.marginLeftContainer}>
                    <Button style={styles.discardContainer} onPress={handleDiscardAndReturn}><Text style={styles.buttonText}>Discard & Return</Text></Button>
                </View>
            </ScrollView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        paddingHorizontal: 10
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginHorizontal: 5
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#FFECF6'
    },
    label: {
        fontSize: 15,
        marginBottom: 5
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
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginHorizontal: 5,
        marginVertical: 15,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
        fontWeight: 'bold'
    },
    stallImage: {
        width: 200,
        height: 200,
        marginBottom: 15
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
    ActivityIndicator: {
        marginVertical: 10,
    }
});
