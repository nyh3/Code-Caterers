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
        const { error } = await supabase.auth.signUp({ email, password });
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

            <Text style={styles.register}>Register:</Text>

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
            
            <Button onPress={handleSubmit}><Text style={styles.button}>Verify email to sign in</Text></Button>
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
        padding:10,
    },
    wholeThing: {
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        backgroundColor: '#FFECF6',
    },
    button: {
        color: '#000000',
        fontWeight: 'bold',
        marginVertical: 10,
    }
  });