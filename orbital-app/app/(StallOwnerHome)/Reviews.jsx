import { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { ListItem } from 'react-native-elements';
import { supabase } from '../../lib/supabase';
import { useAuth } from "../../contexts/auth";
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from "@expo/vector-icons";

export default function ReviewPage() {
    const { userId } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [menuReviewsVisibility, setMenuReviewsVisibility] = useState({});
    const [menu, setMenu] = useState([]);
    const [overallRating, setOverallRating] = useState(0);

    useEffect(() => {
        fetchStallId();
    }, []);

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
      
    const fetchReviewId = async (menuId) => {
        const { data, error } = await supabase
            .from('review')
            .select('*, profile (username, image)')
            .in('menu_id', menuId);

        if (!error) {
            setReviews(data);
        }
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
      
          return (
            <View>
              {menuReviews.map((review) => (
                <TouchableOpacity key={`${menuId}-${review.id}`}>
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
                    <Text>{review.updated_at}</Text>
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
            <Text style={styles.header}>
                Reviews:
            </Text>
            <AirbnbRating
              defaultRating={parseFloat(overallRating) || 0} // Use a default value of 0 if stall.rating is null
              size={30}
              isDisabled
              showRating={false}
              minRating={0} // Set the minimum selectable value to 0
              maxRating={5} // Set the maximum selectable value to 5
            />
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
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    justifyContent: 'flex-start',
    marginHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 15,
  },
  ratings: {
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
    marginBottom: 5,
  },
  reviewContainer: {
    flexDirection: 'column',
    marginBottom: 15,
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
  },
  reviewImage: {
    width: 70,
    height: 70,
  },
  menuImage: {
    width: 40,
    height: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold', // Make the menu name bold
    marginLeft: 10, // Add some spacing between the image and the menu name
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
});