import { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

export default function ViewReviewScreen() {
  const [review] = useState({
    profile: { username: 'User1', image: 'https://example.com/user1.jpg' },
    rating: '4.5',
    review_text: 'Good menu item!',
    image: 'https://example.com/review1.jpg',
    updated_at: '2023-07-23',
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: review.profile.image }} style={styles.profileImage} testID="profile-image" />
      <View style={styles.reviewDetails}>
        <Text style={styles.username}>{review.profile.username}</Text>
        <AirbnbRating
          defaultRating={parseFloat(review.rating) || 0}
          size={30}
          isDisabled
          showRating={false}
          minRating={0}
          maxRating={5}
          style={styles.rating}
          testID="rating-stars"
        />
        <Text style={styles.comment}>{review.review_text}</Text>
        {review.image && <Image source={{ uri: review.image }} style={styles.reviewImage} testID="review-image" />}
        <Text style={styles.comment2} testID="updated-at">
          {review.updated_at}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  reviewDetails: {
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
  },
  comment: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  comment2: {
    fontSize: 16,
    marginVertical: 10,
  },
  reviewImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});
