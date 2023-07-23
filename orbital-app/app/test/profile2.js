import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from "react-native-paper";

/**
 * Displays the user's profile information.
 * @param {Object} userData - The user's data containing `image` and `username`.
 * @param {Function} onUpdateProfile - Callback function for handling the update profile button press event.
 * @param {Function} onRestrictions - Callback function for handling the dietary restrictions button press event.
 * @param {Function} onReview - Callback function for handling the reviews button press event.
 * @param {Function} onSaved - Callback function for handling the saved button press event.
 * @param {Function} onSignOut - Callback function for handling the sign out button press event.
 * @returns {JSX.Element} The UserProfile component.
 */
const UserProfile = ({
    userData,
    onUpdateProfile,
    onRestrictions,
    onReview,
    onSaved,
    onSignOut,
}) => {
    const { image, username } = userData;

    return (
        <View style={styles.wholeThing}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.username}>{username}</Text>
            <Button onPress={onUpdateProfile} testID="update-profile-button">
                Update Profile
            </Button>

            <Button onPress={onRestrictions} testID="restrictions-button">
                Dietary Restrictions
            </Button>

            <Button onPress={onReview} testID="reviews-button">
                Reviews
            </Button>

            <Button onPress={onSaved} testID="saved-button">
                Saved
            </Button>

            <Button onPress={onSignOut} testID="sign-out-button">
                Log Out
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    wholeThing: {
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: "#FFF5FA",
        flex: 1,
        paddingHorizontal: 15,
    },
    image: {
        alignSelf: "center",
        width: 200,
        height: 200,
        marginTop: 30,
        marginBottom: 25,
        borderRadius: 100,
    },
    username: {
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 25,
        marginBottom: 15,
    },
});

export default UserProfile;