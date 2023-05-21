import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function HomePage() {
  const [user, setUser] = useState({userID: '1'});
  return (
    <AuthProvider>
      <View style={styles.container}>
        <Image 
        /*style={styles.logo} 
        source={require('./assets/logo.png')} *//>
        <Text>SIGN IN</Text>
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});