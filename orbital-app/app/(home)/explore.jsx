import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { userId } = useAuth();
  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRecommendedUsers();
  }, [isFocused, searchQuery]);

  useEffect(() => {
    // Logic that depends on menuId
    if (menuId) {
      const recommended = users.filter((user) => user.menu_id === menuId);
      setRecommendedUsers(recommended);
    }
  }, [menuId, users]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .neq('id', userId) // Exclude your own profile
        .ilike('username', `%${searchQuery}%`);
      if (error) {
        console.error('Error fetching user details:', error.message);
        return;
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const fetchRecommendedUsers = async () => {
    try {
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profile')
        .select('menu_id, other_user_id')
        .eq('id', userId)
        .single();
  
      if (currentUserError) {
        console.error('Error fetching current user details:', currentUserError.message);
        return;
      }
  
      const currentUserMenuId = currentUserData.menu_id || [];
      const currentUserSavedUsers = currentUserData.other_user_id || [];
  
      const { data: usersData, error: usersError } = await supabase
        .from('profile')
        .select('*')
        .neq('id', userId) // Exclude current user
        .contains('menu_id', currentUserMenuId);
  
      if (usersError) {
        console.error('Error fetching users with the same menu_id:', usersError.message);
        return;
      }
  
      const recommendedUsers = usersData
        .filter((user) => !currentUserSavedUsers.includes(user.id)) // Exclude saved users
        .map((user) => ({ ...user, similarity: countSimilarMenuIds(user.menu_id, currentUserMenuId) }))
        .sort((a, b) => b.similarity - a.similarity);
  
      setRecommendedUsers(recommendedUsers);
    } catch (error) {
      console.error('Error fetching recommended users:', error.message);
    }
  };  
  
  const countSimilarMenuIds = (menuIds, targetMenuId) => {
    const menuIdArray = Array.isArray(menuIds) ? menuIds : [menuIds];
    const targetArray = Array.isArray(targetMenuId) ? targetMenuId : [targetMenuId];
    return menuIdArray.filter((menuId) => targetArray.includes(menuId)).length;
  };  

  const handleUserPress = (user) => {
    router.push({ pathname: '/profilepage_for_explore', params: { id: user.id } });
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.userCard}>
        <View style={styles.userImageContainer}>
          <Image source={{ uri: item.image }} style={styles.userImage} />
        </View>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.recommendedUserCard}>
        <Image source={{ uri: item.image }} style={styles.recommendedUserImage} />
        <Text style={styles.recommendedUsername}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

    {recommendedUsers.length > 0 && searchQuery == '' && (
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
    paddingHorizontal: 10,
    paddingTop: 10,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
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
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
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
