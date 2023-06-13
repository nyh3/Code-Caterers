import { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ListItem } from 'react-native-elements';
import { supabase } from '../../lib/supabase';
import { useAuth } from "../../contexts/auth";

export default function ReviewPage() {
    const userId = useAuth();
    const [reviews, setReviews] = useState([]);
    const [menuReviewsVisibility, setMenuReviewsVisibility] = useState({});

    useEffect(() => {
        fetchStallId();
    }, []);

    const fetchStallId = async () => {
        const { data, error } = await supabase
            .from('Stall')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (!error) {
            const stallId = data.id;
            fetchMenuId(stallId);
        }
    };

    const fetchMenuId = async (stallId) => {
        const { data, error } = await supabase
            .from('Menu')
            .select('id')
            .eq('stall_id', stallId);

        if (!error) {
            const menuId = data.map((menu) => menu.id);
            fetchReviewId(menuId);
        }
    };

    const fetchReviewId = async (menuId) => {
        const { data, error } = await supabase
            .from('review')
            .select('id, menu_id')
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
        const menuReviews = reviews.filter((review) => review.menu_id === menuId);

        if (menuReviewsVisibility[menuId]) {
            return (
                <View>
                {menuReviews.map((review) => (
                  <TouchableOpacity key={review.id} onPress={() => toggleMenuReviewsVisibility(review.id)}>
                    <Text>{review.rating}</Text>
                    {review.id === menuId && <Text>{review.comment}</Text>}
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
            {reviews.map((review) => (
            <ListItem key={review.id} onPress={() => toggleMenuReviewsVisibility(review.menu_id)}>
            <ListItem.Content>
                <ListItem.Title>{review.menu_id}</ListItem.Title>
                {renderMenuReviews(review.menu_id)}
            </ListItem.Content>
            </ListItem>
            ))}
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