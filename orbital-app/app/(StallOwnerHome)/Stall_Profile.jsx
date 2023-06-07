import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

export default function StallProfilePage() {
    const [stallImage, setStallImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [stallName, setStallName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [hasAirCon, setHasAirCon] = useState(false);
    const [isHalal, setIsHalal] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })
        if (!result.canceled) {
            setStallImage(result.assets[0].uri);
        }
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('StallImage').upload('${new date().getTime()}', { uri: stallImage, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
        }
        const { data, error } = await supabase.storage.from('StallImage').download('folder/StallImage1.png');
        uploadedImage = data;
    };

    const handleLocationSelection = (location) => {
        setSelectedLocation(location);
        setMenuVisible(false);
    };

    const handleSubmit = async () => {
        try {
            const { data, error } = await supabase.from('Stall').insert([
                {
                    stall_image: stallImage,
                    stall_name: stallName,
                    email,
                    password,
                    location,
                    has_air_con: hasAirCon,
                    is_halal: isHalal,
                    is_vegetarian: isVegetarian,

                },
            ]);

            if (error) {
                console.error('Error inserting stall owner:', error.message);
                return;
            }

            console.log('Stall owner inserted successfully:', data);
            setStallImage(null);
            setStallName('');
            setEmail('');
            setPassword('');
            setLocation('');
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
                <Button style={styles.buttons} onPress={handleAddImage}>Insert Stall Image</Button>
                {stallImage && <Image source={{ uri: stallImage }} style={styles.stallImage} />}
                <TextInput
                    label="Stall Name"
                    value={stallName}
                    onChangeText={setStallName}
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                <Text style={styles.label}>What is the location of the stall?</Text>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button
                            mode="contained"
                            onPress={() => setMenuVisible(true)}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >
                            {selectedLocation ? selectedLocation : 'Select Location'}
                        </Button>
                    }
                >
                    <Menu.Item
                        onPress={() => handleLocationSelection('Location 1')}
                        title="Location 1"
                    />
                    <Menu.Item
                        onPress={() => handleLocationSelection('Location 2')}
                        title="Location 2"
                    />
                    {/* Add more Menu.Item components for additional locations */}
                </Menu>
                {selectedLocation && <Text>Selected location: {selectedLocation}</Text>}

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
            </ScrollView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        marginHorizontal: 10,
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
        marginBottom: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
    },
    buttonText: {
        color: '#2C0080',
    },
    buttons: {
        marginHorizontal: 5,
        marginVertical: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
    },
    stallImage: {
        width: 200,
        height: 200,
        marginBottom: 15,
    },
});
