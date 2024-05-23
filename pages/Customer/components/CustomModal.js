import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomModal = ({ visible, onClose, items, isAdmin }) => {
  const navigation = useNavigation();

  const navigateToPage = pageName => {
    onClose();
    navigation.navigate('customerInformation', { ...items, pageName });
  };

  const CustomButton = ({ text, onPress, color }) => (
    <TouchableOpacity
      style={[styles.button, color && { backgroundColor: color }]}
      onPress={onPress}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Choose any</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>x</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <CustomButton
              text="Rate"

              onPress={() => navigateToPage('customerRate')}
            />
            <CustomButton
              text="Jobs"
              onPress={() => navigateToPage('jobRate')}
            />
            <CustomButton
              text="Payments"
              onPress={() => navigateToPage('customerPayment')}
            />
          </View>
          {isAdmin && <View style={styles.buttonRow}>
            <CustomButton
              text="Edit"
              onPress={() => navigateToPage('edit')}
            />
            <CustomButton
              text="Delete"
              color="#ca1616"
              onPress={() => navigateToPage('delete')}
            />
          </View>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5, // Android shadow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginVertical: 5,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 70,
    backgroundColor: "#0f0f07"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomModal;
