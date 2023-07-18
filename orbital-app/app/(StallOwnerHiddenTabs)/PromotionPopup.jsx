import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * PromotionPopup component displays a modal popup showing promotions.
 *
 * @param {Array} promotions - An array of promotions to be displayed in the popup.
 * @returns {JSX.Element} The rendered PromotionPopup component.
 */
const PromotionPopup = ({ promotions }) => {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  /**
   * Handles the press event when the "View Promotions" button is pressed.
   * Navigates to the promotions page.
   */
  const handlePromotionPress = () => {
    router.push('/(home)/Promotions');
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Promotions:</Text>
            {promotions.length > 0 ? (
              promotions.map((promotion, index) => (
                <View key={index}>
                  <Text style={styles.promotionTitle}>{promotion.title}</Text>
                  <Text>
                    <Text style={styles.promotionLabel}>Valid from: </Text>
                    <Text style={styles.promotionValue}>
                      {promotion.start_date} to {promotion.end_date}
                    </Text>
                  </Text>
                  <View style={styles.separator} />
                </View>
              ))
            ) : (
              <Text style={styles.noPromotion}>No promotions available.</Text>
            )}
            <TouchableOpacity style={styles.viewPromotionsButton} onPress={handlePromotionPress}>
              <Text style={styles.viewPromotionsButtonText}>View Promotions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    borderColor: '#FFBBDF',
    borderWidth: 0.5,
    backgroundColor: '#FFF5FA',
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    width: '80%',
  },
  modalTitle: {
    marginHorizontal: 80,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promotionLabel: {
    fontWeight: 'bold',
  },
  promotionValue: {
    marginLeft: 5,
    color: '#2C0080',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginVertical: 10,
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#FFECF6',
    borderColor: '#FFBBDF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    marginHorizontal: 100,
  },
  closeButtonText: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  viewPromotionsButton: {
    backgroundColor: '#FFECF6',
    borderColor: '#FFBBDF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
    marginHorizontal: 70,
  },
  viewPromotionsButtonText: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  noPromotion: {
    color: '#2C0080',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
    marginLeft: 15,
  }
});

export default PromotionPopup;
