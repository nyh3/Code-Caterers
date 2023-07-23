import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from "@expo/vector-icons";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [menuReviewsVisibility, setMenuReviewsVisibility] = useState({});
  const [menu, setMenu] = useState([]);
  const [overallRating, setOverallRating] = useState(0);

  useEffect(() => {
    // Simulate fetching stall ID and data
    const stallData = {
      id: '123',
      rating: 4.5,
    };
    setOverallRating(stallData.rating);
    fetchMenuData(stallData.id);
  }, []);

  const fetchMenuData = (stallId) => {
    // Simulate fetching menu data
    const menuData = [
      {
        id: 'menu1',
        name: 'Menu 1',
        image: 'https://example.com/menu1.jpg',
        rating: 4.2,
      },
      {
        id: 'menu2',
        name: 'Menu 2',
        image: 'https://example.com/menu2.jpg',
        rating: 4.7,
      },
      // Add more menu items here
    ];
    setMenu(menuData.reduce((acc, menu) => {
      acc[menu.id] = { ...menu };
      return acc;
    }, {}));
    fetchReviewsData(menuData.map(menu => menu.id));
  };

  const fetchReviewsData = (menuIds) => {
    // Simulate fetching reviews data
    const reviewsData = [
      {
        id: 'review1',
        menu_id: 'menu1',
        profile: {
          username: 'User1',
          image: 'https://example.com/user1.jpg',
        },
        rating: 4,
        review_text: 'This is a great menu item!',
        image: 'https://example.com/review1.jpg',
        updated_at: '2023-07-22',
      },
      {
        id: 'review2',
        menu_id: 'menu1',
        profile: {
          username: 'User2',
          image: 'https://example.com/user2.jpg',
        },
        rating: 3.5,
        review_text: 'Average menu item.',
        updated_at: '2023-07-21',
      },
      // Add more reviews here
    ];
    setReviews(reviewsData);
  };

  const toggleMenuReviewsVisibility = (menuId) => {
    setMenuReviewsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [menuId]: !prevVisibility[menuId],
    }));
  };

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
                    testID="overall-rating"
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
          defaultRating={parseFloat(overallRating) || 0}
          size={30}
          isDisabled
          showRating={false}
          minRating={0}
          maxRating={5}
        />
      </View>
      <FlatList
        data={Object.values(menu)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleMenuReviewsVisibility(item.id)}
            testID={`toggle-reviews-${item.id}`} // Add testID for each menu item toggle
          >
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
                    testID={`menu-rating-${item.id}`} // Add testID for each menu item rating
                  />
                </View>
                <Ionicons
                  name={menuReviewsVisibility[item.id] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="black"
                  testID={`menu-item-${item.id}`} // Add testID for each menu item toggle icon
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
  