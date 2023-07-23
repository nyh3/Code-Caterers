import { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, ActivityIndicator, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Component for adding promotions.
 *
 * @returns {JSX.Element} The JSX element representing the PromotionForm component.
 */
export default function PromotionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  /**
   * Handles adding an image from the device's image library.
   */
  const handleAddImage = async () => {
    // Mocked function since image picker is removed for testing purposes
    setImage('mocked_image_uri');
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
   * Handles the submission of the promotion form.
   */
  const handleSubmit = async () => {
    setErrMsg('');
    if (title === '') {
      setErrMsg('Promotion title cannot be empty.');
      return;
    }
    if (endDate === null) {
      setErrMsg('There must be an end date.');
      return;
    }
    if (endDate < startDate) {
      setErrMsg('End date cannot be before start date');
      return;
    }
    setLoading(true);
    // Mocked function for image upload and promotion submission since supabase is removed for testing purposes
    setLoading(false);
    console.log('Promotion added successfully');
    setTitle('');
    setDescription('');
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
      <Text style={styles.heading}>Add Promotions:</Text>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        multiline
        style={styles.input}
        accessibilityLabel="Title"
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
        accessibilityLabel="Description"
      />

      <Text style={styles.warning}>Please remember to include both a start and end date.</Text>
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
        <Text style={styles.buttons}>Submit</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
      {loading && <ActivityIndicator style={styles.indicator} />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    justifyContent: 'flex-start',
    padding: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFECF6',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginHorizontal: 5,
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
  buttons: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    marginBottom: 10,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
});
