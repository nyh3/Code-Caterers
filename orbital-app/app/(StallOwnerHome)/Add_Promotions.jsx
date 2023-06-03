import { View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link } from 'expo-router';

export default function AddPromotionPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Add Promotions:
            </Text>
            <Link href="(StallOwnerHome)/Promotion_Form">
                <Button style={styles.buttonContainer}><Text style={styles.buttons}>Add Promotions</Text></Button>
            </Link>
            <Text style={styles.normal}>
                Previously added promotions: list it, take from database?
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF5FA',
      justifyContent: 'flex-start',
      marginHorizontal: 10,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 15,
    },
    normal: {
        fontSize: 15,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        borderWidth: 1,
        //borderColor: '#FFBBDF',
        marginTop: 5,
      },
    buttons: {
        marginHorizontal: 5,
        marginVertical: 5,
        color: '#2C0080',
    }
  });
  