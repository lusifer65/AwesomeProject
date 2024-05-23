import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../../../src/components/InputField/InputFields';
import Loader from '../../../src/components/Loader';
import { postRequest } from '../../../src/utils';
import { ADD_CUSTOMER, BASE_URL } from '../../../src/constant';
import axios from 'axios';

const AddCustomer = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [inputError, setInputError] = useState({ phone: false, name: false });
    const [loading, setLoading] = useState(false)
    const addCustomer = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('phone', phone);
        bodyFormData.append('name', name);

        if (name && phone && phone.length === 10) {
            setLoading(true)
            axios({
                method: 'post',
                url: `${BASE_URL}${ADD_CUSTOMER}`,
                data: bodyFormData,
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(response => {
                    const { data } = response;
                    const { message, myData, status } = data;
                    if (status == 0) {
                        console.log('Unable to add');
                        setInputError({ phone: true, name: true });
                    } else {
                        console.log('Add Customer Success');
                        navigation.navigate('customer');
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        else {
            setInputError({ phone: !phone || phone.length < 10, name: !name });
        }
    };

    const handleAdd = () => {
        addCustomer()
    };

    if (loading) {
        <Loader />
    }

    return (
        <View>
            <Text style={styles.headerText}>Add Customer</Text>
            <View style={styles.container}>
                <InputField
                    showLabel
                    label={'Name'}
                    onChangeText={text => {
                        setName(text)
                        setInputError({ ...inputError, name: false })
                    }}
                    isError={inputError.name}
                />
                <InputField
                    showLabel
                    label={'Phone Number'}
                    isNumber
                    maxLength={10}
                    onChangeText={text => {
                        setPhone(text)
                        setInputError({ ...inputError, phone: false })
                    }}
                    isError={inputError.phone}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.textStyle}>Add</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        marginTop: 16,
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    container: {
        padding: 16,
        gap: 16,
    },
    button: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 15,
        minWidth: 70,
        backgroundColor: '#0f0f07',
        alignSelf: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AddCustomer;
