import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

/**
 * Component for updating user profile information.
 * @param {object} props - Component props.
 * @param {Function} props.onProfileUpdate - Callback function for updating the profile.
 * @returns {JSX.Element} The UpdateProfile component.
 */
export default function UpdateProfile({ onProfileUpdate }) {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleUsernameChange = (value) => {
        setUsername(value);
        setErrMsg('');
    };

    const handleSubmit = async () => {
        if (username.trim() === '') {
            setErrMsg('Username cannot be empty');
            return;
        }

        setLoading(true);

        const updateResult = { success: true };

        setLoading(false);

        if (updateResult.success) {
            onProfileUpdate({ username });
        } else {
            setErrMsg('Error updating profile. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.wholeThing}>
            <Text style={styles.bold}>Username:</Text>
            <TextInput
                autoCapitalize='none'
                value={username}
                onChangeText={handleUsernameChange}
                style={styles.input}
                testID='username-input'
            />

            <Button style={styles.buttonContainer} onPress={handleSubmit}>
                <Text style={styles.button}>Update Profile</Text>
            </Button>

            {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator style={styles.indicator} />}
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
        backgroundColor: '#FFECF6',
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
