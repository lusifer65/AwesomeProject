import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Loader from '../../../src/components/Loader';
import { ADD_EXPANCE, BASE_URL, EDIT_EXPANCE } from '../../../src/constant';
import axios from 'axios';

const AddExpance = ({
    setIsUpdateExpression,
    isEdit,
    selectExpence,
    setIsEdit,
}) => {
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(selectExpence);
        if (isEdit && selectExpence) {
            setAmount(selectExpence?.amount.toString());
            setPurpose(selectExpence.purpose);
            setDescription(selectExpence.description);
        }
    }, [isEdit, selectExpence]);

    const addExpanceHandler = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('amount', amount);
        bodyFormData.append('purpose', purpose);
        bodyFormData.append('description', description);
        if (isEdit) {
            bodyFormData.append('slno', selectExpence.slno);
        }

        setLoading(true);
        axios({
            method: 'post',
            url: `${BASE_URL}${isEdit ? EDIT_EXPANCE : ADD_EXPANCE}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                const { message, myData, status } = data;
                if (status == 0) {
                    console.log('Unable to add');
                } else {
                    setIsUpdateExpression(true);
                    console.log('Add Expance Success');
                    ToastAndroid.show(
                        `${isEdit ? 'Edit' : 'Add'} Expance successfully`,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            })
            .finally(() => {
                setLoading(false);
                setIsEdit(false);
            });
    };

    const handleSubmit = () => {
        if (amount && purpose && description) {
            addExpanceHandler();
            setAmount('');
            setPurpose('');
            setDescription('');
        }
    };

    if (loading) {
        <Loader />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Add Expense</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, styles.flexInput]}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={text => setAmount(text)}
                />
                <Picker
                    selectedValue={purpose}
                    style={styles.flexInput}
                    onValueChange={setPurpose}>
                    <Picker.Item label="Purpose" value="" />
                    <Picker.Item label="Grocery" value="Grocery" />
                    <Picker.Item label="Petrol" value="Petrol" />
                    <Picker.Item label="Electric bill" value="Electric bill" />
                    <Picker.Item label="Maintenance" value="Maintenance" />
                    <Picker.Item label="Rent" value="RENT" />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    flexInput: {
        flex: 1,
    },
    picker: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#088',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddExpance;
