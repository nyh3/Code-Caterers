import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg('Please provide a valid email address.');
            return;
        }
        if (password == '') {
            setErrMsg('Please provide a valid email password.');
            return;
        }
        setLoading(true);
        setErrMsg('');
        const { error } = await supabase.auth.signUp({ 
            email: email, 
            password: password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }

    }
    return (
        <View style={styles.wholeThing}>
            
            <Image 
            style={styles.logo} 
            source={require('../../assets/logo.png')} />

            <Text style={styles.register}>Register As User:</Text>

            <Text style={styles.bold}>Email:</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            
            <Text style={styles.bold}>Password:</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
            <Button style={styles.buttonContainer} onPress={handleSubmit}><Text style={styles.button}>Verify email to sign in</Text></Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
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
    register: {
        fontWeight: 'bold',
        fontSize: 34,
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
        padding:15,
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
        marginTop: 15,
      },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    }
  });