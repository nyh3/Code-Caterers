import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';

export default function AddPromotionPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const isFocused = useIsFocused();
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    fetchMenuItems();
  }, [isFocused]);

  const removeTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  
  const fetchMenuItems = async () => {
    const { data: stallId, error } = await supabase
      .from('stall')
      .select('id')
      .eq('owner_id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching stall id:', error.message);
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('promotion')
        .select('*')
        .eq('stall_id', stallId.id);
  
      if (error) {
        console.error('Error fetching promotion details:', error.message);
        return;
      }
  
      const currentDate = removeTime(new Date());
      const updatedMenuItems = data.map((item) => {
        const startDate = removeTime(new Date(item.start_date));
        const endDate = removeTime(new Date(item.end_date));
        let validity = null;
  
        if (startDate <= currentDate && endDate >= currentDate) {
          validity = 'ongoing';
        } else if (endDate < currentDate) {
          validity = 'expired';
        } else if (startDate > currentDate) {
          validity = 'upcoming';
        }
  
        return { ...item, validity };
      });
  
      setMenuItems(updatedMenuItems);
    } catch (error) {
      console.error('Error fetching promotion details:', error.message);
    }
  };

  const handlePromotionPress = (promotion) => {
    router.push({ pathname: '/Edit_Promotion', params: { id: promotion } });
  };

  const handleFilterPress = (filterType) => {
    setFilter(filterType);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePromotionPress(item.id)}>
      <View style={styles.promotion}>
        <Image source={{ uri: item.image }} style={styles.promotionImage} />
        <View style={styles.promotionDetails}>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionDescription}>{item.description}</Text>
          <View style={styles.promotionValidity}>
            <Text
              style={[
                styles.validityLabel,
                { backgroundColor: item.validity === 'ongoing' ? '#9AD4C6' :item.validity === 'expired' ? '#FF847C': item.validity === 'upcoming' ? '#A3D8E6':'grey' },
              ]}
            >
              {item.validity}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredMenuItems =
  filter === 'ongoing'
    ? menuItems.filter((item) => item.validity === 'ongoing')
    : filter === 'expired'
    ? menuItems.filter((item) => item.validity === 'expired')
    : filter === 'upcoming'
    ? menuItems.filter((item) => item.validity === 'upcoming')
    : menuItems;

  return (
    <View style={styles.container}>
      <Text></Text>
      <Link href="../(StallOwnerHiddenTabs)/Promotion_Form">
        <Button mode="contained" style={styles.buttonContainer}>
          <Text style={styles.buttons}>Add Promotions</Text>
        </Button>
      </Link>
      <Text style={styles.heading}>Promotions:</Text>
      <View style={styles.filterButtonsContainer}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterButtonsScrollView}
  >
    <View style={styles.buttonWrapper}>
      <Button
        mode={filter === 'all' ? 'contained' : 'outlined'}
        onPress={() => handleFilterPress('all')}
        style={[styles.buttonContainer]}
      >
        <Text style={styles.buttons}>All</Text>
      </Button>
    </View>
    <View style={styles.buttonWrapper}>
      <Button
        mode={filter === 'ongoing' ? 'contained' : 'outlined'}
        onPress={() => handleFilterPress('ongoing')}
        style={[styles.buttonContainer]}
      >
        <Text style={styles.buttons}>Ongoing</Text>
      </Button>
    </View>
    <View style={styles.buttonWrapper}>
      <Button
        mode={filter === 'expired' ? 'contained' : 'outlined'}
        onPress={() => handleFilterPress('expired')}
        style={[styles.buttonContainer]}
      >
        <Text style={styles.buttons}>Expired</Text>
      </Button>
    </View>
    <View style={styles.buttonWrapper}>
      <Button
        mode={filter === 'upcoming' ? 'contained' : 'outlined'}
        onPress={() => handleFilterPress('upcoming')}
        style={[styles.buttonContainer]}
      >
        <Text style={styles.buttons}>Upcoming</Text>
      </Button>
    </View>
  </ScrollView>
</View>

      <FlatList
        data={filteredMenuItems}
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
    marginVertical: 15,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    marginRight: 10,
  },
  promotionList: {
    paddingBottom: 20,
  },
  promotion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECF6',
    padding: 15,
    borderColor: '#FFF5FA',
    borderWidth: 7,
    borderRadius: 10,
  },
  promotionImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  promotionDetails: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  promotionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  promotionDescription: {
    marginBottom: 7,
  },
  promotionValidity: {
    flexDirection: 'row',
  },
  buttonContainer: {
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    marginRight: 15, 
    minWidth: 80, 
    height: 45,
  },
  buttons: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  validityLabel: {
    borderRadius: 20,
    color: '#FFFFFF',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
});
