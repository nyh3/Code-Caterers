import { useState } from "react";
import { Image, View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as Linking from 'expo-linking';

export default function Reset() {
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            if (!email) {
                setErrMsg("Please enter your email for reset.");
                return;
            }

            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `https://nyh3.github.io/resetpassword`
            });
            setLoading(false);

            if (error) {
                setErrMsg(error.message);
            } else {
                const redirectUrl = Linking.createURL('/password-reset');
                console.log('redirectUrl:', redirectUrl);
                console.log('email:', email);
                Linking.openURL(`${redirectUrl}?email=${email}`);
            }
        } catch (error) {
            setLoading(false);
            setErrMsg(error.message);
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        setErrMsg(""); // Clear the error message when email changes
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={handleEmailChange}
            />
            {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#2C0080" style={styles.loadingIndicator} />
            ) : (
                <Button style={styles.buttonContainer} onPress={handleSubmit}>
                    <Text style={styles.button}>Send Password Reset Email</Text>
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#FFF5FA',
        flex: 1,
        padding: 10
    },
    logo: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30,
    },
    label: {
        fontWeight: 'bold',
        margin: 0,
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 3,
    },
    error: {
        marginTop: 10,
        marginHorizontal: 5,
        color: 'red',
    },
    loadingIndicator: {
        marginTop: 15,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 5,
        marginTop: 15,
    },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
        marginVertical: 10,
    },
});