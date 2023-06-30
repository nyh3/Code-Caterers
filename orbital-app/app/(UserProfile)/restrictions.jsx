import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { StyleSheet, View } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/auth';
import { Link } from 'expo-router';

export default function DietaryRestrictions() {
  const [loading, setLoading] = useState(false);
  const [dietary_restrictions, setDietaryRestrictions] = useState([]);
  const [newRestriction, setNewRestriction] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    const fetchDietaryRestrictions = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('dietary_restrictions')
          .eq('id', userId);
        if (error) {
          console.error('Error retrieving dietary restrictions:', error.message);
          return;
        }
        const restrictions = data[0]?.dietary_restrictions || [];
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error('Error retrieving dietary restrictions:', error.message);
      }
    };
    fetchDietaryRestrictions();
  }, []);

  const handleAddRestriction = () => {
    if (newRestriction.trim() === '') return;

    const updatedRestrictions = [...dietary_restrictions, newRestriction.trim()];
    setDietaryRestrictions(updatedRestrictions);
    setNewRestriction('');
  };

  const handleDeleteRestriction = (restriction) => {
    const updatedRestrictions = dietary_restrictions.filter((item) => item !== restriction);
    setDietaryRestrictions(updatedRestrictions);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profile')
      .update({ dietary_restrictions })
      .eq('id', userId);

    if (error != null) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    setErrMsg('Dietary restrictions updated successfully');
    console.log('Dietary restrictions updated successfully:', data);
  };

  return (
    <View style={styles.wholeThing}>
      <Text style={styles.header}>Dietary Restrictions:</Text>
      <Text style={styles.bold}>Dietary restrictions or allergies declared:</Text>
      {dietary_restrictions.map((restriction, index) => (
        <View key={index} style={styles.restrictionContainer}>
          <Text style={styles.restrictionText}>{restriction}</Text>
          <Button onPress={() => handleDeleteRestriction(restriction)}>Delete</Button>
        </View>
      ))}
      <Text style={styles.bold}>Update your dietary restrictions or food allergies:</Text>
      <TextInput
        autoCapitalize="characters"
        value={newRestriction}
        onChangeText={setNewRestriction}
        style={styles.input}
      />
      <Button style={styles.buttonContainer} onPress={handleAddRestriction}>
        <Text style={styles.button}>Add Restriction</Text>
      </Button>
      <Button style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.button}>Update Dietary Restrictions</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.errormsg}>{errMsg}</Text>}
      <View style={styles.marginLeftContainer}>
        <Link href="../(home)/profile">
          <Button style={styles.discardContainer}>
            <Text style={styles.button}>Discard & Return</Text>
          </Button>
        </Link>
      </View>
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 15,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 15,
    margin: 0,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#FFECF6',
  },
  wholeThing: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFF5FA',
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginTop: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  restrictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#FFECF6',
    height: 40,
  },
  restrictionText: {
    fontSize: 15,
    color: 'black',
  },
  discardContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
  },
  marginLeftContainer: {
    marginTop: 15,
    marginLeft: 10,
  },
  errormsg: {
    marginTop: 10,
    marginLeft: 15,
  }
});
