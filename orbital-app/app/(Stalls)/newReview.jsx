import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from 'expo-image-picker';
import { AirbnbRating } from 'react-native-ratings';
import { useSearchParams } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

export default function AddReview() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState('');
  const menuId = useSearchParams();
  const userId = useAuth();
  const router = useRouter();

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleSubmit = async () => {
    // Submit the review to Supabase
    console.log(menuId);
    console.log(menuId.id);
    console.log(userId.userId);
    const { data, error } = await supabase
      .from('review')
      .insert({
        rating: rating,
        review_text: comment,
        image: image,
        menu_id: menuId.id,
        user_id: userId.userId,
      });
    if (error) {
      console.error('Error submitting review:', error.message);
      return;
    }

    // Reset form fields
    setRating(0);
    setComment('');
    setImage('');
    router.push({ pathname: '/menuDetails', params: { id: menuId.id } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ratings:</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={20}
        onFinishRating={handleRatingChange}
      />
      <Button onPress={handleAddImage} style={styles.buttonContainer}><Text style={styles.button}>Upload Image</Text></Button>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.heading}>Comments:</Text>
      <TextInput
        value={comment}
        onChangeText={handleCommentChange}
        multiline
        style={styles.input}
      />
      <Button onPress={handleSubmit} style={styles.buttonContainer}><Text style={styles.button}>Submit</Text></Button>
    </View>
  )
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
})  