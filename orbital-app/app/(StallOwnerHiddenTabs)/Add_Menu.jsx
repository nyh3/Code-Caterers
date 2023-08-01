import { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

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
 * Component for adding a menu item.
 *
 * @returns {JSX.Element} The JSX element representing the AddMenuPage component.
 */
export default function AddMenuPage() {
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { userId } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stall, setStall] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  useEffect(() => {
    fetchStallId();
  }, []);

  /**
   * Fetches the stall ID associated with the logged-in user.
   */
  const fetchStallId = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('id')
        .eq('owner_id', userId)
        .single();

      if (error) {
        console.error('Error fetching stall ID:', error.message);
        return;
      }

      setStall(data);
    } catch (error) {
      console.error('Error fetching stall ID:', error.message);
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
   * Handles the submission of the menu item form.
   */
  const handleSubmit = async () => {
    setErrMsg('');
    if (name === '') {
      setErrMsg('Dish name cannot be empty')
      return;
    }
    setLoading(true);
    let uploadedImage = 'https://tkkkeagmqcijtmriflss.supabase.co/storage/v1/object/public/MenuImage/Menu_default.png?t=2023-08-01T08%3A37%3A05.755Z';
    if (image != null) {
      const { data, error } = await supabase.storage.from('MenuImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message)
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('MenuImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }
    console.log(stall);
    const { data, error } = await supabase
      .from('menu')
      .insert({
        name: name,
        image: uploadedImage,
        description: description,
        price: parseFloat(price),
        stall_id: stall.id,
        dietary_restrictions: dietaryRestrictions,
      })
      .select()
      .single();

    if (error != null) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    router.push('../(StallOwnerHome)/Menu');
    console.log('Menu item inserted successfully:', data);
    setName('');
    setDescription('');
    setPrice('');

    if (error) {
      console.error('Error inserting menu item:', error.message);
      return;
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
        <Text style={styles.heading}>Add Menu:</Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button style={styles.buttonContainer} onPress={handleAddImage}>
          <Text style={styles.buttons}>Add Image</Text>
        </Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
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
        <Text style={styles.heading}>Dietary Restrictions:</Text>
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
          <Text style={styles.buttons}>Submit</Text>
        </Button>
        {errMsg !== '' && <Text style={styles.warning}>{errMsg}</Text>}
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
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    marginTop: 5,
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
    padding: 10,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  selectedGridItem: {
    backgroundColor: '#FFD9E8',
  },
});
