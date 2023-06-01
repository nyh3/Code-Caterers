import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as Linking from 'expo-linking';

export default function reset() {
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const redirectUrl = Linking.createURL('/password-reset');
        
    const handleSubmit = async() => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });
        if(error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style={styles.wholeThing}>
             <Image 
            style={styles.logo} 
            source={require('../../assets/logo.png')} />

            <Text style={styles.word}>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
                
            {errMsg !== "" && <Text>{errMsg}</Text>}
            <Button onPress={handleSubmit}><Text style={styles.button}>Send Password Reset Email</Text></Button>
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
        wholeThing: {
            justifyContent: 'flex-start',
            flexDirection: 'column',
            backgroundColor: '#FFF5FA',
            flex: 1,
        }, 
        button: {
            color: '#000000',
            fontWeight: 'bold',
            marginVertical: 10,
        },
        word: {
            fontWeight: 'bold',
            margin: 0,
            marginHorizontal: 15,
            marginTop: 10,
            marginBottom: 3,
        }
    });