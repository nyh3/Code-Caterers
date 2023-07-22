import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function UserOrOwner() {
    const [selectedGroup, setSelectedGroup] = useState(''); // Local state to track the selected group

    const handleUser = () => {
        setSelectedGroup('User');
    };

    const handleOwner = () => {
        setSelectedGroup('Owner');
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/logo.png')} />

            <Text style={styles.header}>Login Portal</Text>
            <Button
                style={[
                    styles.buttonContainer,
                    selectedGroup === 'User' && styles.selectedButton, // Apply different styles for selected button
                ]}
                onPress={handleUser}
            >
                <Text style={styles.button}>User</Text>
            </Button>
            <Button
                style={[
                    styles.buttonContainer,
                    selectedGroup === 'Owner' && styles.selectedButton, // Apply different styles for selected button
                ]}
                onPress={handleOwner}
            >
                <Text style={styles.button}>Stall Owner</Text>
            </Button>
        </View>
    );
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
        marginBottom: 35,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        padding: 5,
        borderWidth: 1,
        borderColor: '#FFBBDF',
        marginBottom: 10,
    },
    selectedButton: {
        backgroundColor: '#2C0080', // Apply a different background color for the selected button
    },
    button: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#2C0080',
    },
});
