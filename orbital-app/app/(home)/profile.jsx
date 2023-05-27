import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile() {
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('ProfileImage').upload('${new date().getTime()}', { uri: image, type:'jpg', name: 'name.jpg'});

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
        }
        const { data, error } = await supabase.storage.from('ProfileImage').download('folder/ProfileImage1.png');
        uploadedImage = data;

    }

    return (
        <View>
            <Button onPress={handleAddImage}>Insert Profile Image</Button>
           <Link href="../(UserProfile)/restrictions">
                <Button>Dietary Restrictions</Button>
            </Link>   
            <Link href="../(UserProfile)/promotions">
                <Button>Promotions</Button>
            </Link>
            <Link href="../(UserProfile)/reviews">
                <Button>Reviews</Button>
            </Link>
            <Link href="../(UserProfile)/saved">
                <Button>Saved</Button>
            </Link> 
            <Button onPress={() => supabase.auth.signOut()}>Log out</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 200,
      height: 200,
    },
  });