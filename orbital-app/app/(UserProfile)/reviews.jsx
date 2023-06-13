import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

export default function ReviewsPage() {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const { data, error} = await supabase
        .from('review')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user reviews:', error.message);
        return;
      }

      setReviews(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user reviews:', error.message);
    }
  };

  const handleEditReview = (reviewId) => {
    router.push({ pathname: '/editReview', params: { id: reviewId } });
  };

  const reviewedReviews = reviews.filter(review => review.rating !== null);
  const nullReviews = reviews.filter(review => review.rating === null);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEditReview(item.id)} style={styles.reviewItem}>
      <View>
        <Text style={styles.rating}>Rating: {item.rating}</Text>
        <Text style={styles.comment}>Comment: {item.review_text}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {nullReviews.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Null Reviews</Text>
              {nullReviews.map(review => (
                <View style={styles.nullReviewItem} key={review.id}>
                  <Text style={styles.nullReviewText}>You have not reviewed this item yet</Text>
                  <Button onPress={() => handleEditReview(review.id)}>Edit Review</Button>
                </View>
              ))}
            </View>
          ) : null}
          {reviewedReviews.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Reviewed Reviews</Text>
              <FlatList
                data={reviewedReviews}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 16,
  },
  nullReviewItem: {
    marginBottom: 20,
  },
  nullReviewText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
});