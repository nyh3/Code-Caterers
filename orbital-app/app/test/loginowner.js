import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        if (email.trim() === '') {
            setErrMsg('Please provide a valid email address.');
            return;
        }
        if (password === '') {
            setErrMsg('Please provide a valid password.');
            return;
        }
        setLoading(true);
        setErrMsg('');
        setLoading(false);
        // Handle successful login here if needed
    }

    return (
        <View style={styles.wholeThing}>
            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />

            <Text style={styles.sign}>Stall Owner Sign In:</Text>

            <Text style={styles.bold}>Email:</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                testID="emailInput"
            />

            <Text style={styles.bold}>Password:</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                testID="passwordInput"
            />
            {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
            <View style={styles.container}>
                <Button
                    style={[styles.buttonContainer, { alignSelf: 'center' }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.button}>Sign In</Text>
                </Button>
            </View>
            {loading && <ActivityIndicator style={styles.indicator} />}
            <Text style={styles.text}>Don't have an account? Create an account below.</Text>
            <View style={styles.container}>
                <Button
                    style={[styles.buttonContainer, { alignSelf: 'center' }]}
                    onPress={() => {
                    }}
                >
                    <Text style={styles.button}>Sign Up</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Styles remain unchanged
});
