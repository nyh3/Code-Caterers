import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from 'expo-image-picker';
import { AirbnbRating } from 'react-native-ratings';
import { useSearchParams, useRouter } from "expo-router";

export default function EditReview() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const reviewId = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchReviewData();
  }, []);

  const fetchReviewData = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select('*, menu ( name, stall ( name ) )')
        .eq('id', reviewId.id)
        .single();

      if (error) {
        console.error('Error fetching review data:', error.message);
        return;
      }

      if (data) {
        setInfo(data);
        setRating(data.rating);
        setComment(data.review_text);
        setExistingImages(data.image ? [data.image] : []);
      }
    } catch (error) {
      console.error('Error fetching review data:', error.message);
    }
  };

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleSubmit = async () => {
    // Submit the review to Supabase
    let uploadedImage = null;
    if (image != null) {
      const { data, error } = await supabase.storage
        .from('ReviewImage')
        .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });
  
      if (error != null) {
        console.log(error);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('ReviewImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }
  
    let reviewUpdate = {
      rating: rating,
      review_text: comment,
    };
  
    if (uploadedImage !== null) {
      reviewUpdate.image = uploadedImage;
    }
  
    const { data, error } = await supabase
      .from('review')
      .update(reviewUpdate)
      .eq('id', reviewId.id);
  
    if (error) {
      console.error('Error submitting review:', error.message);
      return;
    }
  
    // Reset form fields
    setRating(0);
    setComment('');
    setImage(null);
    setInfo(null);
    router.push('reviews');
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from('review')
      .delete()
      .eq('id', reviewId.id);
  
    if (error) {
      console.error('Error deleting review:', error.message);
      return;
    }
  
    // Reset form fields
    setRating(0);
    setComment('');
    setImage(null);
    setInfo(null);
    router.push('reviews');
  };
  
  return (
    <View style={styles.container}>
      {info && info.menu && (
        <Text style={styles.heading2}>{info.menu.name} from {info.menu.stall.name}</Text>
      )}
      <Text style={styles.heading}>Ratings:</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={20}
        onFinishRating={setRating}
      />
      <Button onPress={handleAddImage} style={styles.buttonContainer}><Text style={styles.button}>Change Image</Text></Button>
      {existingImages.map((imageUri) => (
        <Image key={imageUri} source={{ uri: imageUri }} style={styles.existingImage} />
      ))}
      {image && <Image source={{ uri: image }} style={styles.newImage} />}
      <Text style={styles.heading}>Comments:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />
      <Button onPress={handleSubmit} style={styles.buttonContainer}><Text style={styles.button}>Submit</Text></Button>
      <Button onPress={handleDelete} style={styles.buttonContainer}><Text style={styles.button}>Delete</Text></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  heading2: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFECF6',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#FFBBDF',
    borderRadius: 2,
    fontSize: 15,
  },
  buttonContainer: {
    marginVertical: 20,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  existingImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  newImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
});
