import { Image, View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link } from "expo-router";

export default function userOrOwner() {
    return (
        <View style={styles.container}>
            <Image 
            style={styles.logo} 
            source={require('../../assets/logo.png')} />
            
            <Text style={styles.first}> Log In as </Text>
            <Link href="/login"> 
            <Button style={styles.buttonContainer}>User</Button>
            </Link>
            <Link href="/login"> 
            <Button style={styles.buttonContainer}>Stall owner</Button>
            </Link>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      /*backgroundColor: '#fff',*/
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 200,
      alignSelf: 'center',
    },
    first: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    buttonContainer: {
      backgroundColor: 'pink',
      borderWidth: 5,
      borderLeftWidth: 10,
      borderRightWidth: 10,
    },
  });