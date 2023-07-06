import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSearchParams } from 'expo-router';

export default function UserProfilePage() {
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
        fetchSavedMenus();
    }, [otherUserId]);

    useEffect(() => {
        const refreshData = async () => {
            await Promise.all([fetchReviews(), fetchSavedMenus()]);
        };

        refreshData();
    }, [otherUserId]);

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

    const fetchSavedMenus = async () => {
        try {
            const { data: savedMenus, error: savedMenusError } = await supabase
                .from('profile')
                .select('menu_id(*, stall(*, location(*)))')
                .eq('id', otherUserId.id);

            if (savedMenusError) {
                console.error('Error fetching saved menus:', savedMenusError.message);
                return;
            }

            setSavedMenus(savedMenus);
        } catch (error) {
            console.error('Error fetching saved menus:', error.message);
        }
    };

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
            const isProfileSaved = savedData.data && savedData.data[0]?.other_user_id === otherUserId.id;
            setIsSaved(Boolean(isProfileSaved && profile.other_user_id !== null));

            setProfile(profile);
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
        }
    };

    const handleMenuPress = (menuId) => {
        router.push({ pathname: '/menuDetails', params: { id: menuId } });
    };

    const handleReviewPress = (reviewId) => {
        router.push({ pathname: '/User_View_Review', params: { id: reviewId } });
    };

    const handleSaveToggle = async () => {
        try {
            if (isSaved) {
                // If already saved, remove the other_user_id from the profile table
                await supabase
                    .from('profile')
                    .update({ other_user_id: null })// Set the other_user_id column to NULL
                    .eq('id', userId)
                    .eq('other_user_id', otherUserId.id);
                setIsSaved(false);
            } else {
                await supabase
                    .from('profile')
                    .update({ other_user_id: otherUserId.id })
                    .eq('id', userId);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error saving/unsaving profile:', error.message);
        }
    };

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
                savedMenus.length === 0 || savedMenus.some((item) => item.menu_id === null) ? (
                    <Text>No saved menus found.</Text>
                ) : (
                    <FlatList
                        data={savedMenus}
                        keyExtractor={(item) => (item.menu_id ? item.menu_id.toString() : null)}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMenuPress(item.menu_id ? item.menu_id.id : null)}>
                                <View style={styles.savedMenuContainer}>
                                    {item.menu_id && item.menu_id.image && (
                                        <Image source={{ uri: item.menu_id.image }} style={styles.menuImage} />
                                    )}
                                    <View style={styles.savedMenuDetails}>
                                        {item.menu_id && item.menu_id.name && (
                                            <Text style={styles.menuName}>{item.menu_id.name}</Text>
                                        )}
                                        {item.menu_id && item.menu_id.stall && item.menu_id.stall.name && (
                                            <Text style={styles.stallName}>{item.menu_id.stall.name}</Text>
                                        )}
                                        {item.menu_id && item.menu_id.stall && item.menu_id.stall.location && item.menu_id.stall.location.name && (
                                            <Text style={styles.location}>{item.menu_id.stall.location.name}</Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )
            ) : (
                <View style={styles.reviewContainer}>
                    {reviews.length === 0 ? (
                        <Text>No reviews found.</Text>
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
        borderWidth: 1,
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
        marginBottom: 10,
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
});