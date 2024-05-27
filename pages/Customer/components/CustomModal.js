import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL, DELETE_CUSTOMER } from '../../../src/constant';
import ConfirmPopup from '../../../src/components/ConfirmPopup';

const CustomModal = ({ visible, onClose, items, isAdmin }) => {

  const [openModal, setOpenModal] = useState(false)
  const navigation = useNavigation();
  const navigateToPage = pageName => {
    onClose();
    navigation.navigate('customerInformation', { ...items, pageName,isAdmin });
  };

  const handleDelete = () => {
    const bodyFormData = new FormData();
    bodyFormData.append('customer_id', items?.cust_id);
    axios({
      method: 'post',
      url: `${BASE_URL}${DELETE_CUSTOMER}`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => {
        const { data } = response;
        const { message, data: userData, status } = data;
        if (status == 0) {
          console.log('Unable to delete user');
        } else {
          ToastAndroid.show('Delele successfully', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      }).finally(() => {
        setOpenModal(false)
        onClose()
      })


  }


  const CustomButton = ({ text, onPress, color }) => (
    <TouchableOpacity
      style={[styles.button, color && { backgroundColor: color }]}
      onPress={onPress}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <>
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
                onPress={() => {
                  onClose();
                  navigation.navigate('addCustomer', { isEdit: true, ...items })
                }}
              />
              <CustomButton
                text="Delete"
                color="#ca1616"
                onPress={() => {
                  // onClose()
                  setOpenModal(true)
                }}
              />
            </View>}
          </View>
        </View>
      </Modal>
      {openModal && <ConfirmPopup
        showModal={openModal}
        setShowModal={setOpenModal}
        onPressHandler={handleDelete}
        btnText={'Delete'}
        text={`Delete ${items.name}`}
      />}
    </>
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
