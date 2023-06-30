import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ViewReviewScreen() {
  const promotionId = useSearchParams();
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    fetchPromotionDetails();
  }, []);

  const fetchPromotionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('promotion')
        .select('*, stall ( name, location ( name ) )')
        .eq('id', promotionId.id)
        .single();

      if (error) {
        console.error('Error fetching promotion details:', error.message);
        return;
      }
      console.log('help', data);
      setPromotion(data);
    } catch (error) {
      console.error('Error fetching review details:', error.message);
    }
  };

  if (!promotion) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
      <View style={styles.promotionDetails}>
        <Text style={styles.title}>{promotion.title}</Text>
        <Text style={styles.title}>Only at: {promotion.stall.name} @ {promotion.stall.location.name}</Text>
        <Text style={styles.description}>{promotion.description}</Text>
        <Text>Promotion Duration:</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  promotionImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  promotionDetails: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
});
