import { useState } from "react";
import { View, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function ProfileSetupScreen() {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const router = useRouter();

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowingEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            setProfileImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(profileImage);
            const blob = await response.blob();
            const { data, error } = await supabase.storage
                .from('ProfileImage')
                .upload('ProfileImage/${username}', blob, {
                    cacheControl: '3600',
                });

        await supabase.from('profiles').upsert([
            {
                username,
                profilePictureUrl: data.key,
            },
        ]);

        const { error2 } = await supabase
            .from('users')
            .update({ is_set_up_complete: true })
            .single();

            if (error2) {
                console.error(error2);
                return;
            }

        Alert.alert('Profile setup completed!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
        router.replace('/');
    };

    return (
        <View>
            <TextInput
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername} />
            {profileImage && (
                <Image
                    source={{ uri: profileImage }}
                    style={{ width: 200, height: 200 }}
                />
            )}
            <Button title="Choose Profile Picture" onPress={handleImagePicker}></Button>
            <Button title="Submit" onPress={handleSubmit}></Button>
        </View>
    )
}