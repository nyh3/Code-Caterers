import { Image, View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

export default function ReviewPage() {
    return (
        <View>
            <Text style={styles.header}>
                Reviews:
            </Text>
            <Text style={styles.ratings}> 
                Ratings: use database to calculate overall ratings
            </Text>
            <Text normal={styles.normal}>
                Reviews listed below:
                Taken from database
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 15,
    },
    ratings: {
        fontWeight: 'bold',
        fontSize: 18,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
    normal: {
        fontSize: 20,
        margin: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
  });