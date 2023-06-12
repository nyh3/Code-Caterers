import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from 'expo-router';
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'

export default function AddMenuPage() {
    const [name, setName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const { userId } = useAuth();
    const router = useRouter();
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stall, setStall] = useState(null);

    useEffect(() => {
        fetchStallId();
      }, []);
    
      const fetchStallId = async () => {
        try {
          const { data, error } = await supabase
            .from('Stall')
            .select('id')
            .eq('owner_id', userId)
            .single();
    
          if (error) {
            console.error('Error fetching stall ID:', error.message);
            return;
          }
    
          setStall(data);
        } catch (error) {
          console.error('Error fetching stall ID:', error.message);
        }
      };

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
            const { data, error } = await supabase.storage.from('MenuImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('MenuImage').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }
        console.log(stall);
        const { data, error } = await supabase.from('Menu').insert({ name: name, image: uploadedImage, description: description, price: parseFloat(price), stall_id: stall.id}).select().single();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }

        setLoading(false);
        router.push('../(StallOwnerHome)/Menu');
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
            <Text style={styles.heading}>Add Menu:</Text>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Button style={styles.buttonContainer} onPress={handleAddImage}><Text style={styles.buttons}>Add Image</Text></Button>
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
            <Button onPress={handleSubmit} style={styles.buttonContainer}><Text style={styles.buttons}>Submit</Text></Button>
            <Link href="../(StallOwnerHome)/Menu">
            <Button style={styles.buttonContainer}><Text style={styles.buttons}>Discard & Return</Text></Button>
            </Link>
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
        marginTop: 30,
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
    buttons: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
    buttonContainer: {
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