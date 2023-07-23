import { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker'

/**
 * Component for editing a menu item.
 *
 * @returns {JSX.Element} The JSX element representing the EditMenuPage component.
 */
export default function EditMenuPage() {
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

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
      // Code to handle image upload (you can add your implementation here)
    }

    // Code to handle menu item update (you can add your implementation here)

    setLoading(false);
    console.log('Menu item updated successfully');
  };

  /**
   * Handles deleting the menu item.
   */
  const handleDelete = async () => {
    // Code to handle menu item deletion (you can add your implementation here)

    console.log('Menu item deleted successfully');
  };

  /**
 * Handles adding a dietary restriction.
 */
  const handleAddDietaryRestriction = () => {
    if (newDietaryRestriction !== '') {
      if (newDietaryRestriction.trim() === '') return;

      const normalizedRestriction = newDietaryRestriction.trim().toUpperCase();

      // Check for duplicate restrictions
      if (dietaryRestrictions.includes(normalizedRestriction)) {
        setErrMsg('This restriction has already been added.');
        return;
      }

      // Check for "halal" and "vegetarian" restrictions
      const restrictedRestrictions = ['HALAL', 'VEGETARIAN'];
      if (restrictedRestrictions.includes(normalizedRestriction)) {
        setErrMsg('Adding HALAL or VEGETARIAN as a restriction is not allowed.');
        return;
      }

      const updatedRestrictions = [...dietaryRestrictions, normalizedRestriction];
      setDietaryRestrictions(updatedRestrictions);
      setNewDietaryRestriction('');
      setErrMsg(''); // Clear the error message when adding a new restriction
    }
  };

  /**
   * Handles removing a dietary restriction.
   *
   * @param {string} restriction - The dietary restriction to be removed.
   */
  const handleRemoveDietaryRestriction = (restriction) => {
    setDietaryRestrictions(prevRestrictions =>
      prevRestrictions.filter(item => item !== restriction)
    );
  };

  /**
   * Handles the input change in the Dietary Restrictions TextInput.
   * @param {string} text - The input text value.
   */
  const handleInputChange = (text) => {
    setNewDietaryRestriction(text);
    setErrMsg(''); // Clear the error message when text changes
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
          accessibilityLabel="Name"
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
          accessibilityLabel="Description"
        />
        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
          accessibilityLabel="Price"
        />
        <Text style={styles.warning}>Note: Do not put halal and vegetarian as dietary restrictions</Text>
        <Text style={styles.warning2}>Currently, we only take into account fish, shellfish, lamb, beef, pork, chicken, eggs, diary, gluten, soy, peanuts.</Text>
        <View style={styles.dietaryRestrictionsContainer}>
          <TextInput
            label="Dietary Restrictions"
            value={newDietaryRestriction}
            onChangeText={handleInputChange}
            style={styles.input}
            accessibilityLabel="Dietary Restrictions"
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
  }
});
