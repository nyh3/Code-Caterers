import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';

/**
 * Displays the list of recent promotions and deals.
 * @returns {JSX.Element} The PromotionPage component.
 */
export default function PromotionPage() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    /**
     * Fetches the list of menu items (promotions) - Remove the database-related code for integration testing.
     */
    const fetchMenuItems = async () => {
        const mockMenuItems = [
            {
                id: 1,
                title: 'Promotion 1',
                image: 'image_url_1',
                start_date: '2023-07-20',
                end_date: '2023-07-25',
            },
            {
                id: 2,
                title: 'Promotion 2',
                image: 'image_url_2',
                start_date: '2023-07-22',
                end_date: '2023-07-28',
            },
        ];

        setMenuItems(mockMenuItems);
    };

    const handlePromotionPress = (promotionId) => {
    };

    /**
     * Renders a single promotion item.
     * @param {object} item - The promotion item to render.
     * @returns {JSX.Element} The rendered promotion item component.
     */
    const renderMenuItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePromotionPress(item.id)}>
            <View style={styles.promotion}>
                <Image source={{ uri: item.image }} style={styles.promotionImage} testID={`promotionImage_${item.id}`} />
                <View style={styles.text}>
                    <Text style={styles.promotionTitle}>{item.title}</Text>
                    <Text>
                        <Text style={styles.promotionLabel}>Valid from: </Text>
                        <Text style={styles.promotionValue}>
                            {item.start_date} to {item.end_date}
                        </Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Recent Promotions & Deals:</Text>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.promotionList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#FFF5FA',
        flex: 1,
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 15,
    },
    promotionList: {
        paddingBottom: 20,
    },
    promotion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFECF6',
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 5,
        borderColor: '#FFF5FA',
        borderWidth: 2,
        borderRadius: 10,
    },
    promotionImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginRight: 15,
    },
    promotionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    promotionDescription: {
        marginBottom: 5,
    },
    promotionLabel: {
        fontWeight: 'bold',
    },
    promotionValue: {
        marginLeft: 5,
        color: '#2C0080',
    },
    text: {
        flexDirection: 'column',
        flex: 1,
    },
});
