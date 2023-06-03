import { Image, View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link } from "expo-router";

export default function userOrOwner() {
    return (
        <View style={styles.container}>
            <Image 
            style={styles.logo} 
            source={require('../../assets/logo.png')} />
            
            <Text style={styles.header}> Login Portal </Text>
            <Link href="/login"> 
            <Button style={styles.buttonContainer}><Text style={styles.button}>User</Text></Button>
            </Link>
            <Text></Text> 
            <Link href="/login"> 
            <Button style={styles.buttonContainer}><Text style={styles.button}>Stall Owner</Text></Button>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF5FA',
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginVertical: 30,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 30,
    },
    buttonContainer: {
      backgroundColor: '#FFECF6',
      borderWidth: 5,
      borderLeftWidth: 10,
      borderRightWidth: 10,
    },
    button: {
      fontWeight: 'bold',
      fontSize: 15,
      color: '#2C0080',
    }
  });