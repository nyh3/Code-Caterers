import { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

export default function EditOwnerProfilePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        if (email === '') {
            setErrMsg('Please provide a valid email address.');
            return;
        }
        if (password === '') {
            setErrMsg('Please provide a valid password.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.update({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
        setErrMsg('Profile updated successfully!');
    };

    return (
        <View style={styles.wholeThing}>
            <Image style={styles.logo} source={require('../../assets/logo.png')} />

            <Text style={styles.sign}>Edit Profile:</Text>

            <Text style={styles.bold}>Edit Email:</Text>
            <TextInput
                autoCapitalize="none"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.bold}>Edit Password:</Text>
            <TextInput
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.container}>
                <Button style={styles.buttonContainer} onPress={handleSubmit}>
                    <Text style={styles.button}>Save Changes</Text>
                </Button>
            </View>

            {errMsg !== '' && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30,
    },
    sign: {
        fontWeight: 'bold',
        fontSize: 30,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
    bold: {
        fontWeight: 'bold',
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 3,
    },
    container: {
        padding: 10,
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#FFF5FA',
        flex: 1,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 5,
        marginTop: 5,
    },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
});
