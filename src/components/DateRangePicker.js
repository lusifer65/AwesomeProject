import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DateRangePicker = ({ visible, onClose, salesman_id }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const navigation = useNavigation()

  const findHandler = () => {
    onClose()
    navigation.navigate('sales_report1', { fromDate: formatDate(fromDate), toDate: formatDate(toDate), id: salesman_id })
  }

  const handleConfirmFromDate = (date) => {
    setShowFromDatePicker(false);
    setFromDate(date);
  };

  const handleConfirmToDate = (date) => {
    setShowToDatePicker(false);
    setToDate(date);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>x</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 24, }}>

            <View>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.dateInput}
              >
                <Text>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showFromDatePicker}
                date={fromDate}
                onConfirm={handleConfirmFromDate}
                onCancel={() => setShowFromDatePicker(false)}
                mode="date"
                maximumDate={new Date()}
              />

            </View>
            <View>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.dateInput}
              >
                <Text>{formatDate(toDate)}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showToDatePicker}
                date={toDate}
                onConfirm={handleConfirmToDate}
                onCancel={() => setShowToDatePicker(false)}
                mode="date"
              />

            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              findHandler()
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Find</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DateRangePicker;
