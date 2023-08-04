import { useState, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useSearchParams } from 'expo-router';
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'

const restrictionIcons = {
  CHICKEN: '🍗',
  PORK: '🥓',
  BEEF: '🥩',
  LAMB: '🐑',
  FISH: '🐟',
  SHELLFISH: '🦀',
  DAIRY: '🥛',
  EGGS: '🥚',
  PEANUTS: '🥜',
  GLUTEN: '🌾',
  SOY: '🍱',
  SPICY: '🌶️',
};

/**
 * Component for editing a menu item.
 *
 * @returns {JSX.Element} The JSX element representing the EditMenuPage component.
 */
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

  useEffect(() => {
    fetchMenuItem();
  }, []);

  /**
   * Fetches the menu item to be edited.
   */
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

  /**
   * Handles adding an image from the device's image library.
   */
  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /**
   * Handles the submission of the edited menu item form.
   */
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

  /**
   * Handles deleting the menu item.
   */
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

  // Function to render each dietary restriction as a grid item
  const renderDietaryRestrictionItem = (restriction) => (
    <TouchableOpacity
      key={restriction}
      style={[
        styles.restrictionContainer,
        dietaryRestrictions.includes(restriction) && styles.selectedGridItem,
      ]}
      onPress={() => handleToggleRestriction(restriction)}
    >
      <View style={styles.restrictionIconContainer}>
        <Text style={styles.restrictionIcon}>{restrictionIcons[restriction]}</Text>
      </View>
      <Text style={styles.restrictionText}>{restriction}</Text>
    </TouchableOpacity>
  );

  const gridItemWidth = `${(100 / 3).toFixed(2)}%`;
  const spacingBetweenItems = 5;

  /**
  * Handles the addition and removal of a dietary restriction.
  * @param {string} restriction - The dietary restriction to be toggled.
  */
  const handleToggleRestriction = (restriction) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions((prev) => prev.filter((r) => r !== restriction));
    } else {
      setDietaryRestrictions((prev) => [...prev, restriction]);
    }
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
            {image && (
              <Text style={styles.text}> will change to: </Text>)}
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
        <Text style={styles.heading2}>Dietary Restrictions:</Text>
        <View style={styles.gridContainer}>
          {Object.keys(restrictionIcons).map((restriction) => (
            <View
              key={restriction}
              style={{ width: gridItemWidth, marginBottom: spacingBetweenItems }}
            >
              {renderDietaryRestrictionItem(restriction)}
            </View>
          ))}
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
  heading2: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
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
  restrictionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: '#FFF5FA',
    borderRadius: 30,
    padding: 10,
    height: 100,
  },
  restrictionIconContainer: {
    borderRadius: 20,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  restrictionIcon: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
  },
  restrictionText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  warning: {
    color: 'red',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  warning2: {
    color: 'red',
    marginBottom: 15,
    marginHorizontal: 5,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
  text: {
    marginVertical: 40,
    marginRight: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  selectedGridItem: {
    backgroundColor: '#FFD9E8',
  },
});
