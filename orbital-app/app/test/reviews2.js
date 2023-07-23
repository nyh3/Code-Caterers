import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for displaying and managing user reviews.
 * @returns {JSX.Element} The ReviewsPage component.
 */
export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserReviews();
    }, []);

    /**
     * Fetches the user's reviews from the database.
     * In this simplified version, we're not making an actual API call.
     * Instead, we're setting some sample review data for testing purposes.
     */
    const fetchUserReviews = async () => {
        const sampleReviews = [
            {
                id: 1,
                menu: { name: 'Sample Menu 1', stall: { name: 'Sample Stall 1' } },
                rating: 4,
                review_text: 'This is a great dish!',
                image: 'https://example.com/image1.jpg',
                updated_at: '2023-07-23',
            },
            {
                id: 2,
                menu: { name: 'Sample Menu 2', stall: { name: 'Sample Stall 2' } },
                rating: 3,
                review_text: 'It was okay.',
                updated_at: '2023-07-22',
            },
        ];

        setReviews(sampleReviews);
        setLoading(false);
    };

    /**
     * Renders an individual review item.
     * @param {Object} item - The review item.
     * @returns {JSX.Element} The rendered review item.
     */
    const renderItem = ({ item }) => (
        <TouchableOpacity testID={`review-${item.id}`} style={styles.reviewItem}>
            <View>
                <Text style={styles.menuItem}>
                    {item.menu.name}, {item.menu.stall.name}
                </Text>
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
                {item.image && <Image source={{ uri: item.image }} style={styles.reviewImage} />}
            </View>
            <Text>{item.updated_at}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator testID="loading-indicator" />
            ) : (
                <>
                    {reviews.length > 0 ? (
                        <View>
                            <Text style={styles.header}>Reviews Written:</Text>
                            <FlatList
                                data={reviews}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                    ) : (
                        <Text style={styles.noReviews} testID="no-reviews-message">
                            User has not written any reviews.
                        </Text>
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
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 10,
    },
});
