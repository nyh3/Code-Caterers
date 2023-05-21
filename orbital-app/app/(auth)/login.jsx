import { useState } from "react";
import { Image, View } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
import { Link } from 'expo-router';
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('error');
    
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
        const { error } = await supabase.authsignInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            
            <Image 
      /*style={styles.logo} 
      source={require('./assets/logo.png')} *//>

            <Text>Login Page</Text>

            <Text>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            
            <Text>Password</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
            
            <Button onPress={handleSubmit}>Submit</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/register">
                <Button>Go to register</Button>
            </Link>    
        </View>
    );
}
