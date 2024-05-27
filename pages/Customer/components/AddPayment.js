import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ADD_PAYMENT, BASE_URL } from '../../../src/constant';
import axios from 'axios';

const AddPayment = ({ setLoading, customerId, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [mode, setMode] = useState('');

  const addPayment = () => {
    setLoading(true);
    const bodyFormData = new FormData();
    bodyFormData.append('customer_id', customerId);
    bodyFormData.append('amount', amount);
    bodyFormData.append('discount', discount);
    bodyFormData.append('mode', mode.split(0));

    axios({
      method: 'post',
      url: `${BASE_URL}${ADD_PAYMENT}`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => {
        const { data } = response;
        const { status } = data;
        if (status == 0) {
          console.log('Unable to add Payment');
        } else {
          console.log('Add Payment Successfully');
          onSubmit()
        }
      })
      .catch(error => {
        console.error('Error submitting Payment:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const onSubmitHandler = () => {
    if (amount && mode && discount) {
      addPayment()
      setMode('');
      setAmount('');
      setDiscount('');

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Payment</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Qty"
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Discount"
          value={discount}
          onChangeText={(text) => setDiscount(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <Picker
          style={styles.picker}
          selectedValue={mode}
          onValueChange={setMode}
        >
          <Picker.Item label="Mode" value="" />
          <Picker.Item label="Cash" value="C" />
          <Picker.Item label="Bank" value="B" />
          <Picker.Item label="Online" value="O" />

        </Picker>
      </View>
      <TouchableOpacity onPress={onSubmitHandler} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerText: {
    paddingBottom: 4,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap:8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    flex: 1,
  },
  picker: {
    flex: 2,
    height: 40,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default AddPayment;
