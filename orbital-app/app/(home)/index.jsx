import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function StallPage() {
    const [stalls, setStalls] = useState([]);
    const isFocused = useIsFocused();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStalls();
    }, [isFocused]);

    const fetchStalls = async () => {
        try {
            const { data, error } = await supabase.from('Stall').select('*').ilike('name', `%${searchQuery}%`);
            if (error) {
                console.error('Error fetching stall details:', error.message);
                return;
            }
            setStalls(data);
        } catch (error) {
            console.error('Error fetching stall details:', error.message);
        }
    };

    const handleStallPress = (stall) => {
        router.push('../(Stalls)/stallDetails', { stall });
    };

    const renderStall = ({ item }) => (
        <TouchableOpacity onPress={() => handleStallPress(item)}>
            <View style={styles.stall}>
                <Image source={{ uri: item.image }} style={styles.stallImage} />
                <View style={styles.stallDetails}>
                    <Text style={styles.stallTitle}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Stalls:</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={stalls}
                renderItem={renderStall}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.stallList}
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
        marginHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    stallList: {
        paddingBottom: 20,
    },
    stall: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    stallImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    stallDetails: {
        flex: 1,
    },
    stallTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    stallDescription: {
        marginBottom: 5,
    },
});
