import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserProfileLayout() {
  const router = useRouter();

  const handleStall = () => {
    router.push('/');
  }

  const handleFilter = () => {
    router.push('filter');
  }

  const handleSaved = () => {
    router.push('saved');
  }

  const handleExplore = () => {
    router.push('explore');
  }

  return (
    <Stack>
      {/* Menu Details Screen */}
      <Stack.Screen
        name="menuDetails"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Stall Details Screen */}
      <Stack.Screen
        name="stallDetails"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleStall}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* New Review Screen */}
      <Stack.Screen
        name="newReview"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Review Details Screen */}
      <Stack.Screen
        name="reviewDetails"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Menu Details Filter Screen */}
      <Stack.Screen
        name="Menu_Details_Filter"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleFilter}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* User Menu Details Screen */}
      <Stack.Screen
        name="User_Menu_Details"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleSaved}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* User Profile Menu Details Screen */}
      <Stack.Screen
        name="userProfilemenuDetails"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Explore Profile Menu Details Screen */}
      <Stack.Screen
        name="exploreProfilemenuDetails"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Profile Page for Explore Screen */}
      <Stack.Screen
        name="profilepage_for_explore"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleExplore}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* User View Review Screen */}
      <Stack.Screen
        name="User_View_Review"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* User Profile Screen */}
      <Stack.Screen
        name="userprofile"
        options={{
          headerStyle: {
            height: 80,
            backgroundColor: '#FFF5FA',
          },
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle: () => (
            <View style={styles.headerContainerMain}>
              <Image
                source={require('../../assets/headerlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleSaved}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainerMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 40,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 140,
  },
  logo: {
    width: 200,
    height: 80,
  },
});
