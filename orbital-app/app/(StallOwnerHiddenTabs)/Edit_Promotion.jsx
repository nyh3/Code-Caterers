import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useSearchParams } from 'expo-router';
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Component for editing a promotion item.
 *
 * @returns {JSX.Element} The JSX element representing the EditPromotionPage component.
 */
export default function EditPromotionPage() {
  const promotionId = useSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      setStartDate(new Date(data.start_date));
      if (data.end_date) {
        setEndDate(new Date(data.end_date));
      } else {
        setEndDate(null);
      }
    } catch (error) {
      console.error('Error fetching promotion item:', error.message);
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
   * Handles the submission of the edited promotion item form.
   */
  const handleSubmit = async () => {
    setErrMsg('');
    if (title === '') {
      setErrMsg('Promotion title cannot be empty')
      return;
    }
    if (endDate === null) {
      setErrMsg('End date cannot be null');
      return;
    }
    if (endDate < startDate) {
      setErrMsg('End date cannot be before start date');
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
      start_date: startDate,
      end_date: endDate,
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

  /**
   * Handles deleting the promotion item.
   */
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
      <Button onPress={() => setShowStartDatePicker(true)} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Start Date: {formatDate(startDate)}</Text>
      </Button>
      {showStartDatePicker && (
        <DateTimePicker
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
  }
});
