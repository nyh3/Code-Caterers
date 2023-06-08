import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function PromotionForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleSubmit = async () => {
        setErrMsg('');
        if (title === '') {
            setErrMsg('Promotion title cannot be empty');
            return;
        }
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('PromotionImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('PromotionImage').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }
        const { data, error } = await supabase.from('Promotion').insert({ image: uploadedImage, title: title, description: description, }).select().single();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }

        setLoading(false);
        router.push('(StallOwnerHome)/Add_Promotions');
        console.log('Promotion added successfully:', data);
        setTitle('');
        setDescription('');

        if (error) {
            console.error('Error inserting menu item:', error.message);
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Promotion:</Text>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={handleAddImage}>
                <Text style={styles.buttons}>Add Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button onPress={handleSubmit} style={styles.button}>Submit</Button>
            {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
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
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
        marginHorizontal: 5,
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
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});
