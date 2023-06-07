import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'

export default function AddMenuPage() {
    const [name, setName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const { user } = useAuth();
    const router = useRouter();
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleSubmit = async () => {
        setErrMsg('');
        if (name === '') {
            setErrMsg('Dish name cannot be empty')
            return;
        }
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('images').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }
        const { data, error } = await supabase.from('Menu').insert({ name: name, image_url: uploadedImage, description: description, price: parseFloat(price), }).select().single();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }

        setLoading(false);
        router.push('/');
        console.log('Menu item inserted successfully:', data);
        setName('');
        setDescription('');
        setPrice('');

        if (error) {
            console.error('Error inserting menu item:', error.message);
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Menu Item:</Text>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Button style={styles.button} onPress={handleAddImage}>Add Image</Button>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <TextInput
                label="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button onPress={handleSubmit} style={styles.button}>Submit</Button>
            {loading && <ActivityIndicator />}
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
    input: {
        marginBottom: 15,
        backgroundColor: '#FFECF6',
    },
    button: {
        marginHorizontal: 5,
        marginBottom: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 15,
    },
});