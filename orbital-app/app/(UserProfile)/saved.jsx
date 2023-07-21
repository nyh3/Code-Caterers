import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'expo-router';

/**
 * Component for displaying saved menu items and profiles.
 * @returns {JSX.Element} The SavedPage component.
 */
export default function SavedPage() {
  const [activeTab, setActiveTab] = useState('menu');
  const [savedMenuItems, setSavedMenuItems] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchSavedMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('menu_id')
          .eq('id', userId);

        if (error) {
          console.error('Error fetching saved menu items:', error);
          return;
        }

        const savedMenuIds = data[0].menu_id || [];

        const { data: menuData, error: menuError } = await supabase
          .from('menu')
          .select('*, stall(*, location(*))')
          .in('id', savedMenuIds);

        if (menuError) {
          console.error('Error fetching menu details:', menuError);
          return;
        }

        setSavedMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching saved menu items:', error);
      }
    };

    const fetchSavedProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('other_user_id')
          .eq('id', userId);

        if (error) {
          console.error('Error fetching saved profiles:', error);
          return;
        }

        const savedProfileIds = data[0].other_user_id || [];

        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .in('id', savedProfileIds);

        if (profileError) {
          console.error('Error fetching profile details:', profileError);
          return;
        }

        setSavedProfiles(profileData);
      } catch (error) {
        console.error('Error fetching saved profiles:', error);
      }
    };

    fetchSavedMenuItems();
    fetchSavedProfiles();
  }, [userId]);

  /**
   * Handles pressing a saved menu item.
   * @param {Object} item - The selected menu item.
   */
  const handleMenuPress = (item) => {
    router.push({ pathname: '/User_Menu_Details', params: { id: item.id } });
  };

  /**
   * Handles pressing a saved profile.
   * @param {Object} profile - The selected profile.
   */
  const handleProfilePress = (profile) => {
    router.push({ pathname: '/userprofile', params: { id: profile.id } });
  };

  /**
   * Handles pressing a tab.
   * @param {string} tab - The selected tab.
   */
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  /**
   * Renders the saved menu items.
   * @returns {JSX.Element} The rendered saved menu items.
   */
  const SavedMenu = () => (
    <ScrollView style={styles.tabContainer}>
      {savedMenuItems.length > 0 ? (
        savedMenuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemLocation}>{item.stall.location.name}</Text>
                <Text style={styles.itemStallName}>{item.stall.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>User has not saved any menu items.</Text>
        </View>
      )}
    </ScrollView>
  );

  /**
   * Renders the saved profiles.
   * @returns {JSX.Element} The rendered saved profiles.
   */
  const SavedProfiles = () => (
    <ScrollView style={styles.tabContainer}>
      {savedProfiles.length > 0 ? (
        savedProfiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={styles.tabItem}
            onPress={() => handleProfilePress(profile)}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: profile.image }} style={styles.itemImage} />
              <Text style={styles.itemName}>{limitUsername(profile.username)}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>User has not saved any profiles.</Text>
        </View>
      )}
    </ScrollView>
  );

  /**
   * Limits the username to a specified length.
   * @param {string} username - The username to be limited.
   * @param {number} limit - The character limit for the username (default: 23).
   * @returns {string} The limited username.
   */
  const limitUsername = (username, limit = 23) => {
    if (username.length <= limit) {
      return username;
    } else {
      const truncatedUsername = username.slice(0, limit);
      return `${truncatedUsername}...`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeTab === 'menu' && styles.activeButton]}
          onPress={() => handleTabPress('menu')}
        >
          <Text style={styles.buttonText}>Saved Menus</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeTab === 'profiles' && styles.activeButton]}
          onPress={() => handleTabPress('profiles')}
        >
          <Text style={styles.buttonText}>Saved Profiles</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'menu' ? (
        <SavedMenu />
      ) : (
        <SavedProfiles />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    paddingTop: 20,
  },
  tabItem: {
    padding: 5,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECF6',
    padding: 15,
    marginHorizontal: 10,
    borderColor: '#FFF5FA',
    borderWidth: 2,
    borderRadius: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    maxWidth: '90%',
  },
  itemLocation: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  itemStallName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2C0080',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
});
