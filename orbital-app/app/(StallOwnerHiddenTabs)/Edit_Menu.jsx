import { useState, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useSearchParams } from 'expo-router';
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'

export default function EditMenuPage() {
  const menuId = useSearchParams();
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  useEffect(() => {
    fetchMenuItem();
  }, []);

  const fetchMenuItem = async () => {
    try {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('id', menuId.id)
        .single();

      if (error) {
        console.error('Error fetching menu item:', error.message);
        return;
      }

      setName(data.name);
      setDescription(data.description);
      setPrice(data.price.toString());
      setOriginalImage(data.image);
      setDietaryRestrictions(data.dietary_restrictions || []);
    } catch (error) {
      console.error('Error fetching menu item:', error.message);
    }
  };

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setErrMsg('');
    if (name === '') {
      setErrMsg('Dish name cannot be empty')
      return;
    }
    setLoading(true);
    let uploadedImage = originalImage;
    if (image !== null) {
      const { data, error } = await supabase.storage
        .from('MenuImage')
        .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message)
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('MenuImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }

    const { data, error } = await supabase.from('menu').update({
      name: name,
      image: uploadedImage,
      description: description,
      price: parseFloat(price),
      dietary_restrictions: dietaryRestrictions,
    }).eq('id', menuId.id).single();

    if (error != null) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    router.push('../(StallOwnerHome)/Menu');
    console.log('Menu item updated successfully:', data);
  };

  const handleDelete = async () => {
    try {
      await supabase
        .from('menu')
        .delete()
        .eq('id', menuId.id);
  
      router.push('../(StallOwnerHome)/Menu');
    } catch (error) {
      console.error('Error deleting menu item:', error.message);
    }
  };

  const handleAddDietaryRestriction = () => {
    if (newDietaryRestriction.trim() === '') return;
    setDietaryRestrictions(prevRestrictions => [...prevRestrictions, newDietaryRestriction]);
    setNewDietaryRestriction('');
  };

  const handleRemoveDietaryRestriction = (restriction) => {
    setDietaryRestrictions(prevRestrictions =>
      prevRestrictions.filter(item => item !== restriction)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
      <Text style={styles.heading}>Edit Menu:</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
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
      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.warning}>Note: Do not put halal and vegetarian as dietary restrictions</Text>
      <View style={styles.dietaryRestrictionsContainer}>
        <TextInput
          label="Dietary Restrictions"
          value={newDietaryRestriction}
          autoCapitalize="characters"
          onChangeText={setNewDietaryRestriction}
          style={styles.input}
        />
        {dietaryRestrictions.map((restriction, index) => (
          <View style={styles.dietaryRestrictionItem} key={index}>
            <Text style={styles.dietaryRestrictionText}>{restriction}</Text>
            <Button
              mode="text"
              onPress={() => handleRemoveDietaryRestriction(restriction)}
              style={styles.removeDietaryRestrictionButton}
            >
              <Text style={styles.removeDietaryRestrictionText}>Delete</Text>
            </Button>
          </View>
        ))}
        <Button mode="contained" onPress={handleAddDietaryRestriction} style={styles.buttonContainer2}>
          <Text style={styles.buttons}>Add Restrictions</Text>
        </Button>
      </View>
      <Button onPress={handleSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Submit & Update Menu</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.warning}>{errMsg}</Text>}
      <Button onPress={handleDelete} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Delete Menu</Text>
      </Button>
      {loading && <ActivityIndicator style={styles.indicator} />}
    </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 15,
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
  buttonContainer2: {
    marginHorizontal: 0,
    marginBottom: 10,
    marginTop: 5,
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
  dietaryRestrictionsContainer: {
    marginTop: 0,
  },
  dietaryRestrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FFECF6',
    height: 40,
  },
  dietaryRestrictionText: {
    fontSize: 15,
    color: 'black',
  },
  removeDietaryRestrictionButton: {
    backgroundColor: 'transparent',
  },
  removeDietaryRestrictionText: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  warning: {
    color: 'red',
    margin: 0,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
},
});
