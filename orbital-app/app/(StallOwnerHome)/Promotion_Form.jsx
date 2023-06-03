import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

export default function PromotionForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            let uploadedImage = null;
            if (image != null) {
                const { data, error } = await supabase.storage
                    .from('ProfileImage')
                    .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

                if (error != null) {
                    console.log(error);
                    setErrMsg(error.message);
                    setLoading(false);
                    return;
                }
            }

            // TODO: Submit the form data to the server or perform other actions
            console.log('Title:', title);
            console.log('Description:', description);
            console.log('Image:', image);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setErrMsg(error.message);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Promotions:</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity style={styles.buttonContainer} onPress={handleAddImage}>
                    <Text style={styles.buttons}>Add Image</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttons}>Save & Add Promotion</Text>
            </TouchableOpacity>
            {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
        marginHorizontal: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#FFBBDF',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
        marginHorizontal: 5,
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
    buttons: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
});

