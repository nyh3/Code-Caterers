import { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { supabase } from '../../lib/supabase';
import { useAuth } from "../../contexts/auth";
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ReviewPage() {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [menuReviewsVisibility, setMenuReviewsVisibility] = useState({});
  const [menu, setMenu] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchStallId();
  }, []);

  /**
   * Fetches the stall ID for the current user
   */
  const fetchStallId = async () => {
    const { data, error } = await supabase
      .from('stall')
      .select('id, rating')
      .eq('owner_id', userId)
      .single();

    if (!error) {
      const stallId = data.id;
      const rating = data.rating;
      setOverallRating(rating);
      fetchMenuId(stallId);
    }
  };

  /**
   * Fetches the menu ID for a given stall ID
   * 
   * @param {string} stallId - The ID of the stall
   */
  const fetchMenuId = async (stallId) => {
    const { data, error } = await supabase
      .from('menu')
      .select('id, name, image, rating')
      .eq('stall_id', stallId);

    if (!error) {
      const menuData = data.reduce((acc, menu) => {
        acc[menu.id] = { id: menu.id, name: menu.name, image: menu.image, rating: menu.rating };
        return acc;
      }, {});
      fetchReviewId(Object.keys(menuData));
      setMenu(menuData);
    }
  };

  /**
   * Fetches the review ID for a given menu ID
   * 
   * @param {Array} menuId - The IDs of the menu items
   */
  const fetchReviewId = async (menuId) => {
    const { data, error } = await supabase
      .from('review')
      .select('*, profile (username, image)')
      .in('menu_id', menuId);

    if (!error) {
      setReviews(data);
    }
  };

  /**
   * Toggles the visibility of menu reviews
   * 
   * @param {string} menuId - The ID of the menu
   */
  const toggleMenuReviewsVisibility = (menuId) => {
    setMenuReviewsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [menuId]: !prevVisibility[menuId],
    }));
  };

  /**
   * Handles the press event for a review
   * 
   * @param {string} review - The ID of the review
   */
  const handleReviewPress = (review) => {
    router.push({ pathname: '/View_Review', params: { id: review } });
  };

  /**
   * Renders the reviews for a menu
   * 
   * @param {string} menuId - The ID of the menu
   * @returns {JSX.Element|null} - The rendered menu reviews or null if not visible
   */
  const renderMenuReviews = (menuId) => {
    const isVisible = menuReviewsVisibility[menuId];

    if (isVisible) {
      const menuReviews = reviews.filter((review) => review.menu_id === menuId);

      if (menuReviews.length === 0) {
        return (
          <View style={styles.noReviewsContainer}>
            <Text style={styles.noReviewsText}>No reviews have been given.</Text>
          </View>
        );
      }

      return (
        <View>
          {menuReviews.map((review) => (
            <TouchableOpacity key={`${menuId}-${review.id}`} onPress={() => handleReviewPress(review.id)}>
              <View style={styles.reviewContainer}>
                <View style={styles.userContainer}>
                  <Image source={{ uri: review.profile.image }} style={styles.profileImage} />
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{review.profile.username}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <AirbnbRating
                    defaultRating={parseFloat(review.rating) || 0}
                    size={15}
                    isDisabled
                    showRating={false}
                    minRating={0}
                    maxRating={5}
                    style={styles.rating}
                  />
                </View>
                <Text style={styles.comment}>{review.review_text}</Text>
                {review.image && (
                  <Image source={{ uri: review.image }} style={styles.reviewImage} />
                )}
                <Text style={styles.comment}>{review.updated_at}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer2}>
        <AirbnbRating
          defaultRating={parseFloat(overallRating) || 0} // Use a default value of 0 if stall.rating is null
          size={30}
          isDisabled
          showRating={false}
          minRating={0} // Set the minimum selectable value to 0
          maxRating={5} // Set the maximum selectable value to 5
        />
      </View>
      <FlatList
        data={Object.values(menu)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleMenuReviewsVisibility(item.id)}>
            <View style={styles.dropdownHeader}>
              <View style={styles.menuItem}>
                <View style={styles.menuInfo}>
                  <Image source={{ uri: item.image }} style={styles.menuImage} />
                  <Text style={styles.menuName}>{item.name}</Text>
                  <AirbnbRating
                    defaultRating={parseFloat(item.rating) || 0}
                    size={15}
                    isDisabled
                    showRating={false}
                    minRating={0}
                    maxRating={5}
                  />
                </View>
                <Ionicons
                  name={menuReviewsVisibility[item.id] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="black"
                />
              </View>
            </View>
            {renderMenuReviews(item.id)}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 15,
  },
  rating: {
    fontWeight: 'bold',
    fontSize: 17,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 10,
  },
  normal: {
    fontSize: 15,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 35,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    marginHorizontal: 140,
  },
  ratingContainer2: {
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: 'column',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    marginHorizontal: 10,
    marginTop: 5,
  },
  reviewImage: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  menuImage: {
    width: 40,
    height: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FDEEF7',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noReviewsContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  noReviewsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
});
