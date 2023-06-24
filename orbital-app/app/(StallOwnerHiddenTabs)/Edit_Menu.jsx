import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link, useSearchParams } from 'expo-router';
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
    if (!result.cancelled) {
      setImage(result.uri);
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
      <View style={styles.dietaryRestrictionsContainer}>
        <TextInput
          label="Dietary Restrictions"
          value={newDietaryRestriction}
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
              <Text style={styles.removeDietaryRestrictionText}>Remove</Text>
            </Button>
          </View>
        ))}
        <Button mode="contained" onPress={handleAddDietaryRestriction} style={styles.buttonContainer}>
          <Text style={styles.buttons}>Add Restrictions</Text>
        </Button>
      </View>
      <Button onPress={handleSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Submit</Text>
      </Button>
      <Link href="../(StallOwnerHome)/Menu">
        <Button style={styles.buttonContainer}>
          <Text style={styles.buttons}>Discard & Return</Text>
        </Button>
      </Link>
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    marginHorizontal: 10,
    marginTop: 30,
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
  dietaryRestrictionsContainer: {
    marginBottom: 15,
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
});
