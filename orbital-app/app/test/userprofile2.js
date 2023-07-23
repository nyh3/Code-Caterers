import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

/**
 * Component for displaying the user profile page.
 */
export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState('reviews');
    const [isSaved, setIsSaved] = useState(false);
    const profile = {
        username: 'John Doe',
        image: 'https://example.com/profile.jpg',
    };
    const savedMenus = [];
    const reviews = [];

    /**
     * Handles the save/unsave toggle.
     */
    const handleSaveToggle = () => {
        setIsSaved(!isSaved);
    };

    /**
     * Handles the press event on a tab button.
     */
    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: profile.image }} style={styles.userImage} />
                <Text style={styles.userName}>{profile.username}</Text>
            </View>

            <TouchableOpacity style={styles.heartIconContainer} onPress={handleSaveToggle} testID='heartIcon'>
                { }
            </TouchableOpacity>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    testID="reviewsTab"
                    style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
                    onPress={() => handleTabPress('reviews')}
                >
                    <Text style={styles.tabButtonText}>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="savedMenusTab"
                    style={[styles.tabButton, activeTab === 'savedMenus' && styles.activeTabButton]}
                    onPress={() => handleTabPress('savedMenus')}
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
                        data={savedMenus}
                        keyExtractor={(item) => (item.id ? item.id.toString() : '')}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
                                { }
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
                            data={reviews}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleReviewPress(item.id)}>
                                    { }
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
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    heartIconContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
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

export const testIDs = {
    reviewsTab: 'reviewsTab',
    savedMenusTab: 'savedMenusTab',
    reviewItem: 'reviewItem',
    savedMenuItem: 'savedMenuItem',
};
