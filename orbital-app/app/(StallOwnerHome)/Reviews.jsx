import { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { ListItem } from 'react-native-elements';
import { supabase } from '../../lib/supabase';
import { useAuth } from "../../contexts/auth";

export default function ReviewPage() {
    const userId = useAuth();
    const [reviews, setReviews] = useState([]);
    const [menuReviewsVisibility, setMenuReviewsVisibility] = useState({});
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        fetchStallId();
    }, []);

    const fetchStallId = async () => {
        const { data, error } = await supabase
            .from('Stall')
            .select('id')
            .eq('owner_id', userId.userId)
            .single();

        if (!error) {
            const stallId = data.id;
            fetchMenuId(stallId);
        }
    };

    const fetchMenuId = async (stallId) => {
        const { data, error } = await supabase
          .from('Menu')
          .select('id, name')
          .eq('stall_id', stallId);
      
        if (!error) {
          const menuData = data.reduce((acc, menu) => {
            acc[menu.id] = { id: menu.id, name: menu.name };
            return acc;
          }, {});
          fetchReviewId(Object.keys(menuData));
          setMenu(menuData);
        }
      };
      
    const fetchReviewId = async (menuId) => {
        const { data, error } = await supabase
            .from('review')
            .select('id, menu_id, rating, review_text')
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
                  <Image source={{ uri: review.image }} style={styles.reviewImage} />
                  <Text>{review.rating}</Text>
                  <Text>{review.review_text}</Text>
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
            <Text style={styles.ratings}>
                Ratings: use database to calculate overall ratings
            </Text>
            <FlatList
                data={Object.values(menu)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListItem onPress={() => toggleMenuReviewsVisibility(item.id)}>
                    <ListItem.Content>
                        <ListItem.Title>{item.name}</ListItem.Title>
                        {renderMenuReviews(item.id)}
                    </ListItem.Content>
                    </ListItem>
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
});