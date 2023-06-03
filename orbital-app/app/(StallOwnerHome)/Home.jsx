import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from 'expo-router';
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
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
        <View style={styles.container}>
            <Button style={styles.buttons} onPress={handleAddImage}>Insert Profile Image</Button>
           <Link href="(StallOwnerHome)/Edit_Profile">
                <Button style={styles.buttons}>Edit Profile</Button>
            </Link>   
            <Link href="(StallOwnerHome)/Add_Promotions">
                <Button style={styles.buttons}>Add Promotions</Button>
            </Link>
            <Link href="(StallOwnerHome)/Reviews">
                <Button style={styles.buttons}>Reviews</Button>
            </Link>
            <Button style={styles.buttons} onPress={() => supabase.auth.signOut()}>Log out</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF5FA',
      justifyContent: 'flex-start',
      marginHorizontal: 10,
    },
    profilephoto: {
      width: 200,
      height: 200,
      alignItems: 'center',
    },
    buttons: {
        marginHorizontal: 5,
        marginVertical: 5,
        color: '#2C0080',
    }
  });