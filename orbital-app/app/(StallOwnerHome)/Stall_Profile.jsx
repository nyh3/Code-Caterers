import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../contexts/auth";

export default function StallProfilePage() {
    const [stallImage, setStallImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
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
    const { userId } = useAuth();

    useEffect(() => {
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
    }, []);

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
            const { data, error } = await supabase.from('Stall').insert([
                {
                    owner_id: userId,
                    stallImage: uploadedImage,
                    name: stallName,
                    location_ID: locationId,
                    cuisine_ID: cuisineId,
                    has_air_con: hasAirCon,
                    is_halal: isHalal,
                    is_vegetarian: isVegetarian
                }
            ]).select().single();

            if (error) {
                console.error('Error inserting stall owner:', error.message);
                return;
            }

            console.log('Stall owner inserted successfully:', data);
            setStallImage(null);
            setStallName('');
            setSelectedLocation('');
            setSelectedCuisine('');
            setHasAirCon(false);
            setIsHalal(false);
            setIsVegetarian(false);
        } catch (error) {
            console.error('Error inserting stall owner:', error.message);
        }
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                <Text style={styles.heading}>Stall Profile</Text>
                <Button style={styles.buttons} onPress={handleAddImage}>
                    Insert Stall Image
                </Button>
                {stallImage && (
                    <Image source={{ uri: stallImage }} style={styles.stallImage} />
                )}
                <TextInput
                    label="Stall Name"
                    value={stallName}
                    onChangeText={setStallName}
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
                <Button onPress={handleSubmit} style={styles.button}>Submit</Button>
                {loading && <ActivityIndicator />}
            </ScrollView>
        </Provider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        marginHorizontal: 10
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
        color: '#2C0080'
    },
    buttonText: {
        color: '#2C0080'
    },
    buttons: {
        marginHorizontal: 5,
        marginVertical: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080'
    },
    stallImage: {
        width: 200,
        height: 200,
        marginBottom: 15
    },
});
