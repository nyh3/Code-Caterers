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
    const [ rating, setRating ] = useState(0);
    const [ comment, setComment ] = useState('');
    const [ image, setImage ] = useState(''); 
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
        router.push({ pathname: '/menuDetails', params: { id: menuId.id} });
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

      <Button title="Upload Image" onPress={handleAddImage} style={styles.buttonContainer}/>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Submit" onPress={handleSubmit} style={styles.buttonContainer}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        marginHorizontal: 5,
        marginBottom: 10,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
        color: '#2C0080',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 15,
    },
})  