import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import { useIsFocused } from "@react-navigation/native";

/**
 * Component for displaying and managing user reviews.
 * @param {Object} props - Component props.
 * @param {string} props.userId - The ID of the user whose reviews to display.
 * @param {Object[]} props.reviews - The array of user reviews to display.
 * @param {boolean} props.loading - A flag indicating if data is still loading.
 * @param {function} props.onEditReview - Callback function to handle editing a review.
 * @returns {JSX.Element} The ReviewsPage component.
 */
export default function ReviewsPage({ userId, reviews, loading, onEditReview }) {
    const isFocused = useIsFocused();

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    {reviews.length > 0 ? (
                        <View>
                            <Text style={styles.header}>Reviews Written:</Text>
                            <FlatList
                                data={reviews}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => onEditReview(item.id)}
                                        style={styles.reviewItem}
                                        testID={`review-${item.id}`}
                                    >
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
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
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
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 10,
    },
});
