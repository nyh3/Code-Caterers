import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from 'expo-image-picker';
import { AirbnbRating } from 'react-native-ratings';
import { useSearchParams } from "expo-router";

export default function AddReview() {
    const [ rating, setRating ] = useState(0);
    const [ comment, setComment ] = useState('');
    const [ image, setImage ] = useState([]); 
    const reviewId = useSearchParams();

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            const fileExtension = result.uri.split('.').pop();
            const fileName = `review_${Date.now()}.${fileExtension}`;

            const { data, error } = await supabase.storage
                .from('ReviewImage')
                .upload(fileName, result.uri);

            if (error) {
                console.error('Error uploading image:', error.message);
                return;
            }
            const imageUrl = data[0].url;
            setImage([...image, imageUrl]);
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
        const { data, error } = await supabase
        .from('review')
        .update({
          rating: rating,
          review_text: comment,
          images: image,
        })
        .eq('id', reviewId);
    
        if (error) {
          console.error('Error submitting review:', error.message);
          return;
        }
    
        // Reset form fields
        setRating(0);
        setComment('');
        setImage([]);
    };

    return (
    <View style={styles.container}>
      <Text>Rate:</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={20}
        onFinishRating={handleRatingChange}
      />

      <Text>Comment:</Text>
      <TextInput
        value={comment}
        onChangeText={handleCommentChange}
        multiline
        style={{ height: 100, borderColor: 'gray', borderWidth: 1 }}
      />

      <Button title="Upload Image" onPress={handleAddImage} />

      {image.map((imageUri) => (
        <Image key={imageUri} source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
      ))}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})  