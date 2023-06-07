import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as Linking from 'expo-linking';

export function PasswordReset() { 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.api.updateUser(password);
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
      <Text style={styles.word}>New Password</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.word}>Confirm Password</Text>
      <TextInput secureTextEntry
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
    marginTop: 20,
  },
  word: {
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
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
