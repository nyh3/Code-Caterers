import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { AirbnbRating } from "react-native-ratings";
import { useIsFocused } from "@react-navigation/native";

export default function ReviewsPage() {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    fetchUserReviews();
  }, [isFocused]);

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select('*, menu ( name, stall ( name ) )')
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEditReview(item.id)} style={styles.reviewItem}>
      <View>
        <Text style={styles.menuItem}>{item.menu.name}, {item.menu.stall.name}</Text>
        <AirbnbRating
          defaultRating={parseFloat(item.rating) || 0}
          size={15}
          isDisabled
          showRating={false}
          minRating={0}
          maxRating={5}
          style={styles.rating}
        />
        <Text style={styles.comment}>{item.review_text}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.reviewImage} />
        )}
      </View>
      <Text>{item.updated_at}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {reviews.length > 0 ? (
            <FlatList
              data={reviews}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Text style={styles.noReviews}>User has not written any reviews.</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  reviewItem: {
    backgroundColor: '#FFECF6',
    padding: 15,
    borderColor: '#FFF5FA',
    borderWidth: 5,
    borderRadius: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 16,
  },
  reviewImage: {
    width: 70,
    height: 70,
    marginVertical: 10,
  },
  menuItem: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  noReviews: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
  },
});
