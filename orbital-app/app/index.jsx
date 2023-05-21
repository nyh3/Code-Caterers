import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text>This is the homepage</Text>
      <Button onPress={() => supabase.auth.signOut}>Logout</Button>
    </View>
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