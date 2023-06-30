import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link, useSearchParams } from 'expo-router';
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'

export default function EditMenuPage() {
  const promotionId = useSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [originalImage, setOriginalImage] = useState(null);

  useEffect(() => {
    fetchMenuItem();
  }, []);

  const fetchMenuItem = async () => {
    try {
      const { data, error } = await supabase
        .from('promotion')
        .select('*')
        .eq('id', promotionId.id)
        .single();

      if (error) {
        console.error('Error fetching promotion item:', error.message);
        return;
      }

      setTitle(data.title);
      setDescription(data.description);
      setOriginalImage(data.image);
    } catch (error) {
      console.error('Error fetching promotion item:', error.message);
    }
  };

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    setErrMsg('');
    if (title === '') {
      setErrMsg('Promotion title cannot be empty')
      return;
    }
    setLoading(true);
    let uploadedImage = originalImage;
    if (image !== null) {
      const { data, error } = await supabase.storage
        .from('PromotionImage')
        .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message)
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('PromotionImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }

    const { data, error } = await supabase.from('promotion').update({
      title: title,
      image: uploadedImage,
      description: description,
    })
    .eq('id', promotionId.id)
    .single();

    if (error != null) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    router.push('/Promotions');
    console.log('Promotion item updated successfully:', data);
  };

  const handleDelete = async () => {
    try {
      await supabase
        .from('promotion')
        .delete()
        .eq('id', promotionId.id);
  
      router.push('/Promotions');
    } catch (error) {
      console.error('Error deleting promotion item:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Promotion:</Text>
      <TextInput
        label="Name"
        value={title}
        onChangeText={setTitle}
        multiline
        style={styles.input}
      />
      <Button style={styles.buttonContainer} onPress={handleAddImage}>
        <Text style={styles.buttons}>Change Image</Text>
      </Button>
      {originalImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: originalImage }} style={styles.image} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      )}
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />
      <Button onPress={handleSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Submit</Text>
      </Button>
      <Button onPress={handleDelete} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Delete</Text>
      </Button>
      <Link href="/Promotions">
        <Button style={styles.buttonContainer}>
          <Text style={styles.buttons}>Discard & Return</Text>
        </Button>
      </Link>
      {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFECF6',
  },
  buttons: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    color: '#2C0080',
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
});
