import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { supabase } from "../../lib/supabase";
import { TabView, TabBar } from "react-native-tab-view";
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'expo-router';

export default function SavedPage() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "menu", title: "Saved Menu" },
    { key: "profiles", title: "Saved Profiles" },
  ]);
  const [savedMenuItems, setSavedMenuItems] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchSavedMenuItems = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('menu_id(*, stall(*, location(*)))')
        .eq('id', userId);

      if (error) {
        console.error("Error fetching saved menu items:", error);
        return;
      }

      const filteredData = data.filter((item) => item.menu_id !== null);
      setSavedMenuItems(filteredData.map((item) => item.menu_id));
    };

    const fetchSavedProfiles = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('other_user_id(*)')
        .eq('id', userId);

      if (error) {
        console.error("Error fetching saved profiles:", error);
        return;
      }

      const filteredData = data.filter((profile) => profile.other_user_id !== null);
      setSavedProfiles(filteredData.map((profile) => profile.other_user_id));
    };

    fetchSavedMenuItems();
    fetchSavedProfiles();
  }, [userId]);

  const handleMenuPress = (item) => {
    router.push({ pathname: '/menuDetails', params: { id: item.id } });
  };

  const handleProfilePress = (profile) => {
    router.push({ pathname: '/userprofile', params: { userId: profile.user_id } });
  };
  

  const SavedMenu = () => (
    <ScrollView style={styles.tabContainer}>
      {savedMenuItems.map((item) => (
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
      ))}
    </ScrollView>
  );
  
  const SavedProfiles = () => (
    <ScrollView style={styles.tabContainer}>
      {savedProfiles.map((profile) => (
        <TouchableOpacity
          key={profile.id}
          style={styles.tabItem}
          onPress={() => handleProfilePress(profile)}
        >
          <View style={styles.itemContainer}>
            <Image source={{ uri: profile.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{profile.username}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "menu":
        return <SavedMenu />;
      case "profiles":
        return <SavedProfiles />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarUnderline}
      style={styles.tabBar}
      labelStyle={styles.tabText}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
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
    marginLeft: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  itemLocation: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: -15,
  },
  itemStallName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
  },
  tabBar: {
    backgroundColor: "#FFF",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  tabBarUnderline: {
    backgroundColor: "#2C0080",
    height: 2,
  },
});
