import { Image, View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link, useRouter } from "expo-router";
import { useContext } from "react";
import { GroupContext } from "../../contexts/group";

export default function UserOrOwner() {
  const { group, setGroup } = useContext(GroupContext);
  const router = useRouter();

  const handleUser = async() => {
    console.log(group);
    setGroup('User');
    router.replace("/loginUser");
  }

  const handleOwner = async() => {
    console.log(group);
    setGroup('Owner');
    router.replace("/loginOwner");
  }
     return (
        <View style={styles.container}>
            <Image 
            style={styles.logo} 
            source={require('../../assets/logo.png')} />
            
            <Text style={styles.header}> Login Portal </Text>
            <Button style={styles.buttonContainer} onPress={handleUser}><Text style={styles.button}>User</Text></Button>
            
            <Button style={styles.buttonContainer} onPress={handleOwner}><Text style={styles.button}>Stall Owner</Text></Button>
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