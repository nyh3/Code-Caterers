import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Image } from 'react-native'
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/auth'

export default function UpdateStall() {
    const [loading, setLoading] = useState(false);
    const [name, setname] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState('');
    const { id } = useAuth();
    const router = useRouter();

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('stallImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            console.log('stall:', id);
            const { data: { publicUrl } } = supabase.storage.from('stallImage').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }
        const { data, error } = await supabase.from('Stall').update({ image: uploadedImage, name: name }).eq('id', id);
        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }
        setLoading(false);
        router.push('../(StallOwnerHome)/Home');
        console.log('Menu item inserted successfully:', data);
    }

    return (
        <View style={styles.wholeThing}>

            <Button style={styles.buttonContainer} onPress={handleAddImage}><Text style={styles.button}>Change Stall Image</Text></Button>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Text style={styles.bold}>Stall Name:</Text>
            <TextInput
                autoCapitalize='none'
                value={name}
                onChangeText={setname} />

            <Button
                style={styles.buttonContainer}
                onPress={handleSubmit}><Text style={styles.button}>Update Stall Details</Text></Button>

            {errMsg !== "" && <Text>{errMsg}</Text>}
            <Text></Text>
            {loading && <ActivityIndicator />}
        </View>
    );
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
        fontSize: 15,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 5,
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FFF5FA',
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        marginTop: 20,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
    image: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30,
        borderRadius: 100,
    }
});