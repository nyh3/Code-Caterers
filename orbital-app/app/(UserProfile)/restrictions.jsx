import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';

/**
 * Component for managing dietary restrictions and allergies.
 * @returns {JSX.Element} The DietaryRestrictions component.
 */
export default function DietaryRestrictions() {
  const [loading, setLoading] = useState(false);
  const [dietary_restrictions, setDietaryRestrictions] = useState([]);
  const [newRestriction, setNewRestriction] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { userId } = useAuth();
  const router = useRouter();

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

  /**
   * Handles the addition of a dietary restriction.
   */
  const handleAddRestriction = () => {
    if (newRestriction.trim() === '') return;

    const normalizedRestriction = newRestriction.trim().toUpperCase();

    // Check for duplicate restrictions
    if (dietary_restrictions.includes(normalizedRestriction)) {
      setErrMsg('This restriction has already been added.');
      return;
    }

    // Check for "halal" and "vegetarian" restrictions
    const restrictedRestrictions = ['HALAL', 'VEGETARIAN'];
    if (restrictedRestrictions.includes(normalizedRestriction)) {
      setErrMsg('Adding HALAL or VEGETARIAN as a restriction is not allowed.');
      return;
    }

    const updatedRestrictions = [...dietary_restrictions, normalizedRestriction];
    setDietaryRestrictions(updatedRestrictions);
    setNewRestriction('');
  };

  /**
   * Handles the deletion of a dietary restriction.
   * @param {string} restriction - The dietary restriction to be deleted.
   */
  const handleDeleteRestriction = (restriction) => {
    const updatedRestrictions = dietary_restrictions.filter((item) => item !== restriction);
    setDietaryRestrictions(updatedRestrictions);
  };

  /**
   * Handles the submission of dietary restrictions.
   */
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
    router.push('../(home)/profile');
  };

  /**
 * Handles the input change in the Dietary Restrictions TextInput.
 * @param {string} text - The input text value.
 */
  const handleInputChange = (text) => {
    setNewRestriction(text);
    setErrMsg(''); // Clear the error message when text changes
  };


  return (
    <ScrollView style={styles.wholeThing}>
      <Text style={styles.header}>Dietary Restrictions:</Text>
      <Text style={styles.warning}>Note: Please do not put halal and vegetarian as your dietary restrictions.</Text>
      <Text style={styles.warning2}>Currently, we only take into account fish, shellfish, lamb, beef, pork, chicken, eggs, diary, gluten, soy, peanuts.</Text>
      <Text style={styles.bold}>Dietary restrictions or allergies declared:</Text>
      {dietary_restrictions.length > 0 ? (
        dietary_restrictions.map((restriction, index) => (
          <View key={index} style={styles.restrictionContainer}>
            <Text style={styles.restrictionText}>{restriction}</Text>
            <Button onPress={() => handleDeleteRestriction(restriction)}>Delete</Button>
          </View>
        ))
      ) : (
        <View style={styles.restrictionContainer}>
          <Text style={styles.restrictionText}>No dietary restrictions have been declared</Text>
        </View>
      )}
      <Text style={styles.bold}>Update your dietary restrictions or food allergies:</Text>
      <TextInput
        value={newRestriction}
        onChangeText={handleInputChange}
        style={styles.input}
      />
      <Button style={styles.buttonContainer} onPress={handleAddRestriction}>
        <Text style={styles.button}>Add Restriction</Text>
      </Button>
      <Button style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.button}>Update Dietary Restrictions</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.errormsg}>{errMsg}</Text>}
      {loading && <ActivityIndicator style={styles.indicator} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 15,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#FFECF6',
  },
  wholeThing: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFF5FA',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginTop: 20,
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
    marginBottom: 5,
    backgroundColor: '#FFECF6',
    height: 40,
  },
  restrictionText: {
    fontSize: 15,
    color: 'black',
    marginHorizontal: 5,
  },
  errormsg: {
    marginTop: 10,
    color: 'red',
  },
  warning: {
    color: 'red',
    marginTop: 10,
    marginBottom: 5,
  },
  warning2: {
    color: 'red',
    marginBottom: 5,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
});
