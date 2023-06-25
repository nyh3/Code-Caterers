import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';

export default function MenuDetailScreen() {
  const menuId = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMenuDetails();
    fetchReviews();
  }, [menuId]);

  const fetchMenuDetails = async () => {
    console.log(menuId);
    try {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('id', menuId.id)
        .single();

      if (error) {
        console.error('Error fetching menu details:', error.message);
        return;
      }
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('review')
        .select('*, profile (username, image)')
        .eq('menu_id', menuId.id);

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError.message);
        return;
      }
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  if (!menu) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleAddReview = (menu) => {
    router.push({ pathname: '/newReview', params: { id: menu } });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: menu.image }} style={styles.image} />
      <Text style={styles.menuName}>{menu.name}</Text>
      <AirbnbRating
        defaultRating={parseFloat(menu.rating) || 0} // Use a default value of 0 if stall.rating is null
        size={30}
        isDisabled
        showRating={false}
        minRating={0} // Set the minimum selectable value to 0
        maxRating={5} // Set the maximum selectable value to 5
      />
      <Text style={styles.price}>Price: ${menu.price}</Text>
      <Text>{menu.description}</Text>
      <View style={styles.dietaryRestrictionsContainer}>
      {menu.dietary_restrictions && menu.dietary_restrictions.length > 0 ? (
        menu.dietary_restrictions.map((restriction, index) => (
          <View style={styles.dietaryRestrictionTag} key={index}>
            <Text style={styles.dietaryRestrictionText}>{restriction}</Text>
          </View>
        ))
      ) : (
        <Text>No dietary restrictions</Text>
      )}
    </View>
      <TouchableOpacity onPress={() => handleAddReview(menu.id)} style={styles.buttonContainer}>
        <Text style={styles.button}>Add Review</Text>
      </TouchableOpacity>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            <Image source={{ uri: item.profile.image }} style={styles.profileImage} />
            <View style={styles.reviewDetails}>
              <Text style={styles.username}>{item.profile.username}</Text>
              <View style={styles.ratingContainer}>
                <AirbnbRating
                  defaultRating={parseFloat(item.rating) || 0}
                  size={15}
                  isDisabled
                  showRating={false}
                  minRating={0}
                  maxRating={5}
                  style={styles.rating}
                />
              </View>
              <Text style={styles.comment}>{item.review_text}</Text>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.reviewImage} />
              )}
              <Text>{item.updated_at}</Text>
            </View>
          </View>
        )}
      />
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
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
  },
  menuName: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity to control the faintness
    paddingBottom: 10, // Add some spacing at the bottom to separate the line from the content
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 35,
  },
  reviewDetails: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
  },
  comment: {
    fontSize: 14,
  },
  reviewImage: {
    width: 70,
    height: 70,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  dietaryRestrictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dietaryRestrictionTag: {
    backgroundColor: '#FFECF6',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  dietaryRestrictionText: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
});
