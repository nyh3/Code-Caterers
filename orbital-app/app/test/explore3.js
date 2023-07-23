import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';

/**
 * UserPage component represents the page displaying users and recommended users.
 *
 * @returns {JSX.Element} The rendered UserPage component.
 */
export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const mockUsers = [
        {
            id: 1,
            username: 'User 1',
            image: 'image_url_1',
        },
        {
            id: 2,
            username: 'User 2',
            image: 'image_url_2',
        },
    ];

    useEffect(() => {
        setUsers(mockUsers);
        setRecommendedUsers(mockUsers.slice(0, 2));
    }, []);

    const handleUserPress = (user) => {
        console.log('Selected User ID:', user.id);
    };

    const renderUser = ({ item }) => (
        <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userCard}>
                <View style={styles.userImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.userImage} />
                </View>
                <Text style={styles.username}>
                    {item.username.length > 15 ? item.username.slice(0, 25) + '...' : item.username}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderRecommendedUser = ({ item }) => (
        <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.recommendedUserCard}>
                <Image source={{ uri: item.image }} style={styles.recommendedUserImage} />
                <Text style={styles.recommendedUsername}>
                    {item.username.length > 15 ? item.username.slice(0, 11) + '...' : item.username}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                testID='searchInput'
            />

            {recommendedUsers.length > 0 && searchQuery === '' && (
                <View>
                    <Text style={styles.heading}>Recommended Users</Text>
                    <FlatList
                        data={recommendedUsers}
                        renderItem={renderRecommendedUser}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recommendedUsersContainer}
                    />
                </View>
            )}

            <Text style={styles.heading}>All Users</Text>

            <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.userList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5FA',
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInput: {
        marginBottom: 10,
        fontSize: 15,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
    },
    userList: {
        paddingBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFECF6',
        borderRadius: 10,
        padding: 15,
        borderColor: '#FFF5FA',
        borderWidth: 3,
    },
    userImageContainer: {
        marginRight: 10,
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    username: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendedUserCard: {
        alignItems: 'center',
        marginBottom: 10,
        width: 140,
        height: 165,
        marginRight: 10,
        backgroundColor: '#FFECF6',
        borderRadius: 10,
        padding: 10,
        borderColor: '#FFF5FA',
        borderWidth: 2,
    },
    recommendedUserImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    recommendedUsername: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    recommendedUsersContainer: {
        paddingHorizontal: 10,
    },
});
