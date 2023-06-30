import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';

export default function ViewReviewScreen() {
  const reviewId = useSearchParams();
  const [review, setReview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchReviewDetails();
  }, []);

  const fetchReviewDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select('*, profile (username, image)')
        .eq('id', reviewId.id)
        .single();

      if (error) {
        console.error('Error fetching review details:', error.message);
        return;
      }
      console.log('help', data);
      setReview(data);
    } catch (error) {
      console.error('Error fetching review details:', error.message);
    }
  };

  if (!review) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: review.profile.image }} style={styles.profileImage} />
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
        />
        <Text style={styles.comment}>{review.review_text}</Text>
        {review.image && <Image source={{ uri: review.image }} style={styles.reviewImage} />}
        <Text>{review.updated_at}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  reviewDetails: {
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});
