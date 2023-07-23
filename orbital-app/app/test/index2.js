import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Function to get the cuisine tag color
const getCuisineTagColor = (cuisineName) => {
    switch (cuisineName) {
        case 'Chinese':
            return '#FFD700'; // Gold color for Chinese cuisine
        case 'Western':
            return '#6495ED'; // Cornflower blue color for Western cuisine
        case 'Malay':
            return '#228B22'; // Forest green color for Malay cuisine
        case 'Indian':
            return '#FF4500'; // Orange-red color for Indian cuisine
        case 'Japanese':
            return '#FF69B4'; // Hot pink color for Japanese cuisine
        case 'Korean':
            return '#CD5C5C'; // Indian red color for Korean cuisine
        case 'Thai':
            return '#FFA500'; // Orange color for Thai cuisine
        default:
            return '#CCCCCC'; // Default color if cuisine name doesn't match any specific case
    }
};

export default function StallPage({ stalls, handleStallPress }) {
    const renderStall = (stall) => (
        <TouchableOpacity key={stall.id} onPress={() => handleStallPress(stall)}>
            <View style={styles.stallContainer}>
                <Image source={{ uri: stall.stallImage }} style={styles.stallImage} />
                <View style={styles.stallDetails}>
                    <Text style={styles.stallTitle}>{stall.name} @ {stall.location.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{parseFloat(stall.rating) || 0} / 5.0</Text>
                    </View>
                    <View style={styles.cuisineTagsContainer}>
                        <Text style={[styles.cuisineTag, { backgroundColor: getCuisineTagColor(stall.cuisine.name) }]}>
                            {stall.cuisine.name}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {stalls.map((stall) => renderStall(stall))}
        </View>
    );
}

const styles = StyleSheet.create({
    // Styles for StallPage
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 10,
    },
    stallContainer: {
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    stallImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    stallDetails: {
        padding: 10,
    },
    stallTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 16,
    },
    cuisineTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    cuisineTag: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 5,
        marginRight: 5,
        fontWeight: 'bold',
        fontSize: 12,
    },
});
