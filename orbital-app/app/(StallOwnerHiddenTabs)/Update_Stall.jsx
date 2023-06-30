//not in use
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { Link } from 'expo-router';

export default function UpdateStall() {
    const [loading, setLoading] = useState(false);
    const [name, setname] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const { userId } = useAuth();
    const router = useRouter();
    const [stallId, setStallId] = useState(null);

    useEffect(() => {
        fetchStallData();
    }, []);

    const fetchStallData = async () => {
        const { data, error } = await supabase
            .from('stall')
            .select('name, description')
            .eq('owner_id', userId)
            .single();

        if (error) {
            console.log('Error fetching stall data:', error);
            return;
        }

        if (data) {
            setStallId(data.id);
            setname(data.name);
            setDescription(data.description);
        }
    };

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        let uploadedImage = null;
        if (image) {
            const { data, error } = await supabase.storage
                .from('StallImage')
                .upload(`${new Date().getTime()}`, {
                    uri: image,
                    type: 'jpg',
                    name: 'name.jpg',
                });

            if (error) {
                console.log('Upload image error:', error);
                setErrMsg(error.message);
                setLoading(false);
                return;
            }

            const { publicUrl } = await supabase.storage
                .from('StallImage')
                .getPublicUrl(data.path);

            uploadedImage = publicUrl;
        }

        const { error } = await supabase
            .from('stall')
            .update({ stallImage: uploadedImage, name, description })
            .eq('id', stallId);

        if (error) {
            console.log('Update stall error:', error);
            setErrMsg(error.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        router.push('../(StallOwnerHome)/Home');
        console.log('Stall Profile updated successfully');
    };

    return (
        <View style={styles.wholeThing}>
            <Button style={styles.buttonContainer} onPress={handleAddImage}>
                <Text style={styles.button}>Change Stall Image</Text>
            </Button>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Text style={styles.bold}>Stall Name:</Text>
            <TextInput
                autoCapitalize="none"
                value={name}
                onChangeText={setname}
                style={styles.input}
            />

            <Text style={styles.bold}>Description:</Text>
            <TextInput
                autoCapitalize="none"
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
            />

            <Button style={styles.buttonContainer} onPress={handleSubmit}>
                <Text style={styles.button}>Update Stall Details</Text>
            </Button>

            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Text></Text>
            <View style={styles.marginLeftContainer}>
                <Link href="../(StallOwnerHome)/Home">
                    <Button style={styles.discardContainer}>
                        <Text style={styles.button}>Discard & Return</Text>
                    </Button>
                </Link>
            </View>
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
    input: {
        marginBottom: 5,
        backgroundColor: '#FFECF6',
    },
});
