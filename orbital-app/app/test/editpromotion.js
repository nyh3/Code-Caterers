import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Component for editing a promotion item.
 *
 * @returns {JSX.Element} The JSX element representing the EditPromotionPage component.
 */
export default function EditPromotionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showClearEndDateButton, setShowClearEndDateButton] = useState(false);

  useEffect(() => {
    fetchPromotionItem();
  }, []);

  /**
   * Fetches the promotion item to be edited.
   */
  const fetchPromotionItem = async () => {
    // Simulated data for testing purposes, replace with actual data retrieval logic
    const promotionItem = {
      title: 'Sample Promotion',
      description: 'This is a sample promotion.',
      image: null, // Provide the URL or path of the original image here
      start_date: new Date(),
      end_date: null,
    };

    setTitle(promotionItem.title);
    setDescription(promotionItem.description);
    setOriginalImage(promotionItem.image);
    setStartDate(new Date(promotionItem.start_date));
    if (promotionItem.end_date) {
      setEndDate(new Date(promotionItem.end_date));
    } else {
      setEndDate(null);
    }
  };

  /**
   * Handles adding an image from the device's image library.
   */
  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  /**
   * Handles the submission of the edited promotion item form.
   */
  const handleSubmit = async () => {
    setErrMsg('');
    if (title === '') {
      setErrMsg('Promotion title cannot be empty');
      return;
    }
    if (endDate === null) {
      setErrMsg('End date cannot be null');
      return;
    }
    if (endDate < startDate) {
      setErrMsg('End date cannot be before the start date');
      return;
    }
    setLoading(true);

    try {
      // Call the updatePromotionAPI function with the necessary arguments
      const response = await updatePromotionAPI({
        id: mockPromotionItem.id, // Replace with the actual promotion item ID
        title,
        description,
        image,
        start_date: startDate,
        end_date: endDate,
      });

      if (response.success) {
        setLoading(false);
        // Perform any necessary actions after successful update, such as navigating back to the promotion list page
        // For example, you can use 'router.push' or any other navigation method that suits your project setup
        console.log('Promotion item updated successfully');
      } else {
        setLoading(false);
        setErrMsg('Failed to update promotion item. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setErrMsg('An error occurred while updating the promotion item. Please try again.');
    }
  };

  /**
   * Handles deleting the promotion item.
   */
  const handleDelete = async () => {
    // Implement the deletion logic here
    // For example, using an API call to delete the promotion item from the server/database
    // And then navigate back to the promotion list page
    console.log('Promotion item deleted successfully');
  };

  /**
   * Formats the date to a string in the format "dd/mm/yy".
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (date) => {
    if (!date) {
      return 'No end date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  /**
   * Handles the change of the end date in the date picker.
   *
   * @param {Event} event - The event object.
   * @param {Date} date - The selected date.
   */
  const handleEndDateChange = (event, date) => {
    setShowEndDatePicker(false);
    if (date) {
      setEndDate(date);
      setErrMsg('');
    }
  };

  /**
   * Handles the change of the start date in the date picker.
   *
   * @param {Event} event - The event object.
   * @param {Date} date - The selected date.
   */
  const handleStartDateChange = (event, date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(date);
      setErrMsg('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Promotion:</Text>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        multiline
        style={styles.input}
        accessibilityLabel="Title"
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
      <Button onPress={() => setShowStartDatePicker(true)} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Start Date: {formatDate(startDate)}</Text>
      </Button>
      {showStartDatePicker && (
        <DateTimePicker
          testID="datetimepicker"
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Button onPress={() => setShowEndDatePicker(true)} style={styles.buttonContainer}>
        <Text style={styles.buttons}>End Date: {endDate !== null ? formatDate(endDate) : 'No end date'}</Text>
      </Button>
      {showEndDatePicker && (
        <DateTimePicker
          testID="datetimepicker"
          value={endDate !== null ? endDate : new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <Button onPress={handleSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Submit & Update Promotion</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
      <Button onPress={handleDelete} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Delete Promotion</Text>
      </Button>
      {loading && <ActivityIndicator style={styles.indicator} />}
    </View>
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
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  text: {
    marginVertical: 40,
    marginRight: 20,
  },
});
