import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
    try {
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
    <View style={styles.container}>
      <Image source={{ uri: menu.image }} style={styles.image} />
      <Text style={styles.menuName}>{menu.name}</Text>
      <TouchableOpacity onPress={() => handleAddReview(menu.id)} style={styles.buttonContainer}><Text style={styles.button}>Add Review</Text></TouchableOpacity>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
            <Text style={styles.comment}>Comment: {item.review_text}</Text>
            {/* Add more details here */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    height: 40,
  },
  button: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    color: '#2C0080',
    fontWeight: 'bold',
    marginTop: 7,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
  },
  menuName: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  rating: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 15,
  },
  comment: {
    fontSize: 14,
  }
})  