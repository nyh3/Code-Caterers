import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import the useRouter hook

export default function UserProfilePage() {
    const { userId } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [savedMenus, setSavedMenus] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [profile, setProfile] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null); // Add state for other user's ID
    const router = useRouter(); // Initialize the useRouter hook

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (otherUserId) {
            fetchReviews();
            fetchSavedMenus();
        }
    }, [otherUserId]);

    const fetchReviews = async () => {
        try {
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('review')
                .select('*, menu (name, image, price)')
                .eq('user_id', otherUserId); // Fetch reviews for the user with the specified ID

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
            // Fetch saved menus for other user
            const { data: savedMenusData, error: savedMenusError } = await supabase
                .from('profile')
                .select('*, menu (name, image, price)')
                .eq('other_user_id', otherUserId);

            if (savedMenusError) {
                console.error('Error fetching saved menus:', savedMenusError.message);
                return;
            }

            setSavedMenus(savedMenusData);
        } catch (error) {
            console.error('Error fetching saved menus:', error.message);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profile')
                .select('username, image, other_user_id')
                .eq('other_user_id', userId)
                .limit(1);

            if (profileError) {
                console.error('Error fetching profile data:', profileError.message);
                return;
            }

            if (profileData.length > 0) {
                setProfile(profileData[0]);
                setOtherUserId(profileData[0].other_user_id);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
        }
    };

    const handleMenuPress = (menuId) => {
        router.push({ pathname: '/menu', params: { id: menuId } });
    };

    const handleSaveToggle = async () => {
        try {
            setIsSaved(!isSaved);

            if (isSaved) {
                // If already saved, remove the profile entry for the current user and otherUserId
                await supabase
                    .from('profile')
                    .delete()
                    .eq('user_id', userId)
                    .eq('other_user_id', otherUserId);
            } else {
                // If not saved, add a new profile entry for the current user and otherUserId
                await supabase.from('profile').insert([{ user_id: userId, other_user_id: otherUserId }]);
            }
        } catch (error) {
            console.error('Error saving/unsaving profile:', error.message);
        }
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
                    style={[styles.tabButton, !isSaved && styles.activeTabButton]}
                    onPress={() => setIsSaved(false)}
                >
                    <Text style={styles.tabButtonText}>Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, isSaved && styles.activeTabButton]}
                    onPress={() => setIsSaved(true)}
                >
                    <Text style={styles.tabButtonText}>Saved Menu Items</Text>
                </TouchableOpacity>
            </View>

            {isSaved ? (
                savedMenus.length === 0 ? (
                    <Text>No saved menus found.</Text>
                ) : (
                    <FlatList
                        data={savedMenus}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMenuPress(item.menu.id)}>
                                <View style={styles.savedMenuContainer}>
                                    <Image source={{ uri: item.menu.image }} style={styles.menuImage} />
                                    <View style={styles.savedMenuDetails}>
                                        <Text style={styles.menuName}>{item.menu.name}</Text>
                                        <Text style={styles.price}>Price: ${item.menu.price}</Text>
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
                                <TouchableOpacity onPress={() => handleMenuPress(item.menu.id)}>
                                    <View style={styles.reviewItemContainer}>
                                        <Image source={{ uri: item.menu.image }} style={styles.menuImage} />
                                        <View style={styles.reviewDetails}>
                                            <Text style={styles.menuName}>{item.menu.name}</Text>
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
                                            <Text style={styles.timestamp}>{item.updated_at}</Text>
                                        </View>
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
    reviewContainer: {
        flex: 1,
    },
    reviewItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    reviewDetails: {
        flex: 1,
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rating: {
        marginBottom: 4,
    },
    comment: {
        marginBottom: 4,
    },
    reviewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    savedMenuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    savedMenuDetails: {
        flex: 1,
    },
    price: {
        fontWeight: 'bold',
    },
});