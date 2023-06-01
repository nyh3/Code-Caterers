import { View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { Link } from 'expo-router';

export default function AddPromotionPage() {
    return (
        <View>
            <Text style={styles.header}>
                Add Promotions:
            </Text>
            <Button onPress={handleAddImage}>Insert Promotion Image</Button>
           <Link href="../(StallOwnerHome)/AddPromotionForm">
                <Button>Add Promotion</Button>
            </Link>   
            <Text style={styles.header}>
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
        fontSize: 34,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
  });
  