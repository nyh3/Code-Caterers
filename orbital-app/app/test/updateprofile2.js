import { useState } from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function UpdateProfile() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState('');

    const handleUsernameChange = (value) => {
        setUsername(value);
        setErrMsg('');
    };

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (username.trim() === '') {
            setErrMsg('Username cannot be empty');
            return;
        }

        setLoading(true);
        setLoading(false);
    };

    return (
        <ScrollView style={styles.wholeThing}>
            <Button style={styles.buttonContainer} onPress={handleAddImage}><Text style={styles.button}>Change Profile Image</Text></Button>
            {image !== '' ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <View style={styles.placeholderImage} />
            )}

            <Text style={styles.bold}>Username:</Text>
            <TextInput
                autoCapitalize="none"
                value={username}
                onChangeText={handleUsernameChange}
                style={styles.input}
                placeholder="Username"
            />

            <Button style={styles.buttonContainer} onPress={handleSubmit}><Text style={styles.button}>Update Profile</Text></Button>

            {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
    },
    wholeThing: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FFF5FA',
        paddingHorizontal: 10,
    },
    input: {
        marginBottom: 5,
        backgroundColor: '#FFECF6'
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        marginTop: 20,
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
        marginTop: 30,
        marginBottom: 20,
        borderRadius: 100,
    },
    placeholderImage: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30,
        borderRadius: 100,
        backgroundColor: 'lightgray',
    },
    indicator: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 25,
    },
    error: {
        color: 'red',
        marginTop: 15,
        marginHorizontal: 15,
    },
});
