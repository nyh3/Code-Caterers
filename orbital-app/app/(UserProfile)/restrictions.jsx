import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';

// Icons for dietary restrictions
const restrictionIcons = {
  CHICKEN: '🍗',
  PORK: '🥓',
  BEEF: '🥩',
  LAMB: '🐑',
  FISH: '🐟',
  SHELLFISH: '🦀',
  DAIRY: '🥛',
  EGGS: '🥚',
  PEANUTS: '🥜',
  GLUTEN: '🌾',
  SOY: '🍱',
  SPICY: '🌶️',
};

/**
 * Component for managing dietary restrictions and allergies.
 * @returns {JSX.Element} The DietaryRestrictions component.
 */
export default function DietaryRestrictions() {
  const [loading, setLoading] = useState(true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
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
          setLoading(false);
          return;
        }
        const restrictions = data[0]?.dietary_restrictions || [];
        setDietaryRestrictions(restrictions);
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving dietary restrictions:', error.message);
        setLoading(false);
      }
    };
    fetchDietaryRestrictions();
  }, []);

  /**
   * Handles the addition and removal of a dietary restriction.
   * @param {string} restriction - The dietary restriction to be toggled.
   */
  const handleToggleRestriction = (restriction) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions((prev) => prev.filter((r) => r !== restriction));
    } else {
      setDietaryRestrictions((prev) => [...prev, restriction]);
    }
  };

  /**
   * Handles the submission of dietary restrictions.
   */
  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profile')
      .update({ dietary_restrictions: dietaryRestrictions })
      .eq('id', userId);

    if (error) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    router.push('../(home)/profile');
  };

  // Function to render each dietary restriction as a grid item
  const renderDietaryRestrictionItem = (restriction) => (
    <TouchableOpacity
      key={restriction}
      style={[
        styles.restrictionContainer,
        dietaryRestrictions.includes(restriction) && styles.selectedGridItem,
      ]}
      onPress={() => handleToggleRestriction(restriction)}
    >
      <View style={styles.restrictionIconContainer}>
        <Text style={styles.restrictionIcon}>{restrictionIcons[restriction]}</Text>
      </View>
      <Text style={styles.restrictionText}>{restriction}</Text>
    </TouchableOpacity>
  );

  const gridItemWidth = `${(100 / 3).toFixed(2)}%`;
  const spacingBetweenItems = 5;

  return (
    <ScrollView style={styles.wholeThing}>
      <Text style={styles.header}>Dietary Restrictions:</Text>
      <Text style={styles.bold}>Dietary restrictions or allergies declared:</Text>
      <View style={styles.gridContainer}>
        {Object.keys(restrictionIcons).map((restriction) => (
          <View
            key={restriction}
            style={{ width: gridItemWidth, marginBottom: spacingBetweenItems }}
          >
            {renderDietaryRestrictionItem(restriction)}
          </View>
        ))}
      </View>
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
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  button: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  restrictionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: '#FFF5FA',
    borderRadius: 30,
    padding: 10,
    height: 100,
  },
  restrictionIconContainer: {
    borderRadius: 20,
    },
  restrictionIcon: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
  },
  restrictionText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  selectedGridItem: {
    backgroundColor: '#FFD9E8',
  },
});
