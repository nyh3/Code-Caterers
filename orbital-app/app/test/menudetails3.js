import { ScrollView, View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { AirbnbRating } from 'react-native-ratings';

export default function MenuDetailScreen() {
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchMenuDetails();
    fetchReviews();
  }, []);

  /**
   * Fetch menu details from the 'menu' table
   * Mocked menu data for testing purposes
   */
  const fetchMenuDetails = async () => {
    const mockMenuData = {
      id: 1,
      name: 'Sample Menu',
      rating: '4.5',
      price: '10.99',
      description: 'This is a sample menu item description.',
      dietary_restrictions: ['Vegan', 'Gluten-free'],
      image: 'https://example.com/sample-menu.jpg',
    };

    setMenu(mockMenuData);
  };

  /**
   * Toggle the save status of the menu item
   */
  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  /**
   * Fetch reviews for the menu item
   * Mocked review data for testing purposes
   */
  const fetchReviews = async () => {
    const mockReviewsData = [
      {
        id: 1,
        profile: {
          username: 'JohnDoe',
          image: 'https://example.com/johndoe.jpg',
        },
        rating: '4.0',
        review_text: 'This is a sample review.',
        image: 'https://example.com/sample-review.jpg',
        updated_at: '2023-07-20T12:34:56Z',
      },
    ];

    setReviews(mockReviewsData);
  };

  /**
   * Handle adding a new review for the menu item
   */
  const handleAddReview = () => {
  };

  /**
   * Handle navigating to the details of a specific review
   */
  const handleReviewPress = (review) => {
  };

  if (!menu) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleSaveToggle} style={styles.heartButton} testID='save-button'>
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

      <TouchableOpacity onPress={handleAddReview} style={styles.buttonContainer}>
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
                <Text style={styles.comment} testID='review-item-1'>{item.review_text}</Text>
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
    marginVertical: 10,
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
    paddingBottom: 50,
  },
});
