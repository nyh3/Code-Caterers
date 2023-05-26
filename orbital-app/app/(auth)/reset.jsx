import { useState } from "react";
import { View } from "react-native";
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
        <View>
            <Text>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
                
            {errMsg !== "" && <Text>{errMsg}</Text>}
            <Button onPress={handleSubmit}>Send email</Button>
        </View>
    )
}