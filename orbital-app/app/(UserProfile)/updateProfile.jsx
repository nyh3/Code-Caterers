import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Image } from 'react-native'
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/auth'

/**
 * Component for updating user profile information.
 * @returns {JSX.Element} The UpdateProfile component.
 */
export default function UpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [image, setImage] = useState('');
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  /**
   * Fetches user data from the database.
   */
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('profile').select('username, image').eq('id', userId).single();
      if (error) {
        console.error(error);
        setErrMsg(error.message);
      } else if (data) {
        setUsername(data.username);
        setImage(data.image);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrMsg(error.message);
      setLoading(false);
    }
  };

  /**
   * Handles the change event of the username input.
   * @param {string} value - The new value of the username.
   */
  const handleUsernameChange = (value) => {
    setUsername(value);
    setErrMsg('');
  }

  /**
   * Handles adding an image from the device's image library.
   */
  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  /**
   * Handles the form submission for updating the user profile.
   */
  const handleSubmit = async () => {
    if (username.trim() === '') {
      setErrMsg('Username cannot be empty');
      return;
    }

    setLoading(true);
    let uploadedImage = null;
    if (image != null) {
      const { data, error } = await supabase.storage
        .from('ProfileImage')
        .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message)
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ProfileImage')
        .getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }

    const { data, error } = await supabase
      .from('profile')
      .update({ image: uploadedImage, username: username })
      .eq('id', userId);

    if (error != null) {
      setLoading(false);
      console.log(error);
      if (error.message.includes('duplicate key value violates unique constraint')) {
        setErrMsg('Username taken');
      } else {
        setErrMsg(error.message);
      }
      return;
    }

    setLoading(false);
    router.push('../(home)/profile');
    console.log('Profile updated successfully:', data);
  }

  return (
    <View style={styles.wholeThing}>

      <Button style={styles.buttonContainer} onPress={handleAddImage}><Text style={styles.button}>Change Profile Image</Text></Button>
      {image !== '' ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      <Text style={styles.bold}>Username:</Text>
      <TextInput
        autoCapitalize='none'
        value={username}
        onChangeText={handleUsernameChange}
        style={styles.input}
      />

      <Button
        style={styles.buttonContainer}
        onPress={handleSubmit}><Text style={styles.button}>Update Profile</Text></Button>

      {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
      {loading && <ActivityIndicator style={styles.indicator} />}
    </View >
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  wholeThing: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFF5FA',
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#FFECF6'
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 100,
  },
  placeholderImage: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginVertical: 30,
    borderRadius: 100,
    backgroundColor: 'lightgray',
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 25,
  },
  error: {
    color: 'red',
    marginTop: 15,
    marginHorizontal: 15,
  },
});
