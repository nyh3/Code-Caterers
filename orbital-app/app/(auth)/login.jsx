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
            setErrMsg('email cannot be empty');
            return;
        }
        if (password == '') {
            setErrMsg('password cannot be empty');
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

            <Text style={styles.sign}>Sign In</Text>

            <Text style={styles.bold}>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            
            <Text style={styles.bold}>Password</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
            <View style={styles.container}>
                <Button onPress={handleSubmit}>Log In</Button>
            </View>
                
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <View style={styles.bar}>
                <Link href="/reset"> 
                    <Button>Forgot Password</Button>
                </Link>
                <Link href="/register">
                    <Button>Sign Up</Button>
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
    },
    sign: {
        fontWeight: 'bold',
        fontSize: 34,
    },
    bold: {
        fontWeight: 'bold',
    },
    container: {
        padding:10,
        /*backgroundColor: '#A020F0',*/
    },
    wholeThing: {
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
  });
