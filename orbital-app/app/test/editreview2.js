import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for editing and submitting a review.
 * @returns {JSX.Element} The EditReview component.
 */
export default function EditReview() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);

    /**
     * Handles the addition of an image from the device's library.
     */
    const handleAddImage = async () => {
        setImage('https://example.com/image1.jpg');
    };

    /**
     * Handles the submission of the review.
     */
    const handleSubmit = async () => {
        console.log('Review Submitted:', {
            rating,
            comment,
            image,
        });
        setRating(0);
        setComment('');
        setImage(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Ratings:</Text>
            <AirbnbRating
                count={5}
                defaultRating={rating}
                size={20}
                onFinishRating={setRating}
            />
            <Button onPress={handleAddImage} style={styles.buttonContainer}>
                <Text style={styles.button}>Change Image</Text>
            </Button>
            <TextInput
                value={comment}
                onChangeText={setComment}
                multiline
                style={styles.input}
                placeholder="Enter your comment..."
                testID="comment-input"
            />
            <Button onPress={handleSubmit} style={styles.buttonContainer}>
                <Text style={styles.button}>Update & Submit Review</Text>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: 5,
    },
    heading2: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    heading3: {
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
    deleteContainer: {
        marginBottom: 35,
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        borderColor: '#FFBBDF',
    },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
    existingImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    newImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
});
