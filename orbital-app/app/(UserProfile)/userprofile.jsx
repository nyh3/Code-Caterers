import { ScrollView, View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

export default function UserProfilePage() {
    const { userId } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [savedMenus, setSavedMenus] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [profile, setProfile] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null); 
    const router = useRouter(); 

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (otherUserId) {
            fetchReviews();
            fetchSavedMenus(); 
        }
    }, [otherUserId]);

    useEffect(() => {
        const refreshData = async () => {
            if (otherUserId) {
                await Promise.all([fetchReviews(), fetchSavedMenus()]);
            }
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
                .eq('profile.other_user_id', otherUserId) // Filter reviews based on other_user_id field in profile relation
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
            const { data: savedMenusData, error: savedMenusError } = await supabase
                .from('profile')
                .select('menu_id(*, stall(*, location(*)))')
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
        router.push({ pathname: '/menuDetails', params: { id: menuId } });
    };

    const handleReviewPress = (reviewId) => {
        router.push({ pathname: '/View_Review', params: { id: reviewId } });
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
                        keyExtractor={(item) => item.menu_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMenuPress(item.menu_id.id)}>
                                <View style={styles.savedMenuContainer}>
                                    <Image source={{ uri: item.menu_id.image }} style={styles.menuImage} />
                                    <View style={styles.savedMenuDetails}>
                                        <Text style={styles.menuName}>{item.menu_id.name}</Text>
                                        <Text style={styles.stallName}>{item.menu_id.stall.name}</Text>
                                        <Text style={styles.location}>{item.menu_id.stall.location.name}</Text>
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
                            data={reviews} //shows all reviews here
                            //data={reviews.filter(item => item.profile && item.profile.user_id === otherUserId)} // otherUserId is null, trying to filter so that only otherUserId fetched is displayed
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