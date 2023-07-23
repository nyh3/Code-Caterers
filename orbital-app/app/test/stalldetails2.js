import { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for displaying the details of a stall.
 */
export default function StallDetailScreen({ handleMenuItemPress }) {
    const [menu] = useState([]);
    const stall = {
        name: 'Stall Name',
        location: { name: 'Location Name' },
        rating: '4.5',
        is_vegetarian: true,
        is_halal: true,
        cuisine: { name: 'Chinese' },
        description: 'Stall description',
        stallImage: 'https://example.com/stall.jpg',
    };

    /**
     * Returns the color for the cuisine tag based on the cuisine name.
     * @param {string} cuisineName - The name of the cuisine.
     * @returns {string} The color for the cuisine tag.
     */
    const getCuisineTagColor = (cuisineName) => {
        switch (cuisineName) {
            case 'Chinese':
                return '#FFD700';
            case 'Western':
                return '#6495ED';
            default:
                return '#CCCCCC';
        }
    };

    /**
     * Renders a menu item.
     * @param {object} item - The menu item object.
     */
    const renderMenuItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleMenuItemPress(item.id)}
            testID={`menu-item-${item.id}`}
        >
            <View style={styles.menuItemContainer}>
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                <View style={styles.menuItemDetails}>
                    <Text style={styles.menuItemTitle}>{item.name}</Text>
                    <View style={styles.menuItemRatingAndCuisine}>
                        <AirbnbRating
                            defaultRating={parseFloat(item.rating) || 0}
                            size={15}
                            isDisabled
                            showRating={false}
                            minRating={0}
                            maxRating={5}
                        />
                    </View>
                    <Text style={styles.menuItemPrice}>Price: ${item.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <Image source={{ uri: stall.stallImage }} style={styles.image} />
            <View style={styles.stallNameContainer}>
                <Text style={styles.name}>{stall.name}, {stall.location.name}</Text>
            </View>
            <View style={styles.stallRating}>
                <AirbnbRating
                    defaultRating={parseFloat(stall.rating) || 0}
                    size={30}
                    isDisabled
                    showRating={false}
                    minRating={0}
                    maxRating={5}
                />
            </View>
            <View style={styles.stallTags}>
                {stall.is_vegetarian && (
                    <View style={[styles.tagContainer, { backgroundColor: '#4CAF50' }]} testID="vegetarian-tag">
                        <Text style={styles.tagText}>Vegetarian</Text>
                    </View>
                )}
                {stall.is_halal && (
                    <View style={[styles.tagContainer, { backgroundColor: '#F44336' }]} testID="halal-tag">
                        <Text style={styles.tagText}>Halal</Text>
                    </View>
                )}
                <View
                    style={[styles.cuisineTag, { backgroundColor: getCuisineTagColor(stall.cuisine.name) }]}
                    testID="cuisine-tag"
                >
                    <Text style={styles.tagText}>{stall.cuisine.name}</Text>
                </View>
            </View>
            <Text style={styles.description}>{stall.description}</Text>
            <FlatList
                data={menu}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.menuList}
                showsVerticalScrollIndicator={false}
                testID="menu-list"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 35,
        paddingBottom: 15,
    },
    image: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 100,
    },
    stallNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        marginRight: 5,
        textAlign: 'center',
    },
    stallRating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    stallTags: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    tagContainer: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 5,
    },
    tagText: {
        color: 'white',
        fontSize: 12,
    },
    cuisineTag: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    location: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    menuList: {
        paddingTop: 10,
        paddingBottom: 50,
    },
    menuItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    menuItemDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    menuItemRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    menuItemTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 10,
    },
    menuItemPrice: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FF6699',
        marginTop: 5,
    },
    starStyle: {
        marginRight: 2,
    },
    menuItemImage: {
        width: 70,
        height: 70,
        marginHorizontal: 10,
        marginTop: 10,
    },
    description: {
        marginHorizontal: 10,
        marginTop: 10,
    }
});
