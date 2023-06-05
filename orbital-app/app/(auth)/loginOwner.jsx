import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
import { Link } from 'expo-router';
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
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
            setErrMsg('Please provide a valid password.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
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

            <Text style={styles.sign}>Sign In As Owner:</Text>

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
            <View style={styles.container}>
                <Button
                style={styles.buttonContainer}
                onPress={handleSubmit}><Text style={styles.button}>Sign In</Text></Button>
            </View>
                
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <View style={styles.bar}>
                <Link href="/reset"> 
                    <Button style={styles.buttonContainer}><Text style={styles.button}>Forgot Password</Text></Button>
                </Link>
                <Link href="/register">
                    <Button style={styles.buttonContainer}><Text style={styles.button}>Sign Up</Text></Button>
                </Link>    
            </View>
            
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
        padding: 10,
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FFF5FA',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 5,
        borderLeftWidth: 5,
        borderRightWidth: 5,
      },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    }
  });