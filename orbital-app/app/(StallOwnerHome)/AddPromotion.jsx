import { View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link } from 'expo-router';

export default function AddPromotionPage() {
    return (
        <View>
            <Text style={styles.header}>
                Add Promotions:
            </Text>
            <Link href="../(StallOwnerHome)/AddPromotionForm">
                <Button>Add Promotions</Button>
            </Link>
            <Text style={styles.normal}>
                Previously added promotions: take from database?
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
    normal: {
        fontSize: 15,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
  });
  