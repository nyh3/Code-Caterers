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

  const formatPromotionDuration = () => {
    const startDate = new Date(promotion.start_date);
    const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    if (endDate) {
      return ` ${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else {
      return ` ${formatDate(startDate)} to No end date`;
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
      <View style={styles.promotionDetails}>
        <Text style={styles.title}>{promotion.title}</Text>
        <Text style={styles.description}>{promotion.description}</Text>
        <Text style={styles.title}>Available at:</Text>
        <Text style={styles.location}> {promotion.stall.name}, {promotion.stall.location.name}</Text>
        <Text>
          <Text style={styles.duration}>
            Valid from:
          </Text>
          <Text style={styles.promotionValue}>
            {formatPromotionDuration()}
          </Text>
        </Text>
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
    width: 150,
    height: 150,
    marginBottom: 25,
    borderRadius: 30,
  },
  promotionDetails: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
    textAlign: 'center',
  },
  duration: {
    fontSize: 16,
  },
  promotionValue: {
    color: '#2C0080',
    fontSize: 16,
  },
  location: {
    fontWeight: 'bold',
    fontSize: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    color: '#2C0080',
    marginTop: 10,
    marginBottom: 15,
  }
});
