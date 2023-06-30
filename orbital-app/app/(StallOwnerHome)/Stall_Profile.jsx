import { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../contexts/auth";
import { Link, useRouter } from 'expo-router';

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

    useEffect(() => {
        const fetchStallDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('stall')
                    .select('*, location(name), cuisine(name), stallImage')
                    .eq('id', stallId)
                    .single();

                if (error) {
                    console.error('Error retrieving stall details:', error.message);
                    return;
                }
                const stall = data;
                setStallName(stall.name);
                setSelectedLocation(stall.location.name);
                setSelectedCuisine(stall.cuisine.name);
                setHasAirCon(stall.has_air_con);
                setIsHalal(stall.is_halal);
                setIsVegetarian(stall.is_vegetarian);
                setDescription(stall.description);

                if (stall.stallImage) {
                    const { publicURL, error: imageError } = await supabase.storage
                        .from('StallImage')
                        .getPublicUrl(stall.stallImage);

                    if (imageError) {
                        console.error('Error retrieving stall image:', imageError.message);
                        return;
                    }
                    setStallImage(publicURL);
                }
            } catch (error) {
                console.error('Error retrieving stall details:', error.message);
            }
        };
        if (stallId) {
            fetchStallDetails();
        }
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
        fetchLocations();
        fetchCuisines();
    }, [stallId]);

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
        if (!result.canceled) {
            setStallImage(result.assets[0].uri);
        }
    };

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
            const existingStall = await supabase
                .from('stall')
                .select()
                .eq('owner_id', userId)
                .single();
            if (existingStall.data) {
                const { data, error } = await supabase.from('stall').update([
                    {
                        owner_id: userId,
                        stallImage: uploadedImage,
                        name: stallName,
                        location_ID: locationId,
                        cuisine_ID: cuisineId,
                        has_air_con: hasAirCon,
                        is_halal: isHalal,
                        is_vegetarian: isVegetarian,
                        description: description
                    }
                ]).eq('id', existingStall.data.id).single();
                if (error) {
                    console.error('Error updating stall', error.message);
                    return;
                }
                console.log('Stall updated successfully:', data);
            } else {
                const { data, error } = await supabase.from('stall').insert([
                    {
                        owner_id: userId,
                        stallImage: uploadedImage,
                        name: stallName,
                        location_ID: locationId,
                        cuisine_ID: cuisineId,
                        has_air_con: hasAirCon,
                        is_halal: isHalal,
                        is_vegetarian: isVegetarian,
                        description: description
                    }
                ]).select().single();
                if (error) {
                    console.error('Error inserting stall', error.message);
                    return;
                }
                console.log('Stall inserted successfully:', data);
                setStallId(data.id);
            }

            router.push('../(StallOwnerHome)/Home');
            setLoading(false);
        } catch (error) {
            console.error('Error inserting stall owner:', error.message);
        }
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
                <Button onPress={handleSubmit} style={styles.buttonContainer}><Text style={styles.buttonText}>Submit Stall Details</Text></Button>
                {loading && <ActivityIndicator style={styles.ActivityIndicator} />}
                <View style={styles.marginLeftContainer}>
                    <Link href="../(StallOwnerHome)/Home">
                        <Button style={styles.discardContainer}><Text style={styles.buttonText}>Discard & Return</Text></Button>
                    </Link>
                </View>
            </ScrollView>
        </Provider >
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
        marginVertical: 10,
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
