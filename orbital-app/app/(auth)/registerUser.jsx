import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";

/**
 * RegisterPage component represents the registration page for creating a new account.
 *
 * @returns {JSX.Element} The rendered RegisterPage component.
 */
export default function RegisterPage() {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  /**
   * Handles the form submission for registering a new account.
   *
   * @returns {void}
   */
  const handleSubmit = async () => {
    if (email.trim() === '') {
      setErrMsg('Please provide a valid email address.');
      return;
    }
    if (password === '') {
      setErrMsg('Please provide a valid email password.');
      return;
    }
    setLoading(true);
    setErrMsg('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://nyh3.github.io/verify'
      }
    });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/logo.png')}
      />

      <Text style={styles.register}>Create an Account:</Text>

      <Text style={styles.bold}>Email:</Text>
      <TextInput
        autoCapitalize='none'
        textContentType='emailAddress'
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.bold}>Password:</Text>
      <TextInput
        secureTextEntry
        autoCapitalize='none'
        textContentType='password'
        value={password}
        onChangeText={setPassword}
      />

      {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit}
        >
          Send Verification Email
        </Button>
      </View>

      {loading && <ActivityIndicator style={styles.indicator} />}

      <Text style={styles.note}>
        Note: After creating your account, please check your email for a verification link to complete the registration process.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF5FA',
    padding: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginVertical: 30,
  },
  register: {
    fontWeight: 'bold',
    fontSize: 34,
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 3,
  },
  buttonContainer: {
    marginTop: 15,
    width: 200,
  },
  button: {
    backgroundColor: '#FFECF6',
    color: '#2C0080',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 15,
  },
  indicator: {
    marginTop: 15,
  },
  note: {
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
});
