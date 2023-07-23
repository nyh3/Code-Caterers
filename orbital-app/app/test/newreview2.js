import { useState } from "react";
import { ScrollView, Image, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { AirbnbRating } from 'react-native-ratings';

export default function AddReview() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);

    /**
     * Handle adding an image from the device's image library
     */
    const handleAddImage = async () => {
        setImage('https://example.com/test-image.jpg');
    }

    /**
     * Handle the change in rating value
     */
    const handleRatingChange = (value) => {
        setRating(value);
    };

    /**
     * Handle the change in comment text
     */
    const handleCommentChange = (text) => {
        setComment(text);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Ratings:</Text>
            <AirbnbRating
                count={5}
                defaultRating={rating}
                size={20}
                onFinishRating={handleRatingChange}
                testID="rating-stars"
            />
            <Button onPress={handleAddImage} style={styles.buttonContainer}><Text style={styles.button}>Upload Image</Text></Button>
            {image && <Image source={{ uri: image }} style={styles.image} testID="uploaded-image" />} { }
            <Text style={styles.heading}>Comments:</Text>
            <TextInput
                value={comment}
                onChangeText={handleCommentChange}
                multiline
                style={styles.input}
                testID="comment-input"
            />
            <Button onPress={() => { }} style={styles.buttonContainer}><Text style={styles.button}>Submit</Text></Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
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
});
