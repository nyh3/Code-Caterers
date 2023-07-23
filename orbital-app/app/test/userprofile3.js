import { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for displaying the user profile page.
 */
export default function UserProfilePage() {
    const [reviews, setReviews] = useState([]);
    const [savedMenus, setSavedMenus] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [profile, setProfile] = useState({
        username: 'John Doe',
        image: 'profile_image_url',
    });
    const [activeTab, setActiveTab] = useState('reviews');

    /**
     * Dummy data for reviews and saved menus.
     * In integration testing, you can replace this data with actual responses from the database.
     */
    const dummyReviews = [
    ];

    const dummySavedMenus = [
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: profile.image }} style={styles.userImage} testID='userImage' />
                <Text style={styles.userName}>{profile.username}</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
                    onPress={() => setActiveTab('reviews')}
                >
                    <Text style={styles.tabButtonText}>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'savedMenus' && styles.activeTabButton]}
                    onPress={() => setActiveTab('savedMenus')}
                >
                    <Text style={styles.tabButtonText}>Saved Menu Items</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'savedMenus' ? (
                savedMenus.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>User has not saved any menu items.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={dummySavedMenus}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
                                <View style={styles.savedMenuContainer}>
                                    {item.image && (
                                        <Image source={{ uri: item.image }} style={styles.menuImage} />
                                    )}
                                    <View style={styles.savedMenuDetails}>
                                        {item.name && (
                                            <Text style={styles.menuName}>{item.name}</Text>
                                        )}
                                        {item.stall && item.stall.name && (
                                            <Text style={styles.stallName}>{item.stall.name}</Text>
                                        )}
                                        {item.stall && item.stall.location && item.stall.location.name && (
                                            <Text style={styles.location}>{item.stall.location.name}</Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )
            ) : (
                <View>
                    {reviews.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>User has not written any reviews.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={dummyReviews}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleReviewPress(item.id)}>
                                    <View style={styles.reviewItemContainer}>
                                        <View style={styles.menuContainer}>
                                            <Image source={{ uri: item.menu_id.image }} style={styles.menuImage} />
                                            <View style={styles.menuDetails}>
                                                <Text style={styles.menuName}>{item.menu_id.name}</Text>
                                                <Text style={styles.price}>Price: ${item.menu_id.price}</Text>
                                                <Text style={styles.stallName}>{item.menu_id.stall.name}</Text>
                                                <Text style={styles.location}>{item.menu_id.stall.location.name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.text}>Review:</Text>
                                        </View>
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
                                        {item.image && <Image source={{ uri: item.image }} style={styles.reviewImage} />}
                                        <Text style={styles.timestamp}>{item.updated_at}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.flatListContent}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF5FA',
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10,
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginHorizontal: 8,
    },
    activeTabButton: {
        backgroundColor: '#FFECF6',
    },
    tabButtonText: {
        fontWeight: 'bold',
    },
    reviewItemContainer: {
        flexDirection: 'column',
        backgroundColor: '#FFECF6',
        padding: 10,
        marginBottom: 10,
        borderColor: '#FFF5FA',
        borderWidth: 2,
        borderRadius: 8,
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    menuDetails: {
        flex: 1,
        marginTop: 10,
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#666',
    },
    location: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
    },
    stallName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        marginLeft: 125,
    },
    comment: {
        marginBottom: 4,
        color: '#666',
        marginVertical: 10,
    },
    reviewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginVertical: 5,
    },
    timestamp: {
        fontSize: 13,
        marginTop: 5,
    },
    savedMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFECF6',
        padding: 15,
        marginBottom: 10,
        borderColor: '#FFF5FA',
        borderWidth: 2,
        borderRadius: 8,
    },
    savedMenuDetails: {
        flex: 1,
        marginTop: 10,
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    flatListContent: {
        paddingBottom: 180,
    },
});
