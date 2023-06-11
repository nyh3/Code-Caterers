import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Image } from 'react-native'
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/auth'

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [image, setImage] = useState('');
  const { userId } = useAuth();
  const router = useRouter();

  const handleAddImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
      if (!result.canceled) {
          setImage(result.assets[0].uri);
      }
  }

  const handleSubmit = async () => {
    setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('ProfileImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            console.log('user:', userId);
            const { data: { publicUrl } } = supabase.storage.from('ProfileImage').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        }
        const { data, error } = await supabase.from('profile').update({ image: uploadedImage, username: username }).eq('id', userId);
        if (error != null) {
          setLoading(false);
          console.log(error);
          setErrMsg(error.message);
          return;
      }
      setLoading(false);
        router.push('../(home)/profile');
        console.log('Menu item inserted successfully:', data);
  }

  return (
    <View style={styles.wholeThing}>

        <Button style={styles.buttonContainer} onPress={handleAddImage}><Text style={styles.buttons}>Change Profile Picture</Text></Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        
        <Text style={styles.bold}>Username:</Text>
        <TextInput
            secureTextEntry
            autoCapitalize='none'
            value={username}
            onChangeText={setUsername} />
      
        <Button
        style={styles.buttonContainer}
        onPress={handleSubmit}><Text style={styles.button}>Update Profile</Text></Button>
            
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 15,
  }
});