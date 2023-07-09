import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as Linking from 'expo-linking';

export default function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getEmailFromUrl = async () => {
      const handleUrl = ({ url }) => {
        console.log('URL:', url);
        const { queryParams } = Linking.parse(url);
        setEmail(queryParams.email);
      };
  
      Linking.addEventListener('url', handleUrl);
  
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleUrl({ url: initialUrl });
      }
  
      return () => {
        Linking.removeEventListener('url', handleUrl);
      };
    };
    getEmailFromUrl();
  }, []);  

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.api.updateUser(email, password);
      if (error) {
        setErrMsg(error.message);
      } else {
        // Password reset successful
      }
    } catch (error) {
      setErrMsg(error.message);
    }
  };

  return (
    <View style={styles.passwordResetContainer}>
      <Text style={styles.title}>Set your new password:</Text>
      <Text style={styles.word}>Enter Your New Password:</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.word}>Confirm Password:</Text>
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errMsg !== "" && <Text>{errMsg}</Text>}
      <Button style={styles.buttonContainer} onPress={handlePasswordReset}>
        <Text style={styles.button}>Reset Password</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  passwordResetContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#FFF5FA',
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop: 10,
    fontSize: 18,
  },
  word: {
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 3,
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 5,
    marginTop: 15,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
