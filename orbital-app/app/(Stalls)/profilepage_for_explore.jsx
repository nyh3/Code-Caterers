import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSearchParams } from 'expo-router';

/**
 * Profile page component
 */
export default function ProfilePage() {
    const { userId } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [savedMenus, setSavedMenus] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const otherUserId = useSearchParams();
    const [activeTab, setActiveTab] = useState('reviews'); // State variable for the active tab

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [otherUserId]);

    useEffect(() => {
        fetchSavedMenus();
    }, [otherUserId, userId]);

    useEffect(() => {
        const refreshData = async () => {
            await Promise.all([fetchReviews(), fetchSavedMenus()]);
        };

        refreshData();
    }, [otherUserId]);

    /**
     * Fetches the reviews for the user
     */
    const fetchReviews = async () => {
        try {
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('review')
                .select(
                    'id, rating, review_text, image, updated_at, menu_id(*, stall(*, location(*))), profile:user_id (username, image)'
                )
                .eq('user_id', otherUserId.id)
                .order('updated_at', { ascending: false });

            if (reviewsError) {
                console.error('Error fetching reviews:', reviewsError.message);
                return;
            }

            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error.message);
        }
    };

    /**
     * Fetches the saved menus for the user
     */
    const fetchSavedMenus = async () => {
        try {
            const { data, error } = await supabase
                .from('profile')
                .select('menu_id')
                .eq('id', otherUserId.id);

            if (error) {
                console.error('Error fetching saved menu items:', error);
                return;
            }

            const savedMenuIds = data[0]?.menu_id || [];

            if (savedMenuIds.length === 0) {
                setSavedMenus([]); // No saved menu items
                return;
            }

            console.log('Saved menu IDs:', savedMenuIds);

            const menuIds = savedMenuIds
                .filter((id) => id) // Filter out any undefined or null menu IDs
                .map((id) => id.toString()); // Convert menu IDs to strings

            console.log('Menu IDs:', menuIds);

            if (menuIds.length === 0) {
                setSavedMenus([]); // No valid menu IDs
                return;
            }

            const { data: menuData, error: menuError } = await supabase
                .from('menu')
                .select('*, stall(*, location(*))')
                .in('id', menuIds);

            if (menuError) {
                console.error('Error fetching menu details:', menuError);
                return;
            }

            console.log('Menu data:', menuData);

            setSavedMenus(menuData);
        } catch (error) {
            console.error('Error fetching saved menu items:', error);
        }
    };

    /**
     * Fetches the profile for the user
     */
    const fetchProfile = async () => {
        try {
            const [profileData, savedData] = await Promise.all([
                supabase
                    .from('profile')
                    .select('username, image, other_user_id')
                    .eq('id', otherUserId.id)
                    .limit(1),
                supabase
                    .from('profile')
                    .select('other_user_id')
                    .eq('id', userId)
                    .limit(1),
            ]);

            if (profileData.error) {
                console.error('Error fetching profile data:', profileData.error.message);
                return;
            }

            const profile = profileData.data[0];
            const isProfileSaved = savedData.data
                ? savedData.data[0]?.other_user_id?.includes(otherUserId.id)
                : false;
            setIsSaved(Boolean(isProfileSaved));
            setProfile(profile);
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
        }
    };

    /**
     * Handles the press event of a menu item
     * @param {string} menuId - The ID of the menu item
     */
    const handleMenuPress = (menuId) => {
        router.push({ pathname: '/exploreProfilemenuDetails', params: { id: menuId } });
    };

    /**
     * Handles the press event of a review item
     * @param {string} reviewId - The ID of the review item
     */
    const handleReviewPress = (reviewId) => {
        router.push({ pathname: '/User_View_Review', params: { id: reviewId } });
    };

    /**
     * Handles the save/unsave toggle for the profile
     */
    const handleSaveToggle = async () => {
        try {
            const savedProfileIds = await supabase
                .from('profile')
                .select('other_user_id')
                .eq('id', userId)
                .single();

            let updatedProfileIds = savedProfileIds.data?.other_user_id || [];

            if (isSaved) {
                // If already saved, remove the other_user_id from the profile table
                updatedProfileIds = updatedProfileIds.filter((id) => id !== otherUserId.id);
            } else {
                // If not saved, add the other_user_id to the profile table
                updatedProfileIds.push(otherUserId.id);
            }

            await supabase
                .from('profile')
                .update({ other_user_id: updatedProfileIds })
                .eq('id', userId);

            setIsSaved(!isSaved); // Toggle the saved status
        } catch (error) {
            console.error('Error saving/unsaving profile:', error.message);
        }
    };

    /**
     * Handles the press event of a tab button
     * @param {string} tab - The active tab value ('reviews' or 'savedMenus')
     */
    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    if (!profile) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: profile.image }} style={styles.userImage} />
                <Text style={styles.userName}>{profile.username}</Text>
            </View>

            <TouchableOpacity style={styles.heartIconContainer} onPress={handleSaveToggle}>
                <Ionicons
                    name={isSaved ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isSaved ? '#FF84A8' : 'black'}
                />
            </TouchableOpacity>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
                    onPress={() => handleTabPress('reviews')} // Set the active tab to 'reviews' when pressed
                >
                    <Text style={styles.tabButtonText}>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'savedMenus' && styles.activeTabButton]}
                    onPress={() => handleTabPress('savedMenus')} // Set the active tab to 'savedMenus' when pressed
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
                            data={reviews}
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
                                        {item.profile && item.profile.image ? (
                                            <Image source={{ uri: item.profile.image }} style={styles.profileImage} />
                                        ) : (
                                            <View style={styles.profileImage} /> // Placeholder or default image
                                        )}
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
        maxWidth: '90%'
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
    },
    reviewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 13,
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
        paddingBottom: 180, // Adjust this value based on your layout
    },
});
