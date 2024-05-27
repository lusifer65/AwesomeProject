import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ADD_JOBS, BASE_URL, EDIT_JOB } from '../../../src/constant';

const AddJob = ({ allSalesman, setLoading, customerId, onSubmit, selectCustomer, isEdit, setSelectCustomer }) => {
    const [qty, setQty] = useState('');
    const [category, setCategory] = useState('');
    const [salesman, setSalesman] = useState('');

    useEffect(() => {
        if (isEdit && selectCustomer) {
            setQty(selectCustomer.qty.toString());
            setCategory(selectCustomer.category);
            setSalesman(selectCustomer.salesman_id);
        }
    }, [selectCustomer, isEdit]);

    const addJob = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('customer_id', customerId);
        bodyFormData.append('category', category);
        bodyFormData.append('qty', qty);
        bodyFormData.append('salesman_id', salesman);
        if (isEdit) {
            bodyFormData.append('slno', selectCustomer.slno);
        }

        axios.post(`${BASE_URL}${isEdit ? EDIT_JOB : ADD_JOBS}`, bodyFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                if (data.status === 0) {
                    console.log('Unable to add Job');
                } else {
                    console.log('Job added successfully');
                    ToastAndroid.show(`${isEdit ? 'Edit' : 'Add'} Job successfully`, ToastAndroid.SHORT);
                    onSubmit();
                }
            })
            .catch(error => {
                console.error('Error submitting job:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onSubmitHandler = () => {
        if (qty && category && salesman) {
            addJob();
            setQty('');
            setCategory('');
            setSalesman('');
            if (isEdit) {
                setSelectCustomer(null)
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Add New Job</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={salesman}
                    onValueChange={setSalesman}
                    style={[styles.picker, styles.flexPicker]}
                >
                    <Picker.Item label="Salesman" value="" />
                    {allSalesman.map((item, index) => (
                        <Picker.Item key={index} label={item.name} value={item.salesman_id} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                    style={[styles.picker, styles.flexPicker]}
                >
                    <Picker.Item label="Category" value="" />
                    <Picker.Item label="C" value="C" />
                    <Picker.Item label="H" value="H" />
                    <Picker.Item label="M" value="M" />
                    <Picker.Item label="T" value="T" />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Qty"
                value={qty}
                onChangeText={text => setQty(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
            />
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
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    picker: {
        height: 50,
        flex: 1,
    },
    flexPicker: {
        marginHorizontal: 4,
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

export default AddJob;
