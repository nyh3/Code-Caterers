import { View, Text, Image, ActivityIndicator, FlatList, Button, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function MenuDetailScreen() {
  const menuId = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMenuDetails();
    fetchReviews();
  }, []);

  const fetchMenuDetails = async () => {
    console.log(menuId);
    try {
      const { data, error } = await supabase
        .from('Menu')
        .select('*')
        .eq('id', menuId.id)
        .single();

      if (error) {
        console.error('Error fetching menu details:', error.message);
        return;
      }
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  const fetchReviews = async () => {
    try{
      const { data: reviewsData, error: reviewsError } = await supabase
      .from('review')
      .select('*')
      .eq('menu_id', menuId.id);

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError.message);
        return;
      }
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };

  if (!menu) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleAddReview = (menu) => {
    router.push({ pathname: '/newReview', params: { id: menu } });
  };
    
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: menu.image }} style={styles.image} />
      <Text>{menu.name}</Text>
      <Button title="Add Review" onPress={() => handleAddReview(menu.id)} style={styles.buttonContainer}/>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Rating: {item.rating}</Text>
            <Text>Comment: {item.review_text}</Text>
            {/* Add more details here */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    color: '#2C0080',
},
image: {
    width: 200,
    height: 200,
    marginBottom: 15,
},
})  