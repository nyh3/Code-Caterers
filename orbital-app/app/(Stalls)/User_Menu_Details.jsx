import { ScrollView, View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth'
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component for displaying the details of a menu item from the user's perspective.
 */
export default function UserMenuDetailScreen() {
  const menuId = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState(null);
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    fetchMenuDetails();
    fetchReviews();
  }, [menuId]);

  /**
   * Fetches the details of the menu item from the database.
   */
  const fetchMenuDetails = async () => {
    try {
      const [menuData, savedData] = await Promise.all([
        supabase
          .from('menu')
          .select('*')
          .eq('id', menuId.id)
          .single(),
        supabase
          .from('profile')
          .select('menu_id')
          .eq('id', userId)
          .single(),
      ]);

      if (menuData.error) {
        console.error('Error fetching menu details:', menuData.error.message);
        return;
      }

      setMenu(menuData.data);

      if (savedData.error) {
        console.error('Error fetching saved status:', savedData.error.message);
        return;
      }

      const savedMenuIds = savedData.data?.menu_id || [];
      setIsSaved(savedMenuIds.includes(menuId.id));
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  /**
   * Toggles the saved status of the menu item.
   */
  const handleSaveToggle = async () => {
    try {
      const savedMenuIds = await supabase
        .from('profile')
        .select('menu_id')
        .eq('id', userId)
        .single();

      let updatedMenuIds = savedMenuIds.data?.menu_id || [];

      if (isSaved) {
        updatedMenuIds = updatedMenuIds.filter((id) => id !== menuId.id);
      } else {
        updatedMenuIds.push(menuId.id);
      }
      await supabase
        .from('profile')
        .update({ menu_id: updatedMenuIds })
        .eq('id', userId);

      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving/unsaving menu:', error.message);
    }
  };

  /**
   * Fetches the reviews for the menu item from the database.
   */
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
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * Handles the press event for adding a review.
   * @param {string} menuId - The ID of the menu item.
   */
  const handleAddReview = (menuId) => {
    router.push({ pathname: '/newReview', params: { id: menuId } });
  };

  /**
   * Handles the press event for viewing a review.
   * @param {string} reviewId - The ID of the review.
   */
  const handleReviewPress = (reviewId) => {
    router.push({ pathname: '/reviewDetails', params: { id: reviewId } });
  };


  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleSaveToggle} style={styles.heartButton}>
        <Ionicons
          name={isSaved ? 'heart' : 'heart-outline'}
          size={24}
          color={isSaved ? '#FF84A8' : 'black'}
        />
      </TouchableOpacity>
      <Image source={{ uri: menu.image }} style={styles.image} />
      <Text style={styles.menuName}>{menu.name}</Text>
      <AirbnbRating
        defaultRating={parseFloat(menu.rating) || 0}
        size={30}
        isDisabled
        showRating={false}
        minRating={0}
        maxRating={5}
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
          <TouchableOpacity onPress={() => handleReviewPress(item.id)}>
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
                <Text style={styles.comment}>{item.updated_at}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    //justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginTop: 15,
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
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft: 100,
  },
  rating: {
    marginLeft: 5,
  },
  comment: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewImage: {
    width: 70,
    height: 70,
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FF6699',
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
  heartButton: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  flatListContent: {
    paddingBottom: 50, // Adjust this value based on your layout
},
});
