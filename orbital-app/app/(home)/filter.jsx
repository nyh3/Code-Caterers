import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

export default function FilterPage() {
    return (
        <View>
            <Text>
                This is the filter page
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
    logo: {
      width: 200,
      height: 200,
    },
  });